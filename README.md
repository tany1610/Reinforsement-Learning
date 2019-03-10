# Reinforsment-Learning

## Content
* Custom created library for reinforcement learning using neural networks
* Projects using p5 to test the library

## Projects
### Pick The Lighter
Neural network learning through reinforcement learning to pick the lightest of two colors. The network consists of 2 input neurons (the gray value of the two squares), 4 hidden neurons and 2 output neurons (to pick the left or the right square). Each time the network picks a side, it gets a reward and depending on the reward it decides whether the action it took was correct or not. Then it adjusts its weights depending on the reward. There is a possibility for picking a random auction instead of the action that the network decided is the best (exploration). With time however, the network becomes more confident of its decisions and the possibility for picking a random action decreases.

### Maze
A robot learning to find the screws in the environment and avoid going into the trash