class GameModel {
  #numbersLines = null;
  #numberCellsInRow = null;
  #cellsCoordsList = null;
  #sizeGameField = null;
  #cellWidth = 50;
  #cellHeight = 50;
  #lineWidth = 2;
  #isMovePlayer = null;
  #movesList = [];

  constructor(settings) {
    this.#numbersLines = settings.numbersLines;
    this.#numberCellsInRow = settings.numberCellsInRow;
    this.player1Character = settings.player1Character;
    this.player2Character = settings.player2Character;
    this.#isMovePlayer = settings.isMovePlayer;
    this.#cellsCoordsList = this.coordsCells;
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

  get isMovePlayer() {
    return this.#isMovePlayer;
  }

  changePlayer() {
    this.#isMovePlayer = !this.#isMovePlayer;
  }

  get gameStatus() {
    return this.#isMovePlayer ? `Ваш ход` : `Ход соперника`;
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
      //TODO оптимизировать какая то каша сейчас
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
      width:
        this.#cellWidth * this.#numberCellsInRow +
        this.#lineWidth * this.#numbersLines,
      height:
        this.#cellHeight * this.#numberCellsInRow +
        this.#lineWidth * this.#numbersLines,
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

  changeStateCell(cell) {
    //TODO привести индексы к одному виду
    //TODO get current player
    const currentCell = this.#cellsCoordsList[cell.rowIndex - 1][cell.index];
    currentCell.symbol = this.isMovePlayer
      ? this.player1Character
      : this.player2Character;
    currentCell.isEmpty = false;
    this.#movesList.push(currentCell);
  }

  getCellByCoord(coords) {
    //TODO оптимизировать
    let currentCell = null;
    for (let row of this.coordsCells) {
      const cell = row.find((cell) => {
        const cellCoord = cell.coords;
        const x = cellCoord[0];
        const y = cellCoord[1];
        const x1 = x[0];
        const x2 = x[1];
        const y1 = y[0];
        const y2 = y[1];
        return x1 < coords.x && x2 > coords.x && y1 < coords.y && y2 > coords.y;
      });
      if (cell) {
        currentCell = cell;
        break;
      }
    }

    return currentCell;
  }

  checkWin(currentCell) {
    //TODO оптимизировать

    let isWin = false;
    // -1 так как массив с 0
    const colIndex = currentCell.colIndex - 1;
    const rowIndex = currentCell.rowIndex - 1;

    const row = this.coordsCells[rowIndex];
    const rowLength = this.coordsCells.length - 1;
    let template = ``;
    //TODO get current player
    const player = this.isMovePlayer
      ? this.player1Character
      : this.player2Character;
    const winTemplate = player.repeat(3);

    let leftLimit = colIndex - 2 <= 0 ? 0 : colIndex - 2;
    let topLimit = rowIndex - 2 <= 1 ? 0 : rowIndex - 2;
    let rightLimit = colIndex + 2 >= rowLength ? rowLength : colIndex + 2;
    let bottomLimit = rowIndex + 2 >= rowLength + 1 ? rowLength : rowIndex + 2;

    // по горизонтали
    // while ?
    for (let i = leftLimit; i <= rightLimit; i++) {
      const cell = row[i];
      template = template + (cell.symbol ?? `_`);
    }
    console.log(template);
    isWin = template.indexOf(winTemplate) !== -1;
    if (isWin) {
      return true;
    }
    template = ``;

    //по вертикали

    for (let i = topLimit; i <= bottomLimit; i++) {
      const row = this.coordsCells[i];
      const cell = row[colIndex];
      template = template + (cell.symbol ?? `_`);
    }
    isWin = template.indexOf(winTemplate) !== -1;
    if (isWin) {
      return true;
    }
    template = ``;

    //по диагонали слева -> направо
    const distanceToTopBorder = Math.abs(0 - rowIndex);
    const distanceToLeftBorder = Math.abs(0 - colIndex);

    const distanceToBottomBorder = Math.abs(rowLength - rowIndex);
    const disatanceToRightBorder = Math.abs(rowLength - colIndex);

    //TODO 2 заменить на число выгрышной комбинации
    const leftTopLimit = Math.min(distanceToTopBorder, distanceToLeftBorder, 2);
    const rightTopLimit = Math.min(
      distanceToTopBorder,
      disatanceToRightBorder,
      2
    );
    const rightBottomLimit = Math.min(
      distanceToBottomBorder,
      disatanceToRightBorder,
      2
    );
    const leftBottomLimit = Math.min(
      distanceToBottomBorder,
      distanceToLeftBorder,
      2
    );

    topLimit = rowIndex - leftTopLimit;
    bottomLimit = rowIndex + rightBottomLimit;
    leftLimit = colIndex - leftTopLimit;
    rightLimit = colIndex + rightBottomLimit;
    // \
    //  \
    for (
      let i = leftLimit, j = topLimit;
      i <= rightLimit || j <= bottomLimit;
      i++, j++
    ) {
      const row = this.coordsCells[j];
      const cell = row[i];
      template = template + (cell.symbol ?? `_`);
    }
    isWin = template.indexOf(winTemplate) !== -1;
    if (isWin) {
      return true;
    }

    template = ``;
    //  /
    // /

    topLimit = rowIndex - rightTopLimit;
    bottomLimit = rowIndex + leftBottomLimit;
    leftLimit = colIndex - leftBottomLimit;
    rightLimit = colIndex + rightTopLimit;

    for (
      let i = leftLimit, j = bottomLimit;
      i <= rightLimit || j >= topLimit;
      i++, j--
    ) {
      const row = this.coordsCells[j];
      const cell = row[i];
      template = template + (cell.symbol ?? `_`);
    }
    isWin = template.indexOf(winTemplate) !== -1;
    if (isWin) {
      return true;
    }

    return isWin;
  }
}

export default GameModel;
