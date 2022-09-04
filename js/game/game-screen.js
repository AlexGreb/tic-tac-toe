import Router from '../router.js';
import { messageType, indentCell } from '../data/settings.js';
import { peerConnectorEvents } from '../network/peer-connector.js';
import GameView, { gameViewEvents } from '../views/game/game-view.js';
import GameModel from '../models/game-model.js';
import { createMessage } from '../helpers/network/network-helper.js';
import Modal from 'modal-vanilla';

class GameScreen {
  #connection = null;

  constructor(gameSettings, onStartCallback, connection) {
    this.onStartCallback = onStartCallback;
    this.gameSettings = gameSettings;
    this.#connection = connection || null;
    this.startGame();
  }

  get element() {
    return this.gameView.element;
  }

  onClickGameField = async (e) => {
    // если чужой ход или игра закончилась не обрабатывать клик по полю
    if (this.gameModel.isFreeze || this.gameModel.gameStatus === this.gameModel.gameStatuses.END) {
      return;
    }
    const clickCoords = {
      x: e.offsetX,
      y: e.offsetY,
    };

    const cell = this.gameModel.getCellByCoord(clickCoords);
    if (cell && cell.isEmpty) {
      await this.move(cell, this.gameModel.isOnlineMode);
    }
  };

  move = async (cell, needSend = false) => {
    if (this.gameModel.isFreeze && needSend) return;

    const imgName = this.gameModel.currentPlayer;
    //indentCell - отступы от границы ячейки
    await this.gameView.drawImgInCell(cell, imgName, this.gameModel.imageWidth - indentCell, this.gameModel.imageHeight - indentCell);
    this.gameModel.changeStateCell(cell);

    if (this.gameModel.isOnlineMode && needSend) {
      const message = createMessage(messageType.MOVE, { cell });
      this.#connection.sendMessage(message);
    }
    const winObj = this.gameModel.checkWin(cell);
    //отрисовка линии при выйгрыше
    let statusText = null;
    if (winObj.gameStatus !== this.gameModel.gameStatuses.GAME) {
      statusText = `Ничья`;
      if (winObj.gameStatus === this.gameModel.gameStatuses.PLAYER_WIN) {
        this.gameView.renderWinLine(this.getWinLineCoords(winObj));
        statusText = `Победили ${this.gameModel.currentPlayer}`;
      }
      this.gameModel.gameStatus = this.gameModel.gameStatuses.END;
      this.gameView.showRetryBtn();
    }

    this.gameModel.changePlayer();
    this.gameView.changeMoveStatusText(statusText ?? this.gameModel.gameStatusText);
  };

  getWinLineCoords = ({ direction, winCellsList }) => {
    const directions = this.gameModel.winDirections;
    const startCell = winCellsList.shift();
    const endCell = winCellsList.pop();
    const middleOfCell = this.gameModel.cellHeight / 2;

    const directionCheckMap = {
      [directions.LEFT_TO_RIGHT]: () => {
        return {
          startX1Coords: startCell.coords[0][0],
          endY1Coords: startCell.coords[1][1] - middleOfCell,
          startX2Coords: endCell.coords[0][1],
          endY2Coords: endCell.coords[1][1] - middleOfCell,
        };
      },
      [directions.TOP_TO_BOTTOM]: () => {
        return {
          startX1Coords: startCell.coords[0][0] + middleOfCell,
          endY1Coords: startCell.coords[1][0],
          startX2Coords: endCell.coords[0][0] + middleOfCell,
          endY2Coords: endCell.coords[1][1],
        };
      },
      [directions.RIGHT_TOP_TO_LEFT_BOTTOM]: () => {
        return {
          startX1Coords: startCell.coords[0][0],
          endY1Coords: startCell.coords[1][1],
          startX2Coords: endCell.coords[0][1],
          endY2Coords: endCell.coords[1][0],
        };
      },
      [directions.LEFT_TOP_TO_RIGHT_BOTTOM]: () => {
        return {
          startX1Coords: startCell.coords[0][0],
          endY1Coords: startCell.coords[1][0],
          startX2Coords: endCell.coords[0][1],
          endY2Coords: endCell.coords[1][1],
        };
      },
    };

    return directionCheckMap[direction]?.();
  };

  onMessageDataChannel = async (message) => {
    switch (message.type) {
      case messageType.MOVE:
        await this.move(message.payload.cell, false);
        break;
      case messageType.RETRY:
        this.unsubscribeDataChannel();
        this.startGame();
        break;
    }
  };

  onCloseDataChannel = () => {
    this.unsubscribeMessageDataChannel();
    this.unsubscribeCloseDataChannel();
    this.#connection = null;

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

  retryGame = () => {
    if (this.gameModel.isOnlineMode) {
      const message = createMessage(messageType.RETRY);
      this.#connection.sendMessage(message);
      this.unsubscribeDataChannel();
    }
    this.destroyListeners();
    this.startGame();
  };

  backToMainPage = () => {
    if (this.gameModel.isOnlineMode) {
      this.unsubscribeDataChannel();
      this.#connection.closeConnect();
    }
    this.destroyListeners();
    Router.showWelcome();
  };

  unsubscribeDataChannel() {
    this.unsubscribeMessageDataChannel();
    this.unsubscribeCloseDataChannel();
  }

  destroyListeners() {
    this.unsubscribeClickGameField();
    this.unsubscribeBackToMain();
    this.unsubscribeRetry();
    this.gameView.unbind();
  }

  startGame() {
    this.gameModel = new GameModel(this.gameSettings);
    this.gameView = new GameView(this.gameModel.gameFieldSettings);
    if (this.gameModel.isOnlineMode) {
      // подписываюсь на сообщения в datachannel
      this.unsubscribeMessageDataChannel = this.#connection.subscribeMessageServer(
        peerConnectorEvents.MESSAGE_DATA_CHANNEL,
        this.onMessageDataChannel
      );
      this.unsubscribeCloseDataChannel = this.#connection.subscribeMessageServer(
        peerConnectorEvents.CLOSE_DATA_CHANNEL,
        this.onCloseDataChannel
      );
      this.#connection.sendMessage(createMessage(messageType.START));
    }

    this.unsubscribeClickGameField = this.gameView.subscribe(gameViewEvents.CLICK_GAME_FIELD, this.onClickGameField);
    this.unsubscribeRetry = this.gameView.subscribe(gameViewEvents.CLICK_RETRY, this.retryGame);
    this.unsubscribeBackToMain = this.gameView.subscribe(gameViewEvents.CLICK_TO_MAIN, this.backToMainPage);
    this.gameView.changeMoveStatusText(this.gameModel.gameStatusText);
    this.onStartCallback(this.element);
  }
}

export default GameScreen;
