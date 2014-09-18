ServerHandshakePacket = function(port, session){
    this.port = port;
    this.session = session;
    this.bb = new ByteBuffer();
    this.bb.writeByte(minecraft.SERVER_HANDSHAKE);
}
ServerHandshakePacket.prototype.encode = function(){
    //Cookie
    this.writeByteArray([0x04, 0x3f, 0x57, 0xfe], false);
    //Security
    this.bb.writeByte(0xcd);
    this.bb.writeShort(this.port);
    this.writeByteArray([0xf5, 0xff, 0xff, 0xf5], true);
    for(var i = 0; i < 9; i++){
        this.writeByteArray([0xff,  0xff, 0xff, 0xff], true);
    }
    this.writeByteArray([0x00, 0x00], false);
    this.bb.writeLong(this.session);
    //Session 2
    this.writeByteArray([0x00, 0x00, 0x00, 0x00, 0x04, 0x44, 0x0b, 0xa9], false);
    this.bb.flip();
    this.bb.compact();

}
ServerHandshakePacket.prototype.writeByteArray = function(bytes, writeLength){
    if(writeLength){ //Pretend this doesn't happen
        this.bb.offset--;
        var b = this.bb.readByte();
        this.bb.offset--;
        this.bb.writeUint32(bytes.length);
        this.bb.offset -= 4;
        this.bb.writeByte(b);
        this.bb.skip(3);
    }
    for(var i = 0; i < bytes.length; i++){
        this.bb.writeByte(bytes[i]);
    }
}