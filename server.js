import { messageType } from './js/data/settings.js';
import WebSocket from 'ws';

const wsServer = new WebSocket.Server({ port: 9000 });
wsServer.on('connection', onConnect);
const wsClients = new Map();
let countId = 1;

function onConnect(wsClient, req) {
  const clientId = countId;
  const baseURL = req.protocol + '://' + req.headers.host + '/';
  const reqUrl = new URL(req.url, baseURL);
  const searchParams = reqUrl.searchParams;
  const client = {
    clientId,
    client: wsClient,
  };

  if (searchParams.get(`createGame`) === `true`) {
    client.status = `createGame`;
    wsClients.set(countId, client);
  }

  if (searchParams.get(`findGame`) === `true`) {
    client.status = `findGame`;
    wsClients.set(countId, client);
  }

  countId++;

  wsClient.send(
    JSON.stringify({
      type: messageType.INIT_USER,
      payload: {
        clientId: client.clientId,
      },
    })
  );

  wsClient.on('message', (message) => {
    const reqMessage = JSON.parse(message);
    try {
      switch (reqMessage.type) {
        case messageType.OFFER:
          {
            const client = wsClients.get(clientId);
            client.offer = reqMessage.payload.offer;
            createGame(reqMessage.payload.offer, reqMessage.payload.initiatorId);
          }
          break;

        case messageType.FIND_GAME:
          findGame(wsClient);
          break;

        case messageType.ANSWER:
          {
            const { client } = wsClients.get(reqMessage.payload.initiatorId);
            if (client) {
              client.send(
                JSON.stringify({
                  type: messageType.ANSWER,
                  payload: {
                    recipientId: reqMessage.payload.recipientId,
                    answer: reqMessage.payload.answer,
                  },
                })
              );
            }
          }
          break;

        case messageType.ICE_CANDIDATE:
          {
            const { client } = wsClients.get(reqMessage.payload.clientId);

            client.send(
              JSON.stringify({
                type: messageType.ICE_CANDIDATE,
                payload: reqMessage.payload,
              })
            );
          }
          break;
      }
    } catch (error) {
      console.log('Ошибка', error);
    }
  });
  wsClient.on('close', () => {
    for (let [id, clientData] of wsClients) {
      if (clientData.client === wsClient) {
        wsClients.delete(id);
        break;
      }
    }
  });
}

function createGame(offer, clientId) {
  if (wsClients.size > 0) {
    for (let [key, value] of wsClients) {
      if (value.status === `findGame`) {
        const { client } = wsClients.get(key);
        if (client) {
          client.send(
            JSON.stringify({
              type: messageType.OFFER,
              payload: {
                initiatorId: clientId,
                offer,
              },
            })
          );

          wsClients.set(key, {
            status: `inGame`,
            client: client,
          });
        }
      }
      break;
    }
  }
}

function findGame(searchingClient) {
  if (wsClients.size > 0) {
    for (let [key, value] of wsClients) {
      if (value.status === `createGame`) {
        const wsClient = wsClients.get(key);

        // если есть созданная игра отправляем реципиенту offer
        if (searchingClient) {
          searchingClient.send(
            JSON.stringify({
              type: messageType.OFFER,
              payload: {
                initiatorId: key,
                offer: wsClient.offer,
              },
            })
          );
        }
        wsClient.status = `inGame`;

        // wsClients.set(key, {
        //     status: `inGame`,
        //     client
        // });
      }
      break;
    }
  }
}

console.log('Сервер запущен на 9000 порту');
