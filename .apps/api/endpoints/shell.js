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
    static.MENU(REQ, RES);
    let $buffer = `
    <div class="shellmaster"><h1>Command Shell</h1>
    <div class="sdescription">Meant To Run Some bsic commands to check stuff! its not complete shell repalcement</div>
    <div id="shellcmd"><input type="text" placeholder="Command" id="CMD"/><button id="SHELLCLEAR">CLEAR</button></div>
    <div id="shelloutput"></div>
    </div>
    </body></html>
    `;
    RES.write($buffer);
    RES.end();
}

function RUN() {
    var $OK = {
        ERROR: false,
        MESSAGE: 'OK',
        DATA: ''
    };
    let $body = '';
    RES.writeHead(200, {
        'Content-Type': 'text/json'
    });

    if (REQ.method == "POST") {
        REQ.on('data', chunk => {
            $body += chunk.toString();
        });

        REQ.on('end', () => {
            RES.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            let $cmd = JSON.parse($body).CMD;
            try {
                $results = helper.shellSync($cmd).toString();
                $OK.DATA = $results;
            } catch (e) {
                $OK.DATA = e.message;

            }
            RES.end(JSON.stringify($OK));
        });
    }
    else {
        $OK.ERROR = true;
        $OK.MESSAGE = "NO POST DATA"
        RES.end(JSON.stringify($OK));
    }


}