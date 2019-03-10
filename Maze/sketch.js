const squares = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];
let reward = 0;
let totalReward = 0;
let brain;
let episodeInfo = {
  actions: [],
  states: [],
  rewards: [],
  totalReward: 0,
  cycles: 0
};
let speedSlider;

// images
let robbyImg;
let wallImg;
let trashImg;
let rewardImg;

// environment
let robbyPos;
let wallPos;
let trashPos;
let rewardPos;

// actions
let actions = [up, right, down, left];

function setup() {
  createCanvas(1300, 900);
  robbyImg = loadImage('robby.png');
  wallImg = loadImage('wall.png');
  trashImg = loadImage('trash.png');
  rewardImg = loadImage('reward.png');
  speedSlider = createSlider(1, 120, 1, 1);
  speedSlider.position(910, 160);
  setUpEnv();
  brain = new NeuralNetwork(2, 10, 4, 0.2);
}

function draw() {
  background(0);
  // taking an action
  frameRate(speedSlider.value());

  // draw brain
  brain.draw(950, 150);

  // drawing the game
  drawGame();

  let action = brain.chooseAction(robbyPos);

  // taking action and recording actions and states
  episodeInfo.states.push([...robbyPos]);
  actions[action]();
  episodeInfo.actions.push(action);
  episodeInfo.cycles++;
  
  // checking for win or lose
  if (robbyPos[0] == rewardPos[0] && robbyPos[1] == rewardPos[1]) {
    // reset
    reward = 2;
    episodeInfo.rewards.push(reward);
    nextEpisode();
  } else if (robbyPos[0] == trashPos[0] && robbyPos[1] == trashPos[1]) {
    // reset
    reward = -2;
    episodeInfo.rewards.push(reward);
    nextEpisode();
  } else {
    reward = -0.01;
    totalReward += reward;
    episodeInfo.rewards.push(reward);
  }
}

function nextEpisode() {
  totalReward += reward;
  episodeInfo.totalReward = totalReward;
  
  // sum up episode
  brain.analyze(episodeInfo);

  episodeInfo = {
    actions: [],
    states: [],
    rewards: [],
    totalReward: 0,
    cycles: 0
  }

  totalReward = 0;

  setUpEnv();
}

function setUpEnv() {
  robbyPos = [0, 2];
  wallPos = [0, 1];
  trashPos = [2, 0];
  rewardPos = [0, 0];
}

function drawGame() {
  let i = 0;
  let j = 0;
  for (let row = 0; row < squares.length; row++) {
    for (let col = 0; col < squares[row].length; col++) {
      stroke(255);
      noFill();
      rect(i, j, 900 / squares[row].length, 900 / squares.length);
      if (robbyPos[0] == row && robbyPos[1] == col) {
        image(robbyImg, i + 25, j + 25, 250, 250);
      }
      if (wallPos[0] == row && wallPos[1] == col) {
        image(wallImg, i + 25, j + 25, 250, 250);
      }
      if (trashPos[0] == row && trashPos[1] == col) {
        image(trashImg, i + 25, j + 25, 250, 250);
      }
      if (rewardPos[0] == row && rewardPos[1] == col) {
        image(rewardImg, i + 25, j + 25, 250, 250);
      }
      i += 300;
    }
    i = 0;
    j += 300;
  }
  textSize(28);
  strokeWeight(2);
  fill(255);
  text('Reward: ' + reward, 910, 50);
  text('Total Reward: ' + totalReward.toFixed(2), 910, 100);
  text('Assured of last action: ' + brain.assuredness.toFixed(2) + "%", 910, 150);
}

// human playing
function keyPressed() {
  if (keyCode === UP_ARROW) {
    if (robbyPos[0] - 1 >= 0 && (robbyPos[0] - 1 !== wallPos[0] || robbyPos[1] !== wallPos[1])) {
      robbyPos[0]--;
    }
  } else if (keyCode === DOWN_ARROW) {
    if (robbyPos[0] + 1 < squares[0].length && (robbyPos[0] + 1 !== wallPos[0] || robbyPos[1] !== wallPos[1])) {
      robbyPos[0]++;
    }
  } else if (keyCode == LEFT_ARROW) {
    if (robbyPos[1] - 1 >= 0 && (robbyPos[1] - 1 !== wallPos[1] || robbyPos[0] !== wallPos[0])) {
      robbyPos[1]--;
    }
  } else if (keyCode == RIGHT_ARROW) {
    if (robbyPos[1] + 1 < squares.length && (robbyPos[1] + 1 !== wallPos[1] || robbyPos[0] !== wallPos[0])) {
      robbyPos[1]++;
    }
  }
}

// robot playing
function up() {
  if (robbyPos[0] - 1 >= 0 && (robbyPos[0] - 1 !== wallPos[0] || robbyPos[1] !== wallPos[1])) {
    robbyPos[0]--;
  }
}

function down() {
  if (robbyPos[0] + 1 < squares[0].length && (robbyPos[0] + 1 !== wallPos[0] || robbyPos[1] !== wallPos[1])) {
    robbyPos[0]++;
  }
}

function right() {
  if (robbyPos[1] + 1 < squares.length && (robbyPos[1] + 1 !== wallPos[1] || robbyPos[0] !== wallPos[0])) {
    robbyPos[1]++;
  }
}

function left() {
  if (robbyPos[1] - 1 >= 0 && (robbyPos[1] - 1 !== wallPos[1] || robbyPos[0] !== wallPos[0])) {
    robbyPos[1]--;
  }
}