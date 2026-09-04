#!/bin/sh
set -e

# Start cron in the background (drives Laravel's scheduler via schedule:run).
cron

# Hand off to the real foreground process (Octane) as PID 1's replacement so
# it still receives signals (SIGTERM/SIGINT) directly.
exec "$@"
