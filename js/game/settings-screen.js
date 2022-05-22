import {
    charactersType, 
    playerType,
    gameMode,
    serverName,
    socketGetParams,
    messageType
} from '../data/settings.js';
import {
    getObjectFromFormData, 
    getSettingsGameByMode,
    createMessage
} from '../helpers/helpers.js';
import SettingsView, {settingsViewEvents} from '../views/settings/settings-view.js';
import Router from '../router.js';
import WebSocketConnector from '../network/websocket.js';
import PeerConnector, {peerConnectorEvents} from '../network/peer-connector.js';

class SettingsScreen {
    #peerConnection = null;

    constructor(gameMode) {
        const settings = getSettingsGameByMode(gameMode);
        this.settingsView = new SettingsView(settings);
        this.settingsView.subscribe(settingsViewEvents.SAVE_SETTINGS, this.saveSettings)
    }

    get element() {
        return this.settingsView.element
    }

    onMessageDataChannel = (message) => {
        if(message.type === messageType.START) {
            this.showGame();
            this.unsubscribeMessageDataChannel();
        }
    }

    onOpenDataChannel = () => {
        // TODO создать функцию sendSettings
        const message = createMessage(messageType.SETTINGS, { gameSettings: this.gameSettings });
        this.#peerConnection.sendData(message);
        this.unsubscribeOpenDataChannel();
    }

    saveSettings = (settingsData) => {
        const playerSettings = Object.freeze(getObjectFromFormData(settingsData.formData));
        this.gameSettings = {
            player1Character: playerSettings.playerCharacter,
            player2Character: playerSettings.playerCharacter === charactersType.X ? charactersType.O : charactersType.X,
            numberCellsInRow: Number(playerSettings.numberCellsInRow),
            numbersLines: Number(playerSettings.numberCellsInRow) + 1,
            playerType: playerType.INICIATOR,
            mode: settingsData.gameMode
        };

        if(this.gameSettings.mode === gameMode.ONLINE) {
            // создаем P2P соединение затем отправляем настройки и запускаем игру
            this.settingsView.showCreateGameModal();
            this.socket = new WebSocketConnector();
            this.#peerConnection = new PeerConnector(this.socket, true);
            this.#peerConnection.create();
            this.socket.create(`${serverName}?${socketGetParams.CREATE_GAME}`);

            this.unsubscribeMessageDataChannel = this.#peerConnection.subscribe(peerConnectorEvents.MESSAGE_DATA_CHANNEL, this.onMessageDataChannel)
            this.unsubscribeOpenDataChannel =  this.#peerConnection.subscribe(peerConnectorEvents.OPEN_DATA_CHANNEL, this.onOpenDataChannel);
        } else {
            this.showGame();
        }
    }

    showGame = () => {
        this.settingsView.unbind();
        Router.showGame(this.gameSettings, this.#peerConnection);
    }

}

export default SettingsScreen;