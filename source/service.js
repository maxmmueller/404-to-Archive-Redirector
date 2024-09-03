
// gets executed when the icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (activeTab) => {
    const id = activeTab[0].id;

    // sends a trigger to the content script 
    chrome.tabs.sendMessage(id, { mode: 'manual' });
  });
});

//isPageUnavailable
async function isPageAvailable(url) {
  try {
    const response = await fetch(url);
    return response.ok && response.status != 404;
  } catch (error) {
    return true;
  }
}


function handlePage(url, id) {
  isPageAvailable(url)
    .then(pageAvailable => {
      if (!pageAvailable) {
        chrome.tabs.sendMessage(id, { mode: 'automatic', url: url });
      }
    })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tab.url.startsWith("http")) return;

  if (changeInfo.status === 'complete') {
    handlePage(tab.url, tabId);
  }
});
