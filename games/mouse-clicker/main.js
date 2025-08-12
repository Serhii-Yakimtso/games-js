'use strict';

// Отримання
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

// кнопка початку гри
let startBtnElement = null;
// кнопка нової гри
let restartBtnElement = null;

// Статус гри
let gameStatus = false;

// Лічильник кліків
let clickCounter = 0;
// Лічильник загального часу гри
let totalTime = 0;
// Лічильник  часу до кліку по елементу
let timeToClick = 0;
// Максимальний ліміт часу гри
let totalTimeLimit = 5;
// Час (швидкість) реагування
let clickSpeedTime = 0;

const arrTime = [];

// максимальний радіус елемента
const maxRadius = 50;
// Розмір ігрового поля
const areaSize = {};
// Координати створення елементу
const positionClickElement = {};

// Рендер елементів
const startBtnMarkUp =
  "<button type='button' id='start-btn' class='start-btn btn'>Start Game</button>";
const restartBtnMarkUp =
  "<button type='button' id='restart-btn' class='new-btn btn'>Restart Game</button>";

// Рендер кнопки "Start Game"
const handleStartGame = () => {
  deleteStartBtn();
  createRestartBtn();
  createClickElement(positionClickElement);
  getTotalTimeGame();
  updateResults(counterResultsElement, clickCounter);

  gameStatus = true;
};

createStartBtn();
getAreaSize();

// Створення кнопки "Start Game"
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

// Рендер кнопки "Restart Game"
const handleRestartGame = () => {
  createStartBtn();
  deleteRestartBtn();
  clickCounter = 0;
};

// Рендер кнопки "Restart Game"
function createRestartBtn() {
  nav.insertAdjacentHTML('afterend', restartBtnMarkUp);

  restartBtnElement =
    document.querySelector('#restart-btn');

  restartBtnElement.addEventListener(
    'click',
    handleRestartGame
  );
}

// Видалення кнопки "New Game"
function deleteRestartBtn() {
  restartBtnElement.removeEventListener(
    'click',
    handleRestartGame
  );

  restartBtnElement.remove();

  restartBtnElement = null;
}

// Визначення розміру екрану
function getAreaSize() {
  const areaWidth = areaElement.clientWidth;
  const areaHeight = areaElement.clientHeight;

  areaSize.width = areaWidth;
  areaSize.height = areaHeight;
}

// Генерація координат створення елементу
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
function createClickElement() {
  generatePosition(areaSize, maxRadius);

  const { left, top } = positionClickElement;

  const clickElementMarkUp = `<div id='click-element' class='click-element' style='left: ${left}px; top: ${top}px'></div>`;

  areaElement.innerHTML = clickElementMarkUp;
  const createElementTime = getTime();

  const clickElement = document.querySelector(
    '#click-element'
  );

  getTimeToClick();

  const handleClick = () => {
    const clickTime = getTime();

    clickSpeedTime = getSpeedTime(
      createElementTime,
      clickTime
    );
    pushTime(arrTime, clickSpeedTime);

    updateResults(speedResultsElement, clickSpeedTime);

    updateResults(
      minTimeResultsElement,
      getMinTime(arrTime)
    );

    updateResults(
      maxTimeResultsElement,
      getMaxTime(arrTime)
    );

    updateResults(
      meanTimeResultsElement,
      getMeanTime(arrTime)
    );

    clickElement.remove();

    clickCounter += 1;
    updateResults(counterResultsElement, clickCounter);

    createClickElement(positionClickElement);
  };

  clickElement.addEventListener('click', handleClick);
}

// оновлення значення елементу
function updateResults(element, value) {
  element.textContent = value;
}

// Отримання часу події
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

// Отримання найшвидшого часу реагування
function getMinTime(arr) {
  if (arr.length < 2) {
    return 0;
  }

  return Math.min(...arr);
}

// Отримання найдовшого часу реагування
function getMaxTime(arr) {
  if (arr.length < 2) {
    return 0;
  }

  return Math.max(...arr);
}

// Отримання загального часу гри
function getTotalTimeGame() {
  const startTimeGame = Date.now();

  const countTime = setInterval(() => {
    totalTime = (
      Math.round(Date.now() - startTimeGame) / 1000
    ).toFixed(1);

    updateResults(totalTimeGameElement, totalTime);

    if (totalTime >= totalTimeLimit) {
      clearInterval(countTime);
    }

    if (!gameStatus) {
      clearInterval(countTime);
    }
  }, 100);
}

// Отримання  часу між кліками
function getTimeToClick() {
  const createElementTime = Date.now();

  const currentCount = clickCounter;

  const countineTimeToClick = setInterval(() => {
    timeToClick = (
      Math.round(Date.now() - createElementTime) / 1000
    ).toFixed(1);

    updateResults(timeToClickElement, timeToClick);

    if (currentCount !== clickCounter) {
      clearInterval(countineTimeToClick);
      timeToClick = 0;
    }
  }, 100);
}

function finishGame(params) {}

function cleareResults(params) {}
