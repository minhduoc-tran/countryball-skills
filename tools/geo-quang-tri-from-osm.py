#!/usr/bin/env python3
"""Build the Quảng Trị map data of the countryball kit from OpenStreetMap (ODbL, (c) OpenStreetMap contributors).

Usage: <venv with shapely>/bin/python tools/geo-quang-tri-from-osm.py <dir with the Overpass json files>
  (python3 -m venv v && v/bin/pip install shapely). Fetch the files with curl -A "<ua>" --data-urlencode "data=<query>"
  https://overpass-api.de/api/interpreter (the server is often busy: retry with backoff). Queries, all `[out:json]`:
    coast    way["natural"="coastline"](15.9,106.0,17.6,108.5);out geom;
    rivers   way["waterway"~"^(river|canal)$"](16.1,106.2,17.4,107.9);out geom tags;
    border   way["boundary"="administrative"]["admin_level"="2"](16.0,106.0,17.6,108.0);out geom tags;
    prov<id> rel(<id>);way(r);out geom qt;      for id in 1895630 (Quảng Trị), 1891483 (Huế), 1891418 (Đà Nẵng)
    town     (way[highway|waterway|"natural"="water"|landuse|building|historic|leisure](16.735,107.15,16.775,107.225);); out geom tags;
  needs in <dir> (Overpass `out geom`):
    coast.json   way["natural"="coastline"]            rivers.json  way["waterway"~"^(river|canal)$"]
    border.json  way[boundary=administrative][admin_level=2]
    prov1895630.json / prov1891483.json / prov1891418.json   rel(<id>);way(r);out geom qt;  (today's provinces:
                 Quảng Trị (= old Quảng Bình + Quảng Trị, merged 2025), Huế (= old Thừa Thiên-Huế), Đà Nẵng (+ Quảng Nam))
    town.json    highway / waterway / natural=water / landuse in bbox 16.735,107.15,16.775,107.225 around the citadel
Writes src/countryball/geo-data-quang-tri.ts (GeoMap level 'quangtri') and src/countryball/citadel-site-data.ts
(metres around the citadel centre for CitadelPlan). Coordinates: integer units, "x0 y0 dx dy ..." strings (see geo-data.ts).
The 1972 provinces are today's polygons cut along the Bến Hải river (the 1954-1975 demarcation line).
"""
import json, math, os, sys
from shapely.geometry import LineString, Point, Polygon, box as sbox, MultiPolygon
from shapely.ops import linemerge, split, unary_union, polygonize

SRC = sys.argv[1] if len(sys.argv) > 1 else '/tmp/qtgeo'
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'countryball')
BOX = (106.0, 16.15, 108.3, 17.65)
SC = 20000            # geo layer units per degree (1 unit ~ 5.5 m)
LAT0, LON0 = 16.7539, 107.1896   # citadel centre (OSM way 1189797496)
KX, KY = 111320 * math.cos(math.radians(LAT0)), 110574.0
P_LAND = Point(106.12, 16.8)     # a point certainly on land (Laos side)

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
def extend(line, k=0.4):
    c = list(line.coords); (ax, ay), (bx, by) = c[1], c[0]; (cx, cy), (dx, dy) = c[-2], c[-1]
    n1 = math.hypot(bx - ax, by - ay) or 1; n2 = math.hypot(dx - cx, dy - cy) or 1
    return LineString([(bx + (bx - ax) / n1 * k, by + (by - ay) / n1 * k)] + c + [(dx + (dx - cx) / n2 * k, dy + (dy - cy) / n2 * k)])

def enc(coords, sc):
    q = [(round(x * sc), round(y * sc)) for x, y in coords]
    d = [q[0]] + [p for i, p in enumerate(q[1:], 1) if p != q[i - 1]]
    if len(d) < 2: return ''
    out = [d[0][0], d[0][1]]
    for i in range(1, len(d)): out += [d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1]]
    return ' '.join(map(str, out))
def enc_poly(p, sc, tol):
    p = p.simplify(tol, preserve_topology=True)
    return [s for s in [enc(list(p.exterior.coords)[:-1], sc)] if s]  # holes ignored (none matter at this scale)

# ---------- land from the OSM coastline ----------
BOXP = sbox(*BOX)
merged = linemerge([LineString(geom(e)) for e in load('coast') if len(geom(e)) > 1], directed=True)
cl = lines_of(merged)
open_lines = [l for l in cl if not l.is_ring]
main = max(open_lines, key=lambda l: l.intersection(BOXP).length)
islands = [Polygon(l) for l in cl if l.is_ring and Polygon(l).intersects(BOXP) and Polygon(l).area > 1e-5]
pieces = polys_of(split(BOXP, extend(main)))
land = [p for p in pieces if p.contains(P_LAND)]
assert land, 'land piece not found'
land = unary_union(land + [i.intersection(BOXP) for i in islands]).buffer(0)
TOL_COAST = 0.00022
# ---------- Vietnam / Laos border ----------
border = linemerge([LineString(geom(e)) for e in load('border') if 'maritime' not in e.get('tags', {}) and len(geom(e)) > 1])
bl = max(lines_of(border), key=lambda l: l.intersection(BOXP).length)
lao_pieces = polys_of(split(land, extend(bl)))
lao = [p for p in lao_pieces if p.contains(P_LAND)]
lao = unary_union(lao).buffer(0)
vnm = land.difference(lao).buffer(0)
# ---------- provinces (today's polygons) ----------
def province(fn):
    ls = [LineString(geom(e)) for e in load(fn) if len(geom(e)) > 1]
    ps = list(polygonize(unary_union(ls)))
    return unary_union(ps).buffer(0)
qt_now, hue, dn = province('prov1895630'), province('prov1891483'), province('prov1891418')
bh = linemerge([LineString(geom(e)) for e in load('rivers') if e['tags'].get('name') == 'Sông Bến Hải'])
bh = lines_of(bh)[0]
if bh.coords[0][0] > bh.coords[-1][0]: bh = LineString(list(bh.coords)[::-1])
bh = LineString([q for q in bh.coords if q[1] >= 16.9675])  # from Bồ Hô (~16.9675N) down to the mouth
c0, c1 = list(bh.coords)[0], list(bh.coords)[-1]
# DMZ cut line: due west from Bồ Hô to beyond the Lao border, Bến Hải to the sea, a little further east
dmz = LineString([(105.6, c0[1])] + list(bh.coords) + [(c1[0] + 0.25, c1[1] + 0.02)])
qt_vn = qt_now.intersection(vnm)
halves = polys_of(split(qt_vn, dmz))
north = unary_union([p for p in halves if p.representative_point().y > dmz.interpolate(dmz.project(p.representative_point())).y or p.representative_point().y > 17.05])
south = qt_vn.difference(north)
provs = {'Quảng Bình': north, 'Quảng Trị': south, 'Thừa Thiên-Huế': hue.intersection(vnm), 'Quảng Nam - Đà Nẵng': dn.intersection(vnm)}
provs = {k: v.intersection(BOXP) for k, v in provs.items()}
dmz_vis = [list(l.coords) for l in sorted(lines_of(linemerge(lines_of(dmz.intersection(vnm)))), key=lambda l: -l.length)]

# ---------- rivers ----------
NAMES = {'ThachHan': 'Sông Thạch Hãn', 'BenHai': 'Sông Bến Hải', 'Hieu': 'Sông Hiếu', 'CamLo': 'Sông Cam Lộ', 'MyChanh': 'Sông Nhùng',
         'AiTu': 'Sông Ái Tử', 'VinhDinh': 'Sông Vĩnh Định', 'OLau': 'Sông Ô Lâu', 'Bo': 'Sông Bồ', 'Huong': 'Sông Hương'}
rv = load('rivers'); rivers = {}
for key, nm in NAMES.items():
    ls = [LineString(geom(e)) for e in rv if e['tags'].get('name') == nm and len(geom(e)) > 1]
    rivers[key] = [l for g in ls for l in lines_of(linemerge(ls).intersection(BOXP))] if ls else []
    rivers[key] = lines_of(linemerge(rivers[key])) if rivers[key] else []
named = set(NAMES.values())
other = [LineString(geom(e)) for e in rv if e['tags'].get('name') not in named and len(geom(e)) > 1]
other = [l.intersection(BOXP) for l in lines_of(linemerge(other))]
other = [l for x in other for l in lines_of(x) if l.length > 0.09]
rivers['Other'] = other

def raw_layer():
    sc = SC
    r = lambda k: json.dumps(k, ensure_ascii=False, separators=(',', ':'))
    countries = {'VNM': [s for p in polys_of(vnm) for s in enc_poly(p, sc, TOL_COAST)], 'LAO': [s for p in polys_of(lao) for s in enc_poly(p, sc, TOL_COAST)]}
    provinces = {k: [s for p in polys_of(v) for s in enc_poly(p, sc, TOL_COAST * 1.5)] for k, v in provs.items()}
    rv_out = {}
    for k, ls in rivers.items():
        tol = 0.0008 if k == 'Other' else 0.00009
        rv_out[k] = [s for l in ls for s in [enc(list(l.simplify(tol).coords), sc)] if s]
    return {'box': list(BOX), 'scale': sc, 'countries': countries, 'provinces': provinces, 'rivers': rv_out}, r

layer, r = raw_layer()
head = ("// Generated by tools/geo-quang-tri-from-osm.py from OpenStreetMap data, (c) OpenStreetMap contributors, ODbL. Do not edit by hand.\n"
        "import type { RawLayer } from './geo-data';\n// Rings: integer units of 1/20000 degree, \"x0 y0 dx dy ...\" (see geo-data.ts). Provinces = 1972 split of today's polygons.\n")
with open(os.path.join(OUT, 'geo-data-quang-tri.ts'), 'w') as f:
    f.write(head + 'export const QUANG_TRI_RAW: RawLayer = ' + r(layer) + ';\n')
    f.write('/** The 1954-1975 demarcation line (Bến Hải river + parallel to Laos), lon/lat pairs, for the DMZ band. */\n')
    f.write('export const DMZ_LINE: [number, number][] = ' + r([[round(x, 4), round(y, 4)] for l in dmz_vis[:1] for x, y in l[::2] + [l[-1]]]) + ';\n')
print('geo-data-quang-tri.ts', os.path.getsize(os.path.join(OUT, 'geo-data-quang-tri.ts')) // 1024, 'KB')
for k, v in layer['rivers'].items(): print(' river', k, len(v), sum(len(s) for s in v))
for k, v in layer['provinces'].items(): print(' prov', k, sum(len(s) for s in v))

# ---------- local site data around the citadel (metres, x east, y south) ----------
def loc(p): return ((p[0] - LON0) * KX, -(p[1] - LAT0) * KY)
W = sbox(-4100, -2500, 3500, 2200)  # local data window (m)
def locline(coords): return LineString([loc(p) for p in coords])
def emit(g, tol):
    out = []
    for l in lines_of(g):
        l = l.simplify(tol)
        if l.length < 12: continue
        s = enc(list(l.coords), 1)
        if s: out.append(s)
    return out
town = load('town')
classes = {'major': ('trunk', 'primary', 'trunk_link', 'primary_link', 'motorway'), 'mid': ('secondary', 'tertiary'),
           'minor': ('residential', 'unclassified', 'living_street')}
roads = {k: [] for k in classes}
for e in town:
    h = e['tags'].get('highway')
    for k, vs in classes.items():
        if h in vs: roads[k].append(locline(geom(e)))
site = {}
for k, ls in roads.items():
    m = linemerge(ls) if ls else None
    g = m.intersection(W) if m is not None else None
    site[k] = emit(g, 1.5 if k == 'major' else 3.5) if g is not None else []
    if k == 'minor': site[k] = [s for s in site[k] if len(s) > 14]
water_poly, canals = [], []
for e in town:
    t = e['tags']
    if t.get('natural') == 'water' and len(e['geometry']) > 3:
        pg = Polygon([loc(p) for p in geom(e)]).buffer(0)
        if pg.is_valid and pg.area > 900:
            for p in polys_of(pg.intersection(W)):
                water_poly.append((t.get('name', ''), enc(list(p.simplify(3).exterior.coords)[:-1], 1)))
    if t.get('waterway') in ('river', 'canal', 'stream') :
        canals.append((t.get('name', ''), t['waterway'], locline(geom(e))))
resi = []
for e in town:
    if e['tags'].get('landuse') == 'residential' and len(e['geometry']) > 3:
        pg = Polygon([loc(p) for p in geom(e)]).buffer(0)
        for p in polys_of(pg.intersection(W)):
            if p.area > 5000: resi.append(enc(list(p.simplify(6).exterior.coords)[:-1], 1))
cit = [e for e in town if e['tags'].get('historic') == 'fort'][0]
cpoly = Polygon([loc(p) for p in geom(cit)])
ang = math.degrees(math.atan2(*(lambda c: (c[1][1] - c[0][1], c[1][0] - c[0][0]))(list(cpoly.minimum_rotated_rectangle.exterior.coords)[2:4]))) % 90
print('citadel centre local', cpoly.centroid, 'angle', ang)
with open(os.path.join(OUT, 'citadel-site-data.ts'), 'w') as f:
    f.write("// Generated by tools/geo-quang-tri-from-osm.py from OpenStreetMap data, (c) OpenStreetMap contributors, ODbL. Do not edit by hand.\n"
            "// Metres around the citadel centre (lon 107.1896, lat 16.7539): x east, y south. Lines/rings: \"x0 y0 dx dy ...\" integer metres.\n")
    f.write('export const SITE_ROADS = ' + r({k: v for k, v in site.items()}) + ';\n')
    f.write('/** Water polygons (Thạch Hãn banks, ponds). name may be empty. */\nexport const SITE_WATER: [string, string][] = ' + r(water_poly) + ';\n')
    f.write('/** Rivers and canals as centre lines: [name, waterway, line]. */\nexport const SITE_WATERWAYS: [string, string, string][] = ' +
            r([[n, w, s] for n, w, l in canals for s in emit(l.intersection(W), 3)]) + ';\n')
    f.write('/** Residential land-use polygons (where houses are placed). */\nexport const SITE_RESIDENTIAL: string[] = ' + r(resi) + ';\n')
print('citadel-site-data.ts', os.path.getsize(os.path.join(OUT, 'citadel-site-data.ts')) // 1024, 'KB', {k: len(v) for k, v in site.items()}, 'water', len(water_poly), 'resi', len(resi))
