const { AI } = require('./ai.js');

// AI.runAI([
//   [0, 0, 0],
//   [0, 0, 0],
//   [0, 0, 0],
// ]);

console.log(AI.getBestMoves([
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 2],
], 1 - 1));
