import WelcomeView from './views/welcome/welcome-view.js';
import SettingsView from './views/settings/settings-view.js';
import WelcomeScreen from './game/welcome-screen.js';
import SettingsScreen from './game/settings-screen.js';
import SettingsModel from './models/settings-model.js';
import GameScreen from './game/game-screen.js';

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

    static showGame = async (gameSettings) => {
        // const gameModel = new GameModel(gameSettings);
        // const gameView = new GameView(gameModel.gameFieldSettings);
        // const gameScreen = new GameScreen(gameView, gameModel);
        const start = (element) => {
            changeView(element)
        };

        const gameScreen = await new GameScreen(gameSettings, start);
        
    }
}

export default Router;