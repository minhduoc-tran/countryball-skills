#!/usr/bin/env python3
"""Build the Sài Gòn - Gia Định map level + the Dinh Độc Lập site data of the countryball kit from OpenStreetMap
(ODbL, (c) OpenStreetMap contributors).

Usage: <venv with shapely>/bin/python tools/geo-sai-gon-from-osm.py <dir with the Overpass json files>
  (python3 -m venv v && v/bin/pip install shapely). Fetch with: curl -A "<custom ua, plain curl UA gets 406>" --data-urlencode
  "data=<query>" https://overpass-api.de/api/interpreter (busy server: retry, or use https://overpass.openstreetmap.fr/api/interpreter).
  Queries (B = 10.15,106.15,11.3,107.6), all `[out:json]`, `out geom tags;` unless noted:
    coast   way["natural"="coastline"](10.1,106.1,11.4,107.7);
    rivers  (way["waterway"="river"](B); way["waterway"="canal"]["name"](B););
    roads   way["highway"~"^(motorway|trunk|primary)$"](B);
    wood    way["natural"~"wood|wetland"](10.15,106.6,10.8,107.6);            (mangrove = wetland=mangrove)
    streets way["highway"~"^(secondary|tertiary)$"](10.70,106.58,10.90,106.84);           (inner-city street texture, class 'Street')
    urban   way["landuse"~"^(residential|commercial|industrial|retail)$"](B);   (out geom; without tags)
    palace  (way[highway](P); way[building](10.7745,106.6925,10.78,106.7); way[barrier~"fence|wall|gate"](10.7745,106.6925,10.78,106.699);
             node[barrier=gate](same); way[leisure~"park|garden|pitch"](P); way[landuse~"grass|recreation_ground"](P);
             way[natural=water](P); way[amenity=fountain](P);)   with P = 10.768,106.689,10.787,106.704
    places  (node[place~"city|town|village|suburb|quarter|hamlet|neighbourhood"](B);)  `out;` (only used to cross-check SAIGON_SITES)
Writes src/countryball/geo-data-sai-gon.ts (GeoMap level 'saigon') and src/countryball/palace-site-data.ts (metres around the
palace for PalacePlan). Strings: integer units, "x0 y0 dx dy ..." (see geo-data.ts). Roads are TODAY's network filtered to the
trunk roads that already existed in 1975 (QL1 / Xa lộ Biên Hòa, QL4 = today's QL1 south-west, QL13, QL22, QL15 = today's QL51, QL20).
"""
import json, math, os, sys
from shapely.geometry import LineString, LinearRing, Point, Polygon, box as sbox
from shapely.ops import linemerge, unary_union, polygonize

SRC = sys.argv[1] if len(sys.argv) > 1 else '/tmp/sggeo'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'countryball')
BOX = (106.2, 10.2, 107.55, 11.25)
SC = 20000            # 1 unit = 1/20000 degree (~5.5 m)
BOXP = sbox(*BOX)
CENTRAL = sbox(106.58, 10.68, 106.86, 10.92)   # inner city: arterial streets are kept here only

def load(n): return json.load(open(os.path.join(SRC, n + '.json')))['elements']
def geom(e): return [(p['lon'], p['lat']) for p in e['geometry']]
def lines_of(g):
    if g.is_empty: return []
    if g.geom_type == 'LineString': return [g]
    return [x for s in getattr(g, 'geoms', []) for x in lines_of(s)]
def polys_of(g):
    if g.is_empty: return []
    if g.geom_type == 'Polygon': return [g]
    return [x for s in getattr(g, 'geoms', []) for x in polys_of(s)]
def enc(coords, sc):
    q = [(round(x * sc), round(y * sc)) for x, y in coords]
    d = [q[0]] + [p for i, p in enumerate(q[1:], 1) if p != q[i - 1]]
    if len(d) < 2: return ''
    out = [d[0][0], d[0][1]]
    for i in range(1, len(d)): out += [d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1]]
    return ' '.join(map(str, out))
def enc_poly(p, sc, tol):
    p = p.simplify(tol, preserve_topology=True)
    return [s for s in [enc(list(p.exterior.coords)[:-1], sc)] if s]
J = lambda k: json.dumps(k, ensure_ascii=False, separators=(',', ':'))

# ---------- land from the OSM coastline (land is on the LEFT of an OSM coastline way) ----------
coast = [l for g in [linemerge([LineString(geom(e)) for e in load('coast') if len(geom(e)) > 1], directed=True)] for l in lines_of(g)]
open_c = [l.intersection(BOXP) for l in coast if not l.is_ring]
open_c = [x for g in open_c for x in lines_of(g) if x.length > 1e-4]
def left_of_coast(pt):
    best, side = 1e9, 0
    for l in open_c:
        c = list(l.coords)
        for a, b in zip(c, c[1:]):
            dx, dy = b[0] - a[0], b[1] - a[1]; L = dx * dx + dy * dy or 1e-12
            t = max(0, min(1, ((pt.x - a[0]) * dx + (pt.y - a[1]) * dy) / L)); d = math.hypot(pt.x - a[0] - t * dx, pt.y - a[1] - t * dy)
            if d < best: best, side = d, dx * (pt.y - a[1]) - dy * (pt.x - a[0])
    return side > 0
cells = list(polygonize(unary_union([BOXP.boundary] + open_c)))
land = unary_union([c for c in cells if left_of_coast(c.representative_point())]).buffer(0)
for l in coast:                                   # closed rings: islands (CCW) add, lakes (CW) cut
    if l.is_ring and Polygon(l).intersects(BOXP) and Polygon(l).area > 2e-6:
        pg = Polygon(l).intersection(BOXP)
        land = land.union(pg) if LinearRing(l.coords).is_ccw else land.difference(pg)
land = land.buffer(0)
assert land.area > 0.3 * BOXP.area, 'land not found'
TOL_COAST = 0.00018

# ---------- rivers ----------
NAMES = {'SaiGon': 'Sông Sài Gòn', 'DongNai': 'Sông Đồng Nai', 'NhaBe': 'Sông Nhà Bè', 'SoaiRap': 'Sông Soài Rạp', 'LongTau': 'Sông Lòng Tàu',
         'ThiVai': 'Sông Thị Vải', 'VamCoDong': 'Sông Vàm Cỏ Đông', 'VamCoTay': 'Sông Vàm Cỏ Tây', 'VamCo': 'Sông Vàm Cỏ', 'Be': 'Sông Bé',
         'CanGiuoc': 'Sông Cần Giuộc', 'DongTranh': 'Sông Đồng Tranh', 'NgaBay': 'Sông Ngã Bảy', 'Dua': 'Sông Dừa', 'BenLuc': 'Sông Bến Lức',
         'GoGia': 'Sông Gò Gia', 'ThiTinh': 'Sông Thị Tính', 'ThiNghe': 'Kênh Thị Nghè', 'BenNghe': 'Kênh Bến Nghé', 'TauHu': 'Kênh Tàu Hủ'}
rv = load('rivers'); rivers = {}
for key, nm in NAMES.items():
    ls = [LineString(geom(e)) for e in rv if e['tags'].get('name') == nm and len(geom(e)) > 1]
    m = linemerge(ls).intersection(BOXP) if ls else None
    rivers[key] = [l for l in lines_of(m)] if m is not None else []
named = set(NAMES.values())
other = [LineString(geom(e)) for e in rv if e['tags'].get('name') not in named and e['tags'].get('waterway') == 'river' and len(geom(e)) > 1]
rivers['Other'] = [l for x in lines_of(linemerge(other).intersection(BOXP)) for l in [x] if l.length > 0.05]

# ---------- roads (1975-relevant trunk roads + inner-city arterials) ----------
REFS = {'QL.1': 'QL1', 'QL.13': 'QL13', 'QL.22': 'QL22', 'QL.51': 'QL15', 'QL.20': 'QL20'}
roads = {'QL1': [], 'QL13': [], 'QL22': [], 'QL15': [], 'QL20': [], 'Arterial': [], 'Street': []}
STREETS_BOX = sbox(106.60, 10.70, 106.82, 10.90)
for e in load('roads'):
    t = e['tags']; refs = [r.strip() for r in t.get('ref', '').split(';')]; ln = LineString(geom(e)) if len(geom(e)) > 1 else None
    if ln is None: continue
    hit = [REFS[r] for r in refs if r in REFS]
    if hit and t['highway'] in ('trunk', 'primary'): roads[hit[0]].append(ln)
    elif t['highway'] in ('trunk', 'primary') and not any(r.startswith('CT.') for r in refs) and ln.intersects(CENTRAL): roads['Arterial'].append(ln)
try:
    for e in load('streets'):
        if len(geom(e)) > 1: roads['Street'].append(LineString(geom(e)))
except FileNotFoundError:
    pass
road_out = {}
for k, ls in roads.items():
    m = linemerge(ls) if ls else None
    g = m.intersection({'Arterial': CENTRAL, 'Street': STREETS_BOX}.get(k, BOXP)) if m is not None else None
    tol = {'Arterial': 0.0003, 'Street': 0.00025}.get(k, 0.00018)
    road_out[k] = [s for l in (lines_of(g) if g is not None else []) if l.length > {'Arterial': 0.004, 'Street': 0.003}.get(k, 0.01) for s in [enc(list(l.simplify(tol).coords), SC)] if s]

# ---------- areas: mangrove (Cần Giờ) and urban footprint ----------
wood = load('wood')
mg = unary_union([Polygon(geom(e)).buffer(0) for e in wood if e['tags'].get('wetland') == 'mangrove' and len(geom(e)) > 3]).buffer(0.0006).buffer(-0.0004)
mg = mg.intersection(land).intersection(BOXP)
areas = {'Mangrove': [s for p in polys_of(mg) if p.area > 4e-6 for s in enc_poly(p, SC, 0.0004)]}
try:
    ub = unary_union([Polygon(geom(e)).buffer(0) for e in load('urban') if len(geom(e)) > 3]).buffer(0.0022).buffer(-0.0016)
    ub = ub.intersection(land).intersection(BOXP)
    areas['Urban'] = [s for p in polys_of(ub) if p.area > 3e-5 for s in enc_poly(p, SC, 0.0006)]
except FileNotFoundError:
    areas['Urban'] = []

def raw_layer():
    rv_out = {}
    for k, ls in rivers.items():
        tol = 0.0007 if k == 'Other' else 0.00012
        rv_out[k] = [s for l in ls for s in [enc(list(l.simplify(tol).coords), SC)] if s]
    return {'box': list(BOX), 'scale': SC, 'countries': {'VNM': [s for p in polys_of(land) for s in enc_poly(p, SC, TOL_COAST)]},
            'rivers': rv_out, 'roads': road_out, 'areas': areas}

layer = raw_layer()
head = ("// Generated by tools/geo-sai-gon-from-osm.py from OpenStreetMap data, (c) OpenStreetMap contributors, ODbL. Do not edit by hand.\n"
        "import type { RawLayer } from './geo-data';\n// Strings: integer units of 1/20000 degree, \"x0 y0 dx dy ...\" (see geo-data.ts). Roads = today's trunk roads that existed in 1975.\n")
path = os.path.join(OUT, 'geo-data-sai-gon.ts')
open(path, 'w').write(head + 'export const SAI_GON_RAW: RawLayer = ' + J(layer) + ';\n')
print('geo-data-sai-gon.ts', os.path.getsize(path) // 1024, 'KB; rivers', {k: sum(map(len, v)) for k, v in layer['rivers'].items() if v},
      'roads', {k: sum(map(len, v)) for k, v in layer['roads'].items()}, 'areas', {k: sum(map(len, v)) for k, v in layer['areas'].items()})

# ================= Dinh Độc Lập site: metres around the palace (x east, y south) =================
P = load('palace'); WAY = {e['id']: e for e in P if e['type'] == 'way'}
pal = WAY[39598493]                                   # OSM way "Dinh Độc Lập" (building=palace)
pg = [(p['lon'], p['lat']) for p in pal['geometry']]
LON0, LAT0 = sum(x for x, y in pg[:-1]) / (len(pg) - 1), sum(y for x, y in pg[:-1]) / (len(pg) - 1)
KX, KY = 111320 * math.cos(math.radians(LAT0)), 110574.0
loc = lambda lo, la: ((lo - LON0) * KX, -(la - LAT0) * KY)
locs = lambda e: [loc(p['lon'], p['lat']) for p in e['geometry']]
R = 1000; WIN = sbox(-R, -R, R, R)
grounds = Polygon(locs(WAY[37911494]))                 # the perimeter fence of the palace grounds
HALF = 2                                               # units per metre in the strings (half metres)
def eline(l, tol): l = l.simplify(tol); return enc(list(l.coords), HALF) if l.length > 4 else ''
road_cls = {'major': ('trunk', 'primary', 'secondary', 'primary_link', 'secondary_link', 'trunk_link'), 'mid': ('tertiary', 'residential', 'busway', 'unclassified'), 'minor': ('service',), 'path': ('footway', 'pedestrian', 'steps', 'path')}
pr = {k: [] for k in ('major', 'mid', 'minor', 'path', 'garden')}
for e in P:
    h = e.get('tags', {}).get('highway')
    if e['type'] != 'way' or not h or len(e['geometry']) < 2: continue
    ln = LineString(locs(e)).intersection(WIN)
    for l in lines_of(ln):
        if l.length < 4: continue
        inside = grounds.contains(l.interpolate(0.5, normalized=True))
        if inside and h in ('service', 'footway', 'pedestrian', 'steps', 'path'): pr['garden'].append(l); continue
        for k, vs in road_cls.items():
            if h in vs: pr[k].append(l)
palace_roads = {k: [s for l in (lines_of(linemerge(v)) if v else []) for s in [eline(l, 0.8)] if s] for k, v in pr.items()}
def polys_with(pred, tol=0.8, minarea=30):
    out = []
    for e in P:
        t = e.get('tags', {})
        if e['type'] == 'way' and pred(t) and len(e['geometry']) > 3:
            pg2 = Polygon(locs(e)).buffer(0)
            for p in polys_of(pg2.intersection(WIN)):
                if p.area > minarea: out.append((t.get('name', ''), enc(list(p.simplify(tol).exterior.coords)[:-1], HALF)))
    return out
green = [s for _, s in polys_with(lambda t: t.get('leisure') in ('park', 'garden') or t.get('landuse') in ('grass', 'recreation_ground'))]
water = [s for _, s in polys_with(lambda t: t.get('natural') == 'water' or t.get('amenity') == 'fountain', 0.5, 10)]
LAND = ('Nhà thờ Đức Bà Sài Gòn', 'Bưu điện Trung tâm Sài Gòn', 'Bảo tàng Thành phố Hồ Chí Minh', 'Trưng bày Từ Dinh Norodom đến Dinh Độc Lập')
landmarks = [[n, s] for n, s in polys_with(lambda t: t.get('name') in LAND, 0.6) if n]
bld = [s for n, s in polys_with(lambda t: 'building' in t and t.get('building') != 'palace' and t.get('name') not in LAND, 0.8, 25)]
gates = [[round(x), round(y), (e.get('tags', {}).get('access') or '')] for e in P if e['type'] == 'node' and e.get('tags', {}).get('barrier') == 'gate'
         for x, y in [loc(e['lon'], e['lat'])] if abs(x) < 400 and abs(y) < 400]
plan_pts = list(pal['geometry'])
site = {'origin': [round(LON0, 6), round(LAT0, 6)], 'grounds': enc(list(grounds.exterior.coords)[:-1], HALF), 'building': enc([loc(p['lon'], p['lat']) for p in plan_pts][:-1], HALF)}
path = os.path.join(OUT, 'palace-site-data.ts')
with open(path, 'w') as f:
    f.write("// Generated by tools/geo-sai-gon-from-osm.py from OpenStreetMap data, (c) OpenStreetMap contributors, ODbL. Do not edit by hand.\n"
            "// Metres around the centre of the Dinh Độc Lập building: x east, y south. Strings \"x0 y0 dx dy ...\" in HALF metres (divide by 2).\n"
            "// Today's streets and buildings (the 1975 street grid inside Q1 is the same; many tall buildings around are newer).\n")
    f.write('export const PALACE_ORIGIN: [number, number] = ' + J(site['origin']) + ';\n')
    f.write('/** perimeter fence of the grounds and the OSM footprint of the palace */\nexport const PALACE_GROUNDS = ' + J(site['grounds']) + ';\nexport const PALACE_BUILDING = ' + J(site['building']) + ';\n')
    f.write('export const PALACE_ROADS = ' + J(palace_roads) + ';\nexport const PALACE_GREEN: string[] = ' + J(green) + ';\nexport const PALACE_WATER: string[] = ' + J(water) + ';\n')
    f.write('export const PALACE_BUILDINGS: string[] = ' + J(bld) + ';\n/** named landmark footprints [name, ring] */\nexport const PALACE_LANDMARKS: [string, string][] = ' + J(landmarks) + ';\n')
    f.write('/** OSM barrier=gate nodes [x, y, access] */\nexport const PALACE_GATES: [number, number, string][] = ' + J(gates) + ';\n')
print('palace-site-data.ts', os.path.getsize(path) // 1024, 'KB; origin', site['origin'], {k: len(v) for k, v in palace_roads.items()}, 'green', len(green), 'bld', len(bld), 'landmarks', [n for n, _ in landmarks], 'gates', len(gates))
