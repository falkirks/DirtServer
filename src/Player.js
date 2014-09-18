Player = function (ip, port) {
    this.ip = ip;
    this.port = port;
    this.ACKQueue = [];
    this.NACKQueue = [];
    this.recoveryQueue = {};
    this.packetQueue = new EncapsulatedPacket([]);
    this.sequencenumber = 0;
    this.updateTask = setInterval(this.update, 1000/2, this); //Update every 1/2 second
}
Player.prototype.update = function(player) {
    console.log(player.packetQueue);
};
Player.prototype.handlePacket = function(packets) {
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
    this.packetQueue.sequencenumber++;
    pk.encode();
    this.packetQueue.packets.push(pk);
    this.packetQueue.encode();
    //SocketHandler.sendPacket(pk, this.port, this.ip);
}
