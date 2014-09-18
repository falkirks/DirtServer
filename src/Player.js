Player = function (ip, port) {
    this.ip = ip;
    this.port = port;
}

Player.prototype.handlePacket = function(buf) {
    console.log(buf.packets[0].toDebug());
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
