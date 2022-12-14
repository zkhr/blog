#!/bin/sh
#
# Compiles the SCSS code to CSS.
#
# To support edit-refresh (i.e. autogenerating CSS as SCSS code is updated),
# you can use the inotify-tools package
# (https://github.com/inotify-tools/inotify-tools/wiki) and create an alias:
#
#   alias watchcss='while inotifywait -e modify ./static/css/; do ./codegen/refresh_css.sh ; done'

echo "Updating ./static/css/main.css";
sass ./static/css/main.scss ./static/css/main.css
