import AbstractView from '../abstract-view.js';
import getCharactersListTemplate from '../../templates/characters-list.js';
import {gameMode} from '../../data/settings.js';
import Loader from '../common/loader.js';
import Modal from 'modal-vanilla';
import '../../../scss/modal.scss';

export const settingsViewEvents = {
    SAVE_SETTINGS: `saveSettings`,
}

class SettingsView extends AbstractView {
    #form = null;

    constructor(settings) {
        super();

        this.settings = settings;
        this.onSaveSettings = this.onSaveSettings.bind(this);
    }

    showCreateGameModal = () => {
        this.loader = new Loader(`Ищем соперника...`);
        const modalContent = this.loader.element;
        this.createGameModal = new Modal({
            content: modalContent,
            footer: false,
            header: false,
            backdrop: `static`
        });
        this.createGameModal.show();
    };

    hideCreateGameModal = () => {
        this.createGameModal.hide();
    }

    onSaveSettings(e) {
        e.preventDefault();
        const mode = e.submitter.classList.contains(`js-start-game-network-btn`) ? gameMode.ONLINE : gameMode.OFFLINE;
        const formData = new FormData(this.#form);
        this.emit(settingsViewEvents.SAVE_SETTINGS, {
            formData,
            gameMode: mode
        });
    }


    bind(element) {
        this.#form = element.querySelector(`#settings-form`);
        this.#form.addEventListener(`submit`, this.onSaveSettings);
    }

    unbind() {
        this.#form.removeEventListener(`submit`, this.onSaveSettings);
    }

    renderFormFields(formFields) {
        return formFields.map((field, indexFormControl) => {
            if(field.type === `radio`){
                return `<section class="settings-screen__choose-character choose-character">
                    <h2 class="choose-character__title">
                        ${field.label}
                    </h2>
                    <div class="choose-character__characters">
                        ${getCharactersListTemplate(field.items, indexFormControl)}
                    </div>
                </section>`
            }
            if(field.type === `input`) {
                return `<section class="settings-screen__size-field settings-field">
                    <h2 class="settings-field__title">
                        ${field.label}
                    </h2>
                    <div class="settings-field__size">
                        <label class="settings-field__size-input">
                            <span class="input">
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

    renderBtn() {

    }

    get template() {
        return (
            `<article class="settings-screen">
                <h1 class="settings-screen__title">
                    Настройки
                </h1>
                <form name="settings-form" id="settings-form">
                    ${this.renderFormFields(this.settings.settingsFields).trim()}
                    <section class="settings-screen__start start-block">
                        <h2 class="start-block__title" hidden>Начать игру</h2>
                        ${this.renderBtn(this.settings.gameMode)}
                        <div class="start-block__create-network-game-btn-wrap">
                            <button class="js-start-game-network-btn btn btn--action">
                                Создать
                            </button>
                        </div>
                        <div>
                            <button class="start-block__btn btn btn--action">
                                Играть
                            </button>
                        </div>
                    <section>
                </form>
            </article>`);
    }
}

export default SettingsView;
