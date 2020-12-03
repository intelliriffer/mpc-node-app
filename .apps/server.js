var http = require('http'); // Import Node.js core module
const ENDPOINTS = require(__dirname + '/api/ENDPOINTS.js');

var server = http.createServer(function (req, res) { //create web server
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
});
server.listen(80); //6 - listen for any incoming requests
console.log('Node.js web server at port 80 is running..');