const fieldSize = 3;

export const indentCell = 15;

export const charactersType = {
    X: `X`,
    O: `O`
}


//TODO сделать  спрайт
export const templateIconX = `<svg x="0px" y="0px" 
            xmlns="http://www.w3.org/2000/svg"
            height="25"
            width="25"
            fill="#b9258f"
            viewBox="0 0 492 492">
            <path d="M300.188,246L484.14,62.04c5.06-5.064,7.852-11.82,7.86-19.024c0-7.208-2.792-13.972-7.86-19.028L468.02,7.872
                c-5.068-5.076-11.824-7.856-19.036-7.856c-7.2,0-13.956,2.78-19.024,7.856L246.008,191.82L62.048,7.872
                c-5.06-5.076-11.82-7.856-19.028-7.856c-7.2,0-13.96,2.78-19.02,7.856L7.872,23.988c-10.496,10.496-10.496,27.568,0,38.052
                L191.828,246L7.872,429.952c-5.064,5.072-7.852,11.828-7.852,19.032c0,7.204,2.788,13.96,7.852,19.028l16.124,16.116
                c5.06,5.072,11.824,7.856,19.02,7.856c7.208,0,13.968-2.784,19.028-7.856l183.96-183.952l183.952,183.952
                c5.068,5.072,11.824,7.856,19.024,7.856h0.008c7.204,0,13.96-2.784,19.028-7.856l16.12-16.116
                c5.06-5.064,7.852-11.824,7.852-19.028c0-7.204-2.792-13.96-7.852-19.028L300.188,246z"/>
        </svg>`;

export const templateIconO = `<svg x="0px" y="0px"
            xmlns="http://www.w3.org/2000/svg"
            height="25"
            width="25"
            class="zero"
            fill="#870eff"
            viewBox="0 0 380.734 380.734">
            <path d="M190.367,0C85.23,0,0,85.23,0,190.367s85.23,190.367,190.367,190.367s190.367-85.23,190.367-190.367
                S295.504,0,190.367,0z M299.002,298.36c-28.996,28.996-67.57,44.959-108.634,44.959S110.723,327.35,81.733,298.36
                c-28.865-28.876-44.769-67.227-44.769-107.993c0-40.771,15.904-79.128,44.769-107.993c28.99-28.996,67.57-44.959,108.634-44.959
                c41.054,0,79.639,15.969,108.629,44.959c28.871,28.865,44.763,67.221,44.763,107.993
                C343.765,231.133,327.867,269.489,299.002,298.36z"/>
            </svg>`;


const characters = [
    {
        name: `playerCharacter`,
        value: charactersType.X,
        selected: true,
        icon: templateIconX,
        class: `x`
    },
    {
        name: `playerCharacter`,
        value: charactersType.O,
        selected: false,
        icon: templateIconO,
        class: `zero`
    }
];

export const settingsOfflineGame = {
    fieldSize: fieldSize,
    settingsFields: [
        {
            type: `input`,
            label: `Выберите размер поля:`,
            name: `numberCellsInRow`,
            fieldType: `number`,
            attrs: `min="3" max="15"`,
            value: fieldSize,
        }
    ]
};

export const settingsOnlineGame = {
    character: `X`,
    fieldSize: fieldSize,
    settingsFields:[
        {
            type: `radio`,
            label: `Выберите символ:`,
            items: characters,
            name: `playerCharacter`,
            value: `X`
        },
        {
            type: `input`,
            label: `Выберите размер поля:`,
            name: `numberCellsInRow`,
            fieldType: `number`,
            attrs: `min="3" max="15"`,
            value: fieldSize,
        }
    ]
};

export const gameMode = {
    ONLINE: `online`,
    OFFLINE: `offline`
}

export const serverName = `ws://192.168.1.49:9000/`;

//export const serverName = `ws://192.168.2.100:9000/`;


export const messageType = {
    FIND_GAME: `FIND_GAME`,
    CREATE_GAME: `CREATE_GAME`,
    ACCEPT_OFFER: `ACCEPT_OFFER`,
    ACCEPT_ANSWER: `ACCEPT_ANSWER`,
    ICE_CANDIDATE: `ICE_CANDIDATE`,
    INIT_USER: `USER`,
    OFFER: `OFFER`,
    ANSWER: `ANSWER`,
    SETTINGS: `SETTINGS`,
    START: `START`,
    MOVE: `MOVE`
};


export const playerType = {
    INICIATOR: `iniciator`,
    RECIPIENT: `recipient`
};

export const socketGetParams = {
    CREATE_GAME: `createGame=true`,
    FIND_GAME: `findGame=true`
};