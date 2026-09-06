#!/bin/sh
set -e

# cron runs jobs with an almost-empty environment — it does NOT inherit the
# variables Docker injected into this container (APP_KEY, DB_*, MAIL_*, etc.).
# Dump the current environment to a file the crontab can source before running
# artisan, so scheduled commands see the same config a manual `docker exec`
# would. Each value is single-quoted (with embedded quotes escaped) so values
# containing spaces/special characters survive being re-sourced correctly.
printenv | while IFS= read -r line; do
    name=${line%%=*}
    value=${line#*=}
    printf 'export %s=%s\n' "$name" "$(printf '%s' "$value" | sed "s/'/'\\\\''/g;1s/^/'/;\$s/\$/'/")"
done > /etc/container_env.sh

# Start cron in the background (drives Laravel's scheduler via schedule:run).
cron

# Hand off to the real foreground process (Octane) as PID 1's replacement so
# it still receives signals (SIGTERM/SIGINT) directly.
exec "$@"
