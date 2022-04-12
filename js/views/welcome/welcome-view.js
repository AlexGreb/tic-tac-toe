import AbstractView from '../abstract-view.js';

class WelcomeView extends AbstractView {
    #btnStart = null;

    constructor() {
        super(); 
        this.handleClickStartBtn = this.handleClickStartBtn.bind(this);
    }

    onBtnStart(){};

    handleClickStartBtn(e) {
        e.preventDefault();
        this.onBtnStart();
    }

    bind() {
        this.#btnStart = this._element.querySelector(`.btn-start`);
        this.#btnStart.addEventListener(`click`, this.handleClickStartBtn);
    }

    unbind() {
        this.#btnStart.removeEventListener(`click`, this.handleClickStartBtn);
    }

    get template() {
        return (
            `<article class="welcome-screen">
                <h1 class="welcome-screen__title">
                    Крестики <span>X</span> Н<span>0</span>лики
                </h1>
                <button class="welcome-screen__btn btn-start btn btn--action"
                    type="button">
                    Начать игру
                </button>
            </article>`
        );
    }
}

export default WelcomeView;