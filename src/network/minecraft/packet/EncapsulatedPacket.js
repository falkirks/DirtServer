EncapsulatedPacket = function(buf){
    this.bb = buf;
}
EncapsulatedPacket.prototype.decode = function(){
    this.id = this.bb.readByte();
    this.bb.offset = 0;
    this.bb.buffer[0] = 0x00;
    this.count = this.bb.readUint32();
    console.log(this.count);
    this.type = this.bb.readByte();
    switch (this.type){
        case 0x00:

            break;
        case 0x40:

            break;
        case 0x60:

            break;
        default:
            console.log("Failed to identify encapsulation format: " + this.type);
            break;
    }
    this.bb.flip();
}