import EventEmitter from '../utils/event-emmiter.js';

export const webSocketEvents = {
  OPEN: `open`,
  CLOSE: `close`,
  MESSAGE: `message`,
  ERROR: `error`,
};

class WebSocketConnector extends EventEmitter {
  constructor() {
    super();
  }

  create(server) {
    this.socket = new WebSocket(server);
    this.socket.onopen = this.onOpen;
    this.socket.onmessage = this.onMessage;
    this.socket.onclose = this.onClose;
    this.socket.onerror = this.onError;
  }

  close(isClear) {
    this.socket.close();
    this.emit(webSocketEvents.CLOSE, isClear);
  }

  send(data) {
    this.socket.send(JSON.stringify(data));
  }

  onOpen = (e) => {
    this.emit(webSocketEvents.OPEN, e);
  };

  onMessage = (event) => {
    const data = JSON.parse(event.data);
    this.emit(webSocketEvents.MESSAGE, data);
  };

  onClose = (event) => {
    // if (event.wasClean) {
    //   alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
    // } else {
    //   // например, сервер убил процесс или сеть недоступна
    //   // обычно в этом случае event.code 1006
    //   alert('[close] Соединение прервано');
    // }
    this.emit(webSocketEvents.CLOSE, event);
  };

  onError = (error) => {
    alert(`[error] ${error.message}`);
    this.emit(webSocketEvents.ERROR, error);
  };
}

export default WebSocketConnector;
