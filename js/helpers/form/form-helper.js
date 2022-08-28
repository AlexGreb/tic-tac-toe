export const getObjectFromFormData = (settingsFormData) => {
  const settings = {};

  for (let [nameSetting, valueSetting] of settingsFormData) {
    settings[nameSetting] = valueSetting;
  }
  return settings;
};
