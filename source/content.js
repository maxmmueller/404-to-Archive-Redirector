chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  const dialogTextOptions = {
    manual: 'You are now being redirected to the Wayback Machine!',
    automatic: 'The page appears to be unavailable. Redirecting to the Wayback Machine!'
  }

  const dialogText = dialogTextOptions[message.mode];

  // displays a confirmation dialog box 
  const userConfirmed = confirm(dialogText);
  if (!userConfirmed) return;

  const url = window.location.href;
  redirectToWaybackMachine(url);
});


async function redirectToWaybackMachine(url) {
  url = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;

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