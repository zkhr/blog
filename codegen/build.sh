#!/bin/sh
#
# Runs the various scripts needed to prerender site content.
#
#  Usage:
#
#    ./codegen/build.sh

/usr/bin/node ./codegen/refresh_index.mjs
/usr/bin/node ./codegen/refresh_blog.mjs

echo "Done! Have a nice day!";
