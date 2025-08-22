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
const startBtnElement =
  document.querySelector('#start-btn');
const restartBtnElement =
  document.querySelector('#restart-btn');
const modalElement = document.querySelector('#modal');
const modalCounterElement = document.querySelector(
  '#modal-counter'
);
const modalTotalTimeElement = document.querySelector(
  '#modal-total-time'
);
const modalMinTime = document.querySelector(
  '#modal-min-time'
);
const modalMaxTime = document.querySelector(
  '#modal-max-time'
);
const modalMeanTime = document.querySelector(
  '#modal-mean-time'
);
const modalTotalScore = document.querySelector(
  '#modal-total-score'
);

const closeBtnElement =
  document.querySelector('#close-btn');

let clickElement = '';

// кнопка початку гри

// кнопка нової гри

// Лічильник кліків
let clickCounter = 0;
// Лічильник загального часу гри
let totalTime = 0;
// Лічильник  часу до кліку по елементу
let timeToClick = 0;
// Час (швидкість) реагування, секунди
let clickSpeedTime = 0;
// Найшвидший час реагування
let minTime = 0;
// Найдовший час реагування
let maxTime = 0;
// Середній час реагування
let meanTime = 0;

// Максимальний ліміт часу гри, секунди
let totalTimeLimit = 5;
// Статус гри
let gameStatus = false;
// Колекція часу в останій сесії гри
const arrTime = [];
// Фінальні результати
const finalyResultsObj = {};
// максимальний радіус елемента
const maxRadius = 50;
// Розмір ігрового поля
const areaSize = {};
// Координати створення елементу
const positionClickElement = {};

const handleStartGame = () => {
  startNewGame();
};

startBtnElement.addEventListener('click', handleStartGame);

function startNewGame() {
  toggleShow(startBtnElement);

  startBtnElement.removeEventListener(
    'click',
    handleStartGame
  );

  if (restartBtnElement.classList.contains('hidden')) {
    toggleShow(restartBtnElement);
  }

  restartBtnElement.addEventListener(
    'click',
    handleRestartGame
  );

  createClickElement(positionClickElement);

  getTotalTimeGame();

  updateResults(counterResultsElement, clickCounter);

  gameStatus = true;
}

const handleRestartGame = () => {
  restartGame();
};

function restartGame() {
  gameStatus = false;

  clickElement.remove();

  createLocalHistoryObj(finalyResultsObj);

  showFinalyResults(modalElement, finalyResultsObj);

  toggleShow(startBtnElement);

  startBtnElement.addEventListener(
    'click',
    handleStartGame
  );

  toggleShow(restartBtnElement);

  restartBtnElement.removeEventListener(
    'click',
    handleRestartGame
  );

  cleareResults();
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
  getAreaSize();

  generatePosition(areaSize, maxRadius);

  const { left, top } = positionClickElement;

  areaElement.innerHTML = `<div id='click-element' class='click-element' style='left: ${left}px; top: ${top}px'></div>`;

  const createElementTime = getTime();

  clickElement = document.querySelector('#click-element');

  getTimeToClick();

  const handleClick = () => {
    const clickTime = getTime();

    clickSpeedTime = getSpeedTime(
      createElementTime,
      clickTime
    );

    pushTime(arrTime, clickSpeedTime);

    updateResults(speedResultsElement, clickSpeedTime);

    minTime = getMinTime(arrTime);

    updateResults(minTimeResultsElement, minTime);

    maxTime = getMaxTime(arrTime);

    updateResults(maxTimeResultsElement, maxTime);

    meanTime = getMeanTime(arrTime);

    updateResults(meanTimeResultsElement, meanTime);

    clickElement.remove();

    clickCounter += 1;

    updateResults(counterResultsElement, clickCounter);

    if (gameStatus) {
      createClickElement(positionClickElement);
    }
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

      restartGame();
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

    if (!gameStatus) {
      clearInterval(countineTimeToClick);
    }

    if (currentCount !== clickCounter) {
      clearInterval(countineTimeToClick);
    }
  }, 100);
}

function cleareResults() {
  clickCounter = 0;
  totalTime = 0;
  timeToClick = 0;
  clickSpeedTime = 0;
  minTime = 0;
  maxTime = 0;
  meanTime = 0;

  arrTime.splice(0, arrTime.length);

  updateResults(counterResultsElement, clickCounter);
  updateResults(timeToClickElement, timeToClick);
  updateResults(totalTimeGameElement, totalTime);
  updateResults(speedResultsElement, clickSpeedTime);
  updateResults(minTimeResultsElement, minTime);
  updateResults(maxTimeResultsElement, maxTime);
  updateResults(meanTimeResultsElement, meanTime);
}

function createLocalHistoryObj(obj) {
  obj.clickCounter = clickCounter;
  obj.totalTime = totalTime;
  obj.clickSpeedTime = clickSpeedTime;
  obj.minTime = minTime;
  obj.maxTime = maxTime;
  obj.meanTime = meanTime;
  obj.arr = [...arrTime];
}

function toggleShow(element) {
  element.classList.toggle('hidden');
}

closeBtnElement.addEventListener('click', () =>
  toggleShow(modalElement)
);

function showFinalyResults(element, obj) {
  console.log(obj);

  const {
    clickCounter,
    totalTime,
    minTime,
    maxTime,
    meanTime,
  } = obj;

  toggleShow(element);

  updateResults(modalCounterElement, clickCounter);
  updateResults(modalTotalTimeElement, totalTime);
  updateResults(modalMinTime, minTime);
  updateResults(modalMaxTime, maxTime);
  updateResults(modalMeanTime, meanTime);
}
