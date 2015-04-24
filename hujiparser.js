var path = require('path');
var http = require(__dirname+path.sep+'hujihttp');

exports.parse = function (String) {
    return new http.HTTPrequest(String);
};

exports.stringify = function (HttpResponseObject) {
    var str = "";
    str = str.concat('HTTP/',HttpResponseObject.version,' ',HttpResponseObject.status,'\n');
    str = str.concat('Content-Type: ',HttpResponseObject['headers']['content-type'],'\n');
    str = str.concat('Content-Length: ',HttpResponseObject['headers']['content-length'],'\n');
    str = str.concat('\n');
    return str;
};