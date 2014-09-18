Player = function (ip, port) {
    this.ip = ip;
    this.port = port;
    this.ACKQueue = [];
    this.NACKQueue = [];
    this.recoveryQueue = {};
    this.packetQueue = new ByteBuffer();
    this.sequencenumber = 0;
    this.updateTask = setInterval(this.update, 1000/2, this); //Update every 1/2 second
}
Player.prototype.update = function(player) {
    //console.log(player.ACKQueue);
};
Player.prototype.handlePacket = function(packets) {
    packets.forEach(function(packet){
        switch(packet.id){
            case minecraft.CLIENT_CONNECT:
                var c = new ClientConnectPacket(packet.bb);
                c.decode();

                break;
        }
    });
};
Player.prototype.close = function (msg){
    if(msg !== null){
        this.sendMessage(msg);
    }
    var d = new Disconnect();
    d.encode();
    console.log("Client disconnected.");
    this.sendPacket(d);
}
Player.prototype.sendMessage = function(msg){
    //TODO
}
Player.prototype.sendPacket = function(pk){
    SocketHandler.sendPacket(pk, this.port, this.ip);
}
