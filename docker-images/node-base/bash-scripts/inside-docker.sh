#!/bin/bash

if [ -f /.dockerenv ]
then
    echo 'inside docker'
else
    echo 'outside docker'
fi

exit 1
