Player = function (ip, port) {
    this.ip = ip;
    this.port = port;
    console.log("Player constructor called "+ ip)
}

Player.prototype.handlePacket = function(buf) {
    console.log(buf.toDebug());
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
    SocketHandler.server.send(pk.bb.buffer, 0, pk.bb.buffer.length, this.port, this.ip);
}
