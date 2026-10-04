const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Body = Matter.Body;
const Events = Matter.Events;

//엔진 객채 생성
let engine;

//바디 생성 
let mosquitos = [];
let nextSpawn;
let electric = false;
let electricTimer = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  noStroke();

  engine = Engine.create();
  engine.gravity.y = 0.02;


    // 첫 모기가 생성될 시간
  //nextSpawn = frameCount + random(10, 80);

  for (let i = 0; i < 10; i++) {
    createMosquito();
  }

  nextSpawn = frameCount + random(10, 80);
  // Enter 키 이벤트 등록
  window.addEventListener("keydown", handleKeydown);
  
  // --------------------
  // 모기끼리 충돌
  // --------------------

  Events.on(engine, "collisionStart", function(event) {

    for (let pair of event.pairs) {

      let a = pair.bodyA;
      let b = pair.bodyB;


      let indexA = mosquitos.indexOf(a);
      let indexB = mosquitos.indexOf(b);


      // 둘 다 모기라면
      if (indexA !== -1 && indexB !== -1) {

        // Matter.js 세계에서 제거
        Composite.remove(engine.world, a);
        Composite.remove(engine.world, b);


        // 배열에서 제거

        mosquitos.splice(indexA, 1);


        // 하나를 삭제하면 index가 바뀌므로
        // 다시 찾아서 삭제

        let indexB2 = mosquitos.indexOf(b);

        if (indexB2 !== -1) {

          mosquitos.splice(indexB2, 1);

        }

      }

    }

  });

}



function draw() {
  background(250);
  Engine.update(engine);

  // --------------------
  // 모기 생성
  // --------------------

  if (frameCount >= nextSpawn) {

    createMosquito();

    nextSpawn = frameCount + random(10, 80);

  }


  // --------------------
  // 모기에게 랜덤한 힘 주기
  // --------------------

  for (let mosquito of mosquitos) {

  // 감전된 모기
  if (mosquito.isDead) {
    // 아래로 떨어지게
    Body.applyForce(
      mosquito,
      mosquito.position,
      {
        x: 0,
        y: 0.0001
      }
    );

    continue;
  }


    //살아있는 모기
  // 랜덤하게 방향을 바꾸는 힘
  let randomForceX = random(-0.0003, 0.0003);
  let randomForceY = random(-0.0003, 0.0003);

  // 아래로 떨어지면 위쪽으로 밀어줌
  let liftForce = 0;

  if (mosquito.position.y > height * 0.6) {
    liftForce = -0.0008;
  }

  Body.applyForce(
    mosquito,
    mosquito.position,
    {
      x: randomForceX,
      y: randomForceY + liftForce
    }
  );


  }
  
// --------------------
// 전기
// --------------------

if (electric) {

  // 전기 지속 시간
  electricTimer--;

  // 전기 그리기
  drawElectric();


  // 전기에 닿은 모기 제거
  for (let i = mosquitos.length - 1; i >= 0; i--) {

    let mosquito = mosquitos[i];

    let x = mosquito.position.x;
    let y = mosquito.position.y;


    if (
      !mosquito.isDead &&
      abs(y - height / 2) < 40
    ) {

      mosquito.isDead = true;

      // 날아가던 속도 멈추기
      Body.setVelocity(
        mosquito,
        {
          x: 0,
          y: 0
        }
      );

    // 빙글빙글 회전
    Body.setAngularVelocity(
      mosquito,
      random(-0.15, 0.15)
    );

    // 공중에 붙잡혀 있지 않게
    mosquito.frictionAir = 0;

  
  }
}

  // 시간이 끝나면 전기 제거
  if (electricTimer <= 0) {
    electric = false;
  }
}


  // --------------------
  // 모기 그리기
  // --------------------

  for (let mosquito of mosquitos) {

  let x = mosquito.position.x;
  let y = mosquito.position.y;

  push();

  translate(x, y);

  // Matter.js의 회전값을 그림에도 적용
  rotate(mosquito.angle);

  // 몸
  fill(50);
  ellipse(0, 0, 20, 20);

  // 날개
  fill(180);
  ellipse(-10, -5, 15, 8);
  ellipse(10, -5, 15, 8);

  // 침
  stroke(20);
  strokeWeight(2);
  line(0, 10, 0, 17);
  noStroke();

  pop();
}

  for (let i = mosquitos.length - 1; i >= 0; i--) {

  let mosquito = mosquitos[i];

  if (mosquito.position.y > height + 50) {

    Composite.remove(
      engine.world,
      mosquito
    );

    mosquitos.splice(i, 1);
  }
}

}


///////////////////////////
// --------------------
// 모기 생성 함수
// --------------------

function createMosquito() {

  let size = random(8, 15);


  let mosquito = Bodies.circle(
    random(50, width - 50),
    random(50, height / 2),
    size,
    {

      restitution: 0.8,

      friction: 0,

      frictionAir: 0.01

    }
  );  

  mosquito.isDead = false;


  mosquitos.push(mosquito);

  Composite.add(
    engine.world,
    mosquito
  );


  // 처음 생성될 때
  // 랜덤한 방향으로 날아가게

  Body.setVelocity(
    mosquito,
    {
      x: random(-2, 2),
      y: random(-2, 2)
    }
  );

}

////////////////////////////
function drawElectric() {

  let centerY = height / 2;

  stroke(255, 220, 0);
  strokeWeight(4);

  noFill();

  beginShape();

  // 시작점
  vertex(0, centerY);

  // 지글지글한 선 만들기

  for (let x = 0; x <= width; x += 20) {

    let y = centerY + random(-25, 25);

    vertex(x, y);

  }

  endShape();

  noStroke();

}

// --------------------
// 클릭하면 모기 삭제
// --------------------

function mousePressed() {

  for (let i = mosquitos.length - 1; i >= 0; i--) {

    let mosquito = mosquitos[i];


    let d = dist(
      mouseX,
      mouseY,
      mosquito.position.x,
      mosquito.position.y
    );


    if (d < 15) {

      Composite.remove(
        engine.world,
        mosquito
      );

      mosquitos.splice(i, 1);

    }

  }

}

// --------------------
// Enter → 전기
// --------------------


function handleKeydown(event) {


  if (event.key === "Enter") {

    console.log("전기파리채!");

    electric = true;
    electricTimer = 20;

  }

}

