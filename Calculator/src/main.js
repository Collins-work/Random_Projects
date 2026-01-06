
let input = document.getElementById("input");
let expression = "";

document.getElementById("7").onclick = function () {
    expression += "7";
    input.textContent = expression;
};

document.getElementById("8").onclick = function () {
    expression += "8";
    input.textContent = expression;
};

document.getElementById("9").onclick = function () {
    expression += "9";
    input.textContent = expression;
};

document.getElementById("4").onclick = function () {
    expression += "4";
    input.textContent = expression;
};

document.getElementById("5").onclick = function () {
    expression += "5";
    input.textContent = expression;
};

document.getElementById("6").onclick = function () {
    expression += "6";
    input.textContent = expression;
};

document.getElementById("1").onclick = function () {
    expression += "1";
    input.textContent = expression;
};

document.getElementById("2").onclick = function () {
    expression += "2";
    input.textContent = expression;
};

document.getElementById("3").onclick = function () {
    expression += "3";
    input.textContent = expression;
};

document.getElementById("0").onclick = function () {
    expression += "0";
    input.textContent = expression;
};

// Operators
document.getElementById("plus").onclick = function () {
    expression += "+";
    input.textContent = expression;
};

document.getElementById("minus").onclick = function () {
    expression += "-";
    input.textContent = expression;
};

document.getElementById("multiply").onclick = function () {
    expression += "*";
    input.textContent = expression;
};

document.getElementById("division").onclick = function () {
    expression += "/";
    input.textContent = expression;
};

document.getElementById("decimal").onclick = function () {
    if (!expression.endsWith(".")) {
        expression += ".";
        input.textContent = expression;
    }
};

document.getElementById("plus-minus").onclick = function () {
    if (expression.startsWith("-")) {
        expression = expression.slice(1);
    } else {
        expression = "-" + expression;
    }
};

// Equal button
document.getElementById("equal").onclick = function () {
    try {
        expression = eval(expression);
        input.textContent = expression;
    } catch (e) {
        input.textContent = "Error";
        expression = " ";
    }
};

// Clear button
document.getElementById("clear").onclick = function () {
    expression = "";
    input.textContent = "";
};

// Clear All button
document.getElementById("clear-all").onclick = function () {
    expression = "";
    input.textContent = "";
};
// Backspace button
document.getElementById("backspace").onclick = function () {
    expression = expression.slice(0, -1);
    input.textContent = expression;
};
// Keyboard support
document.addEventListener("keydown", function (event) {
    let key = event.key;

    if (!isNaN(key) || key === ".") {
        expression += key;
        input.textContent = expression;
    }

    if (key === "+" || key === "-" || key === "/" || key == "*") {
        expression += key;
        input.textContent = expression;
    }
    if (key === "Backspace") {
        expression = expression.slice(0, -1);
        input.textContent = expression;
    }
    if (key === "Escape") {
        expression = "";
        input.textContent = "";
    }
    if (key === "=" || key === "Enter") {
        try {
            expression = eval(expression);
            input.textContent = expression;
        } catch (e) {
            expression = "Error";
            input.textContent = expression;
        }
    }
});