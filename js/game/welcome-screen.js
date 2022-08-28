import Router from '../router.js';
import WelcomeView, { welcomeViewEvents } from '../views/welcome/welcome-view.js';
import { gameMode, socketGetParams, messageType, charactersType } from '../data/settings.js';
import { createMessage } from '../helpers/network/network-helper.js';
import Modal from 'modal-vanilla';
import { ConnectionService } from '../services/connection/connection-service.js';

class WelcomeScreen {
  #connection = null;
  #messageActions = null;
  constructor() {
    this.#messageActions = {
      [messageType.SETTINGS]: this.#createSettingsNotifyOnlineGame.bind(this),
      [messageType.START]: this.#startOnlineGame.bind(this),
    };
    this.welcomeView = new WelcomeView();
    this.welcomeView.subscribe(welcomeViewEvents.START_GAME, this.startOfflineGame);
    this.welcomeView.subscribe(welcomeViewEvents.FIND_GAME, this.findOnlineGame);
    this.welcomeView.subscribe(welcomeViewEvents.CREATE_GAME, this.createOnlineGame);
  }

  get element() {
    return this.welcomeView.element;
  }

  onMessageDataChannel = (message) => {
    this.#messageActions[message.type](message.payload);
  };

  #createSettingsNotifyOnlineGame(remoteGameSettings) {
    this.gameSettings = Object.assign({}, remoteGameSettings.gameSettings);
    this.gameSettings.player1Character = remoteGameSettings.gameSettings.player2Character;
    this.gameSettings.player2Character = remoteGameSettings.gameSettings.player1Character;
    this.gameSettings.isMyMove = this.gameSettings.player1Character === charactersType.X;
    this.#connection.sendMessage(createMessage(messageType.START));
  }

  #startOnlineGame() {
    this.unsubscribeMessageDataChannel();
    this.welcomeView.unbind();
    Router.showGame(this.gameSettings, this.#connection);
  }

  startOfflineGame = () => {
    Router.showGameSettings(gameMode.OFFLINE);
  };

  createConnection = () => {
    // создаем P2P соединение затем получаем настройки и запускаем игру
    this.#connection = new ConnectionService(false, socketGetParams.FIND_GAME, null, this.onCloseSocket, this.onMessageDataChannel);
    this.unsubscribeWebsocketClose = this.#connection.subscribeServer(this.#connection.webSocketEvents.CLOSE, this.onCloseSocket);
    this.unsubscribeMessageDataChannel = this.#connection.subscribeMessageServer(
      this.#connection.peerConnectorEvents.MESSAGE_DATA_CHANNEL,
      this.onMessageDataChannel
    );
    this.#connection.createConnection();
  };

  findOnlineGame = () => {
    this.welcomeView.showFindGameModal(this.closeConnect);
    this.createConnection();
  };

  createOnlineGame = () => {
    this.welcomeView.unbind();
    Router.showGameSettings(gameMode.ONLINE);
  };

  closeConnect = () => {
    this.#connection.closeConnect();
    this.unsubscribeMessageDataChannel();
  };

  onCloseSocket = (isClear) => {
    if (isClear === false) {
      const alert = Modal.alert(`Не удалось подключиться`).show();
      this.unsubscribeWebsocketClose();
      this.closeConnect();
      alert.on(`hide`, () => {
        this.welcomeView.hideFindGameModal();
      });
    }
  };
}

export default WelcomeScreen;
