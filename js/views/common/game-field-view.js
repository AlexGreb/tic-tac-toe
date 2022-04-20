import AbstractView from '../abstract-view.js';
import {iconX, iconO} from '../../data/settings.js';

class CanvasView extends AbstractView {
    cellsCoordsList = [];

    constructor(gameSettings, className) {
        super();
        this.className = className;

        this.canvasSettings = gameSettings;
        this.numberCellsInRow = Number(this.canvasSettings.fieldSize);
        this.lineWidth = 2;
        this.cellHeight = 35;
        this.cellWidth = 35;
        this.numberCells = this.numberCellsInRow * this.numberCellsInRow;

        this.numbersLines = this.numberCellsInRow + 1;
        this.width = this.getSizeGameField(this.cellWidth, this.lineWidth, this.numberCellsInRow, this.numbersLines);
        this.height = this.width;

        this.player = true;
    }

    get template() {
        return `
            <canvas id="gameCanvas"></canvas>
        `;
    }

    drawGameField() {
        const ctx = this.ctx;
        const cellHeight = this.cellHeight;
        const cellWidth = this.cellWidth;
        const lineWidth = this.lineWidth;
        const width = this.width;
        const height = this.height;
        const numbersLines = this.numbersLines;

        ctx.beginPath();
        ctx.strokeStyle = 'blue';

        const cellsList = new Array(numbersLines).fill(null);

        cellsList.forEach((curr, i) => {
            //canvas отрисовывает влево и вправо от заданной точки поэтому рисуем не с нуля
            const coords = [];

            // горизонтальная отрисовка
            let indent = (i * lineWidth) + (lineWidth / 2) + (cellWidth * i);
            ctx.moveTo(0, indent) ;
            ctx.lineTo(width, indent);

            coords.push(indent + lineWidth);

            // вертикальная отрисовка
            indent = (i * lineWidth) + (lineWidth / 2) + (cellHeight * i);
            ctx.moveTo(indent, 0);
            ctx.lineTo(indent, height);

        });

        ctx.stroke();
        ctx.closePath();
    }

    get getCoordsCells() {//в презентер
        const numberCellsInRow = this.numberCellsInRow;
        const cellWidth = this.cellWidth;
        const cellHeight = this.cellHeight;
        const lineWidth = this.lineWidth;

        const cellsList = new Array(numberCellsInRow * numberCellsInRow).fill(null);

        const startCoords = {
            startX: 0, 
            startY: 0, 
            cellsCoordsList: []
        };

        const {cellsCoordsList} = cellsList.reduce((startCoords, cell, i, cellsList) => {
            const row = numberCellsInRow;
            let {
                startX,
                startY,
                cellsCoordsList
            } = startCoords;

            startX = startX + lineWidth;
            const endX = startX + cellWidth;
            const coordX = [startX, endX];

            startY = startY + lineWidth;
            const endY = startY + cellHeight;
            const coordY = [startY, endY];

            cellsCoordsList.push({
                    index: i,
                    isEmpty: true,
                    coords: [coordX, coordY]
                });
            return {
                startX: (i + 1) % row ? endX : 0,
                startY: (i + 1) % row ? startY - lineWidth : endY,
                cellsCoordsList
            };
        }, startCoords);
        return cellsCoordsList;
    }

    drawImginCell(cell, img, widthImg, heightImg) {
        if(!cell.isEmpty) return
        const ctx = this.ctx;
        const x = cell.coords[0];
        const y = cell.coords[1];
        let x1 = x[0];
        let y1 = y[0];
        if(widthImg < this.cellWidth) {
            x1 = x1 + Math.ceil((this.cellWidth - widthImg) / 2);
        }

        if(heightImg < this.cellHeight) {
            y1 = y1 + Math.ceil((this.cellHeight - heightImg) / 2);
        }
        
        ctx.drawImage(img, x1, y1, widthImg, heightImg);

    }

    findCellForCoord (coords) {//в презентер
        const cell = this.cellsCoordsList.find((cell) => {
            const cellCoord = cell.coords;
            const x = cellCoord[0];
            const y = cellCoord[1];
            const x1 = x[0];
            const x2 = x[1];
            const y1 = y[0];
            const y2 = y[1];
            return x1 < coords.x && x2 > coords.x && y1 < coords.y && y2 > coords.y;
        });
        if(cell){
            this.drawImginCell(cell, this.player ? this.imgX : this.imgO, 25, 25);
            this.player = !this.player;
        }

        return cell;
    }

    postRender() {
        this._canvas = this._element.querySelector(`#gameCanvas`);
        this._canvas.setAttribute(`width`, this.width);
        this._canvas.setAttribute(`height`, this.height);
        
        this.ctx = this._canvas.getContext(`2d`);
        const ctx = this.ctx;

        ctx.lineWidth = this.lineWidth;
        this.drawGameField();

        //images
        const blobX = new Blob([iconX.icon],{type:'image/svg+xml'});
        const blobO = new Blob([iconO.icon],{type:'image/svg+xml'});
        const blobXURL = URL.createObjectURL(blobX);
        const blobOURL = URL.createObjectURL(blobO);
        const imgX = new Image();
        const imgO = new Image();
        
        imgX.src = blobXURL;
        imgO.src = blobOURL;

        this.cellsCoordsList = this.getCoordsCells;

        imgX.onload = () => {
            this.imgX = imgX;
        }

        imgO.onload = () => {
            this.imgO = imgO;
        }
    }
}

export default CanvasView;