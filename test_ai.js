const { AI } = require('./ai.js');

// AI.runAI([
//   [0, 0, 0],
//   [0, 0, 0],
//   [0, 0, 0],
// ]);

console.log(AI.getBestMoves([
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
], 1));
