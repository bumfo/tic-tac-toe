'use strict';

(function() {
  class Game {
    constructor() {
      var board = new Array(3);
      for (var i = 0; i < 3; ++i) {
        board[i] = new Uint8Array(3);
      }

      this.state = 0;

      this.board = board;
      this.turn = 0;
      this.player = 0;

      this.view = null;
      this.onTurnStart = () => {};
    }

    clear() {
      this.state = 0;
      this.turn = 0;
      this.player = 0;

      for (var i = 0; i < 3; ++i) {
        var arr = this.board[i];
        for (var j = 0; j < 3; ++j) {
          arr[j] = 0;
        }
      }
    }

    get(i, j) {
      return this.board[i][j];
    }

    doMove(i, j) {
      if (this.state === 0) {
        if (this.board[i][j] === 0) {
          console.log(this.player, 'move', i, j);

          this.board[i][j] = this.player + 1;

          this.nextTurn();
        }
      }
    }

    judgeBoard() {
      var a = this.board;

      for (var i = 0; i < 3; ++i) {
        if (a[i][0] !== 0 && a[i][0] === a[i][1] && a[i][1] === a[i][2]) {
          return a[i][0];
        }
      }

      for (var j = 0; j < 3; ++j) {
        if (a[0][j] !== 0 && a[0][j] === a[1][j] && a[1][j] === a[2][j]) {
          return a[0][j];
        }
      }

      if (a[0][0] !== 0 && a[0][0] === a[1][1] && a[1][1] === a[2][2]) {
        return a[0][0];
      }

      if (a[0][2] !== 0 && a[0][2] === a[1][1] && a[1][1] === a[2][0]) {
        return a[0][2];
      }

      var draw = true;

      for (var k = 0; k < 9; ++k) {
        if (a[k / 3 | 0][k % 3] === 0) {
          draw = false;
          break;
        }
      }

      if (draw) {
        return -1;
      }

      return 0;
    }

    nextRound() {
      this.clear();

      this.view.onUpdate();

      this.onTurnStart();
    }

    nextTurn() {
      var judge = this.judgeBoard();
      if (judge === -1) {
        this.state = -1;
        console.log('draw');

        this.view.onUpdate();
      } else if (judge === 1) {
        this.state = 1;
        console.log('X wins');

        this.view.onUpdate();
      } else if (judge === 2) {
        this.state = 2;
        console.log('O wins');

        this.view.onUpdate();
      } else {
        this.player = (this.player + 1) % 2;
        this.turn += 1;

        this.view.onUpdate();

        this.onTurnStart();
      }
    }
  }

  class Cell {
    constructor(el, game, i, j) {
      this.el = el;
      this.i = i;
      this.j = j;

      el.addEventListener('click', e => {
        game.doMove(i, j);
      });

      this.game = game;
    }

    set(state) {
      var text;
      switch (state) {
        case 0: {
          text = ''; 
          break;
        }
        case 1: {
          text = 'X'; 
          break;
        }
        case 2: {
          text = 'O'; 
          break;
        }
        default:
          throw new Error('Invalid state: ' + state);
      }

      this.el.textContent = text;
    }
  }

  class Board {
    constructor(el, game) {
      this.el = el;
      this.cells = new Array(3);

      for (let i = 0; i < 3; ++i) {
        this.cells[i] = new Array(3);

        for (let j = 0; j < 3; ++j) {
          this.cells[i][j] = new Cell(this.getCellEl(i, j), game, i, j);
        }
      }

      game.view = this;
      this.game = game;
    }

    getCellEl(i, j) {
      return this.el.children[i].children[j];
    }

    getCell(i, j) {
      return this.cells[i][j];
    }

    onUpdate() {
      for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
          this.getCell(i, j).set(this.game.get(i, j));
        }
      }
    }
  }

  var aiPlayer = Math.random() * 2 | 0;

  const game = new Game();
  new Board(document.querySelector('#board'), game);

  game.onTurnStart = () => {
    if (game.player === aiPlayer) {
      if (game.turn === 0) {
        if (Math.random() < 0.5) {
          let moves = [
            [0, 0],
            [0, 2],
            [2, 0],
            [2, 2],
          ];

          let move = moves[Math.random() * moves.length | 0];

          game.doMove(move[0], move[1]);
        } else {
          game.doMove(1, 1);
        }
      } else {
        try {
          let moves = AI.getBestMoves(game.board, aiPlayer);

          if (moves.length > 0) {
            let move = moves[Math.random() * moves.length | 0];

            console.log(move.toString());

            game.doMove(move.i, move.j);
          }
        } catch (e) {
          alert(e);
        }
      }
    }
  }

  game.nextRound();
}.call(this));
