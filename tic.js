'use strict';

(function() {
  class Game {
    constructor() {
      var board = new Array(3);
      for (var i = 0; i < 3; ++i) {
        board[i] = new Uint8Array(3);
      }

      this.board = board;
      this.player = 0;

      this.view = null;
      this.onTurnStart = () => {};
    }

    clear() {
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
      if (this.board[i][j] == 0) {
        console.log(this.player, 'move', i, j);

        this.board[i][j] = this.player + 1;

        this.nextTurn();
      }
    }

    nextRound() {
      this.clear();

      this.view.onUpdate();

      this.onTurnStart();
    }

    nextTurn() {
      this.player = (this.player + 1) % 2;

      this.view.onUpdate();

      this.onTurnStart();
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

  var aiPlayer = 0;

  const game = new Game();
  new Board(document.querySelector('#board'), game);

  game.onTurnStart = () => {
    if (game.player === aiPlayer) {
      let moves = AI.getBestMoves(game.board, aiPlayer);

      if (moves.length > 0) {
        let move = moves[Math.random() * moves.length | 0];

        console.log(move);

        game.doMove(move.i, move.j);
      }
    }
  }

  game.nextRound();
}.call(this));
