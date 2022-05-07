import Router from '../router.js';
import RTSConnector from '../network/rtc-connector.js';
import WebSocketConnector from '../network/websocket.js';
import {serverName, serverActions} from '../data/settings.js';

class WelcomeScreen {
    constructor(welcomeView) {
        this.welcomeView = new welcomeView();
        this.welcomeView.onBtnStart = this.startGame.bind(this);
        this.welcomeView.onFindGame = this.onFindGame.bind(this);

        this.connection = new RTSConnector();
    };

    get element() {
        return this.welcomeView.element;
    }

    startGame() {
        this.welcomeView.unbind();
        Router.showSettings();
    }

    onFindGame() {
        this.ws = new WebSocketConnector(`${serverName}?findGame=true`);

        this.ws.subscribe(`message`, (data) => {
            if(data.type === serverActions.USER) {
                this.recipientId = data.payload.clientId;
            }

            if(data.type === serverActions.ICE_CANDIDATE) {
                data.payload.iceCondidateList.forEach((candidate) => {
                    this.connection.addIceCandidate(candidate);
                });

                this.ws.send({
                    type: serverActions.ICE_CANDIDATE,
                    payload: {
                        clientId: this.iniciatorId,
                        iceCondidateList: this.connection.iceCandidateList
                    }
                });
            }

            if(data.type === serverActions.OFFER) {
                this.iniciatorId = data.payload.iniciatorId;
                this.connection.acceptRemoteOffer(data.payload.offer).then(() => {
                    this.connection.createAnswer().then((answer) => {
                        this.ws.send({
                            type: serverActions.ANSWER,
                            payload: {
                                iniciatorId: this.iniciatorId,
                                recipientId: this.recipientId,
                                answer
                            }
                        });
                    })
                });
            }
        });
    }


    createOffer() {
        this.connection.createOffer()
            .then((offer) => {
                this.welcomeView.showOffer(JSON.stringify(offer));
            });
    }

    acceptOffer(offer) {
        this.connection.acceptRemoteOffer(offer);
    }

    createAnswer() {
        this.connection.createAnswer()
            .then((answer) => {
                this.welcomeView.showAnswer(JSON.stringify(answer));
            });
    }

    onSentData(data) {
        this.connection.sendData(data);
    }
}

export default WelcomeScreen;