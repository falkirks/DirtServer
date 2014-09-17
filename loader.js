console.log("Loading modules...");
fs = require('fs');
ByteBuffer = require('bytebuffer');
dgram = require("dgram");
ByteBuffer.DEFAULT_NOASSERT = true;
var walk = function(dir) {
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) walk(file);
        else require(file);
    });
}
walk(__dirname + "/src");