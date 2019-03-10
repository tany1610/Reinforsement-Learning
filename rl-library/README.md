# Reinforcement Learning Library

## Create episodeInfo object
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
|Each state should be an array and must match the input nodes of the network|Each action should be an index of the all possible actions in the environment|Each reward should be normalized (max range -10 and 10)|The total reward can be any number but you should be careful of the relation between each reward and the total reward|A single number

## Useful info
Use the assurance property to get the assurance of the last action the network took