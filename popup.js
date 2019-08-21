let accessToken;

chrome.storage.sync.get(['accessToken'], (res) => {
    accessToken = res.accessToken;
    console.log(accessToken);
    if (accessToken === undefined || accessToken === null) {
        logOut();
    }
});

document.getElementById("login").addEventListener("click", () => {
    const clientId = 1088;
    const redirectRequestUrl = "https://anilist.co/api/v2/oauth/authorize?response_type=token&"
					+ `client_id=${clientId}`;
    try {
        chrome.identity.launchWebAuthFlow({
            "url": redirectRequestUrl,
            "interactive": true,
        }, (redirectUrl) => {
            console.log(redirectUrl);
            if (redirectUrl.match(/#access_token=(.*?)&/) !== null) {
                accessToken = redirectUrl.match(/#access_token=(.*?)&/)[1];
                chrome.storage.sync.set({'accessToken': accessToken}, () => {
                    console.log('AccessToken saved.');
                });
                logIn();
            }
        });
    } catch (e) {
        console.log("couldn't log into AniList", e);
        return;
    }
});

document.getElementById("logout").addEventListener("click", () => {
    chrome.storage.sync.set({'accessToken': null}, () => {
        console.log('AccessToken removed.');
        logOut();
    });
});

function logIn() {
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = "list-item";
}

function logOut() {
    document.getElementById("logout").style.display = "none";
    document.getElementById("login").style.display = "list-item";
}


//// API ////


function getOptions(query, accessToken) {
    return {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query
        })
    };
}

function handleResponse (response) {
    console.log(response);
}

function handleError(error) {
    alert('Anilist+ could not fetch the API, check the console for more info.');
    console.error(error);
}