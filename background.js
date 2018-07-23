chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting == "isList") {
        if(sender.tab.url.includes('animelist') || sender.tab.url.includes('mangalist')) {
            sendResponse({farewell: "true"})
        } else {
            sendResponse({farewell: "false"})
        }
    }
})

// Without this the content script isn't loaded unless the page is refreshed
// See https://stackoverflow.com/questions/20865581/chrome-extension-content-script-not-loaded-until-page-is-refreshed
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log("scripts loaded")
    chrome.tabs.executeScript(null,{file:"externals-scripts/jquery-3.3.1.min.js"})
    chrome.tabs.executeScript(null,{file:"list_visual_changes.js"})
})