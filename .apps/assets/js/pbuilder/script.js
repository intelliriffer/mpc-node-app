/**
 * COPYRIGHT © Amit Talwar www.amitszone.com
 * **/
window.$PROGRESSION = [];
var midi_output = null;
var midi_input = null;
var midi_outputch = 1;
var midi_inputch = 1;
var MIDI_ENABLED = false;
var $SEQ = []; //current progression in memory
const PLAYMODES = {
    CHORD: 0,
    "STRUM FAST": 10,
    "STRUM MED": 50,
    "STRUM SLOW": 90,
    "ARP FAST": 180,
    "ARP SLOW": 500
}
var playing = false;
var seqplaying = false;
var playQ = [];
var $dataLIB = [];




$(document).ready(function () {
    buildInternal();

    function buildInternal() {
        $.get('/pbuilder/LIST', function (r) {

            if (r.ERROR) {
                alert(r.MESSAGE);
                $('#container').empty().append(`<h2 class="error">${r.MESSAGE.replace("\n", "<br/><br/>")}</h2>`)
                throw new Error(r.MESSAGE);
            }

            let DATA = r.DATA;

            $o = '<div class="libcat internalLib">';
            $o += '<h3 class="title">Manage Device Progressions ';
            $o += '</h3><ol>';
            $.each(DATA, function (i) {
                let $ofile = DATA[i];
                if (!$ofile.startsWith('.')) {
                    $fn = $ofile.split('.').slice(0, -1).join('.')
                    $o += '<li class="intlib-item"><div><div>' + $fn;
                    $o += '</div><button class="rem" data-file="' + $ofile + '">x</button>';
                    $o += '</div></li> ';

                }
            });
            $o += '</ol></div>';

            $('#libcontents .internal').empty().append($o);
            $('.intlib-item button').click(function (e) {
                $file = $(this).data('file');
                if (confirm(`Are You Sure you want to DELETE : ${$file} from your device`)) {
                    $.post("/pbuilder/REMOVE", $file, function (r) {
                        if (r.ERROR) {
                            alert(r.MESSAGE);
                        } else {
                            buildInternal();
                        }
                    });
                }
            });
        });
    }





    $.getJSON('/static/js/pbuilder/library.json', function (data) {
        $dataLIB = data;
        buildLIB();
    });


    $.each(CHORDLIB.CHORDS, function ($crd) {
        let $c = CHORDLIB.CHORDS[$crd];
        $o = '<div class="set"><h3 class="title">';
        $o += $c.NAME;
        $o += '</h3 > <ul class="chords">';
        for (let i = 0; i < $c.TYPE.length; i++) {
            $o += '<li class="crd roman">' + chordFormat($c.TYPE[i]) + '</li>';
        }
        $o += '</ul></div>';
        $('#panel').append($o);

    });
    for (i = 0; i <= 11; i++) {
        $('#key').append('<option value="' + CHORDLIB.NOTES[i] + '">' + CHORDLIB.NOTES[i] + '</option>');
    }
    $.each(CHORDLIB.SCALES, function (k) {
        $('#scale').append('<option value="' + k + '">' + CHORDLIB.SCALES[k].NAME + '</option>');
    });
    clear();
    $('.crd').on('click', function (e) {
        window.$PROGRESSION.push($(this).text());
        build();
    });
    $('#CLEAR').on('click', clear);
    $('#SAVE').on('click', save);
    $('#PLAY').on('click', playSeq);
    $('.dialog-close').on('click', function (e) {
        $('#' + $(this).data('dialog' + '')).hide();
    });
    $('#HELP').on('click', function (e) {
        $('#' + $(this).data('dialog')).show();
    });
    $('#UNDO').on('click', function () {
        window.$PROGRESSION.pop()
        build();
    });
    $('.inc', '.dec').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $('#key,#scale,#octave,#bass').on('click', build);

    function build(update = true) {

        if (update) {
            $('#pinput').removeClass('ierror');
            $('#pinput').val(window.$PROGRESSION.join(' '));
        }

        buildSeq();
        $('#progression ul').empty();
        $.each(window.$PROGRESSION, function (f) {
            $li = '<li class="trigger" data-index="' + f + '" data-chord="' + window.$PROGRESSION[f] + '">';
            $li += '<span class="pcrd roman"><span>' + chordFormat(window.$PROGRESSION[f]) + '</span><span class="subcrd">' + getChordName(window.$PROGRESSION[f]) + '</span></span>';

            $li += '<div class="btns">';
            if (window.$PROGRESSION[f] != "MUTE") {
                $li += '<input data-index="' + f + '" class="dec" type="button" title="Octave Down" value="-" />';
                $li += '<input data-index="' + f + '"  class="inc" title="Octave Up" type="button" value="+" />';
            }
            $li += '<input data-index="' + f + '"  class="rem" type="button" title="Delete" value="x" />';
            $li += '</div>';

            $li += '<div class="btns">';

            $li += '<input data-index="' + f + '" class="bleft" type="button" title="Move Left" value="<" />';
            $li += '<input data-index="' + f + '"  class="bdup" title="DUPLICATE" type="button" value="=" />';

            $li += '<input data-index="' + f + '"  class="bright" type="button" title="Move Right" value=">" />';
            $li += '</div>';


            $li += '</li > ';
            $('#progression ul').append($li);
        });

        // build optimized in memory chord object


        $('.rem').on('click', function (e) {
            e.stopPropagation();
            window.$PROGRESSION.splice(parseInt($(this).data('index')), 1);
            build();

        });

        $('.inc').on('click', function (e) {
            e.stopPropagation();
            setOctave(1, $(this).data('index'));
        });
        $('.dec').on('click', function (e) {
            e.stopPropagation();
            setOctave(-1, $(this).data('index'));
        });

        $('.bleft').on('click', function (e) {

            e.stopPropagation();
            setPos(-1, $(this).data('index'));
        });

        $('.bright').on('click', function (e) {
            e.stopPropagation();
            setPos(1, $(this).data('index'));
        });
        $('.bdup').on('click', function (e) {
            e.stopPropagation();
            $pos = $(this).data('index');
            $item = window.$PROGRESSION[$pos];
            window.$PROGRESSION.splice($pos, 0, $item);
            build();
        });





        if (window.$PROGRESSION.length) {
            $('.pbuttons').show();

            $('.trigger').on('mousedown touchstart', function (f) {
                playChord($(this).data('chord'));
            });
            $('.trigger').on('mouseup touchend touchcancel', function (f) {
                playChord($(this).data('chord'), true);
            });
            /*$('.trigger').mouseup(function (f) {
                console.log('mouseup');
                playChord($(this).data('chord'), true);
            });*/
            $('.trigger').hover(function (f) {

                $(this).find('.pcrd').html('<span>' + getChordName($(this).data('chord')) + '<span></span>');
            },
                function (f) {
                    $(this).find('.pcrd').html('<span>' + chordFormat($(this).data('chord')) + '</span><span class= "subcrd" > ' + getChordName($(this).data('chord')) + '</span > ');
                });

        } else {

            // clear();
        }

    }

    $('#pinput').on('input change', fromInput);
    function fromInput(e) {
        {
            $octave = parseInt($('#octave').val());
            $key = $('#key').val();
            $pscale = $('#scale').val();
            $pstring = $('#pinput').val().trim();
            $pstring = $pstring.replace(/  +/g, ' ');

            if ($pstring == '') {
                clear();
                return;
            }
            $chords = CHORDLIB.getProgression($key, $pscale, $octave, $pstring, false);
            if ($chords.length) {
                window.$PROGRESSION = Array.from($pstring.split(' '));
                $('#pinput').removeClass('ierror');
            } // validated 
            else { //error
                $('#pinput').addClass('ierror');
                window.$PROGRESSION = [];
            }
            build(false);

        }
    }

    function clear() {
        window.$PROGRESSION = [];
        $('.pbuttons').hide();
        $('#progression').empty();
        build();
        //  $('#pinput').val('');
        $('#progression').append('<ul></ul>');

    }
    function setPos(factor, pos) {

        if (factor == 1) {
            if (pos < window.$PROGRESSION.length - 1) {
                $temp = window.$PROGRESSION[pos + 1];
                window.$PROGRESSION[pos + 1] = window.$PROGRESSION[pos];
                window.$PROGRESSION[pos] = $temp;
                build();
            }

        } else {

            if (pos > 0) {
                $temp = window.$PROGRESSION[pos - 1];
                window.$PROGRESSION[pos - 1] = window.$PROGRESSION[pos];
                window.$PROGRESSION[pos] = $temp;
                build();
            }

        }
    }

    function setOctave(factor, item) {

        let lastVAL = 0;
        let $item = window.$PROGRESSION[item];
        if ($item.indexOf('-') > 0) {
            $s = $item.split('-');
            $item = $s[0];
            lastVAL = parseInt($s[1]) * -1;

        } else if ($item.indexOf('+') > 0) {
            $s = $item.split('+');
            $item = $s[0];
            lastVAL = parseInt($s[1]);
        }
        if ($item == '') return;
        let newVAL = lastVAL + factor;

        $valid = newVAL + parseInt($('#octave').val());

        if ($valid >= -2 && $valid <= 6) {
            if (newVAL != 0) {
                if (newVAL > 0) {
                    $item += '+' + newVAL;
                } else {
                    $item += newVAL;
                }

            } else {

            }
            window.$PROGRESSION[item] = $item;
            build();
        }


    }

    function getChordName($C) {
        if ($C == "MUTE") return $C;
        $chord = getSeqChord($C);
        return chordNameFormat($chord.name);

    }
    function chordNameFormat($c) {

        let $names = CHORDLIB.NOTES.slice(0, 13);

        for (let i = 0; i < $names.length; i++) {
            let $pos = $c.indexOf($names[i]);
            if ($pos >= 0 && ($c.indexOf('#') == $names[i].indexOf('#'))) {

                let $chrd = $names[i];
                if ($chrd != $c) {

                    if ($c.substr($chrd.length, 1) === 'm') {

                        $chrd = $chrd + 'm';
                    }
                    //   $c = $chrd + '<sup>' + $c.substr($chrd.length) + '</sup>';
                }
                return $c

            }

        }
        return $c;
    }

    function getName() {
        $pname = $('#pname').val().trim();
        if ($pname == '') {
            alert('Please Provide Name');
            return false;
        }
        if (!window.$PROGRESSION.length) {
            alert('Please Add Few Chords To Progression');
            return false;

        }
        return $pname;
    }

    function getPatch($pname) {
        $octave = parseInt($('#octave').val());
        $key = $('#key').val();
        $pscale = $('#scale').val();
        $pstring = window.$PROGRESSION.join(' ').trim();
        $chords = CHORDLIB.getProgression($key, $pscale, $octave, $pstring);
        $chords[0].role = "Root";
        $OP = {
            progression: {
                name: $pname,
                rootNote: $key,
                scale: CHORDLIB.SCALES[$pscale].NAME,
                recordingOctave: $octave,
                chords: $chords
            }
        }

        $contents = JSON.stringify($OP, null, 2);
        return $contents;

    }

    function save() {
        $pname = getName();
        if ($pname === false || $pname == undefined) return;
        $contents = getPatch($pname);
        $payload = {
            data: $contents,
            file: `${$pname}.progression`
        };
        $.post('/pbuilder/SAVE', JSON.stringify($payload), function (r) {
            if (r.ERROR) {
                alert(r.MESSAGE);
            } else {
                buildInternal();
                alert(`${$pname} was Saved!`);
            }
        });
    }

    function localsave() {
        $pname = getName();
        if ($pname === false) return;
        $contents = getPatch($pname);
        var file;
        var properties = { type: 'application/.progression' };
        file = new Blob([$contents], properties);
        saveBLOB(file, $pname + '.progression');
    }

    function saveBLOB(blob, fileName) {
        var url = window.URL.createObjectURL(blob);
        var anchorElem = document.createElement("a");
        anchorElem.style = "display: none";
        anchorElem.href = url;
        anchorElem.download = fileName;

        document.body.appendChild(anchorElem);
        anchorElem.click();

        document.body.removeChild(anchorElem);

        // On Edge, revokeObjectURL should be called only after
        // a.click() has completed, atleast on EdgeHTML 15.15048
        setTimeout(function () {
            window.URL.revokeObjectURL(url);
        }, 1000);
    }

    //* webmidi **/

    WebMidi.enable(function (err) {


        function showError() {
            $("#midi").html(
                '<h3 style="color:red"  class="warn">Error! Your Browser Does not Support WebMidi<br> Midi Playback disabled</h2>'
            );

        }

        function renderMidiInSelect() {
            $Inport =
                '<div class="prow"><label>Midi In / Ch:</label><select id="midiINPort">';
            WebMidi.inputs.forEach(function (o) {
                $Inport += '<option value="' + o.name + '">' + o.name + "</option>";
            });
            $Inport += '</select><select id="midiINCH">';
            for (let i = 1; i <= 16; i++) {
                $Inport += `<option value="${i}">${i}</option>`;
            }
            $Inport += "</select></div>";
            $("#midi").append($Inport);
        }

        function renderMidiOutSelect() {
            $Outport =
                '<div class="prow"><label> Midi Out / Ch: </label><select id="midiOUTPort">';
            WebMidi.outputs.forEach(function (o) {
                $Outport += '<option value="' + o.name + '">' + o.name + "</option>";
            });
            $Outport += '</select><select id="midiOUTCH">';
            for (let i = 1; i <= 16; i++) {
                $Outport += `<option value="${i}">${i}</option>`;
            }
            $Outport += "</select></div>";

            $("#midi").append($Outport);
        }
        function renderPlayModeSelect() {
            $Outmode =
                '<div class="prow"><label> Preview: </label><select id="PMODE">';
            Object.keys(PLAYMODES).forEach(function (m) {
                $Outmode += '<option value="' + PLAYMODES[m] + '">' + m + "</option>";
            });
            $Outmode += "</select></div>";

            $("#midi").append($Outmode);
            $('#PMODE').on('change', function (e) {
                playQ = [];
            });
        }

        if (err) {
            showError();
        } else {
            renderMidiInSelect();
            renderMidiOutSelect();
            renderPlayModeSelect();
            initializeMidiPorts();
            try {
                midi_input.addListener("noteon", midi_inputch, NoteMsg);
                midi_input.addListener("noteoff", midi_inputch, NoteMsg);
                midi_input.addListener('channelaftertouch', midi_inputch, cAft);
                midi_input.addListener('pitchbend', midi_inputch, pMsg);
                midi_input.addListener("controlchange", midi_inputch, ccMsg);
                MIDI_ENABLED = true;

            } catch (e) {
                alert('Error Setting Midi Input - Please Select Correct Midi In Port');
            }

        }
        function cAft(e) {
            midi_output.sendChannelAftertouch(e.value, midi_outputch);
        }
        function pMsg(e) {
            midi_output.sendPitchBend(e.value, midi_outputch);
        }
        function ccMsg(e) {
            midi_output.sendControlChange(e.controller.number, e.value, midi_outputch);
        }
        function NoteMsg(e) {
            $t = e.note.number - 36;
            if ($t < 0 || $t >= window.$PROGRESSION.length) {
                if (e.type == 'noteon') {
                    midi_output.playNote(e.note.number, midi_outputch, { rawVelocity: true, velocity: e.rawVelocity });
                } else {

                    midi_output.stopNote(e.note.number, midi_outputch, { rawVelocity: true, velocity: e.rawVelocity });
                }
                return;
            }
            $c = window.$PROGRESSION[$t];

            $chord = $SEQ[$t];
            $ltime = WebMidi.time;
            $ptime = parseInt($('#PMODE').val());
            if (e.type == 'noteon') {
                $span = 0;//$ltime;
                $('#progression li:eq(' + parseInt($t) + ')').addClass('active');
                if ($c == "MUTE") return;
                $.each($chord.notes, function (n) {
                    midi_output.playNote($chord.notes[n], midi_outputch, { rawVelocity: true, velocity: e.rawVelocity, time: '+' + $span });
                    $span += $ptime;
                });

            } else {
                $span = 0;// $ltime;
                $.each($chord.notes, function (n) {
                    midi_output.stopNote($chord.notes[n], midi_outputch, { rawVelocity: true, velocity: e.rawVelocity, time: '+' + $span });
                    //$span += $ptime;
                });
                $('#progression li:eq(' + parseInt($t) + ')').removeClass('active');


            }


        }

        function initializeMidiPorts() {
            $cInport = $.cookie("AKAImidiINport") || "";
            $cOutport = $.cookie("AKAImidiOUTport") || "";
            $cInCH = $.cookie("AKAImidiINCH") || "1";
            $cOutCH = $.cookie("AKAImidiOUTCH") || "1";
            if ($cInport != "") {
                $("#midiINPort").val($cInport);
            }
            if ($cOutport != "") {
                $("#midiOUTPort").val($cOutport);
            }
            $("#midiINCH").val($cInCH);
            $("#midiOUTCH").val($cOutCH);

            setPort(false);
            $("#midiINPort,#midiOUTPort,#midiINCH,#midiOUTCH").on("change", setPort);
        }
        function setPort(reload = true) {
            setCookie("AKAImidiINCH", $("#midiINCH").val());
            setCookie("AKAImidiOUTCH", $("#midiOUTCH").val());
            setCookie("AKAImidiINport", $("#midiINPort").val());

            midi_input = WebMidi.getInputByName($("#midiINPort").val());
            setCookie("AKAImidiOUTport", $("#midiOUTPort").val());
            midi_output = WebMidi.getOutputByName($("#midiOUTPort").val());
            midi_inputch = $("#midiINCCH").val();
            midi_outputch = $("#midiOUTCH").val();
            if (reload) location.reload();
        }
    }, false);   //* End webmidi **/
    function setCookie(name, val) {
        $.cookie(name, val, {
            expires: 365,
        });
    }
    function getCookie(name, val) {
        return $.cookie(name);
    }

    function playChordAuto($C, $duration = 1200) {
        if (!MIDI_ENABLED) return;
        if (playing || $C == "MUTE") return;

        let $chord = getSeqChord($C);
        playing = true;
        $ptime = parseInt($('#PMODE').val());
        $n = $chord.notes.length;
        $span = 0;
        $.each($chord.notes, function (n) {
            midi_output.playNote($chord.notes[n],
                midi_outputch,
                { duration: $duration + ($n * $ptime) - $span, rawVelocity: true, velocity: 100, time: '+' + $span });
            $span += $ptime;
        });
        setTimeout(() => {
            playing = false;
        }, $duration + $span + 10);

    }
    function playChord($C, OFF = false,) {
        if (!MIDI_ENABLED) return;
        if ($C == "MUTE") return;

        let $chord = getSeqChord($C);
        $ptime = parseInt($('#PMODE').val());
        $n = $chord.notes.length;
        $span = 0;

        if (!OFF) {
            $.each($chord.notes, function (n) {
                midi_output.playNote($chord.notes[n],
                    midi_outputch,
                    { rawVelocity: true, velocity: 100, time: '+' + $span });
                $span += $ptime;
            });
        } else { //note off
            midi_output.stopNote($chord.notes, midi_outputch, { rawVelocity: true, velocity: 0 });
        }
    }

    function playSeq() {
        if (playing || seqplaying) { playQ = [] } else { playQ = Array.from(window.$PROGRESSION); }
        processQ();

    }

    function processQ() {
        if (playQ.length) {
            $p = playQ.shift();
            while ($p == "MUTE") {
                $p = playQ.shift();
                if ($p == undefined) {
                    setPlayMode(false);
                    $('#progression li').removeClass('active');
                    return;
                }
            }
            setPlayMode(true);
            $('#progression li').removeClass('active');
            $elm = (window.$PROGRESSION.length - playQ.length) - 1;
            $('#progression li:eq(' + parseInt($elm) + ')').addClass('active');
            let $octave = parseInt($('#octave').val());
            let $key = $('#key').val();
            let $pscale = $('#scale').val();
            let $chord = CHORDLIB.getSingleChord($key, $pscale, $octave, $p);
            $ptime = parseInt($('#PMODE').val());
            $chordtime = $ptime * $chord.notes.length;
            playChordAuto($p, 1000);
            setTimeout(() => {
                processQ();
            }, 1500 + $chordtime);


        } else {

            setPlayMode(false);

            $('#progression li').removeClass('active');
        }

    }
    function setPlayMode(mode) {
        seqplaying = mode;
        if (mode) {
            $('#PLAY').val('STOP');
            $('#PLAY').addClass('playing');

        } else {
            $('#PLAY').val('PLAY');
            $('#PLAY').removeClass('playing');
        }
    }

    function buildLIB() {
        $('#libcontents .templates').empty();
        $.each($dataLIB, function (i) {
            $cat = $dataLIB[i];
            $o = '<div class="libcat">';
            $o += '<h3 class="title">';
            $o += $cat.NAME;

            $o += '</h3><ol>';
            $.each($cat.ITEMS, function (ii) {
                if ($cat.ITEMS[ii].PROGRESSION.trim() == '') return;
                $o += '<li class="lib-item" data-categoryid="' + i + '" data-index="' + ii + '">' + $cat.ITEMS[ii].NAME;
                $o += '<span class="sub-title"> - ';
                $o += $cat.ITEMS[ii].KEY + ' ' + $cat.ITEMS[ii].SCALE;
                $o += '</span> ';
                $o += '</li> ';
            });
            $o += '</ol></div>';
            $('#libcontents .templates').append($o);
        });

        $('.lib-item').on('click', function (e) {
            let $item = $dataLIB[$(this).data('categoryid')].ITEMS[$(this).data('index')];
            let $catn = $dataLIB[$(this).data('categoryid')].NAME;
            $('#key').val($item.KEY);
            $('#scale').val($item.SCALE);
            $('#pinput').val($item.PROGRESSION).trigger('change');
            $('#pname').val($catn + '-' + $item.NAME);


        });
    }
    function chordFormat($c) {
        romans = "VII,VI,IV,III,II,V,I,vii,vi,iv,iii,ii,v,i".split(",");
        for (let i = 0; i < romans.length; i++) {
            $pos = $c.indexOf(romans[i]);
            if ($pos >= 0) {
                $ret = romans[i];
                $s = $c.split(romans[i]);
                if ($s[0] == 'b') {
                    $s[0] = '<span class="flat">b</span>';
                }
                $r = $s.slice(1).join(romans[i]);

                if ($r != '') $r = '<sup>' + $r + '</sup>';

                return $s[0] + romans[i] + $r;
            }
        }
        return $c;

    }
    function buildSeq() {
        $SEQ = [];
        if (!window.$PROGRESSION.length) return;
        $octave = parseInt($('#octave').val());
        $key = $('#key').val();
        $pscale = $('#scale').val();
        $pstring = window.$PROGRESSION.join(' ').trim();
        /*        if ($pstring == '') {
                    clear();
                    return;
                }*/
        $SEQ = CHORDLIB.getProgression($key, $pscale, $octave, $pstring, false);

        for (let i = 0; i < window.$PROGRESSION.length; i++) {

            $SEQ[i].DEGREE = window.$PROGRESSION[i];
        }
    }

    function getSeqChord($degree) {
        for (let i = 0; i < $SEQ.length; i++) {
            if ($SEQ[i].DEGREE == $degree) {
                return $SEQ[i];
            }
        }

    }
}); //end jquery
