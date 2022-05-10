import Router from '../router.js';
import PeerConnector from '../network/peer-connector.js';
// import WebSocketConnector from '../network/websocket.js';
// import {serverName, messageType, gameMode} from '../data/settings.js';
import {gameMode} from '../data/settings.js';

class WelcomeScreen {
    // #peerConnection = null;

    constructor(welcomeView) {
        this.welcomeView = new welcomeView();
        this.welcomeView.onBtnStart = this.startGame;
        this.welcomeView.onFindGame = this.onFindGame;

        // this.#peerConnection = new PeerConnector();
    };

    get element() {
        return this.welcomeView.element;
    }

    startGame = () => {
        this.welcomeView.unbind();
        Router.showSettings();
    }

    onFindGame = () => {
        Router.showGame({
            gameMode: gameMode.NETWORK
        })

        // this.ws = new WebSocketConnector(`${serverName}?findGame=true`);

        // this.ws.subscribe(`message`, (data) => {
        //     if(data.type === messageType.INIT_USER) {
        //         this.recipientId = data.payload.clientId;
        //     }

        //     if(data.type === messageType.ICE_CANDIDATE) {
        //         data.payload.iceCondidateList.forEach((candidate) => {
        //             this.#peerConnection.addIceCandidate(candidate);
        //         });

        //         this.ws.send({
        //             type: messageType.ICE_CANDIDATE,
        //             payload: {
        //                 clientId: this.iniciatorId,
        //                 iceCondidateList: this.#peerConnection.iceCandidateList
        //             }
        //         });
        //     }

        //     if(data.type === messageType.OFFER) {
        //         this.iniciatorId = data.payload.iniciatorId;
        //         this.#peerConnection.acceptRemoteOffer(data.payload.offer).then(() => {
        //             this.#peerConnection.createAnswer().then((answer) => {
        //                 this.ws.send({
        //                     type: messageType.ANSWER,
        //                     payload: {
        //                         iniciatorId: this.iniciatorId,
        //                         recipientId: this.recipientId,
        //                         answer
        //                     }
        //                 });
        //             })
        //         });
        //     }
        // });
    }
}

export default WelcomeScreen;