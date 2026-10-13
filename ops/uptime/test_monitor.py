import unittest
from unittest.mock import patch
import urllib.error
import monitor


class MonitorTests(unittest.TestCase):
    def test_outage_debounce_and_recovery(self):
        state = {}
        for _ in range(2):
            state, message = monitor.transition(state, False, 'HTTP 502')
            self.assertIsNone(message)
        state, message = monitor.transition(state, False, 'HTTP 502')
        self.assertIsNotNone(message)
        # Failed delivery leaves alerted false and retries on the next check.
        state, message = monitor.transition(state, False, 'HTTP 502')
        self.assertIsNotNone(message)
        state['alerted'] = True
        state, message = monitor.transition(state, False, 'HTTP 502')
        self.assertIsNone(message)
        state, message = monitor.transition(state, True, 'HTTP 200')
        self.assertIsNone(message)
        state, message = monitor.transition(state, True, 'HTTP 200')
        self.assertIsNotNone(message)
        state['alerted'] = False
        state, message = monitor.transition(state, True, 'HTTP 200')
        self.assertIsNone(message)

    def test_interrupted_failure_streak(self):
        state, _ = monitor.transition({}, False, 'HTTP 502')
        state, _ = monitor.transition(state, True, 'HTTP 200')
        state, message = monitor.transition(state, False, 'HTTP 502')
        self.assertEqual(state['failures'], 1)
        self.assertIsNone(message)

    def test_502_is_failure(self):
        with patch('urllib.request.urlopen', side_effect=urllib.error.HTTPError(monitor.URL, 502, 'Bad Gateway', {}, None)):
            self.assertEqual(monitor.probe(), (False, 'HTTP 502'))


if __name__ == '__main__':
    unittest.main()
