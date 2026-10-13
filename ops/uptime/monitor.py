"""External HTTPS monitor; notify the existing Telegram Alerts topic on transitions."""
import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path

URL = 'https://wayneclub.com/'


def probe(url=URL):
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'WayneClub-Uptime/1.0', 'Cache-Control': 'no-cache'})
        with urllib.request.urlopen(request, timeout=15) as response:
            body = response.read(512_000)
            if response.status != 200 or b'Wayne Club' not in body:
                return False, f'HTTP {response.status}, unexpected page'
            return True, 'HTTP 200, website content verified'
    except urllib.error.HTTPError as error:
        return False, f'HTTP {error.code}'
    except (OSError, TimeoutError) as error:
        return False, type(error).__name__


def transition(state, ok, detail):
    state = dict(state)
    state['failures'] = 0 if ok else state.get('failures', 0) + 1
    state['successes'] = state.get('successes', 0) + 1 if ok else 0
    state['checked_at'] = int(time.time())
    state['detail'] = detail
    message = None
    if not ok and state['failures'] >= 3 and not state.get('alerted'):
        message = f'🔴 Wayne Club 網站異常\n{URL}\n連續 3 次每分鐘檢查失敗：{detail}\n來源：AWS prod-media 外部 HTTPS 監控'
    elif ok and state['successes'] >= 2 and state.get('alerted'):
        message = f'🟢 Wayne Club 網站恢復\n{URL}\n連續 2 次檢查通過：{detail}'
    return state, message


def notify(message):
    payload = {'chat_id': os.environ['TELEGRAM_TOPIC_CHAT_ID'], 'text': message,
               'disable_web_page_preview': True}
    if os.environ.get('TOPIC_ALERTS'):
        payload['message_thread_id'] = int(os.environ['TOPIC_ALERTS'])
    request = urllib.request.Request(
        'https://api.telegram.org/bot' + os.environ['TELEGRAM_BOT_TOKEN'] + '/sendMessage',
        data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            result = json.load(response)
        return bool(result.get('ok'))
    except Exception:
        # Do not log exception URLs, which contain the bot token.
        print('Telegram delivery failed; will retry next check', flush=True)
        return False


def main():
    path = Path(os.environ.get('UPTIME_STATE_FILE', '/var/lib/wayneclub-uptime/state.json'))
    state = json.loads(path.read_text()) if path.exists() else {}
    ok, detail = probe()
    state, message = transition(state, ok, detail)
    if message and notify(message):
        state['alerted'] = not ok
        state['notified_at'] = int(time.time())
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(state))
    temporary.replace(path)
    print(json.dumps({'ok': ok, 'detail': detail, 'failures': state['failures'], 'alerted': state.get('alerted', False)}))


if __name__ == '__main__':
    main()
