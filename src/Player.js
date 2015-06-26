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
    this.updateTask = setInterval(
        (function(self) {         //Self-executing func which takes 'this' as self
            return function() {   //Return a function in the context of 'self'
                self.update(self); //Thing you wanted to run as non-window 'this'
            }
        })(this),
        1000/2     //normal interval, 'this' scope not impacted here.
    );
};
Player.prototype.update = function(player) {
    if(player.ACKQueue.length > 0){

    }
    if(player.NACKQueue.length > 0){

    }
    if(player.packetQueue.packets.length > 0){
        player.packetQueue.sequencenumber++;
        player.packetQueue.encode();
        //console.log(player.packetQueue.bb);
        SocketInstance.sendPacket(player.packetQueue, player.ip, player.port);
        player.recoveryQueue[player.packetQueue.sequencenumber] = player.packetQueue.packets;
        player.packetQueue.packets = [];
    }
};
Player.prototype.handlePackets = function(e) {
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
        this.handlePacket(packets[i]);
    }
};
Player.prototype.handlePacket = function(pk){
    var pkid = pk.buffer.readByte();
    switch(pkid){
        case minecraft.CLIENT_CONNECT:
            var c = new ClientConnectPacket(pk.buffer.copy());
            c.decode();
            var reply = new ServerHandshakePacket(this.port, c.session);
            this.sendPacket(reply);
            break;
        default:
            console.log("Not implemented data packet " + pkid);
            break;
    }
};
Player.prototype.close = function (msg){
    if(msg !== null){
        this.sendMessage(msg);
    }
    var d = new Disconnect();
    console.log("Client disconnected.");
};
Player.prototype.sendPacket = function(pk){
    pk.encode();
    this.packetQueue.packets.push(pk);
};
