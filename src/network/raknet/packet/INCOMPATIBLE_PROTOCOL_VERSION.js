INCOMPATIBLE_PROTOCOL_VERSION = function(){
    this.bb = new ByteBuffer();
    this.bb.buffer[0] = raknet.INCOMPATIBLE_PROTOCOL_VERSION;
    this.bb.offset = 1;
}
INCOMPATIBLE_PROTOCOL_VERSION.prototype.encode = function(){
    this.bb.
        writeByte(raknet.STRUCTURE).
        append(raknet.MAGIC, "hex").
        writeLong(raknet.SERVER_ID).
        flip().
        compact();
}