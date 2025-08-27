'use strict';

// Отримання елементів
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
const stopBtnElement = document.querySelector('#stop-btn');

const settingsBtnElement =
  document.querySelector('#settings-btn');
const modalSettingsElement = document.querySelector(
  '#modal-settings'
);
const settingsFormElement = document.querySelector(
  '#settings-form'
);
const settingCounterInput = document.querySelector(
  '#setting-counter'
);
const settingCounterUnlimitInput = document.querySelector(
  '#setting-counter-unlimit'
);
const settingTotalTimeInput = document.querySelector(
  '#setting-total-time'
);
const settingTotalTimeUnlimitInput = document.querySelector(
  '#setting-total-time-unlimit'
);
const settingClickTimeInput = document.querySelector(
  '#setting-click-time'
);
const settingClickTimeUnlimitInput = document.querySelector(
  '#setting-click-time-unlimit'
);
const settingApproveBtnElement = document.querySelector(
  '#settings-approve-btn'
);
const settingResetBtnElement = document.querySelector(
  '#settings-reset-btn'
);
const settingCancelBtnElement = document.querySelector(
  '#settings-cancel-btn'
);

const modalResultsElement = document.querySelector(
  '#modal-results'
);
const modalResultsCounterElement = document.querySelector(
  '#modal-results-counter'
);
const modalResultsTotalTimeElement = document.querySelector(
  '#modal-results-total-time'
);
const modalResultsMinTime = document.querySelector(
  '#modal-results-min-time'
);
const modalResultsMaxTime = document.querySelector(
  '#modal-results-max-time'
);
const modalResultsMeanTime = document.querySelector(
  '#modal-results-mean-time'
);
const modalResultsTotalScore = document.querySelector(
  '#modal-results-total-score'
);
const modalResultsCloseBtnElement = document.querySelector(
  '#modal-results-close-btn'
);
let clickElement = null;

// const settingsDefault = {
//   settingCounterInput: true,
//   settingCounterInputValue: '',
//   settingCounterUnlimitInput: true,
//   settingTotalTimeInput: false,
//   settingTotalTimeInputValue: 30,
//   settingTotalTimeUnlimitInput: false,
//   settingClickTimeInput: true,
//   settingClickTimeInputValue: '',
//   settingClickTimeUnlimitInput: true,
// };

const settingsObj = {};

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

// Зміна для інтервалу отримання загального часу гри
let totalTimeInterval = null;
// Зміна для інтервалу отримання часу між кліками
let timeToClickInterval = null;

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

initEvents();

function initEvents() {
  startBtnElement.addEventListener('click', () => {
    startNewGame();
  });

  stopBtnElement.addEventListener('click', () => {
    finishGame();
  });

  modalResultsCloseBtnElement.addEventListener(
    'click',
    () => {
      hideElement(modalResultsElement);

      showElement(startBtnElement);
    }
  );

  settingsBtnElement.addEventListener('click', () => {
    if (modalSettingsElement.classList.contains('hidden')) {
      showElement(modalSettingsElement);
      hideElement(startBtnElement);
    } else {
      hideElement(modalSettingsElement);
      showElement(startBtnElement);
    }
  });

  settingCounterUnlimitInput.addEventListener(
    'change',
    () => {
      toggleActiveInput(
        settingCounterUnlimitInput,
        settingCounterInput
      );
    }
  );
  settingTotalTimeUnlimitInput.addEventListener(
    'change',
    () => {
      toggleActiveInput(
        settingTotalTimeUnlimitInput,
        settingTotalTimeInput
      );
    }
  );
  settingClickTimeUnlimitInput.addEventListener(
    'change',
    () => {
      toggleActiveInput(
        settingClickTimeUnlimitInput,
        settingClickTimeInput
      );
    }
  );

  settingApproveBtnElement.addEventListener('click', () => {
    settingsObj.counterLimit = settingCounterInput.value;
    settingsObj.clickTimeLimit =
      settingClickTimeInput.value;
    settingsObj.totalTimeLimit =
      settingTotalTimeInput.value;
  });

  settingResetBtnElement.addEventListener('click', () => {
    settingCounterInput.disabled = true;
    settingTotalTimeInput.disabled = false;
    settingClickTimeInput.disabled = true;
  });

  settingCancelBtnElement.addEventListener('click', () => {
    showElement(startBtnElement);
    hideElement(modalSettingsElement);
  });
}

// Перемикання інпутів
function toggleActiveInput(checkbox, fieldInput) {
  if (checkbox.checked) {
    fieldInput.value = '';
    fieldInput.disabled = true;
  } else {
    fieldInput.disabled = false;
  }
}

// Початок нової гри
function startNewGame() {
  cleareResults();

  hideElement(startBtnElement);

  showElement(stopBtnElement);

  createClickElement(positionClickElement);

  getTotalTimeGame();

  gameStatus = true;
}

function finishGame() {
  gameStatus = false;

  clearInterval(totalTimeInterval);
  clearInterval(timeToClickInterval);

  clickElement.remove();

  createLocalHistoryObj(finalyResultsObj);

  showFinalyResults(finalyResultsObj);

  hideElement(stopBtnElement);
  showElement(modalResultsElement);

  // cleareResults();
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

  const clickElementMarkUp = `<div id='click-element' class='click-element' style='left: ${left}px; top: ${top}px'></div>`;

  areaElement.insertAdjacentHTML(
    'beforeend',
    clickElementMarkUp
  );

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

// Отримання загального часу гри
function getTotalTimeGame() {
  const startTimeGame = Date.now();

  totalTimeInterval = setInterval(() => {
    totalTime = (
      Math.round(Date.now() - startTimeGame) / 1000
    ).toFixed(1);

    updateResults(totalTimeGameElement, totalTime);

    // console.log('totalTimeInterval');

    if (totalTime >= totalTimeLimit) {
      finishGame();
    }

    // if (!gameStatus) {
    //   finishGame();
    // }
  }, 100);
}

// Отримання  часу між кліками
function getTimeToClick() {
  if (timeToClickInterval) {
    clearInterval(timeToClickInterval);
  }

  const createElementTime = Date.now();

  const currentCount = clickCounter;

  timeToClickInterval = setInterval(() => {
    timeToClick = (
      Math.round(Date.now() - createElementTime) / 1000
    ).toFixed(1);

    // console.log('getTimeToClick');

    if (!gameStatus) {
      finishGame();
    }

    // if (currentCount !== clickCounter) {
    //   finishGame();
    // }

    updateResults(timeToClickElement, timeToClick);
  }, 100);
}

// Очистка результатів
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

// наповнення обїєкту для localStorage
function createLocalHistoryObj(obj) {
  obj.clickCounter = clickCounter;
  obj.totalTime = totalTime;
  obj.clickSpeedTime = clickSpeedTime;
  obj.minTime = minTime;
  obj.maxTime = maxTime;
  obj.meanTime = meanTime;
  obj.arr = [...arrTime];
}

// Відображення модального вікна із фінальними результатами
function showFinalyResults(obj) {
  console.log(obj);

  const {
    clickCounter,
    totalTime,
    minTime,
    maxTime,
    meanTime,
  } = obj;

  updateResults(modalResultsCounterElement, clickCounter);
  updateResults(modalResultsTotalTimeElement, totalTime);
  updateResults(modalResultsMinTime, minTime);
  updateResults(modalResultsMaxTime, maxTime);
  updateResults(modalResultsMeanTime, meanTime);
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

// Відображування елементу
function showElement(element) {
  element.classList.remove('hidden');
}

// скриття елементу
function hideElement(element) {
  element.classList.add('hidden');
}
