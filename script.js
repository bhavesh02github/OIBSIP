const buttons = document.querySelectorAll('.key');
const displayInput = document.querySelector('.display .input');
const displayOutput = document.querySelector('.display .output');

let expression = "";

for (const button of buttons) {
  const value = button.dataset.key;

  button.addEventListener('click', () => {
    if (value === "clear") {
      expression = "";
      displayInput.innerHTML = "";
      displayOutput.innerHTML = "";
    } else if (value === "backspace") {
      expression = expression.slice(0, -1);
      displayInput.innerHTML = sanitizeInput(expression);
    } else if (value === "=") {
      const result = evaluate(expression);
      displayOutput.innerHTML = sanitizeOutput(result);
    } else if (value === "brackets") {
      if (
        expression.indexOf("(") === -1 ||
        expression.indexOf("(") !== -1 &&
        expression.indexOf(")") !== -1 &&
        expression.lastIndexOf("(") < expression.lastIndexOf(")")
      ) {
        expression += "(";
      } else if (
        expression.indexOf("(") !== -1 &&
        expression.indexOf(")") === -1 ||
        expression.indexOf("(") !== -1 &&
        expression.indexOf(")") !== -1 &&
        expression.lastIndexOf("(") > expression.lastIndexOf(")")
      ) {
        expression += ")";
      }

      displayInput.innerHTML = sanitizeInput(expression);
    } else {
      if (validateInput(value)) {
        expression += value;
        displayInput.innerHTML = sanitizeInput(expression);
      }
    }
  });
}

function sanitizeInput(input) {
  const inputArray = input.split("");
  const inputArrayLength = inputArray.length;

  for (let i = 0; i < inputArrayLength; i++) {
    if (inputArray[i] === "*") {
      inputArray[i] = ` <span class="operator">x</span> `;
    } else if (inputArray[i] === "/") {
      inputArray[i] = ` <span class="operator">÷</span> `;
    } else if (inputArray[i] === "+") {
      inputArray[i] = ` <span class="operator">+</span> `;
    } else if (inputArray[i] === "-") {
      inputArray[i] = ` <span class="operator">-</span> `;
    } else if (inputArray[i] === "(") {
      inputArray[i] = `<span class="brackets">(</span>`;
    } else if (inputArray[i] === ")") {
      inputArray[i] = `<span class="brackets">)</span>`;
    } else if (inputArray[i] === "%") {
      inputArray[i] = `<span class="percent">%</span>`;
    }
  }

  return inputArray.join("");
}

function sanitizeOutput(output) {
  let outputString = output.toString();
  let decimal = outputString.split(".")[1];
  outputString = outputString.split(".")[0];

  const outputArray = outputString.split("");

  if (outputArray.length > 3) {
    for (let i = outputArray.length - 3; i > 0; i -= 3) {
      outputArray.splice(i, 0, ",");
    }
  }

  if (decimal) {
    outputArray.push(".");
    outputArray.push(decimal);
  }

  return outputArray.join("");
}

function validateInput(value) {
  const lastInput = expression.slice(-1);
  const operators = ["+", "-", "*", "/"];

  if (value === "." && lastInput === ".") {
    return false;
  }

  if (operators.includes(value)) {
    if (operators.includes(lastInput)) {
      return false;
    } else {
      return true;
    }
  }

  return true;
}

function evaluate(expression) {
  const sanitizedExpression = expression.replace(/[^\d+\-*/.%()]/g, '');
  return new Function('return ' + sanitizedExpression)();
}

function prepareInput(input) {
  const inputArray = input.split("");

  for (let i = 0; i < inputArray.length; i++) {
    if (inputArray[i] === "%") {
      inputArray[i] = "/100";
    }
  }

  return inputArray.join("");
}
