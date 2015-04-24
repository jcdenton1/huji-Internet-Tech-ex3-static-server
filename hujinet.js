var net = require('net');
var path = require('path');
var fs = require('fs');
var hparser = require(__dirname+path.sep+'hujiparser');
var http = require(__dirname+path.sep+'hujihttp');

var BAD_REQ_PAGE = __dirname+path.sep+"400.html";
var BAD_PATH_PAGE = __dirname+path.sep+"404.html";

exports.handleReq = function (data, socket, rootFolder) {
    var reqObj = hparser.parse(data.toString().trim());
    if (reqObj['parse_error'] === true) createErrorRes(400, socket);
    else {
        rpath = reqObj.resource.replace(/\//g, path.sep);
        var fullpath = path.normalize(rootFolder + path.sep + rpath);
        //if the requested resource is inside the root folder
        if (fullpath.indexOf(rootFolder) === 0) {
            createResponse(fullpath, reqObj, socket);
        } else {
            createErrorRes(404, socket);
        }
    }
};

function sendResponse(resObj, socket) {
    var headers = hparser.stringify(resObj);
    var stream = resObj['body_fd'];
    if (socket.writable) {
        socket.write(headers, function () {
            if (socket.writable) {
                //if should socket.end after response
                if((resObj['version'] === '1.0' &&
                    ((!'connection' in resObj['headers']) || resObj['headers']['connection'] !== 'keep-alive')) ||
                    resObj['headers']['connection'] === 'close') stream.pipe(socket);
                //otherwise
                else stream.pipe(socket, { end: false });
            }
        });
    }
    socket.on('error', function() {
        stream.destroy();
        socket.destroy();
    });
}

//Response code parameter is optional.
//If it is passed then it will be used in the response object
function createResponse(filepath, reqObj, socket) {
    fs.stat(filepath, function(err,stats){
        var arr = filepath.split('.');
        var ctype = new ContentTypeMap();
        if(!err && stats.isFile()){
            if(arr[arr.length - 1] in ctype) {
                //good case - a requested page was found
                var fd = fs.createReadStream(filepath);
                var resObj = new http.HTTPresponse(reqObj.version, 200,
                    ctype[arr[arr.length - 1]], stats.size, fd);
                sendResponse(resObj, socket);
                return;
            }
        }
        //upon problem finding requested resource
        createErrorRes(404, socket);
    });
}

function createErrorRes(code, socket) {
    var ctype = new ContentTypeMap();
    if(code === 400) {
        var fd = fs.createReadStream(BAD_REQ_PAGE);
        fs.stat(BAD_REQ_PAGE, function(err,stats){
            if(!err){
                var resObj = new http.HTTPresponse('1.0', 400,
                    ctype['html'], stats.size, fd);
                sendResponse(resObj, socket);
            }
        });
    }
    else if (code === 404) {
        fd = fs.createReadStream(BAD_PATH_PAGE);
        fs.stat(BAD_PATH_PAGE, function(err,stats){
            if(!err){
                resObj = new http.HTTPresponse('1.0', 404,
                    ctype['html'], stats.size, fd);
                sendResponse(resObj, socket);
            }
        });
    }
}

function ContentTypeMap() {
    this['js'] = 'application/javascript';
    this['html'] = 'text/html';
    this['txt'] = 'text/plain';
    this['css'] = 'text/css';
    this['jpg'] = 'image/jpeg';
    this['jpeg'] = 'image/jpeg';
    this['gif'] = 'image/gif';
    this['png'] = 'image/png';
}