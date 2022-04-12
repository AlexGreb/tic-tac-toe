import {settingsGameDefault} from '../data/settings.js';
export const getGameSettings = (settingsFormData) => {
    const settings = {};
    const keysSettings = Object.keys(settingsGameDefault);
    for(let key of keysSettings) {
        const value = settingsFormData.get(key);
        if(value != null){
            settings[key] = value;
        }
    }
    return settings;
};
