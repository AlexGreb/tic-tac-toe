import {
    gameMode, 
    messageType, 
    indentCell
} from '../data/settings.js';
import {peerConnectorEvents} from '../network/peer-connector.js';
import GameView, {gameViewEvents} from '../views/game/game-view.js';
import GameModel from '../models/game-model.js';
import {createMessage} from '../helpers/helpers.js';

class GameScreen {
    #peerConnection = null;
    #isWaitMoveAnotherPlayer = null;

    constructor(gameSettings, onStartCallback, peerConection) {
        this.onStartCallback = onStartCallback;
        this.gameSettings = gameSettings;
        this.gameMode = this.gameSettings.mode;

        if(this.gameMode === gameMode.ONLINE) {
            // подписываюсь на сообщения в datachannel
            this.#peerConnection = peerConection;
            this.#peerConnection.subscribe(peerConnectorEvents.MESSAGE_DATA_CHANNEL, this.onMessageDataChannel);
            this.#peerConnection.sendData(createMessage(messageType.START));
        }
        
        this.startGame();
    }

    get element() {
        return this.gameView.element
    }

    onClickCanvas = (e) => { 
        if(this.gameModel.isOnline && this.#isWaitMoveAnotherPlayer) {
            return;
        }
        const clickCoords = {
            x: e.offsetX,
            y: e.offsetY
        };

        const cell = this.gameModel.getCellbyCoord(clickCoords);
        if(cell && cell.isEmpty){
            this.move(cell, true);
            this.#isWaitMoveAnotherPlayer = true;
        }
    }

    move = async (cell, needSend = false) => {
        const img = await (this.gameModel.turnPlayer ? this.gameModel.player1Image : this.gameModel.player2Image);
        //indentCell - отступы от границы ячейки
        this.gameView.drawImgInCell(cell, img, this.gameModel.imageWidth - indentCell, this.gameModel.imageHeight - indentCell, this.gameModel.cellWidth, this.gameModel.cellHeight);
        this.gameModel.changeStateCell(cell);
        this.gameModel.changePlayer();
        
        if(this.gameMode === gameMode.ONLINE && needSend){
            const message = createMessage(messageType.MOVE, { cell });
            this.#peerConnection.sendData(message);
        }
    }


    onMessageDataChannel = (message) => {
        switch(message.type) {
            case messageType.MOVE:
                this.move(message.payload.cell, false);
                this.#isWaitMoveAnotherPlayer = false;
              break;
        }
    }

    startGame() {
        this.gameModel = new GameModel(this.gameSettings);
        this.gameView = new GameView(this.gameModel.gameFieldSettings);
        this.gameView.subscribe(gameViewEvents.CLICK_GAME_FIELD, this.onClickCanvas);
        this.onStartCallback(this.element);
    }
}

export default GameScreen;