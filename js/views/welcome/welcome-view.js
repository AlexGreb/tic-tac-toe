import AbstractView from '../abstract-view.js';
import Loader from '../common/loader.js';
import Modal from 'modal-vanilla';
import '../../../scss/modal.scss';

export const welcomeViewEvents = {
    START_GAME: `startGame`,
    FIND_GAME: `findGame`,
    CREATE_GAME: `createGame`
};

class WelcomeView extends AbstractView {
    #btnStart = null;
    #findGameBtn = null;
    #createGameBtn = null;

    constructor() {
        super();
    }

    showFindGameModal = () => {
        this.loader = new Loader(`Ищем игру...`);
        const modalContent = this.loader.element;
        this.findGameModal = new Modal({
            content: modalContent,
            footer: false,
            header: false,
            backdrop: `static`
        });
        this.findGameModal.show();
    };

    hideFindGameModal = () => {
        this.findGameModal.hide();
    }

    handleClickStartBtn = (e) => {
        e.preventDefault();
        this.emit(welcomeViewEvents.START_GAME);
    }

    handleClickFindGameBtn = (e) => {
        e.preventDefault();
        this.emit(welcomeViewEvents.FIND_GAME);
    }

    handleClickCreateGameBtn = (e) => {
        e.preventDefault();
        this.emit(welcomeViewEvents.CREATE_GAME);
    }

    bind(element) {
        this.#btnStart = element.querySelector(`.btn-start`);
        this.#btnStart.addEventListener(`click`, this.handleClickStartBtn);
        this.#findGameBtn = element.querySelector(`.welcome-screen__find-game-btn`);
        this.#findGameBtn.addEventListener(`click`, this.handleClickFindGameBtn);
        this.#createGameBtn = element.querySelector(`.welcome-screen__create-game-btn`);
        this.#createGameBtn.addEventListener(`click`, this.handleClickCreateGameBtn);
    }

    unbind() {
        this.#btnStart.removeEventListener(`click`, this.handleClickStartBtn);
        this.#findGameBtn.removeEventListener(`click`, this.handleClickFindGameBtn);
        this.#createGameBtn.removeEventListener(`click`, this.handleClickCreateGameBtn);
    }

    get template() {
        return (
            `<article class="welcome-screen">
                <h1 class="welcome-screen__title">
                    Крестики <span>X</span> Н<span>0</span>лики
                </h1>
                <div>
                    <button class="welcome-screen__btn btn-start btn btn--action"
                        type="button">
                        Играть
                    </button>
                </div>
                <div>
                    <h2 class="settings-field__title">Игра по сети</h2>
                    <div>
                        <button class="welcome-screen__find-game-btn btn btn--action"
                            type="button">
                            Найти игру
                        </button>
                    </div>
                    <div>
                        <button class="welcome-screen__create-game-btn btn btn--action"
                            type="button">
                            Создать игру
                        </button>
                    </div>
                </div>
            </article>`
        );
    }
}

export default WelcomeView;