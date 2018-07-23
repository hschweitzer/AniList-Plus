function showStudios() {
    let navBar = document.querySelector('.content>.nav')
    navBar.insertAdjacentHTML('afterend', '<a data-v-256f73e9="" href="#" class="link">Studios</a>')
}

let observer = new MutationObserver(function (MutationRecords, MutationObserver) {
    if (location.href.includes('/anime/') || location.href.includes('/manga/')) {
        console.log('DOM has mutated on an entry page!')
    }
})

observer.observe(document.getElementById('app'), {
    childList: true,
    attributes: true,
    subtree: true
})