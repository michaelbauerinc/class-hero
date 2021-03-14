class QNode {
  constructor(difficulty, id, url, qtext) {
    this.difficulty = difficulty;
    this.id = id;
    this.url = url;
    this.qtext = qtext;
  }
}

function makeId(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function randomNumberRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const operators = ["/", "*", "-", "+"];

function buildRandomEquation(difficulty) {
  let operatorIndex = randomNumberRange(0, operators.length);
  let operator = operators[operatorIndex];
  let first = randomNumberRange(1, difficulty * 10);
  let second;
  // Make sure that we don't subtract or divide to < 1 if difficulty under 60
  if (["-", "/"].includes(operator) && difficulty < 60) {
    second = randomNumberRange(1, first);
  } else {
    second = randomNumberRange(1, difficulty * 10);
  }

  return `${first} ${operator} ${second}`;
}

function computeGrowthRate(n) {
  return Math.pow(100, 1 / n);
}

function createUniqueQnodesHashmap(numToCreate) {
  let difficulty = 1;
  let all_unique_equations = [];
  let all_unique_ids = [];
  let allQnodes = {};

  // Uncomment to debug efficiency. 10K generations averages roughly 10300 iterations
  //   let totalIterations = 0;

  while (numToCreate > 0) {
    // totalIterations++;
    if (difficulty > 100) {
      difficulty = 1;
    }
    let newId = makeId(10);
    let newEquation = buildRandomEquation(difficulty);
    if (!all_unique_equations.includes(newEquation) && !all_unique_ids.includes(newId)) {
      all_unique_equations.push(newEquation);
      all_unique_ids.push(newId);

      let newQnode = new QNode(difficulty, newId, `http://api.classhero.com/${newId}.jpg`, newEquation);
      if (!(difficulty in allQnodes)) {
        allQnodes[difficulty] = [];
      }
      allQnodes[difficulty].push(newQnode);

      numToCreate--;
      difficulty++;
    }
  }
  // Uncomment to debug efficiency. 10K generations averages roughly 10300 iterations
  //   console.log(totalIterations);
  return allQnodes;
}

function sampleQnodes(numSets, numQuestionsPerSet, difficultyProgression, representation) {
  if (representation == "array") {
    let sampleSet = [];
    let allQnodes = createUniqueQnodesHashmap(10000);
    let currentIndicies = {};
    // let allIds = [];

    if (difficultyProgression == "linear") {
      let difficulty = 1;
      for (i = 0; i < numSets; i++) {
        for (j = 0; j < numQuestionsPerSet; j++) {
          let equationSet = allQnodes[difficulty][i];
          sampleSet.push(equationSet);
          //   Uncomment for debug to check for duplicates
          // console.log(sampleSet.length);
          // if (allIds.includes(equationSet.id)) {
          //   console.log("DUPLICATE");
          // }
          // allIds.push(equationSet.id);

          difficulty += 1;
        }
        difficulty = 1;
      }
    } else if (difficultyProgression == "exponential") {
      let growthRate = computeGrowthRate(numQuestionsPerSet);
      let multiplier;
      let difficulty;
      for (i = 0; i < numSets; i++) {
        for (j = 1; j <= numQuestionsPerSet; j++) {
          multiplier = Math.pow(growthRate, j);
          difficulty = Math.round(multiplier);
          if (!(difficulty in currentIndicies)) {
            currentIndicies[difficulty] = 0;
          } else {
            currentIndicies[difficulty] += 1;
          }

          let index = currentIndicies[difficulty];

          // Check for collisions/exceeding problems per difficulty level
          if (index > 99) {
            difficulty++;
            currentIndicies[difficulty]++;
            index = currentIndicies[difficulty];
          }

          let equationSet = allQnodes[difficulty];
          sampleSet.push(equationSet[index]);

          //   Uncomment for debug to check for duplicates
          // console.log(sampleSet.length);
          // if (allIds.includes(equationSet[index].id)) {
          //   console.log("DUPLICATE");
          // }
          // allIds.push(equationSet[index].id);
        }
        difficulty = 1;
        multiplier = Math.pow(growthRate, 1);
      }
    } else if (difficultyProgression == "logarithmic") {
      let growthRate = computeGrowthRate(numQuestionsPerSet);
      let multiplier;
      let difficulty = 1;
      for (i = 0; i < numSets; i++) {
        for (j = 2; j <= numQuestionsPerSet + 1; j++) {
          if (!(difficulty in currentIndicies)) {
            currentIndicies[difficulty] = 0;
          } else {
            currentIndicies[difficulty] += 1;
          }
          let index = currentIndicies[difficulty];

          let equationSet = allQnodes[difficulty];
          sampleSet.push(equationSet[index]);

          // Uncomment for debug to check for duplicates
          // console.log(sampleSet.length);
          // if (allIds.includes(equationSet[index].id)) {
          //   console.log("DUPLICATE");
          // }
          // allIds.push(equationSet[index].id);

          multiplier = Math.log(j) / Math.log(growthRate);
          difficulty = Math.round(multiplier);
        }
        difficulty = 1;
      }
    }

    return sampleSet;
  } else if (representation == "dictionary") {
    let sampleSet = {};
    let allQnodes = createUniqueQnodesHashmap(10000);
    let currentIndicies = {};
    // let allIds = [];

    if (difficultyProgression == "linear") {
      let difficulty = 1;
      for (i = 0; i < numSets; i++) {
        sampleSet[i + 1] = [];
        for (j = 0; j < numQuestionsPerSet; j++) {
          let equationSet = allQnodes[difficulty][i];
          sampleSet[i + 1].push(equationSet);
          //   Uncomment for debug to check for duplicates
          // console.log(Object.keys(sampleSet).length * sampleSet[i + 1].length);
          // if (allIds.includes(equationSet.id)) {
          //   console.log("DUPLICATE");
          // }
          // allIds.push(equationSet.id);

          difficulty += 1;
        }
        difficulty = 1;
      }
    } else if (difficultyProgression == "exponential") {
      let growthRate = computeGrowthRate(numQuestionsPerSet);
      let multiplier;
      let difficulty;
      for (i = 0; i < numSets; i++) {
        sampleSet[i + 1] = [];
        for (j = 1; j <= numQuestionsPerSet; j++) {
          multiplier = Math.pow(growthRate, j);
          difficulty = Math.round(multiplier);
          if (!(difficulty in currentIndicies)) {
            currentIndicies[difficulty] = 0;
          } else {
            currentIndicies[difficulty] += 1;
          }
          let index = currentIndicies[difficulty];

          // Check for collisions/exceeding problems per difficulty level
          if (index > 99) {
            difficulty++;
            currentIndicies[difficulty]++;
            index = currentIndicies[difficulty];
          }

          let equationSet = allQnodes[difficulty];
          sampleSet[i + 1].push(equationSet[index]);

          //   Uncomment for debug to check for duplicates
          // console.log(sampleSet.length);
          // if (allIds.includes(equationSet[index].id)) {
          //   console.log("DUPLICATE");
          // }
          // allIds.push(equationSet[index].id);
        }
        difficulty = 1;
        multiplier = Math.pow(growthRate, 1);
      }
    } else if (difficultyProgression == "logarithmic") {
      let growthRate = computeGrowthRate(numQuestionsPerSet);
      let multiplier;
      let difficulty = 1;
      for (i = 0; i < numSets; i++) {
        sampleSet[i + 1] = [];
        for (j = 2; j <= numQuestionsPerSet + 1; j++) {
          if (!(difficulty in currentIndicies)) {
            currentIndicies[difficulty] = 0;
          } else {
            currentIndicies[difficulty] += 1;
          }
          let index = currentIndicies[difficulty];

          let equationSet = allQnodes[difficulty];
          sampleSet[i + 1].push(equationSet[index]);

          // Uncomment for debug to check for duplicates
          // console.log(sampleSet.length);
          // if (allIds.includes(equationSet[index].id)) {
          //   console.log("DUPLICATE");
          // }
          // allIds.push(equationSet[index].id);

          multiplier = Math.log(j) / Math.log(growthRate);
          difficulty = Math.round(multiplier);
        }
        difficulty = 1;
      }
    }

    return sampleSet;
  }
}

let sampleSet = sampleQnodes(10, 100, "logarithmic", "array");
// console.log(JSON.stringify(sampleSet));
