chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting == "isList") {
        if(sender.tab.url.includes('animelist') || sender.tab.url.includes('mangalist')) {
            sendResponse({farewell: "true"})
        } else {
            sendResponse({farewell: "false"})
        }
    }
})