/*
*
* CONTENT SCRIPT
*
*/

'use strict'

function showStudioLink(navBar, vuedata) {
    navBar.insertAdjacentHTML(
        'beforeend', 
        `<a ${vuedata} id="studio_link" style="cursor: pointer;" class="link">Studios</a>`
    )
}

var observer = new MutationObserver(async function() {
    let navBar = document.querySelector('.content>.nav')
    let url = window.location.href
    let studioLink = document.getElementById('studio_link')

    if(navBar && !studioLink && (url.includes('/anime/'))) { 
        // When re-visiting the page of an anime the studio link will sometimes be loaded before the first test
        let vuedata = navBar.firstElementChild.attributes[0].name;
        showStudioLink(navBar, vuedata)
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
    const styleElement = document.createElement('style')
    const style = `
    .studio-card {
        margin-bottom: 15px;
        margin-right: 20px;
        position: relative;
        width: 85px;
        background: rgb(var(--color-foreground));
        border-radius: 3px;
        display: inline-grid;
        grid-template-columns: 85px auto;
        height: 115px;
        max-height: 115px;
    }
    
    .studio-card .cover {
        border-radius: 3px;
        text-align: center;
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: cover;
    }
    
    .studio-card .cover:hover {
        border-radius: 3px 0 0 3px;
    }
    
    .studio-card .cover .image-text {
        background: rgba(var(--color-overlay),.7);
        border-radius: 0 0 3px 3px;
        bottom: 0;
        color: rgba(var(--color-text-bright),.91);
        display: inline-block;
        font-size: 1.2rem;
        font-weight: 400;
        left: 0;
        letter-spacing: .2px;
        margin-bottom: 0;
        padding-bottom: 10px;
        padding-top: 10px;
        position: absolute;
        transition: .3s;
        width: 100%;
        text-align: center;
    }
    
    .studio-card .cover:hover .image-text {
        opacity: 0;
    }
    
    .studio-card .cover+.content {
        height: 100%;
        left: 100%;
        position: absolute;
        top: 0;
    }
    
    .studio-card .content {
        opacity: 0;
        transition: opacity .3s;
        width: 240px;
        z-index: -1;
        background: rgb(var(--color-foreground));
        border-radius: 0 3px 3px 0;
        padding: 12px;
        position: relative;
    }
    
    .studio-card .info-header {
        color: rgb(var(--color-blue));
        font-size: 1.2rem;
        font-weight: 500;
        margin-bottom: 8px;
    }
    
    .studio-card .title {
        font-size: 1.4rem;
    }
    
    .studio-card .info {
        bottom: 12px;
        color: rgb(var(--color-text-lighter));
        font-size: 1.2rem;
        left: 12px;
        position: absolute;
    }
    
    .studio-card .cover:hover+.content {
        display: block;
        opacity: 1;
        z-index: 9;
    }
    `
    styleElement.innerHTML = style.trim();
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
            mediaElement.classList.add("media-preview-card", "small", "studio-card")
            /**
             * TODO IMPORTANT
             * data-v-xxxxxxxx needs to be fetched in some way or the css needs to be injected manually QUICKLY
             */
            const mediaLink = "/anime/" + mediaList[j].id
            const mediaCover = mediaList[j].coverImage.medium
            const mediaTitle = mediaList[j].title.userPreferred
            const mediaFormat = mediaList[j].format
            const mediaStatus = mediaList[j].status
            const mediaScore = mediaList[j].averageScore
            const mediaYear = mediaList[j].startDate.year
            const mediaString =
            `<a href="${mediaLink}" class="cover" data-src="${mediaCover}" lazy="loaded" style="background-image: url(&quot;${mediaCover}&quot;);">
                <div class="image-text">
                    <div data-v-4fd869dd>${mediaYear} · ${mediaScore}</div>
                </div> <!---->
            </a>
            <div class="content">
                <div class="info-header">
                    <!-- <div data-v-9c15f6ba="" data-v-2737c4f7>Side Story</div> -->
                </div> 
                <a href="${mediaLink}" class="title">${mediaTitle}</a>
                <div class="info">
                ${mediaFormat} · ${mediaStatus}
                </div>
            </div>`
            mediaElement.id = "studio_" + i + "_media_" + j
            mediaElement.innerHTML = mediaString.trim()
            studio.appendChild(mediaElement)
        }
        studiosElement.appendChild(styleElement)
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
