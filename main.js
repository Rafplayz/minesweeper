const Consts = {
  WIDTH: 30,
  HEIGHT: 16,
  MINES: 99
}

let cellArr2D = [];
let gridArr2D = [];

let minesLeftGlobal;
let gameOver;
let hasGameBeenClicked = false;

class Cell {
  isMine;
  constructor(cellsLeft) {
    if (!minesLeftGlobal) this.isMine = false;
    else {
      let rand = Math.random() * cellsLeft
      if (rand <= minesLeftGlobal) {
        this.isMine = true;
        minesLeftGlobal--;
      }
      else this.isMine = false;
    }
  }
}

/**
 * 
 * @param {MouseEvent} e 
 */
function onMouseUpCell(e) {
  if (!gameOver) {
    e.preventDefault();
    console.log("clicked", e)
    let cell = cellArr2D[e.target.dataset.row][e.target.dataset.column]
    let cellElement = gridArr2D[e.target.dataset.row][e.target.dataset.column]
    console.log(cell);
    console.log(cellElement);

    // clicked
    if(e.button == 0) {
      if(cellElement.dataset.isFlagged == 0) {
        if (cell.isMine) {
          if(!hasGameBeenClicked) {
            startGame();
            onMouseUpCell(e);
            return;
          }
          cellElement.style.backgroundColor = "red";
          gameOver = true;
          let i = 0;
          cellArr2D.forEach(arr => {
            let j = 0;
            arr.forEach(cellv => {
              if(cellv.isMine) gridArr2D[i][j].classList.add("mine")
              else {};
              j++;
            })
            i++;
          })
        }
        else {
          hasGameBeenClicked = true;
          cellElement.innerText = mineCountAndStyle(cellElement, parseInt(e.target.dataset.row), parseInt(e.target.dataset.column));
        }
      }
    }
  }
}

function onMouseDownCell(e) {
  //right clicked
  if(e.button == 2) {
    console.log("right clicked", e)
    e.preventDefault();
    let cellElement = gridArr2D[e.target.dataset.row][e.target.dataset.column]
    flagCell(cellElement);
  }
}

function flagCell(cellElement) {
  if(gameOver) return;
  if(cellElement.innerText) return;
  if(cellElement.dataset.isFlagged == "1") {
    console.log("cell is flagged")
    cellElement.dataset.isFlagged = 0;
    cellElement.classList.remove("flagged");
  }
  else {
    cellElement.classList.add("flagged");
    cellElement.dataset.isFlagged = 1;
  }
}

function mineCountAndStyle(selfElement, row, column) {
  let mineCount = scoutForMines(parseInt(row), parseInt(column))
  selfElement.classList.add("cleared", `mines${mineCount}`)

  return mineCount
}

function generateGridCells(height, width) {
  const grid = document.querySelector(".grid");

  if (!grid) throw new Error("No grid found");

  for (let i = 0; i < height; i++) {
    gridArr2D[i] = [];
    for (let j = 0; j < width; j++) {
      let div = document.createElement("div");
      div.className = "cell";
      div.dataset.row = i;
      div.dataset.column = j;
      div.dataset.isFlagged = 0;

      div.addEventListener("mouseup", onMouseUpCell);
      div.addEventListener("mousedown", onMouseDownCell);
      
      grid.appendChild(div);

      gridArr2D[i][j] = div;
    }
  }
}

function determineMines(minecount, height, width) {
  let cellsLeft = width * height;
  minesLeftGlobal = minecount;
  for (let i = 0; i < height; i++) {
    cellArr2D[i] = []
    for (let j = 0; j < width; j++) {
      cellArr2D[i][j] = new Cell(cellsLeft);
      cellsLeft--;
    }
  }
}

function debugMines() {
  let totalMines = 0;
  cellArr2D.forEach(arr => arr.forEach(cell => {
    if (cell.isMine) totalMines++;
  }))
  return totalMines;
}

function checkMine(arr, num) {
  if (arr == undefined) return false;
  if (arr[num] == undefined) return false;
  return arr[num].isMine;
}
function scoutForMines(row, column) {
  let mineCount = 0;
  console.log("row", row)
  console.log("column", column)
  if(checkMine(cellArr2D[row-1], column-1)) mineCount++;

  if(checkMine(cellArr2D[row], column-1)) mineCount++;

  if(checkMine(cellArr2D[row+1], column-1)) mineCount++;


  if(checkMine(cellArr2D[row-1], column)) mineCount++;

  if(checkMine(cellArr2D[row], column)) mineCount++;

  if(checkMine(cellArr2D[row+1], column)) mineCount++;


  if(checkMine(cellArr2D[row-1], column+1)) mineCount++;

  if(checkMine(cellArr2D[row], column+1)) mineCount++;

  if(checkMine(cellArr2D[row+1], column+1)) mineCount++;
  return mineCount;
}

function resetGame() {
  cellArr2D = [];
  gridArr2D.forEach(arr => arr.forEach(element => document.querySelector(".grid").removeChild(element)));
  gridArr2D = [];
  hasGameBeenClicked = false;

}

function startGame() {
  gameOver = false;
  resetGame();
  generateGridCells(Consts.HEIGHT, Consts.WIDTH);
  determineMines(Consts.MINES, Consts.HEIGHT, Consts.WIDTH);
}

function main() {
  startGame();

  console.log(gridArr2D);
  console.log(cellArr2D);
  console.log(debugMines());

  document.querySelector(".resetbutton").onclick = startGame;
  document.querySelector(".grid").oncontextmenu = () => false;
  return;
}



main();