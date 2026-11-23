const itinerary = (() => {
  const inNode = typeof module !== "undefined";
  const guide = inNode ? require("./travel") : { categories, regions };
  const allPrefectures = inNode
    ? { ...require("./prefectures-east"), ...require("./prefectures-west") }
    : { ...eastGuides, ...westGuides };
  const groups = inNode ? require("./prefecture-regions") : prefectureGroups;
  const options = Object.entries(groups).map(([region, ids]) => ({
    name: guide.regions[region].name,
    prefectures: ids.map(id => ({ id, name: allPrefectures[id].name })),
  }));
  const regionById = new Map(Object.entries(groups).flatMap(([region, ids]) =>
    ids.map(id => [id, region])
  ));

  const limits = { people: 50, rooms: 50, stops: 50, nights: 365, yen: 1000000 };
  const defaults = {
    lodgingPerRoomNight: 10000,
    mealsPerPersonDay: 3500,
    localTransitPerPersonDay: 900,
    activitiesPerPersonDay: 1500,
  };
  const defaultInterests = ["sight", "activity", "food"];

  function transferEstimate(previousId, id) {
    if (!previousId || previousId === id) return 0;
    const from = regionById.get(previousId);
    const to = regionById.get(id);
    if (from === to) return 2500;
    if (from === "okinawa" || to === "okinawa") return 18000;
    return 12000;
  }

  function isIntegerInRange(value, min, max) {
    return Number.isInteger(value) && value >= min && value <= max;
  }

  function estimate(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return { error: "일정 입력을 확인하세요." };
    }
    const { people, rooms = 1, stops, costs = {}, interests = defaultInterests } = input;
    if (!isIntegerInRange(people, 1, limits.people) || !isIntegerInRange(rooms, 1, limits.rooms)) {
      return { error: "인원과 객실 수를 각각 1~50 사이의 정수로 입력하세요." };
    }
    if (!Array.isArray(stops) || stops.length < 1 || stops.length > limits.stops) {
      return { error: "방문지는 1~50곳을 입력하세요." };
    }
    if (!costs || typeof costs !== "object" || Array.isArray(costs)) {
      return { error: "경비 기준을 확인하세요." };
    }
    const rates = { ...defaults };
    for (const key of Object.keys(rates)) {
      if (Object.hasOwn(costs, key)) rates[key] = costs[key];
      if (!isIntegerInRange(rates[key], 0, limits.yen)) {
        return { error: "비용은 0~1,000,000엔 사이의 정수로 입력하세요." };
      }
    }
    if (!Array.isArray(interests) || !interests.every(key =>
      typeof key === "string" && Object.hasOwn(guide.categories, key)
    )) {
      return { error: "추천 유형은 명소, 체험, 먹거리, 축제 중에서 선택하세요." };
    }
    const types = [...new Set(interests)];

    let nights = 0;
    let previousId = null;
    let transfers = 0;
    const route = [];
    for (const [index, stop] of stops.entries()) {
      if (!stop || !regionById.has(stop.prefectureId) || !isIntegerInRange(stop.nights, 0, limits.nights)) {
        return { error: `${index + 1}번째 방문지와 숙박일을 확인하세요.` };
      }
      const { prefectureId, transportPerPerson } = stop;
      const manualFare = transportPerPerson != null;
      if (manualFare && !isIntegerInRange(transportPerPerson, 0, limits.yen)) {
        return { error: `${index + 1}번째 방문지까지의 이동비를 확인하세요.` };
      }
      const prefecture = allPrefectures[prefectureId];
      const fare = manualFare ? transportPerPerson : transferEstimate(previousId, prefectureId);
      const lodging = stop.nights * rooms * rates.lodgingPerRoomNight;
      nights += stop.nights;
      transfers += fare * people;
      route.push({
        prefectureId,
        name: prefecture.name,
        nights: stop.nights,
        lodging,
        transfer: {
          from: allPrefectures[previousId]?.name ?? null,
          perPerson: fare,
          total: fare * people,
          estimated: !manualFare,
        },
        recommendations: types.map(type => {
          const [name, description, location, query] = prefecture[type];
          const params = new URLSearchParams({ api: "1", query });
          return { type, category: guide.categories[type], name, description, location,
            mapUrl: `https://www.google.com/maps/search/?${params}` };
        }),
      });
      previousId = prefectureId;
    }

    const days = nights + 1;
    const breakdown = {
      lodging: nights * rooms * rates.lodgingPerRoomNight,
      meals: days * people * rates.mealsPerPersonDay,
      localTransit: days * people * rates.localTransitPerPersonDay,
      transfers,
      activities: days * people * rates.activitiesPerPersonDay,
    };
    const total = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);
    return { currency: "JPY", days, nights, people, rooms, rates, breakdown,
      total, perPerson: Math.round(total / people), route };
  }

  return { options, limits, defaults, defaultInterests, categories: guide.categories, estimate, transferEstimate };
})();

if (typeof module !== "undefined") module.exports = itinerary;
