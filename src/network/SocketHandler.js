SocketHandler = function (port){
    this.server = dgram.createSocket("udp4");
    this.server.players = [];
    this.server.bind(port);
    this.server.on("error", function (err) {
        console.log("server error:\n" + err.stack);
        this.close();
    });
    this.server.on("message", function (msg, rinfo) {
        var buf = new ByteBuffer().append(msg, "hex");
        var id = buf.buffer[0];
        if(id >= raknet.UNCONNECTED_PING && id <= raknet.ADVERTISE_SYSTEM){
            console.log("server got: " + id + " from " + rinfo.address + ":" + rinfo.port);
            switch(id){
                case raknet.UNCONNECTED_PING:
                    var u = new UNCONNECTED_PING(buf);
                    u.decode();
                    var ad = new UNCONNECTED_PONG(u.pingID);
                    ad.encode();
                    this.send(ad.bb.buffer, 0,ad.bb.buffer.length, rinfo.port, rinfo.address); //Send waiting data buffer
                    break;
                case raknet.OPEN_CONNECTION_REQUEST_1: //ID_OPEN_CONNECTION_REQUEST_1
                    var r = new OPEN_CONNECTION_REQUEST_1(buf);
                    r.decode();
                    if(r.protocol !== raknet.STRUCTURE){
                        var res = new INCOMPATIBLE_PROTOCOL_VERSION();
                        res.encode();
                        this.send(res.bb.buffer,0, res.bb.buffer.length, rinfo.port, rinfo.address);
                    }
                    else{
                        var res = new OPEN_CONNECTION_REPLY_1(r.mtusize);
                        res.encode();
                        this.send(res.bb.buffer,0, res.bb.buffer.length, rinfo.port, rinfo.address);
                    }
                    break;
                case raknet.OPEN_CONNECTION_REQUEST_2: //ID_OPEN_CONNECTION_REQUEST_2
                    var r = new OPEN_CONNECTION_REQUEST_2(buf);
                    r.decode();
                    var res = new OPEN_CONNECTION_REPLY_2(rinfo.port, r.mtusize);
                    res.encode();
                    var p = new Player(rinfo.address, rinfo.port, r.mtusize);
                    if(!this.players.clientExists(p)){
                        this.players.push(p); //Add player to clients
                        console.log("Added player.");
                        this.send(res.bb.buffer, 0, res.bb.buffer.length, rinfo.port, rinfo.address); //Send waiting data buffer
                    }
                    else{

                    }
                    break;
                default:
                    console.log("Unknown raknet packet.");
                    break;
            }
        }
        else if(id >= raknet.DATA_PACKET_0 &&  id <= raknet.DATA_PACKET_F){
            for(var i = 0; i < this.players.length; i++){
                if(this.players[i].ip == rinfo.address && this.players[i].port == rinfo.port){
                    var e = new EncapsulatedPacket(buf);
                    e.decode();
                    this.players[i].handlePackets(e);
                    return;
                }
            }
            console.log("Couldn't find a player.")
        }
        else if(id == raknet.ACK || id == raknet.NACK){
            console.log("Got the ACK");
        }
        else{
            console.log("Unknown packet: " + id);
        }
    });
    this.server.on("listening", function () {
        var address = this.address();
        console.log("DirtServer started on " + address.address + ":" + address.port);
    });
};
SocketHandler.prototype.sendPacket = function(pk, ip, port){
    this.server.send(pk.bb.buffer, 0, pk.bb.buffer.length, port, ip);
};