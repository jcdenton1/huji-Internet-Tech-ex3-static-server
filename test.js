var http = require('http');
var path = require('path');
var fs = require('fs');
var hujiserver = require(__dirname+path.sep+'hujiwebserver');

function beginTest() {
    var ex2_files_list = ['firefoxie.jpeg','ilialikeasir.jpg','iliatrolldad.jpg',
        'index.html','main.js','style.css','trollie.jpg','whitelego.png'];
    var result_dic = {};
    var sid = hujiserver.start(80,__dirname+path.sep+"www"+path.sep+"ex2",function(e) {
        if (e) {
            console.log(e);
        }
        else {
            console.log('Client: connection established with server');
            for (var i=0; i<ex2_files_list.length; i++) {
                requestFile(ex2_files_list[i], result_dic)
            }
        }
    });
    var timer = setInterval(function() {
        //end of tests (we requested all files)
        if (ex2_files_list.length === Object.keys(result_dic).length)
        {
            var tests_success = true;
            for (var elem in result_dic) {
                if (result_dic[elem] === false) {
                    tests_success = false;
                    break;
                }
            }
            if (tests_success) console.log("Tests ended successfully!");
            else console.log("Tests ended with failure!");
            clearInterval(timer);
            hujiserver.stop(sid, function() {
                console.log("server successfully shutdown with id: " + sid);
            });
        }
    }, 200);
}

function requestFile(fname, result_dic) {
    var options = {
        hostname: '127.0.0.1',
        port: 80,
        path: fname,
        method: 'GET',
        version: '1.1'
    };
    var req = http.request(options, function(res) {
        if (res.statusCode !== 200) {
            console.log("Error: Status code for file: " +
            fname + "  is: " + res.statusCode);
            result_dic[fname] = false;
        }
        var net_data = [];
        res.on('data', function (net_chunk) {
            net_data.push(net_chunk);
        });
        res.on('end', function () {
            net_data = Buffer.concat(net_data);
            //compare received data (chunk) with the file that's read from the disk
            var disk_data = [];
            var stream = fs.createReadStream(__dirname+path.sep+"www"+path.sep+"ex2"+path.sep+fname);
            stream.on('data', function(disk_chunk) {
                disk_data.push(disk_chunk);
            });
            stream.on('end', function() {
                disk_data = Buffer.concat(disk_data);
                if (net_data.toString('base64') !== disk_data.toString('base64')) {
                    console.log("Error: comparison between file from server and filesystem failed! Filename: " + fname);
                    result_dic[fname] = false;
                } else result_dic[fname] = true;
            });
        });
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();
}

beginTest();