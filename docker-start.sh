#!/bin/sh
# Assistant API in the background (restarted if it ever stops), nginx in the foreground.
(
  while true; do
    node /opt/assistant/index.mjs
    echo "assistant api stopped, restarting in 2s" >&2
    sleep 2
  done
) &

exec nginx -g 'daemon off;'
