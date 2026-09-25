const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Body = Matter.Body;

//엔진 객채 생성
let engine;

//바디 생성 
let cakebottom, caketop, ground, star, cherry, letter;
let sprinkles = [];
let bx, by, gx, gy, sx, sy, cx, cy, lx,ly;
let bw = 240;
let bh = 90;
let gw = 800;
let gh = 20;
let sw = 20;
let sh = 10;
let cr = 20;
let lw = 120;
let lh = 10;


function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  noStroke();

  engine = Engine.create();
  //engine.gravity.y = 3;
  //engine.gravity.x = 3;
 // engine.gravity.scale = 0.0001;

  //walls 
  let margin = 20;
  Composite.add(engine.world, [
    //Bodies.rectangle(width/2, height-margin, width, margin, {isStatic:true}),
    //Bodies.rectangle(width/2, margin, width, margin, {isStatic:true}),
    Bodies.rectangle(margin, height / 2, margin, height, {isStatic: true}),
    Bodies.rectangle(width - margin, height / 2, margin, height, {isStatic: true,
    }),
  ]);

  //box body
  caketop = Bodies.rectangle(width / 2, height -190 , 250, 170, {
    isStatic : true,
    fill: "#ff9d8a",
    chamfer: {
      radius: [90, 90, 40, 40],
    },
  });
  cakebottom = Bodies.rectangle(width/2, height - 80, bw, bh, {
    isStatic: true,
  });
  ground = Bodies.rectangle(width/2, height - 30, gw, gh, {
    isStatic: true,
  });
  
  //sprinkles
  for (let i = 0; i < 7; i++) {

    let sprinkle = Bodies.rectangle(
      random(width / 2-100, width / 2 + 100),
      random(-300, 0),sw,sh
    );
    sprinkles.push(sprinkle);
  }
  //sprinkle = Bodies.rectangle(width/2 , 30, sw, sh);
  star = Bodies.polygon(width / 2, 30 , 7, 20,
    {restitution: 0.2, 
    friction: 0.5,
    fill: color(255, 200, 0),
    strokeFill: color(50),
    label: "star",
  });
  cherry = Bodies.circle(width / 2, 30, cr,{restitution: 0.3, friction: 0.9});
  letter = Bodies.rectangle(width/2 , 30, lw, lh);

  //ball = Bodies.circle(width/2-100, 0, cr);
  //box = Bodies.rectangle(width / 2, 0, bw, bh );
  
  //add
  Composite.add(engine.world,[cakebottom, caketop, ground, ...sprinkles, star, cherry, letter]);
  Body.setAngularVelocity(letter, 0.2);
}


function draw() {
  background(250);
  Engine.update(engine);

  //position update 
  //bx = box.position.x;
  //by = box.position.y;
  //gx = ground.position.x;
  //gy = ground.position.y;
  bx = cakebottom.position.x;
  by = cakebottom.position.y;
  gx = ground.position.x;
  gy = ground.position.y;
  //sx = sprinkles.position.x;
  //sy = sprinkles.position.y;
  cx = cherry.position.x;
  cy = cherry.position.y;
  lx = letter.position.x;
  ly = letter.position.y;

  //caketop
  beginShape();
  fill(caketop.fill);
  strokeWeight(2);
  for(let v of caketop.vertices) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);

  //cakebottom
  fill("#573418");
  rect(bx, by, bw ,bh);
  //ground
  fill("#ffab89");
  rect(gx,gy,gw,gh);

  //sprinkle
  fill("#ff66d4");
  for (let sprinkle of sprinkles) {
    push();
    translate(sprinkle.position.x, sprinkle.position.y
    );
    rotate(sprinkle.angle);
    rect(0, 0, sw, sh);
    pop();
  }
  //rect(sx,sy,sw,sh);
  //star
  beginShape();
  fill(star.fill);
  stroke(star.strokeFill);
  for (let i = 0; i < star.vertices.length; i++) {
    let x = star.vertices[i].x;
    let y = star.vertices[i].y;
    vertex(x, y);
  }
  endShape(CLOSE);

  //cherry 
  fill("#ff4848");
  circle(cx, cy, cr*2);

  //letter
  push();
  fill(0,100,200);
  translate(lx,ly);
  rotate(letter.angle);
  rect(0, 0, lw, lh);
  pop();
}



  //circle
  //fill(255);
  //circle(cx,cy,cr*2);

