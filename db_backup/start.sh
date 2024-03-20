#!/bin/sh
# sudo -u postgres postgres -c "config_file=/etc/postgresql.conf"

while true; do
    /auto_run.exp
    sleep 60*15  # Wait for 15 min before running again
done

