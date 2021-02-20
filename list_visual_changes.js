/* Summary :
* Changes that affect visual appearance of anime list and manga list
* 
*/

function styleEnhancement(saturation) {
    let scoreType = document.querySelector('.content.container>div').classList[2];
    let scoreElementArray = document.getElementsByClassName('score');
    let progressArray = document.getElementsByClassName('progress');
    let scoreArray = [];
    let scoreElementArraySorted = [];

    for (let i = 0; i < scoreElementArray.length; i++) {
        if (scoreElementArray[i].innerText !== "0" && scoreElementArray[i].innerText !== "Score");
        {
            scoreArray.push(scoreElementArray[i].attributes[0].nodeValue);
            scoreElementArraySorted.push(scoreElementArray[i]);
        }
    }

    let accuracy;
    switch (scoreType) {
        case "POINT_100":
            accuracy = 100;
            break;

        case "POINT_5":
            accuracy = 5;
            break;

        case "POINT_3":
            accuracy = 3;
            break;

        default:
            accuracy = 10;
            break;
    }

    chrome.storage.sync.get({
        gradient: 'default'
    }, (res) => {
        let gradient = res.gradient;

        switch (gradient) {
            case 'c2p':
                for (let i = 0; i < scoreElementArraySorted.length; i++) {
                    let redValue = Math.ceil((1 - (scoreArray[i] / accuracy)) * 255);
                    scoreElementArraySorted[i].style.color = 'rgb(' + redValue + ', 150, 170)';
                }
                break;

            case 'b2br':
                for (let i = 0; i < scoreElementArraySorted.length; i++) {
                    let blueValue = 255 - Math.ceil((1 - (scoreArray[i] / accuracy)) * 255);
                    scoreElementArraySorted[i].style.color = 'rgb(100, 50, ' + blueValue + ')';
                }

            default:
                for (let i = 0; i < scoreElementArraySorted.length; i++) {
                    let hue = Math.ceil(30 + scoreArray[i] * 80 / accuracy);
                    scoreElementArraySorted[i].style.color = 'hsl(' + hue + ', ' + saturation + ', 50%)';
                }
                break;
        }
    });

    for (let i = 0; i < progressArray.length; i++) {
        progressArray[i].style.color = 'inherit';
    }
}

var observer = new MutationObserver(function () {
    if (window.location.href.includes('animelist') || window.location.href.includes('mangalist')) {
        let listType = null;
        const listTypeElement = document.querySelector('.content.container>div');
        if (listTypeElement !== null) {
            listType = listTypeElement.classList[1];
        }
        let theme = document.getElementsByTagName('body')[0].className;
        let saturation;
        if (theme === "site-theme-dark" || listType === "cards")
            saturation = "100%";
        else
            saturation = "70%";
        styleEnhancement(saturation);
    }
})

observer.observe(document.getElementById('app'), { childList: true, attributes: true, subtree: true });