import EventEmitter from '../utils/event-emmiter.js';

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

    close(clientId) {
        this.socket.close();
    }

    send(data) {
        this.socket.send(JSON.stringify(data));
    }

    onOpen = (e) => {
        this.emit(`open`, e); // в константу
    }

    onMessage = (event) => {
        const data = JSON.parse(event.data);
        this.emit(`message`, data); // в константу
    }

    onClose = (event) => {
        if (event.wasClean) {
          alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
        } else {
          // например, сервер убил процесс или сеть недоступна
          // обычно в этом случае event.code 1006
          alert('[close] Соединение прервано');
        }
        this.emit(`close`, event); // в константу
    };
      
    onError = (error) => {
        alert(`[error] ${error.message}`);
        this.emit(`error`, error); // в константу

    };

}

export default WebSocketConnector;