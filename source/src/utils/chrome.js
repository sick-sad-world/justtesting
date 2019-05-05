export const goTo = (path) => {
  const url = chrome.extension.getURL(path);
  window.location.replace(url);
};

export function createUrl(target, { hash, search } = {}) {
  const url = new URL(chrome.extension.getURL(target));
  if (hash) {
    url.hash = hash;
  }
  if (search) {
    Object.entries(search).forEach(([val, key]) => {
      url.searchParams.append(key, val);
    });
  }
  return url.toString();
}

export function createWindow(params, $log) {
  $log && $log.info('creation request');
  return new Promise((res, rej) => {
    try {
      chrome.windows.create(params, (window) => {
        $log && $log.success(`created successfully, id:${window.id}`);
        res(window);
      });
    } catch (error) {
      $log && $log.error(error);
      rej(error);
    }
  });
}

export function showWindow(target, $log) {
  $log && $log.info(`Highlight window ${target} request`);
  return new Promise((res, rej) => {
    try {
      chrome.windows.update(
        target,
        {
          focused: true
        },
        () => {
          $log && $log.success(`Window ${target} highlighted`);
          res();
        }
      );
    } catch (error) {
      $log && $log.error(error);
      rej(error);
    }
  });
}

export function removeWindow(target, $log) {
  $log && $log.info(`Remove window ${target} request`);
  return new Promise((res, rej) => {
    try {
      chrome.windows.remove(target, () => {
        $log && $log.success(`Window ${target} removed`);
        res();
      });
    } catch (error) {
      $log && $log.error(error);
      rej(error);
    }
  });
}

export function findWindowByUrl(url, $log) {
  $log && $log.info(`Window request url: ${url}`);
  return new Promise((res, rej) => {
    try {
      chrome.tabs.query(
        {
          url,
          windowType: chrome.windows.WindowType.POPUP
        },
        (raw) => {
          if (raw.length === 1) {
            chrome.windows.get(raw[0].windowId, (window) => {
              $log.success(`Window found Id: ${window.id}.`);
              res({
                ...window,
                tabs: raw
              });
            });
          } else {
            $log.warn('Window not found');
            res(null);
          }
        }
      );
    } catch (error) {
      $log && $log.error(error);
      rej(error);
    }
  });
}

export function setBrowserPopup(target, $log) {
  const logStr = target === '' ? 'nothing' : target;
  $log && $log.info(`Popup change request to: ${logStr}`);
  return new Promise((res, rej) => {
    try {
      chrome.browserAction.setPopup({ popup: target }, () => {
        $log && $log.success(`popup now ${logStr}`);
        res();
      });
    } catch (error) {
      $log && $log.error(error);
      rej(error);
    }
  });
}

export function findTabs(query, $log) {
  $log && $log.info(`Tab query request ${JSON.stringify(query)}`);
  return new Promise((res, rej) => {
    try {
      chrome.tabs.query(query, (raw) => {
        if (raw.length) {
          $log.success(`Requst successfull ${raw.length} items found.`);
        } else {
          $log.warn('Request successfull 0 items found');
        }
        res(raw);
      });
    } catch (error) {
      $log && $log.error(error);
      rej(error);
    }
  });
}

export function createTab(params, $log) {
  $log && $log.info('creation request');
  return new Promise((res, rej) => {
    try {
      chrome.tabs.create(params, (tab) => {
        $log && $log.success(`created successfully, id:${tab.id}`);
        res(tab);
      });
    } catch (error) {
      $log && $log.error(error);
      rej(error);
    }
  });
}

export function updateTab(target, update, $log) {
  $log && $log.info(`Update tab ${target} request`);
  return new Promise((res, rej) => {
    try {
      chrome.tabs.update(target, update, (result) => {
        $log && $log.success(`Tab ${target} updated`);
        res(result);
      });
    } catch (error) {
      $log && $log.error(error);
      rej(error);
    }
  });
}

export function removeTab(target, $log) {
  $log && $log.info('remove tab request');
  return new Promise((res, rej) => {
    try {
      chrome.tabs.remove(target, (tab) => {
        $log && $log.success(`removed successfully, id:${target}`);
        res(tab);
      });
    } catch (error) {
      $log && $log.error(error);
      rej(error);
    }
  });
}

export function moveTabs(tab, target, $log) {
  $log && $log.info(`Move Tab(s) request ${JSON.stringify(tab)} to ${target}`);
  return new Promise((res, rej) => {
    try {
      chrome.tabs.move(tab, { windowId: target }, (tab) => {
        $log.success(`Tabs ${JSON.stringify(tab)} moved to ${target}.`);
        res(tab);
      });
    } catch (error) {
      $log && $log.error(error);
      rej(error);
    }
  });
}

export function highlightTab(tab, $log) {
  $log && $log.info(`Highlight tab ${tab.id} request`);
  return new Promise((res, rej) => {
    try {
      chrome.windows.update(
        tab.windowId,
        {
          focused: true
        },
        () => {
          chrome.tabs.highlight({ tabs: [tab.index] }, () => {
            $log && $log.success(`Tab ${tab.id} highlighted`);
            res();
          });
        }
      );
    } catch (error) {
      $log && $log.error(error);
      rej(error);
    }
  });
}
