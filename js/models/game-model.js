import {charactersType} from '../data/settings.js';

class GameModel {
    #numbersLines = null;
    #numberCellsInRow = null;
    #cellsCoordsList = null;
    #sizeGameField = null;
    #playerImage = null;
    #AIImage = null;
    #cellWidth = 50;
    #cellHeight = 50;
    #lineWidth = 2;
    #isMovePlayer = null;

    constructor(settings) {
        this.#numbersLines = settings.numbersLines;
        this.#numberCellsInRow = settings.numberCellsInRow;
        this.playerIconTemplate = settings.player1IconTemplate;
        this.playerName = settings.playerName;
        this.AIIconTemplate = settings.player2IconTemplate;
        this.#isMovePlayer = settings.player1Character === charactersType.X;
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

    get turnPlayer() {
        return this.#isMovePlayer;
    }

    changePlayer() {
        this.#isMovePlayer = !this.#isMovePlayer;
    }

    get player1Image() {
        if(this.#playerImage) {
            return Promise.resolve(this.#playerImage);
        }
        return this.getImageFromSVGString(this.playerIconTemplate).then((img) => {
            return this.#playerImage  = img;
        }).catch((error) => {
            throw new Error(error);
        });
    }

    get player2Image() {
        if(this.#AIImage) {
            return Promise.resolve(this.#AIImage);
        }
        return this.getImageFromSVGString(this.AIIconTemplate).then((img) => {
            return this.#AIImage = img;
        }).catch((error) => {
            throw new Error(error);
        });
    }

    get coordsCells() {
        if(this.#cellsCoordsList) {
            return this.#cellsCoordsList;
        }

        const cellsList = new Array(this.#numberCellsInRow ** 2).fill(null);

        const startCoords = {
            startX: 0, 
            startY: 0, 
            cellsCoordsList: []
        };

        const {cellsCoordsList} = cellsList.reduce((startCoords, cell, i) => {
            const row = this.#numberCellsInRow;
            let {
                startX,
                startY,
                cellsCoordsList
            } = startCoords;

            startX = startX + this.#lineWidth;
            const endX = startX + this.#cellWidth;
            const coordX = [startX, endX];

            startY = startY + this.#lineWidth;
            const endY = startY + this.#cellHeight;
            const coordY = [startY, endY];

            cellsCoordsList.push({
                    index: i,
                    isEmpty: true,
                    coords: [coordX, coordY]
                });
            return {
                startX: (i + 1) % row ? endX : 0,
                startY: (i + 1) % row ? startY - this.#lineWidth : endY,
                cellsCoordsList
            };
        }, startCoords);

        return cellsCoordsList;
    }

    get sizeGameField() {
        if(this.#sizeGameField) {
            return this.#sizeGameField;
        }

        return {
            width: (this.#cellWidth * this.#numberCellsInRow ) + (this.#lineWidth * this.#numbersLines),
            height: (this.#cellHeight * this.#numberCellsInRow ) + (this.#lineWidth * this.#numbersLines)
        }

    }

    get gameFieldSettings() {
        return {
            cellHeight: this.#cellHeight,
            cellWidth: this.#cellWidth,
            lineWidth: this.#lineWidth,
            numbersLines: this.#numbersLines,
            sizeField: this.sizeGameField
        };
    }

    changeStateCell(cell) {
        this.#cellsCoordsList[cell.index].isEmpty = false;
    }

    getCellbyCoord(coords) {
        return this.coordsCells.find((cell, index) => {
            const cellCoord = cell.coords;
            const x = cellCoord[0];
            const y = cellCoord[1];
            const x1 = x[0];
            const x2 = x[1];
            const y1 = y[0];
            const y2 = y[1];
            return x1 < coords.x && x2 > coords.x && y1 < coords.y && y2 > coords.y;
        });
    }

    getImageFromSVGString(svgString) { //вынести?
        return new Promise((resolve, reject) => {
            const img = new Image();
            const blob = new Blob([svgString],{type:'image/svg+xml'});
            const blobURL = URL.createObjectURL(blob);
            img.src = blobURL;
            img.onload = () => {
                resolve(img)
            }
        })

    }

    findCellForCoord (coords) {
        return this.cellsCoordsList.find((cell) => {
            const cellCoord = cell.coords;
            const x = cellCoord[0];
            const y = cellCoord[1];
            const x1 = x[0];
            const x2 = x[1];
            const y1 = y[0];
            const y2 = y[1];
            return x1 < coords.x && x2 > coords.x && y1 < coords.y && y2 > coords.y;
        });

    }

}

export default GameModel;