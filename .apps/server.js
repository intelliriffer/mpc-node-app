var https = require('https'); // Import Node.js core module
var http = require('http'); // Import Node.js core module
const fs = require('fs');

const ENDPOINTS = require(__dirname + '/api/ENDPOINTS.js');
const options = {
    key: fs.readFileSync(__dirname + '/key.pem'),
    cert: fs.readFileSync(__dirname + '/cert.pem')
};
var server = http.createServer(function (req, res) { //create web server
    serve(req, res);
});
var secureserver = https.createServer(options, function (req, res) { //create web server
    serve(req, res);
});

function serve(req, res) {
    if (req.url == '/') { //check the URL of the current request
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        let endPoint = require('./api/endpoints/home.js');
        endPoint.INIT(req, res);
    } else {
        let $done = false;
        for (let i = 0; i < ENDPOINTS.length; i++) {
            let e = ENDPOINTS[i];

            if (!$done && e.PARAM != "/") {
                if (req.url.startsWith(e.PARAM)) {
                    let endPoint = require(e.PATH);
                    endPoint.INIT(req, res);
                    $done = true;
                    break;
                }
            }
        }
        if (!$done) res.end('INVALID REQUEST');
    }

}

server.listen(80); //6 - listen for any incoming requests
secureserver.listen(443);
console.log('Servers Started on ports 80 and Port 443');