chrome.runtime.onMessage.addListener(async (message, _, sendResponse) => {
  if (message.mode == 'ping') {
    sendResponse("pong");
    return;
  }

  const url = window.location.href;
  
  if (!await isStoredVersionAvailable(url)) return;

  const dialogTextOptions = {
    manual: 'You are now being redirected to the Wayback Machine!',
    automatic: 'The page appears to be unavailable. Redirecting to the Wayback Machine!'
  }

  // displays a confirmation dialog box 
  const dialogText = dialogTextOptions[message.mode];
  const userConfirmed = confirm(dialogText);
  if (!userConfirmed) return;

  redirectToWaybackMachine(url);
});


async function redirectToWaybackMachine(url) {
  url = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;

  console.log(url)

  try {
    const response = await fetch(url);
    const data = await response.json();
    const storedVersionAvailable = data && data.archived_snapshots && data.archived_snapshots.closest;

    if (storedVersionAvailable) {
      window.location.href = data.archived_snapshots.closest.url;
    }
  } catch (error) {
    console.error("Error fetching Wayback Machine data:", error);
  }
}



async function isStoredVersionAvailable(url) {
  url = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    const storedVersionAvailable = data && data.archived_snapshots && data.archived_snapshots.closest;
    return storedVersionAvailable;
  } 
  catch (error) {
    console.error("Error fetching Wayback Machine data:", error);
  }
}
