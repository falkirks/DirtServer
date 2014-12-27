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
    }
};
EncapsulatedPacket.prototype.decode = function(){
    this.packets = [];
    this.id = this.bb.readByte();
    this.bb.reset();
    this.bb.buffer[0] = 0x00;
    this.sequencenumber = this.bb.readUint32();

    while(this.bb.remaining() > 0){
        var pk = new InternalPacket();
        var flag = this.bb.readByte();
        pk.reliability = (flag >> 5);
        pk.hasSplit = (flag & 16) == 16;
        var length = ((this.bb.readShort() + 7) >> 3);
        if(pk.reliability == 2 || pk.reliability == 3 || pk.reliability == 4 || pk.reliability == 6 || pk.reliability == 7){
            pk.messageIndex = EncapsulatedPacket.readLTriad(this.bb.buffer, this.bb.offset);
            this.bb.skip(3);
        }
        if(pk.reliability == 1 || pk.reliability == 3 || pk.reliability == 4 || pk.reliability == 7){
            pk.orderIndex = EncapsulatedPacket.readLTriad(this.bb.buffer, this.bb.offset);
            this.bb.skip(3);
            pk.orderChannel = this.bb.readByte();
        }
        if(pk.hasSplit){
            pk.splitCount = this.bb.readInt();
            pk.splitID = this.bb.readShort();
            pk.splitIndex = this.bb.readInt();
        }
        pk.buffer = this.bb.copy(this.bb.offset, this.bb.offset+length);
        this.bb.skip(length);
        this.packets.push(pk);
    }
    this.bb.flip();
};
EncapsulatedPacket.prototype.encode = function(){
    this.bb = new ByteBuffer;
    if(this.packets.length > 0){
        this.bb.writeByte(this.id);
        this.bb.flip();
        this.bb = ByteBuffer.concat([this.bb, EncapsulatedPacket.writeLTriad(this.sequencenumber)]);
        this.bb.offset = this.bb.limit;
        for (var i = 0; i < this.packets.length; i++) {
            if(this.packets[i].reliability == null) this.packets[i].reliability = 0;
            if(this.packets[i].hasSplit == null) this.packets[i].hasSplit = false;


            this.bb.writeByte((this.packets[i].reliability << 5) ^ (this.packets[i].hasSplit ? true : 0x00));
            this.bb.writeShort(this.packets[i].bb.limit << 3);

            if(this.packets[i].reliability == 0x02 || this.packets[i].reliability == 0x03 || this.packets[i].reliability == 0x04 || this.packets[i].reliability == 0x06 || this.packets[i].reliability == 0x07){
                this.bb.flip();
                this.bb = ByteBuffer.concat([this.bb, EncapsulatedPacket.writeLTriad(this.packets[i].messageIndex)]);
                this.bb.offset = this.bb.limit;
            }
            if(this.packets[i].reliability == 0x01 || this.packets[i].reliability == 0x03 || this.packets[i].reliability == 0x04 || this.packets[i].reliability == 0x07){
                this.bb.flip();
                this.bb = ByteBuffer.concat([this.bb, EncapsulatedPacket.writeLTriad(this.packets[i].orderIndex)]);
                this.bb.offset = this.bb.limit;
                this.bb.writeByte(this.packets[i].orderChannel);
            }
            if(this.packets[i].hasSplit){
                this.bb.writeInt(this.packets[i].splitCount);
                this.bb.writeShort(this.packets[i].splitID);
                this.bb.writeInt(this.packets[i].splitIndex);
            }
            this.bb = ByteBuffer.concat([this.bb.reset(), this.packets[i].bb]);
            this.bb.offset = this.bb.limit;
        }
    }
};
EncapsulatedPacket.readLTriad = function(data, offset){
    return (data[offset++] | data[offset++] << 8 | data[offset] << 16);
};
EncapsulatedPacket.write = function(x, length, reverse){
    var buffer = [];
    var shift = (length - 1) * 8;
    for(var i = 0; i < length; i++){
        buffer[reverse ? (length - i - 1):i] = (x >> shift);
        shift -= 8;
    }
    return buffer;
};
EncapsulatedPacket.writeLTriad = function(data){
    var buf = new ByteBuffer;
    buf.writeUint32(data);
    return buf.copy(1, 4);
};