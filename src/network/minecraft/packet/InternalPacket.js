InternalPacket = function(buf, sequencenumber){
    buf.compact();
    this.id = buf.readByte();
    buf.reset();
    this.bb = buf;
    this.sequencenumber = sequencenumber;
}