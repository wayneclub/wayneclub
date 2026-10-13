# Website uptime monitoring

The external checker runs on AWS prod-media, independently of the website's
prod-core host. It checks https://wayneclub.com/ every 60 seconds, validates TLS,
requires HTTP 200 and the Wayne Club page marker, and sends transition alerts to
the existing Wayne Club Telegram group Alerts topic.

- Three consecutive failures trigger an outage notification.
- Two consecutive successes after an announced outage trigger recovery.
- Continuing outages are quiet. Failed Telegram deliveries retry next check.
- Existing prod-core bot Docker health checks remain unchanged (currently hourly).
- No service is automatically restarted.

Installed files on prod-media:

- `/home/ubuntu/wayneclub-uptime/monitor.py`
- `/home/ubuntu/wayneclub-uptime/telegram.env` (mode 600, directory 700; never commit)
- `/etc/systemd/system/wayneclub-uptime.service`
- `/etc/systemd/system/wayneclub-uptime.timer`
- `/var/lib/wayneclub-uptime/state.json`

Inspect with `systemctl list-timers wayneclub-uptime.timer`,
`journalctl -u wayneclub-uptime.service`, and the state file.
Disable with `sudo systemctl disable --now wayneclub-uptime.timer`.
Run regression checks with `python3 -m unittest discover -s ops/uptime`.

This detects a prod-core host outage but cannot report while prod-media is also
down. Checks originate from one AWS region and do not establish global availability.
The shared bot token must be updated here if rotated. A setup notification was
successfully delivered; failure/recovery logic was tested without taking the
production website offline. Cloudflare edge request analytics may include these
checks; the monitor does not execute JavaScript or send GA4/RUM events.
