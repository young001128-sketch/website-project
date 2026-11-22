// Photo credits and sources for the locally stored Wikimedia Commons thumbnails.
const entryPhotos = {
  "hokkaido-sight": {
    "alt": "오타루 운하를 따라 늘어선 석조 창고",
    "width": 960,
    "height": 635,
    "source": "https://commons.wikimedia.org/wiki/File:Otaru_Canal_HDR1.jpg",
    "artist": "Tan Wei Liang Byorn",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "hokkaido-activity": {
    "alt": "눈 덮인 니세코 하나조노 스키장",
    "width": 960,
    "height": 540,
    "source": "https://commons.wikimedia.org/wiki/File:NISEKO_HANAZONO_Ski_308.jpg",
    "artist": "MIKI Yoshihito",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "tohoku-sight": {
    "alt": "숲 사이를 흐르는 오이라세 계류",
    "width": 960,
    "height": 720,
    "source": "https://commons.wikimedia.org/wiki/File:Oirase_Stream,_Towada-Hachimantai_National_Park,_Japan.jpg",
    "artist": "OKJaguar",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "tohoku-activity": {
    "alt": "자오에서 눈과 얼음으로 뒤덮인 나무",
    "width": 330,
    "height": 247,
    "source": "https://commons.wikimedia.org/wiki/File:Zao_juhyo.jpg",
    "artist": "Toto-artist",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "kanto-sight": {
    "alt": "도쿄 아사쿠사의 센소지",
    "width": 960,
    "height": 720,
    "source": "https://commons.wikimedia.org/wiki/File:Sensoji_temple,_Asakusa,_Tokyo,_Japan.jpg",
    "artist": "Joli Rumi",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "kanto-activity": {
    "alt": "하코네유모토 온천 거리",
    "width": 960,
    "height": 712,
    "source": "https://commons.wikimedia.org/wiki/File:HakoneOnsenStreet01.JPG",
    "artist": "Kounoichi",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  "hokuriku-sight": {
    "alt": "겐로쿠엔의 가스미가이케 연못",
    "width": 960,
    "height": 720,
    "source": "https://commons.wikimedia.org/wiki/File:View_of_Kasumigaike_Pond_at_Kenrokuen.jpg",
    "artist": "Tbatb",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "hokuriku-activity": {
    "alt": "하쿠바 코르티나 스키장",
    "width": 960,
    "height": 720,
    "source": "https://commons.wikimedia.org/wiki/File:Hakuba_Cortina_Kokusai_Ski_Resort.JPG",
    "artist": "Ski Mania",
    "license": "Public domain",
    "licenseUrl": ""
  },
  "tokai-sight": {
    "alt": "시라카와고의 전통 가옥",
    "width": 960,
    "height": 540,
    "source": "https://commons.wikimedia.org/wiki/File:Historic_Village_of_Shirakawa-go_(2016)_-_img_06.jpg",
    "artist": "Chainwit.",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
  },
  "tokai-activity": {
    "alt": "시즈오카의 차밭",
    "width": 960,
    "height": 638,
    "source": "https://commons.wikimedia.org/wiki/File:Tea_plantation_in_Shizuoka.jpg",
    "artist": "ajari from Japan",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "kansai-sight": {
    "alt": "후시미 이나리 신사의 붉은 도리이",
    "width": 960,
    "height": 678,
    "source": "https://commons.wikimedia.org/wiki/File:Torii,_Fushimi_Inari-Taisha.jpg",
    "artist": "Marco Almbauer",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "kansai-activity": {
    "alt": "나라 공원에 사는 사슴",
    "width": 960,
    "height": 1458,
    "source": "https://commons.wikimedia.org/wiki/File:Deer_in_park_Nara_Japan.jpg",
    "artist": "P&#246;ll&#246;",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5"
  },
  "chugoku-sight": {
    "alt": "미야지마 앞바다의 이쓰쿠시마 신사 도리이",
    "width": 960,
    "height": 565,
    "source": "https://commons.wikimedia.org/wiki/File:Itsukushima_torii.jpg",
    "artist": "Rdsmith4",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "chugoku-activity": {
    "alt": "돗토리 해안의 모래 언덕",
    "width": 960,
    "height": 540,
    "source": "https://commons.wikimedia.org/wiki/File:Tottori_Sand_Dunes.jpg",
    "artist": "Drivephotographer",
    "license": "CC0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "shikoku-sight": {
    "alt": "에히메현 마쓰야마성",
    "width": 960,
    "height": 540,
    "source": "https://commons.wikimedia.org/wiki/File:Matsuyama_Castle.jpg",
    "artist": "Drivephotographer",
    "license": "CC0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "shikoku-activity": {
    "alt": "시마나미 카이도의 자전거길",
    "width": 960,
    "height": 720,
    "source": "https://commons.wikimedia.org/wiki/File:Shimanami_Kaido_Bikeway_(14089291941).jpg",
    "artist": "redlegsfan21",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "kyushu-sight": {
    "alt": "나가사키 글로버 정원",
    "width": 960,
    "height": 720,
    "source": "https://commons.wikimedia.org/wiki/File:Glover_Garden_Nagasaki-150821422.jpg",
    "artist": "Immanuelle",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
  },
  "kyushu-activity": {
    "alt": "증기가 피어오르는 벳푸 우미지고쿠 온천",
    "width": 960,
    "height": 720,
    "source": "https://commons.wikimedia.org/wiki/File:Umi_Jigoku.jpg",
    "artist": "Leyo",
    "license": "CC BY-SA 2.5 ch",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5/ch/deed.en"
  },
  "okinawa-sight": {
    "alt": "츄라우미 수족관 대형 수조의 고래상어",
    "width": 960,
    "height": 643,
    "source": "https://commons.wikimedia.org/wiki/File:Whale_Shark_-_Churaumi_aquarium,_Okinawa,_Japan.jpg",
    "artist": "pelican from Tokyo, Japan",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "okinawa-activity": {
    "alt": "이시가키섬 가비라만의 바다와 해안선",
    "width": 960,
    "height": 720,
    "source": "https://commons.wikimedia.org/wiki/File:Ishigaki_Kabira_Bay.JPG",
    "artist": "BenedettaR",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  }
};
