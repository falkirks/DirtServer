Disconnect = function(){
    this.bb = new ByteBuffer();
    this.bb.buffer[0] = minecraft.DISCONNECT;
    this.bb.offset = 1;
}
Disconnect.prototype.encode = function(){
    this.bb.flip().compact();
}