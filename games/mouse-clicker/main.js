'use strict';

const area = document.querySelector('#area');
const results = document.querySelector('#results');
const counterResults = document.querySelector('#counter');
const nav = document.querySelector('#nav');

let startBtn = null;
let newBtn = null;

// Лічильник
let counter = 0;

// максимальний радіус елемента
const maxRadius = 50;
// Розмір ігрового поля
const areaSize = {};
// Координати елементу
const positionClickElement = {};

// Рендер елементів
const startBtnMarkUp =
  "<button type='button' id='start-btn' class='start-btn btn'>Start Game</button>";
const newtBtnMarkUp =
  "<button type='button' id='new-btn' class='new-btn btn'>New Game</button>";

// Рендер кнопки "Start Game"
const handleStartGame = () => {
  deleteStartBtn();
  createNewBtn();
  createClickElement(positionClickElement);
  updateResults(counterResults, counter);
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

// Визначення розміру екрану
function getAreaSize() {
  const areaWidth = area.clientWidth;
  const areaHeight = area.clientHeight;

  areaSize.width = areaWidth;
  areaSize.height = areaHeight;
}

getAreaSize();

function generatePosition(size, radius) {
  const { width, height } = size;

  const maxX = Math.ceil(width - radius);
  const maxY = Math.floor(height - radius);

  const x =
    Math.floor(Math.random() * (maxX - radius + 1)) +
    radius;
  const y =
    Math.floor(Math.random() * (maxY - radius + 1)) +
    radius;

  positionClickElement.left = x;
  positionClickElement.top = y;
}

// Створення елементу кліку
function createClickElement(position) {
  generatePosition(areaSize, maxRadius);

  const { left, top } = position;

  const clickElementMarkUp = `<div id='click-element' class='click-element' style='left: ${left}px; top: ${top}px'></div>`;

  area.innerHTML = clickElementMarkUp;

  const clickElement = document.querySelector(
    '#click-element'
  );

  const handleClick = () => {
    clickElement.remove();

    counter += 1;
    updateResults(counterResults, counter);

    createClickElement(positionClickElement);
  };

  clickElement.addEventListener('click', handleClick);
}

function updateResults(element, value) {
  element.textContent = value;
}
