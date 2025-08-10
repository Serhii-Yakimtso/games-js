'use strict';

const area = document.querySelector('#area');
const results = document.querySelector('#results');
const counterResults = document.querySelector('#counter');
const timeToClick = document.querySelector('#time');
const totalTimeGame = document.querySelector('#total-time');
const speedResults = document.querySelector('#speed');
const minTimeResults = document.querySelector('#min-time');
const maxTimeResults = document.querySelector('#max-time');
const meanTimeResults =
  document.querySelector('#mean-time');
const nav = document.querySelector('#nav');

let startBtn = null;
let newBtn = null;

// Лічильник
let counter = 0;
let totalTime = 0;
let totalTimeLimit = 5;
let startTime = 0;
let endTime = 0;
let speedTime = 0;
const arrTime = [];

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
  getTotalTimeGame();
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
  startTime = getTime();

  const clickElement = document.querySelector(
    '#click-element'
  );

  const handleClick = () => {
    endTime = getTime();

    speedTime = getSpeedTime(startTime, endTime);
    pushTime(arrTime, speedTime);

    speedResults.textContent = speedTime;
    minTimeResults.textContent = getMinTime(arrTime);
    maxTimeResults.textContent = getMaxTime(arrTime);
    meanTimeResults.textContent = getMeanTime(arrTime);

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

// Отримання часу подію
function getTime() {
  const time = Date.now();

  return time;
}

// Отримання різниці часу ркагування
function getSpeedTime(start, end) {
  const time = end - start;

  return time;
}

// накопичення коллекції часу
function pushTime(arr, time) {
  arr.push(time);
}

// Отримання середнього часу реагування
function getMeanTime(arr) {
  if (arr.length < 2) {
    return 0;
  }

  let mean = 0;
  for (let i = 0; i < arr.length; i++) {
    mean += arr[i];
  }

  return Math.ceil(mean / arr.length);
}

// Отримання найшвидшого результату реагування
function getMinTime(arr) {
  if (arr.length < 2) {
    return 0;
  }

  return Math.min(...arr);
}

// Отримання найдовшого результату реагування
function getMaxTime(arr) {
  if (arr.length < 2) {
    return 0;
  }

  return Math.max(...arr);
}

function getTotalTimeGame() {
  const startTimeGame = Date.now();

  const countTime = setInterval(() => {
    totalTime = (
      Math.round(Date.now() - startTimeGame) /
      100 /
      10
    ).toFixed(1);

    if (totalTime > totalTimeLimit) {
      clearInterval(countTime);
    }

    totalTimeGame.textContent = totalTime;
  }, 100);
}

function getTimeToClick(params) {}
