class Uto {

  constructor(oldal, brain) {
    this.y = kezdY;
    this.vel = UTO_VELOCITY;
    this.height = UTO_HEIGHT;
    this.width = UTO_WIDTH;
    if (oldal) {
      this.oldal = true;   //bal oldal = true
      this.x = UTO_DISTANCE_TO_SCREEN;
    } else {
      this.oldal = false;  //jobb oldal = false;
      this.x = width - this.width - UTO_DISTANCE_TO_SCREEN;
    }

    this.right = this.x + this.width;
    this.bottom = this.y + this.height;

    this.hits = 0;
    this.score = 0;
    this.fitness = 0;
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5,8,3);
    }
  }

  update() {
    //--------moving--------
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;

    this.score++;

    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > height - this.height) {
      this.y = height - this.height;
    }
  }

  think(cGolyo) {
    let inputs = [];
    inputs[0] = abs(this.x - cGolyo.x) / width;           //default inputs[0] SHOULD change
    if (this.oldal == BAL) {
      inputs[0] = abs(this.right - cGolyo.left) / width;  //horizontal distance between ball and paddle (left paddle)
    } else if (this.oldal == JOBB) {
      inputs[0] = abs(this.x - cGolyo.right) / width;     //horizontal distance between ball and paddle (right paddle)
    }
    inputs[1] = abs(cGolyo.y) / height;                   //ball's y coordinate
    inputs[2] = abs(cGolyo.xVel) / GOLYO_VELOCITY;        //ball's x velocity
    inputs[3] = cGolyo.yVel / Y_VEL_RANGE;                //ball's y velocity
    inputs[4] = (this.y + (this.height / 2)) / height;    //paddle's y coordinate

    let output = this.brain.predict(inputs);
    let maxI = 0;
    for (let i = 0; i < output.length; i++) {
      if (output[i] > output[maxI]) {
        maxI = i;
      }
    }

    // if (output[0] > output[1]) {
    //   this.moveUp();
    // } else {
    //   this.moveDown();
    // }

    if (maxI == 0) {
      //ne mozogjon
    } else if (maxI == 1) {
      //menjen felfelé
      this.moveUp();
    } else if (maxI == 2) {
      //menjen lefelé
      this.moveDown();
    }
  }

  moveUp() {
    this.y -= this.vel;
  }

  moveDown() {
    this.y += this.vel;
  }

  mutate() {
    this.brain.mutate(MUTATION_RATE);
  }

  show() {
    fill(255);
    stroke(255);
    rect(this.x, this.y, this.width, this.height);
  }

}
