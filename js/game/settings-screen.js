import { charactersType, playerType, gameMode, socketGetParams, messageType } from '../data/settings.js';
import { createMessage } from '../helpers/network/network-helper.js';
import { getSettingsGameByMode, getSizeTemplateForWin } from '../helpers/settings/settings-helper.js';
import { getObjectFromFormData } from '../helpers/form/form-helper.js';
import SettingsView, { settingsViewEvents } from '../views/settings/settings-view.js';
import Router from '../router.js';
import Modal from 'modal-vanilla';
import { ConnectionService } from '../services/connection/connection-service.js';

class SettingsScreen {
  #connection = null;
  #messageActions = null;

  constructor(gameMode) {
    this.#messageActions = {
      [messageType.START]: this.#startOnlineGame.bind(this),
    };
    const settingFields = getSettingsGameByMode(gameMode);
    this.settingsView = new SettingsView(settingFields);
    this.unsubscribeOnSaveSettings = this.settingsView.subscribe(settingsViewEvents.SAVE_SETTINGS, this.saveSettings);
    this.unsubscribeOnBackBtn = this.settingsView.subscribe(settingsViewEvents.BACK, this.backToView);
  }

  get element() {
    return this.settingsView.element;
  }

  #startOnlineGame = () => {
    this.showGame();
    this.unsubscribeMessageDataChannel();
  };

  onMessageDataChannel = (message) => {
    this.#messageActions[message.type](message.payload);
  };

  onOpenDataChannel = () => {
    const message = createMessage(messageType.SETTINGS, {
      gameSettings: this.gameSettings,
    });
    this.#connection.sendMessage(message);
  };

  saveSettings = (settingsData) => {
    const settings = Object.freeze(getObjectFromFormData(settingsData.formData));
    const isOnlineGame = settingsData.gameMode === gameMode.ONLINE;
    const numberCellsInRow = Number(settings.numberCellsInRow);
    const numbersLines = Number(settings.numberCellsInRow) + 1;
    const sizeTemplateForWin = getSizeTemplateForWin(numberCellsInRow);

    this.gameSettings = {
      numberCellsInRow,
      numbersLines,
      sizeTemplateForWin,
      gameMode: settingsData.gameMode,
      isMyMove: true,
    };

    if (isOnlineGame) {
      this.gameSettings = {
        ...this.gameSettings,
        player1Character: settings.playerCharacter,
        player2Character: settings.playerCharacter === charactersType.X ? charactersType.O : charactersType.X,
        playerType: playerType.INITIATOR,
        isMyMove: settings.playerCharacter === charactersType.X,
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
    this.#connection = new ConnectionService(true, socketGetParams.CREATE_GAME, this.onMessageDataChannel);
    this.unsubscribeOpenDataChannel = this.#connection.subscribeMessageServer(
      this.#connection.peerConnectorEvents.OPEN_DATA_CHANNEL,
      this.onOpenDataChannel
    );
    this.unsubscribeWebsocketClose = this.#connection.subscribeServer(this.#connection.webSocketEvents.CLOSE, this.onCloseSocket);
    this.unsubscribeMessageDataChannel = this.#connection.subscribeMessageServer(
      this.#connection.peerConnectorEvents.MESSAGE_DATA_CHANNEL,
      this.onMessageDataChannel
    );
    this.#connection.createConnection();
    this.settingsView.showCreateGameModal(this.closeConnect);
  };

  closeConnect = () => {
    this.#connection.closeConnect();
    this.unsubscribeWebsocketClose();
    this.unsubscribeMessageDataChannel();
    this.unsubscribeOpenDataChannel();
  };

  showGame = () => {
    this.destroyListeners();
    Router.showGame(this.gameSettings, this.#connection);
  };

  onCloseSocket = (isClear) => {
    if (isClear === false) {
      const alert = Modal.alert(`Не удалось подключиться`).show();
      alert.on(`hide`, () => {
        this.settingsView.hideCreateGameModal();
      });
      this.closeConnect();
    }
  };

  destroyListeners = () => {
    this.unsubscribeOnBackBtn();
    this.unsubscribeOnSaveSettings();
    this.settingsView.unbind();
  };

  backToView = () => {
    this.destroyListeners();
    Router.showWelcome();
  };
}

export default SettingsScreen;
