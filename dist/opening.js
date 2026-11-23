const chapters = {
  mountain: {
    area: "가와구치호 · 야마나시", title: ["일본의 풍경을", "따라가다"],
    description: ["후지산 아래 고요한 호수에서 시작해", "마음이 이끄는 곳으로 떠나보세요."],
    location: "LAKE KAWAGUCHI, JAPAN", region: "chubu",
  },
  city: {
    area: "시부야 · 도쿄", title: ["불빛을 따라", "도시 속으로"],
    description: ["해가 지면 또 다른 도쿄가 열려요.", "골목의 불빛을 따라 나만의 여행을 시작해 보세요."],
    location: "SHIBUYA, TOKYO", region: "kanto",
  },
  coast: {
    area: "오키나와 · 일본 남부", title: ["파도가 닿는", "섬으로"],
    description: ["바다색이 짙어지는 남쪽 섬에서", "한 박자 느린 여행을 시작해 보세요."],
    location: "OKINAWA, JAPAN", region: "okinawa",
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
  document.getElementById("scene-location").textContent = chapter.location;
  const period = document.createElement("span");
  period.textContent = ".";
  document.getElementById("hero-title").replaceChildren(chapter.title[0], document.createElement("br"), chapter.title[1], period);
  document.getElementById("hero-description").replaceChildren(chapter.description[0], document.createElement("br"), chapter.description[1]);
  for (const button of sceneButtons) button.setAttribute("aria-pressed", String(button.dataset.choice === key));
  for (const layer of sceneLayers) layer.classList.toggle("is-active", layer.dataset.image === key);
  sceneCopy.classList.remove("is-changing");
  sceneCopy.getBoundingClientRect();
  sceneCopy.classList.add("is-changing");
}

for (const button of sceneButtons) button.addEventListener("click", () => changeScene(button.dataset.choice));

// Keep links to the original map section working.
if (window.location.hash === "#explore") window.location.replace("map.html");
