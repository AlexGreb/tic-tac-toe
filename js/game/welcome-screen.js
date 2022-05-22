import Router from '../router.js';
import WelcomeView, {welcomeViewEvents} from '../views/welcome/welcome-view.js';
import {
    gameMode,
    socketGetParams,
    messageType,
    serverName
} from '../data/settings.js';
import {createMessage} from '../helpers/helpers.js';
import WebSocketConnector from '../network/websocket.js';
import PeerConnector, {peerConnectorEvents} from '../network/peer-connector.js';

class WelcomeScreen {
    #peerConnection = null;
    #socket = null;

    constructor() {
        this.welcomeView = new WelcomeView();
        this.welcomeView.subscribe(welcomeViewEvents.START_GAME, this.startOfflineGame);
        this.welcomeView.subscribe(welcomeViewEvents.FIND_GAME, this.findOnlineGame);
        this.welcomeView.subscribe(welcomeViewEvents.CREATE_GAME, this.createOnlineGame);
    };

    get element() {
        return this.welcomeView.element;
    }

    onMessageDataChannel = (message) => {
        if(message.type === messageType.SETTINGS) {
            this.gameSettings = message.payload.gameSettings;
            this.#peerConnection.sendData(createMessage(messageType.START));
        }

        if(message.type === messageType.START) {
            this.unsubscribeMessageDataChannel();
            this.welcomeView.unbind();
            Router.showGame(this.gameSettings, this.#peerConnection);
        }
     }

    startOfflineGame = () => {
        Router.showGameSettings(gameMode.OFFLINE);
    }

    createConnection = () => {
        // TODO вынести куда то так используется в settings-screen
        // создаем P2P соединение затем получаем настройки и запускаем игру
        this.#socket = new WebSocketConnector();
        this.#peerConnection = new PeerConnector(this.#socket, false);
        this.#peerConnection.create();
        this.#socket.create(`${serverName}?${socketGetParams.FIND_GAME}`);
        this.unsubscribeMessageDataChannel = this.#peerConnection.subscribe(peerConnectorEvents.MESSAGE_DATA_CHANNEL, this.onMessageDataChannel);
    }

    findOnlineGame = () => {
        this.welcomeView.showFindGameModal();
        this.createConnection();
    }

    createOnlineGame = () => {
        this.welcomeView.unbind();
        Router.showGameSettings(gameMode.ONLINE);
    }
}

export default WelcomeScreen;