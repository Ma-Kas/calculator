// Global Variables
let contentSubArr = [];
let contentMainArr = [];

let savedValue = '';

let currentValue1 = '';
let currentValue2 = '';
let currentOperator = '';


// References to DOM elements
const displaySub = document.querySelector('#display-sub');
const displayMain = document.querySelector('#display-main');

const btns = document.querySelectorAll('button');
const keysFuncs = document.querySelectorAll('.func');
const keysNums = document.querySelectorAll('.numbers');
const keysOperators = document.querySelectorAll('.operators');


// Add EventListener to all buttons
for (let btn of btns) {
  btn.addEventListener('click', (e) => {
    switch (e.target.className) {
      case 'numbers':
        numberInput(e.target.id);
        break;

      case 'operators':
        if (e.target.id === 'equal') {
          console.log(calculate(currentValue1, currentValue2, currentOperator));
        } else if (e.target.id === 'plusminus') {
          handlePlusMinus();
        } else if (e.target.id === 'dot') {
          handleDecimal();
        } else {
          operatorInput(e.target.id);
        }
        break;

      case 'func':
        funcInput(e.target.id);
        break;
    }
  });
}


function numberInput(num) {
  if (currentOperator === '') {
    currentValue1 += num;
    console.log(currentValue1);
  } else {
    currentValue2 += num;
    console.log(currentValue2);
  }
  // display the new value in display main
}


function operatorInput(operator) {
  if (currentOperator === '') {
    currentOperator = operator;
  } else {
    calculate(currentValue1, currentValue2, currentOperator);
    currentOperator = operator;
  }
}


function funcInput(func) {
  switch (func) {
    case 'load':
      handleSaveLoad('load');
      break;
    case 'save':
      handleSaveLoad('save');
      break;
    case 'del':
      // delete last digit
      break;
    case 'ac':
      // clear display, clear all variables
      break;
  }
}


function handlePlusMinus() {
  // if current value is positive, make negative (prepend -), else
  // if current value is negative, make positive
  if (currentValue1.includes('-')) {
    currentValue1 = currentValue1.replace('-', '');
  } else {
    currentValue1 = '-' + currentValue1;
  }
}


function handleDecimal() {
  // if current input already has a decimal point, ignore input
  // else insert decimal point
  if (currentValue1.includes('.')) {
    return;
  } else {
    currentValue1 = currentValue1 + '.';
  }
}


function updateDisplay() {
  // display current values
  displayMain.textContent = currentValue1;
}


function handleSaveLoad(type) {
  if (type === 'save') {
    // Store current display in savedValue
  } else {
    // If there is no stored savedValue, return
    // If there is a stored savedValue, put it into current display
  }
}


function calculate(value1, value2, operator) {
  switch (operator) {
    case 'plus':
      return (parseFloat(value1) + parseFloat(value2));
    
    case 'minus':
      return (parseFloat(value1) - parseFloat(value2));

    case 'times':
      return (parseFloat(value1) * parseFloat(value2));
    
    case 'divide':
      return (parseFloat(value1) / parseFloat(value2));
    
    case 'squared':
      return (parseFloat(value1) ** 2);
    
    case 'percent':
      return (parseFloat(value1) / 100);
  }
}
