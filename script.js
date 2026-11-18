const previousOperandEl = document.getElementById("previous-operand");
const currentOperandEl = document.getElementById("current-operand");
const keys = document.getElementById("keys");

let currentInput = "0";
let previousInput = "";
let operation = null;
let shouldResetScreen = false;

function updateDisplay() {
  currentOperandEl.textContent = currentInput;
  previousOperandEl.textContent = previousInput && operation
    ? `${formatNumber(previousInput)} ${symbolFor(operation)}`
    : "";
}

function formatNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 10
  }).format(number) : value;
}

function appendNumber(number) {
  if (currentInput === "Error" || shouldResetScreen) {
    currentInput = number;
    shouldResetScreen = false;
  } else if (currentInput === "0") {
    currentInput = number;
  } else if (currentInput.length < 16) {
    currentInput += number;
  }
  updateDisplay();
}

function appendDecimal() {
  if (currentInput === "Error" || shouldResetScreen) {
    currentInput = "0";
    shouldResetScreen = false;
  }
  if (!currentInput.includes(".")) currentInput += ".";
  updateDisplay();
}

function chooseOperator(nextOperation) {
  if (currentInput === "Error") return;
  if (operation && !shouldResetScreen) calculate();
  previousInput = currentInput;
  operation = nextOperation;
  shouldResetScreen = true;
  updateDisplay();
}

function calculate() {
  if (!operation || previousInput === "") return;
  const first = Number(previousInput);
  const second = Number(currentInput);
  let result;

  switch (operation) {
    case "+": result = first + second; break;
    case "-": result = first - second; break;
    case "*": result = first * second; break;
    case "/":
      if (second === 0) {
        currentInput = "Error";
        previousInput = "";
        operation = null;
        shouldResetScreen = true;
        updateDisplay();
        return;
      }
      result = first / second;
      break;
    default: return;
  }

  result = Number.parseFloat(result.toPrecision(12));
  currentInput = String(result);
  previousInput = "";
  operation = null;
  shouldResetScreen = true;
  updateDisplay();
}

function clearCalculator() {
  currentInput = "0";
  previousInput = "";
  operation = null;
  shouldResetScreen = false;
  updateDisplay();
}

function deleteLast() {
  if (currentInput === "Error" || shouldResetScreen) {
    currentInput = "0";
    shouldResetScreen = false;
  } else {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    if (currentInput === "-") currentInput = "0";
  }
  updateDisplay();
}

function symbolFor(op) {
  return ({ "*": "×", "/": "÷", "+": "+", "-": "−" })[op] || op;
}

function handleAction(button) {
  if (button.dataset.number !== undefined) appendNumber(button.dataset.number);
  else {
    const action = button.dataset.action;
    if (action === "clear") clearCalculator();
    if (action === "delete") deleteLast();
    if (action === "decimal") appendDecimal();
    if (action === "operator") chooseOperator(button.dataset.operator);
    if (action === "equals") calculate();
  }
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  handleAction(button);
  button.classList.add("pressed");
  window.setTimeout(() => button.classList.remove("pressed"), 130);
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) appendNumber(event.key);
  else if (event.key === ".") appendDecimal();
  else if (["+", "-", "*", "/"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clearCalculator();
});

updateDisplay();
