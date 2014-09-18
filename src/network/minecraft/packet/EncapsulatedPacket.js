EncapsulatedPacket = function(buf){
    this.bb = buf;
    this.packets = [];
}
EncapsulatedPacket.prototype.decode = function(){
    this.id = this.bb.readByte();
    this.bb.reset();
    this.bb.buffer[0] = 0x00;
    this.count = this.bb.readUint32();
    while(this.bb.remaining() > 0){
        var type = this.bb.readByte();
        switch (type){
            case 0x00:
                var pklength = this.bb.readShort();
                this.packets.push(this.bb.slice(this.bb.offset, this.bb.offset+(pklength/8)));
                this.bb.offset += (pklength/8);
                break;
            case 0x40:
                var pklength = this.bb.readShort();
                this.bb.skip(3); //Skip count triad
                this.packets.push(this.bb.slice(this.bb.offset, this.bb.offset+(pklength/8)).compact());
                this.bb.offset += (pklength/8);
                break;
            case 0x60:
                var pklength = this.bb.readShort();
                this.bb.skip(7); //Skip count triad and Unknown long
                this.packets.push(this.bb.slice(this.bb.offset, this.bb.offset+(pklength/8)).compact());
                this.bb.offset += (pklength/8);
                break;
            default:
                this.bb.offset = this.bb.limit;
                break;
        }
    }
    this.bb.flip();
}