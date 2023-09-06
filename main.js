let puzzleArray;
let numOfColors = 2;
const color = { 0: '#3c4fe0', 1: '#B91C1C', 2: '#DDE17F' }
const root = document.querySelector(':root');
const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // up, right, down, left

const puzzleOneButton = document.querySelector('.puzzleOne');
const puzzleTwoButton = document.querySelector('.puzzleTwo');
const puzzleThreeButton = document.querySelector('.puzzleThree');

const PUZZLES = {
  puzzleOne: [[1, 0], [0, 1]],
  puzzleTwo: [[1, 0], [0, 2]],
  puzzleThree: [[0, 1, 0], [1, 0, 1], [0, 1, 0]]
}

puzzleOneButton.addEventListener('click', () => {
  puzzleArray = populatePuzzleGrid(PUZZLES['puzzleOne'].length, PUZZLES['puzzleOne'][0].length, PUZZLES['puzzleOne']);
});

puzzleTwoButton.addEventListener('click', () => {
  puzzleArray = populatePuzzleGrid(PUZZLES['puzzleTwo'].length, PUZZLES['puzzleTwo'][0].length, PUZZLES['puzzleTwo'], 3);
});

puzzleThreeButton.addEventListener('click', () => {
  puzzleArray = populatePuzzleGrid(PUZZLES['puzzleThree'].length, PUZZLES['puzzleThree'][0].length, PUZZLES['puzzleThree']);
});

function populatePuzzleGrid(row, col, puzzleTemplate, amountOfColors = 2) {
  const puzzleGrid = document.querySelector('.puzzleGrid');
  const puzzleArray = puzzleTemplate.map((r) => { return [...r] });
  puzzleGrid.style['pointer-events'] = 'auto';
  puzzleGrid.innerHTML = '';
  numOfColors = amountOfColors;
  root.style.setProperty('--row', row);
  root.style.setProperty('--col', col);

  for (let r = 0; r < row; r++) {
    for (let c = 0; c < col; c++) {
      const cell = createCell(r, c, puzzleArray);
      puzzleGrid.appendChild(cell);
      cell.addEventListener('click', gridUpdate, { once: true });
    }
  }
  return puzzleArray;
}

function createCell(r, c, puzzleArray) {
  const cell = document.createElement('div');
  cell.dataset.row = r;
  cell.dataset.col = c;
  cell.classList.add('puzzleCell');
  cell.style.backgroundColor = color[puzzleArray[r][c]];
  return cell;
}

function gridUpdate(event) {
  clickAnimation(event.target);
  updateColors(event, puzzleArray);
}

function clickAnimation(ele) {
  ele.classList.add('turnAnimation');
  ele.removeEventListener('click', gridUpdate);
  ele.addEventListener('animationend', function handler() {
    this.classList.remove('turnAnimation');
    this.removeEventListener('animationend', handler);
    this.addEventListener('click', gridUpdate, { once: true });
  })
}

function updateColors(ele, puzzleArray) {
  const cell = ele.srcElement;
  let row = parseInt(cell.dataset.row), col = parseInt(cell.dataset.col);
  puzzleArray[row][col] = (puzzleArray[row][col] + 1) % numOfColors;
  cell.style.backgroundColor = color[puzzleArray[row][col]];
  for (let dir of directions) {
    if (row + dir[0] >= 0 && row + dir[0] < puzzleArray.length && col + dir[1] >= 0 && col + dir[1] < puzzleArray[0].length) {
      const neighborCell = document.querySelector(`[data-row='${row + dir[0]}'][data-col='${col + dir[1]}']`);
      puzzleArray[row + dir[0]][col + dir[1]] = (puzzleArray[row + dir[0]][col + dir[1]] + 1) % numOfColors
      neighborCell.style.backgroundColor = color[puzzleArray[row + dir[0]][col + dir[1]]];
      clickAnimation(neighborCell);
    }
  }
  if (!checkSolution(puzzleArray)) {
    document.querySelector('.puzzleGrid').style['pointer-events'] = 'none';
  };
}


function checkSolution(puzzleArray) {
  let answer = puzzleArray.reduce((acc, curr) => {
    return acc + curr.reduce((p, c) => { return p + c; }, 0)
  }, 0);
  return answer;
}
