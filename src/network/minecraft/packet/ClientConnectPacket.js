ClientConnectPacket = function(buf){
    this.bb = buf;
    this.bb.skip(1);
};
ClientConnectPacket.prototype.decode = function(){
    this.cid = this.bb.readLong();
    this.session = this.bb.readLong();
    this.unknown = this.bb.readByte();
};