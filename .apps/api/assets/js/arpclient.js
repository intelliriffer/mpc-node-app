$(document).ready(() => {
    console.log('ready');
    $('#fupload').hide();
    getArps();
    $('#upload').click(e => {
        $('#fupload').trigger('click')
    });

    $('#fupload').change(handleUpload);
    $('#backup').click(getBackup);
    $('#clear').click(removeAll);

    /******** METHODS0******** */
    function getArps() { //list of Midis on /usr/share/Akai/SME0/Arp Pattenrns
        $('#arplist').empty();
        $.get('/arps/LIST', r => {
            r.sort(function(a, b) {
                $a = a.toLowerCase().replace(/^[0-9]+-/, '');
                $b = b.toLowerCase().replace(/^[0-9]+-/, '');

                if ($a < $b) return -1;
                if ($a > $b) return 1;
                return 0;
            });

            r.forEach(l => {
                let $item = `<li><div>${l}</div> <button data-item="${l}">Remove</button></li>`;
                $('#arplist').append($item);
            });
            $('#count').text(` (${r.length})`);

            $('#arplist button').click(function(e) {
                $item = $(this).data('item');
                $.post('/arps/REMOVE', $item, r => {
                    if (r.error) {
                        alert(r.message);
                    } else {
                        getArps();
                    }
                });
            });
        });
    }


    /* upload multiple files */
    function handleUpload() {
        $fdata = new FormData();
        let $files = $('#fupload').get(0).files;
        for (let i = 0; i < $files.length; i++) {
            if (!$files[i].name.endsWith(".mid")) {
                alert('Error: Please Upload Midi Files Only');
                return;
            }
            $fdata.append(`file[${i}]`, $files[i]);
        }

        if ($files.length) {

            $.ajax({
                url: 'arps/ADD',
                data: $fdata,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                enctype: 'multipart/form-data',
                type: 'POST', // For jQuery < 1.9
                success: function(r) {
                    if (r.error) {
                        alert(r.message);
                    } else {
                        getArps();
                        alert('Files Uploaded!! Make Sure To ReStart Your Device for changes to take Effet!')
                    }
                }
            });

        }
    }

    function getBackup() {
        location.href = ('/arps/DOWNLOAD');
        return;

        $.get('/arps/DOWNLOAD', function(r, textStatus, xhr) {
            if (!xhr.getResponseHeader('content-type') == 'application/octet-stream') {
                alert('Error: ' + r.MESSAGE);
                return;
            }
            let blob = new Blob([r], {
                type: 'application/octet-stream'
            });
            var disposition = xhr.getResponseHeader('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
            }

            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                window.navigator.msSaveBlob(blob, filename);
            } else {
                var URL = window.URL || window.webkitURL;
                var downloadUrl = URL.createObjectURL(blob);

                if (filename) {
                    // use HTML5 a[download] attribute to specify filename
                    var a = document.createElement("a");
                    // safari doesn't support this yet
                    if (typeof a.download === 'undefined') {
                        window.location.href = downloadUrl;
                    } else {
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                    }
                } else {
                    window.location.href = downloadUrl;
                }

                setTimeout(function() {
                    URL.revokeObjectURL(downloadUrl);
                }, 100); // cleanup
            }
        });

    }

    function removeAll() {
        if (!confirm("This action will Delete All Arp Pattern Midis From your Device!\n Take Backup First!! \n Are you Sure?")) return;
        $.get('/arps/CLEAR', function(r) {
            if (r.error) {
                alert(r.message);
            } else {
                getArps()
            };
        });

    }
    //end jquery
});