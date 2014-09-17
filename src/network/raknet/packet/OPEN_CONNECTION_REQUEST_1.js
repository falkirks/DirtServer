OPEN_CONNECTION_REQUEST_1 = function(buf){
    this.bb = buf;
    this.bb.offset = 17; //Because magic
}
OPEN_CONNECTION_REQUEST_1.prototype.decode = function(){
    this.protocol = this.bb.readByte();
    this.mtusize = this.bb.buffer.length - 17;
}