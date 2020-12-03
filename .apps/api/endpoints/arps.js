module.exports = {
    INIT
};
let RES = null;
let REQ = null;
let URL = null;
const fs = require('fs');
const static = require('./static.js');
const helper = require('./helper.js');
const arpFolder = '/usr/share/Akai/SME0/Arp Patterns';

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
        case "LIST":
            LIST();
            break;
        case "REMOVE":
            REMOVE();
            break;
        case "ADD":
            ADD();
            break;
        case "DOWNLOAD":
            DOWNLOAD();
            break;
        case "CLEAR":
            CLEAR();
            break;
    }
}


function HOME() {
    RES.writeHead(200, {
        'Content-Type': 'text/html'
    });
    static.HEAD(RES, "Arp Patterns Manager", [], ["/static/js/arps/arpclient.js"]);
    RES.write('<body>');
    static.MENU(RES);
    RES.write('<div class="arpload"><h1>Arp Patterns <span id="count"></span></h1>');
    RES.write('<div class="upload"><button id="upload">Upload Midi Files</button><input type="file" id="fupload" accept=".mid" multiple > <button id="backup">Download All</button><button id="clear">Remove All</button></div></div>');
    RES.write('<ol id="arplist">');
    RES.write('</ol>')
    RES.write('</body></html>');
    RES.end();
}

function LIST() {
    let files = [];
    fs.readdirSync(arpFolder).forEach(file => {
        if (fs.lstatSync(arpFolder + "/" + file).isDirectory()) return;
        files.push(file);
    });
    RES.writeHead(200, {
        'Content-Type': 'text/json'
    });
    RES.write(JSON.stringify(files));
    RES.end();
}

function REMOVE() {
    if (REQ.method == "POST") {
        let body = '';
        REQ.on('data', chunk => {
            body += chunk.toString();
        });
        REQ.on('end', () => {
            RES.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            let $dfile = "/usr/share/Akai/SME0/Arp Patterns/" + body;
            if (!fs.existsSync($dfile)) {
                let $OK = {
                    ERROR: true,
                    MESSAGE: 'FILE NOT FOUND'
                };
                RES.end(JSON.stringify($OK));
                return;
            }
            RES.writeHead(200, {
                'Content-Type': 'text/json'
            });
            if (!deletefile($dfile)) {
                helper.mountRW();
                if (!deletefile($dfile)) {
                    let $OK = {
                        ERROR: true,
                        MESSAGE: 'UNABLE TO DELETE'
                    };
                    RES.end(JSON.stringify($OK));
                    return;
                }

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

function addFile($s, $t) {
    let $data = fs.readFileSync($s);
    try {

        fs.writeFileSync($t, $data);
        deletefile($s);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

function ADD() {
    $arpdir = "/usr/share/Akai/SME0/Arp Patterns/";
    let mp = require('multiparty');
    let util = require('util');
    let error = false;

    if (REQ.method != "POST") return;
    let form = new mp.Form();
    form.parse(REQ, function (err, fields, files) {
        RES.writeHead(200, {
            'content-type': 'text/plain'
        });
        for (let i = 0; i < Object.keys(files).length; i++) {
            key = Object.keys(files)[i];
            file = files[key][0];
            if (!addFile(file.path, $arpdir + file.originalFilename)) {
                helper.mountRW();
                if (!addFile(file.path, $arpdir + file.originalFilename)) {
                    error = true;
                    let $OK = {
                        ERROR: true,
                        MESSAGE: 'UNABLE TO ADD FILES'
                    };
                    RES.end(JSON.stringify($OK));
                    helper.mountR0();
                    return;
                }
            }
        };
        if (!error) {
            let $OK = {
                ERROR: false,
                MESSAGE: 'OK'
            };
            RES.end(JSON.stringify($OK));
            helper.mountR0();

        }
    });
}

function CLEAR() {

    RES.writeHead(200, {
        'Content-Type': 'text/json'
    });
    let $OK = {
        ERROR: false,
        MESSAGE: 'OK'
    };
    helper.mountRW();
    try {
        fs.readdirSync(arpFolder).forEach(file => {
            if (fs.lstatSync(arpFolder + "/" + file).isDirectory()) return;
            if (!deletefile(arpFolder + "/" + file)) throw "Unable to Delete Some Files";
        });

    } catch (e) {
        $OK.ERROR = true;
        $OK.MESSAGE = `Error: ${e}`;
    }
    RES.end(JSON.stringify($OK));

}


function DOWNLOAD() {
    let $f = `ArpPatterns-${helper.timeStamp()}.tar`;
    let $sFile = `/tmp/${$f}`;
    let $OK = {
        ERROR: false,
        MESSAGE: 'OK'
    };
    try {
        helper.shellSync('rm /tmp/Arp*.tar');
    } catch (e) { }
    $cmd = `tar -cvf ${$sFile}  -C "/usr/share/Akai/SME0/Arp Patterns/" .`;
    try {
        $tar = helper.shellSync($cmd).toString();
        //   $list = helper.shellSync("ls -alt /tmp/").toString();

        RES.writeHead(200, {
            'Content-Transfer-Encoding': 'Binary',
            'content-type': 'application/octet-stream',
            'Content-disposition': 'attachment; filename="' + $f + '"'
        });
        fs.readFile($sFile, (err, data) => {
            RES.write(data);
            RES.end();
        });
        return;

    } catch (e) {
        console.log('ERROR' + e);
        RES.writeHead(200, {
            'content-type': 'text/html'
        });
        /*$OK.ERROR = true;
        $OK.MESSAGE = e.message;*/
        $OK = "<h2>ERROR: " + e.message.toString() + `</h2>`;
        $OK += `<br><a href="javascript:history.back(-1);"><< Back<< </a>`;
        RES.end($OK);
    }


}