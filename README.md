# MPC / FORCE NodeJs App

This App will will be installed on the root of of your internal sd card un .apps directory and required nodejs to be installed too.

# Purpose

The primary purpose is to laydown a basic primary framework for rapid app development of any kind the user may desire in javascript/Node Js.
The apps build into this are mainly my use cases but can help understand how things are laid out and how you can build your own if you so desire.

**Basically:**

1. Define Endpoints in /api/ENDPONTS.js for backend handlers
2. Copy your Client code to /assets/ (css/js .. ).
3. [The Prog Bulilder source code](https://github.com/intelliriffer/mpc-node-app/blob/master/.apps/api/endpoints/pbuilder.js) is more or less a complete example of how you would go about injecting client scripts and rendering partial templates etc to build together a bit more involved app.

# Rquirements

1. **SSH Access to your MPC / Force Device (Custom Image)**
   Please visit the [MPC-LiveXplore Project](https://github.com/TheKikGen/MPC-LiveXplore), Read Through and Obtain Custom Image and Scripts to Build / Modify your Own Images to Flash to your device : [https://github.com/TheKikGen/MPC-LiveXplore](https://github.com/TheKikGen/MPC-LiveXplore)

2. You will need a USB Pen Drive formatted to Ext4 Format with tkgl Bootstrap working. (you can also likely format pen drive in your Force/MPC).

3. Download Install tkgl Bootstrap in your pen drive : [TKGL BootStrap](https://github.com/TheKikGen/MPC-LiveXplore-bootstrap)

4. **NodeJs for Arm7**

   1. Download and Extract NodeJs from here : [NodeJs Arm7](https://drive.google.com/file/d/1Y4FdNeYNau-BKtCO5lhMSNCaMCIoISS7/view?fbclid=IwAR2551izayxRkYAZWy0WoclGUu5sUEUB_hvo7Lqo3uycuhpYUgaw36yV4ik)

   2. Copy/ssh the .nodejs directory to root of your pen drive.

## Installation

1.  **Installing This APP**

    1.  Download this app from Github and extract. [Download](https://github.com/intelliriffer/mpc-node-app?fbclid=IwAR3W6LrZX4PXBUchK8UDCvYnIqtMzEK6RfaN1cL1fC9SVo6l8UZ4wXH2uSU)
    2.  Copy .apps directory to root of your pen drive.
    3.  Copy the "tkgl_bootstrap" and "tkgl_mod_nodejs.sh" files to the .tkgl_bootstrap directroy on your pen drive. These will automatically start the nodeJs server when your device starts.

2.  **Setting permissions**
    1.If you are coming from windows or other system the file permissions might be screwed. Run the following commands to fix these.

    chmod +x /media/[yourpendrivename]/.nodejs/bin/n\*

    chmod +x /media/[yourpendrivename]/.tkgl_bootstrap/scripts/\*.sh

3.  **Setting/Insalling SSL Guide:** [SSL Setup Guide](README-SSL.md)

~ Amit Talwar
[www.amitszone.com](http://www.amitszone.com)

# WARNING

The Code is functional,but is unoptimized, needs refactoring and may need commenting (though I tied to keep it as simeple as possible) which will take place over due course of time.
