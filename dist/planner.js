const form = document.getElementById("planner-form");
const routeStops = document.getElementById("route-stops");
const addButton = document.getElementById("add-stop");
const stopTemplate = document.getElementById("stop-template");
const budget = document.getElementById("planner-budget");
const budgetValues = document.getElementById("budget-values");
const recommendations = document.getElementById("planner-recommendations");
const statusText = document.getElementById("planner-status");
const amount = new Intl.NumberFormat("ko-KR");
const yen = value => `${amount.format(value)}엔`;
const costLabels = {
  lodging: "숙박",
  meals: "식비",
  localTransit: "시내 교통",
  transfers: "지역 간 이동",
  activities: "관광·체험",
};

function element(tag, text, className) {
  const result = document.createElement(tag);
  if (className) result.className = className;
  result.textContent = text;
  return result;
}

function field(row, name) {
  return row.querySelector(`[data-field="${name}"]`);
}

const optionGroups = itinerary.options.map(({ name, prefectures }) => {
  const group = document.createElement("optgroup");
  group.label = name;
  group.append(...prefectures.map(prefecture => new Option(prefecture.name, prefecture.id)));
  return group;
});

function updateStops() {
  const rows = [...routeStops.children];
  let previousId = null;
  for (const [index, row] of rows.entries()) {
    row.querySelector("[data-stop-title]").textContent = `방문지 ${index + 1}`;
    row.querySelector('[data-action="up"]').disabled = index === 0;
    row.querySelector('[data-action="down"]').disabled = index === rows.length - 1;
    row.querySelector('[data-action="remove"]').disabled = rows.length === 1;
    row.querySelector("[data-fare-label]").textContent = index === 0
      ? "첫 방문지까지 이동 (1인·엔)"
      : "이전 방문지에서 이동 (1인·엔)";
    const id = Number(field(row, "prefecture").value);
    const fare = itinerary.transferEstimate(previousId, id);
    const canEstimate = id && (index === 0 || previousId);
    field(row, "fare").placeholder = canEstimate ? `자동 · ${yen(fare)}` : "구간 추정값 적용";
    previousId = id;
  }
  addButton.disabled = rows.length >= itinerary.limits.stops;
}

function addStop(focus) {
  const row = stopTemplate.content.firstElementChild.cloneNode(true);
  const select = field(row, "prefecture");
  select.append(...optionGroups.map(group => group.cloneNode(true)));
  field(row, "nights").max = itinerary.limits.nights;
  field(row, "fare").max = itinerary.limits.yen;
  routeStops.append(row);
  updateStops();
  if (focus) select.focus();
}

function markChanged() {
  statusText.textContent = budgetValues.hidden ? "" : "입력 내용이 바뀌었어요. 다시 계산해 경비와 추천을 갱신하세요.";
  statusText.classList.remove("planner-error");
}

addButton.addEventListener("click", () => {
  addStop(true);
  markChanged();
});
routeStops.addEventListener("change", updateStops);
routeStops.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const row = button.closest(".planner-stop");
  const focusRow = row.nextElementSibling || row.previousElementSibling;
  if (button.dataset.action === "up") row.previousElementSibling.before(row);
  if (button.dataset.action === "down") row.nextElementSibling.after(row);
  if (button.dataset.action === "remove") row.remove();
  updateStops();
  field(row.isConnected ? row : focusRow, "prefecture").focus();
  markChanged();
});
form.addEventListener("input", markChanged);
form.addEventListener("invalid", event => {
  const details = event.target.closest("details");
  if (details) details.open = true;
}, true);

for (const name of ["people", "rooms"]) {
  form.elements.namedItem(name).max = itinerary.limits[name];
}
for (const [name, value] of Object.entries(itinerary.defaults)) {
  const input = form.elements.namedItem(name);
  input.value = value;
  input.max = itinerary.limits.yen;
}
const interests = document.getElementById("planner-interests");
for (const [key, name] of Object.entries(itinerary.categories)) {
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "interest";
  checkbox.value = key;
  checkbox.checked = itinerary.defaultInterests.includes(key);
  label.append(checkbox, name);
  interests.append(label);
}
addStop(false);

function renderBudget(plan) {
  document.getElementById("budget-empty").hidden = true;
  budgetValues.hidden = false;
  document.getElementById("budget-duration").textContent = `${plan.nights}박 ${plan.days}일 · ${plan.people}명 · 객실 ${plan.rooms}개`;
  document.getElementById("budget-total").textContent = yen(plan.total);
  document.getElementById("budget-per-person").textContent = `1인당 약 ${yen(plan.perPerson)}`;
  const rows = Object.entries(plan.breakdown).map(([key, cost]) => {
    const row = document.createElement("div");
    row.append(element("dt", costLabels[key]), element("dd", yen(cost)));
    return row;
  });
  document.getElementById("budget-breakdown").replaceChildren(...rows);
}

function renderRecommendations(plan) {
  const groups = plan.route.map((stop, index) => {
    const card = element("article", "", "planner-visit");
    card.append(element("h3", `${index + 1}. ${stop.name}`));
    const { from, perPerson, estimated } = stop.transfer;
    const moveLabel = from ? `${from}에서 이동` : "첫 방문지까지 이동";
    card.append(element("p", `${stop.nights}박 · 숙박 ${yen(stop.lodging)} · ${moveLabel} 1인 ${yen(perPerson)} (${estimated ? "추정" : "직접 입력"})`,
      "planner-visit-details"));
    const list = element("ul", "", "planner-places");
    for (const place of stop.recommendations) {
      const item = document.createElement("li");
      const link = element("a", `${place.location} · 지도 보기`);
      link.href = place.mapUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      item.append(
        element("p", place.type === "festival" ? "축제 · 개최일 확인" : place.category, "planner-place-type"),
        element("h4", place.name),
        element("p", place.description),
        link
      );
      list.append(item);
    }
    if (list.children.length) {
      card.append(list);
    } else {
      card.append(element("p", "관심사를 선택하면 이 지역의 추천 장소를 볼 수 있어요.", "planner-help"));
    }
    return card;
  });
  document.getElementById("recommendations-list").replaceChildren(...groups);
  recommendations.hidden = false;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const number = name => form.elements.namedItem(name).valueAsNumber;
  const plan = itinerary.estimate({
    people: number("people"),
    rooms: number("rooms"),
    costs: Object.fromEntries(Object.keys(itinerary.defaults).map(name => [name, number(name)])),
    interests: [...interests.querySelectorAll(":checked")].map(input => input.value),
    stops: [...routeStops.children].map(row => ({
      prefectureId: Number(field(row, "prefecture").value),
      nights: field(row, "nights").valueAsNumber,
      transportPerPerson: field(row, "fare").value === "" ? null : field(row, "fare").valueAsNumber,
    })),
  });
  if (plan.error) {
    statusText.textContent = plan.error;
    statusText.classList.add("planner-error");
    return;
  }
  renderBudget(plan);
  renderRecommendations(plan);
  statusText.textContent = "예상 경비와 추천 장소를 확인하세요.";
  statusText.classList.remove("planner-error");
  budget.focus();
});
