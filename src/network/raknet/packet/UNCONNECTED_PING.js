UNCONNECTED_PING = function(buf){
    this.bb = buf;
    this.bb.offset = 1;
}
UNCONNECTED_PING.prototype.decode = function(){
    this.pingID = this.bb.readLong();

    this.bb.flip();
}