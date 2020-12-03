module.exports = {
    INIT
};
let RES = null;
let REQ = null;
let URL = null;
const fs = require('fs');
const static = require('./static.js');
const helper = require('./helper.js');

function INIT($req, $res) {
    RES = $res;
    REQ = $req;
    URL = $req.url.replace("/^\//", '').split('/');

    switch (URL[2]) {
        case '':
        case undefined:
        case "/":
            HOME();
            break;
        case "RUN":
            RUN();
            break;

    }
}


function HOME() {
    RES.writeHead(200, {
        'Content-Type': 'text/html'
    });
    static.HEAD(RES, "COMMAND SHELL", [], ["/static/js/shell/shellclient.js"]);
    RES.write('<body>');
    static.MENU(RES);
    let $buffer = `
    <div class="shellmaster"><h1>Command Shell</h1>
    <div id="shellcmd"><input type="text" placeholder="Command" id="CMD"/><button id="SHELLCLEAR">CLEAR</button></div>
    <div id="shelloutput"></div>
    </div>
    </body></html>
    `;
    RES.write($buffer);
    RES.end();
}

function RUM() {

}