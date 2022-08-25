import config from './config.json'



const getAllHeroes = async (keywordSearch) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/heroes?keyword=${keywordSearch}`, {
       method: 'GET',
    })

    return res.json()
}

const getPowerHeroes = async (publisherSelection, powerSelection) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/hero-power?publisher=${publisherSelection}&power=${powerSelection}`, {
        method: 'GET',
    })

    return res.json()
}

const fetchRecommendationsByHero = async (heroName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/movies/hero?name=${heroName}`, {
        method: 'GET',
    })

    return res.json()
}

const fetchRecommendationsByPower = async (power) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/movies/power?power=${power}`, {
        method: 'GET',
    })

    return res.json()
}

const getHeroScore = async (heroName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/score?name=${heroName}`, {
        method: 'GET',
    })

    return res.json()
}
const getPowerList = async (heroName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/powerlist?name=${heroName}`, {
        method: 'GET',
    })

    return res.json()
}
const getAlignment = async (alignmentSelection) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/alignment?alignment=${alignmentSelection}`, {
        method: 'GET',
    })

    return res.json()
}
 const getIdentityMarvel = async (identitySelection) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/identity/marvel?identity=${identitySelection}`, {
        method: 'GET',
    })

    return res.json()
 }

 const getIdentityDC = async (identitySelection) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/identity/DC?identity=${identitySelection}`, {
        method: 'GET',
    })

    return res.json()
 }
const getAliveStatusMarvel = async (aliveSelection) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/alive/marvel?alive=${aliveSelection}`, {
        method: 'GET',
     })

    return res.json()
 }

 const getAliveStatusDC = async (aliveSelection) => {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/alive/DC?alive=${aliveSelection}`, {
            method: 'GET',
        })
    
        return res.json()
     }



export {
    getAllHeroes,
    getPowerHeroes,
    fetchRecommendationsByHero,
    fetchRecommendationsByPower,
    getHeroScore,
    getPowerList,
    getAlignment,
    getIdentityMarvel,
    getIdentityDC,
    getAliveStatusMarvel,
    getAliveStatusDC
   
}