import WelcomeView from './views/welcome/welcome-view.js';
import SettingsView from './views/settings/settings-view.js';
import WelcomeScreen from './game/welcome-screen.js';
import SettingsScreen from './game/settings-screen.js';
import SettingsModel from './models/settings-model.js';
import GameScreen from './game/game-screen.js';
import GameView from './views/game/game-view.js';
import GameModel from './models/game-model.js';

const changeView = (html) => {
    document.body.innerHTML = ``;
    document.body.appendChild(html);
}

class Router {
    static showWelcome() {
        const welcomeScreen = new WelcomeScreen(WelcomeView);
        changeView(welcomeScreen.element);
    }

    static showSettings() {
        const settingsScreen = new SettingsScreen(SettingsView, SettingsModel);
        changeView(settingsScreen.element);
    }

    static showGame(gameSettings) {
        const gameModel = new GameModel(gameSettings.settings);
        const gameView = new GameView(gameModel);
        const gameScreen = new GameScreen(gameView, gameModel);
        changeView(gameScreen.element)
    }
}

export default Router;