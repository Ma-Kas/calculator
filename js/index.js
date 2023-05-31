// Global Variables
const maxDisplayLength = 11;
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
    if (currentValue1 === 'error') handleAC(); // safety to clear everything after error

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
  // switch whether user is currently inputting operand1 or 2, based on presence or absence of operator
  if (currentOperator === '') {
    workingOperand = 1;
    // prevent input of more than 1 decimal place
    if (currentValue1.includes('.')) {
      if (currentValue1.length > (currentValue1.indexOf('.') + 1)) return;
    }
    currentValue1 += num;

  } else {
    workingOperand = 2;
    // prevent input of more than 1 decimal place
    if (currentValue2.includes('.')) {
      if (currentValue2.length > (currentValue2.indexOf('.') + 1)) return;
    }
    currentValue2 += num;
  }

  contentMainDisplay.push(num);
}


function operatorInput(operator, operatorName) {
  if (currentValue1 === '') return; // case: prevent input of operator before operand 1
  
  // already has operator => double tap or calculation chain initiated 
  if (!(currentOperator === '')) {
    if (currentValue2 === '') { // don't calculate, user just wants to change operator
      contentMainDisplay.pop();
    } else {
      calculate(currentOperator); // calculate intermediate step, before accepting new operator
    }
  }

  currentOperator = operator;

  // handling of ² for aesthetics only
  if (operatorName === 'x2') {
    contentMainDisplay.push('²');
  } else {
    contentMainDisplay.push(operatorName);
  }

  workingOperand = 2;
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
  if (!(currentOperator === '')) return; // don't allow changing sign if operator is present

  // toggle '-' sign in current working operand
  switch (workingOperand) {
    case 1:
      if (currentValue1 === '0') return;

      if (currentValue1.includes('-')) {
        currentValue1 = currentValue1.replace('-', '');
      } else {
        currentValue1 = '-' + currentValue1;
      }
      break;
    
    case 2:
      if (currentValue2 === '0') return;

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
      if (currentValue1.includes('.')) return; // prevent second decimal point
      else {
        currentValue1 = currentValue1 + '.';
        break;
      }
     
    case 2:
      if (currentValue2.includes('.')) return; // prevent second decimal point
      else {
        currentValue2 = currentValue2 + '.';
        break;
      }
  }

  contentMainDisplay.push('.');
}


function handleSaveLoad(type) {
  if (type === 'save') {
    // save case
    savedValue = currentValue1;
  
  } else {
    // load case
    if (savedValue === '') return; // return if nothing to load
    else {

      switch (workingOperand) {
        case 1:
            currentValue1 = savedValue;
            break;
         
        case 2:
          currentValue2 = savedValue;
          break;
      }

      contentMainDisplay.push(savedValue);
      updateDisplay();
    }
  }
}


function handleDelete() {
  // Delete last digit
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
  contentSubDisplay = [];
  contentMainDisplay = [];

  workingOperand = 1;
  currentValue1 = '';
  currentValue2 = '';
  currentOperator = '';
}


function calculate(operator) {
  // exception handling
  if ((currentOperator === '')) return;

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
      // handle divide by 0
      if (currentValue2 === '0') {
        result = 'error';

      } else {
        result = (parseFloat(currentValue1) / parseFloat(currentValue2));
      }
      break;

    case 'squared':
      result = (parseFloat(currentValue1) ** 2);
      break;

    case 'percent':
      result = (parseFloat(currentValue1) / 100);
      break;
  }

  if (typeof(result) === 'number') {
    result = String(Math.round(result * 100) / 100);
  }
  
  currentValue1 = result;
  currentValue2 = '';
  currentOperator = '';
  workingOperand = 1;

  // handle numbers too long to display
  if (result.length > maxDisplayLength) {
    result = convertScientificNotation(result);
  }

  contentSubDisplay = [...contentMainDisplay];
  contentSubDisplay.push('=');
  contentMainDisplay = Array.from(result);

}


function convertScientificNotation(number) {
  // display is rounded, actual variable to calculate with stays correct
  // round to 5 decimal places
  let converted = String(Math.round(number));
  let length = converted.length;
  
  converted = converted.slice(0, 1) + '.' + converted.slice(1);
  converted = parseFloat(converted);
  converted = converted.toFixed(5);

  converted = `${converted}e${length - 1}`;
  
  return converted;
}


function updateDisplay() {
  // display current values
  displayMain.textContent = contentMainDisplay.join('');
  displaySub.textContent = contentSubDisplay.join('');
}