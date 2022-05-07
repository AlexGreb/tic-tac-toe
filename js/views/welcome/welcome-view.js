import AbstractView from '../abstract-view.js';

class WelcomeView extends AbstractView {
    #btnStart = null;
    #findGameBtn = null;

    constructor() {
        super(); 
        this.handleClickStartBtn = this.handleClickStartBtn.bind(this);
        this.handleClickFindGameBtn = this.handleClickFindGameBtn.bind(this);
        this.handleClickCreateOfferBtn = this.handleClickCreateOfferBtn.bind(this);
        this.handleClickAcceptAnswerBtn = this.handleClickAcceptAnswerBtn.bind(this);
        this.handleClickCreateAnswerBtn = this.handleClickCreateAnswerBtn.bind(this);
        this.handleClickSentDataBtn = this.handleClickSentDataBtn.bind(this);
        this.handleClickAcceptOfferBtn = this.handleClickAcceptOfferBtn.bind(this);
    }

    onBtnStart(){};
    onFindGame(){};
    onCreateOffer(){};
    onAcceptOffer(){};
    onCreateAnswer(){};
    onSentData(){};

    handleClickStartBtn(e) {
        e.preventDefault();
        this.onBtnStart();
    }

    handleClickFindGameBtn(e) {
        e.preventDefault();
        this.onFindGame();
    }

    handleClickCreateOfferBtn(e) {
        e.preventDefault();
        this.onCreateOffer();
    }

    handleClickAcceptAnswerBtn(e) {
        e.preventDefault();
        const answer = this._element.querySelector(`#answerText`).value;
        this.onAcceptOffer(answer);
    }

    handleClickCreateAnswerBtn(e) {
        e.preventDefault();
        this.onCreateAnswer();
    }

    handleClickSentDataBtn(e) {
        e.preventDefault();
        const data = this._element.querySelector(`#sentDataTxt`).value;
        this.onSentData(data);
    }

    handleClickAcceptOfferBtn(e) {
        e.preventDefault();
        const offer = this._element.querySelector(`#acceptOfferTxt`).value;
        this.onAcceptOffer(offer);
    }

    showOffer(offer) {
        const div = document.createElement(`div`);
        div.innerHTML = offer;
        div.style.color = `#fff`;
        document.body.appendChild(div);
    }

    showAnswer(answer) {
        const div = document.createElement(`div`);
        div.innerHTML = answer;
        div.style.color = `#fff`;
        document.body.appendChild(answer);
    }


    bind(element) {
        this.#btnStart = element.querySelector(`.btn-start`);
        this.#btnStart.addEventListener(`click`, this.handleClickStartBtn);

        this.#findGameBtn = element.querySelector(`.welcome-screen__find-game-btn`);
        this.#findGameBtn.addEventListener(`click`, this.handleClickFindGameBtn);

        element.querySelector(`#createOffer`).addEventListener(`click`, this.handleClickCreateOfferBtn);
        element.querySelector(`#acceptOfferBtn`).addEventListener(`click`, this.handleClickAcceptOfferBtn);

        element.querySelector(`#createAnswerBtn`).addEventListener(`click`, this.handleClickCreateAnswerBtn);
        element.querySelector(`#sentDataBtn`).addEventListener(`click`, this.handleClickSentDataBtn);

        element.querySelector(`#acceptAnswer`).addEventListener(`click`, this.handleClickAcceptAnswerBtn)
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
                    <button id="createOffer" type="button">Создать offer</button>
                    <input id="answerText" type="text"/>
                    <button type="button" id="acceptAnswer">Принять ответ</button>
                </div>
                <div>
                    <button id="createAnswerBtn" type="button">Создать ответ</button>
                    <input id="acceptOfferTxt" type="text"/>
                    <button type="button" id="acceptOfferBtn">Принять offer</button>
                </div>
                <div>
                


                <div>
                    <input id="sentDataTxt" type="text">
                    <button id="sentDataBtn" type="button">отправить сообщение</button>
                </div>


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