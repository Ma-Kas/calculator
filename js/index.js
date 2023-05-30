// Global Variables
let contentSubDisplay = [];
let contentMainDisplay = [];

let savedValue = '';

let workingOperand = 1; // is currently inputting operand 1 or 2
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
          calculate(currentOperator);
        } else if (e.target.id === 'plusminus') {
          handlePlusMinus();
        } else if (e.target.id === 'dot') {
          handleDecimal();
        } else {
          console.log(e.target.textContent)
          operatorInput(e.target.id, e.target.textContent);
        }
        break;

      case 'func':
        funcInput(e.target.id);
        break;
    }

    updateDisplay();
  });
}


function numberInput(num) {
  if (currentOperator === '') {
    workingOperand = 1;
    currentValue1 += num;
  } else {
    workingOperand = 2;
    currentValue2 += num;
  }
  contentMainDisplay.push(num);
}


function operatorInput(operator, operatorName) {
  if (currentOperator === '') {
    currentOperator = operator;

    if (operatorName === 'x2') {
      contentMainDisplay.push('²');
    } else {
      contentMainDisplay.push(operatorName);
    }
    
  } else {
    calculate(currentOperator);
    currentOperator = operator;

    if (operatorName === 'x2') {
      contentMainDisplay.push('²');
    } else {
      contentMainDisplay.push(operatorName);
    }
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
      handleDelete();
      break;
    case 'ac':
      handleAC();
      break;
  }
}


function handlePlusMinus() {
  if (!(currentOperator === '')) return;

  switch (workingOperand) {
    case 1:
      if (currentValue1.includes('-')) {
        currentValue1 = currentValue1.replace('-', '');
      } else {
        currentValue1 = '-' + currentValue1;
      }
      break;
    
    case 2:
      if (currentValue2.includes('-')) {
        currentValue2 = currentValue2.replace('-', '');
      } else {
        currentValue2 = '-' + currentValue2;
      }
      break;
  }

  // toggle '-' prefix in display variable
  if (contentMainDisplay[0] === '-') {
    contentMainDisplay.shift();
  } else {
    contentMainDisplay.unshift('-');
  }

}


function handleDecimal() {
  switch (workingOperand) {
    case 1:
      if (currentValue1.includes('.')) {
        return;
      } else {
        currentValue1 = currentValue1 + '.';
        break;
      }
     
    case 2:
      if (currentValue2.includes('.')) {
        return;
      } else {
        currentValue2 = currentValue2 + '.';
        break;
      }
  }

  contentMainDisplay.push('.');
}


function handleSaveLoad(type) {
  if (type === 'save') {
    savedValue = currentValue1;
  } else {
    if (savedValue === '') {
      return;
    } else {
      contentMainDisplay = Array.from(savedValue);
      updateDisplay();
    }
  }
}


function handleDelete() {
  // Delete last digit
  // depending on workingOperand, delete value1 or 2
  // delete contentDisplayMain
  switch (workingOperand) {
    case 1:
        currentValue1 = currentValue1.slice(0, -1); // return new string from index 0 up to second last one
        break;
     
    case 2:
      currentValue2 = currentValue2.slice(0, -1);
      break;
  }

  contentMainDisplay.pop();
}


function handleAC() {
  // Clear all variables EXCEPT saved value
}


function calculate(operator) {
  let result = '';

  switch (operator) {
    case 'plus':
      result = (parseFloat(currentValue1) + parseFloat(currentValue2));
      break;
    
    case 'minus':
      result = (parseFloat(currentValue1) - parseFloat(currentValue2));
      break;

    case 'times':
      result = (parseFloat(currentValue1) * parseFloat(currentValue2));
      break;

    case 'divide':
      result = (parseFloat(currentValue1) / parseFloat(currentValue2));
      break;

    case 'squared':
      result = (parseFloat(currentValue1) ** 2);
      break;

    case 'percent':
      result = (parseFloat(currentValue1) / 100);
      break;
  }

  result = String(Math.round(result * 10) / 10);

  currentValue1 = result;
  currentValue2 = '';
  currentOperator = '';
  workingOperand = 1;

  contentSubDisplay = [...contentMainDisplay];
  contentSubDisplay.push('=');
  contentMainDisplay = Array.from(result);

}


function updateDisplay() {
  // display current values
  displayMain.textContent = contentMainDisplay.join('');
  displaySub.textContent = contentSubDisplay.join('');
}