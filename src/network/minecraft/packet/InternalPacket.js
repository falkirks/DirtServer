InternalPacket = function(buf){
    buf.compact();
    this.id = buf.readByte();
    buf.reset();
    this.bb = buf;
}