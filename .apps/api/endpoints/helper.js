module.exports = {
    mountRW: function () {
        const execSync = require('child_process').execSync;
        execSync('mount remount / -o rw,remount');

    },
    mountR0: function () {
        const execSync = require('child_process').execSync;
        execSync('mount remount / -o ro,remount');

    },

    timeStamp: function () {
        $d = new Date();
        return `${$d.getFullYear()}-${$d.getMonth()}-${$d.getDay()}-${$d.getHours()}-${$d.getMinutes()}-${$d.getSeconds()}`;
    },
    shellSync: function ($cmd) {
        console.log($cmd);
        const execSync = require('child_process').execSync;
        return execSync($cmd);

    }
}