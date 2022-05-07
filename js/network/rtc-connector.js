class RTSConnector {
    #channel = null;

    constructor() {
        // { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
        // { 
        //     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        //     iceTransportPolicy: 'all',
        //     ceCandidatePoolSize: '0'
        // }
        this.connection = new RTCPeerConnection();

        this.onIceCandidate = this.onIceCandidate.bind(this);
        this.onDataChannel = this.onDataChannel.bind(this);
        this.onConnectionStateChange = this.onConnectionStateChange.bind(this);
        this.onIceConnectionStateChange = this.onIceConnectionStateChange.bind(this);


        this.connection.addEventListener(`datachannel`, this.onDataChannel);
        this.connection.addEventListener(`connectionstatechange`, this.onConnectionStateChange);
        this.connection.addEventListener(`icecandidate`, this.onIceCandidate);
        this.connection.addEventListener(`iceconnectionstatechange`, this.onIceConnectionStateChange);

        this.onMessage = this.onMessage.bind(this);
        this.onOpenChannel = this.onOpenChannel.bind(this);
        this.onCloseChannel = this.onCloseChannel.bind(this);

    }

    onAddStrem() {
        console.log("pc_onaddstream()");
    }

    async onIceCandidate(event) {
        if (event.candidate) {
            console.log('Send my ICE-candidate: ' + event.candidate.candidate, 'gray');
            this.sendIceCandidate(event.candidate);
          } else {
            console.log('No more candidates', 'gray');
        }

    }

    sendIceCandidate(candidate){
        this.onSendIceCandidate(candidate);
    };

    onOpenChannel() {
        this.#channel.send('Hi you!');
    }

    onCloseChannel() {
        this.#channel.send('Hi you!');
    }

    async createOffer() {
        this.#channel = this.connection.createDataChannel(`gomoku`);

        this.onOpenChannel = this.onOpenChannel.bind(this);
        this.onCloseChannel = this.onCloseChannel.bind(this);

        this.#channel.onopen = this.onOpenChannel;
        this.#channel.onclose = this.onCloseChannel;

        this.#channel.addEventListener(`message`, (e) => {
            alert(e.data)
        });

        const offer = await this.connection.createOffer();
        await this.connection.setLocalDescription(offer);
        return offer;

        // Когда дальняя сторона пришлет свой Answer SDP, его нужно будет задать методом setRemoteDescription 
        // Пока вторая сторона не реализована, ничего не делаем
        // pc2_receivedOffer(desc);
    }

    async createAnswer() {
        this.connection.addEventListener(`icecandidate`, (event) => {

          // console.log('onicecandidate', event)
          if (!event.candidate) {
            // console.log(JSON.stringify(this.connection.localDescription));
          }
        })

        const answer = await this.connection.createAnswer();
        await this.connection.setLocalDescription(answer);
        return answer;
    }


    onDataChannel(e) {
        // console.log(e);
        this.#channel = e.channel;
        // channel.onopen = event => console.log('onopen', event);
        // channel.onmessage = event => console.log('onmessage', event);

        this.#channel.onmessage = this.onMessage;
    }

    onConnectionStateChange(e) {
        console.log(this.connection.connectionState);
    }

    onMessage(e) {
        alert(e.data)
    }

    onIceConnectionStateChange(e) {
        console.log(this.connection.iceConnectionState)
    }

    async acceptRemoteOffer(offer) {
        console.log(`accept offer`);
        return await this.connection.setRemoteDescription(offer);
    }

    async acceptAnswer(answer) {
        // const answer = JSON.parse(document.getElementById('remoteAnswer').value)
        console.log(`accept answer`);
        return await this.connection.setRemoteDescription(answer)
    }

    async sendData(data) {
        // const text = document.getElementById('text').value

        this.#channel.send(data);
    }

    addIceCandidate(candidate) {
        this.connection.addIceCandidate(candidate);
    }

}

export default RTSConnector;