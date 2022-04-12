class GameModel {
    constructor(gameSettings) {
        this._settings = gameSettings;
    }

    get character() {
        return this._settings.character;
    }

    set character(character) {
        this._settings.character = character;
    }

    get gameSettings() {
        return this._settings;
    }

}

export default GameModel;