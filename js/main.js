import render from '../js/utils/dom/render';
import {
  getWelcomeScreenElement,
  bindWelcomeScreen
} from '../js/views/welcome';

window.addEventListener(`load`, () => {
  const welcomeScreenElement = getWelcomeScreenElement();
  bindWelcomeScreen(welcomeScreenElement);
  render(document.body, welcomeScreenElement);
});

