OPEN_CONNECTION_REPLY_2 = function(port, mtusize){
    this.bb = new ByteBuffer();
    this.mtusize = mtusize;
    this.port = port;
    this.bb.buffer[0] = raknet.OPEN_CONNECTION_REPLY_2;
    this.bb.offset = 1;
}
OPEN_CONNECTION_REPLY_2.prototype.encode = function(){
    this.bb.
        append(raknet.MAGIC, "hex").
        writeLong(raknet.SERVER_ID).
        writeShort(this.port).
        writeShort(this.mtusize).
        writeByte(0).
        flip().
        compact();
}