const categories = { sight: "관광명소", activity: "놀거리", food: "먹거리" };
const regions = [
  {
    id: "hokkaido", name: "홋카이도", cities: "삿포로 · 오타루 · 니세코", color: "#486d7a",
    entries: {
      sight: ["오타루 운하", "옛 창고가 늘어선 운하를 따라 걸으며 항구 도시의 풍경을 감상해 보세요."],
      activity: ["니세코 스키", "겨울에는 니세코에서 가볍고 부드러운 파우더 스노를 즐겨보세요."],
      food: ["삿포로 미소 라멘", "된장의 깊은 국물에 옥수수와 버터를 곁들인 스타일도 맛볼 수 있어요."],
    },
  },
  {
    id: "tohoku", name: "도호쿠", cities: "아오모리 · 센다이 · 야마가타", color: "#617247",
    entries: {
      sight: ["오이라세 계류", "아오모리 도와다호에서 이어지는 계곡의 숲길과 폭포를 둘러보세요."],
      activity: ["자오 수빙 감상", "한겨울 야마가타 자오에서 눈과 얼음으로 뒤덮인 나무를 만나보세요."],
      food: ["센다이 규탄", "숯불에 구운 소혀를 보리밥, 맑은 소꼬리국과 함께 맛보세요."],
    },
  },
  {
    id: "kanto", name: "간토", cities: "도쿄 · 가나가와 · 도치기", color: "#ad3328",
    entries: {
      sight: ["아사쿠사 센소지", "도쿄 아사쿠사의 가미나리몬을 지나 상점가와 사찰을 둘러보세요."],
      activity: ["하코네 온천", "가나가와 하코네에서 온천에 몸을 담그고 산 풍경을 즐겨보세요."],
      food: ["도쿄 몬자야키", "묽은 반죽과 재료를 철판에 익혀 작은 주걱으로 떠먹는 도쿄 음식이에요."],
    },
  },
  {
    id: "hokuriku", name: "호쿠리쿠·신에쓰", cities: "이시카와 · 나가노 · 니가타", color: "#486d7a",
    entries: {
      sight: ["가나자와 겐로쿠엔", "연못과 돌다리 사이를 걸으며 이시카와의 대표적인 일본식 정원을 감상해 보세요."],
      activity: ["하쿠바에서 스키", "나가노의 북알프스를 배경으로 겨울 스포츠를 즐길 수 있어요."],
      food: ["니가타 헤기소바", "해초를 넣어 매끈한 메밀국수를 나무 상자에 한입씩 담아 내는 요리예요."],
    },
  },
  {
    id: "tokai", name: "도카이", cities: "아이치 · 시즈오카 · 기후 · 미에", color: "#617247",
    entries: {
      sight: ["시라카와고", "기후 산골 마을에서 지붕이 가파른 전통 가옥들을 둘러보세요."],
      activity: ["시즈오카 차밭 체험", "차 산지에서 찻잎 따기나 시음을 체험해 보세요. 프로그램은 계절에 따라 달라요."],
      food: ["나고야 히쓰마부시", "잘게 썬 장어 덮밥을 그대로 먹고, 고명을 더하거나 육수를 부어 즐겨보세요."],
    },
  },
  {
    id: "kansai", name: "간사이", cities: "교토 · 오사카 · 나라", color: "#ad3328",
    entries: {
      sight: ["후시미 이나리 신사", "교토의 붉은 도리이가 이어진 산길을 걸어보세요."],
      activity: ["나라 공원 산책", "사슴이 다니는 공원 길을 따라 도다이지와 주변 정원을 둘러보세요."],
      food: ["오사카 타코야키", "문어가 든 동그란 반죽에 소스와 가쓰오부시를 올린 간식이에요."],
    },
  },
  {
    id: "chugoku", name: "주고쿠", cities: "히로시마 · 돗토리 · 오카야마", color: "#936136",
    entries: {
      sight: ["이쓰쿠시마 신사", "미야지마에서 조수에 따라 다른 모습을 보이는 바다 위 도리이를 만나보세요."],
      activity: ["돗토리 사구 산책", "모래 언덕을 올라 동해를 바라보며 해안 풍경을 즐겨보세요."],
      food: ["히로시마 오코노미야키", "양배추와 면을 겹겹이 올려 철판에서 구운 오코노미야키를 맛보세요."],
    },
  },
  {
    id: "shikoku", name: "시코쿠", cities: "가가와 · 에히메 · 도쿠시마 · 고치", color: "#617247",
    entries: {
      sight: ["마쓰야마성", "에히메 마쓰야마의 언덕 위 성에서 시내 풍경을 내려다보세요."],
      activity: ["시마나미 카이도 자전거", "이마바리에서 출발해 세토내해의 섬과 섬을 잇는 다리를 달려보세요."],
      food: ["사누키 우동", "가가와의 탄력 있는 굵은 면을 따뜻한 국물이나 차가운 소스와 함께 즐겨보세요."],
    },
  },
  {
    id: "kyushu", name: "규슈", cities: "후쿠오카 · 오이타 · 나가사키", color: "#936136",
    entries: {
      sight: ["나가사키 글로버 정원", "언덕 위 서양식 건축물 사이를 걸으며 나가사키 항구를 내려다보세요."],
      activity: ["벳푸 온천", "오이타 벳푸에서 온천욕을 하거나 다양한 색의 온천을 둘러보세요."],
      food: ["하카타 돈코쓰 라멘", "돼지 뼈를 우려낸 진한 국물에 가는 면을 말아 먹는 후쿠오카의 대표 라멘이에요."],
    },
  },
  {
    id: "okinawa", name: "오키나와", cities: "나하 · 모토부 · 이시가키", color: "#486d7a",
    entries: {
      sight: ["오키나와 츄라우미 수족관", "모토부의 대형 수조에서 고래상어와 가오리를 만나보세요."],
      activity: ["이시가키섬 스노클링", "날씨와 파도에 맞춰 현지 가이드와 산호초 바다를 탐험해 보세요."],
      food: ["오키나와 소바", "밀로 만든 면을 국물에 담고 조린 돼지고기를 올리는 섬의 대표 음식이에요."],
    },
  },
];

const japanMap = document.querySelector("#japan-map");
const mapRegions = document.querySelector("#map-regions");
const search = document.querySelector("#search");
const categoryGroup = document.querySelector("#categories");
const resultCount = document.querySelector("#result-count");
const results = document.querySelector("#results");
let selectedCategory = "";
let selectedRegion = "";

japanMap.innerHTML = `
  ${regions.map(({ id, name }) => `
    <g class="map-shape" data-region="${id}">
      <title>${name}</title>
      ${id === "okinawa" ? `
        <g class="okinawa-inset">
          <rect x="26" y="33" width="179" height="112" rx="8"/>
          <text x="38" y="62">오키나와</text>
        </g>
      ` : ""}
      ${japanMapPaths[id].map(path => `<path d="${path}"/>`).join("")}
    </g>
  `).join("")}
`;

mapRegions.innerHTML = `
  <button class="map-all" type="button" data-region="" aria-pressed="true">모든 지역</button>
  ${regions.map(({ id, name }) => `
    <button type="button" data-region="${id}" aria-pressed="false">
      <span class="map-swatch" aria-hidden="true"></span>${name}
    </button>
  `).join("")}
`;

function selectRegion(event) {
  const item = event.target.closest("[data-region]");
  if (!item) return;
  selectedRegion = item.dataset.region;
  for (const shape of japanMap.querySelectorAll(".map-shape")) {
    shape.classList.toggle("is-selected", shape.dataset.region === selectedRegion);
  }
  for (const button of mapRegions.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.region === selectedRegion));
  }
  render();
}

function render() {
  const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = regions
    .filter(({ id }) => !selectedRegion || id === selectedRegion)
    .map(region => {
      const entries = Object.entries(region.entries).filter(([category, [title, description]]) => {
        const searchable = [region.name, region.cities, categories[category], title, description].join(" ").toLowerCase();
        return (!selectedCategory || category === selectedCategory) &&
          terms.every(term => searchable.includes(term));
      });
      return { ...region, entries };
    })
    .filter(region => region.entries.length);

  const totalEntries = matches.reduce((total, region) => total + region.entries.length, 0);
  const activeRegion = regions.find(({ id }) => id === selectedRegion);
  const resultLabel = activeRegion ? activeRegion.name : `${matches.length}개 지역`;
  resultCount.textContent = matches.length
    ? `${resultLabel} · ${totalEntries}개 추천`
    : "검색 결과가 없습니다. 다른 검색어나 필터를 사용해 보세요.";

  // Only fixed guide data is rendered here. Search text is used solely for filtering.
  results.innerHTML = matches.map(region => `
    <article class="region-card" style="--accent: ${region.color}">
      <header>
        <h3>${region.name}</h3>
        <p>${region.cities}</p>
      </header>
      <ul class="entries">
        ${region.entries.map(([category, [title, description]]) => {
          const photo = entryPhotos[`${region.id}-${category}`];
          return `
            <li>
              <p class="entry-label">${categories[category]}</p>
              ${photo ? `
                <details class="entry-photo">
                  <summary>
                    <span class="entry-title">${title}</span>
                    <span class="photo-indicator">사진<span aria-hidden="true"></span></span>
                  </summary>
                  <figure>
                    <img src="image/places/${region.id}-${category}.jpg" alt="${photo.alt}" loading="lazy" decoding="async" width="${photo.width}" height="${photo.height}">
                    <figcaption>
                      <a href="${photo.source}">사진 원본</a> · ${photo.artist} ·
                      ${photo.licenseUrl ? `<a href="${photo.licenseUrl}">${photo.license}</a>` : photo.license} · 크기 조정
                    </figcaption>
                  </figure>
                </details>
              ` : `<h4>${title}</h4>`}
              <p class="entry-description">${description}</p>
            </li>
          `;
        }).join("")}
      </ul>
    </article>
  `).join("");
}

japanMap.addEventListener("click", selectRegion);
mapRegions.addEventListener("click", selectRegion);
search.addEventListener("input", render);
categoryGroup.addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  for (const item of categoryGroup.querySelectorAll("button")) {
    item.setAttribute("aria-pressed", String(item === button));
  }
  render();
});

render();
