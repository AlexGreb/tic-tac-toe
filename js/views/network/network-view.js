import AbstractView from '../abstract-view.js';

export const networkViewEvents = {
    CREATE_GAME: `createGame`,
    FIND_GAME: `findGame`
};

class NetworkView extends AbstractView {

    constructor() {
        super();
    }

    handleClickStartBtn(e) {
        e.preventDefault();
        this.emit(WelcomeView._events.START_GAME);
    }

    handleClickFindGameBtn(e) {
        e.preventDefault();
        this.emit(WelcomeView._events.FIND_GAME);
    }

    bind(element) {
        this.#btnStart = element.querySelector(`.btn-start`);
        this.#btnStart.addEventListener(`click`, this.handleClickStartBtn);
        this.#findGameBtn = element.querySelector(`.welcome-screen__find-game-btn`);
        this.#findGameBtn.addEventListener(`click`, this.handleClickFindGameBtn);
    }

    unbind() {
        this.#btnStart.removeEventListener(`click`, this.handleClickStartBtn);
        this.#findGameBtn.removeEventListener(`click`, this.handleClickFindGameBtn);
    }

    get template() {
        return (
            `<article class="network-screen">
                <h1 class="network-screen__title">
                    Крестики <span>X</span> Н<span>0</span>лики
                </h1>
                <div>
                    <button class="js-create-game-btn btn btn--action" type="button">
                        Создать игру
                    </button>
                </div>
                <div>
                    <button class="js-find-game-btn btn-start btn btn--action" type="button">
                        Найти игру
                    </button>
                </div>
            </article>`
        );
    }
}

export default NetworkView;