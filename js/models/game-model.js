import { gameMode } from '../data/settings.js';

class GameModel {
  #numbersLines = null;
  #numberCellsInRow = null;
  #cellsCoordsList = null;
  #sizeGameField = null;
  #cellWidth = 50;
  #cellHeight = 50;
  #lineWidth = 2;
  #isMyMove = null;
  #sizeTemplateForWin = null;
  #movesList = [];
  #numberFieldCells = null;
  #gameStatuses = {
    PLAYER_WIN: `playerWin`,
    GAME: `game`,
    END: `end`,
  };
  #gameStatus = this.#gameStatuses.GAME;

  constructor(settings) {
    this.#numbersLines = settings.numbersLines;
    this.#numberCellsInRow = settings.numberCellsInRow;
    this.#numberFieldCells = this.#numberCellsInRow ** 2;
    this.player1Character = settings.player1Character;
    this.player2Character = settings.player2Character;
    this.#isMyMove = settings.isMyMove;
    this.#cellsCoordsList = this.coordsCells;
    this.#sizeTemplateForWin = settings.sizeTemplateForWin;
    this.gameMode = settings.gameMode;
  }

  get winDirections() {
    return {
      LEFT_TO_RIGHT: `leftToRight`,
      TOP_TO_BOTTOM: `topToBottom`,
      LEFT_TOP_TO_RIGHT_BOTTOM: `leftTopToRightBottom`,
      RIGHT_TOP_TO_LEFT_BOTTOM: `rightTopToLeftBottom`,
    };
  }

  get gameStatuses() {
    return this.#gameStatuses;
  }

  get gameStatus() {
    return this.#gameStatus;
  }

  set gameStatus(status) {
    this.#gameStatus = status;
  }

  get isOnlineMode() {
    return this.gameMode === gameMode.ONLINE;
  }

  get isFreeze() {
    return this.isOnlineMode && !this.isMyMove;
  }

  get cellWidth() {
    return this.#cellWidth;
  }

  get cellHeight() {
    return this.#cellHeight;
  }

  get imageWidth() {
    return this.#cellWidth;
  }

  get imageHeight() {
    return this.#cellHeight;
  }

  get isMyMove() {
    return this.#isMyMove;
  }

  changePlayer() {
    this.#isMyMove = !this.#isMyMove;
  }

  get gameStatusText() {
    return this.#isMyMove ? `Ваш ход` : `Ход соперника`;
  }

  get coordsCells() {
    //возвращает данные ввиде матрицы

    if (this.#cellsCoordsList) {
      return this.#cellsCoordsList;
    }

    const cellsList = new Array(this.#numberCellsInRow ** 2).fill(null);

    const startCoords = {
      startX: 0,
      startY: 0,
      colIndex: 0,
      rowIndex: 0,
      cellsCoordsList: [],
    };

    const { cellsCoordsList } = cellsList.reduce((startCoords, cell, i) => {
      let rowCoordsList;
      const row = this.#numberCellsInRow;
      let { startX, startY, cellsCoordsList } = startCoords;

      startX = startX + this.#lineWidth;
      const endX = startX + this.#cellWidth;
      const coordX = [startX, endX];

      startY = startY + this.#lineWidth;
      const endY = startY + this.#cellHeight;
      const coordY = [startY, endY];
      const rowIndex = i % row ? startCoords.rowIndex : ++startCoords.rowIndex;
      const colIndex = i % row ? ++startCoords.colIndex : 1;

      if (i % row) {
        rowCoordsList = startCoords.cellsCoordsList[rowIndex - 1];
      } else {
        rowCoordsList = [];
        cellsCoordsList.push(rowCoordsList);
      }
      rowCoordsList.push({
        index: colIndex - 1,
        isEmpty: true,
        coords: [coordX, coordY],
        rowIndex,
        colIndex,
        i,
      });

      return {
        startX: (i + 1) % row ? endX : 0,
        startY: (i + 1) % row ? startY - this.#lineWidth : endY,
        cellsCoordsList,
        rowIndex,
        colIndex,
      };
    }, startCoords);

    return cellsCoordsList;
  }

  get sizeGameField() {
    if (this.#sizeGameField) {
      return this.#sizeGameField;
    }

    return {
      width: this.#cellWidth * this.#numberCellsInRow + this.#lineWidth * this.#numbersLines,
      height: this.#cellHeight * this.#numberCellsInRow + this.#lineWidth * this.#numbersLines,
    };
  }

  get gameFieldSettings() {
    return {
      cellHeight: this.#cellHeight,
      cellWidth: this.#cellWidth,
      lineWidth: this.#lineWidth,
      numbersLines: this.#numbersLines,
      sizeField: this.sizeGameField,
    };
  }

  //ничья
  get isDeadHeat() {
    return this.#movesList.length === this.#numberFieldCells;
  }

  get currentPlayer() {
    return this.isMyMove ? this.player1Character : this.player2Character;
  }

  changeStateCell(cell) {
    const currentCell = this.#cellsCoordsList[cell.rowIndex - 1][cell.index];
    currentCell.symbol = this.currentPlayer;
    currentCell.isEmpty = false;
  }

  getCellByCoord(coords) {
    let currentCell = null;
    for (let row of this.coordsCells) {
      const cell = row.find((cell) => {
        const cellCoord = cell.coords;
        const coordsX = cellCoord[0];
        const coordsY = cellCoord[1];
        const startCoordX = coordsX[0];
        const endCoordX = coordsX[1];
        const startCoordY = coordsY[0];
        const endCoordY = coordsY[1];
        return startCoordX < coords.x && endCoordX > coords.x && startCoordY < coords.y && endCoordY > coords.y;
      });
      if (cell) {
        currentCell = cell;
        break;
      }
    }

    return currentCell;
  }

  checkHorizontalLine(startPosition, endPosition, col, winTemplate, direction) {
    let winCellsList = [];
    let prevCell = null;
    let template = ``;

    for (let i = startPosition; i <= endPosition; i++) {
      const cell = col[i];
      const symbol = cell.symbol;

      //TODO подумать как добавлять победные ячейки вынести
      if (symbol != null) {
        if (winCellsList.length === 0 || symbol === prevCell.symbol) {
          winCellsList.push(cell);
        } else {
          winCellsList.length = 0;
        }
      }

      prevCell = cell;
      template = template + (symbol ?? `_`);
    }

    return {
      isWin: template.indexOf(winTemplate) !== -1,
      winCellsList,
      direction,
    };
  }

  checkVerticalLine(startPosition, endPosition, row, winTemplate, direction, colIndex) {
    let winCellsList = [];
    let prevCell = null;
    let template = ``;

    for (let i = startPosition; i <= endPosition; i++) {
      const row = this.coordsCells[i];
      const cell = row[colIndex];
      const symbol = cell.symbol;
      //TODO подумать как добавлять победные ячейки вынести
      if (symbol != null) {
        if (winCellsList.length === 0 || symbol === prevCell.symbol) {
          winCellsList.push(cell);
        } else {
          winCellsList.length = 0;
        }
      }
      prevCell = cell;
      template = template + (symbol ?? `_`);
    }

    return {
      isWin: template.indexOf(winTemplate) !== -1,
      winCellsList,
      direction,
    };
  }
  // \
  //  \
  checkLeftToRightDiagonal(limitCells, winTemplate, direction, coordsCells) {
    let winCellsList = [];
    let prevCell = null;
    let template = ``;
    const { leftLimit, topLimit, rightLimit, bottomLimit } = limitCells;

    for (let i = leftLimit, j = topLimit; i <= rightLimit || j <= bottomLimit; i++, j++) {
      const row = coordsCells[j];
      const cell = row[i];
      const symbol = cell.symbol;
      //TODO подумать как добавлять победные ячейки вынести
      if (symbol != null) {
        if (winCellsList.length === 0 || symbol === prevCell.symbol) {
          winCellsList.push(cell);
        } else {
          winCellsList.length = 0;
        }
      }
      prevCell = cell;
      template = template + (cell.symbol ?? `_`);
    }
    return {
      isWin: template.indexOf(winTemplate) !== -1,
      winCellsList,
      direction,
    };
  }

  checkRightToLeftDiagonal(limitCells, winTemplate, direction, coordsCells) {
    let winCellsList = [];
    let prevCell = null;
    let template = ``;
    const { leftLimit, topLimit, rightLimit, bottomLimit } = limitCells;

    for (let i = leftLimit, j = bottomLimit; i <= rightLimit || j >= topLimit; i++, j--) {
      const row = coordsCells[j];
      const cell = row[i];
      const symbol = cell.symbol;
      //TODO подумать как добавлять победные ячейки вынести
      if (symbol != null) {
        if (winCellsList.length === 0 || symbol === prevCell.symbol) {
          winCellsList.push(cell);
        } else {
          winCellsList.length = 0;
        }
      }
      prevCell = cell;
      template = template + (cell.symbol ?? `_`);
    }

    return {
      isWin: template.indexOf(winTemplate) !== -1,
      winCellsList,
      direction,
    };
  }

  checkWin(currentCell) {
    // let i = startPosition; i <= endPosition; i++
    // let i = startPosition; i <= endPosition; i++
    // let i = leftLimit, j = topLimit; i <= rightLimit || j <= bottomLimit; i++, j++
    // let i = leftLimit, j = bottomLimit; i <= rightLimit || j <= topLimit; i++, j++

    this.#movesList.push(currentCell);

    //TODO оптимизировать

    //может вызывать методы через цикл?

    let result = null;
    const distanceForCheckToWin = this.#sizeTemplateForWin - 1;
    const colIndex = currentCell.colIndex - 1;
    const rowIndex = currentCell.rowIndex - 1;

    const row = this.coordsCells[rowIndex];
    const rowLength = this.coordsCells.length - 1;

    const player = this.currentPlayer;
    const winTemplate = player.repeat(this.#sizeTemplateForWin);

    let distanceToLeftBorder = colIndex - distanceForCheckToWin;
    let distanceToTopBorder = rowIndex - distanceForCheckToWin;
    let distanceToBottomBorder = rowIndex + distanceForCheckToWin;
    let distanceToRightBorder = colIndex + distanceForCheckToWin;

    let leftLimit = distanceToLeftBorder < 0 ? 0 : distanceToLeftBorder;
    let rightLimit = distanceToRightBorder > rowLength ? rowLength : distanceToRightBorder;
    let topLimit = distanceToTopBorder < 0 ? 0 : distanceToTopBorder;
    let bottomLimit = distanceToBottomBorder > rowLength ? rowLength : distanceToBottomBorder;

    // по горизонтали
    result = this.checkHorizontalLine(leftLimit, rightLimit, row, winTemplate, this.winDirections.LEFT_TO_RIGHT);
    if (result.isWin) {
      result.gameStatus = this.#gameStatuses.PLAYER_WIN;
      return result;
    }

    //по вертикали

    result = this.checkVerticalLine(topLimit, bottomLimit, row, winTemplate, this.winDirections.TOP_TO_BOTTOM, colIndex);
    if (result.isWin) {
      result.gameStatus = this.#gameStatuses.PLAYER_WIN;
      return result;
    }

    //по диагонали слева -> направо
    distanceToTopBorder = Math.abs(0 - rowIndex);
    distanceToLeftBorder = Math.abs(0 - colIndex);

    distanceToBottomBorder = Math.abs(rowLength - rowIndex);
    distanceToRightBorder = Math.abs(rowLength - colIndex);

    const leftTopLimit = Math.min(distanceToTopBorder, distanceToLeftBorder, distanceForCheckToWin);
    const rightBottomLimit = Math.min(distanceToBottomBorder, distanceToRightBorder, distanceForCheckToWin);

    topLimit = rowIndex - leftTopLimit;
    bottomLimit = rowIndex + rightBottomLimit;
    leftLimit = colIndex - leftTopLimit;
    rightLimit = colIndex + rightBottomLimit;

    let limitCells = {
      topLimit,
      bottomLimit,
      leftLimit,
      rightLimit,
    };

    result = this.checkLeftToRightDiagonal(limitCells, winTemplate, this.winDirections.LEFT_TOP_TO_RIGHT_BOTTOM, this.coordsCells);
    if (result.isWin) {
      result.gameStatus = this.#gameStatuses.PLAYER_WIN;
      return result;
    }

    const rightTopLimit = Math.min(distanceToTopBorder, distanceToRightBorder, distanceForCheckToWin);
    const leftBottomLimit = Math.min(distanceToBottomBorder, distanceToLeftBorder, distanceForCheckToWin);

    topLimit = rowIndex - rightTopLimit;
    bottomLimit = rowIndex + leftBottomLimit;
    leftLimit = colIndex - leftBottomLimit;
    rightLimit = colIndex + rightTopLimit;

    limitCells = {
      topLimit,
      bottomLimit,
      leftLimit,
      rightLimit,
    };

    result = this.checkRightToLeftDiagonal(limitCells, winTemplate, this.winDirections.RIGHT_TOP_TO_LEFT_BOTTOM, this.coordsCells);

    if (result.isWin) {
      result.gameStatus = this.#gameStatuses.PLAYER_WIN;
      return result;
    }

    //TODO add to const
    if (this.isDeadHeat) {
      return {
        gameStatus: this.#gameStatuses.END,
      };
    }

    return {
      gameStatus: this.#gameStatuses.GAME,
    };
  }
}

export default GameModel;
