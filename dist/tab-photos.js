// One locally stored representative photo for each region and category.
const tabPhotos = {
  "hokkaido-sight": {
    "src": "assets/travel/hokkaido-sight.jpg",
    "caption": "비에이 청의 호수",
    "author": "MaedaAkihiko",
    "source": "https://commons.wikimedia.org/wiki/File:Shirogane-Blue-Pond_summer.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "hokkaido-activity": {
    "src": "assets/travel/hokkaido-activity.jpg",
    "caption": "니세코 히가시야마 스키장",
    "author": "Wakimasa",
    "source": "https://commons.wikimedia.org/wiki/File:Niseko-Higashiyama.JPG",
    "license": "Public domain",
    "licenseUrl": null
  },
  "hokkaido-festival": {
    "src": "assets/travel/hokkaido-festival.jpg",
    "caption": "삿포로 눈축제",
    "author": "Materialscientist",
    "source": "https://commons.wikimedia.org/wiki/File:SapporoFestival8.JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "hokkaido-food": {
    "src": "assets/travel/hokkaido-food.jpg",
    "caption": "삿포로 미소라멘",
    "author": "ノボホショコロトソ",
    "source": "https://commons.wikimedia.org/wiki/File:Miso_ramen_of_Sapporo_01.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
  },
  "tohoku-sight": {
    "src": "assets/tohoku.jpg",
    "caption": "오이라세 계류",
    "author": "Jun Ohashi",
    "source": "https://unsplash.com/photos/EekNBV1kluU",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license"
  },
  "tohoku-activity": {
    "src": "assets/travel/tohoku-activity.jpg",
    "caption": "뉴토 온천의 쓰루노유",
    "author": "Bjckashiwa",
    "source": "https://commons.wikimedia.org/wiki/File:Tsuru-no-yu_Onsen_in_Feb_2015.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "tohoku-festival": {
    "src": "assets/travel/tohoku-festival.jpg",
    "caption": "아오모리 네부타 축제",
    "author": "Fisherman",
    "source": "https://commons.wikimedia.org/wiki/File:Aomori_Nebuta_Festival_Float_August_2006.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  "tohoku-food": {
    "src": "assets/travel/tohoku-food.jpg",
    "caption": "센다이 규탄 정식",
    "author": "Captain76",
    "source": "https://commons.wikimedia.org/wiki/File:Gyutan_teishoku.JPG",
    "license": "Public domain",
    "licenseUrl": null
  },
  "kanto-sight": {
    "src": "assets/travel/kanto-sight.jpg",
    "caption": "시부야 스크램블 교차로",
    "author": "David Kernan",
    "source": "https://commons.wikimedia.org/wiki/File:Shibuya_Crossing,_Aerial.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
  },
  "kanto-activity": {
    "src": "assets/travel/kanto-activity.jpg",
    "caption": "아시노코 유람선",
    "author": "Maarten Heerlien",
    "source": "https://commons.wikimedia.org/wiki/File:Pirate_ship_on_Lake_Ashi_(9412052470).jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "kanto-festival": {
    "src": "assets/travel/kanto-festival.jpg",
    "caption": "아사쿠사 산자 마쓰리",
    "author": "Torsodog",
    "source": "https://commons.wikimedia.org/wiki/File:View_of_mikoshi_from_sensoji_Sanja_Matsuri_2006-3.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "kanto-food": {
    "src": "assets/travel/kanto-food.jpg",
    "caption": "철판에 굽는 몬자야키",
    "author": "Helen Cook (bitmask)",
    "source": "https://commons.wikimedia.org/wiki/File:Monja_yaki.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "chubu-sight": {
    "src": "assets/mountain.jpg",
    "caption": "가와구치호와 후지산",
    "author": "Steven Lynn",
    "source": "https://unsplash.com/photos/WJAl9CtgdyA",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license"
  },
  "chubu-activity": {
    "src": "assets/travel/chubu-activity.jpg",
    "caption": "가미코치 아즈사강",
    "author": "663highland",
    "source": "https://commons.wikimedia.org/wiki/File:Azusa_River01bs4272.jpg",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5"
  },
  "chubu-festival": {
    "src": "assets/travel/chubu-festival.jpg",
    "caption": "다카야마 축제의 가구라다이 수레",
    "author": "Bernard Gagnon",
    "source": "https://commons.wikimedia.org/wiki/File:Kagura_Tai_Float.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "chubu-food": {
    "src": "assets/travel/chubu-food.jpg",
    "caption": "나고야 히쓰마부시",
    "author": "Kanesue",
    "source": "https://commons.wikimedia.org/wiki/File:Hitsumabushi1.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "kansai-sight": {
    "src": "assets/kansai.jpg",
    "caption": "후시미 이나리 다이샤",
    "author": "Ralph Spandl",
    "source": "https://unsplash.com/photos/aSZibsCIxlI",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license"
  },
  "kansai-activity": {
    "src": "assets/travel/kansai-activity.jpg",
    "caption": "아라시야마 대나무숲",
    "author": "Basile Morin",
    "source": "https://commons.wikimedia.org/wiki/File:Bamboo_Forest,_Arashiyama,_Kyoto,_Japan.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "kansai-festival": {
    "src": "assets/travel/kansai-festival.jpg",
    "caption": "교토 기온 마쓰리",
    "author": "Stéfan",
    "source": "https://commons.wikimedia.org/wiki/File:Yoiyama_-_The_Gion_Festival_-_July_14,_2008.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "kansai-food": {
    "src": "assets/travel/kansai-food.jpg",
    "caption": "오사카 구로몬시장의 다코야키",
    "author": "Gatorfan252525",
    "source": "https://commons.wikimedia.org/wiki/File:A_plate_of_assorted_Takoyaki_in_Kuromon_Market_in_Osaka,_Japan.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "chugoku-sight": {
    "src": "assets/chugoku.jpg",
    "caption": "이쓰쿠시마 신사",
    "author": "Fabio Montello",
    "source": "https://unsplash.com/photos/0KUv5wVRkJQ",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license"
  },
  "chugoku-activity": {
    "src": "assets/travel/chugoku-activity.jpg",
    "caption": "시마나미 카이도 자전거길",
    "author": "redlegsfan21",
    "source": "https://commons.wikimedia.org/wiki/File:Shimanami_Kaido_Bikeway_(14089291941).jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "chugoku-festival": {
    "src": "assets/travel/chugoku-festival.jpg",
    "caption": "히로시마 플라워 페스티벌",
    "author": "Taisyo",
    "source": "https://commons.wikimedia.org/wiki/File:Hana-no-to2.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
  },
  "chugoku-food": {
    "src": "assets/travel/chugoku-food.jpg",
    "caption": "히로시마식 오코노미야키",
    "author": "Ajay Suresh",
    "source": "https://commons.wikimedia.org/wiki/File:Hiroshima-Style_Okonomiyaki_(40283556800).jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "shikoku-sight": {
    "src": "assets/shikoku.jpg",
    "caption": "이야 계곡",
    "author": "Kimon Berlin",
    "source": "https://commons.wikimedia.org/wiki/File:Iya_Valley_(6551498255).jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/"
  },
  "shikoku-activity": {
    "src": "assets/travel/shikoku-activity.jpg",
    "caption": "마쓰야마 도고 온천 본관",
    "author": "Japanexperterna.se",
    "source": "https://commons.wikimedia.org/wiki/File:Dogo_onsen_honkan_long_exposure.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "shikoku-festival": {
    "src": "assets/travel/shikoku-festival.jpg",
    "caption": "도쿠시마 아와오도리",
    "author": "Stemu2000",
    "source": "https://commons.wikimedia.org/wiki/File:Awa_Odori_Tokushima_Aug2009.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
  },
  "shikoku-food": {
    "src": "assets/travel/shikoku-food.jpg",
    "caption": "가마아게 사누키 우동",
    "author": "sekido",
    "source": "https://commons.wikimedia.org/wiki/File:Kama-age_sanuki_udon_by_sekido_in_Takamatsu,_Kagawa.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "kyushu-sight": {
    "src": "assets/kyushu.jpg",
    "caption": "아소산의 초원",
    "author": "takahiro taguchi",
    "source": "https://unsplash.com/photos/ryUr3SC6Lpo",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license"
  },
  "kyushu-activity": {
    "src": "assets/travel/kyushu-activity.jpg",
    "caption": "벳푸 간나와 온천의 해지옥",
    "author": "Bpcon98",
    "source": "https://commons.wikimedia.org/wiki/File:Umi_Jigoku_(Sea_Hell)_in_Beppu.jpg",
    "license": "CC0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "kyushu-festival": {
    "src": "assets/travel/kyushu-festival.jpg",
    "caption": "하카타 기온 야마카사",
    "author": "Pontafon",
    "source": "https://commons.wikimedia.org/wiki/File:Hakata_gion_yamakasa_2005_01.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "kyushu-food": {
    "src": "assets/travel/kyushu-food.jpg",
    "caption": "하카타 돈코츠라멘",
    "author": "City Foodsters",
    "source": "https://commons.wikimedia.org/wiki/File:Hakata_Style_48-Hour_Tonkotsu_Ramen.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "okinawa-sight": {
    "src": "assets/travel/okinawa-sight.jpg",
    "caption": "온나촌 만자모",
    "author": "CEphoto, Uwe Aranas",
    "source": "https://commons.wikimedia.org/wiki/File:Onna_Okinawa_Japan_Cape-Manzamo-01.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "okinawa-activity": {
    "src": "assets/travel/okinawa-activity.jpg",
    "caption": "게라마 제도 자마미섬 아마 해변",
    "author": "Guillaume 1995",
    "source": "https://commons.wikimedia.org/wiki/File:Ama_beach.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "okinawa-festival": {
    "src": "assets/travel/okinawa-festival.jpg",
    "caption": "나하 대줄다리기",
    "author": "위키미디어 등록자 촬영",
    "source": "https://commons.wikimedia.org/wiki/File:Naha_Tsunahiki20081012.JPG",
    "license": "Public domain",
    "licenseUrl": null
  },
  "okinawa-food": {
    "src": "assets/travel/okinawa-food.jpg",
    "caption": "오키나와 소바의 한 종류인 소키소바",
    "author": "くろふね",
    "source": "https://commons.wikimedia.org/wiki/File:%E3%82%BD%E3%83%BC%E3%82%AD%E3%81%9D%E3%81%B0%EF%BC%88%E6%B2%96%E7%B8%84%E3%81%9D%E3%81%B0%E5%B0%82%E9%96%80%E3%82%84%E3%82%93%E3%81%B0%E3%82%8B%E3%83%BB%E6%9C%89%E6%A5%BD%E7%94%BA%E4%BA%A4%E9%80%9A%E4%BC%9A%E9%A4%A8%EF%BC%8920240608-P1043176.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
  }
};

