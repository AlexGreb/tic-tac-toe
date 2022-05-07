import EventEmitter from '../utils/dom/event-emmiter.js';

class WebSocketConnector extends EventEmitter {
    constructor(server) {
        super();
        this.socket = new WebSocket(server);
        this.onOpen = this.onOpen.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessage;
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }

    send(data) {
        this.socket.send(JSON.stringify(data));
    }

    onOpen(e) {
        alert("[open] Соединение установлено");
        alert("Отправляем данные на сервер");
        // this.socket.send("Меня зовут Джон");
        this.emit(`open`, e); // в константу
    }

    onMessage(event) {
        const data = JSON.parse(event.data);
        this.emit(`message`, data); // в константу
    }

    onClose = function(event) {
        if (event.wasClean) {
          alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
        } else {
          // например, сервер убил процесс или сеть недоступна
          // обычно в этом случае event.code 1006
          alert('[close] Соединение прервано');
        }
        this.emit(`close`, event); // в константу
    };
      
    onError(error) {
        alert(`[error] ${error.message}`);
        this.emit(`error`, error); // в константу

    };

}

export default WebSocketConnector;