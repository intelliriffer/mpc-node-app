$(document).ready(() => {
    console.log("Shell ready");
    init();
    $('#CMD').change(run);
    $('#CMD').on('keypress', e => {
        if (e.which == 13) run;
    });
    $('#CMD').on('keyup', e => {
        if (e.keyCode == 27) {
            $('#CMD').val('');
            init();
        }
    });
    $('#SHELLCLEAR').click(init);
    $('#shelloutput').resizable({
        handles: 's',
        aspectRatio: false,
    });
    $('#shelllib').append(`<h1>Command Library</h1><ul id="ccommands"></ul>`);
    for (let i = 0; i < CMDLIB.length; i++) {
        $('#ccommands').append(
            `<li title="${CMDLIB[i].DESCRIPTION}" data-index="${i}">${CMDLIB[i].NAME}</li>`
        );
    }
    $('#ccommands li ').click(function (e) {
        $cmd = CMDLIB[$(this).data('index')];
        if ($cmd.hasOwnProperty('CONFIRM') && $cmd.CONFIRM == true) {
            $msg = `Are you Sure you want to Run the Command : ${$cmd.NAME}
Description: ${$cmd.DESCRIPTION}`;
            if (!confirm($msg)) return;
        }
        $ecmd = $cmd.CMD;
        if ($cmd.CMD.indexOf('??') > 1) {
            $v = prompt($cmd.PROMPT, $cmd.DEFAULT);
            $ecmd = $cmd.CMD.replace("??", $v);
        }

        $('#CMD').val($ecmd);
        run();
    });
    //end     
    function init() {
        $('#shelloutput').empty()
    }
    function run() {
        $cmd = $('#CMD').val();
        $('#shelloutput').html(`#: <span class="cmd">${$cmd}</span>`);
        $payload = JSON.stringify({
            CMD: $cmd
        });
        $.post("/shell/RUN", $payload, function (r) {

            data = JSON.parse(r);
            if (data.DATA != '') {
                $('#shelloutput').append(`<br/><br/>${data.DATA}`);
            } else { $('#shelloutput').append(`<br/>OK`); }
        });
    }
});
