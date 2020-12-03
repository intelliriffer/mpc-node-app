var http = require('http'); // Import Node.js core module

var server = http.createServer(function(req, res) { //create web server
    if (req.url == '/') { //check the URL of the current request
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        let endPoint = require('./api/endpoints/home.js');
        endPoint.INIT(res);
    } else if (req.url.startsWith("/projects")) {
        let endPoint = require('./api/endpoints/projects.js');
        endPoint.INIT(req, res);
    } else if (req.url.startsWith("/arps")) {
        let endPoint = require('./api/endpoints/arps.js');
        endPoint.INIT(req, res);
    } else if (req.url.startsWith("/static")) {
        let endPoint = require('./api/endpoints/static.js');
        endPoint.INIT(req, res);
    } else
        res.end('Invalid Request!');

});

server.listen(5000); //6 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')