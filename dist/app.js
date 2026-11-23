const svgNamespace = "http://www.w3.org/2000/svg";
const selectors = {
  hokkaido: { pin: [504, 91], label: [547, 155], elbow: [534, 149] },
  tohoku: { pin: [429, 211], label: [498, 216], elbow: [476, 210] },
  kanto: { pin: [402, 329], label: [484, 341], elbow: [462, 335] },
  chubu: { pin: [345, 320], label: [240, 271], elbow: [293, 266] },
  kansai: { pin: [270, 362], label: [340, 414], elbow: [316, 409] },
  chugoku: { pin: [181, 368], label: [111, 311], elbow: [164, 306] },
  shikoku: { pin: [212, 403], label: [250, 462], elbow: [227, 457] },
  kyushu: { pin: [122, 444], label: [37, 438], elbow: [91, 433] },
  okinawa: { pin: [168, 183], label: [49, 158], elbow: [117, 153] },
};

const regionPicker = document.getElementById("region-picker");
const regionPanel = document.querySelector(".region-panel");
const japanMap = document.getElementById("japan-map");
const mapCaption = document.getElementById("map-caption-label");
const mapBack = document.getElementById("map-back");
const guideBack = document.getElementById("guide-back");
const nationLayer = document.getElementById("nation-layer");
const mapTerrain = document.getElementById("map-terrain");
const mapLabels = document.getElementById("map-labels");
const prefectureLayer = document.getElementById("prefecture-layer");
const prefectureLand = document.getElementById("prefecture-land");
const prefectureLabels = document.getElementById("prefecture-labels");
const tabs = document.getElementById("category-tabs");
const tabPanel = document.getElementById("tab-panel");
const spotList = document.getElementById("spot-list");
const prefectures = { ...eastGuides, ...westGuides };
const regionControls = {};
const categoryControls = {};
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const requestedRegion = new URLSearchParams(window.location.search).get("region");
let activeRegion = Object.hasOwn(regions, requestedRegion) ? requestedRegion : "kanto";
let activePrefecture = null;
let activeCategory = "sight";
let prefectureControls = {};

function svgElement(tag, attributes) {
  const element = document.createElementNS(svgNamespace, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  return element;
}

function selectRegion(key, focusPrefecture = false) {
  activeRegion = key;
  activePrefecture = null;
  for (const [id, { shape, label, chip }] of Object.entries(regionControls)) {
    const selected = id === key;
    shape.setAttribute("aria-pressed", String(selected));
    label.classList.toggle("is-active", selected);
    chip.setAttribute("aria-pressed", String(selected));
  }
  setMapView(true);
  drawPrefectures(key);
  updateGuide();
  if (focusPrefecture) Object.values(prefectureControls)[0].chip.focus({ preventScroll: true });
}

function selectPrefecture(id, scrollToDetails = false) {
  activePrefecture = id;
  for (const [key, { shape, label, chip }] of Object.entries(prefectureControls)) {
    const selected = key === id;
    shape.setAttribute("aria-pressed", String(selected));
    chip.setAttribute("aria-pressed", String(selected));
    label.classList.toggle("is-active", selected);
  }
  updateGuide();
  if (scrollToDetails && window.matchMedia("(max-width: 700px)").matches) {
    const rect = regionPanel.getBoundingClientRect();
    if (rect.top + 200 > window.innerHeight) {
      regionPanel.scrollIntoView({ block: "start" });
    }
  }
}

function setMapView(zoomed) {
  const region = regions[activeRegion];
  nationLayer.classList.toggle("map-layer-hidden", zoomed);
  prefectureLayer.classList.toggle("map-layer-hidden", !zoomed);
  mapBack.hidden = !zoomed;
  guideBack.hidden = !zoomed;
  mapCaption.textContent = zoomed ? `${region.name} 도도부현` : "일본 전국 지도";
  japanMap.setAttribute("aria-label", zoomed ? `${region.name}의 도도부현` : "일본의 아홉 여행 권역");
  regionPicker.setAttribute("aria-label", zoomed ? "도도부현 목록" : "지역 목록");
}

function showNation() {
  activePrefecture = null;
  setMapView(false);
  if (!reduceMotion.matches) nationLayer.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 300 });
  regionPicker.replaceChildren(...Object.values(regionControls).map(({ chip }) => chip));
  updateGuide();
  regionControls[activeRegion].chip.focus({ preventScroll: true });
}

function updateGuide() {
  const region = regions[activeRegion];
  const guide = prefectures[activePrefecture];
  document.getElementById("region-romaji").textContent = guide && guide.en !== region.en
    ? `${region.en} / ${guide.en}`
    : region.en;
  document.getElementById("region-title").textContent = guide?.name ?? region.name;
  const description = document.getElementById("region-description");
  description.textContent = guide?.ja ?? region.tagline;
  description.lang = guide ? "ja" : "ko";
  renderTab();
}

function renderTab() {
  const prefecture = prefectures[activePrefecture];
  const entries = prefecture ? [prefecture[activeCategory]] : regions[activeRegion][activeCategory];
  tabPanel.setAttribute("aria-labelledby", categoryControls[activeCategory].id);
  spotList.replaceChildren(...entries.map(([name, description, place, query]) => {
    const article = document.createElement("article");
    article.className = "spot";
    if (Object.hasOwn(cardPhotos, name)) article.append(createPhoto(name, cardPhotos[name]));
    const title = document.createElement("h3");
    title.textContent = name;
    const detail = document.createElement("p");
    detail.textContent = description;
    const location = document.createElement("a");
    location.className = "spot-map-link";
    location.href = `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query })}`;
    location.target = "_blank";
    location.rel = "noopener noreferrer";
    const action = activeCategory === "food" ? "맛집 찾기" : "지도 보기";
    location.setAttribute("aria-label", `${name} · ${place} · Google 지도 ${activeCategory === "food" ? action : "열기"} (새 탭)`);
    const pin = svgElement("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" });
    pin.append(
      svgElement("path", { d: "M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z" }),
      svgElement("circle", { cx: 12, cy: 10, r: 2.25 }),
    );
    const locationText = document.createElement("span");
    locationText.textContent = place;
    const actionText = document.createElement("span");
    actionText.className = "spot-link-action";
    actionText.textContent = action;
    location.append(pin, locationText, actionText);
    article.append(title, detail, location);
    return article;
  }));
}

function createPhoto(name, { src, caption, author, source, license, licenseUrl }) {
  const figure = document.createElement("figure");
  figure.className = "spot-picture";
  const image = document.createElement("img");
  image.alt = caption;
  image.width = 960;
  image.height = 540;
  image.loading = "lazy";
  image.decoding = "async";
  image.src = src;
  const credits = document.createElement("figcaption");
  if (caption !== name) {
    const subject = document.createElement("span");
    subject.textContent = caption;
    credits.append(subject);
  }
  const photo = document.createElement("a");
  photo.textContent = author;
  photo.href = source;
  photo.target = "_blank";
  photo.rel = "noopener noreferrer";
  credits.append(photo);
  if (licenseUrl) {
    const licenseLink = photo.cloneNode();
    licenseLink.textContent = license;
    licenseLink.href = licenseUrl;
    credits.append(licenseLink);
  }
  figure.append(image, credits);
  return figure;
}

function selectCategory(key) {
  activeCategory = key;
  for (const [id, button] of Object.entries(categoryControls)) {
    const selected = id === key;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  }
  renderTab();
}

function drawMap() {
  mapTerrain.append(svgElement("rect", { x: 32, y: 130, width: 164, height: 125, class: "island-inset", "aria-hidden": true }));
  for (const [key, region] of Object.entries(regions)) {
    const selected = key === activeRegion;
    const shape = svgElement("path", {
      "class": "map-region", "d": regionPaths[key], "fill-rule": "evenodd", "data-region": key,
      "role": "button", "tabindex": "0", "aria-label": `${region.name} 권역`, "aria-pressed": String(selected),
    });
    const { pin, elbow, label: [x, y] } = selectors[key];
    const label = svgElement("g", { class: "map-label", "aria-hidden": true, "data-label": key });
    const lineEnd = x < elbow[0] ? x + 14 : x - 6;
    const text = svgElement("text", { x, y });
    text.textContent = region.name;
    label.append(
      svgElement("polyline", { points: [pin, elbow, [lineEnd, y - 5]].map(point => point.join(",")).join(" ") }),
      svgElement("circle", { cx: pin[0], cy: pin[1], r: 3 }),
      text,
    );
    label.classList.toggle("is-active", selected);
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "region-chip";
    chip.textContent = region.name;
    chip.dataset.region = key;
    chip.setAttribute("aria-pressed", String(selected));
    for (const control of [shape, label, chip]) {
      control.addEventListener("click", event => selectRegion(key, event.detail === 0));
    }
    shape.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectRegion(key, true);
      }
    });
    label.addEventListener("pointerenter", () => shape.classList.add("is-hovered"));
    label.addEventListener("pointerleave", () => shape.classList.remove("is-hovered"));
    mapTerrain.append(shape);
    mapLabels.append(label);
    regionPicker.append(chip);
    regionControls[key] = { shape, label, chip };
  }
}

function drawPrefectures(region) {
  prefectureControls = {};
  prefectureLand.replaceChildren();
  prefectureLabels.replaceChildren();
  regionPicker.replaceChildren();
  const entries = Object.entries(prefectureShapes).filter(([, shape]) => shape.region === region);

  for (const [id, detail] of entries) {
    const { name, ja } = prefectures[id];
    const shape = svgElement("path", {
      "class": "map-region prefecture-shape", "d": detail.path, "fill-rule": "evenodd",
      "role": "button", "tabindex": "0", "aria-label": name, "aria-pressed": "false", "data-prefecture": id,
    });
    shape.addEventListener("click", event => selectPrefecture(id, event.detail > 0));
    shape.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectPrefecture(id);
      }
    });
    const chip = document.createElement("button");
    chip.className = "region-chip";
    chip.type = "button";
    chip.textContent = name;
    chip.title = ja;
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", event => selectPrefecture(id, event.detail > 0));
    prefectureLand.append(shape);
    regionPicker.append(chip);
    prefectureControls[id] = { shape, chip };
  }

  const bounds = prefectureLand.getBBox();
  const scale = Math.min(7, 614 / bounds.width, 416 / bounds.height);
  const offsetX = 360 - (bounds.x + bounds.width / 2) * scale;
  const offsetY = 284 - (bounds.y + bounds.height / 2) * scale;
  const transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  prefectureLand.style.transform = transform;

  const occupied = [];
  for (const [id, { anchor }] of entries) {
    const name = prefectures[id].name;
    const point = [anchor[0] * scale + offsetX, anchor[1] * scale + offsetY];
    const [x, y] = labelPosition(point, name, occupied);
    const label = svgElement("g", { class: "map-label prefecture-label", "aria-hidden": "true" });
    if (Math.hypot(x - point[0], y - point[1]) > 12) {
      label.append(svgElement("polyline", { points: `${point.join(",")} ${x},${y}` }));
    }
    const text = svgElement("text", { x, y, "text-anchor": "middle", "dominant-baseline": "central" });
    text.textContent = name;
    label.append(text);
    label.addEventListener("click", () => selectPrefecture(id, true));
    prefectureLabels.append(label);
    prefectureControls[id].label = label;
  }

  for (const layer of [prefectureLand, prefectureLabels]) {
    for (const animation of layer.getAnimations()) animation.cancel();
  }
  if (!reduceMotion.matches) {
    prefectureLand.animate([{ transform: "none" }, { transform }], {
      duration: 580, easing: "cubic-bezier(.2,.65,.25,1)",
    });
    prefectureLabels.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 260, delay: 290, fill: "backwards",
    });
  }
}

function labelPosition([anchorX, anchorY], name, occupied) {
  const halfWidth = name.length * 9 + 6;
  const offsets = [[0, 0], [0, -24], [0, 24], [-24, 0], [24, 0], [-28, -26], [28, -26], [-28, 26], [28, 26]];
  const candidates = offsets.map(([dx, dy]) => [
    Math.max(halfWidth + 10, Math.min(710 - halfWidth, anchorX + dx)),
    Math.max(24, Math.min(532, anchorY + dy)),
  ]);
  const position = candidates.find(([x, y]) => occupied.every(([otherX, otherY, otherWidth]) =>
    Math.abs(x - otherX) > halfWidth + otherWidth || Math.abs(y - otherY) > 24
  )) ?? candidates[0];
  occupied.push([...position, halfWidth]);
  return position;
}

function createTabs() {
  const keys = Object.keys(categories);
  for (const [key, label] of Object.entries(categories)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab";
    button.id = `tab-${key}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", "tab-panel");
    button.setAttribute("aria-selected", String(key === activeCategory));
    button.tabIndex = key === activeCategory ? 0 : -1;
    button.textContent = label;
    button.addEventListener("click", () => selectCategory(key));
    button.addEventListener("keydown", event => {
      const index = keys.indexOf(key);
      const next = {
        ArrowRight: (index + 1) % keys.length,
        ArrowLeft: (index - 1 + keys.length) % keys.length,
        Home: 0,
        End: keys.length - 1,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      selectCategory(keys[next]);
      categoryControls[keys[next]].focus();
    });
    tabs.append(button);
    categoryControls[key] = button;
  }
}

const credits = document.getElementById("photo-credits");
for (const [attribution, url, license] of photoCredits) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = attribution;
  item.append(link);
  if (license) {
    const licenseLink = link.cloneNode(false);
    licenseLink.href = license;
    licenseLink.textContent = "CC BY-SA 2.0";
    item.append(" · ", licenseLink);
  }
  credits.append(item);
}
drawMap();
createTabs();
mapBack.addEventListener("click", showNation);
guideBack.addEventListener("click", () => {
  showNation();
  japanMap.closest(".map-card").scrollIntoView({ block: "start" });
});
updateGuide();
