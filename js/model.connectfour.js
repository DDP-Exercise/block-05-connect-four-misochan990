"use strict";

// Think of this model as the game-logic.
//      The model knows everything that is neccessary to manage
//      the game. It knows the players, know who's turn it is,
//      knows all the stones and where they are, knows if the
//      game is over and if so, why (draw or winner). It knows
//      which stones are the winning stones. The model also has
//      sovereignty over the battlefield.
//      First step: Create your model-object with all the properties
//      necessary to store that information.

// Prepare some customEvents. The model should dispatch events when
//      - The Player Changes
//      - A stone was inserted
//      - The Game is over (Draw or Winner)
//      Don't forget to give your events a namespace.
//      For each customEvent, just make a >method< for your model-object,
//      that, when called, dispatches the event. Nothing else should
//      happen in those methods.


// Initiate the battlefield. Your model needs a representation of the
//      battlefield as data (two-dimensional array). Obviously, there are
//      no stones yet in the field.

//The model should offer a method to insert a stone at a given column.
//      If the stone can be inserted, the model should insert the stone,
//      dispatch an event to let the world know that the battlefield has changed
//      and check if the game is over now.
//      Hint: This method will be called later by your controller, when the
//      user makes an according input.

// Methods to check if the game is over, either by draw or a win.
//      Let the world know in both cases what happend. If it's a win,
//      Don't forget to store the winning stones and add this >detail<
//      to your custom event.

// Method to change the current player (and dispatch the according event).



 export const MODEL = {
    board: [],
    currentPlayer: 1,
    isGameOver: false,
    winningCoins: [],
    eventTarget: new EventTarget(),

    init: function() {
        this.board = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ];
        this.currentPlayer = 1;
        this.isGameOver = false;
        this.winningCoins = [];
    },


    addEventListener: function(eventType, listener) {
        this.eventTarget.addEventListener(eventType, listener);
    },


    dispatchPlayerChanged: function() {
        const EVENT = new CustomEvent("playerChanged", {
            detail: { currentPlayer: this.currentPlayer }
        });
        this.eventTarget.dispatchEvent(EVENT);
    },

    dispatchCoinInserted: function(row, col) {
        const EVENT = new CustomEvent("stoneInserted", {
            detail: { row: row, col: col, player: this.currentPlayer }
        });
        this.eventTarget.dispatchEvent(EVENT);
    },

    dispatchGameOver: function(winner, isDraw) {
        const EVENT = new CustomEvent("gameOver", {
            detail: { winner: winner, winningCoins: this.winningCoins, isDraw: isDraw }
        });
        this.eventTarget.dispatchEvent(EVENT);
    },

    dispatchColumnFull: function() {
        const EVENT = new CustomEvent("columnFull");
        this.eventTarget.dispatchEvent(EVENT);
    },

    dropStone: function(colIndex) {
        if (this.isGameOver) return;
        let targetRow = -1;
        for (let row = 5; row >= 0; row--) {
            if (this.board[row][colIndex] === 0) {
                targetRow = row;
                break;
            }
        }

        if (targetRow === -1) {
            this.dispatchColumnFull();
            return;
        }
        this.board[targetRow][colIndex] = this.currentPlayer;
        this.dispatchCoinInserted(targetRow, colIndex);
        this.checkGameState(targetRow, colIndex);
    },


    changePlayer: function() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.dispatchPlayerChanged();
    },


    checkGameState: function(row, col) {
        if (this.checkWin(row, col)) {
            this.isGameOver = true;
            this.dispatchGameOver(this.currentPlayer, false);
        } else if (this.checkDraw()) {
            this.isGameOver = true;
            this.dispatchGameOver(null, true);
        } else {
            this.changePlayer();
        }
    },

    checkDraw: function() {
        return !this.board[0].includes(0);
    },

    checkWin: function(row, col) {
        const directions = [
            [[0, 1], [0, -1]],
            [[1, 0], [-1, 0]],
            [[1, 1], [-1, -1]],
            [[1, -1], [-1, 1]]
        ];

        const player = this.currentPlayer;

        for (let dir of directions) {
            let count = 1;
            let coins = [[row, col]];


            for (let i = 0; i < 2; i++) {
                const rDir = dir[i][0];
                const cDir = dir[i][1];
                let r = row + rDir;
                let c = col + cDir;

                while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.board[r][c] === player) {
                    count++;
                    coins.push([r, c]);
                    r += rDir;
                    c += cDir;
                }
            }

            if (count >= 4) {
                this.winningCoins = coins;
                return true;
            }
        }
        return false;
    }
};

MODEL.init();

