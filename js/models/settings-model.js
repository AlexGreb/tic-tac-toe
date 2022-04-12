class SettingsModel {

    constructor(settings) {
        this._settings = settings;
    }

    get settings() {
        return this._settings;
    }

    set settings(settings) {
        this._settings = settings;
    }

    set characters(character) {
        this._settings.character = character;
    }

    get characters() {
        return this._settings.character;
    }

    get fieldSize() {
        return this._settings.sizeField;
    }

    set fieldSize(size) {
        this._settings.fieldSize = size;
    }
}

export default SettingsModel;