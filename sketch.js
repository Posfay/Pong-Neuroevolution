const UTO_VELOCITY = 10;
const UTO_HEIGHT = 140;
const UTO_WIDTH = 40;
const UTO_DISTANCE_TO_SCREEN = 5;
const GOLYO_VELOCITY = 10;
const GOLYO_MIN_VELOCITY = 5;
const Y_VEL_RANGE = 6;
const MIN_Y_VEL = 2;
const GOLYO_DIAMETER = 20;
const HANYAD_RESZE_YVEL_VALTOZIK = 4;
const POPULATION_SIZE = 350;
const MUTATION_RATE = 0.1;

let counter = 0;
let GOLYO_KEZD_X;
let GOLYO_KEZD_Y;
const BAL = true;
const JOBB = false;
let showBestBoolean = false;
let gen = 1;
let kezdY;
let isGameRunning = false;
let leftScore = 0;
let rightScore = 0;
let slider, showBtn;
let allTimeBestShowing = false;
let bestVersusCurrent = false;

let kezdBalUto, kezdJobbUto;
let golyo;
let golyoPause;
let bestJobb, bestBal;
let prevBal, prevJobb;
let leftBrainJSON, rightBrainJSON;

let savedBal = [];
let savedJobb = [];
let jobbUtok = [];
let balUtok = [];
let golyok = [];

function preload() {
  leftBrainJSON = loadJSON("leftBrain.json");
  rightBrainJSON = loadJSON("rightBrain.json");
}

function setup() {
  createCanvas(800,600);
  slider = createSlider(1, 100, 1);
  showBtn = createButton("Show Best");
  showBtn.mousePressed(btnPressed);
  kezdY = (height / 2) - (UTO_HEIGHT / 2);
  kezdBalUto = new Uto(BAL);
  kezdJobbUto = new Uto(JOBB);
  GOLYO_KEZD_X = width / 2;
  GOLYO_KEZD_Y = height / 2;
  golyo = new Golyo();
  prevBal = new Uto(BAL);
  prevJobb = new Uto(JOBB);
  for (let i = 0; i < POPULATION_SIZE; i++) {
    balUtok[i] = new Uto(BAL);
    jobbUtok[i] = new Uto(JOBB);
    golyok[i] = new Golyo();
  }
}

function draw() {
  if (isGameRunning && !showBestBoolean) {
    for (let n = 0; n < slider.value(); n++) {

      for (let i = 0; i < POPULATION_SIZE; i++) {

        if (!golyok[i].isDead()) {
          jobbUtok[i].think(golyok[i]);
          balUtok[i].think(golyok[i]);
          balUtok[i].update();
          jobbUtok[i].update();
          golyok[i].update(balUtok[i], jobbUtok[i]);
        }

        if (golyok[i].isDead()) {
          savedJobb[i] = jobbUtok[i];
          savedBal[i] = balUtok[i];
        }
        //console.log(counter);
      }

      if (everyoneDead()) {
        nextGeneration();
      }

    }

    background(0);
    balUtok[0].show();
    jobbUtok[0].show();
    golyok[0].show();
    fill(255,0,0);
    stroke(255,0,0);
    textAlign(CENTER);
    textSize(32);
    text(gen+"", width - 50, 50);


  } else if (!isGameRunning && !showBestBoolean) {
    background(0);
    kezdJobbUto = new Uto(JOBB);
    kezdBalUto = new Uto(BAL);
    golyoPause = new Golyo();
    kezdJobbUto.show();
    kezdBalUto.show();
    golyoPause.show();


  //best is playing
  } else if (showBestBoolean) {
    for (let n = 0; n < slider.value(); n++) {
      if (golyo.left < 0) {
        golyo = new Golyo();
        rightScore++;
      }
      if (golyo.right > width) {
        golyo = new Golyo();
        golyo.xVel = -1 * golyo.xVel;
        leftScore++;
      }

      prevJobb.think(golyo);
      prevBal.think(golyo);
      prevJobb.update();
      prevBal.update();
      golyo.update(prevBal, prevJobb);
    }
    background(0);
    strokeWeight(5);
    fill(255);
    line(width/2, 0, width/2, height);
    strokeWeight(1);
    prevBal.show();
    prevJobb.show();
    golyo.show();
    fill(255, 0, 0);
    stroke(255, 0, 0);
    textAlign(CENTER);
    textSize(32);
    text(leftScore, width / 2 - 60, 50);
    text(rightScore, width / 2 + 60, 50);
    stroke(255);
    strokeWeight(1);
    fill(255);
    textSize(13);
    if (allTimeBestShowing) {
      text("All time best is playing", width - 70, 27);
    } else if (bestVersusCurrent) {
      stroke(255);
      strokeWeight(1);
      fill(255);
      textSize(13);

      text("Current trained", 60, 27);
      text("All time best", width - 50, 27);
    }
  }
}

function keyPressed() {
  if (keyCode == ENTER) {
    isGameRunning = !isGameRunning;
    rightScore = 0;
    leftScore = 0;
  } else if (key === 'B') {
    saveJSON(prevBal.brain, 'leftBrain.json');
  } else if (key === 'J') {
    saveJSON(prevJobb.brain, 'rightBrain.json');
  } else if (key === 'L') {
    if (!allTimeBestShowing) {
      let balBrain = NeuralNetwork.deserialize(leftBrainJSON);
      let jobbBrain = NeuralNetwork.deserialize(rightBrainJSON);
      prevBal = new Uto(BAL, balBrain);
      prevJobb = new Uto(JOBB, jobbBrain);
      leftScore = 0;
      rightScore = 0;
      golyo = new Golyo();
      allTimeBestShowing = true;
    }
  } else if (key === 'V') {
    if (!allTimeBestShowing && !bestVersusCurrent) {
      let jobbBrain = NeuralNetwork.deserialize(rightBrainJSON);
      prevJobb = new Uto(JOBB, jobbBrain);
      leftScore = 0;
      rightScore = 0;
      golyo = new Golyo();
      bestVersusCurrent = true;
    }
  }
}

function btnPressed() {
  // let maxJobbI = 0;
  // let maxBalI = 0;
  // for (let i = 0; i < POPULATION_SIZE; i++) {
  //   if (jobbUtok[i].fitness > jobbUtok[maxJobbI].fitness) {
  //     maxJobbI = i;
  //   }
  //   if (balUtok[i].fitness > balUtok[maxBalI].fitness) {
  //     maxBalI = i;
  //   }
  // }
  //
  // bestBal = balUtok[maxBalI];
  // bestJobb = jobbUtok[maxJobbI];

  showBestBoolean = !showBestBoolean;

  isGameRunning = false;
  golyo = new Golyo();
  leftScore = 0;
  rightScore = 0;

  if (showBestBoolean) {
    showBtn.html("Continue Training");
  } else {
    showBtn.html("Show Best");
    allTimeBestShowing = false;
    bestVersusCurrent = false;
  }
}

function everyoneDead() {
  for (let i = 0; i < POPULATION_SIZE; i++) {
    if (golyok[i].isDead() == false) {
      return false;
    }
  }
  return true;
}
