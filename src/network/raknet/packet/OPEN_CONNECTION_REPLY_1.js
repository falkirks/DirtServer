OPEN_CONNECTION_REPLY_1 = function(mtusize){
    this.bb = new ByteBuffer();
    this.mtusize = mtusize;
    this.bb.buffer[0] = raknet.OPEN_CONNECTION_REPLY_1;
    this.bb.offset = 1;
}
OPEN_CONNECTION_REPLY_1.prototype.encode = function(){
    this.bb.
        append(raknet.MAGIC, "hex").
        writeLong(raknet.SERVER_ID).
        writeByte(0).
        writeShort(this.mtusize).
        flip().
        compact();
}