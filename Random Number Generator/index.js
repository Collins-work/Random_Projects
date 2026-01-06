const Number = document.getElementById('Number');
const GenerateBtn = document.getElementById('GenerateBtn');
const min = document.getElementById('Minimuminput');
const max = document.getElementById('Maximuminput');
let randomNumber;

GenerateBtn.onclick = function () {
    randomNumber = Math.floor(Math.random() * (max.value - min.value) + min.value)
    Number.textContent = randomNumber;
}