import {
    playerType,
    socketGetParams,
    peerConnectorEvents
} from '../data/settings';
import WebSocketConnector from './websocket';
import PeerConnector from './peer-connector';
import EventEmitter from '../utils/event-emmiter';

export default class PeerConnectionCreator extends EventEmitter {
    #peerConnection = null;

    constructor(roleConnection) {
        // создаем P2P соединение затем получаем настройки и запускаем игру
        this.isIniciator = roleConnection === playerType.INICIATOR;
        this.socket = new WebSocketConnector();
        this.#peerConnection = new PeerConnector(this.socket, this.isIniciator);
        this.#peerConnection.create();
        const socketParam = this.isIniciator ? socketGetParams.CREATE_GAME : socketGetParams.FIND_GAME;
        this.socket.create(`${serverName}?${socketParam}`);

        this.unSubscribeOpenDataChannel = this.#peerConnection.subscribe(peerConnectorEvents.OPEN_DATA_CHANNEL, this.onOpenDataChannel);
        this.#peerConnection.subscribe(peerConnectorEvents.MESSAGE_DATA_CHANNEL, this.onMessageDataChannel);
    }

    onOpenDataChannel = () => {
        if(this.isIniciator) {
            const message = createMessage(messageType.SETTINGS, { gameSettings: this.gameSettings });
            this.#peerConnection.sendData(message);
        }
    }

    onMessageDataChannel = (message) => {
       this.emit(peerConnectorEvents.MESSAGE_DATA_CHANNEL, message);
    }
}