import AbstractView from '../abstract-view.js';
import { getImagePlayer } from '../../helpers/helpers.js';

export const gameViewEvents = {
  CLICK_GAME_FIELD: `clickGameField`,
};

class GameView extends AbstractView {
  #gameField = null;
  #playerImages = new Map();

  constructor(fieldSettings) {
    super();
    this.fieldSettings = fieldSettings;
  }

  handleClickCanvas = (e) => {
    e.preventDefault();
    this.emit(gameViewEvents.CLICK_GAME_FIELD, e);
  };

  changeMoveStatus = (statusText) => {
    if (this.moveStatusEl == null) {
      this.moveStatusEl = this.element.querySelector(`.js-move-status`);
    }
    this.moveStatusEl.textContent = statusText;
  };

  bind(element) {
    this.#gameField = element.querySelector(`#gameCanvas`);
    this.#gameField.addEventListener(`click`, this.handleClickCanvas);
  }

  unbind() {
    this.#gameField.removeEventListener(`click`, this.handleClickCanvas);
  }

  get template() {
    return `
            <article class="game-view">
                <h1 class="page-title">Игра</h1>
                <h2 class="game-view__move-status js-move-status"></h2>
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
      let indent = i * lineWidth + lineWidth / 2 + cellWidth * i;
      ctx.moveTo(0, indent);
      ctx.lineTo(width, indent);

      coords.push(indent + lineWidth);

      // вертикальная отрисовка
      indent = i * lineWidth + lineWidth / 2 + cellHeight * i;
      ctx.moveTo(indent, 0);
      ctx.lineTo(indent, height);
    });

    ctx.stroke();
    ctx.closePath();
  }

  async renderImage(name) {
    const playerImage = this.#playerImages.get(name);
    if (!playerImage) {
      const image = await getImagePlayer(name);
      this.#playerImages.set(name, image);
      return image;
    }
    return playerImage;
  }

  async drawImgInCell(
    cell,
    nameImg,
    widthImg,
    heightImg,
    cellWidth,
    cellHeight
  ) {
    const playerImage = await this.renderImage(nameImg);
    const ctx = this.ctx;
    const x = cell.coords[0];
    const y = cell.coords[1];
    let x1 = x[0];
    let y1 = y[0];
    if (widthImg < cellWidth) {
      x1 = x1 + Math.ceil((cellWidth - widthImg) / 2);
    }

    if (heightImg < cellHeight) {
      y1 = y1 + Math.ceil((cellHeight - heightImg) / 2);
    }
    ctx.drawImage(playerImage, x1, y1, widthImg, heightImg);
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
