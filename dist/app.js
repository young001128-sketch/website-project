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
const regionPicture = document.getElementById("region-picture");
const mapTerrain = document.getElementById("map-terrain");
const mapLabels = document.getElementById("map-labels");
const tabs = document.getElementById("category-tabs");
const spotList = document.getElementById("spot-list");
const regionControls = {};
const categoryControls = {};
const requestedRegion = new URLSearchParams(window.location.search).get("region");
let activeRegion = Object.hasOwn(regions, requestedRegion) ? requestedRegion : "kanto";
let activeCategory = "sight";

function svgElement(tag, attributes) {
  const element = document.createElementNS(svgNamespace, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  return element;
}

function selectRegion(key, scrollToDetails = false) {
  activeRegion = key;
  const region = regions[key];
  for (const [id, { shape, label, chip }] of Object.entries(regionControls)) {
    const selected = id === key;
    shape.setAttribute("aria-pressed", String(selected));
    label.classList.toggle("is-active", selected);
    chip.setAttribute("aria-pressed", String(selected));
  }
  document.getElementById("region-romaji").textContent = region.en;
  document.getElementById("region-title").textContent = region.name;
  document.getElementById("region-description").textContent = region.tagline;
  regionPicture.style.backgroundImage = `url("assets/${region.photo}.jpg")`;
  regionPicture.classList.remove("is-changing");
  regionPicture.getBoundingClientRect();
  regionPicture.classList.add("is-changing");
  renderSpots();
  if (scrollToDetails && window.matchMedia("(max-width: 700px)").matches) {
    const rect = regionPanel.getBoundingClientRect();
    if (rect.top + 200 > window.innerHeight) {
      regionPanel.scrollIntoView({ block: "start" });
    }
  }
}

function renderSpots() {
  spotList.setAttribute("aria-labelledby", categoryControls[activeCategory].id);
  spotList.replaceChildren(...regions[activeRegion][activeCategory].map(([name, description, place]) => {
    const article = document.createElement("article");
    article.className = "spot";
    const text = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = name;
    const detail = document.createElement("p");
    detail.textContent = description;
    text.append(title, detail);
    const location = document.createElement("span");
    location.className = "spot-place";
    location.textContent = place;
    article.append(text, location);
    return article;
  }));
}

function selectCategory(key) {
  activeCategory = key;
  for (const [id, button] of Object.entries(categoryControls)) {
    const selected = id === key;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  }
  renderSpots();
}

function drawMap() {
  mapTerrain.append(svgElement("rect", { x: 32, y: 130, width: 164, height: 125, class: "island-inset", "aria-hidden": true }));
  for (const [key, region] of Object.entries(regions)) {
    const shape = svgElement("path", {
      "class": "map-region", "d": regionPaths[key], "fill-rule": "evenodd", "data-region": key,
      "role": "button", "tabindex": "0", "aria-label": `${region.name} 지역`, "aria-pressed": "false",
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
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "region-chip";
    chip.textContent = region.name;
    chip.dataset.region = key;
    for (const control of [shape, label, chip]) {
      control.addEventListener("click", event => selectRegion(key, event.detail > 0));
    }
    shape.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectRegion(key);
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

function createTabs() {
  const keys = Object.keys(categories);
  for (const [key, label] of Object.entries(categories)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab";
    button.id = `tab-${key}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", "spot-list");
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
    licenseLink.textContent = "CC BY-SA 2.0 · 화면 비율에 맞게 표시";
    item.append(" · ", licenseLink);
  }
  credits.append(item);
}
drawMap();
createTabs();
selectCategory(activeCategory);
selectRegion(activeRegion);
