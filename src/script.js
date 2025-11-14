let display = document.getElementById("display");

function appendToDisplay(value) {
  if (display.innerText === "0" && value !== ".") {
    display.innerText = value;

  } else if (display.innerText === "0" && value === ".") {
      display.innerText = "0."

  } else {
    display.innerText += value;
  }
}

function clearDisplay() {
  display.innerText = "0";
}

function backspace() {
  display.innerText = display.innerText.slice(0, -1) || "0";
}

function handleParentheses(eval_str) {
  let openCount = 0;
  let closeCount = 0;
  // Count open and close parentheses
  for (let char of eval_str) {
    if (char === "(") openCount++;
    if (char === ")") closeCount++;
  }
  // If opens was more than closes, appends closing parentheses
  while (openCount > closeCount) {
    eval_str += ")";
    closeCount++;
  }
  return eval_str;
}

function inputValidation(eval_str) {
  try {
    // Add "*" before or after prantheses that haven't any operators
    eval_str = eval_str.replace(/([\d.]+)\(/g, '$1*(');
    eval_str = eval_str.replace(/\)(?=[\d.])/g, ')*');
    // Replacesqrt "√" with Math.sqrt( in "eval_str"
    eval_str = eval_str.replace(/√/g, "Math.sqrt(");
    // Auto close the Parenthesis when finds an operator after "sqrt("
    eval_str = eval_str.replace(/\.sqrt\(([^()+\-*/]+)([+\-*/])/g,".sqrt($1)$2");
    // Add "*" before "√", handles cases like 2√16
    eval_str = eval_str.replace(/([\d.]+)Math/g, '$1*Math.sqrt(');
    // Auto close prantheses
    eval_str = handleParentheses(eval_str);

  } catch {
     display.innerText = "Error";
  }
  return eval_str
}

function calculate() {
  let eval_str = inputValidation(display.innerText);
  try {
    let result = eval(eval_str);
    // Check for zero-division error and other infinities
    if (!isFinite(result)) {
      throw new Error("Invalid calculation");
    }
    // Round if it was a long float
    result = Number(result.toPrecision(3));
    display.innerText = result;

  } catch (error) {
    display.innerText = "Error";
    setTimeout(clearDisplay, 1500);
  }
}

// Connect specific keyboard buttons to the app
document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (
    (key >= "0" && key <= "9") ||
    key === "." ||
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/"
  ) {
    appendToDisplay(key);

  } else if (key === "Enter") {
    event.preventDefault();
    calculate();

  } else if (key === "Escape" || key === "Delete" || key === "c") {
    clearDisplay();

  } else if (key === "(" || key === ")") {
    appendToDisplay(key);

  } else if (key === "Backspace") {
    event.preventDefault();
    backspace();
  }
});