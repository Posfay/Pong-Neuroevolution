class Golyo {

  constructor() {
    this.x = GOLYO_KEZD_X;
    this.y = GOLYO_KEZD_Y;
    this.xVel = GOLYO_VELOCITY;
    this.diameter = GOLYO_DIAMETER;
    this.dead = false;
    this.counter = 0;
    this.top = this.y - (this.diameter / 2);
    this.bottom = this.y + (this.diameter / 2);
    this.left = this.x - (this.diameter / 2);
    this.right = this.x + (this.diameter / 2);
    this.yVel = random((-1 * Y_VEL_RANGE), (Y_VEL_RANGE));
    if (this.yVel < MIN_Y_VEL && this.yVel > -MIN_Y_VEL) {
      this.yVel = Y_VEL_RANGE / 2;
    }
  }

  update(balUto, jobbUto) {
    this.x += this.xVel;
    this.y += this.yVel;

    this.top = this.y - (this.diameter / 2);
    this.bottom = this.y + (this.diameter / 2);
    this.left = this.x - (this.diameter / 2);
    this.right = this.x + (this.diameter / 2);

    if ((this.top < 0) || (this.bottom > height)) {
      this.yVel = -1 * this.yVel;
    }
    if (((this.bottom > balUto.y) && (this.top < balUto.bottom)) && (this.left < balUto.right)) {
      this.xVel = (-1 * this.xVel);
      this.yVel += random(-GOLYO_VELOCITY/HANYAD_RESZE_YVEL_VALTOZIK, GOLYO_VELOCITY/HANYAD_RESZE_YVEL_VALTOZIK);
      this.x = balUto.right + (this.diameter / 2);

      balUto.hits++;
    }
    if (((this.bottom > jobbUto.y) && (this.top < jobbUto.bottom)) && (this.right > jobbUto.x)) {
      this.xVel = (-1 * this.xVel);
      this.yVel += random(-GOLYO_VELOCITY/HANYAD_RESZE_YVEL_VALTOZIK, GOLYO_VELOCITY/HANYAD_RESZE_YVEL_VALTOZIK);
      this.x = jobbUto.x - (this.diameter / 2);

      jobbUto.hits++;
    }

    if (this.xVel > GOLYO_VELOCITY) {
      this.xVel = GOLYO_VELOCITY;
    } else if (this.xVel < -GOLYO_VELOCITY) {
      this.xVel = -GOLYO_VELOCITY;
    }
    if (this.xVel < GOLYO_MIN_VELOCITY && this.xVel > -GOLYO_MIN_VELOCITY) {
      if (this.xVel < 0) {
        this.xVel = -GOLYO_VELOCITY;
      } else {
        this.xVel = GOLYO_VELOCITY;
      }
    }

    this.counter++;

    if (this.left < 0 || this.right > width || this.counter > 10 * 60 * 10 * slider.value()) {  //perc * 60 * frameRate/3 * slider.value() -> ha tul sokaig fut, tovabblep
      this.dead = true;
    } else {
      this.dead = false;
    }
  }

  isDead() {
    return this.dead;
  }

  show() {
    fill(255);
    stroke(255);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

}
