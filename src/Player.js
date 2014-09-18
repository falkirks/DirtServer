Player = function (ip, port, mtuSize) {
    this.ip = ip;
    this.port = port;
    this.ACKQueue = [];
    this.NACKQueue = [];
    this.recoveryQueue = {};
    this.packetQueue = new EncapsulatedPacket([]);
    this.mtuSize = mtuSize;
    this.sequencenumber = 0;
    this.lastSequenceNumber = 0;
    this.updateTask = setInterval(this.update, 1000/2, this); //Update every 1/2 second
}
Player.prototype.update = function(player) {
    if(player.ACKQueue.length > 0){

    }
    if(player.NACKQueue.length > 0){

    }
    if(player.packetQueue.packets.length > 0){
        player.packetQueue.sequencenumber++;
        player.packetQueue.encode();
        console.log(player.port);
        SocketInstance.sendPacket(player.packetQueue, player.ip, player.port);
        player.recoveryQueue[player.packetQueue.sequencenumber] = player.packetQueue.packets;
        player.packetQueue.packets = [];
    }
};
Player.prototype.handlePacket = function(e) {
    var packets = e.packets;
    if(e.sequencenumber - this.lastSequenceNumber == 1){
        this.lastSequenceNumber = e.sequencenumber;
        console.log("Correct sequence.");
    }
    else{
        for(var i = this.lastSequenceNumber; i < e.sequencenumber; i++){
            this.NACKQueue.push(i);
        }
    }
    for(var i = 0; i < packets.length; i++){
        switch(packets[i].id){
            case minecraft.CLIENT_CONNECT:
                var c = new ClientConnectPacket(packets[i].bb);
                c.decode();
                var pk = new ServerHandshakePacket(this.port, c.session);
                this.sendPacket(pk);
                break;
            default:
                console.log("Not implemented data packet " + packets[i].id);
                break;
        }
    }
};
Player.prototype.close = function (msg){
    if(msg !== null){
        this.sendMessage(msg);
    }
    var d = new Disconnect();
    console.log("Client disconnected.");
}
Player.prototype.sendPacket = function(pk){
    pk.encode();
    this.packetQueue.packets.push(pk);
}
