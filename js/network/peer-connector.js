import EventEmitter from '../utils/event-emmiter.js';
import {peerEvents, messageType} from '../data/settings.js';

class PeerConnector extends EventEmitter {
    #channel = null;
    #localIceCondidateList = [];
    #peerConnection = null;
    #iniciatorId = null;
    #recipientId = null;

    constructor(socket, isIniciator) {
        super();

        this.isIniciator = isIniciator;
        this.socket = socket;
        this.socket.subscribe(`message`, this.onSocketMessage);
    }

    get iniciatorId() {
        return this.#iniciatorId;
    }

    set iniciatorId(id) {
        this.#iniciatorId = id;
    }

    get recipientId() {
        return this.#recipientId;
    }

    set recipientId(id) {
        this.#recipientId = id;
    }

    create() {
        this.#peerConnection  = new RTCPeerConnection();
        this.#peerConnection.addEventListener(`datachannel`, this.onDataChannel);
        this.#peerConnection.addEventListener(`connectionstatechange`, this.onConnectionStateChange);
        this.#peerConnection.addEventListener(`icecandidate`, this.onIceCandidate);
        this.#peerConnection.addEventListener(`iceconnectionstatechange`, this.onIceConnectionStateChange);
    }

    get iceCandidateList() {
        return this.#localIceCondidateList;
    }

    addIceCandidate(candidate) {
        this.#peerConnection.addIceCandidate(candidate);
    }

    /* #region DataChannel */
    onDataChannel = (e) => {
        this.#channel = e.channel;
        // использую on т.к. onDataChannel вызывается у recipient`a
        this.#channel.onopen = this.onOpenDataChannel;
        this.#channel.onclose = this.onCloseDataChannel;
        this.#channel.onmessage = this.onMessageDataChannel;
        this.emit(peerEvents.DATA_CHANNEL, e);
    }

    onOpenDataChannel = () => {
        this.emit(peerEvents.OPEN_DATA_CHANNEL);
    }

    onCloseDataChannel = () => {
        this.#channel.send('Bay');
    }

    onMessageDataChannel = (e) => {
        try {
            const message = JSON.parse(e.data);
            this.emit(peerEvents.MESSAGE_DATA_CHANNEL, message);
        } catch(error) {
            throw new Error(error);
        }
    }

    sendData(data) {
        try {
            const message = JSON.stringify(data)
            this.#channel.send(message);
        } catch(error) {
            throw new Error(error);
        }
    }

    createDataChannel(name) {
        this.#channel = this.#peerConnection.createDataChannel(name);
        // использую on т.к. createDataChannel вызывается у iniciator`a
        this.#channel.onopen = this.onOpenDataChannel;
        this.#channel.onclose = this.onCloseDataChannel;
        this.#channel.onmessage = this.onMessageDataChannel;
    }
    /* #endregion */

    async createOffer() {
        this.createDataChannel(`gomoku`);
        const offer = await this.#peerConnection.createOffer();
        await this.#peerConnection.setLocalDescription(offer);
        return offer;
    }

    async createAnswer() {
        const answer = await this.#peerConnection.createAnswer();
        await this.#peerConnection.setLocalDescription(answer);
        return answer;
    }

    /* #region peer events */

    onConnectionStateChange = (e) => {
        if(this.#peerConnection.connectionState === `connected`) {
            this.socket.close();
        }
        this.emit(peerEvents.CONNECTION_STATE_CHANGE, this.#peerConnection.connectionState);
    }

    onIceConnectionStateChange = (e) => {
        this.emit(peerEvents.ICE_CONNECTION_STATE_CHANGE, this.#peerConnection.iceConnectionState);
    }
    
    onIceCandidate = async (event) => {
        if (event.candidate) {
            this.#localIceCondidateList.push(event.candidate);
          } else {
            this.sendIceCandidates();
        }
        this.emit(peerEvents.ICE_CONDIDATE, event.candidate);
    }

    sendIceCandidates() {
        this.socket.send({
            type: messageType.ICE_CANDIDATE,
            payload: {
                clientId: this.isIniciator ? this.recipientId : this.iniciatorId,
                iceCondidateList: this.#localIceCondidateList
            }
        });
    };

    /* #endregion */

    async acceptRemoteOffer(offer) {
        return await this.#peerConnection.setRemoteDescription(offer);
    }

    async acceptAnswer(answer) {
        return await this.#peerConnection.setRemoteDescription(answer)
    }

     onSocketMessage = async (message) => {

        if(message.type === messageType.INIT_USER) {
            const clientId = message.payload.clientId;

            if(this.isIniciator) {
                this.iniciatorId = clientId;
                const offer = await this.createOffer();
                this.socket.send({
                    type: messageType.OFFER,
                    payload: {
                        offer,
                        iniciatorId: this.iniciatorId
                    }
                });
            } else {
                this.recipientId = clientId;
            }
        }

        if(message.type === messageType.ICE_CANDIDATE) {
            message.payload.iceCondidateList.forEach((candidate) => {
                this.addIceCandidate(candidate);
            });
        }

        if(message.type === messageType.OFFER) {
            this.iniciatorId = message.payload.iniciatorId;
            this.acceptRemoteOffer(message.payload.offer).then(() => {
                this.createAnswer().then((answer) => {
                    this.socket.send({
                        type: messageType.ANSWER,
                        payload: {
                            iniciatorId: this.iniciatorId,
                            recipientId: this.recipientId,
                            answer
                        }
                    });
                })
            });
        }

        if(message.type === messageType.ANSWER) {
            this.recipientId = message.payload.recipientId;

            this.acceptAnswer(message.payload.answer).then(() => {
                this.sendIceCandidates();
            });
        }

        // this.emit(`message`, message);
    }
}

export default PeerConnector;