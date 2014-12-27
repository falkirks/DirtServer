ServerHandshakePacket = function(port, session){
    this.port = port;
    this.session = session;
    this.bb = new ByteBuffer();
    this.bb.writeByte(minecraft.SERVER_HANDSHAKE);
}
ServerHandshakePacket.prototype.encode = function(){
    this.bb = ByteBuffer.concat([this.bb.reset(), [0x04, 0x3f, 0x57, 0xfe]]);
    this.bb.writeByte(0xcd);
    this.bb.writeShort(this.port);
    this.bb.flip();
    this.bb = ByteBuffer.concat([this.bb.reset(), EncapsulatedPacket.writeLTriad(4)]);
    this.bb.offset = this.bb.limit;
    this.bb.flip();
    this.bb = ByteBuffer.concat([this.bb.reset(), [0xf5, 0xff, 0xff, 0xf5]]);
    this.bb.offset = this.bb.limit;
    for(var i = 0; i < 9; i++){
        this.bb.flip();
        this.bb = ByteBuffer.concat([this.bb.reset(), EncapsulatedPacket.writeLTriad(4)]);
        this.bb.offset = this.bb.limit;
        this.bb.flip();
        this.bb = ByteBuffer.concat([this.bb.reset(), [0xff,  0xff, 0xff, 0xff]]);
        this.bb.offset = this.bb.limit;
    }
    this.bb.flip();
    this.bb = ByteBuffer.concat([this.bb, [0x00, 0x00]]);
    this.bb.offset = this.bb.limit;

    this.bb.writeLong(this.session);
    //Session 2
    this.bb.flip();
    this.bb = ByteBuffer.concat([this.bb.reset(), [0x00, 0x00, 0x00, 0x00, 0x04, 0x44, 0x0b, 0xa9]]);
    this.bb.compact();
};