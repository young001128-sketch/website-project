const fs = require("node:fs");

// Run with the path to japan.geojson from https://github.com/dataofjapan/land.
const source = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const prefectureGroups = {
  hokkaido: [1],
  tohoku: [2, 3, 4, 5, 6, 7],
  kanto: [8, 9, 10, 11, 12, 13, 14],
  chubu: [15, 16, 17, 18, 19, 20, 21, 22, 23],
  kansai: [24, 25, 26, 27, 28, 29, 30],
  chugoku: [31, 32, 33, 34, 35],
  shikoku: [36, 37, 38, 39],
  kyushu: [40, 41, 42, 43, 44, 45, 46],
  okinawa: [47],
};

function project([lon, lat], inset) {
  return inset
    ? [(lon - 122.7) * 25 + 43, (27.4 - lat) * 25 + 161]
    : [(lon - 128.3) * 32 + 44, (45.8 - lat) * 32 + 16];
}

function area(points) {
  return Math.abs(points.slice(1).reduce((total, [x, y], index) => {
    const [previousX, previousY] = points[index];
    return total + previousX * y - x * previousY;
  }, 0)) / 2;
}

function distanceFromSegment([x, y], [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const length = dx * dx + dy * dy;
  const t = length ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / length)) : 0;
  return Math.hypot(x - ax - t * dx, y - ay - t * dy);
}

function simplify(points, tolerance) {
  const last = points.length - 1;
  let farthest = 0;
  let at = 0;
  for (let i = 1; i < last; i++) {
    const distance = distanceFromSegment(points[i], points[0], points[last]);
    if (distance > farthest) {
      farthest = distance;
      at = i;
    }
  }
  if (farthest < tolerance) return [points[0], points[last]];
  return simplify(points.slice(0, at + 1), tolerance).slice(0, -1).concat(simplify(points.slice(at), tolerance));
}

function ringPath(points, minimumArea, tolerance) {
  if (area(points) < minimumArea) return "";
  const simplified = simplify(points, tolerance).slice(0, -1);
  if (simplified.length < 3) return "";
  return "M" + simplified.map(point => point.map(value => Number(value.toFixed(1))).join(" ")).join("L") + "Z";
}

function polygonsFor(feature, inset) {
  const geometry = feature.geometry;
  const polygons = geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];
  return polygons.filter(([coastline]) =>
    coastline.every(([lon, lat]) => inset ? lon < 129.3 && lat < 28.1 : lon < 146 && lat > 29.3)
  ).map(rings => rings.map(ring => ring.map(point => project(point, inset))));
}

function polygonPath([coastline, ...holes], minimumArea, tolerance) {
  const path = ringPath(coastline, minimumArea, tolerance);
  return path ? path + holes.map(ring => ringPath(ring, minimumArea, tolerance)).join("") : "";
}

function containsPoint(ring, [x, y]) {
  let inside = false;
  for (let i = 1; i < ring.length; i++) {
    const [ax, ay] = ring[i - 1];
    const [bx, by] = ring[i];
    if ((ay > y) !== (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) inside = !inside;
  }
  return inside;
}

function labelAnchor(coastline) {
  const ring = simplify(coastline, 0.35);
  const xs = ring.map(([x]) => x);
  const ys = ring.map(([, y]) => y);
  const left = Math.min(...xs), top = Math.min(...ys);
  const width = Math.max(...xs) - left, height = Math.max(...ys) - top;
  let anchor = [left + width / 2, top + height / 2];
  let clearance = 0;
  for (let row = 1; row < 16; row++) {
    for (let column = 1; column < 16; column++) {
      const point = [left + width * column / 16, top + height * row / 16];
      if (!containsPoint(ring, point)) continue;
      let distance = Infinity;
      for (let i = 1; i < ring.length; i++) {
        distance = Math.min(distance, distanceFromSegment(point, ring[i - 1], ring[i]));
      }
      if (distance > clearance) {
        clearance = distance;
        anchor = point;
      }
    }
  }
  return anchor.map(number => Number(number.toFixed(1)));
}

const paths = {};
const prefectureShapes = {};
for (const [region, ids] of Object.entries(prefectureGroups)) {
  const inset = region === "okinawa";
  const features = source.features.filter(feature => ids.includes(feature.properties.id));
  paths[region] = features.flatMap(feature => polygonsFor(feature, inset))
    .map(polygon => polygonPath(polygon, 0.85, 0.55)).join("");
  for (const feature of features) {
    const id = feature.properties.id;
    const polygons = polygonsFor(feature, inset).sort((a, b) => area(b[0]) - area(a[0]));
    const anchor = labelAnchor(polygons[0][0]);
    const detail = id === 13
      ? polygons.filter(([ring]) => ring.some(([, y]) => y < 380))
      : polygons;
    prefectureShapes[id] = {
      region,
      path: detail.map(polygon => polygonPath(polygon, 0.28, 0.22)).join(""),
      anchor,
    };
  }
}

fs.writeFileSync("dist/assets/regions.js",
  "// Simplified prefectural boundaries from https://github.com/dataofjapan/land (GSI).\nconst regionPaths = " +
  JSON.stringify(paths, null, 2) + ";\n");
fs.writeFileSync("dist/assets/prefecture-shapes.js",
  "// Simplified prefecture paths and interior label anchors from Data of Japan (GSI).\nconst prefectureShapes = " +
  JSON.stringify(prefectureShapes, null, 2) + ";\n");
