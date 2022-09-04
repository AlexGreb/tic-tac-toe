import { getImageFromSVGString } from '../image/image-helpers.js';
import { charactersType, gameMode, settingsOfflineGame, settingsOnlineGame, templateIconO, templateIconX } from '../../data/settings.js';

export const getImagePlayer = async (characterName) => {
  const iconTemplate = getIconPlayerTemplateByCharacter(characterName);
  return await getImageFromSVGString(iconTemplate);
};

export const getSizeTemplateForWin = (fieldSize) => {
  return fieldSize > 7 ? 5 : 3;
};

export const getSettingsGameByMode = (mode) => {
  switch (mode) {
    case gameMode.ONLINE:
      return settingsOnlineGame;

    default:
      return settingsOfflineGame;
  }
};

export const getIconPlayerTemplateByCharacter = (type) => {
  switch (type) {
    case charactersType.O:
      return templateIconO;

    default:
      return templateIconX;
  }
};
