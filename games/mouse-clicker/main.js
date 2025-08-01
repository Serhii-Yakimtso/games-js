'use strict';

const area = document.querySelector('#area');
const results = document.querySelector('#results');
const nav = document.querySelector('#nav');

let startBtn = null;
let newBtn = null;
let counter = 0;

const startBtnMarkUp =
  "<button type='button' id='start-btn' class='start-btn btn'>Start Game</button>";
const newtBtnMarkUp =
  "<button type='button' id='new-btn' class='new-btn btn'>New Game</button>";

const handleStartGame = () => {
  deleteStartBtn();
  createNewBtn();
};

const handleNewGame = () => {
  createStartBtn();
  deleteNewBtn();
  counter = 0;
};

function createStartBtn() {
  area.innerHTML = startBtnMarkUp;

  startBtn = document.querySelector('#start-btn');

  startBtn.addEventListener('click', handleStartGame);
}

function deleteStartBtn() {
  startBtn.removeEventListener('click', handleStartGame);

  startBtn.remove();

  startBtn = null;
}

function createNewBtn() {
  nav.insertAdjacentHTML('afterend', newtBtnMarkUp);

  newBtn = document.querySelector('#new-btn');

  newBtn.addEventListener('click', handleNewGame);
}

function deleteNewBtn() {
  newBtn.removeEventListener('click', handleNewGame);

  newBtn.remove();

  newBtn = null;
}

createStartBtn();
