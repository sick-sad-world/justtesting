import get from 'lodash/get';
import logger from '../logger';
import { isStr } from '../../utils/is';
import { MESSAGES } from '../../constants';

/**
 *  {
 *    type: CONST,
 *    data: message to send {}
 *    meta: additional data related to target, id, mode, options, ...etc
 *  }
 */

const $log = logger('MESSAGING');

function composeOrPass(raw, data, meta) {
  if (!raw.type || isStr(raw)) {
    return compose(
      raw,
      data,
      meta
    );
  }
  return raw;
}

function sendMessage(func, ...args) {
  return new Promise((res, rej) => {
    try {
      func(...args, (resp) => {
        if (resp && resp.error) {
          rej(resp.error);
        }
        res(resp);
      });
    } catch (error) {
      rej(error);
    }
  });
}

export function compose(path, data = null, meta = null) {
  const type = get(MESSAGES, path);
  return {
    type,
    data,
    meta
  };
}

const $logBrd = $log.dive('BROADCAST');
export function broadcast(raw, data, meta) {
  const message = composeOrPass(raw, data, meta);
  $logBrd.info(message.type, message);
  return sendMessage(chrome.runtime.sendMessage, message);
}

const $logSend = $log.dive('SEND');
export function send(tab, raw, data, meta) {
  const message = composeOrPass(raw, data, meta);
  if (Array.isArray(tab)) {
    $logSend.info(tab.map((t) => t.url).join(', '), message.type, message);
    return Promise.all(tab.map((t) => sendMessage(chrome.tabs.sendMessage, t.id, message)));
  } else {
    $logSend.info(tab.url, message.type, message);
    return sendMessage(chrome.tabs.sendMessage, tab.id, message);
  }
}

const $logListen = $log.dive('RECEIVED');
export function listen(path, handler) {
  const type = get(MESSAGES, path);
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === type) {
      const done = (raw) => {
        let resp = raw;
        if (raw instanceof Error) {
          resp = {
            error: {
              name: raw.name,
              message: raw.message,
              stack: raw.stack
            }
          };
        }
        sendResponse(resp);
      };
      $logListen.info(sender.url, message.type, message);
      handler(message, sender, done);
      return true;
    }
    return false;
  });
}
