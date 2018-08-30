/*
*
* CONTENT SCRIPT
*
*/

'use strict'

function showStudioLink(navBar) {
    navBar.insertAdjacentHTML(
        'beforeend', 
        '<a data-v-256f73e9 id="studio_link" style="cursor: pointer;" class="link">Studios</a>'
    )
}

var observer = new MutationObserver(async function() {
    let navBar = document.querySelector('.content>.nav')
    let url = window.location.href
    let studioLink = document.getElementById('studio_link')

    if(navBar && !studioLink && (url.includes('/anime/'))) { 
        // When re-visiting the page of an anime the studio link will sometimes be loaded before the first test
        showStudioLink(navBar)
        studioLink = document.getElementById('studio_link')
        let res = await mediaTitle(mediaId())
        let studioList = res.data.Media.studios.nodes
        //console.log(studioList)

        studioLink.addEventListener('click', () => {
            
            if (window.location.href.split('/').length !== 5) {
                var oldLink = document.querySelector('.router-link-exact-active.router-link-active')
                oldLink.classList.add('old-container-active')
                oldLink.classList.remove('router-link-exact-active', 'router-link-active')
            } else {
                navBar.firstChild.classList.add('old-container-active')
            }
            studioLink.classList.add('router-link-exact-active', 'router-link-active')
            let contentContainer = document.querySelector('.content.container')
            let oldContainer = contentContainer.lastChild
            oldContainer.style.display = 'none'
            let studiosElement = createStudiosElement(studioList)
            contentContainer.appendChild(studiosElement)

            navBar.addEventListener('click', (e) => {
                e = window.event? event.srcElement: e.target
                if(e.id !== "studio_link") {
                    studiosElement.remove()
                    if(e.className && e.className.indexOf('old-container-active') != -1) {
                        oldContainer.style.display = 'block'
                    }                    
                    studioLink.classList.remove('router-link-exact-active', 'router-link-active')
                } 
            })
        })
    }
})

async function mediaTitle(a) {
    var variables = {
        id: a
    }
    var dao = new DAO(variables)
    await dao.getStudios()
    var studios = dao.getData()
    return studios
}

function mediaId() {
    let url = window.location.href
    return url.split('/')[4]
}

function createStudiosElement(studioList) {
    let studiosElement = document.createElement('div')
    studiosElement.id = "studios"
    
    for (var i = 0; i < studioList.length; i++) {
        const mediaList = studioList[i].media.nodes
        let studio = document.createElement('div')
        let studioName = document.createElement('h2')
        studioName.innerText = studioList[i].name
        studio.appendChild(studioName)
        for (var j = 0; j < mediaList.length; j++) {
            let mediaElement = document.createElement('div')
            mediaElement.classList.add("media-preview-card", "small")
            mediaElement.setAttribute("data-v-711636d7", "")
            mediaElement.setAttribute("data-v-9c15f6ba", "")
            const mediaLink = "/anime/" + mediaList[j].id
            const mediaCover = mediaList[j].coverImage.medium
            const mediaTitle = mediaList[j].title.userPreferred
            const mediaFormat = mediaList[j].format
            const mediaStatus = mediaList[j].status
            const mediaScore = mediaList[j].averageScore
            const mediaYear = mediaList[j].startDate.year
            const mediaString =
            `<a data-v-711636d7="" href="${mediaLink}" class="cover" data-src="${mediaCover}" lazy="loaded" style="background-image: url(&quot;${mediaCover}&quot;);">
                <div data-v-711636d7="" class="image-text">
                    <div data-v-9c15f6ba="">${mediaYear} · ${mediaScore}</div>
                </div> <!---->
            </a>
            <div data-v-711636d7="" class="content">
                <div data-v-711636d7="" class="info-header">
                    <!-- <div data-v-9c15f6ba="" data-v-711636d7="">Side Story</div> -->
                </div> 
                <a data-v-711636d7="" href="${mediaLink}" class="title">${mediaTitle}</a>
                <div data-v-711636d7="" class="info">
                ${mediaFormat} · ${mediaStatus}
                </div>
            </div>`
            mediaElement.id = "studio_" + i + "_media_" + j
            mediaElement.innerHTML = mediaString.trim()
            studio.appendChild(mediaElement)
        }
        studiosElement.appendChild(studio)
    }
    return studiosElement
}

observer.observe(document, { childList: true, subtree: true })

///////////////////////////////////////////////////////////////////

///////////////////////// DAO /////////////////////////////////////
//                                                               //
//                                                               //
//  Summary:                                                     //
//  Contains functions to access anilist API                     //
//  Documentation https://anilist.github.io/ApiV2-GraphQL-Docs/  //
//                                                               //
///////////////////////////////////////////////////////////////////

class DAO {

    constructor(variables) {
        this.variables = variables
        this.url = 'https://graphql.anilist.co'
    }

    ////////////////////
    // GETTER SETTERS //
    ////////////////////

    getData() {
        return DAO.data
    }

    ////////////////////
    ////////////////////
    ////////////////////
    
    async fetchQuery(query) {
        var url = this.url
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: this.variables
            })
        }
        
        await fetch(url, options).then(this.handleResponse)
        .then(this.handleData)
        .catch(this.handleError)
    }
    
    handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json)
        })
    }
    
    handleError(error) {
        alert('Error, check console')
        console.error(error)
    }
    
    handleData(data) {
        DAO.data = data
    }

    /////////////////////////////////////////////////////////////////////////
    //  QUERY https://anilist.github.io/ApiV2-GraphQL-Docs/query.doc.html  //
    /////////////////////////////////////////////////////////////////////////
    
    async getTitle() {
    
        var query = `
        query ($id: Int) {
            Media (id: $id, type: ANIME) { 
                id
                title {
                romaji
                english
                native
                }
            }
        }
        `
        await this.fetchQuery(query)
    }

    async getStudios() {
        var query = `
        query ($id: Int) {
            Media (id: $id, type: ANIME) {
                id
                studios {
                    nodes {
                        name
                        media(sort: POPULARITY_DESC) {
                            nodes {
                                id
                                title {
                                    userPreferred
                                }
                                coverImage {
                                    medium
                                }
                                startDate {
                                    year
                                    month
                                    day
                                }
                                season
                                description
                                type
                                format
                                genres
                                isAdult
                                averageScore
                                popularity
                                mediaListEntry {
                                    status
                                }
                                status
                                nextAiringEpisode {
                                    airingAt
                                    timeUntilAiring
                                    episode
                                }
                            }
                        }
                    }
                }
            }
        }
        `;
        await this.fetchQuery(query)
    } 

    ////////////////////////////////////////////////////////////////////////////
    // MUTATION https://anilist.github.io/ApiV2-GraphQL-Docs/mutation.doc.html /
    ////////////////////////////////////////////////////////////////////////////

}
