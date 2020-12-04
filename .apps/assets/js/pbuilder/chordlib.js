/**
 * COPYRIGHT © Amit Talwar www.amitszone.com
 * **/
const ERR = {
    name: "error",
    role: "error",
    notes: []
};
let CHORDLIB = {
    NOTES: "C,C#,D,D#,E,F,F#,G,G#,A,A#,B,C,C#,D,D#,E,F,F#,G,G#,A,A#,B,C,C#,D,D#,E,F,F#,G,G#,A,A#,B".split(","),
    SCALES: {
        Major: {
            NOTES: [0, 2, 4, 5, 7, 9, 11],
            NAME: "Major"
        },
        NMinor: {
            NOTES: [0, 2, 3, 5, 7, 8, 10],
            NAME: "Natural Minor"
        }
    },
    CHORDS: {
        MISC: {
            TYPE: ["MUTE", "bII", "bIII", "bV", "bVI", "bVII", "bii", "biii", "biv", "bv", "bvi", "bvii"],
            FORMULA: ['0'],
            SYMBOL: "",
            NAME: "MISC"

        },
        MAJ: {
            TYPE: ["I", "II", "III", "IV", "V", "VI", "VII"],

            FORMULA: [0, 4, 7],
            SHIFT: 0,
            SYMBOL: "",
            NAME: "Major",
        }
        ,
        MIN: {
            TYPE: ["i", "ii", "iii", "iv", "v", "vi", "vii"],
            //            SCALE: [0, 2, 3, 5, 7, 8, 10],

            FORMULA: [0, 3, 7],
            SHIFT: 0,
            SYMBOL: "m",
            NAME: "Minor",

        },
        DIM: {
            TYPE: ["Idim", "IIdim", "IIIdim", "IVdim", "Vdim", "VIdim", "VIIdim"],

            FORMULA: [0, 3, 6],
            SHIFT: 0,
            SYMBOL: "dim"
            ,
            NAME: "Diminished",
        },


        SUS2: {
            TYPE: ["ISus2", "IISus2", "IIISus2", "IVSus2", "VSus2", "VISus2", "VIISus2"],

            FORMULA: [0, 2, 7],
            SHIFT: 0,
            SYMBOL: "Sus2",
            NAME: "Suspended 2"
        },
        SUS4: {
            TYPE: ["ISus4", "IISus4", "IIISus4", "IVSus4", "VSus4", "VISus4", "VIISus4"],

            FORMULA: [0, 5, 7],
            SHIFT: 0,
            SYMBOL: "Sus4"
            ,
            NAME: "Suspended 4",
        },

        MAJINV6: {
            TYPE: ["I6", "II6", "III6", "IV6", "V6", "VI6", "VII6"],

            FORMULA: [4, 7, 12],
            SHIFT: 0,
            SYMBOL: "6"
            ,
            NAME: "Major Ist INV",

        },
        MAJINV64: {
            TYPE: ["I6/4", "II6/4", "III6/4", "IV6/4", "V6/4", "VI6/4", "VII6/4"],

            FORMULA: [7, 12, 16],
            SHIFT: 0,
            SYMBOL: "6/4"
            ,
            NAME: "Major 2nd INV",

        },
        MININV6: {
            TYPE: ["i6", "ii6", "iii6", "iv6", "v6", "vi6", "vii6"],

            FORMULA: [3, 7, 12],
            SHIFT: 0,
            SYMBOL: "m6"
            ,
            NAME: "Minor 1st INV",
        },
        MININV64: {
            TYPE: ["i6/4", "ii6/4", "iii6/4", "iv6/4", "v6/4", "vi6/4", "vii6/4"],

            FORMULA: [7, 12, 15,],
            SHIFT: 0,
            SYMBOL: "m6/4"
            ,
            NAME: "Minor 2nd INV ",
        },
        S7: {
            TYPE: ["I7", "II7", "III7", "IV7", "V7", "V7", "VII7"],

            FORMULA: [0, 4, 7, 10],
            SHIFT: 0,
            SYMBOL: "7"
            ,
            NAME: "7th",
        },
        MS7: {
            TYPE: ["IM7", "IIM7", "IIIM7", "IVM7", "VM7", "VIM7", "VIIM7"],

            FORMULA: [0, 4, 7, 11],
            SHIFT: 0,
            SYMBOL: "maj7"
            ,
            NAME: "Major 7ths",
        },

        mS7: {
            TYPE: ["i7", "ii7", "iii7", "iv7", "v7", "vi7", "vii7"],

            FORMULA: [0, 3, 7, 10],
            SHIFT: 0,
            SYMBOL: "m7",
            NAME: "Minor 7ths",
        },
        MAdd9: {
            TYPE: ["Iadd9", "IIadd9", "IIIadd9", "IVadd9", "Vadd9", "VIadd9", "VIIadd9"],

            FORMULA: [0, 4, 7, 14],
            SHIFT: 0,
            SYMBOL: "add9",
            NAME: "Added 9ths",
        }
        ,
        N9: {
            TYPE: ["I9", "II9", "III9", "IV9", "V9", "VI9", "VII9"],

            FORMULA: [0, 4, 7, 9, 14],
            SHIFT: 0,
            SYMBOL: "9",
            NAME: "9",
            NAME: "9ths",
        },

        mN9: {

            TYPE: ["i9", "ii9", "iii9", "iv9", "v9", "vi9", "vii9"],

            FORMULA: [0, 3, 7, 9, 14],
            SHIFT: 0,
            SYMBOL: "9"
            ,
            NAME: "Minor 9ths",
        },


        m7b5: {
            TYPE: ["i7b5", "ii7b5", "iii7b5", "iv7b5", "v7b5", "vi7b5", "vii7b5"],

            FORMULA: [0, 3, 6, 10],
            SHIFT: 0,
            SYMBOL: "m7b5"
            ,
            NAME: "Minor7b5",
        },
        aug: {
            TYPE: ["Iaug", "IIaug", "IIIaug", "IVaug", "Vaug", "VIiaug", "VIIaug"],

            FORMULA: [0, 4, 8],
            SHIFT: 0,
            SYMBOL: "aug"
            ,
            NAME: "Augumented",
        },
        aug7: {
            TYPE: ["Iaug7", "IIaug7", "IIIaug7", "IVaug7", "Vaug7", "VIiaug7", "VIIaug7"],

            FORMULA: [0, 4, 8, 10],
            SHIFT: 0,
            SYMBOL: "aug7"
            ,
            NAME: "Augumented 7s",
        },



    }

    ,
    getChord(KEY, SCALE, OCTAVE, TYPE) {
        $KEY = CHORDLIB.NOTES.findIndex(v => v == KEY);
        $chords = CHORDLIB.CHORDS;
        for (let i = 0; i < Object.keys($chords).length; i++) {
            $search = $chords[Object.keys($chords)[i]].TYPE;
            $root = $search.findIndex($T => $T === TYPE)
            if ($root >= 0) {
                $formula = $chords[Object.keys($chords)[i]].FORMULA;

                $scale = CHORDLIB.SCALES[SCALE].NOTES;
                $shift = 12 * $chords[Object.keys($chords)[i]].SHIFT;
                $symb = $chords[Object.keys($chords)[i]].SYMBOL;
                switch ($symb) {
                    case '6':
                    case '6/4': $symb = '/' + CHORDLIB.NOTES[$KEY + $formula[0] + $scale[$root]];
                        break;
                    case 'm6':
                    case 'm6/4': $symb = 'm/' + CHORDLIB.NOTES[$KEY + $formula[0] + $scale[$root]];
                        break;
                }
                $name = CHORDLIB.NOTES[$KEY + $scale[$root]] + $symb;
                $na = $formula.map(function (d) {
                    return $shift + $KEY + $scale[$root] + d + (OCTAVE * 12);
                });
                if ($('#bass').is(':checked') && $na[0] > 24) {
                    $na.splice(0, 0, ($na[0] - 24));
                }
                return {
                    name: $name,
                    role: "Normal",
                    notes: $na
                };
            }
        }
        return ERR;
    },
    getProgression(KEY, SCALE, OCTAVE, progression, error = true) {

        $P = progression.split(" ");
        $O = [];
        for (let i = 0; i < $P.length; i++) {
            let $c = CHORDLIB.getSingleChord(KEY, SCALE, OCTAVE, $P[i]);
            if ($c.name != 'error') {
                $O.push($c);
            } else {
                if (error) {
                    alert('Error in Progression:  ' + $P[i] + ' is incorrect');

                } else {
                    console.error('Error in Progression:  ' + $P[i] + ' is incorrect');
                }
                return [];


            }
        }

        return $O;
    },

    getSingleChord(KEY, SCALE, OCTAVE, $PC) {
        $ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];
        $lROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii"];
        $shift = 0;
        $i = $PC;
        if ($PC == 'MUTE') return {
            name: "MUTE",
            role: "Normal",
            notes: [0]
        }
        if ($i.indexOf('-') > 0) { $s = $i.split('-'); $i = $s[0]; $shift = parseInt($s[1]) * -1 }
        else if ($i.indexOf('+') > 0) { $s = $i.split('+'); $i = $s[0]; $shift = parseInt($s[1]) }

        if ($i.indexOf('b') == 0) {  // we have a flat chord
            $i = $i.replace('b', '');
            $iU = $i.toUpperCase();
            $KI = parseInt($ROMAN.indexOf($i));
            $min = false;
            if ($KI < 0) {
                $KI = parseInt($lROMAN.indexOf($i));
                $min = $KI >= 0;
            }
            if ($KI < 0) { //invalid chord
                return ERR;
            }
            $tsp = parseInt(CHORDLIB.NOTES.findIndex(v => v == KEY));
            $KN = parseInt(CHORDLIB.SCALES[SCALE].NOTES[$KI]) - 1 + $tsp;
            $KY = CHORDLIB.NOTES[$KN];
            $cscale = $min ? "NMinor" : "Major";

            $c = CHORDLIB.getChord($KY, $cscale, OCTAVE + 2 + $shift, $min ? 'i' : 'I'); //return the major chord flatted
        }
        else { $c = CHORDLIB.getChord(KEY, SCALE, OCTAVE + 2 + $shift, $i); }

        return $c;

    }

    //methods ************
};

