let day = 0; //day관리
let cut = 0; //cut관리

let isFading = false;
let fadeAlpha = 0;
let fadeMode = "out"; // "out" 또는 "in"

let blinkProgress = 0;
let blinkCount = 0;
let h = 400;

let hideOneOb = [false, false]; // 두 개의 oneOb 상태 저장
let showX = false;
let xTimer = 0;

tissueCount = 0;
let tissueX = 100;
let tissueY = 300;
let isFlying = false;
let t = 0; // 시간 변수

let count = 0; //라면 먹은 횟수
let lamyenCount = 0; //라면 이미지 관리리

let charX = 0;
let charYBase = 500;
let charWiggle = 0;
let charMoving = true;

// 하루는 여러 컷으로 구성되고, 전체는 days 배열로 관리
let days = [];

let endZoom = 3.0; // 처음 확대 배율
let endZooming = true;

function setup() {
  createCanvas(1200, 800);
  textSize(30);
  daysData(); // 컷 데이터 초기화
}

function preload() {
  bgImages = [
    [
      // day 0 (1일차)
      loadImage("background/day1_cut0 copy.jpg"),
      loadImage("background/day1_cut0.jpg"),
      loadImage("background/day1_cut1.jpg"),
      loadImage("background/day1_cut2.jpg"),
      loadImage("background/day1_cut3.jpg"),
    ],
    [
      // day 1 (2일차)
      loadImage("background/day2_cut1.jpg"),
      loadImage("background/day2_cut2.jpg"),
      loadImage("background/day2_cut3.jpg"),
    ],
    [
      // day 2 (3일차)
      loadImage("background/day3_cut1.jpg"),
      loadImage("background/day3_cut2.jpg"),
      loadImage("background/day3_cut3.jpg"),
      loadImage("background/day3_cut4.jpg"),
    ],
  ];
  lamyenImgaes = [
    loadImage("lamyen/lamyen1.png"),
    loadImage("lamyen/lamyen2.png"),
    loadImage("lamyen/lamyen3.png"),
    loadImage("lamyen/lamyen4.png"),
  ];
  manyTissue = [
    loadImage("element/tissu1.png"),
    loadImage("element/tissu2.png"),
    loadImage("element/tissu3.png"),
  ];
  tissue = loadImage("element/tissu.png");
  oneOb = loadImage("element/one.jpg");
  manyOb = loadImage("element/many.jpg");
  charImg = loadImage("element/character.png");
  endImage = loadImage("element/eart2.jpg");
}

function draw() {
  background(255);
  // 현재 컷 실행
  if (days[day] && days[day][cut]) {
    days[day][cut]();
  } else {
    end();
  }
  // 페이드 인/아웃 효과
  if (isFading) {
    noStroke();
    fill(0, fadeAlpha);
    rect(0, 0, width, height);

    if (fadeMode === "out") {
      fadeAlpha += 15;
      if (fadeAlpha >= 255) {
        nextCut(); // 컷 바꾸기
        fadeMode = "in";
        fadeAlpha = 255;
      }
    } else if (fadeMode === "in") {
      fadeAlpha -= 15;
      if (fadeAlpha <= 0) {
        isFading = false;
        fadeAlpha = 0;
      }
    }
  }
  // 페이드 위에 텍스트 다시 그리기
  textOverlay();

  // 눈 깜빡이기
  if (day === 0 && cut === 1 && blinkCount < 3) {
    if (blinkCount === 0) {
      if (h <= 280) {
        blinkCount++;
      }
      h -= 5;
    }
    if (blinkCount === 1) {
      h += 1;
      if (h >= 380) {
        blinkCount++;
      }
    } else {
      h -= 7;
    }
  }
  // 'X' 표시 1초간 보여주기
  if (showX && millis() - xTimer < 1000) {
    push();
    textSize(100);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("X", width / 2, height / 2);
    pop();
  } else if (millis() - xTimer >= 1000) {
    showX = false;
  }

  if (
    (day === 0 && cut === 3) ||
    (day === 1 && cut === 1) ||
    (day === 2 && cut === 1 && charMoving)
  ) {
    if (charX < width / 2 - 50) {
      charX += 5;
      charWiggle = sin(frameCount * 0.3) * 5;
    } else {
      charMoving = false;
    }
    image(charImg, charX, charYBase + charWiggle, 100, 150);
  }

  // tissue 포물선 이동 처리
  if (isFlying) {
    // 포물선 형태 y = a(x - h)^2 + k
    // 시작점 (100, 300), 끝점 (300, 300), 중간 점은 위로 올라가야 하므로
    // 이차함수 형태: (t를 0~1로 기준)
    let startX = 100;
    let endX = 300;
    let peakY = 200; // 포물선의 꼭짓점 높이

    let x = lerp(startX, endX, t);
    let y = 4 * (peakY - 300) * (t - 0.5) * (t - 0.5) + 300;

    image(tissue, x, y, 80, 80); // 이미지 크기는 원하는 대로 조정

    t += 0.02;

    if (t >= 1) {
      isFlying = false;
      t = 0;
    }
  }
}

function textOverlay() {
  if (days[day] && days[day][cut]) {
    // 각 컷에 따라 텍스트 다시 출력 (하드코딩 방식 또는 조건 분기 가능)
    if (day === 0 && cut === 0) {
      drawCutText("제목:", 50);
      drawCutText("제작자: 김상권,하마다 스즈카, 조영찬", 100);
      drawCutText("모든 컷은 임시로 g키를 누르면 넘어갑니다", 200);
    } else if (day === 0 && cut === 1) {
      drawCutText("스타트 - 눈 뜨기기", 50);
      drawCutText("모든 컷은 임시로 g키를 누르면 넘어갑니다", 100);
    } else if (day === 0 && cut === 2) {
      drawCutText("1일차 1컷 - 일회용품 선택", 50);
      drawCutText("모든 컷은 임시로 g키를 누르면 넘어갑니다", 100);
      drawCutText("마우스로 일회용품 다회용품 클릭", 150);
    } else if (day === 0 && cut === 3) {
      drawCutText("1일차 2컷 - 쓰레기 투척 / 놀라는 사람", 50);
      drawCutText("모든 컷은 임시로 g키를 누르면 넘어갑니다", 100);
      drawCutText("화면 클릭시 쓰레기 투척(임시)", 150);
    } else if (day === 0 && cut === 4) {
      drawCutText("1일차 3컷 - 스페이스바로 음식, 입 묻고, 입 닦고", 50);
      drawCutText("모든 컷은 임시로 g키를 누르면 넘어갑니다", 100);
      drawCutText("스페이스바 2번 클릭시 라면의 양이 감소", 150);
    } else if (day === 1 && cut === 0) {
      drawCutText("2일차 1컷 - 일회용품 선택", 50);
      drawCutText("모든 컷은 임시로 g키를 누르면 넘어갑니다", 100);
      drawCutText(
        "나머지 모든 장면은 1일차와 동일하지만 더 많은 요소를 추가하여 극적인 효과 적용예정",
        150
      );
    } else if (day === 1 && cut === 1) {
      drawCutText("2일차 2컷 - 쓰레기 투척 / 놀라는 사람", 50);
      drawCutText("모든 컷은 임시로 g키를 누르면 넘어갑니다", 100);
      drawCutText(
        "나머지 모든 장면은 1일차와 동일하지만 더 많은 요소를 추가하여 극적인 효과 적용예정",
        150
      );
    } else if (day === 1 && cut === 2) {
      drawCutText("2일차 3컷 - 스페이스바로 음식, 입 묻고, 입 닦고", 50);
      drawCutText("모든 컷은 임시로 g키를 누르면 넘어갑니다", 100);
      drawCutText(
        "나머지 모든 장면은 1일차와 동일하지만 더 많은 요소를 추가하여 극적인 효과 적용예정",
        150
      );
    } else if (day === 2 && cut === 0) {
      drawCutText("3일차 1컷 - 일회용품 선택", 50);
      drawCutText("모든 컷은 임시로 g키를 누르면 넘어갑니다", 100);
      drawCutText(
        "나머지 모든 장면은 1일차와 동일하지만 더 많은 요소를 추가하여 극적인 효과 적용예정",
        150
      );
    } else if (day === 2 && cut === 1) {
      drawCutText("3일차 2컷 - 쓰레기 투척 / 놀라는 사람", 50);
      drawCutText("모든 컷은 임시로 g키를 누르면 넘어갑니다", 100);
      drawCutText(
        "나머지 모든 장면은 1일차와 동일하지만 더 많은 요소를 추가하여 극적인 효과 적용예정",
        150
      );
    } else if (day === 2 && cut === 2) {
      drawCutText("3일차 3컷 - 스페이스바로 음식, 입 묻고, 입 닦고", 50);
      drawCutText("모든 컷은 임시로 g키를 누르면 넘어갑니다", 100);
      drawCutText(
        "나머지 모든 장면은 1일차와 동일하지만 더 많은 요소를 추가하여 극적인 효과 적용예정",
        150
      );
    }
  }
}

function drawCutText(txt, pY) {
  push();
  fill(255); // 밝은 색으로
  textSize(30);
  textAlign(LEFT, TOP);
  text(txt, 50, pY);
  pop();
}

// 키 입력으로 컷 진행 임시시
function keyPressed() {
  if (key === "g") {
    isFading = true;
    fadeMode = "out";
    fadeAlpha = 0;
  }
  if (key === " ") {
    lamyenEat();
  }
}

function mousePressed() {
  throwTissu();

  if (day === 0 && cut === 1) {
    // 첫 번째 oneOb 클릭
    if (
      !hideOneOb[0] &&
      mouseX >= 100 &&
      mouseX <= 250 &&
      mouseY >= 250 &&
      mouseY <= 550
    ) {
      hideOneOb[0] = true;
    }
    // 두 번째 oneOb 클릭
    if (
      !hideOneOb[1] &&
      mouseX >= 300 &&
      mouseX <= 450 &&
      mouseY >= 250 &&
      mouseY <= 550
    ) {
      hideOneOb[1] = true;
    }
    // manyOb 클릭
    if (mouseX >= 1000 && mouseX <= 1150 && mouseY >= 250 && mouseY <= 550) {
      showX = true;
      xTimer = millis();
    }
  }
}

function throwTissu() {
  if (day === 0 && cut === 2) {
    isFlying = true;
    t = 0;
  }
}

//라면 먹기 함수
function lamyenEat() {
  count++;
  if (lamyenCount < 3) {
    if (count == 2) {
      lamyenCount++;
      count = 0;
      if (lamyenCount >= 2) {
        tissueCount++;
      }
    }
  }
}

// 다음 컷으로 넘어가기
function nextCut() {
  cut++;
  if (cut >= days[day].length) {
    cut = 0;
    day++;
  }
}

// 컷 데이터 초기화 함수
function daysData() {
  // 1일차 컷
  let day1 = [
    function () {
      push();
      background(0);
      pop();
    },
    function () {
      push();
      lamyenCount = 0;
      background(200);
      image(bgImages[day][cut], 0, 0, 1200, 800);

      // 눈 깜빡임(검은 사각형 위아래 닫혔다 열리기)
      noStroke();
      fill(0);
      rect(0, 0, width, h); // 위쪽 눈꺼풀
      rect(0, height - h, width, h); // 아래쪽 눈꺼풀

      pop();
    },
    function () {
      push();
      lamyenCount = 0;
      background(200);
      image(bgImages[day][cut], 0, 0, 1200, 800);

      if (!hideOneOb[0]) {
        image(oneOb, 100, 250, 150, 300);
      }
      if (!hideOneOb[1]) {
        image(oneOb, 300, 250, 150, 300);
      }
      image(manyOb, 1000, 250, 150, 300);
      charMoving = true;
      pop();
    },
    function () {
      push();
      background(220);
      image(bgImages[day][cut], 0, 0, 1200, 800);
      image(charImg, charX, charYBase + charWiggle, 100, 150); // 캐릭터 그리기
      pop();
    },
    function () {
      push();
      background(240);
      image(bgImages[day][cut], 0, 0, 1200, 800);
      image(lamyenImgaes[lamyenCount], 510, 380, 200, 200);
      if (lamyenCount >= 1) {
        image(manyTissue[tissueCount], 200, 400, 300, 300);
      }
      pop();
    },
  ];

  // 2일차 컷
  let day2 = [
    function () {
      push();
      lamyenCount = 0;
      background(200);
      image(bgImages[day][cut], 0, 0, 1200, 800);
      charMoving = true;
      charX = 0; // 캐릭터 위치 초기화
      pop();
    },
    function () {
      push();
      background(220);
      image(bgImages[day][cut], 0, 0, 1200, 800);
      pop();
    },
    function () {
      push();
      background(240);
      image(bgImages[day][cut], 0, 0, 1200, 800);
      pop();
    },
  ];

  // 3일차 컷
  let day3 = [
    function () {
      push();
      lamyenCount = 0;
      background(200);
      image(bgImages[day][cut], 0, 0, 1200, 800);
      charMoving = true;
      charX = 0; // 캐릭터 위치 초기화
      pop();
    },
    function () {
      push();
      background(220);
      image(bgImages[day][cut], 0, 0, 1200, 800);
      pop();
    },
    function () {
      push();
      background(240);
      image(bgImages[day][cut], 0, 0, 1200, 800);
      pop();
    },
  ];

  days = [day1, day2, day3];
}

//엔딩딩
function end() {
  push();
  background(0);
  imageMode(CENTER);
  translate(width / 2, height / 2); // 중심 기준
  scale(endZoom);
  image(endImage, 0, 0, 1200, 800); // 가운데 배치된 이미지

  // 확대 -> 축소 애니메이션
  if (endZooming) {
    endZoom -= 0.02; // 축소 속도 조절
    if (endZoom <= 1.0) {
      endZoom = 1.0;
      endZooming = false;
    }
  }
  resetMatrix();
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(
    "엔딩 끝!(조금더 세부적인 패이드 아웃 효과 적용예정) 🌍",
    width / 2,
    height / 2
  );

  pop();
}
