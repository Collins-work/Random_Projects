import './style.css'

const Nameinput = document.getElementById("Nameinput");
const Emailinput = document.getElementById("Emailinput");
const Name_error = document.getElementById("Name-error");
const Email_error = document.getElementById("Email-error");
const Selection = document.getElementById("Selection");
const option1 = document.getElementById("select-option");
const submitbtn = document.getElementById("submitbtn");

submitbtn.onclick = function () {
  if (Nameinput === "") {
    Name_error.style.display = "none";
  } else {
    Name_error.style.display = "block";
  }

}