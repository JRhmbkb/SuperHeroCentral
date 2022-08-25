CREATE TABLE Cast_1 (
  person_id     INT,
  justwatch_id      VARCHAR(30),
  name         VARCHAR(30),
  cast_character    VARCHAR(50),
  role         VARCHAR(30),
  PRIMARY KEY (person_id, justwatch_id, name)
);
 
 
CREATE TABLE Heroes (
  hero_id          INT,
  urlslug  VARCHAR(100),
  name         VARCHAR(30),
  publisher     VARCHAR(30),
  alignment     VARCHAR(30),
  eye_color     VARCHAR(30),
  hair_color     VARCHAR(30),
   gender       VARCHAR(30),
  PRIMARY KEY (hero_id),
);
 
CREATE TABLE DC_Heroes (
  hero_id      INT NOT NULL,
  name         VARCHAR(30) NOT NULL,
  identity     VARCHAR(30),
  gsm          VARCHAR(30),
  alive        VARCHAR(30),
  appearances  VARCHAR(30),
  first_appearance_year  INT,
  first_appearance_month VARCHAR(30),
  PRIMARY KEY(hero_id),
  FOREIGN KEY (hero_id) REFERENCES Heroes(hero_id),
);
 
 
CREATE TABLE Other_Heroes (
  hero_id INT NOT NULL,
  name   VARCHAR(30) NOT NULL,
  race   VARCHAR(30),
  height INT,
  skin_color VARCHAR(30),
  PRIMARY KEY(hero_id),
  FOREIGN KEY (hero_id) REFERENCES Heroes(hero_id),
 
);
 
 
CREATE TABLE Marvel_Heroes (
   hero_id      INT NOT NULL,
   name         VARCHAR(30) NOT NULL,
   identity     VARCHAR(30),
   gsm          VARCHAR(30),
   alive        VARCHAR(30),
   appearances  VARCHAR(30),
   first_appearance_month VARCHAR(30),
   first_appearance_year  INT,
   PRIMARY KEY(hero_id),
   FOREIGN KEY (hero_id) REFERENCES Heroes(hero_id),
 
);
 
CREATE TABLE Superpowers (
  power_hero_name     VARCHAR(30),
  danger_sense      INT,
  energy_absorption  INT,
  flight       INT,
  immortality       INT,
  mind_control      INT,
  super_speed       INT,
  super_strength    INT,
  accelerated_healing    INT,
  agility          INT,
  elasticity    INT,
  energy_blasts     INT,
  intelligence      INT,
  invisibility      INT,
  levitation    INT,
  longevity     INT,
  magic        INT,
  omniscient    INT,
  power_suit    INT,
  shapeshifting     INT,
  stamina          INT,
  clairvoyance      INT,
  dimensional_awareness  INT,
  dimensional_travel INT,
  energy_beams      INT,
  illusions     INT,
  invulnerability       INT,
   telepathy     INT,
   teleportation     INT,
   time_travel       INT,
   vision_xray       INT,
  PRIMARY KEY (hero_name)
);
 
 
CREATE TABLE Movie_TV (
  justwatch_id      VARCHAR(30),
  title        VARCHAR(30),
   show_type     VARCHAR(30),
  description       VARCHAR(100),
   release_year      INT,
  age_certification  VARCHAR(30),
  runtime          INT,
  genres       VARCHAR(30),
  production_countries   VARCHAR(30),
  seasons          INT,
  imdb_id          VARCHAR(30,
  imdb_score    FLOAT,
  imdb_votes    INT,
  tmdb_popularity       FLOAT,
  tmdb_score    FLOAT,
  PRIMARY KEY (justwatch_id)
);
 
 
CREATE OR REPLACE VIEW Movie_TV_Cast  AS
SELECT c.*,
      MT.age_certification AS age_certification,
      MT.description AS description,
      MT.imdb_id AS imdb_id,
      MT.imdb_score AS imdb_score,
      MT.title AS title
FROM Cast_1 c JOIN Movie_TV MT on c.justwatch_id = MT.justwatch_id
ORDER BY c.person_id;
 
CREATE OR REPLACE VIEW Hero_Power AS
   SELECT h.hero_id AS hero_id, h.Publisher AS publisher, h.name AS name, h.alignment as alignment,sp.*
   FROM Heroes h JOIN Superpowers sp ON h.name LIKE sp.power_hero_name;

