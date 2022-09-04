import AbstractView from '../abstract-view.js';
import { colorLineGrid } from '../../data/settings.js';
import { getImagePlayer } from '../../helpers/settings/settings-helper.js';

export const gameViewEvents = {
  CLICK_GAME_FIELD: `clickGameField`,
  CLICK_RETRY: `retry`,
  CLICK_TO_MAIN: `clickToMain`,
};

class GameView extends AbstractView {
  #gameField = null;
  #retryBtn = null;
  #playerImages = new Map();
  #ctx = null;
  #backToMainBtn = null;

  constructor(fieldSettings) {
    super();
    this.cellHeight = fieldSettings.cellHeight;
    this.cellWidth = fieldSettings.cellWidth;
    this.lineWidth = fieldSettings.lineWidth;
    this.widthField = fieldSettings.sizeField.width;
    this.heightField = fieldSettings.sizeField.height;
    this.numbersLines = fieldSettings.numbersLines;
  }

  handleClickCanvas = (e) => {
    e.preventDefault();
    this.emit(gameViewEvents.CLICK_GAME_FIELD, e);
  };

  handleRetry = (e) => {
    e.preventDefault();
    this.emit(gameViewEvents.CLICK_RETRY, e);
  };

  handleBackToMain = (e) => {
    e.preventDefault();
    this.emit(gameViewEvents.CLICK_TO_MAIN, e);
  };

  changeMoveStatusText = (statusText) => {
    if (this.moveStatusEl == null) {
      this.moveStatusEl = this.element.querySelector(`.js-move-status`);
    }
    this.moveStatusEl.textContent = statusText;
  };

  bind(element) {
    this.#gameField = element.querySelector(`#gameCanvas`);
    this.#retryBtn = element.querySelector(`.js-retry-btn`);
    this.#backToMainBtn = element.querySelector(`.js-back-to-main-btn`);
    this.#gameField.addEventListener(`click`, this.handleClickCanvas);
    this.#retryBtn.addEventListener(`click`, this.handleRetry);
    this.#backToMainBtn.addEventListener(`click`, this.handleBackToMain);
  }

  unbind() {
    this.#gameField.removeEventListener(`click`, this.handleClickCanvas);
    this.#retryBtn.removeEventListener(`click`, this.handleRetry);
    this.#backToMainBtn.removeEventListener(`click`, this.handleBackToMain);
  }

  get template() {
    return `
            <article class="game-view">
                <h1 class="page-title">Игра</h1>
                <div class="game-view__back-to-main">
                    <button class="game-view__back-to-main-btn js-back-to-main-btn btn-back" type="button">Выйти на главную</button>
                </div>
                <button type="button" class="btn game-view__retry-btn js-retry-btn" hidden>Заново</button>
                <h2 class="game-view__move-status js-move-status"></h2>
                <canvas id="gameCanvas"></canvas>
            </article>
        `;
  }

  drawGameField() {
    const ctx = this.#ctx;

    ctx.beginPath();
    ctx.strokeStyle = colorLineGrid;

    const cellsList = new Array(this.numbersLines).fill(null);

    cellsList.forEach((curr, i) => {
      //canvas отрисовывает влево и вправо от заданной точки поэтому рисуем не с нуля

      // горизонтальная отрисовка
      let indent = i * this.lineWidth + this.lineWidth / 2 + this.cellWidth * i;
      ctx.moveTo(0, indent);
      ctx.lineTo(this.widthField, indent);

      // вертикальная отрисовка
      indent = i * this.lineWidth + this.lineWidth / 2 + this.cellHeight * i;
      ctx.moveTo(indent, 0);
      ctx.lineTo(indent, this.heightField);
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

  async drawImgInCell(cell, nameImg, widthImg, heightImg) {
    const playerImage = await this.renderImage(nameImg);
    const ctx = this.#ctx;
    const x = cell.coords[0];
    const y = cell.coords[1];
    let x1 = x[0];
    let y1 = y[0];
    if (widthImg < this.cellWidth) {
      x1 = x1 + Math.ceil((this.cellWidth - widthImg) / 2);
    }

    if (heightImg < this.cellHeight) {
      y1 = y1 + Math.ceil((this.cellHeight - heightImg) / 2);
    }
    ctx.drawImage(playerImage, x1, y1, widthImg, heightImg);
  }

  renderWinLine(coordsWinLine) {
    const ctx = this.#ctx;
    ctx.lineWidth = 4;
    const { startX1Coords, startX2Coords, endY1Coords, endY2Coords } = coordsWinLine;

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(197, 197 , 3, .8)';
    ctx.moveTo(startX1Coords, endY1Coords);
    ctx.lineTo(startX2Coords, endY2Coords);
    ctx.stroke();
    ctx.closePath();
  }

  showRetryBtn() {
    this.#retryBtn.removeAttribute(`hidden`);
  }

  postRender() {
    this.#gameField.setAttribute(`width`, this.widthField);
    this.#gameField.setAttribute(`height`, this.heightField);
    this.#ctx = this.#gameField.getContext(`2d`);
    this.#ctx.lineWidth = this.lineWidth;
    this.drawGameField();
  }
}

export default GameView;
