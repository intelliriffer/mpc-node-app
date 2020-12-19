#!/bin/sh
source $TKGL_PATH_FILE

NJS=$MOUNT_POINT/.nodejs/bin/node
SJS=$MOUNT_POINT/.apps/server.js
echo "Starting Node Js Server: $NJS $SJS">>$TKGL_LOG
$NJS $SJS & >>$TKGL_LOG
