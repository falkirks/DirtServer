Player = function (ip, port) {
    this.ip = ip;
    this.port = port;
    console.log("Player constructor called "+ ip)
}

Player.prototype.handlePacket = function(buf) {

};
