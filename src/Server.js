var ip = 192.168.0.7 //(Random IP) TODO: Get IP From Config
var port = 19132 //TODO: Get Port In Config

var DEBUG = false

var DirtServer.VERSION = 0.1.1
var DirtServer.NAME = "DirtServer"
var DirtServer.MC_VERSION = 0.11.0

function main(){
if(DEBUG){
   console.log("[DirtServer] Debug Messages Enabled");
}
if(!DEBUG){
	console.log("[DirtServer] Debug Messages Disabled");
	}
console.log("[INFO] Starting Minecraft PE Server on " + ip + ":" + port);
console.log("[INFO] DirtServer Version " + DirtServer.VERSION + " for " + DirtServer.MC_VERSION);
}
