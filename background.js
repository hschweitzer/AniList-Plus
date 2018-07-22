chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting == "isList") {
        console.log("message received from "+ sender.tab.url)
        if(sender.tab.url.includes('animelist') || sender.tab.url.includes('mangalist')) {
            sendResponse({farewell: "true"})
        } else {
            sendResponse({farewell: "false"})
        }
    }
})