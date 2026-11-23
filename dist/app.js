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
const mapTerrain = document.getElementById("map-terrain");
const mapLabels = document.getElementById("map-labels");
const tabs = document.getElementById("category-tabs");
const tabPanel = document.getElementById("tab-panel");
const tabImage = document.getElementById("tab-photo");
const tabCaption = document.getElementById("tab-photo-caption");
const tabSource = document.getElementById("tab-photo-source");
const tabLicense = document.getElementById("tab-photo-license");
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
  renderTab();
  if (scrollToDetails && window.matchMedia("(max-width: 700px)").matches) {
    const rect = regionPanel.getBoundingClientRect();
    if (rect.top + 200 > window.innerHeight) {
      regionPanel.scrollIntoView({ block: "start" });
    }
  }
}

function renderTab() {
  setTabPhoto(tabPhotos[`${activeRegion}-${activeCategory}`]);
  tabPanel.setAttribute("aria-labelledby", categoryControls[activeCategory].id);
  spotList.replaceChildren(...regions[activeRegion][activeCategory].map(([name, description, place, query]) => {
    const article = document.createElement("article");
    article.className = "spot";
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
    location.setAttribute("aria-label", `${name} · ${place} · Google 지도에서 ${action} (새 탭)`);
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

function setTabPhoto({ src, caption, author, source, license, licenseUrl }) {
  tabImage.alt = caption;
  tabImage.src = src;
  tabCaption.textContent = caption;
  tabSource.textContent = author;
  tabSource.href = source;
  tabLicense.hidden = !licenseUrl;
  if (licenseUrl) {
    tabLicense.textContent = license;
    tabLicense.href = licenseUrl;
  }
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
selectRegion(activeRegion);
