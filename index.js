import dotenv from 'dotenv';
import fetch from 'node-fetch';
import notifier from 'node-notifier';
import path from 'path';

dotenv.config();
const DELAY = process.env.DELAY || 5000;
const LOGADDR = process.env.LOGHTTPADDR;

const NotId = 222;
const APPId = 'not-log-app222';

let firstStart = true;

let logFile = '';

const checkLog = async () => {
  fetch(LOGADDR)
    .then((res) => res.text())
    .then((body) => {
      if (firstStart) {
        logFile = body;
        firstStart = false;
        console.log(logFile);
      } else {
        if (String(body) !== String(logFile)) {
          notifier.notify({
            message: 'Log file changed, check console',
            sound: true,
            icon: path.join(path.resolve(), 'appico.png'),
            id: NotId, // Number. ID to use for closing notification.
            appID: APPId, // String. App.ID and app Name. Defaults to no value, causing SnoreToast text to be visible.
          });
          console.log(body);
          logFile = body;
        }
      }
    });
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function init() {
  while (true) {
    checkLog();
    await sleep(DELAY);
  }
}

init();
