module.exports = {
    INIT
};
let RES = null;
let REQ = null;
let URL = null;
const fs = require('fs');
const static = require('./static.js');

function INIT($req, $res) {
    RES = $res;
    REQ = $req;
    LIST();
}

function LIST() {
    RES.writeHead(200, {
        'Content-Type': 'text/html'
    });
    let files = [];

    static.HEAD(RES, "MPC / Force Server");
    RES.write('<body>');
    static.MENU(REQ, RES);
    RES.write('<ul id="TASKS">');
    static.TASKS.forEach(t => {
        if (!t.HIDDEN) RES.write('<li><a href="' + escape(t.URL) + '">' + t.NAME + '</a></li>');
    });
    RES.write('</ul>')
    static.CLOSE(RES);
    RES.end();
}