#!/usr/bin/env python3
"""Build the Tây Nam / Indochina map level (countryball kit) from Natural Earth 10m (public domain, no credit needed).

Usage: python3 tools/geo-tay-nam-from-natural-earth.py <dir>
  needs in <dir> (https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/<name>.geojson):
    ne_10m_admin_0_countries, ne_10m_admin_1_states_provinces, ne_10m_rivers_lake_centerlines, ne_10m_lakes, ne_10m_minor_islands
Writes src/countryball/geo-data-tay-nam.ts (level 'taynam', box lon 97..115 / lat 4..24 = Indochina + Gulf of Thailand + Hoàng Sa sea):
  countries  10m coast + borders (1978 VN-KHM-THA-LAO borders = today's), Phú Quốc, Thổ Chu, Koh Kong, Koh Chang... (minor islands added)
  provinces  KHM admin-1 (keys = English names, see KHM_PROVINCE_VI in geo-tay-nam-sites.ts) + southern VN provinces (name_vi)
  rivers     Mekong (Tiền arm to the sea), Bassac (Hậu), TonleSap, CoChien, HamLuong (hand-laid, approximate), Kong, Srepok, Mun, ChaoPhraya
  areas      Lake = Biển Hồ (Tonlé Sap, NE dry-season outline)
  borders    VN-KHM border runs per VN province ('Tây Ninh', 'An Giang', 'Kiên Giang', 'Long An', 'Đồng Tháp', 'Bình Phước', ...)
NE 10m names both Mekong arms 'Mekong': the arm through Châu Đốc / Long Xuyên / Cần Thơ is the Bassac (sông Hậu) and is renamed here.
NE stops both arms ~40-60 km before the sea: the mouths are hand-laid from map knowledge (approximate, +-3 km).
"""
import importlib.util, json, math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('g2s', os.path.join(HERE, 'geo-to-svg-paths.py'))
g2s = importlib.util.module_from_spec(spec); spec.loader.exec_module(g2s)
OUT = os.path.join(HERE, '..', 'src', 'countryball', 'geo-data-tay-nam.ts')
BOX = (97.0, 4.0, 115.0, 24.0)

# hand-laid river mouths / delta arms (lon, lat), approximate
TIEN_MOUTH = [(106.42, 10.32), (106.5, 10.31), (106.58, 10.28), (106.66, 10.245), (106.74, 10.21)]
HAU_MOUTH = [(105.84, 10.0), (105.93, 9.9), (106.02, 9.8), (106.11, 9.71), (106.2, 9.63), (106.29, 9.56)]
CO_CHIEN = [(105.98, 10.27), (106.06, 10.17), (106.15, 10.08), (106.26, 9.99), (106.38, 9.91), (106.5, 9.84), (106.6, 9.79)]
HAM_LUONG = [(106.2, 10.24), (106.3, 10.16), (106.4, 10.09), (106.5, 10.02), (106.6, 9.96), (106.68, 9.92)]
KHM_SKIP = set()

def pts_of(geom):
    out = []
    def it(c):
        if not c: return
        if isinstance(c[0], (int, float)): out.append(c)
        else:
            for x in c: it(x)
    it(geom['coordinates']); return out

def main(d):
    load = lambda n: json.load(open(os.path.join(d, n + '.geojson')))['features']
    countries = load('ne_10m_admin_0_countries')
    layer = {'box': list(BOX)}
    layer['countries'] = g2s.country_layer(countries, BOX, 0.0015, 0.008, 1.0)
    # minor islands (Thổ Chu, Nam Du, Hòn Khoai, Koh Tao...): no country attribute, assign by position
    for f in load('ne_10m_minor_islands'):
        p = pts_of(f['geometry'])
        if not p: continue
        x, y = p[0]
        if not (99.5 <= x <= 110.5 and 6 <= y <= 17.5): continue  # Gulf of Thailand + VN coast (not the Andaman Sea)
        code = 'VNM' if (x > 103.3 and y < 10.5) or x > 106 else 'THA'
        r = g2s.polygon_rings(f['geometry'], BOX, 0.0008, 0.0, 0.5)
        if r: layer['countries'].setdefault(code, []).extend(r); print('minor island', code, round(x, 2), round(y, 2))

    # rivers: split the two NE 'Mekong' arms below Phnom Penh, rename the Châu Đốc arm to Bassac
    rv = {}
    def add(name, run, tol=0.0012):
        e = g2s.encode(g2s.simplify([tuple(q[:2]) for q in run], tol))
        if e: rv.setdefault(name, []).append(e)
    keep = {'Mekong': 'Mekong', 'Tonle Sap': 'TonleSap', 'Kong': 'Kong', 'Srepok': 'Srepok', 'Mun': 'Mun', 'Chao Phraya': 'ChaoPhraya'}
    for f in load('ne_10m_rivers_lake_centerlines'):
        p = f['properties']; n = p.get('name')
        if p.get('featurecla') == 'Lake Centerline': continue
        for ln in g2s.lines(f['geometry']):
            for run in g2s.clip_line(ln, g2s.grow(BOX, 0.5)):
                if n == 'Mekong':
                    # the Bassac arm leaves Phnom Penh south-west and passes Châu Đốc (105.12, 10.70)
                    bass = any(abs(q[0] - 105.13) < 0.06 and abs(q[1] - 10.72) < 0.06 for q in run)
                    add('Bassac' if bass else 'Mekong', run)
                elif n in keep: add(keep[n], run)
                elif not n and p.get('scalerank') == 5 and 105.9 < run[0][0] < 106.5 and 10.2 < run[0][1] < 10.4: add('Mekong', run)
    for name, line in (('Mekong', TIEN_MOUTH), ('Bassac', HAU_MOUTH), ('CoChien', CO_CHIEN), ('HamLuong', HAM_LUONG)):
        add(name, line, 0.0)
    layer['rivers'] = rv
    lakes = [g2s.polygon_rings(f['geometry'], BOX, 0.001, 0.05, 0.5) for f in load('ne_10m_lakes') if f['properties'].get('name') == 'Tonlé Sap']
    layer['areas'] = {'Lake': [r for rs in lakes for r in rs]}

    # provinces: all of Cambodia + Vietnam south of 16 N
    prov, vn_raw = {}, {}
    for f in load('ne_10m_admin_1_states_provinces'):
        p = f['properties']
        if p['adm0_a3'] == 'KHM': key = p['name_en'] if p['name_en'] != 'Kam' else 'Kampong Speu'
        elif p['adm0_a3'] == 'VNM' and p['latitude'] < 16 and p['name_vi'] != 'Đông Nam Bộ': key = p['name_vi']; vn_raw[key] = f['geometry']
        else: continue
        r = g2s.polygon_rings(f['geometry'], BOX, 0.0012, 0.004, 1.0)
        if r: prov[key] = r
    layer['provinces'] = prov

    # VN-KHM border runs per VN province: province ring vertices that lie on the Cambodian outline (NE shares the vertices)
    khm = [f for f in countries if f['properties']['ADM0_A3'] == 'KHM'][0]['geometry']
    kset = {(round(q[0], 5), round(q[1], 5)) for q in pts_of(khm)}
    borders = {}
    for name, geom in vn_raw.items():
        for poly in g2s.polys(geom):
            ring = [tuple(q[:2]) for q in poly[0]]
            on = [(round(q[0], 5), round(q[1], 5)) in kset for q in ring]
            if sum(on) < 5: continue
            # rotate so the ring starts off the border, then collect consecutive on-border runs
            s = on.index(False) if False in on else 0
            ring, on = ring[s:] + ring[:s], on[s:] + on[:s]
            run = []
            for q, o in zip(ring + [ring[0]], on + [on[0]]):
                if o: run.append(q)
                elif len(run) > 4: borders.setdefault(name, []).append(g2s.encode(g2s.simplify(run, 0.001))); run = []
                else: run = []
            if len(run) > 4: borders.setdefault(name, []).append(g2s.encode(g2s.simplify(run, 0.001)))
    layer['borders'] = borders
    print('border runs:', {k: len(v) for k, v in borders.items()})
    head = '// Generated by tools/geo-tay-nam-from-natural-earth.py from Natural Earth 10m (public domain). Do not edit by hand.\n' \
           "import type { RawLayer } from './geo-data';\n// Rings: integer milli-degrees, \"x0 y0 dx dy ...\" (see geo-data.ts).\n"
    with open(OUT, 'w') as fh:
        fh.write(head + 'export const TAY_NAM_RAW: RawLayer = ' + json.dumps(layer, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print('taynam', os.path.getsize(OUT) // 1024, 'KB')

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '/tmp/ne-tn')
