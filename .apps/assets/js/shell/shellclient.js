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
            console.log(JSON.parse(r).ERROR);
            data = JSON.parse(r);
            $('#shelloutput').append(`<br/>${data.DATA}`);
        });
    }
});
