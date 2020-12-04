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
        case "SAVE":
            SAVE();
            break;
        case "LIST":
            LIST();
            break;
        case "REMOVE":
            REMOVE();
            break;

    }
}


function HOME() {
    RES.writeHead(200, {
        'Content-Type': 'text/html'
    });
    static.HEAD(RES, "Progression Builder",
        [
            "/static/css/pbuilder/style.css",
        ],
        [
            "/static/js/pbuilder/chordlib.js",
            "/static/js/libs/webmidi.2.5.1.js",
            "/static/js/libs/jquery-3.5.1.min.js",
            "/static/js/libs/jquery.cookie.js",
            "/static/js/pbuilder/script.js",
        ]);

    RES.write('<body>');
    static.MENU(REQ, RES);

    static.INCLUDE(RES, `${__dirname}/inc/pbuilder/template.html`);
    static.CLOSE(RES);
    RES.end();
}


function SAVE() {
    var $OK = {
        ERROR: false,
        MESSAGE: 'OK',
        DATA: ''
    };

    RES.writeHead(200, {
        'Content-Type': 'text/json'
    });
    let $tDir = static.CONFIG.PROGRESSIONS_DIR;
    if (!fs.existsSync($tDir)) {
        var $OK = {
            ERROR: true,
            MESSAGE: `Error!! Progressons Directory Path Not Found: ${$tDir}
Please Edit the /media/az01-internal-sd/.apps/config.json and Enter the correct path!`,
            DATA: ''
        };
        RES.end(JSON.stringify($OK));
        return;
    }

    if (REQ.method == "POST") {
        let $body = '';
        REQ.on('data', chunk => {
            $body += chunk.toString();
        });

        REQ.on('end', () => {
            let $payload = JSON.parse($body);
            try {
                fs.writeFileSync(`${$tDir}/${$payload.file}`, $payload.data);
            } catch (e) {
                $OK.ERROR = true;
                $OK.MESSAGE = `ERROR: ${e.message}`;
            }
            RES.end(JSON.stringify($OK));
            return;
        });
    }
    else {
        $OK.ERROR = true;
        $OK.MESSAGE = "NO POST DATA"
        RES.end(JSON.stringify($OK));
    }
}

function LIST() {
    var $OK = {
        ERROR: false,
        MESSAGE: 'OK',
        DATA: ''
    };
    RES.writeHead(200, {
        'Content-Type': 'text/json'
    });
    let $tDir = static.CONFIG.PROGRESSIONS_DIR;
    if (!fs.existsSync($tDir)) {
        var $OK = {
            ERROR: true,
            MESSAGE: `Error!! Progressons Directory Path Not Found: ${$tDir}
Please Edit the /media/az01-internal-sd/.apps/config.json and Enter the correct path!`,
            DATA: ''
        };
        RES.end(JSON.stringify($OK));
        return;
    }

    let files = [];
    fs.readdirSync($tDir).forEach(file => {
        if (fs.lstatSync($tDir + "/" + file).isDirectory()) return;
        files.push(file);
    });
    $OK.DATA = files;
    RES.end(JSON.stringify($OK));
}

function REMOVE() {

    RES.writeHead(200, {
        'Content-Type': 'text/json'
    });
    let $tDir = static.CONFIG.PROGRESSIONS_DIR;
    if (REQ.method == "POST") {
        let body = '';
        REQ.on('data', chunk => {
            body += chunk.toString();
        });
        REQ.on('end', () => {

            let $dfile = $tDir + "/" + body;
            if (!fs.existsSync($dfile)) {
                let $OK = {
                    ERROR: true,
                    MESSAGE: 'FILE NOT FOUND'
                };
                RES.end(JSON.stringify($OK));
                return;
            }

            if (!deletefile($dfile)) {

                let $OK = {
                    ERROR: true,
                    MESSAGE: 'UNABLE TO DELETE'
                };
                RES.end(JSON.stringify($OK));
                return;

            }

            let $OK = {
                ERROR: false,
                MESSAGE: 'OK'
            };
            RES.end(JSON.stringify($OK));
        });

    }
}

function deletefile($f) {
    try {
        fs.unlinkSync($f);
        return true;
    } catch (e) {
        return false;
    }
}
