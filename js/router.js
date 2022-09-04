import WelcomeScreen from './game/welcome-screen.js';
import SettingsScreen from './game/settings-screen.js';
import GameScreen from './game/game-screen.js';

const changeView = (html) => {
  document.body.innerHTML = ``;
  document.body.appendChild(html);
};

class Router {
  static showWelcome() {
    const welcomeScreen = new WelcomeScreen();
    changeView(welcomeScreen.element);
  }

  static showGameSettings(gameMode) {
    const settingsScreen = new SettingsScreen(gameMode);
    changeView(settingsScreen.element);
  }

  static showGame(gameSettings, connection) {
    new GameScreen(gameSettings, changeView, connection);
  }
}

export default Router;
