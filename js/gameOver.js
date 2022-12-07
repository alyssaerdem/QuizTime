let params = new URLSearchParams(location.search);
let score = params.get("score");
let total = params.get("total");
let scoreText = document.getElementById("score");
scoreText.innerText = `Final Score: ${score}/${total}`;
