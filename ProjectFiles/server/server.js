const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

//Route 1
// hello route for testing
app.get('/hello', routes.hello)

//Route 2
// get alignment by hero name
 app.get('/alignment', routes.heroes_alignment)

 //Route 3
// get identity count for Marvel
app.get('/identity/marvel', routes.heroes_identity_marvel)

//Route 4
// get identity count for DC
app.get('/identity/DC', routes.heroes_identity_DC)

//Route 5
// get alive status by Marvel
app.get('/alive/marvel', routes.heroes_alive_marvel)

//Route 6
// get alive status by DC
app.get('/alive/DC', routes.heroes_alive_DC)

//Route 7
// get power score by hero name
app.get('/score', routes.hero_score)

//Route 8
// get hero names based on publisher & power
app.get('/hero-power', routes.heroes_publisher_superpower)

//Route 9
// get movie recommendations by hero
app.get('/movies/hero', routes.movies_by_hero)

//Route 10
// get movie recommendations by power
app.get('/movies/power', routes.movies_by_power)

//Route 11
// get heroes with keyword
app.get('/search/heroes', routes.search_heroes)

//Route 12
// // get power list by hero name
app.get('/powerlist', routes.power_list)


app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
