import {iconO, iconX, charactersType} from "../data/settings";

export const getObjectFromFormData = (settingsFormData) => {
    const settings = {};

    for(let [nameSetting, valueSetting] of settingsFormData) {
        settings[nameSetting] = valueSetting;
    }
    return settings;
};

export const getIconPlayerTemplate = (type) => {
    switch(type) {
        case charactersType.O: 
            return iconO;

        default:
            return iconX;
    }
}