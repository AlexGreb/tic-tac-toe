import render from '../utils/dom/render';
import {
  getSettingsScreenElement
} from './settings';

const getWelcomeScreenElement = () => {
  const _element = document.createElement(`div`);
  const template = getWelcomeScreenTemplate();
  _element.innerHTML = template;
  return _element;
};

const getWelcomeScreenTemplate = () => {
  return (
    `<article class="welcome-screen">
        <h1 class="welcome-screen__title">
            Крестики <span>X</span> Н<span>о</span>лики
        </h1>
    
        <button class="welcome-screen__btn btn btn--action"
            type="button">
            Начать игру
        </button>
    </article>`
  );
};

const bindWelcomeScreen = (_element) => {
  _element.querySelector(`.welcome-screen__btn`).addEventListener(`click`, (e) => {
    e.preventDefault();
    const settingsScreenElement = getSettingsScreenElement();
    render(document.body, settingsScreenElement);
  });
};

export {
  getWelcomeScreenElement,
  getWelcomeScreenTemplate,
  bindWelcomeScreen
};
