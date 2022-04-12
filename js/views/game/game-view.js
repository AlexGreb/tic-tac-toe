import AbstractView from '../abstract-view.js';
import CanvasView from '../common/canvas-view.js'

class GameView extends AbstractView {

    constructor(gameModel) {
        super();
        this.gameModel = gameModel;
        this.handleClickCanvas = this.handleClickCanvas.bind(this);
        this.canvas = new CanvasView(this.gameModel.gameSettings, `game__field`);
        this.canvasElement = this.canvas.element;
    }

    handleClickCanvas(e) {
        e.preventDefault();
        this.onClickCanvas(e);
    }

    onClickCanvas(e) {
        console.log(e.clientX, e.clientY);
        const coords = {
            x: e.offsetX,
            y: e.offsetY
        }
        this.canvas.findCellForCoord(coords);
    }

    bind() {
        this.canvasElement.addEventListener(`click`, this.handleClickCanvas);
    }

    unbind() {
        this.canvasElement.removeEventListener(`click`, this.handleClickCanvas);
    }

    postRender() {
        const gameBlock = this._element.querySelector(`.game`);
        // gameBlock.appendChild(this.canvasElement);
    }

    get template() {
        return `
            <article class="game">
                <h1 class="game__title">Игра</h1>
                ${this.canvasElement}
            </article>
        `;
    }
}

export default GameView;