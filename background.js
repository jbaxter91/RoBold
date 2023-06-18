chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("Robold injected");
    chrome.tabs.executeScript({
      file: 'robold.js'
    });
  });