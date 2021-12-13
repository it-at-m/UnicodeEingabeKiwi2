#!/bin/bash
#set -x

HOST=${1:-localhost}
PORT=${2:-8888}
ROOT=${3:-dist}
(cd $ROOT; python3 ../tools/httpServer.py $HOST $PORT)

