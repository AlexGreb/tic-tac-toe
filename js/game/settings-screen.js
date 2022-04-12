import {settingsGameDefault} from '../data/settings.js';
import {getGameSettings} from '../helpers/helpers.js';
import Router from '../router.js';

class SettingsScreen {
    constructor(settingsView, settingsModel) {
        this.settingsModel = new settingsModel({...settingsGameDefault});
        this.settingsView = new settingsView(this.settingsModel.settings);
        this.settingsView.onSubmitForm = this.saveSettings.bind(this);
    }

    get element() {
        return this.settingsView.element
    }

    saveSettings(settings) {
        const gameSettings = getGameSettings(settings);
        this.settingsModel.fieldSize = gameSettings.fieldSize;
        this.settingsModel.character = gameSettings.character;
        this.settingsView.unbind();
        Router.showGame(this.settingsModel);
    }

}

export default SettingsScreen;