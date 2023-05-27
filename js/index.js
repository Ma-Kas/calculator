// Global Variables
let contentSubArr = [];
let contentMainArr = [];


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
    console.log(e.target.id);
  });
}
