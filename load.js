var http = require('http');
var path = require('path');
var fs = require('fs');
var hujiserver = require(__dirname+path.sep+'hujiwebserver');

function loadTest() {
    var sid = hujiserver.start(80,__dirname+path.sep+"www"+path.sep+"ex2",function(e) {
        if (e) {
            console.log(e);
        } else {
            loadServer();
        }
    });
}

function loadServer() {
    var resnumpersec = 0;
    var timer = setInterval(function() {
        console.log("Server successful response rate:  " + resnumpersec + " / sec");
        resnumpersec = 0;
    }, 1000);
    var options = {
        hostname: '127.0.0.1',
        port: 80,
        path: 'index.html',
        method: 'GET',
        version: '1.1'
    };
    var req_timer = setInterval(function() {
        var req = http.request(options, function (res) {
            res.on('data', function (chunk) {
            });
            res.on('end', function () {
                if (res.statusCode !== 200) {
                    console.log("Error: Status code is: " + res.statusCode);
                } else {
                    resnumpersec += 1;
                }
            });
        });
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });
        req.end();
    }, 1);
}

loadTest();