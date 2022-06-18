import {
  templateIconO,
  templateIconX,
  charactersType,
  gameMode,
  settingsOfflineGame,
  settingsOnlineGame,
} from '../data/settings.js';

export const getObjectFromFormData = (settingsFormData) => {
  const settings = {};

  for (let [nameSetting, valueSetting] of settingsFormData) {
    settings[nameSetting] = valueSetting;
  }
  return settings;
};

export const getIconPlayerTemplateByCharacter = (type) => {
  switch (type) {
    case charactersType.O:
      return templateIconO;

    default:
      return templateIconX;
  }
};

export const createMessage = (type, payload) => {
  return {
    type,
    payload: {
      ...payload,
    },
  };
};

export const getSettingsGameByMode = (mode) => {
  switch (mode) {
    case gameMode.ONLINE:
      return settingsOnlineGame;

    default:
      return settingsOfflineGame;
  }
};

export const getImageFromSVGString = (svgString) => {
  return new Promise((resolve) => {
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(blob);
    img.onload = () => {
      resolve(img);
    };
  });
};

export const getImagePlayer = async (characterName) => {
  const iconTemplate = getIconPlayerTemplateByCharacter(characterName);
  return await getImageFromSVGString(iconTemplate);
};
