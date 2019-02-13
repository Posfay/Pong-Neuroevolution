function nextGeneration() {
  gen++;
  calculateFitness();
  for (let i = 0; i < POPULATION_SIZE; i++) {
    golyok[i] = new Golyo();
  }

  let maxJobbI = 0;
  let maxBalI = 0;
  for (let i = 0; i < POPULATION_SIZE; i++) {
    if (savedJobb[i].fitness > savedJobb[maxJobbI].fitness) {
      maxJobbI = i;
    }
    if (savedBal[i].fitness > savedBal[maxBalI].fitness) {
      maxBalI = i;
    }
  }
  jobbUtok[0] = new Uto(JOBB, savedJobb[maxJobbI].brain);
  balUtok[0] = new Uto(BAL, savedBal[maxBalI].brain);
  prevJobb = jobbUtok[0];
  prevBal = balUtok[0];

  for (let i = 1; i < POPULATION_SIZE; i++) {
    balUtok[i] = pickOne(savedBal, BAL);
    jobbUtok[i] = pickOne(savedJobb, JOBB);
    //console.log("childs picked");
  }

  savedBal = [];
  savedJobb = [];
}

function pickOne(utokArray, side) {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    //console.log("while index: " + index);
    r = r - utokArray[index].fitness;
    index++;
  }
  index--;
  //console.log("Index after next gen: " + index);
  let regiUto = utokArray[index];
  let child;
  if (side == BAL) {
    child = new Uto(BAL, regiUto.brain);
  } else {
    child = new Uto(JOBB, regiUto.brain);
  }
  child.mutate();
  return child;
}

function calculateFitness() {
  let sumJobb = 0;
  let sumBal = 0;
  let sumJobbHits = 0;
  let sumBalHits = 0;
  const HIT_VALUE = 50;
  for (let cUto of savedJobb) {
    sumJobb += cUto.score;
    sumJobbHits += cUto.hits * HIT_VALUE;
  }
  for (let cUto of savedBal) {
    sumBal += cUto.score;
    sumBalHits += cUto.hits * HIT_VALUE;
  }
  for (let cUto of savedJobb) {
    cUto.fitness = (cUto.score + (cUto.hits * HIT_VALUE)) / (sumJobb + sumJobbHits);
  }
  for (let cUto of savedBal) {
    cUto.fitness = (cUto.score + (cUto.hits * HIT_VALUE)) / (sumBal + sumBalHits);
  }
}
