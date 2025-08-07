'use strict';

const area = document.querySelector('#area');
const results = document.querySelector('#results');
const nav = document.querySelector('#nav');

let startBtn = null;
let newBtn = null;
let counter = 0;

// Рендер елементів
const startBtnMarkUp =
  "<button type='button' id='start-btn' class='start-btn btn'>Start Game</button>";
const newtBtnMarkUp =
  "<button type='button' id='new-btn' class='new-btn btn'>New Game</button>";

// Рендер кнопки "Start Game"
const handleStartGame = () => {
  deleteStartBtn();
  createNewBtn();
  createClickElement();
};

function createStartBtn() {
  area.innerHTML = startBtnMarkUp;

  startBtn = document.querySelector('#start-btn');

  startBtn.addEventListener('click', handleStartGame);
}

// Видалення кнопки "Start Game"
function deleteStartBtn() {
  startBtn.removeEventListener('click', handleStartGame);

  startBtn.remove();

  startBtn = null;
}

// Рендер кнопки "New Game"
const handleNewGame = () => {
  createStartBtn();
  deleteNewBtn();
  counter = 0;
};

function createNewBtn() {
  nav.insertAdjacentHTML('afterend', newtBtnMarkUp);

  newBtn = document.querySelector('#new-btn');

  newBtn.addEventListener('click', handleNewGame);
}

// Видалення кнопки "New Game"
function deleteNewBtn() {
  newBtn.removeEventListener('click', handleNewGame);

  newBtn.remove();

  newBtn = null;
}

createStartBtn();
