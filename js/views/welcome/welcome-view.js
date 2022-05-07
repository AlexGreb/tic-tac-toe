import AbstractView from '../abstract-view.js';

class WelcomeView extends AbstractView {
    #btnStart = null;
    #findGameBtn = null;

    constructor() {
        super(); 
        this.handleClickStartBtn = this.handleClickStartBtn.bind(this);
        this.handleClickFindGameBtn = this.handleClickFindGameBtn.bind(this);
    }

    handleClickStartBtn(e) {
        e.preventDefault();
        this.onBtnStart();
    }

    handleClickFindGameBtn(e) {
        e.preventDefault();
        this.onFindGame();
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
            `<article class="welcome-screen">
                <h1 class="welcome-screen__title">
                    Крестики <span>X</span> Н<span>0</span>лики
                </h1>
                <div>
                    <button class="welcome-screen__find-game-btn btn btn--action"
                        type="button">
                        Найти игру
                    </button>
                </div>
                <div>
                    <button class="welcome-screen__btn btn-start btn btn--action"
                        type="button">
                        Начать игру
                    </button>
                </div>
            </article>`
        );
    }
}

export default WelcomeView;