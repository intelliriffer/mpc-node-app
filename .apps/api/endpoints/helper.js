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
        const execSync = require('child_process').execSync;
        return execSync($cmd);

    },
    shell: async function ($cmd) {
        let $ret = '';
        return new Promise(resolve => {
            const exec = require('child_process').exec;
            exec($cmd, (error, stdout, stderr) => {
                if (error) {
                    resolve(`Error: ${error}`);
                    return;
                }

                resolve(stdout);
            });

        });
        //return $ret;

    }
}