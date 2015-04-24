var net = require('net');
var fs = require('fs');
var path = require('path');
var hnet = require(__dirname+path.sep+'hujinet');

var serverMap = {};

exports.start = function (port,rootFolder,callback) {
    copyErrImgs(rootFolder);
    var serverId = Math.floor(Math.random()*99999);
    serverMap[serverId] = {};
    serverMap[serverId]["users"] = [];
    rootFolder = path.normalize(rootFolder);
    fs.stat(rootFolder, function(err,stats){
        if(err || !stats.isDirectory()){
            if (serverId in serverMap) delete serverMap[serverId];
            callback(err);
        }
    });

    var server = net.createServer(function(socket) {
        var users = serverMap[serverId]["users"];
        users.push(socket);
        socket.setMaxListeners(0);
        socket.setTimeout(2000, function() {
            socket.end();
            var index = users.indexOf(socket);
            users.splice(index,1);
        });
        socket.on('data',function(dat){
            hnet.handleReq(dat,socket,rootFolder);
        });
        socket.on('end',function(dat){
            var index = users.indexOf(socket);
            users.splice(index,1);
        });
    });
    server.setMaxListeners(0);
    serverMap[serverId]["server"] = server;
    server.listen(port, "127.0.0.1", function() {
        console.log("Server listening on port: " + port);
        callback();
    });

    server.on('error', function (e) {
        if (serverId in serverMap) delete serverMap[serverId];
        callback(e);
    });

    return serverId;
};

exports.stop = function (serverID, callback) {
    if (serverID in serverMap) {
        serverMap[serverID]["server"].close(function() {
            delete serverMap[serverID];
            callback();
        });
    }
};

function copyErrImgs(rootFolder) {
    fs.createReadStream(__dirname+path.sep+'404.jpg').pipe(fs.createWriteStream(rootFolder+path.sep+'404.jpg'));
    fs.createReadStream(__dirname+path.sep+'400.jpg').pipe(fs.createWriteStream(rootFolder+path.sep+'400.jpg'));
}