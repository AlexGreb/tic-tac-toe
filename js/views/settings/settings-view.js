import AbstractView from '../abstract-view.js';
import getCharactersListTemplate from '../../templates/characters-list.js';
import {getModalSearchingGame} from '../../modals/modal-searching-game.js';
import {gameMode} from '../../data/settings.js';


export const settingsViewEvents = {
    SAVE_SETTINGS: `saveSettings`,
    BACK: `back`
}


class SettingsView extends AbstractView {
    #form = null;
    #backBtn = null;

    constructor(settings) {
        super();

        this.settings = settings;
        this.onSaveSettings = this.onSaveSettings.bind(this);
    }

    showCreateGameModal = (onCancelCallback) => {
        this.createGameModal = getModalSearchingGame(`Ищем игру...`, onCancelCallback);
        this.createGameModal.show();
    };

    hideCreateGameModal = () => {
        this.createGameModal.hide();
    }

    onSaveSettings(e) {
        e.preventDefault();
        const mode = e.submitter.classList.contains(`js-start-game-online-btn`) ? gameMode.ONLINE : gameMode.OFFLINE;
        const formData = new FormData(this.#form);
        this.emit(settingsViewEvents.SAVE_SETTINGS, {
            formData,
            gameMode: mode
        });
    }


    bind(element) {
        this.#form = element.querySelector(`.js-settings-form`);
        this.#form.addEventListener(`submit`, this.onSaveSettings);
        this.#backBtn = element.querySelector(`.js-back-btn`);
        this.#backBtn.addEventListener(`click`, this.onBackBtnHandler);
    }

    unbind() {
        this.#form.removeEventListener(`submit`, this.onSaveSettings);
        this.#backBtn.removeEventListener(`click`, this.onBackBtnHandler);
    }

    onBackBtnHandler = (e) => {
        e.preventDefault();
        this.emit(settingsViewEvents.BACK);
    }

    renderFormFields(formFields) {
        return formFields.map((field, indexFormControl) => {
            if(field.type === `radio`){
                return `<section class="settings-block">
                    <h2 class="subtitle settings-block__title">
                        ${field.label}
                    </h2>
                    <div class="character">
                        ${getCharactersListTemplate(field.items, indexFormControl)}
                    </div>
                </section>`
            }
            if(field.type === `input`) {
                return `<section class="settings-block">
                    <h2 class="subtitle settings-block__title">
                        ${field.label}
                    </h2>
                    <div class="settings-block__input-wrap">
                        <label class="settings-block__label">
                            <span class="input-wrap">
                                <input name="${field.name}"
                                    data-index-form-control="${indexFormControl}"
                                    value="${field.value}"
                                    ${field.attrs ? field.attrs : ''}
                                    type="${field.fieldType}">
                            </span>
                        </label>
                    </div>
                </section>`
            }
        }).join(``);
    }


    renderBtn(mode) {
        const isOnlineMode = mode === gameMode.ONLINE;
        const className = isOnlineMode ? ` js-start-game-online-btn` : ``;
        const btnText = isOnlineMode ? `Создать` : `Играть`;
        return (`
            <button class="btn${className} settings-view__start-btn">
                ${btnText}
            </button>
        `);
    }

    get template() {
        return (
            `<article class="settings-view">
                <h1 class="settings-view__title page-title">
                    Настройки
                </h1>
                <div class="settings-view__back">
                    <button class="settings-view__back-btn js-back-btn btn-back" type="button">Назад</button>
                </div>
                
                <form name="settings-form" class="settings-view__form js-settings-form">
                    ${this.renderFormFields(this.settings.settingsFields).trim()}
                    <section class="settings-view__start-block">
                        <h2 class="" hidden>Начать игру</h2>
                        ${this.renderBtn(this.settings.gameMode)}
                    <section>
                </form>
            </article>`);
    }
}

export default SettingsView;
