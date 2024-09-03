
function contentScriptAvailable(callback) {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (activeTab) => {
      const id = activeTab[0].id;

      chrome.tabs.sendMessage(id, { mode: 'ping' }, () => {
        callback(chrome.runtime.lastError == undefined);
      });
    });
  }
  catch (error) {
    callback(false);
  }
}

// gets executed when the icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (activeTab) => {
    const id = activeTab[0].id;

    // sends a trigger to the content script 
    chrome.tabs.sendMessage(id, { mode: 'manual' });
  });
});


async function isPageAvailable(url) {
  try {
    const response = await fetch(url, {
      mode: 'no-cors'
    });

    return (response.ok && response.status != 404);
  } 
  catch (error) {
    return true;
  }
}

// gets executed when the url of a tab changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = tab.url;

  if (!url.startsWith("http")) return;
  if (changeInfo.status != 'complete') return;

  isPageAvailable(url).then(pageAvailable => {
    if (pageAvailable) return;

    contentScriptAvailable((scriptAvailable) => {
      if (!scriptAvailable) return;

      // sends a trigger to the content script if a page is unavailable 
      // and the content script available
      chrome.tabs.sendMessage(tabId, { mode: 'automatic', url: url });
    });

  })
});
