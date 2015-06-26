UNCONNECTED_PONG = function(pingID){
    this.name = "MCPE;Falky Town;27;0.11.0;0;9999";
    this.bb = new ByteBuffer();
    this.pingID = pingID;
    this.bb.buffer[0] = raknet.UNCONNECTED_PONG;
    this.bb.offset = 1;
};
UNCONNECTED_PONG.prototype.encode = function(){
    this.bb.
        writeLong(this.pingID).
        writeLong(raknet.SERVER_ID).
        append(raknet.MAGIC, "hex").
        writeShort(this.name.length).
        writeString(this.name).
        flip().
        compact();
};