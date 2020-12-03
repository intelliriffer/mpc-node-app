module.exports = {
    INIT
};
let RES = null;
let URL = null;
const fs = require('fs');
const static = require('./static.js');
const ProjectFolder = '/media/FORCE/Projects';


function INIT($res) {
    RES = $res;
    LIST();

}

function LIST() {
    RES.writeHead(200, {
        'Content-Type': 'text/html'
    });
    let files = [];

    static.HEAD(RES, "Projects List");
    RES.write('<body>');
    static.MENU(RES);

    RES.write('<ul id="TASKS">');
    static.TASKS.forEach(t => {
        RES.write('<li><a href="' + escape(t.URL) + '">' + t.NAME + '</a></li>');
    });
    RES.write('</ul>')
    RES.write('</body></html>');
    RES.end();
}