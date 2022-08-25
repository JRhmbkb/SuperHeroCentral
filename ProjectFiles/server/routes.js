const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************
//This is kept to see if the connection is established
// Route 1 (handler)
async function hello(req, res) {

    console.log('hello APII')
    // a GET request to /hello?name=Steve
    if (req.query.name) {
        res.send(`Hello, ${req.query.name}! Welcome to SuperHero Central!`)
    } else {
        res.send(`Hello! Welcome to SuperHero Central!`)
    }
}


// ********************************************
//                 Heroes Alignment 
// ********************************************

//This route shows the statistics for the alignment of heroes of each publisher
//Publisher: Marvel or DC
//alignment: good, bad, neutral
// Route 2 (handler)

async function heroes_alignment(req, res) {
            const alignment = req.query.alignment ? req.query.alignment: "bad"
            connection.query(`With temp AS (SELECT Publisher, count(Publisher)  as num2 FROM Heroes WHERE Publisher = 'Marvel' OR Publisher = 'DC' GROUP BY Publisher)
            SELECT Heroes.Publisher,alignment, count(alignment) as num, ROUND(count(alignment)/temp.num2 * 100) AS percentage
                FROM Heroes, temp
                WHERE alignment = '${alignment}' and (Heroes.Publisher = 'Marvel' or Heroes.Publisher = 'DC') and Heroes.Publisher = temp.Publisher
                GROUP BY Heroes.Publisher, alignment
                ORDER BY Publisher DESC;        
            `, function (error, results, fields) {
                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (results) {
                        res.json({ results: results })
                    }
                });
    }

    // ********************************************
//                 Heroes Identity 
// ********************************************

//This route shows the statistics for the identity of heroes of each publisher
//publisher: Marvel, DC
//identity: public, secret
// Route 3 & 4 (handler)

async function heroes_identity_marvel(req, res) {
    const identity = req.query.identity ? req.query.identity: "secret"
    connection.query(`SELECT identity, count(identity) as num, ROUND(count(identity)/(SELECT count(*) FROM Marvel_Heroes) * 100) as percentage
    FROM Marvel_Heroes
    WHERE identity = '${identity}'
    GROUP BY identity    
    `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

async function heroes_identity_DC(req, res) {
    const identity = req.query.identity ? req.query.identity: "secret"
    connection.query(`SELECT identity, count(identity) as num, ROUND(count(identity)/(SELECT count(*) FROM DC_Heroes) * 100) as percentage
    FROM DC_Heroes
    WHERE identity = '${identity}'
    GROUP BY identity   
    `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

 // ********************************************
//                 Heroes Life Status 
// ********************************************

//This route shows the statistics for the life status of heroes of each publisher
//publisher: Marvel, DC
//identity: living, deceased
// Route 5 & 6 (handler)
async function heroes_alive_marvel(req, res) {
    const alive = req.query.alive ? req.query.alive: "living"
    connection.query(`SELECT alive, count(alive) as num, ROUND(count(alive)/(SELECT count(*) FROM Marvel_Heroes) * 100) as percentage
    FROM Marvel_Heroes
    WHERE alive = '${alive}'
    GROUP BY alive      
    `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

async function heroes_alive_DC(req, res) {
    const alive = req.query.alive ? req.query.alive: "living"
    connection.query(`SELECT alive, count(alive) as num, ROUND(count(alive)/(SELECT count(*) FROM DC_Heroes) * 100) as percentage
    FROM DC_Heroes
    WHERE alive = '${alive}'
    GROUP BY alive      
    `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

// ********************************************
//               Hero Power Score
// ********************************************

//This route pulls out one hero, and calculate its power score.
//By default is set to be captain america
// Route 7 (handler)
async function hero_score(req, res) {
    
    const hero_name = req.query.name ? req.query.name: "Captain America"
    connection.query(`SELECT  power_hero_name, publisher, alignment, (danger_sense + energy_absorption + flight + immortality + mind_control + super_speed + super_strength + accelerated_healing + agility + elasticity + energy_blasts + intelligence + invisibility + levitation+ longevity+ magic+ omniscient+ power_suit+ shapeshifting+ stamina+clairvoyance+ dimensional_awareness+ dimensional_travel+energy_beams+illusions+invulnerability+ telepathy+ teleportation+ time_travel+ vision_xray) as total_score
    FROM Hero_Power
    WHERE power_hero_name LIKE '${hero_name}'
UNION
SELECT  power_hero_name, publisher, alignment, (danger_sense + energy_absorption + flight + immortality + mind_control + super_speed + super_strength + accelerated_healing + agility + elasticity + energy_blasts + intelligence + invisibility + levitation+ longevity+ magic+ omniscient+ power_suit+ shapeshifting+ stamina+clairvoyance+ dimensional_awareness+ dimensional_travel+energy_beams+illusions+invulnerability+ telepathy+ teleportation+ time_travel+ vision_xray) as total_score
    FROM Hero_Power
    WHERE power_hero_name LIKE CONCAT('%', '${hero_name}', '%')
    `, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
   
}


// ********************************************
//               Heroes By Power And Publisher
// ********************************************
//This route will return the hero's name with specified publisher and superpower
//Route 8 (handler)
async function heroes_publisher_superpower(req, res) {
    
        const publisher_selection = req.query.publisher ? req.query.publisher: "Marvel" //get the selected publisher's name from client side, if none, set default to marvel
        const superpower_selection = req.query.power ? req.query.power: "mind_control"  //get the selected superpower's name from client side, if none, set default to mind_control
        const page_size = req.query.page_size ? req.query.page_size: 10 //get the default page size, if none, then set to 0

        if (req.query.page_size && !isNaN(req.query.page_size)){
            const skip = (req.query.page_size - 1) * page_size

            connection.query(`
                SELECT power_hero_name
                FROM Hero_Power
                WHERE publisher = '${publisher_selection}' AND ${superpower_selection} = 1
                LIMIT ${skip}, ${page_size}`
            , function (error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        }
        else {
            connection.query(`
                SELECT DISTINCT power_hero_name
                FROM Hero_Power
                WHERE publisher = '${publisher_selection}' AND ${superpower_selection} = 1`

        , function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {

                resultArray = Object.values(JSON.parse(JSON.stringify(results)));

                res.send(resultArray)
            }
        });
        }
    }


// ********************************************
//             Hero_Movies
// ********************************************
//This route takes a specified hero name and return a list of movies
//where the hero might appeared in. 
//By default we are using Captain America.
//By default the page size is 10. Also consider case when multiple pages exist and user supplied a page number.
// Route 9 (handler)
async function movies_by_hero(req, res) {

    const pageSize = req.query.pagesize ? req.query.pagesize : 10
    const hero_name = req.query.name ? req.query.name: "Captain America"

    if (req.query.page && !isNaN(req.query.page)) { //check that req.query.page exist and is a number   
        const skip = (req.query.page - 1) * pageSize
        connection.query(`SELECT DISTINCT MTC.imdb_id, title FROM Movie_TV_Cast MTC WHERE MTC.cast_character LIKE CONCAT('%', '${hero_name}', ',')
        OR MTC.cast_character LIKE CONCAT('%', '${hero_name}', '%')
      OR MTC.cast_character LIKE CONCAT('%', '${hero_name}', '%')
     OR MTC.cast_character LIKE CONCAT('%', '${hero_name}')
     ORDER BY MTC.imdb_id
     LIMIT ${pageSize}
     OFFSET ${skip}
     `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        })

    }else{
        
        connection.query(`SELECT DISTINCT MTC.imdb_id, title FROM Movie_TV_Cast MTC WHERE MTC.cast_character LIKE CONCAT('%', '${hero_name}', ',')
        OR MTC.cast_character LIKE CONCAT('%', '${hero_name}', '%')
      OR MTC.cast_character LIKE CONCAT('%', '${hero_name}', '%')
     OR MTC.cast_character LIKE CONCAT('%', '${hero_name}')
     ORDER BY MTC.imdb_id
     `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        })

    }
       
}


// ********************************************
//            Power_Movies
// ********************************************
//This route takes a superpower and return a list of movies
//where one or more heroes with that power appeared in. 
//By default we are using agility.
//By default the page size is 10. Also consider case when multiple pages exist and user supplied a page number
// Route 10 (handler)
async function movies_by_power(req, res) {

    const pageSize = req.query.pagesize ? req.query.pagesize : 10
    const power = req.query.power ? req.query.power: "agility"
    if (req.query.page && !isNaN(req.query.page)) { //check that req.query.page exist and is a number   
        const skip = (req.query.page - 1) * pageSize
        connection.query(`SELECT DISTINCT MTC.imdb_id, title
FROM (SELECT name FROM Hero_Power WHERE ${power} = 1)HP JOIN
   Movie_TV_Cast MTC on
   MTC.cast_character LIKE CONCAT(HP.name, ',%')
   OR MTC.cast_character LIKE HP.name OR
   MTC.cast_character LIKE CONCAT('%,', HP.name, ',%')
   OR MTC.cast_character LIKE CONCAT('%,', HP.name)
ORDER BY imdb_id DESC      
     LIMIT ${pageSize}
     OFFSET ${skip}
     `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        })

    }else{
        connection.query(`SELECT DISTINCT MTC.imdb_id, title
FROM (SELECT name FROM Hero_Power WHERE ${power} = 1)HP JOIN
   Movie_TV_Cast MTC on
   MTC.cast_character LIKE CONCAT(HP.name, ',%')
   OR MTC.cast_character LIKE HP.name OR
   MTC.cast_character LIKE CONCAT('%,', HP.name, ',%')
   OR MTC.cast_character LIKE CONCAT('%,', HP.name)
ORDER BY imdb_id DESC;       
     `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        })

    }
}


// ********************************************
//             Search Heroes
// ********************************************
//This route takes in a keyword and searches for matches on hero name.  It returns a list of heroes and attributes.
//By default the page size is 10. It will also handle cases where page size is supplied.
//Route 11 (handler)
async function search_heroes(req, res) {
    const pageSize = req.query.pagesize ? req.query.pagesize : 10

    const keyword = req.query.keyword || ''

    if(keyword){
        if (req.query.page && !isNaN(req.query.page)) {   
            const skip = (req.query.page - 1) * pageSize
            connection.query(`SELECT *
            FROM Heroes
            WHERE Name LIKE CONCAT('%', '${keyword}','%') OR
            Gender LIKE CONCAT('%', '${keyword}','%') OR
            Alignment LIKE CONCAT('%', '${keyword}','%') OR
            'Eye Color' LIKE CONCAT('%', '${keyword}','%') OR
            'Skin Color' LIKE CONCAT('%', '${keyword}','%') OR
            'Hair Color' LIKE CONCAT('%', '${keyword}','%')
            ORDER BY hero_id
            LIMIT ${pageSize}
            OFFSET ${skip}`, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    
        } else { //no page query
            connection.query(`SELECT *
            FROM Heroes
            WHERE Name LIKE CONCAT('%', '${keyword}','%') OR
            Gender LIKE CONCAT('%', '${keyword}','%') OR
            Alignment LIKE CONCAT('%', '${keyword}','%') OR
            'Eye Color' LIKE CONCAT('%', '${keyword}','%') OR
            'Skin Color' LIKE CONCAT('%', '${keyword}','%') OR
            'Hair Color' LIKE CONCAT('%', '${keyword}','%')
            ORDER BY hero_id`, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    
        }

    }else{
        // if no keyword is entered we want to get all heroes
        connection.query(`SELECT *
        FROM Heroes
        ORDER BY hero_id`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
     
}

// ********************************************
//             Power List
// ********************************************
//This route takes in a name from a user, and return a list of heroes matched to the name, as well as the 
//names of the super powers that these heroes own.
//By default the page size is 10. It will also handle cases where page size is supplied.
// Route 11 (handler)

async function power_list(req, res) {
    const pageSize = req.query.pagesize ? req.query.pagesize : 10

    const name = req.query.name || ''

    if(name){
        if (req.query.page && !isNaN(req.query.page)) {   
            const skip = (req.query.page - 1) * pageSize
            connection.query(`WITH SUB AS (SELECT * FROM Hero_Power hp WHERE hp.power_hero_name LIKE CONCAT('%','${name}','%')),
            temp AS (
                SELECT SUB.power_hero_name, 'danger sense' AS Power FROM  SUB WHERE  SUB.danger_sense = 1 UNION
            SELECT SUB.power_hero_name, 'energy absorption' AS Power FROM  SUB WHERE  SUB.energy_absorption = 1 UNION
            SELECT SUB.power_hero_name, 'flight' AS Power FROM  SUB WHERE  SUB.flight = 1 UNION
            SELECT SUB.power_hero_name, 'immortality'  AS Power FROM  SUB WHERE  SUB.immortality= 1 UNION
            SELECT SUB.power_hero_name, 'mind control'  AS Power FROM  SUB WHERE  SUB.mind_control= 1 UNION
            SELECT SUB.power_hero_name, 'super speed'  AS Power FROM  SUB WHERE  SUB.super_speed= 1 UNION
            SELECT SUB.power_hero_name, 'super strength'  AS Power FROM  SUB WHERE  SUB.super_strength= 1 UNION
            SELECT SUB.power_hero_name, 'accelerated healing'  AS Power FROM  SUB WHERE  SUB.accelerated_healing= 1 UNION
            SELECT SUB.power_hero_name, 'agility'  AS Power FROM  SUB WHERE  SUB.agility= 1 UNION
            SELECT SUB.power_hero_name, 'elasticity'  AS Power FROM  SUB WHERE  SUB.elasticity= 1 UNION
            SELECT SUB.power_hero_name, 'energy blasts'  AS Power FROM  SUB WHERE  SUB.energy_blasts= 1 UNION
            SELECT SUB.power_hero_name, 'intelligence'  AS Power FROM  SUB WHERE  SUB.intelligence= 1 UNION
            SELECT SUB.power_hero_name, 'invisibility'  AS Power FROM  SUB WHERE  SUB.invisibility= 1 UNION
            SELECT SUB.power_hero_name, 'levitation'  AS Power FROM  SUB WHERE  SUB.levitation= 1 UNION
            SELECT SUB.power_hero_name, 'longevity'  AS Power FROM  SUB WHERE  SUB.longevity = 1 UNION
            SELECT SUB.power_hero_name, 'magic'  AS Power FROM  SUB WHERE  SUB.magic= 1 UNION
            SELECT SUB.power_hero_name, 'omniscient'  AS Power FROM  SUB WHERE  SUB.omniscient= 1 UNION
            SELECT SUB.power_hero_name, 'power suit'  AS Power FROM  SUB WHERE  SUB.power_suit= 1 UNION
            SELECT SUB.power_hero_name, 'shapeshifting'  AS Power FROM  SUB WHERE  SUB.shapeshifting= 1 UNION
            SELECT SUB.power_hero_name, 'stamina'  AS Power FROM  SUB WHERE  SUB.stamina= 1 UNION
            SELECT SUB.power_hero_name, 'clairvoyance'  AS Power FROM  SUB WHERE  SUB.clairvoyance= 1 UNION
            SELECT SUB.power_hero_name, 'dimensional awareness'  AS Power FROM  SUB WHERE  SUB.dimensional_awareness= 1 UNION
            SELECT SUB.power_hero_name, 'dimensional travel'  AS Power FROM  SUB WHERE  SUB.dimensional_travel= 1 UNION
            SELECT SUB.power_hero_name, 'energy beams'  AS Power FROM  SUB WHERE  SUB.energy_beams= 1 UNION
            SELECT SUB.power_hero_name, 'illusions'  AS Power FROM  SUB WHERE  SUB.illusions= 1 UNION
            SELECT SUB.power_hero_name, 'invulnerability'  AS Power FROM  SUB WHERE  SUB.invulnerability= 1 UNION
            SELECT SUB.power_hero_name, 'telepathy'  AS Power FROM  SUB WHERE  SUB.telepathy= 1 UNION
            SELECT SUB.power_hero_name, 'teleportation'  AS Power FROM  SUB WHERE  SUB.teleportation= 1 UNION
            SELECT SUB.power_hero_name, 'time travel'  AS Power FROM  SUB WHERE  SUB.time_travel= 1 UNION
            SELECT SUB.power_hero_name, 'vision xray'  AS Power FROM  SUB WHERE  SUB.vision_xray= 1
                              )
            SELECT * FROM temp ORDER BY power_hero_name
                LIMIT ${pageSize}
                OFFSET ${skip}`, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    
        } else { //no page query
            connection.query(`WITH SUB AS (SELECT * FROM Hero_Power hp WHERE hp.power_hero_name LIKE CONCAT('%','${name}','%')),
            temp AS (
                SELECT SUB.power_hero_name, 'danger sense' AS Power FROM  SUB WHERE  SUB.danger_sense = 1 UNION
            SELECT SUB.power_hero_name, 'energy absorption' AS Power FROM  SUB WHERE  SUB.energy_absorption = 1 UNION
            SELECT SUB.power_hero_name, 'flight' AS Power FROM  SUB WHERE  SUB.flight = 1 UNION
            SELECT SUB.power_hero_name, 'immortality'  AS Power FROM  SUB WHERE  SUB.immortality= 1 UNION
            SELECT SUB.power_hero_name, 'mind control'  AS Power FROM  SUB WHERE  SUB.mind_control= 1 UNION
            SELECT SUB.power_hero_name, 'super speed'  AS Power FROM  SUB WHERE  SUB.super_speed= 1 UNION
            SELECT SUB.power_hero_name, 'super strength'  AS Power FROM  SUB WHERE  SUB.super_strength= 1 UNION
            SELECT SUB.power_hero_name, 'accelerated healing'  AS Power FROM  SUB WHERE  SUB.accelerated_healing= 1 UNION
            SELECT SUB.power_hero_name, 'agility'  AS Power FROM  SUB WHERE  SUB.agility= 1 UNION
            SELECT SUB.power_hero_name, 'elasticity'  AS Power FROM  SUB WHERE  SUB.elasticity= 1 UNION
            SELECT SUB.power_hero_name, 'energy blasts'  AS Power FROM  SUB WHERE  SUB.energy_blasts= 1 UNION
            SELECT SUB.power_hero_name, 'intelligence'  AS Power FROM  SUB WHERE  SUB.intelligence= 1 UNION
            SELECT SUB.power_hero_name, 'invisibility'  AS Power FROM  SUB WHERE  SUB.invisibility= 1 UNION
            SELECT SUB.power_hero_name, 'levitation'  AS Power FROM  SUB WHERE  SUB.levitation= 1 UNION
            SELECT SUB.power_hero_name, 'longevity'  AS Power FROM  SUB WHERE  SUB.longevity = 1 UNION
            SELECT SUB.power_hero_name, 'magic'  AS Power FROM  SUB WHERE  SUB.magic= 1 UNION
            SELECT SUB.power_hero_name, 'omniscient'  AS Power FROM  SUB WHERE  SUB.omniscient= 1 UNION
            SELECT SUB.power_hero_name, 'power suit'  AS Power FROM  SUB WHERE  SUB.power_suit= 1 UNION
            SELECT SUB.power_hero_name, 'shapeshifting'  AS Power FROM  SUB WHERE  SUB.shapeshifting= 1 UNION
            SELECT SUB.power_hero_name, 'stamina'  AS Power FROM  SUB WHERE  SUB.stamina= 1 UNION
            SELECT SUB.power_hero_name, 'clairvoyance'  AS Power FROM  SUB WHERE  SUB.clairvoyance= 1 UNION
            SELECT SUB.power_hero_name, 'dimensional awareness'  AS Power FROM  SUB WHERE  SUB.dimensional_awareness= 1 UNION
            SELECT SUB.power_hero_name, 'dimensional travel'  AS Power FROM  SUB WHERE  SUB.dimensional_travel= 1 UNION
            SELECT SUB.power_hero_name, 'energy beams'  AS Power FROM  SUB WHERE  SUB.energy_beams= 1 UNION
            SELECT SUB.power_hero_name, 'illusions'  AS Power FROM  SUB WHERE  SUB.illusions= 1 UNION
            SELECT SUB.power_hero_name, 'invulnerability'  AS Power FROM  SUB WHERE  SUB.invulnerability= 1 UNION
            SELECT SUB.power_hero_name, 'telepathy'  AS Power FROM  SUB WHERE  SUB.telepathy= 1 UNION
            SELECT SUB.power_hero_name, 'teleportation'  AS Power FROM  SUB WHERE  SUB.teleportation= 1 UNION
            SELECT SUB.power_hero_name, 'time travel'  AS Power FROM  SUB WHERE  SUB.time_travel= 1 UNION
            SELECT SUB.power_hero_name, 'vision xray'  AS Power FROM  SUB WHERE  SUB.vision_xray= 1
                              )
            SELECT * FROM temp ORDER BY power_hero_name
                `, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    
        }

    }else{
        // if no name is entered we want to get powers for all heroes
        connection.query(`SELECT * FROM(
            SELECT hp.power_hero_name, 'danger sense' AS Power FROM Hero_Power hp WHERE  hp.danger_sense = 1 UNION
            SELECT hp.power_hero_name, 'energy absorption' AS Power FROM Hero_Power hp WHERE hp.energy_absorption = 1 UNION
            SELECT hp.power_hero_name, 'flight' AS Power FROM Hero_Power hp WHERE  hp.flight = 1 UNION
            SELECT hp.power_hero_name, 'immortality'  AS Power FROM Hero_Power hp WHERE  hp.immortality= 1 UNION
            SELECT hp.power_hero_name, 'mind control'  AS Power FROM Hero_Power hp WHERE  hp.mind_control= 1 UNION
            SELECT hp.power_hero_name, 'super speed'  AS Power FROM Hero_Power hp WHERE  hp.super_speed= 1 UNION
            SELECT hp.power_hero_name, 'super strength'  AS Power FROM Hero_Power hp WHERE  hp.super_strength= 1 UNION
            SELECT hp.power_hero_name, 'accelerated healing'  AS Power FROM Hero_Power hp WHERE  hp.accelerated_healing= 1 UNION
            SELECT hp.power_hero_name, 'agility'  AS Power FROM Hero_Power hp WHERE  hp.agility= 1 UNION
            SELECT hp.power_hero_name, 'elasticity'  AS Power FROM Hero_Power hp WHERE  hp.elasticity= 1 UNION
            SELECT hp.power_hero_name, 'energy blasts'  AS Power FROM Hero_Power hp WHERE  hp.energy_blasts= 1 UNION
            SELECT hp.power_hero_name, 'intelligence'  AS Power FROM Hero_Power hp WHERE  hp.intelligence= 1 UNION
            SELECT hp.power_hero_name, 'invisibility'  AS Power FROM Hero_Power hp WHERE  hp.invisibility= 1 UNION
            SELECT hp.power_hero_name, 'levitation'  AS Power FROM Hero_Power hp WHERE  hp.levitation= 1 UNION
            SELECT hp.power_hero_name, 'longevity'  AS Power FROM Hero_Power hp WHERE  hp.longevity = 1 UNION
            SELECT hp.power_hero_name, 'magic'  AS Power FROM Hero_Power hp WHERE  hp.magic= 1 UNION
            SELECT hp.power_hero_name, 'omniscient'  AS Power FROM Hero_Power hp WHERE  hp.omniscient= 1 UNION
            SELECT hp.power_hero_name, 'power suit'  AS Power FROM Hero_Power hp WHERE  hp.power_suit= 1 UNION
            SELECT hp.power_hero_name, 'shapeshifting'  AS Power FROM Hero_Power hp WHERE  hp.shapeshifting= 1 UNION
            SELECT hp.power_hero_name, 'stamina'  AS Power FROM Hero_Power hp WHERE  hp.stamina= 1 UNION
            SELECT hp.power_hero_name, 'clairvoyance'  AS Power FROM Hero_Power hp WHERE  hp.clairvoyance= 1 UNION
            SELECT hp.power_hero_name, 'dimensional awareness'  AS Power FROM Hero_Power hp WHERE  hp.dimensional_awareness= 1 UNION
            SELECT hp.power_hero_name, 'dimensional travel'  AS Power FROM Hero_Power hp WHERE  hp.dimensional_travel= 1 UNION
            SELECT hp.power_hero_name, 'energy beams'  AS Power FROM Hero_Power hp WHERE  hp.energy_beams= 1 UNION
            SELECT hp.power_hero_name, 'illusions'  AS Power FROM Hero_Power hp WHERE  hp.illusions= 1 UNION
            SELECT hp.power_hero_name, 'invulnerability'  AS Power FROM Hero_Power hp WHERE  hp.invulnerability= 1 UNION
            SELECT hp.power_hero_name, 'telepathy'  AS Power FROM Hero_Power hp WHERE  hp.telepathy= 1 UNION
            SELECT hp.power_hero_name, 'teleportation'  AS Power FROM Hero_Power hp WHERE  hp.teleportation= 1 UNION
            SELECT hp.power_hero_name, 'time travel'  AS Power FROM Hero_Power hp WHERE  hp.time_travel= 1 UNION
            SELECT hp.power_hero_name, 'vision xray'  AS Power FROM Hero_Power hp WHERE  hp.vision_xray= 1                                                                                            ) AS temp
            ORDER BY  temp.power_hero_name, temp.Power
            `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
     
}


module.exports = {
    hello, // woohoo
    heroes_alignment, //implemented on the marvel vs. dc page
    hero_score,  //implemented on the versus page
    movies_by_hero, // implemented on the recommendations page
    movies_by_power, // implemented on the recommendations page
    search_heroes, // implemented on the home page, versus page
    heroes_publisher_superpower, // implemented on versus page
    power_list, //implemented on the versus page
    heroes_identity_marvel, //implemented on the marvel vs. dc page
    heroes_identity_DC, //implemented on the marvel vs. dc page
    heroes_alive_marvel, //implemented on the marvel vs. dc page
    heroes_alive_DC //implemented on the marvel vs. dc page
}
