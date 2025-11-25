let board = document.querySelector(".board");
let blockHeight = 30;
let blockWidth = 30;

let cols = Math.floor(board.clientWidth / blockWidth);
let rows = Math.floor(board.clientHeight / blockHeight);

for (let i = 0; i < rows * cols; i++) {
  let block = document.createElement("div");
  block.classList.add("block");
  board.appendChild(block);
}
