"use strict";

//: Think of this view as your game board.
//      Your view should listen to various custom events of your model.
//      For each event of your model, there should be a clear visual
//      representation of what's going on.

"use strict";

import {MODEL} from './model.connectfour.js';

export const VIEW = {

    init: function() {
        MODEL.addEventListener("stoneInserted", (event) => {
            this.renderCoin(event.detail.row, event.detail.col, event.detail.player);
        });

        MODEL.addEventListener("playerChanged", (event) => {
            this.updatePlayerIndicator(event.detail.currentPlayer);
        });

        MODEL.addEventListener("gameOver", (event) => {
            if (event.detail.winner) {
                this.transformToWinner(event.detail.winningCoins);
            } else if (event.detail.isDraw) {
                alert("Draw! The Battlefield is full!");
            }
        });

        MODEL.addEventListener("columnFull", (event) => {
            this.showColumnFullWarning();
        });

        this.updatePlayerIndicator(1);
    },


    bindColumnClicks: function(handler) {
        const columns = document.querySelectorAll('.column');
        columns.forEach(col => {
            col.addEventListener("click", function(e) {
                const colIndex = parseInt(e.target.dataset.col);
                handler(colIndex);
            });
        });
    },


    renderCoin: function(row, col, player) {
        const coinsLayer = document.getElementById("coins-layer");

        const coin = document.createElement("div");
        coin.classList.add("coin");
        coin.classList.add(player === 1 ? "player1-coin" : "player2-coin");
        coin.id = "coin-" + row + "-" + col;

        const xPositions = [29, 137, 248, 357, 466, 577, 685];
        const yPositions = [34, 142, 247, 350, 457, 561];
        const xPos = xPositions[col];
        const targetYPos = yPositions[row];
        coin.style.left = xPos + "px";
        coin.style.top = "0px";

        coinsLayer.appendChild(coin);


        setTimeout(() => {
            coin.style.top = targetYPos + "px";
        }, 50);
    },


    updatePlayerIndicator: function(currentPlayer) {

        const headline = document.querySelector('h1');
        const barbieAvatar = document.getElementById("barbie_avatar");
        const premingerAvatar = document.getElementById("preminger_avatar");

        if (currentPlayer === 1) {
            headline.innerText = "Barbie's Turn!";
            headline.style.webkitTextStroke = "3px #c2185b";
            barbieAvatar.classList.add("barbie_avatar_activ");
            premingerAvatar.classList.remove("preminger_avatar_activ");

        } else {
            headline.innerText = "Preminger's Turn!";
            headline.style.webkitTextStroke = "3px #008080";
            premingerAvatar.classList.add("preminger_avatar_activ");
            barbieAvatar.classList.remove("barbie_avatar_activ");
        }
    },


    transformToWinner: function(winningStones) {
        winningStones.forEach(coord => {
            const row = coord[0];
            const col = coord[1];
            const winningCoin = document.getElementById("coin-" + row + "-" + col);

            if (winningCoin) {
                winningCoin.classList.remove("player1-coin", "player2-coin");
                winningCoin.classList.add("winner-coin");
            }
        });

        setTimeout(() => {
            alert("Game Over");
        }, 500);
    },

    showColumnFullWarning: function() {
        alert("Oh no! This row is full. Try another one.");
    }
};

