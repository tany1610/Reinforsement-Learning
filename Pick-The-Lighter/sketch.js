let left_square_col;
let right_square_col;
let reward = 0;
let totalReward = 0;
let choice;
let brain;
let actions;
let rateSlider;
let assuredness;

function setup() {
  createCanvas(800, 800);
  rateSlider = createSlider(1, 120, 1, 1);
  rateSlider.position(250, 130);
  // creating the neural network
  brain = new NeuralNetwork(2, 4, 2, 0.1);
  left_square_col = floor(random(255));
  right_square_col = floor(random(255));

  // possible actions
  actions = [left, right];

  // debugging
  // console.log(output);
  // console.log(action);
}

function draw() {
  background(0);
  frameRate(rateSlider.value());
  translate(width / 2, height / 2);

  // creating inputs
  let x1 = map(left_square_col, 0, 255, 0, 1);
  let x2 = map(right_square_col, 0, 255, 0, 1);

  // creating the current state
  let state = [x1, x2];

  // taking an action
  let choice = brain.predict(state);
  let chosenAction = choice.indexOf(max(choice));
  let randomAction = choice.indexOf(random(choice));
  let action;

  // getting the assuredness of the network
  assuredness = brain.getAssuredness(choice);
  if (random(1) < assuredness) {
    action = chosenAction;
  } else {
    action = randomAction;
  }
  actions[action]();

  // accumulating reward
  brain.accumulateReward(state, action, reward);

  // drawing game
  drawGame();

  // drawing neural network
  brain.draw(200, -400);

  // next iteration
  nextEpisode();
}

function drawGame() {
  if (choice === 'left') {
    fill(255);
    triangle(-10, -10, -10, 20, -35, 5);
  } else if (choice === 'right') {
    fill(255);
    triangle(10, -10, 10, 20, 35, 5);
  }
  textSize(32);
  stroke(255);
  strokeWeight(0.1);
  text("Reward: " + reward.toFixed(2), -350, -350);
  text("Total Reward: " + totalReward.toFixed(2), -350, -300);
  text("Frame Rate: ", -350, -250);
  text("Assured of current action: " + (assuredness * 100).toFixed(2) + "%", -350, -200);
  fill(left_square_col);
  noStroke();
  rect(-150, -50, 100, 100);
  fill(right_square_col);
  noStroke();
  rect(50, -50, 100, 100);
}

function left() {
  let diff = -(right_square_col - left_square_col);
  choice = 'left';
  let mappedDiff = map(diff, -255, 255, -1, 1);
  if (mappedDiff < 0) {
    reward = map(mappedDiff, -1, 0, -1, -0.1);
  } else {
    reward = map(mappedDiff, 0, 1, 1, 0.7);
  }
  totalReward += reward;
}

function right() {
  let diff = -(left_square_col - right_square_col);
  choice = 'right';
  let mappedDiff = map(diff, -255, 255, -1, 1);
  if (mappedDiff < 0) {
    reward = map(mappedDiff, -1, 0, -1, -0.1);
  } else {
    reward = map(mappedDiff, 0, 1, 1, 0.7);
  }
  totalReward += reward;
}

function nextEpisode() {
  left_square_col = floor(random(255));
  right_square_col = floor(random(255));
}