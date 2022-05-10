import {gameMode, playerType, serverName, peerEvents, messageType} from '../data/settings.js';
import WebSocketConnector from '../network/websocket.js';
import PeerConnector from '../network/peer-connector.js';
import GameView from '../views/game/game-view.js';
import GameModel from '../models/game-model.js';

class GameScreen {
    #peerConnection = null;

    constructor(gameSettings, onStartCallback) {
        this.onStartCallback = onStartCallback;
        return new Promise((resolve) => {
            // this.gameModel = gameModel;
            // this.gameView = gameView;
            this.gameSettings = gameSettings
            // this.gameView.onClickCanvas = this.onClickCanvas;
    
            if(this.gameSettings.gameMode === gameMode.NETWORK) {
                this.isIniciator = this.gameSettings.playerType === playerType.INICIATOR;
                const socketParam = this.isIniciator ? `createGame=true` : `findGame=true`;
                this.socket = new WebSocketConnector();
                this.#peerConnection = new PeerConnector(this.socket, this.isIniciator);
                this.#peerConnection.subscribe()

                this.#peerConnection.create();
                this.socket.create(`${serverName}?${socketParam}`);

                this.#peerConnection.subscribe(peerEvents.MESSAGE_DATA_CHANNEL, this.onMessageDataChannel)
                this.#peerConnection.subscribe(peerEvents.OPEN_DATA_CHANNEL, () => {
                    if(this.isIniciator) {
                        // TODO сделать функцию создания сообщений
                        const message = {
                            type: messageType.SETTINGS,
                            payload: {
                                gameSettings: this.gameSettings
                            }
                        }
                        this.#peerConnection.sendData(message);
                    }
                    resolve(this);
                });
            } else {
                resolve(this);
            }
        })
    }

    get element() {
        return this.gameView.element
    }

    onClickCanvas = (e) => { 
        const coords = {
            x: e.offsetX,
            y: e.offsetY
        }
        const cell = this.gameModel.getCellbyCoord(coords);
        if(cell && cell.isEmpty){
            this.move(cell, true);
        }
    }

    move = async (cell, needSend = false) => {
        const promiseImg = await this.gameModel.turnPlayer ? this.gameModel.player1Image : this.gameModel.player2Image;
        promiseImg.then((img) => {
            this.gameModel.changeStateCell(cell);
            this.gameModel.changePlayer();
            this.gameView.drawImgInCell(cell, img, this.gameModel.imageWidth - 15, this.gameModel.imageHeight - 15, this.gameModel.cellWidth, this.gameModel.cellHeight);
            if(this.gameSettings.gameMode === gameMode.NETWORK && needSend){
                const message = {
                    type: messageType.MOVE,
                    payload: {
                        cell
                    }
                }
                this.#peerConnection.sendData(message);
            }
        });
    }

    onMessageDataChannel = (message) => {
        if(message.type === messageType.SETTINGS) {
            // const gameSettings = message.payload.gameSettings;
            // gameSettings.playerCharacter = gameSettings.playerCharacter

            this.gameSettings = message.payload.gameSettings;
            const requestMessage = {
                type: messageType.START
            }
            this.#peerConnection.sendData(requestMessage);
            this.startGame();
            // this.socket.close();
        }

        if(message.type === messageType.START) {
            this.startGame();
            // this.socket.close();
        }

        if(message.type === messageType.MOVE) {
            this.move(message.payload.cell, false);
        }

    }

    startGame() {
        this.gameModel = new GameModel(this.gameSettings);
        this.gameView = new GameView(this.gameModel.gameFieldSettings);
        this.gameView.onClickCanvas = this.onClickCanvas;
        this.onStartCallback(this.element);
    }
}

export default GameScreen;