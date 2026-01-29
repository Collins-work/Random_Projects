const submitbtn = document.getElementById("submitbtn");
const Name_error = document.getElementById("Name_error");
const Email_error = document.getElementById("Email_error");
const Selection_tag = document.getElementById("Selection_tag");
const select_option = document.getElementById("select_option");

submitbtn.onclick = function () {
  if (!Name_error === '' || !Email_error === '' || !Selection_tag === select_option) {
    window.alert("This form has been submitted!!")
  }

}
