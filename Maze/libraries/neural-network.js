class NeuralNetwork {
  constructor(inputNodes, hiddenNodes, outputNodes, learningRate) {
    this.inputNodes = inputNodes;
    this.hiddenNodes = hiddenNodes;
    this.outputNodes = outputNodes;

    this.inputHiddenWeights = new Matrix(hiddenNodes, inputNodes);
    this.inputHiddenWeights.randomize();
    this.hiddenOutputWeights = new Matrix(outputNodes, hiddenNodes);
    this.hiddenOutputWeights.randomize();

    this.hiddenBias = new Matrix(hiddenNodes, 1);
    this.hiddenBias.randomize();
    this.outputBias = new Matrix(outputNodes, 1);
    this.outputBias.randomize();
    this.learningRate = learningRate;

    this.hiddenNodesActivation = [];
    for (let i = 0; i < hiddenNodes; i++) {
      this.hiddenNodesActivation.push(0);
    }

    this.outputNodesActivation = [];
    for (let i = 0; i < outputNodes; i++) {
      this.outputNodesActivation.push(0);
    }

    this.assuredness = 0;
	this.lastAnalysis = {};
  }

  predict(inputs) {
    let inputsM = Matrix.fromArray(inputs);

    // generate hidden result
    let hidden = Matrix.multiply(this.inputHiddenWeights, inputsM);

    // adding the bias
    hidden.add(this.hiddenBias);

    // activate
    hidden.map(sigmoid);

    setActivation(hidden, this.hiddenNodesActivation);

    // generate output result
    let output = Matrix.multiply(this.hiddenOutputWeights, hidden);

    // adding the bias
    output.add(this.outputBias);
    
    // activate
    output.map(sigmoid);

    setActivation(output, this.outputNodesActivation);

    return Matrix.toArray(output);
  }

  train(inputArr, targetArr) {
    let inputsM = Matrix.fromArray(inputArr);
    let targetM = Matrix.fromArray(targetArr);

    // generate hidden result
    let hidden = Matrix.multiply(this.inputHiddenWeights, inputsM);

    // adding the bias
    hidden.add(this.hiddenBias);

    // activate
    hidden.map(sigmoid);

    setActivation(hidden, this.hiddenNodesActivation);

    // generate output result
    let output = Matrix.multiply(this.hiddenOutputWeights, hidden);

    // adding the bias
    output.add(this.outputBias);

    // activate
    output.map(sigmoid);

    setActivation(output, this.outputNodesActivation);

    // calculate output errors
    let outputErrors = Matrix.subtract(targetM, output);

    // calculate output gradient
    output.map(sigmoidD);
    output.multiply(outputErrors);
    output.multiply(this.learningRate);
    
    // calculate hidden->output deltas
    let hiddenT = Matrix.transpose(hidden);
    let hiddenOutputDeltas = Matrix.multiply(output, hiddenT);

    // adjusting weights and biases
    this.hiddenOutputWeights.add(hiddenOutputDeltas);
    this.outputBias.add(output);

    // calculate hidden errors
    let hiddenOutputWeightsT = Matrix.transpose(this.hiddenOutputWeights);
    let hiddenErrors = Matrix.multiply(hiddenOutputWeightsT, outputErrors);

    // calculate hidden gradient
    hidden.map(sigmoidD);
    hidden.multiply(hiddenErrors);
    hidden.multiply(this.learningRate);

    // calculate input->hidden deltas
    let inputsMT = Matrix.transpose(inputsM);
    let inputHiddenWeightsDeltas = Matrix.multiply(hidden, inputsMT);

    // adjusting weights and biases
    this.inputHiddenWeights.add(inputHiddenWeightsDeltas);
    this.hiddenBias.add(hidden);
  }

  chooseAction(state) {
    let choice = this.predict(state);
    let chosenAction = choice.indexOf(max(choice));
    let randomAction = choice.indexOf(random(choice));
    let action;

    // getting the assuredness of the network
    this.assuredness = this.getAssuredness(choice) * 100;
    if (random(100) < this.assuredness) {
      action = chosenAction;
    } else {
      action = randomAction;
    }

    return action;
  }

  analyze (episodeInfo, epochs) {
    let analysis = {};
    // get highest reward for each state
    for (let i = 0; i < episodeInfo.cycles; i++) {
      episodeInfo.rewards[i] = (i / episodeInfo.rewards.length + episodeInfo.rewards[i]) + totalReward;
      let currState = [...episodeInfo.states[i]];
      if (!analysis[currState]) {
        analysis[currState] = {
          action: episodeInfo.actions[i],
          reward: episodeInfo.rewards[i]
        }
      } else {
        if (analysis[currState].reward < episodeInfo.rewards[i]) {
          analysis[currState] = {
            action: episodeInfo.actions[i],
            reward: episodeInfo.rewards[i]
          }
        }
      }
    }

    for (let i = 0; i < epochs; i++) {
      for (let stateKey in analysis) {
        let state = stateKey.split(',').map(Number);
        let action = analysis[stateKey].action;
        let reward = analysis[stateKey].reward;
        brain.accumulateReward(state, action, reward);
      }
    }
	
	this.lastAnalysis = analysis;
  }

  calculateTargets(output, action, reward) {
    let result = [];
    for (let i = 0; i < output.length; i++) {
      if (i === action) {
        result[i] = (output[i] + reward) * this.learningRate;
      } else {
        result[i] = (output[i] - reward) * this.learningRate;
      }
    }
    return result;
  }

  accumulateReward(state, action, reward) {
    let output = this.predict(state);
    let targets = this.calculateTargets(output, action, reward);
    this.train(state, targets);
  }

  print() {
    this.inputHiddenWeights.print();
    this.hiddenOutputWeights.print();
  }

  getAssuredness(choice) {
    let sorted = choice.sort((a, b) => b - a);
    let max = sorted[0];
    let diff = 0;
    for (let i = 1; i < sorted.length; i++) {
      diff += Math.abs(max - sorted[i]);
    }
    return diff / (sorted.length - 1);
  }

  // using p5
  draw(x, y) {
    // drawing the input->hidden weights
    let startX = x;
    let startY = y + this.hiddenNodes * 20;
    for (let i = 0; i < this.inputNodes; i++) {
      let endX = x + 100;
      let endY = y + this.inputNodes * 20;
      for (let j = 0; j < this.hiddenNodes; j++) {
        stroke(255);
        strokeWeight(map(this.inputHiddenWeights.value[j][i], -10, 10, 1, 5))
        line(startX, startY, endX, endY);
        endY += 40;
      }
      startY += 40;
    }

    // drawing the hidden->output weights
    startX = x + 100;
    startY = y + this.inputNodes * 20;
    for (let i = 0; i < this.hiddenNodes; i++) {
      let endX = startX + 100;
      let endY = y + (this.hiddenNodes * 20 + this.inputNodes * 20) - Math.min(this.hiddenNodes * 20, this.outputNodes * 20);
      for (let j = 0; j < this.outputNodes; j++) {
        stroke(255);
        strokeWeight(map(this.hiddenOutputWeights.value[j][i], -10, 10, 1, 5))
        line(startX, startY, endX, endY);
        endY += 40;
      }
      startY += 40;
    }

    // drawing the input nodes
    let currX = x;
    let currY = y + this.hiddenNodes * 20;
    for (let i = 0; i < this.inputNodes; i++) {
      stroke(255);
      strokeWeight(2);
      fill(0);
      ellipse(currX, currY, 20);
      currY += 40;
    }

    currY = y + this.inputNodes * 20;
    currX = x + 100;

    // drawing the hidden nodes
    for (let i = 0; i < this.hiddenNodes; i++) {
      stroke(255);
      strokeWeight(2);
      fill(this.hiddenNodesActivation[i]);
      ellipse(currX, currY, 20);
      currY += 40;
    }

    // drawing the output nodes
    currY = y + (this.hiddenNodes * 20 + this.inputNodes * 20) - Math.min(this.hiddenNodes * 20, this.outputNodes * 20);
    currX += 100;
    for (let i = 0; i < this.outputNodes; i++) {
      stroke(255);
      strokeWeight(2);
      fill(this.outputNodesActivation[i]);
      ellipse(currX, currY, 20);
      currY += 40;
    }
  }
}

function setActivation(nodes, actions) {
  for (let row = 0; row < nodes.rows; row++) {
    let color = floor(map(nodes.value[row][0], 0, 2, 0, 255));
    actions[row] = color;
  }
}

// activation functions
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function sigmoidD(y) {
  return y * (1 - y);
}