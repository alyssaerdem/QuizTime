const select = document.getElementById("select");
const submit = document.getElementById("submit");
let value = 5;
let url = `html/game.html?amount=${value}`;

const handleChange = (e) => {
  console.log(e);
  value = e.target.value;
  url = `html/game.html?amount=${value}`;
  console.log(url);
};
const handleSubmit = (_e) => {
  console.log(url);
  window.location.href = url;
};

select.addEventListener("change", handleChange);
submit.addEventListener("click", handleSubmit);
