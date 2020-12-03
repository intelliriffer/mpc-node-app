/* Library of shell commands use */
const CMDLIB = [
    {
        CMD: `grep -q '/dev/root / ext4 rw,' /proc/mounts && echo "/ is Read/Write" || echo "/ is Read Only!"`,
        NAME: "Check / Mount Status",
        DESCRIPTION: "Checks Whether / is Rwad Write or Read Only"
    },
    {
        CMD: `mount remount / -o rw,remount &&  grep /dev/root /proc/mounts`,
        NAME: "Mount / ReadWrite",
        DESCRIPTION: "ReMounts / for Writing"
    },
    {
        CMD: `mount remount / -o ro,remount &&  grep /dev/root /proc/mounts`,
        NAME: "Mount / ReadOnly",
        DESCRIPTION: "ReMounts /  as Read Only"
    },
    {
        CMD: `grep 'overlay\\|/dev/' /proc/mounts`,
        NAME: "List FS mounts",
        DESCRIPTION: "Lists Primary Mounts"
    },
    {
        CMD: `ls /usr/share/Akai/SME0/Arp\\ Patterns`,
        NAME: "List Arps Midis",
        DESCRIPTION: "List of Arp Pattern Midis"
    },
    {
        CMD: `dmesg | tail -n ??`,
        NAME: "Last N Dmesg ",
        DESCRIPTION: "Show Last N disgnostic messages",
        PROMPT: "Last How Many Messages?",
        DEFAULT: 10

    },
    {
        CMD: `reboot`,
        NAME: "Reboot Device",
        DESCRIPTION: "Restart Device",
        CONFIRM: true
    },



]