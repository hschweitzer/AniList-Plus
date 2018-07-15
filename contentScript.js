let scoreElementArray = document.getElementsByClassName('score')
let progressArray = document.getElementsByClassName('progress')
let scoreArray = []
let scoreElementArraySorted = []
console.log(scoreElementArray)
console.log(scoreElementArray[0].innerText)
for (let i = 0; i < scoreElementArray.length; i++) {
    if(scoreElementArray[i].innerText !== "0" && scoreElementArray[i].innerText !== "Score")
    {
        scoreArray.push(scoreElementArray[i].innerText)
        scoreElementArraySorted.push(scoreElementArray[i])
    }
}
console.log(scoreElementArraySorted)
//TODO get scoring system from popup page and replace this variable accordingly
let accuracy = 10
for (let i = 0; i < scoreElementArraySorted.length; i++) {
    let score = Math.ceil(15 + scoreArray[i] * 80 / accuracy)
    scoreElementArraySorted[i].style.color = 'hsl('+ score +', 100%, 50%)'
    console.log(score)
}

for (let i = 0; i < progressArray.length; i++) {
    progressArray[i].style.color = 'inherit'
}