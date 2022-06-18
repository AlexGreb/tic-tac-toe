import Router from '../router.js';
import WelcomeView, {
  welcomeViewEvents,
} from '../views/welcome/welcome-view.js';
import {
  gameMode,
  socketGetParams,
  messageType,
  serverName,
  charactersType,
} from '../data/settings.js';
import { createMessage } from '../helpers/helpers.js';
import WebSocketConnector, { webSocketEvents } from '../network/websocket.js';
import PeerConnector, {
  peerConnectorEvents,
} from '../network/peer-connector.js';
import Modal from 'modal-vanilla';

class WelcomeScreen {
  #peerConnection = null;
  #socket = null;

  constructor() {
    this.welcomeView = new WelcomeView();
    this.welcomeView.subscribe(
      welcomeViewEvents.START_GAME,
      this.startOfflineGame
    );
    this.welcomeView.subscribe(
      welcomeViewEvents.FIND_GAME,
      this.findOnlineGame
    );
    this.welcomeView.subscribe(
      welcomeViewEvents.CREATE_GAME,
      this.createOnlineGame
    );
  }

  get element() {
    return this.welcomeView.element;
  }

  onMessageDataChannel = (message) => {
    if (message.type === messageType.SETTINGS) {
      //  TODO сделать получше и повторятеся код
      this.gameSettings = Object.assign({}, message.payload.gameSettings);
      this.gameSettings.player1Character =
        message.payload.gameSettings.player2Character;
      this.gameSettings.player2Character =
        message.payload.gameSettings.player1Character;
      this.gameSettings.isMovePlayer =
        this.gameSettings.player1Character === charactersType.X;
      this.#peerConnection.sendData(createMessage(messageType.START));
    }

    if (message.type === messageType.START) {
      this.unsubscribeMessageDataChannel();
      this.welcomeView.unbind();
      Router.showGame(this.gameSettings, this.#peerConnection);
    }
  };

  startOfflineGame = () => {
    Router.showGameSettings(gameMode.OFFLINE);
  };

  createConnection = () => {
    // TODO вынести куда то так используется в settings-screen
    // создаем P2P соединение затем получаем настройки и запускаем игру
    this.#socket = new WebSocketConnector();
    this.unsubscribeSocketClose = this.#socket.subscribe(
      webSocketEvents.CLOSE,
      this.onCloseSocket
    );
    this.#peerConnection = new PeerConnector(this.#socket, false);
    this.#peerConnection.create();
    this.#socket.create(`${serverName}?${socketGetParams.FIND_GAME}`);
    this.unsubscribeMessageDataChannel = this.#peerConnection.subscribe(
      peerConnectorEvents.MESSAGE_DATA_CHANNEL,
      this.onMessageDataChannel
    );
  };

  //TODO убрать?
  findOnlineGame = () => {
    this.welcomeView.showFindGameModal(this.closeConnect);
    this.createConnection();
  };

  createOnlineGame = () => {
    this.welcomeView.unbind();
    Router.showGameSettings(gameMode.ONLINE);
  };

  closeConnect = () => {
    this.#socket.close();
    this.#peerConnection.close();
    this.unsubscribeMessageDataChannel();
    this.#socket = null;
    this.#peerConnection = null;
  };

  onCloseSocket = (isClear) => {
    if (isClear === false) {
      const alert = Modal.alert(`Не удалось подключиться`).show();
      this.unsubscribeSocketClose();
      this.closeConnect();
      alert.on(`hide`, () => {
        this.welcomeView.hideFindGameModal();
      });
    }
  };
}

export default WelcomeScreen;
