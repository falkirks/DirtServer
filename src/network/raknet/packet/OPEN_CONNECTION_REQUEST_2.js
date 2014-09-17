OPEN_CONNECTION_REQUEST_2 = function(buf){
    this.bb = buf;
    this.bb.offset = 22; //Because magic and server security
}
OPEN_CONNECTION_REQUEST_2.prototype.decode = function(){
    this.port = this.bb.readShort();
    this.mtusize = this.bb.readShort();
    this.cid = this.bb.readLong();
}