import {settingsGameDefault, charactersType, playerType} from '../data/settings.js';
import {getObjectFromFormData, getIconPlayerTemplate} from '../helpers/helpers.js';
import Router from '../router.js';

class SettingsScreen {
    constructor(settingsView, settingsModel) {
        this.settingsModel = new settingsModel({...settingsGameDefault});
        this.settingsView = new settingsView(this.settingsModel._settings);
        this.settingsView.onSubmitForm = this.saveSettings;
    }

    get element() {
        return this.settingsView.element
    }

    saveSettings = (formData, mode) => {
        const userSettings = Object.freeze(getObjectFromFormData(formData));
        const settings = {
            player: {
                character: userSettings.playerCharacter,
                iconTemplate: getIconPlayerTemplate(userSettings.playerCharacter),
                playerName: userSettings.playerName
            },
            player1Character: userSettings.playerCharacter,
            player1IconTemplate: getIconPlayerTemplate(userSettings.playerCharacter),
            player2Character: userSettings.playerCharacter === charactersType.X ? charactersType.O : charactersType.X,
            player2IconTemplate: getIconPlayerTemplate(userSettings.playerCharacter === charactersType.X ? charactersType.O : charactersType.X),
            numberCellsInRow: Number(userSettings.numberCellsInRow),
            numbersLines: Number(userSettings.numberCellsInRow) + 1,
            playerType: playerType.INICIATOR,
            gameMode: mode
            
        }
        this.settingsView.unbind();
        Router.showGame(settings);
    }

}

export default SettingsScreen;