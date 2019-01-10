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
    for (var i = 0; i < 3; ++i) {
      for (var j = 0; j < 3; ++j) {
        if (get(i, j) === 0) {
          set(i, j, 1 + nextPlayer);
          var judge = judgeBoard();
          set(i, j, 0);

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
        }
      }
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
          set(i, j, 0);

          wins[top] += wins[top + 1];
          draw[top] += draw[top + 1];
          loss[top] += loss[top + 1];
        }
      }
    }

    --top;
  }

  function run(boardData) {
    copyBoardFrom2DArray(boardData);

    top = -1;
    dfs(0);
    if (top !== -1) {
      throw new Error('top = ' + top);
    }

    console.log(wins[top + 1], draw[top + 1], loss[top + 1]);
  };

  function getBestMoves(boardData, nextPlayer) {
    class Move {
      constructor(i, j, win, draw, loss) {
        this.i = i;
        this.j = j;
        this.value = (2 * win + draw) / (2 * (win + draw + loss));

        this.win = win;
        this.draw = draw;
        this.loss = loss;
      }

      toString() {
        return `Move{(${this.i}, ${this.j}), ${(this.value * 100).toFixed(3)}%, ${this.win}, ${this.draw}, ${this.loss}}`;
      }
    }

    function createMove(i, j) {
      var a = wins[top + 1];
      var b = draw[top + 1];
      var c = loss[top + 1];

      if (nextPlayer === 0) {
        return new Move(i, j, a, b, c);
      } else if (nextPlayer === 1) {
        return new Move(i, j, c, b, a);
      } else {
        throw new Error('nextPlayer === ' + nextPlayer);
      }
    }

    copyBoardFrom2DArray(boardData);

    var moves = [];

    var bestMoves = [];
    var best = 0;

    for (var i = 0; i < 3; ++i) {
      for (var j = 0; j < 3; ++j) {
        if (get(i, j) === 0) {
          set(i, j, 1 + nextPlayer);
          var judge = judgeBoard();
          set(i, j, 0);

          if (judge === 1 + nextPlayer) {
            return [new Move(i, j, 1, 0, 0)];
          } else if (judge === -1) {
            return [new Move(i, j, 0, 1, 0)];
          }
        }
      }
    }

    for (var i = 0; i < 3; ++i) {
      for (var j = 0; j < 3; ++j) {
        if (get(i, j) === 0) {
          top = -1;

          set(i, j, 1 + nextPlayer);
          dfs((nextPlayer + 1) % 2);
          set(i, j, 0);

          if (top !== -1) {
            throw new Error('top = ' + top);
          }

          var move = createMove(i, j);
          var value = move.value;

          moves.push(move);

          if (value > best) {
            best = value;
            bestMoves = [];
          }

          if (value === best) {
            bestMoves.push(move);
          }
        }
      }
    }

    // if (bestMoves.length === 0) {
    //   return moves;
    // }

    // moves.sort((a, b) => -(a.value - b.value));

    // for (let move of moves) {
    //   console.log(move.toString());
    // }

    return bestMoves;
  }

  this.AI = {
    run,
    getBestMoves,
  };

}.call(this));
