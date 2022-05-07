import {settingsGameDefault, charactersType} from '../data/settings.js';
import {getObjectFromFormData, getIconPlayerTemplate} from '../helpers/helpers.js';
import Router from '../router.js';
import {gameMode, serverName, serverActions} from '../data/settings.js';
import WebSocketConnector from '../network/websocket.js';
import RTSConnector from '../network/rtc-connector.js';

class SettingsScreen {
    constructor(settingsView, settingsModel) {
        this.settingsModel = new settingsModel({...settingsGameDefault});
        this.settingsView = new settingsView(this.settingsModel._settings);
        this.settingsView.onSubmitForm = this.saveSettings.bind(this);
        this.onOpenWSConnection = this.onOpenWSConnection.bind(this);
        this.pendingLocalIceCondidateList = [];
    }

    get element() {
        return this.settingsView.element
    }

    saveSettings(formData, mode) {
        const userSettings = Object.freeze(getObjectFromFormData(formData));
        const settings = {
            player: {
                character: userSettings.playerCharacter,
                iconTemplate: getIconPlayerTemplate(userSettings.playerCharacter),
                playerName: userSettings.playerName
            },
            playerCharacter: userSettings.playerCharacter,
            playerIconTemplate: getIconPlayerTemplate(userSettings.playerCharacter),
            AIIconTemplate: getIconPlayerTemplate(userSettings.playerCharacter === charactersType.X ? charactersType.O : charactersType.X),
            numberCellsInRow: Number(userSettings.numberCellsInRow),
            numbersLines: Number(userSettings.numberCellsInRow) + 1,
        }
        this.settingsView.unbind();


        switch (mode) {
            case gameMode.CREATE_GAME:
                this.createGame(settings.player);
              break;
            default:
                Router.showGame(settings);
        }
    }

    onOpenWSConnection() {
        this.connection = new RTSConnector();
        this.connection.onSendIceCandidate = (candidate) => {
            this.pendingLocalIceCondidateList.push(candidate);
        };
        this.connection.createOffer().then((offer) => {
            this.ws.send({
                type: serverActions.OFFER,
                payload: {
                    iniciatorId: this.iniciatorId,
                    offer
                }
            });
        });

        this.ws.subscribe(`message`, (data) => {
            if(data.type === serverActions.USER) {
                this.iniciatorId = data.payload.clientId;
            }

            if(data.type === serverActions.ICE_CANDIDATE) {
                data.payload.iceCondidateList.forEach((candidate) => {
                    this.connection.addIceCandidate(candidate);
                });
                // setTimeout(() => {
                //     this.connection.sendData('123');
                // }, 1000);
                
            }

            if(data.type === serverActions.ANSWER) {
                this.recepientId = data.payload.recipientId;
  

                this.connection.acceptAnswer(data.payload.answer).then(() => {
                    this.ws.send({
                        type: serverActions.ICE_CANDIDATE,
                        payload: {
                            clientId: this.recepientId,
                            iceCondidateList: this.pendingLocalIceCondidateList
                        }
                    });
                });

            }
        });
    }

    createGame() {
        this.ws = new WebSocketConnector(`${serverName}?createGame=true`);
        this.ws.subscribe(`open`, this.onOpenWSConnection);
    }



}

export default SettingsScreen;