'use strict';

const areaElement = document.querySelector('#area');
const resultsElement = document.querySelector('#results');
const counterResultsElement =
  document.querySelector('#counter');
const timeToClickElement = document.querySelector('#time');
const totalTimeGameElement =
  document.querySelector('#total-time');
const speedResultsElement =
  document.querySelector('#speed');
const minTimeResultsElement =
  document.querySelector('#min-time');
const maxTimeResultsElement =
  document.querySelector('#max-time');
const meanTimeResultsElement =
  document.querySelector('#mean-time');

let startBtnElement = null;
let newBtnElement = null;

// Лічильники
let clickCounter = 0;
let totalTime = 0;
let totalTimeLimit = 5;
let clickStartTime = 0;
let clickEndTime = 0;
let clickSpeedTime = 0;

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
  updateResults(counterResultsElement, clickCounter);
};

function createStartBtn() {
  areaElement.innerHTML = startBtnMarkUp;

  startBtnElement = document.querySelector('#start-btn');

  startBtnElement.addEventListener(
    'click',
    handleStartGame
  );
}

// Видалення кнопки "Start Game"
function deleteStartBtn() {
  startBtnElement.removeEventListener(
    'click',
    handleStartGame
  );

  startBtnElement.remove();

  startBtnElement = null;
}

// Рендер кнопки "New Game"
const handleNewGame = () => {
  createStartBtn();
  deleteNewBtn();
  clickCounter = 0;
};

function createNewBtn() {
  nav.insertAdjacentHTML('afterend', newtBtnMarkUp);

  newBtnElement = document.querySelector('#new-btn');

  newBtnElement.addEventListener('click', handleNewGame);
}

// Видалення кнопки "New Game"
function deleteNewBtn() {
  newBtnElement.removeEventListener('click', handleNewGame);

  newBtnElement.remove();

  newBtnElement = null;
}

createStartBtn();

// Визначення розміру екрану
function getAreaSize() {
  const areaWidth = areaElement.clientWidth;
  const areaHeight = areaElement.clientHeight;

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

  areaElement.innerHTML = clickElementMarkUp;
  clickStartTime = getTime();

  const clickElement = document.querySelector(
    '#click-element'
  );

  const handleClick = () => {
    clickEndTime = getTime();

    clickSpeedTime = getSpeedTime(
      clickStartTime,
      clickEndTime
    );
    pushTime(arrTime, clickSpeedTime);

    speedResultsElement.textContent = clickSpeedTime;
    minTimeResultsElement.textContent = getMinTime(arrTime);
    maxTimeResultsElement.textContent = getMaxTime(arrTime);
    meanTimeResultsElement.textContent =
      getMeanTime(arrTime);

    clickElement.remove();

    clickCounter += 1;
    updateResults(counterResultsElement, clickCounter);

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

    totalTimeGameElement.textContent = totalTime;
  }, 100);
}

function getTimeToClick(params) {}
