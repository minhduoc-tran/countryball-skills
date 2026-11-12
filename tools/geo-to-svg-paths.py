#!/usr/bin/env python3
"""Build the lon/lat map data for the countryball map kit from Natural Earth (public domain).

Usage: python3 tools/geo-to-svg-paths.py <dir with the geojson files>
  needs in <dir>: ne110.geojson (110m countries), ne50.geojson (50m countries), ne50rivers.geojson,
  ne10.geojson (10m countries), ne10adm1.geojson (10m admin_1), ne10rivers.geojson
  (https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_<scale>_<name>.geojson)
Writes src/countryball/geo-data-{world,region,detail}.ts. Coordinates stay in degrees (camera-friendly) and are
stored as integer milli-degrees: one string per ring/line, "x0 y0 dx dy dx dy ..." (first pair absolute, rest deltas).
Rings are Douglas-Peucker simplified (closed rings are split in two halves so DP has distinct endpoints: a closed
ring has identical first/last points and DP would collapse it).
"""
import json, math, os, sys

OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'countryball')
# Level boxes (lon0, lat0, lon1, lat1). Each level keeps polygons clipped to its box plus a margin.
REGION_BOX = (90.0, -5.0, 150.0, 30.0)
DETAIL_BOX = (102.0, 19.0, 109.0, 23.5)

def simplify(pts, tol):
    """Iterative Douglas-Peucker on [(x, y)]."""
    if len(pts) < 3: return pts
    keep = [False] * len(pts); keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        (ax, ay), (bx, by) = pts[a], pts[b]
        dx, dy = bx - ax, by - ay; n = math.hypot(dx, dy) or 1e-12
        best, idx = 0.0, -1
        for i in range(a + 1, b):
            d = abs(dy * (pts[i][0] - ax) - dx * (pts[i][1] - ay)) / n
            if d > best: best, idx = d, i
        if best > tol and idx > 0:
            keep[idx] = True; stack += [(a, idx), (idx, b)]
    return [p for p, k in zip(pts, keep) if k]

def simplify_ring(ring, tol):
    ring = [tuple(p[:2]) for p in ring]
    if ring[0] == ring[-1]: ring = ring[:-1]
    if len(ring) < 4: return ring
    h = len(ring) // 2
    return simplify(ring[:h + 1], tol)[:-1] + simplify(ring[h:] + [ring[0]], tol)[:-1]

def clip_ring(ring, box):
    """Sutherland-Hodgman clip of a polygon ring to a lon/lat box."""
    x0, y0, x1, y1 = box
    edges = [(lambda p: p[0] >= x0, lambda a, b: (x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0]))),
             (lambda p: p[0] <= x1, lambda a, b: (x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0]))),
             (lambda p: p[1] >= y0, lambda a, b: (a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0)),
             (lambda p: p[1] <= y1, lambda a, b: (a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1))]
    out = [tuple(p[:2]) for p in ring]
    for inside, cut in edges:
        if not out: break
        src, out = out, []
        for i, cur in enumerate(src):
            prev = src[i - 1]
            if inside(cur):
                if not inside(prev): out.append(cut(prev, cur))
                out.append(cur)
            elif inside(prev): out.append(cut(prev, cur))
    return out

def clip_line(line, box):
    """Split a polyline into the runs that lie inside the box."""
    x0, y0, x1, y1 = box
    runs, cur = [], []
    for p in line:
        if x0 <= p[0] <= x1 and y0 <= p[1] <= y1: cur.append(tuple(p[:2]))
        else:
            if len(cur) > 1: runs.append(cur)
            cur = []
    if len(cur) > 1: runs.append(cur)
    return runs

def grow(box, m): return (box[0] - m, box[1] - m, box[2] + m, box[3] + m)

def encode(pts):
    q = [(round(x * 1000), round(y * 1000)) for x, y in pts]
    d = [q[0]] + [p for i, p in enumerate(q[1:], 1) if p != q[i - 1]]
    if len(d) < 2: return ''
    s = [f'{d[0][0]} {d[0][1]}'] + [f'{b[0] - a[0]} {b[1] - a[1]}' for a, b in zip(d, d[1:])]
    return ' '.join(s)

def polys(g): return g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']] if g['type'] == 'Polygon' else []
def lines(g): return g['coordinates'] if g['type'] == 'MultiLineString' else [g['coordinates']]

def polygon_rings(geom, box, tol, min_span, margin):
    """Outer rings of a (multi)polygon, clipped to box (+margin) and simplified. box=None: no clip."""
    out = []
    cb = grow(box, margin) if box else None
    for p in polys(geom):
        ring = p[0]
        xs, ys = [q[0] for q in ring], [q[1] for q in ring]
        if cb and (max(xs) < cb[0] or min(xs) > cb[2] or max(ys) < cb[1] or min(ys) > cb[3]): continue
        if max(max(xs) - min(xs), max(ys) - min(ys)) < min_span: continue
        r = clip_ring(ring, cb) if cb else ring
        if len(r) < 4: continue
        r = simplify_ring(r, tol)
        if len(r) >= 3: out.append(encode(r + [r[0]]))
    return [r for r in out if r]

def country_layer(feats, box, tol, min_span, margin):
    res = {}
    for f in feats:
        code = f['properties']['ADM0_A3']
        if code == 'ATA': continue
        r = polygon_rings(f['geometry'], box, tol, min_span, margin)
        if r: res.setdefault(code, []).extend(r)
    return res

def river_layer(feats, box, tol, names, rename=None):
    res = {}
    for f in feats:
        n = f['properties'].get('name')
        if n not in names: continue
        for ln in lines(f['geometry']):
            for run in clip_line(ln, grow(box, 0.5)):
                e = encode(simplify(run, tol))
                if e: res.setdefault((rename or {}).get(n, n), []).append(e)
    return res

def nearest_on(lines_enc, pt):
    best = None
    for l in lines_enc:
        for p in l:
            d = math.hypot(p[0] - pt[0], p[1] - pt[1])
            if best is None or d < best[0]: best = (d, p)
    return best[1]

def write(name, const, layer):
    path = os.path.join(OUT, f'geo-data-{name}.ts')
    head = f'// Generated by tools/geo-to-svg-paths.py from Natural Earth (public domain). Do not edit by hand.\n' \
           f"import type {{ RawLayer }} from './geo-data';\n// Rings: integer milli-degrees, \"x0 y0 dx dy ...\" (see geo-data.ts).\n"
    with open(path, 'w') as fh:
        fh.write(head + f'export const {const}: RawLayer = ' + json.dumps(layer, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print(name, os.path.getsize(path) // 1024, 'KB')

def main(d):
    load = lambda n: json.load(open(os.path.join(d, n + '.geojson')))['features']
    write('world', 'WORLD_RAW', {'box': [-180, -90, 180, 90], 'countries': country_layer(load('ne110'), None, 0.008, 0.0, 0)})
    rv50 = river_layer(load('ne50rivers'), REGION_BOX, 0.005, ['Mekong', 'Hong'])
    write('region', 'REGION_RAW', {'box': list(REGION_BOX), 'rivers': rv50,
                                   'countries': country_layer(load('ne50'), REGION_BOX, 0.005, 0.02, 2.0)})
    prov = {}
    for f in load('ne10adm1'):
        p = f['properties']
        if p['adm0_a3'] != 'VNM' or p['name_vi'] in ('Vùng Đông Bắc', 'Đồng Bằng Sông Hồng', 'Đông Nam Bộ'): continue
        r = polygon_rings(f['geometry'], DETAIL_BOX, 0.0008, 0.004, 1.0)
        if r: prov[p['name_vi']] = r
    rv10 = river_layer(load('ne10rivers'), DETAIL_BOX, 0.0005, ['Hong', 'Da'])
    # Natural Earth has no Lo / Duong: hand-drawn from map knowledge, ends snapped onto the Red River line.
    def dec(e):
        v = list(map(int, e.split())); x, y, out = v[0], v[1], [(v[0] / 1000, v[1] / 1000)]
        for i in range(2, len(v), 2): x += v[i]; y += v[i + 1]; out.append((x / 1000, y / 1000))
        return out
    red_pts = [dec(e) for e in rv10['Hong']]
    lo = [(104.85, 23.05), (104.98, 22.82), (105.02, 22.45), (105.10, 22.00), (105.22, 21.82), (105.15, 21.62), (105.25, 21.45)]
    lo.append(nearest_on(red_pts, (105.41, 21.31)))
    duong = [nearest_on(red_pts, (105.88, 21.08)), (105.95, 21.115), (106.03, 21.15), (106.10, 21.135), (106.17, 21.12), (106.26, 21.11)]
    rv10['Lo'] = [encode(lo)]; rv10['Duong'] = [encode(duong)]
    write('detail', 'DETAIL_RAW', {'box': list(DETAIL_BOX), 'rivers': rv10, 'provinces': prov,
                                   'countries': country_layer(load('ne10'), DETAIL_BOX, 0.0008, 0.004, 1.0)})

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '/tmp')
