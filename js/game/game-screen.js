class GameScreen {
    constructor(gameView, gameModel) {
        this.gameModel = gameModel;
        this.gameView = gameView;
        this.gameView.onClickCanvas = this.onClickCanvas.bind(this);
    }

    get element() {
        return this.gameView.element
    }

    onClickCanvas(e) { 
        const coords = {
            x: e.offsetX,
            y: e.offsetY
        }
        const cell = this.gameModel.getCellbyCoord(coords);
        if(cell && cell.isEmpty){
            const imgPlayerPromise = this.gameModel.turnPlayer ? this.gameModel.playerImage : this.gameModel.AIImage;
            this.gameModel.changePlayer();
            this.gameModel.changeStateCell(cell);
            imgPlayerPromise.then((img) => {
                this.gameView.drawImgInCell(cell, img, this.gameModel.imageWidth - 15, this.gameModel.imageHeight - 15, this.gameModel.cellWidth, this.gameModel.cellHeight);
            });
            
        }

    }
}

export default GameScreen;