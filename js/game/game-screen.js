import Router from '../router.js';
import { gameMode, messageType, indentCell } from '../data/settings.js';
import { peerConnectorEvents } from '../network/peer-connector.js';
import GameView, { gameViewEvents } from '../views/game/game-view.js';
import GameModel from '../models/game-model.js';
import { createMessage } from '../helpers/helpers.js';
import Modal from 'modal-vanilla';

class GameScreen {
  #peerConnection = null;

  constructor(gameSettings, onStartCallback, peerConection) {
    this.onStartCallback = onStartCallback;
    this.gameSettings = gameSettings;
    this.gameMode = this.gameSettings.mode;
    //TODO создать в моделе свойство isOnline
    if (this.gameMode === gameMode.ONLINE) {
      // подписываюсь на сообщения в datachannel
      this.#peerConnection = peerConection;
      this.unsubscribeMessageDataChannel = this.#peerConnection.subscribe(
        peerConnectorEvents.MESSAGE_DATA_CHANNEL,
        this.onMessageDataChannel
      );
      this.unsubscribeCloseDataChannel = this.#peerConnection.subscribe(
        peerConnectorEvents.CLOSE_DATA_CHANNEL,
        this.onCloseDataChannel
      );
      this.#peerConnection.sendData(createMessage(messageType.START));
    }

    this.startGame();
  }

  get element() {
    return this.gameView.element;
  }

  onClickCanvas = (e) => {
    //TODO
    if (this.gameMode === gameMode.ONLINE && !this.gameModel.isMovePlayer) {
      return;
    }
    const clickCoords = {
      x: e.offsetX,
      y: e.offsetY,
    };

    const cell = this.gameModel.getCellByCoord(clickCoords);
    if (cell && cell.isEmpty) {
      this.move(cell, this.gameMode === gameMode.ONLINE);
      //TODO
      // if (this.gameMode === gameMode.ONLINE) {
      //   this.gameModel.changePlayer();
      //   // this.gameView.changeMoveStatus(this.gameModel.gameStatus);
      // }
    }
  };

  move = async (cell, needSend = false) => {
    if (
      !this.gameModel.isMovePlayer &&
      this.gameMode === gameMode.ONLINE &&
      needSend
    )
      return;
    //TODO get current player
    const imgName = this.gameModel.isMovePlayer
      ? this.gameModel.player1Character
      : this.gameModel.player2Character;
    //indentCell - отступы от границы ячейки
    await this.gameView.drawImgInCell(
      cell,
      imgName,
      this.gameModel.imageWidth - indentCell,
      this.gameModel.imageHeight - indentCell,
      this.gameModel.cellWidth,
      this.gameModel.cellHeight
    );
    this.gameModel.changeStateCell(cell);
    if (this.gameMode === gameMode.ONLINE && needSend) {
      const message = createMessage(messageType.MOVE, { cell });
      this.#peerConnection.sendData(message);
    }
    this.gameModel.changePlayer();
    this.gameView.changeMoveStatus(this.gameModel.gameStatus);
  };

  onMessageDataChannel = async (message) => {
    switch (message.type) {
      case messageType.MOVE:
        await this.move(message.payload.cell, false);
        break;
    }
  };

  onCloseDataChannel = () => {
    //TODO проверка завершилась ли игра
    this.unsubscribeMessageDataChannel();
    this.unsubscribeCloseDataChannel();
    this.#peerConnection = null;

    const alert = Modal.alert(`Ваш проивник вышел!`, {
      buttons: [
        {
          text: `На главную`,
          value: false,
          attr: {
            class: `btn`,
            'data-dismiss': `modal`,
          },
        },
      ],
    }).show();
    alert.on(`hidden`, () => {
      Router.showWelcome();
    });
  };

  startGame() {
    this.gameModel = new GameModel(this.gameSettings);
    this.gameView = new GameView(this.gameModel.gameFieldSettings);
    this.gameView.subscribe(
      gameViewEvents.CLICK_GAME_FIELD,
      this.onClickCanvas
    );
    this.gameView.changeMoveStatus(this.gameModel.gameStatus);
    this.onStartCallback(this.element);
  }
}

export default GameScreen;
