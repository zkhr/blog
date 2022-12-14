#!/bin/sh
#
# Runs the various scripts needed to prerender site content.
#
#  Usage:
#
#    ./codegen/build.sh

/usr/bin/node ./codegen/refresh_index.mjs
/usr/bin/node ./codegen/refresh_blog.mjs
./codegen/refresh_css.sh

echo "\nDone! Have a nice day!";
