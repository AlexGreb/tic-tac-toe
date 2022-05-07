import EventEmitter from '../utils/event-emmiter.js';
import {rtcEvents} from '../data/settings.js';

class RTSConnector extends EventEmitter {
    #channel = null;
    #localIceCondidateList = [];
    #peerConnection = null;


    onOpenDataChannel = () => {
        this.#channel.send('Hi you!');
    }

    onCloseDataChannel = () => {
        this.#channel.send('Bay');
    }

    onMessageDataChannel = (e) => {
        alert(e.data)
    }

    constructor() {
        super();
        this.#peerConnection  = new RTCPeerConnection();
        this.#peerConnection.addEventListener(`datachannel`, this.onDataChannel);
        this.#peerConnection.addEventListener(`connectionstatechange`, this.onConnectionStateChange);
        this.#peerConnection.addEventListener(`icecandidate`, this.onIceCandidate);
        this.#peerConnection.addEventListener(`iceconnectionstatechange`, this.onIceConnectionStateChange);
    }

    get iceCandidateList() {
        return this.#localIceCondidateList;
    }

    onIceCandidate = async (event) => {
        if (event.candidate) {
            this.#localIceCondidateList.push(event.candidate);
          } else {
            console.log('No more candidates', 'gray');
        }
        this.emit(rtcEvents.ICE_CONDIDATE, event.candidate);
    }


    onOpenDataChannel = () => {
        this.#channel.send('Hi you!');
    }

    onCloseDataChannel = () => {
        this.#channel.send('Bay');
    }

    onMessageDataChannel = (e) => {
        alert(e.data)
    }

    createDataChannel(name) {
        this.#channel = this.#peerConnection.createDataChannel(name);
        this.#channel.onopen = this.onOpenDataChannel;
        this.#channel.onclose = this.onCloseDataChannel;
        this.#channel.addEventListener(`message`, this.onMessageDataChannel);
    }

    async createOffer() {
        this.createDataChannel(`gomoku`);
        const offer = await this.#peerConnection.createOffer();
        await this.#peerConnection.setLocalDescription(offer);
        return offer;
    }

    async createAnswer() {
        this.#peerConnection.addEventListener(`icecandidate`, (event) => {

          // console.log('onicecandidate', event)
          if (!event.candidate) {
            // console.log(JSON.stringify(this.connection.localDescription));
          }
        })

        const answer = await this.#peerConnection.createAnswer();
        await this.#peerConnection.setLocalDescription(answer);
        return answer;
    }


    onDataChannel = (e) => {
        this.#channel = e.channel;
        this.#channel.onmessage = this.onMessage;

        this.emit(rtcEvents.DATA_CHANNEL, e);
    }

    onConnectionStateChange = (e) => {
        this.emit(rtcEvents.CONNECTION_STATE_CHANGE, this.#peerConnection.connectionState);
    }

    onMessage = (e) => {
        alert(e.data)
    }

    onIceConnectionStateChange = (e) => {
        this.emit(rtcEvents.ICE_CONNECTION_STATE_CHANGE, this.#peerConnection.iceConnectionState);
    }

    async acceptRemoteOffer(offer) {
        return await this.#peerConnection.setRemoteDescription(offer);
    }

    async acceptAnswer(answer) {
        return await this.#peerConnection.setRemoteDescription(answer)
    }

    async sendData(data) {
        this.#channel.send(data);
    }

    addIceCandidate(candidate) {
        this.#peerConnection.addIceCandidate(candidate);
    }
}

export default RTSConnector;