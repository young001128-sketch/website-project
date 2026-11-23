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

function simplify(points) {
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
  if (farthest < 0.55) return [points[0], points[last]];
  return simplify(points.slice(0, at + 1)).slice(0, -1).concat(simplify(points.slice(at)));
}

function ringPath(ring, isInset) {
  const points = ring.map(point => project(point, isInset));
  if (area(points) < 0.85) return "";
  const simplified = simplify(points).slice(0, -1);
  if (simplified.length < 3) return "";
  return "M" + simplified.map(point => point.map(value => Number(value.toFixed(1))).join(" ")).join("L") + "Z";
}

const paths = {};
for (const [region, ids] of Object.entries(prefectureGroups)) {
  const inset = region === "okinawa";
  paths[region] = source.features.filter(feature => ids.includes(feature.properties.id)).flatMap(({ geometry }) =>
    geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates]
  ).filter(([coastline]) =>
    coastline.every(([lon, lat]) => inset ? lon < 129.3 && lat < 28.1 : lon < 146 && lat > 29.3)
  ).map(([coastline, ...holes]) => {
    const path = ringPath(coastline, inset);
    return path ? path + holes.map(ring => ringPath(ring, inset)).join("") : "";
  }).join("");
}

fs.writeFileSync("dist/assets/regions.js",
  "// Simplified prefectural boundaries from https://github.com/dataofjapan/land (GSI).\nconst regionPaths = " +
  JSON.stringify(paths, null, 2) + ";\n");
