class GameScreen {
    constructor(gameView, gameModel) {
        this.gameModel = gameModel;
        this.gameView = gameView;
    }

    get element() {
        return this.gameView.element
    }
}

export default GameScreen;