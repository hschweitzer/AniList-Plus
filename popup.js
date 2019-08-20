document.getElementById("login").addEventListener("click", () => {
    const clientId = 1088;
    const redirectRequestUrl = "https://anilist.co/api/v2/oauth/authorize?response_type=token&"
					+ `client_id=${clientId}`;
    try {
        chrome.identity.launchWebAuthFlow({
            "url": redirectRequestUrl,
            "interactive": true,
        }, (r) => {
            console.log(r);
        });
    } catch (e2) {
        console.log("couldn't log into anilist", e2);
        return;
    }
});