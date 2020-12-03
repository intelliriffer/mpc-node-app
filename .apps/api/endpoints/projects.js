module.exports = {
    INIT
};
let RES = null;
let URL = null;
const fs = require('fs');
const static = require('./static.js');
const ProjectFolder = '/media/FORCE/Projects';

function INIT($req, $res) {
    RES = $res;
    URL = $req.url.replace("/^\//", '').split('/');

    switch (URL[2]) {
        case '':
        case undefined:
        case "/":
        case "LIST":
            LIST();
            break;
        case "READ":
            READ();
            break;
        case "DOWNLOAD":
            DOWNLOAD();
            break;
    }

}

function LIST() {
    RES.writeHead(200, {
        'Content-Type': 'text/html'
    });
    let files = [];
    fs.readdirSync(ProjectFolder).forEach(file => {
        if (fs.lstatSync(ProjectFolder + "/" + file).isDirectory()) return;
        files.push(file);
    });
    static.HEAD(RES, "Projects List");
    RES.write('<body>');
    static.MENU(RES);
    RES.write('<h1>SSD / Projects</h1>');
    RES.write('<ol id="PROJECTLIST">');
    files.forEach(f => {
        RES.write('<li><a href="/projects/READ/' + escape(f) + '">' + f + '</a></li>');
    });
    RES.write('</ol>')
    RES.write('</body></html>');
    RES.end();
}

function READ() {
    $f = URL[3];
    RES.writeHead(200, {
        'Content-Type': 'text/html'
    });

    if (!$f || $f == undefined) {
        RES.write("ERROR: INVALID FILE -> " + $f);
    }
    $fldr = ProjectFolder + "/" + unescape($f).replace('.xpj', '_[ProjectData]');
    let files = [];
    fs.readdirSync($fldr).forEach(file => {
        files.push(file);
    });

    static.HEAD(RES, "Projects Contents");
    RES.write("<body>");
    static.MENU(RES);

    RES.write('<a href="javascript:history.back(-1)"><< Back <<</a>');
    RES.write(`<h1>Project:  ${unescape($f)} Contents</h1>`);
    RES.write('<ol id="audio">');
    files.forEach(f => {
        $afile = '/projects/DOWNLOAD/' + escape($fldr + "/" + f);
        RES.write(`<li><a href="${$afile}">` + f + '</a>');
        if (f.endsWith('.WAV')) {
            $aud = `
            <audio
            preload="none"
                controls
                src="${$afile}">
                Your browser does not support the
            <code>audio</code> element.
    </audio>`;
            RES.write($aud);
        }
        RES.write("</li>");
    });
    RES.write('</ol>')
    RES.write('</body></html>');


    RES.write('</body></html>');
    RES.end();
}

function DOWNLOAD() {
    $f = URL.slice(3).join("/");
    if (!$f || $f == undefined) {
        RES.write("ERROR: INVALID FILE -> " + $f);
    }
    $file = unescape($f);

    $fn = $file.split('/').pop();
    //RES.writeHead(200, { 'Content-disposition': 'attachment; filename="' + $fn + '"' });
    fs.readFile($file, (err, data) => {
        RES.write(data);
        RES.end();
    });
}