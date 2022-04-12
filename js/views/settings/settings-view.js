import AbstractView from '../abstract-view.js';
import getCharactersTemplate from '../../templates/characters.js';
import {characters} from '../../data/settings.js';


class SettingsView extends AbstractView {
    #form = null;

    constructor(modelSettings) {
        super();
        this.settings = modelSettings;
        this.handleSaveSettings = this.handleSaveSettings.bind(this);
    }

    onSubmitForm() {};

    handleSaveSettings(e) {
        e.preventDefault();
        const formData = new FormData(this.#form);
        this.onSubmitForm(formData);
    }

    bind(element) {
        this.#form = this._element.querySelector(`#settings-form`);
        this.#form.addEventListener(`submit`, this.handleSaveSettings);
    }

    unbind() {
        this.#form.removeEventListener(`submit`, this.handleSaveSettings)
    }

    renderFormFields(formFields) {
        return formFields.map((field) => {
            if(field.type === `input`) {
                return `<section class="settings-screen__size-field settings-field">
                    <h2 class="settings-field__title">
                        ${field.label}
                    </h2>
                    <div class="settings-field__size">
                        <label class="settings-field__size-input">
                            <span class="input">
                                <input name="${field.name}"
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

    get template() {
        return (
            `<article class="settings-screen">
                <h1 class="settings-screen__title">
                    Настройки
                </h1>
                <form name="settings-form" id="settings-form">
                    ${getCharactersTemplate(characters).trim()}
                    ${this.renderFormFields(this.settings.settingsFields).trim()}
                    <section class="settings-screen__start start-block">
                        <h2 class="start-block__title" hidden>Начать игру</h2>
                        <button class="start-block__btn btn btn--action">
                            Играть
                        </button>
                    <section>
                </form>
            </article>`);
    }
}

export default SettingsView;
