import AbstractView from '../abstract-view.js';

export const gameViewEvents = {
    CLICK_GAME_FIELD: `clickGameField`,
};

class GameView extends AbstractView {

    #gameField = null;

    constructor(fieldSettings) {
        super();
        this.fieldSettings = fieldSettings;;
    }

    handleClickCanvas = (e) => {
        e.preventDefault();
        this.emit(gameViewEvents.CLICK_GAME_FIELD, e);
    }

    bind(element) {
        this.#gameField = element.querySelector(`#gameCanvas`);
        this.#gameField.addEventListener(`click`, this.handleClickCanvas);
    }

    unbind() {
        this.#gameField.removeEventListener(`click`, this.handleClickCanvas);
    }

    get template() {
        return `
            <article class="game">
                <h1 class="game__title">Игра</h1>
                <canvas id="gameCanvas"></canvas>
            </article>
        `;
    }

    drawGameField() {
        const ctx = this.ctx;
        const cellHeight = this.fieldSettings.cellHeight;
        const cellWidth = this.fieldSettings.cellWidth;
        const lineWidth = this.fieldSettings.lineWidth;
        const width = this.fieldSettings.sizeField.width;
        const height = this.fieldSettings.sizeField.height;
        const numbersLines = this.fieldSettings.numbersLines;

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


    drawImgInCell(cell, img, widthImg, heightImg, cellWidth, cellHeight) {
        const ctx = this.ctx;
        const x = cell.coords[0];
        const y = cell.coords[1];
        let x1 = x[0];
        let y1 = y[0];
        if(widthImg < cellWidth) {
            x1 = x1 + Math.ceil((cellWidth - widthImg) / 2);
        }

        if(heightImg < cellHeight) {
            y1 = y1 + Math.ceil((cellHeight - heightImg) / 2);
        }
        ctx.drawImage(img, x1, y1, widthImg, heightImg);
    }


    postRender() {
        this.#gameField.setAttribute(`width`, this.fieldSettings.sizeField.width);
        this.#gameField.setAttribute(`height`, this.fieldSettings.sizeField.height);
        this.ctx = this.#gameField.getContext(`2d`);
        this.ctx.lineWidth = this.fieldSettings.lineWidth;
        this.drawGameField();
    }
}

export default GameView;