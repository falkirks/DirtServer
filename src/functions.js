String.prototype.toHex = function toHex() { //Convert string to hexadecimal
    var hex = '';
    for(var i=0;i<this.length;i++) {
        hex += ''+this.charCodeAt(i).toString(16);
    }
    return hex;
}