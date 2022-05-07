import {serverActions} from './js/data/settings.js';
import WebSocket from 'ws';

const wsServer = new WebSocket.Server({port: 9000});
wsServer.on('connection', onConnect);
const wsClients = new Map();
const connectionClients = new Map();
let countId = 1;


function onConnect(wsClient, req) {
    const baseURL = req.protocol + '://' + req.headers.host + '/';
    const reqUrl = new URL(req.url, baseURL);
    const searchParams = reqUrl.searchParams;
    const client = {
        clientId: countId,
        client: wsClient
    };

    if(searchParams.get(`createGame`) === `true`) {
        client.status = `createGame`;
        wsClients.set(countId, client);
    }
    
    if(searchParams.get(`findGame`) === `true`) {
        client.status = `findGame`;
        wsClients.set(countId, client);
    }

    countId++;

    wsClient.send(JSON.stringify({
        type: serverActions.USER,
        payload: {
            clientId: client.clientId
        }
    }))

    wsClient.on('message', (message) => {
        const reqMessage = JSON.parse(message);
        try {
            switch (reqMessage.type) {
                case serverActions.OFFER:
                    createGame(reqMessage.payload.offer, reqMessage.payload.iniciatorId);
                  break;
    
                case serverActions.FIND_GAME:
                    findGame();
                  break;
    
                case serverActions.ANSWER:
                    {
                        const {client} = wsClients.get(reqMessage.payload.iniciatorId);
                        if(client) {
                            client.send(JSON.stringify({
                                type: serverActions.ANSWER,
                                payload: {
                                    recipientId: reqMessage.payload.recipientId,
                                    answer: reqMessage.payload.answer
                                }
                            }))
                        }
                    }
                  break;

                case serverActions.ICE_CANDIDATE:
                    {
                        const {client} = wsClients.get(reqMessage.payload.clientId);

                        client.send(JSON.stringify({
                            type: serverActions.ICE_CANDIDATE,
                            payload: reqMessage.payload
                        }))
                    }
                break;


    
                // default:
                //     // findPlayer();
                //     // Router.showGame(settings);
            }
          } catch (error) {
            console.log('Ошибка', error);
          }
    });
    wsClient.on('close', (e) => {
        console.log('Пользователь отключился');
        wsClients.delete(wsClient);
        connectionClients.delete(wsClient);
    });
};

function createGame(offer, clientId) {
    if(wsClients.size > 0) {
        for(let [key, value] of wsClients) {
            if(value.status === `findGame`) {
                const {client} =  wsClients.get(key);
                if(client) {
                    client.send(JSON.stringify({
                        type: serverActions.OFFER,
                        payload: {
                            iniciatorId: clientId,
                            offer
                        }
                    }));

                    connectionClients.set(key, {
                        status: `inGame`,
                        client: client
                    });

                    wsClients.set(key, {
                        status: `inGame`,
                        client: client
                    });
                }
            }
            break;
        }
    }
};

function findGame() {
    if(wsClients.size > 0) {
        for(let [key, value] of wsClients) {
            if(value.status === `createGame`) {
                const {client} = wsClients.get(key);

                client.send(`ответ на приглашение`);
                wsClients.set(key, {
                    status: `inGame`,
                    client
                });
            }
            break;
        }
    }
}



console.log('Сервер запущен на 9000 порту');
