import {
  charactersType,
  playerType,
  gameMode,
  serverName,
  socketGetParams,
  messageType,
} from '../data/settings.js';
import {
  getObjectFromFormData,
  getSettingsGameByMode,
  createMessage,
} from '../helpers/helpers.js';
import SettingsView, {
  settingsViewEvents,
} from '../views/settings/settings-view.js';
import Router from '../router.js';
import WebSocketConnector, { webSocketEvents } from '../network/websocket.js';
import PeerConnector, {
  peerConnectorEvents,
} from '../network/peer-connector.js';
import Modal from 'modal-vanilla';

class SettingsScreen {
  #peerConnection = null;
  #socket = null;

  constructor(gameMode) {
    const settingFields = getSettingsGameByMode(gameMode);
    this.settingsView = new SettingsView(settingFields);
    this.unsubscribeOnSaveSettings = this.settingsView.subscribe(
      settingsViewEvents.SAVE_SETTINGS,
      this.saveSettings
    );
    this.unsubscribeOnBackBtn = this.settingsView.subscribe(
      settingsViewEvents.BACK,
      this.backToView
    );
  }

  get element() {
    return this.settingsView.element;
  }

  onMessageDataChannel = (message) => {
    if (message.type === messageType.START) {
      this.showGame();
      this.unsubscribeMessageDataChannel();
    }
  };

  onOpenDataChannel = () => {
    // TODO создать функцию sendSettings
    const message = createMessage(messageType.SETTINGS, {
      gameSettings: this.gameSettings,
    });
    this.#peerConnection.sendData(message);
    this.unsubscribeOpenDataChannel();
  };

  saveSettings = (settingsData) => {
    const settings = Object.freeze(
      getObjectFromFormData(settingsData.formData)
    );
    const isOnlineGame = settingsData.gameMode === gameMode.ONLINE;

    this.gameSettings = {
      numberCellsInRow: Number(settings.numberCellsInRow),
      numbersLines: Number(settings.numberCellsInRow) + 1,
      mode: settingsData.gameMode,
      isMovePlayer: true,
    };

    if (isOnlineGame) {
      this.gameSettings = {
        ...this.gameSettings,
        player1Character: settings.playerCharacter,
        player2Character:
          settings.playerCharacter === charactersType.X
            ? charactersType.O
            : charactersType.X,
        playerType: playerType.INICIATOR,
        isMovePlayer: settings.playerCharacter === charactersType.X,
      };

      // создаем P2P соединение затем отправляем настройки и запускаем игру
      this.createConnect();
    } else {
      this.gameSettings = {
        ...this.gameSettings,
        player1Character: charactersType.X,
        player2Character: charactersType.O,
      };
      this.showGame();
    }
  };

  createConnect = () => {
    this.settingsView.showCreateGameModal(this.closeConnect);
    this.#socket = new WebSocketConnector();
    this.unsubscribeSocketClose = this.#socket.subscribe(
      webSocketEvents.CLOSE,
      this.onCloseSocket
    );
    this.#peerConnection = new PeerConnector(this.#socket, true);
    this.#peerConnection.create();
    this.#socket.create(`${serverName}?${socketGetParams.CREATE_GAME}`);

    this.unsubscribeMessageDataChannel = this.#peerConnection.subscribe(
      peerConnectorEvents.MESSAGE_DATA_CHANNEL,
      this.onMessageDataChannel
    );
    this.unsubscribeOpenDataChannel = this.#peerConnection.subscribe(
      peerConnectorEvents.OPEN_DATA_CHANNEL,
      this.onOpenDataChannel
    );
  };

  closeConnect = () => {
    this.#socket.close();
    this.#peerConnection.close();
    this.unsubscribeSocketClose();
    this.unsubscribeMessageDataChannel();
    this.unsubscribeOpenDataChannel();
    this.#socket = null;
    this.#peerConnection = null;
  };

  showGame = () => {
    this.destroyListeners();
    Router.showGame(this.gameSettings, this.#peerConnection);
  };

  onCloseSocket = (isClear) => {
    if (isClear === false) {
      const alert = Modal.alert(`Не удалось подключиться`).show();
      this.closeConnect();
      alert.on(`hide`, () => {
        this.settingsView.hideCreateGameModal();
      });
    }
  };

  destroyListeners = () => {
    this.unsubscribeOnSaveSettings();
    this.settingsView.unbind();
  };

  backToView = () => {
    this.destroyListeners();
    Router.showWelcome();
  };
}

export default SettingsScreen;
