import WebSocketConnector, { webSocketEvents } from '../../network/websocket.js';
import PeerConnector, { peerConnectorEvents } from '../../network/peer-connector.js';
import { serverName, socketGetParams } from '../../data/settings.js';

class ConnectionService {
  #peerConnection = null;
  #socket = null;

  constructor(isInitiator = false, socketParams = socketGetParams.FIND_GAME) {
    this.#socket = new WebSocketConnector();
    this.#peerConnection = new PeerConnector(this.#socket, isInitiator);
    this.socketParams = socketParams;
  }

  get peerConnection() {
    return this.#peerConnection;
  }

  get peerConnectorEvents() {
    return peerConnectorEvents;
  }

  get webSocketEvents() {
    return webSocketEvents;
  }

  sendMessage(message) {
    this.#peerConnection.sendData(message);
  }

  subscribeMessageServer(eventName, callback) {
    return this.#peerConnection.subscribe(eventName, callback);
  }

  subscribeServer(eventName, callback) {
    return this.#peerConnection.subscribe(eventName, callback);
  }

  createConnection() {
    this.peerConnection.create();
    this.#socket.create(`${serverName}?${this.socketParams}`);
  }

  closeConnect() {
    this.#socket.close();
    this.#peerConnection.close();
  }
}

export { ConnectionService };
