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

var observer = new MutationObserver(function() {
    let navBar = document.querySelector('.content>.nav')
    let url = window.location.href
    let studioLink = document.getElementById('studio_link')
    if(navBar && !studioLink && (url.includes('/anime/'))) { // When re-visiting the page of an anime the studio link will sometimes be loaded before the first test
        showStudioLink(navBar)
        mediaTitle(mediaId())
    }
})

async function mediaTitle(a) {
    var variables = {
        id: a
    }
    var dao = new DAO(variables)
    await dao.getTitle()
    var title = dao.getData()
    console.log(title)
    await dao.getStudios()
    var studios = dao.getData()
    console.log(studios)
}

function mediaId() {
    let url = window.location.href
    return url.split('/')[4]
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
                        media {
                            nodes {
                                title {
                                    romaji
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
