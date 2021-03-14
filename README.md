# Exercise 1 - Interactive Long Division

The interactive long division game uses a very traditional gameloop structure. The code is sorted into a single class where it keeps track of all the game variables, gamestate, and current representation of the equation's appearance when printed to the terminal.

The game will continue in a loop, going through the following phases:

- Setup (occurs only once), where the player of the game either chooses a random long division problem or inserts their own values

- Short Division, where the player decides how many times the divisor can go into the previously figured sub-number of the dividend

- Multiplication, where the previously figured result is multiplied by the dividend

- Subtraction, where the previously figured result is subtracted from the current sub-number of the dividend

- Remainder, where the next number in placevalue is brought down for the gameloop to repeat

If the player fails to solve a step 3 or more times, a hint with the answer will be provided.

Once the remainder is lower than the divisor, the game is over.

### Running The Game

1. `cd ./class-hero/exercise1`
2. `python longdiv.py`

# Exercise 2 - Sampling From a Large Collection

This algorithm is largely made of two functions - createUniqueQnodesHashmap and sampleQnodes. Each of these functions utilizes various helper functions throughout the project.

## The createUniqueQnodesHashmap Function

This function takes one parameter - the number of qNodes to create. It works by iterating n times for each node to create. During this time, it will use two helper functions: makeId and buildRandomEquation.

The makeId function accepts the number of characters that the operator wants to use in the randomly created ID. For our purposes we will be passing "10".

The buildRandomEquation accepts one parameter as well: difficulty. Since createUniqueQnodesHashmap has functionality to increment difficulty in every iteration of the loop, this value will be automatically passed from 1-100 until all qNodes have been created. It will select a random operator and numbers to use in the equation based on the difficulty, being certain to prevent certain results such as negative solutions to equations under a high level of difficulty of course.

Since it's very possible that over the course of creating 10,000 qNodes we may encounter duplicate equations and IDs, we track the state of these in arrays in order to prevent this. Generally over 10,000 iterations we only encounter about 300 or so duplicates. There is functionality within this code that an operator may uncomment to test this for themselves.

Such as the name of the function suggests, the qNodes are stored in a dictionary where they are dynamically sorted by difficulty during creation.

## The sampleQnodes Function

The sampleQnodes function accepts 4 parameters: numSets, numQuestionsPerSet, difficultyProgression, representation. The number of sets will be, as it sounds, the number of sets that contains a particular numQuestionsPerSet. The difficultyProgression accepts three different parameters - "linear", "exponential", and "logarithmic" which will dynamically manipulate the difficulty variable as needed. The representation variable refers to the data structure that the samples will be returned in.

The basic workflow of sampleQnodes works in the following way:

The algorithm will create 10,000 random qNodes using createUniqueQnodesHashmap. It will then begin to parse them by selected by difficulty, (which is manipulated at the end of each iteration in respect to the chosen difficultyProgression), add them to the desired data representation, and continue until the numSets and numQuestionsPerSet has been satisfied.

If the operator chooses the exponential difficultyProgression, it is possible that there may be collisions. That is to say, all the problems for a particular difficulty level have been used. To prevent this, there is a check on the current index within the difficulty of the parsed qNodes dictionary to skip to the next highest difficulty.

The qNodes are finally returned in one of the desired data representations - either a flattened array, or a dictionary sorted by set number. Though returning the sorted samples as an array is slightly faster, an operator may consider using the dictionary option for ease of handling data.

### Running The Algorithm

1. `cd ./class-hero/exercise2`
2. At the bottom of the code where sampleQnodes is called, modify `let sampleSet = sampleQnodes(10, 100, "logarithmic", "array");` with the desired parameters.
3. (Optional) Uncomment the line below to get a json representation of the output
4. `node sampling.js` OR `node sampling.js >> output.json`

# Performance Metrics (Done with X=10000, N=10, M=100)

## Creating sample qNodes:

- 492.131ms

## Linear difficulty:

- Using array - 0.157ms
- Using dictionary - 0.160ms

## Exponential difficulty:

- Using array - 0.271ms
- Using dictionary - 0.280ms

## Logarithmic difficulty:

- Using array - 0.282ms
- Using dictionary - 0.311ms

## Links to Google Sheets with full spreadsheets/graph representations of values for each difficultyProgression. All graphs on different sheet tabs at the bottom of the doc.

Linear:

https://docs.google.com/spreadsheets/d/1GE2X8ixDey3r5AsXCZ7roqApi5ggI3E4OQoGFW51sns/edit?usp=sharing

Exponential:

https://docs.google.com/spreadsheets/d/1WflxNz7nVnalbb_BXyC7XYdIx6-5BNsGuHaYtky1Y-8/edit?usp=sharing

Logarithmic:

https://docs.google.com/spreadsheets/d/1LLlWVH3WN1nCnqbJYgNCJ5bgMQoM63Qoz5WUnEX7CBc/edit?usp=sharing

### (Also available in the repo under the folders exponential, linear, and logarithmic with JSON outputs of the algorithms for convenience.)
