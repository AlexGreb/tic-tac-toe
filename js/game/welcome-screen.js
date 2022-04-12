import Router from '../router';

class WelcomeScreen {
    constructor(welcomeView) {
        this.welcomeView = new welcomeView();
        this.welcomeView.onBtnStart = this.startGame.bind(this);
    };

    get element() {
        return this.welcomeView.element;
    }

    startGame() {
        this.welcomeView.unbind();
        Router.showSettings();
    }
}

export default WelcomeScreen;