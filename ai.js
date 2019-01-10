'use strict';

(function() {
  var board = createBoard();

  function createBoard() {
    return new Uint8Array(9);
  }

  function get(i, j) {
    return board[i * 3 + j];
  }

  function set(i, j, state) {
    board[i * 3 + j] = state;
  }

  function copyBoardFrom2DArray(data) {
    for (var i = 0; i < 3; ++i) {
      var o = i * 3;
      var b = data[i];
      for (var j = 0; j < 3; ++j) {
        board[o + j] = b[j];
      }
    }
  }

  function judgeBoard() {
    for (var i = 0; i < 3; ++i) {
      var o = i * 3;
      if (board[o + 0] !== 0 && board[o + 0] === board[o + 1] && board[o + 1] === board[o + 2]) {
        return board[o + 0];
      }
    }

    for (var j = 0; j < 3; ++j) {
      if (board[0 * 3 + j] !== 0 && board[0 * 3 + j] === board[1 * 3 + j] && board[1 * 3 + j] === board[2 * 3 + j]) {
        return board[0 * 3 + j];
      }
    }

    if (board[0 * 3 + 0] !== 0 && board[0 * 3 + 0] === board[1 * 3 + 1] && board[1 * 3 + 1] === board[2 * 3 + 2]) {
      return board[0 * 3 + 0];
    }

    if (board[0 * 3 + 2] !== 0 && board[0 * 3 + 2] === board[1 * 3 + 1] && board[1 * 3 + 1] === board[2 * 3 + 0]) {
      return board[0 * 3 + 2];
    }

    var draw = true;

    for (var k = 0; k < 9; ++k) {
      if (board[k] === 0) {
        draw = false;
        break;
      }
    }

    if (draw) {
      return -1;
    }

    return 0;
  }

  var wins = new Uint32Array(1024);
  var draw = new Uint32Array(1024);
  var loss = new Uint32Array(1024);
  var top = -1;

  function dfs(nextPlayer) {
    var judge = judgeBoard();

    if (judge === 1) {
      wins[top + 1] = 1;
      draw[top + 1] = 0;
      loss[top + 1] = 0;

      return;
    } else if (judge === -1) {
      wins[top + 1] = 0;
      draw[top + 1] = 1;
      loss[top + 1] = 0;

      return;
    } else if (judge === 2) {
      wins[top + 1] = 0;
      draw[top + 1] = 0;
      loss[top + 1] = 1;

      return;
    }

    ++top;

    wins[top] = 0;
    draw[top] = 0;
    loss[top] = 0;

    for (var i = 0; i < 3; ++i) {
      for (var j = 0; j < 3; ++j) {
        if (get(i, j) === 0) {
          set(i, j, 1 + nextPlayer);

          dfs((nextPlayer + 1) % 2);
          wins[top] += wins[top + 1];
          draw[top] += draw[top + 1];
          loss[top] += loss[top + 1];

          set(i, j, 0);
        }
      }
    }

    --top;
  }

  this.runAI = function(boardData) {
    copyBoardFrom2DArray(boardData);

    top = -1;
    dfs(0);
    if (top !== -1) {
      throw new Error('top = ' + top);
    }

    console.log(wins[top + 1], draw[top + 1], loss[top + 1]);
  };

  this.getBestMoves = function(boardData, nextPlayer) {
    class Move {
      constructor(i, j, winRate) {
        this.i = i;
        this.j = j;
        this.winRate = winRate;
      }
    }

    function getWinRate() {
      var a = wins[top + 1];
      var b = draw[top + 1];
      var c = loss[top + 1];

      if (nextPlayer === 0) {
        return (2 * a + b) / (2 * (a + b + c));
      } else if (nextPlayer === 1) {
        return (2 * c + b) / (2 * (a + b + c));
      } else {
        throw new Error('nextPlayer === ' + nextPlayer);
      }
    }

    copyBoardFrom2DArray(boardData);

    var bestMoves = [];
    var best = 0;

    for (var i = 0; i < 3; ++i) {
      for (var j = 0; j < 3; ++j) {
        if (get(i, j) === 0) {
          set(i, j, 1 + nextPlayer);

          top = -1;
          dfs((nextPlayer + 1) % 2);
          if (top !== -1) {
            throw new Error('top = ' + top);
          }

          var winRate = getWinRate();

          // console.log(i, j, wins[top + 1], draw[top + 1], loss[top + 1], winRate);
          // console.log(i, j, (2 * wins[top + 1] + draw[top + 1]) / (2 * loss[top + 1]));

          if (winRate > best) {
            best = winRate;
            bestMoves = [];
          }

          if (winRate === best) {
            bestMoves.push(new Move(i, j, winRate));
          }

          set(i, j, 0);
        }
      }
    }

    return bestMoves;
  }

}.call(this));
