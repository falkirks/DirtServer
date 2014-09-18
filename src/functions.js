String.prototype.toHex = function toHex() { //Convert string to hexadecimal
    var hex = '';
    for(var i=0;i<this.length;i++) {
        hex += ''+this.charCodeAt(i).toString(16);
    }
    return hex;
}
Array.prototype.clientExists = function (p) {
    var length = this.length;
    for(var i = 0; i < length; i++) {
        if(this[i].ip == p.ip && this[i].port == p.port) return true;
    }
    return false;
}