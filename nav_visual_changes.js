function showStudioLink(navBar) {
    navBar.insertAdjacentHTML('beforeend', '<a data-v-256f73e9 id="studio_link" style="cursor: pointer;" class="link">Studios</a>')
}

var observer = new MutationObserver(function() {
    // console.log('a mutation occured in the document')
    let navBar = document.querySelector('.content>.nav')
    let url = window.location.href
    let studioLink = document.getElementById('studio_link')
    if(navBar && !studioLink && (url.includes('/anime/') || url.includes('/manga/'))) {
        showStudioLink(navBar)
    }
})

observer.observe(document, { childList: true, subtree: true })