# Reinforcement Learning Library

## Info
A library using a single neural network for training an agend in an environment. The network can only consist of one hidden layer (update comming soon). All the neurons in the network use sigmoid activation function. The library inclused some function from the p5 library for drawing the network in the browser, so you can see how is the network currently structured and which neurons are firing in a given state of the agent. The library is using a rewarding system for learning, so you should be careful how you structure your environment and rewardings.

## How it works
You start by creating a neural network using the NeuralNetwork class. Then after building the environment you have to store information for an episode (how long it is, is your decision) with all the states the agent was, all the actions its taken and all the rewards it recieved, the total reward for the whole episode and the cycles (must match with the lengths of the states, actions and rewards). Then using the analyze function you pass that info as an object, the library will pick the best action for each state (with highest reward) and will train the agent toward this actions. Finaly you restart the episode and gather info for the next one.

## The episodeInfo object
An episode info object should have the following properties:
* states - list of all states the agent have been to
* actions - list of all the actions the agent has taken for the each of the states
* rewards - list of all the results that the agent has received for his action in the given states 
* totalReward - the total reward for the whole episode
* cycles - the count of the cycles

## Steps

### Create the brain (NeuralNetwork class)
Pass it the input, hidden, output nodes and a learning rate

### In the end of the episode call the analyze function
Pass it the episode information. The constrains are:

|State|Actions|Rewards|Total Reward|Cycles|
|-----|----|----|----|----|
|Each state should be an array and must match the input nodes of the network|Each action should be an index of the all possible actions in the environment and each action should be in range 0 to output nodes length - 1|Each reward should be normalized (max range -10 and 10)|The total reward can be any number but you should be careful of the relation between each reward and the total reward|A single number|

## Useful info
Use the assurance property to get the assurance of the last action the network took
