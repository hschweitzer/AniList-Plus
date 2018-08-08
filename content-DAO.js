'use strict'

function showStudioLink(navBar) {
    navBar.insertAdjacentHTML(
        'beforeend', 
        '<a data-v-256f73e9 id="studio_link" style="cursor: pointer;" class="link">Studios</a>'
    )
}

var observer = new MutationObserver(function() {
    // console.log('a mutation occured in the document')
    let navBar = document.querySelector('.content>.nav')
    let url = window.location.href
    let studioLink = document.getElementById('studio_link')
    if(navBar && !studioLink && (url.includes('/anime/') || url.includes('/manga/'))) {
        showStudioLink(navBar)
        test()
    }
})

function test() {
    var variables = {
        id: 100922
    }
    var dao = new DAO(variables)
    dao.getTitle()
}

observer.observe(document, { childList: true, subtree: true })




/* 
* DAO
*
* Summary:
* Contains functions to access anilist API
* Documentation https://anilist.github.io/ApiV2-GraphQL-Docs/
*Template for "variables":
var variables = {
    id: mediaId
}
*/

/* TODO error 400 when doing dao.getTitle()
*
"Syntax Error GraphQL (2:28) Expected Name, found (

1: 
2:         query ($id: Int) { (id)
                              ^
3:             Media (id: $id, type: ANIME) { 
"
*
*/


class DAO {

    constructor(variables) {
        this.variables = variables
        this.url = 'https://graphql.anilist.co'
    }

    getTitle(mediaId) {
    
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
        this.fetchQuery(query)
    }
    
    fetchQuery(query) {
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
    
        fetch(url, options).then(this.handleResponse)
                           .then(this.handleData)
                           .catch(this.handleError)
    }
    
    handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        })
    }
    
    handleError(error) {
        alert('Error, check console');
        console.error(error);
    }
    
    handleData(data) {
        console.log(data);
    }
}
