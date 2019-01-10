'use strict';

(function() {
  var board = createBoard();

  function createBoard() {
    var arr = new Array(3);
    for (var i = 0; i < 3; ++i) {
      arr[i] = new Uint8Array(3);
    }
    return arr;
  }

  function copyBoard(boardData) {
    for (var i = 0; i < 3; ++i) {
      var a = board[i];
      var b = boardData[i];
      for (var j = 0; j < 3; ++j) {
        a[j] = b[j];
      }
    }
  }

  function judgeBoard() {
    for (var i = 0; i < 3; ++i) {
      var a = board[i];

      if (a[0] !== 0 && a[0] === a[1] && a[1] === a[2]) {
        return a[0];
      }
    }

    for (var j = 0; j < 3; ++j) {
      if (board[0][j] !== 0 && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
        return board[0][j];
      }
    }

    return 0;
  }

  var wins = new Uint32Array(1024);
  var top = -1;

  function dfs(nextPlayer) {
    wins[++top] = 1;

    for (var i = 0; i < 3; ++i) {
      for (var j = 0; j < 3; ++j) {
        if (board[i][j] === 0) {
          board[i][j] = 1 + nextPlayer;

          dfs((nextPlayer + 1) % 2);
          wins[top] += wins[top + 1];

          board[i][j] = 0;
        }
      }
    }

    --top;
  }

  this.run = function(boardData) {
    copyBoard(boardData);

    dfs(0);

    if (top !== -1) {
      throw new Error('top = ' + top);
    }

    console.log(wins[top + 1]);
  };
}.call(this));
