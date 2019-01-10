const ai = require('./ai.js');

// ai.runAI([
//   [0, 0, 0],
//   [0, 0, 0],
//   [0, 0, 0],
// ]);

console.log(ai.getBestMoves([
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
], 1));
