import {settingsGameDefault, charactersType} from '../data/settings.js';
import {getObjectFromFormData, getIconPlayerTemplate} from '../helpers/helpers.js';
import Router from '../router.js';

class SettingsScreen {
    constructor(settingsView, settingsModel) {
        this.settingsModel = new settingsModel({...settingsGameDefault});
        this.settingsView = new settingsView(this.settingsModel._settings);
        this.settingsView.onSubmitForm = this.saveSettings.bind(this);
    }

    get element() {
        return this.settingsView.element
    }

    

    saveSettings(formData) {
        const userSettings = Object.freeze(getObjectFromFormData(formData));
        const settings = {
            playerCharacter: userSettings.playerCharacter,
            playerIconTemplate: getIconPlayerTemplate(userSettings.playerCharacter),
            AIIconTemplate: getIconPlayerTemplate(userSettings.playerCharacter === charactersType.X ? charactersType.O : charactersType.X),
            numberCellsInRow: Number(userSettings.numberCellsInRow),
            numbersLines: Number(userSettings.numberCellsInRow) + 1
        }
        this.settingsView.unbind();
        Router.showGame(settings);
    }

}

export default SettingsScreen;