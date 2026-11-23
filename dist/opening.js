const chapters = {
  mountain: {
    area: "가와구치호 · 야마나시", title: ["일본 여행지", "한눈에 보기"],
    description: ["지역별 명소, 체험, 축제, 먹거리를 찾아보세요.", "가고 싶은 곳의 위치는 지도에서 확인할 수 있어요."],
    region: "chubu",
  },
  city: {
    area: "시부야 · 도쿄", title: ["도쿄·하코네", "여행 정보"],
    description: ["시부야와 아사쿠사에서 가볼 곳을 찾아보세요.", "하코네 온천과 아시노코 유람선 위치도 볼 수 있어요."],
    region: "kanto",
  },
  coast: {
    area: "오키나와 해안", title: ["오키나와", "가볼 곳"],
    description: ["만자모와 게라마 제도 스노클링부터", "현지 먹거리와 축제까지 찾아보세요."],
    region: "okinawa",
  },
};

const sceneButtons = [...document.querySelectorAll("[data-choice]")];
const sceneLayers = [...document.querySelectorAll("[data-image]")];
const sceneCopy = document.getElementById("hero-copy");
const mapLink = document.querySelector(".primary-link");
let activeScene = "mountain";

function changeScene(key) {
  if (key === activeScene) return;
  activeScene = key;
  const chapter = chapters[key];
  mapLink.href = `map.html?region=${chapter.region}`;
  document.getElementById("hero-kicker").textContent = chapter.area;
  document.getElementById("hero-title").replaceChildren(chapter.title[0], document.createElement("br"), chapter.title[1]);
  document.getElementById("hero-description").replaceChildren(chapter.description[0], document.createElement("br"), chapter.description[1]);
  for (const button of sceneButtons) button.setAttribute("aria-pressed", String(button.dataset.choice === key));
  for (const layer of sceneLayers) layer.classList.toggle("is-active", layer.dataset.image === key);
  sceneCopy.classList.remove("is-changing");
  sceneCopy.getBoundingClientRect();
  sceneCopy.classList.add("is-changing");
}

for (const button of sceneButtons) button.addEventListener("click", () => changeScene(button.dataset.choice));

// Give browsers without cross-document transitions a short exit animation.
if (!("onpagereveal" in window) || window !== window.top) {
  mapLink.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    const page = document.documentElement;
    if (page.classList.contains("opening-is-leaving")) return;
    const destination = mapLink.href;
    page.classList.add("opening-is-leaving");
    window.setTimeout(() => window.location.assign(destination), 240);
  });
  window.addEventListener("pageshow", () => document.documentElement.classList.remove("opening-is-leaving"));
}

// Keep links to the original map section working.
if (window.location.hash === "#explore") window.location.replace("map.html");
