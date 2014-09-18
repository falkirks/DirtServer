EncapsulatedPacket = function(buf){
    if(buf.buffer !== undefined){
        this.bb = buf;
        this.packets = [];
    }
    else{
        this.bb = new ByteBuffer();
        this.packets = buf;
        this.id = raknet.DATA_PACKET_4;
        this.sequencenumber = 0;
        if(this.packets.length > 0){
            this.sequencenumber = this.packets[ this.packets.length - 1 ];
        }
    }
}
EncapsulatedPacket.prototype.decode = function(){
    this.id = this.bb.readByte();
    this.bb.reset();
    this.bb.buffer[0] = 0x00;
    this.sequencenumber = this.bb.readUint32();
    while(this.bb.remaining() > 0){
        var type = this.bb.readByte();
        switch (type){
            case 0x00:
                var pklength = this.bb.readShort();
                this.packets.push(new InternalPacket(this.bb.slice(this.bb.offset, this.bb.offset+(pklength/8)), this.sequencenumber));
                this.bb.offset += (pklength/8);
                break;
            case 0x40:
                var pklength = this.bb.readShort();
                this.bb.skip(3); //Skip count triad
                this.packets.push(new InternalPacket(this.bb.slice(this.bb.offset, this.bb.offset+(pklength/8)), this.sequencenumber));
                this.bb.offset += (pklength/8);
                break;
            case 0x60:
                var pklength = this.bb.readShort();
                this.bb.skip(7); //Skip count triad and Unknown long
                this.packets.push(new InternalPacket(this.bb.slice(this.bb.offset, this.bb.offset+(pklength/8)), this.sequencenumber));
                this.bb.offset += (pklength/8);
                break;
            default:
                this.bb.offset = this.bb.limit;
                break;
        }
    }
    this.bb.flip();
}
EncapsulatedPacket.prototype.encode = function(){
    if(this.packets.length > 0){
        this.sequencenumber = this.packets[ this.packets.length - 1 ].sequencenumber;
        this.bb.writeUint32(this.sequencenumber);
        this.bb.reset();
        this.bb.writeByte(this.id);
        this.bb.skip(3);
        for (var i = 0; i < this.packets.length; i++) {
            this.bb.writeByte(0x00);
            this.bb.writeShort(packets[i].bb.buffer.length);
            this.bb = ByteBuffer.concat(this.bb, packet.bb);
            this.bb.offset = this.bb.limit;
        }
    }
}