/* Summary :
* Changes that affect visual appearance of anime list and manga list
* 
*/

function styleEnhancement() {
    let listType = document.querySelector('.content.container>div').classList[1]
    let scoreType = document.querySelector('.content.container>div').classList[2]
    let scoreElementArray = document.getElementsByClassName('score')
    let progressArray = document.getElementsByClassName('progress')
    let scoreArray = []
    let scoreElementArraySorted = []

    for (let i = 0; i < scoreElementArray.length; i++) {
        if(scoreElementArray[i].innerText !== "0" && scoreElementArray[i].innerText !== "Score")
        {
            scoreArray.push(scoreElementArray[i].attributes[0].nodeValue)
            scoreElementArraySorted.push(scoreElementArray[i])
        }
    }
    
    let accuracy
    switch (scoreType) {
        case "POINT_100":
            accuracy = 100
            break

        case "POINT_5":
            accuracy = 5
            break

        case "POINT_3":
            accuracy = 3
            break

        default:
            accuracy = 10
            break
    }

    // This method only really works if the colors are complementary
    for (let i = 0; i < scoreElementArraySorted.length; i++) {
        let score = Math.ceil(15 + scoreArray[i] * 80 / accuracy)
        scoreElementArraySorted[i].style.color = 'hsl('+ score +', 100%, 50%)'
    }

    for (let i = 0; i < progressArray.length; i++) {
        progressArray[i].style.color = 'inherit'
    }
}

$('#app').bind("DOMSubtreeModified", function() {
    chrome.runtime.sendMessage({greeting: "isList"}, function(response) {
        if(response.farewell === "true"){
            styleEnhancement()
        }
    })
})
