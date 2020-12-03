const TASKS = require(__dirname + '/../ENDPOINTS.js');
let RES = null;
let REQ = null;
let URL = null;
const fs = require('fs');
let JSFILES = [
    "static/js/libs/jquery-3.5.1.min.js",

];

function INIT($req, $res) {
    RES = $res;
    REQ = $req;
    $URL = $req.url.split("/").slice(2).join('/');
    //    RES.writeHead(200, { 'Content-Type': 'text/html' });
    $staticroot = `${__dirname}/../../assets/`;
    $tfile = $staticroot + $URL;

    if (!fs.existsSync($tfile)) {
        RES.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        RES.write('NOT FOUND' + $tfile);
        RES.end();
        return;
    }
    $data = fs.readFileSync($tfile);
    let MIME = getMIME($tfile);
    RES.writeHead(200, {
        'Content-Type': `${MIME}`
    });
    RES.write($data);
    RES.end();


}

function CSS() {
    let files = [
        "/static/css/style.css"
    ]
    return files.map(cssTag);


}

function cssTag($item) {
    return `<link type="text/css" rel="stylesheet" href="${$item}" \>`;
}

function jsTag($item) {
    return `<script type="text/javascript" src="${$item}"></script>`;
}

function JS() {
    return JSFILES.map(jsTag);
}

function HEAD(res, title = 'myApp', css = [], js = []) {
    res.write(`<!DOCTYPE html > <html lang="en">`);
    res.write(`<head>`);
    res.write(`<title>${title}</title>`);
    res.write(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    let $css = CSS().concat(css.map(cssTag));
    let $js = JS().concat(js.map(jsTag));
    $css.forEach(css => res.write(css));
    $js.forEach(js => res.write(js));
    res.write("</head>");
}

function MENU(req, res) {
    res.write("<nav>");
    res.write('<div class="mtitle">FORCE / MPC Server</div>');
    res.write('<div class="menu"><ul>');

    TASKS.forEach(t => {
        $selected = '';
        if ((req.url.startsWith(t.PARAM) && t.PARAM != "/") || req.url == t.PARAM) $selected = "active";
        if (!t.HIDDEN) res.write(`<li class="${$selected}"><a href="${escape(t.URL)}">${t.NAME}</a></li>`);

    });
    res.write("</ul></div></nav>");

}

function getMIME($f) {
    $e = $f.substr(-3).toUpperCase();
    switch ($e) {
        case "CSS":
            return 'text/css';
        case ".JS":
            return 'text/javascript';
        case "JPG":
            return 'image/jpeg';
        case "PNG":
            return 'image/png';
            return "text/plain";
    }

}

function queJS($js) {
    JSFILES.push($js);
}

function SAVECONFIG($data) {
    fs.writeFileSync(`${__dirname}/config.json`, JSON.stringify($data));
}

let CONFIG = {};
CONFIG = JSON.parse(fs.readFileSync(`${__dirname}/../../config.json`));

module.exports = {
    INIT,
    CSS,
    JS,
    HEAD,
    TASKS,
    MENU,
    queJS,
    CONFIG,
    SAVECONFIG
};