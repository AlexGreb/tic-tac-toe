import AbstractView from '../abstract-view.js';
import { getModalSearchingGame } from '../../modals/modal-searching-game.js';

export const welcomeViewEvents = {
  START_GAME: `startGame`,
  FIND_GAME: `findGame`,
  CREATE_GAME: `createGame`,
};

class WelcomeView extends AbstractView {
  #btnStart = null;
  #findGameBtn = null;
  #createGameBtn = null;

  constructor() {
    super();
  }

  showFindGameModal = (onCancelCallback) => {
    this.findGameModal = getModalSearchingGame(`Ищем игру...`, onCancelCallback);
    this.findGameModal.show();
  };

  hideFindGameModal = () => {
    this.findGameModal.hide();
  };

  handleClickStartBtn = (e) => {
    e.preventDefault();
    this.emit(welcomeViewEvents.START_GAME);
  };

  handleClickFindGameBtn = (e) => {
    e.preventDefault();
    this.emit(welcomeViewEvents.FIND_GAME);
  };

  handleClickCreateGameBtn = (e) => {
    e.preventDefault();
    this.emit(welcomeViewEvents.CREATE_GAME);
  };

  bind(element) {
    this.#btnStart = element.querySelector(`.js-btn-start`);
    this.#btnStart.addEventListener(`click`, this.handleClickStartBtn);
    this.#findGameBtn = element.querySelector(`.js-find-game-btn`);
    this.#findGameBtn.addEventListener(`click`, this.handleClickFindGameBtn);
    this.#createGameBtn = element.querySelector(`.js-reate-game-btn`);
    this.#createGameBtn.addEventListener(`click`, this.handleClickCreateGameBtn);
  }

  unbind() {
    this.#btnStart.removeEventListener(`click`, this.handleClickStartBtn);
    this.#findGameBtn.removeEventListener(`click`, this.handleClickFindGameBtn);
    this.#createGameBtn.removeEventListener(`click`, this.handleClickCreateGameBtn);
  }

  get template() {
    return `<article class="welcome-view">
                <h1 class="welcome-view__title page-title">
                    Крестики <span>X</span> Н<span>0</span>лики
                </h1>
                <div class="welcome-view__btn-play-wrap">
                    <button class="btn js-btn-start"
                        type="button">
                        Играть
                    </button>
                </div>
                <section class="welcome-view__game-modes">
                    <h2 class="subtitle">Игра по сети</h2>
                    <div class="welcome-view__game-modes-btns-wrap">
                        <button class="js-find-game-btn btn"
                            type="button">
                            Найти игру
                        </button>
                        <button class="js-reate-game-btn btn btn--action"
                            type="button">
                            Создать игру
                        </button>
                    </div>
                </section>
            </article>`;
  }
}

export default WelcomeView;
