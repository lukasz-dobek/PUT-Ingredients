-- Think about constraints - DEFAULT and CHECK

-- Users table
CREATE TABLE IF NOT EXISTS users (
	id_user SERIAL PRIMARY KEY,
	email_address VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(128) NOT NULL,
	nickname VARCHAR(50) UNIQUE NOT NULL,
	date_of_join TIMESTAMP NOT NULL,
	name VARCHAR(50),
	surname VARCHAR(50),
	is_admin BOOLEAN NOT NULL,
	state INTEGER NOT NULL,
	activation_url TEXT,
	reset_password_url TEXT
);

-- User_activities table
CREATE TABLE IF NOT EXISTS user_activities (
	id_user_activity SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id_user) NOT NULL,
	date_of_login TIMESTAMP NOT NULL,
	browser_info VARCHAR(50) NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
	id_category SERIAL PRIMARY KEY,
	category_name VARCHAR(50) NOT NULL
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
	id_recipe SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id_user) NOT NULL,
	recipe_name VARCHAR(100) UNIQUE NOT NULL,
	state VARCHAR(20) NOT NULL,
	score NUMERIC,
	date_of_creation TIMESTAMP NOT NULL,
	date_of_modification TIMESTAMP,
	complicity INTEGER NOT NULL CONSTRAINT complicity_validator CHECK(complicity > 0 AND complicity < 4),
	preparation_time VARCHAR(50) NOT NULL,
	description TEXT NOT NULL,
	number_of_people INTEGER NOT NULL,
	link_to_recipe VARCHAR(100) UNIQUE,
	photo_one VARCHAR(100) NOT NULL,
	photo_two VARCHAR(100),
	photo_three VARCHAR(100),
	photo_four VARCHAR(100),
	visible_email BOOLEAN NOT NULL;
);

-- Categories per recipe
CREATE TABLE IF NOT EXISTS categories_per_recipe (
	id_link SERIAL PRIMARY KEY,
	recipe_id INTEGER REFERENCES recipes(id_recipe) NOT NULL,
	category_id INTEGER REFERENCES categories(id_category) NOT NULL
);	

-- Favourites table
CREATE TABLE IF NOT EXISTS favourites (
	id_favourite SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id_user) NOT NULL,
	recipe_id INTEGER REFERENCES recipes(id_recipe) NOT NULL,
	date_of_favourite DATE NOT NULL
);

-- User_votes table
CREATE TABLE IF NOT EXISTS user_votes (
	id_user_vote SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id_user) NOT NULL,
	recipe_id INTEGER REFERENCES recipes(id_recipe) NOT NULL,
	score NUMERIC NOT NULL,
	date_of_vote TIMESTAMP NOT NULL
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
	id_report SERIAL PRIMARY KEY,
	reportee_id INTEGER REFERENCES users(id_user) NOT NULL,
	reported_id INTEGER REFERENCES users(id_user) NOT NULL CONSTRAINT reported_validator CHECK(reportee_id <> reported_id),
	assigned_admin_id INTEGER REFERENCES users(id_user) NOT NULL,
	recipe_id INTEGER REFERENCES recipes(id_recipe) NOT NULL,
	description TEXT NOT NULL,
	status INTEGER NOT NULL,
	date_of_report DATE
);

-- Types table
CREATE TABLE IF NOT EXISTS types (
	id_type SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
	id_ingredient SERIAL PRIMARY KEY,
	type_id INTEGER REFERENCES types(id_type) NOT NULL,
	ingredient_name VARCHAR(50) NOT NULL
);

-- Alternative_ingredients table
-- TODO whole bunch of stuff to discuss
CREATE TABLE IF NOT EXISTS alternative_ingredients (
	id_alternative_ingredient SERIAL PRIMARY KEY,
	ingredient_id INTEGER REFERENCES ingredients(id_ingredient) NOT NULL,
	replacement_id INTEGER REFERENCES ingredients(id_ingredient) NOT NULL
);

-- Units table
CREATE TABLE IF NOT EXISTS units (
	id_unit SERIAL PRIMARY KEY,
	unit_name VARCHAR(50) NOT NULL
);

-- Ingredients_used_in_recipe table
CREATE TABLE IF NOT EXISTS ingredients_used_in_recipe (
	id_connection SERIAL PRIMARY KEY,
	recipe_id INTEGER REFERENCES recipes(id_recipe) NOT NULL,
	ingredient_id INTEGER REFERENCES ingredients(id_ingredient) NOT NULL,
	unit_id INTEGER REFERENCES units(id_unit) NOT NULL,
	amount VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS shop_lists (
	id_shop_list SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id_user) NOT NULL,
	recipe_id INTEGER REFERENCES recipes(id_recipe) NOT NULL
);

CREATE TABLE IF NOT EXISTS ingredients_used_in_shop_list (
	id_connection SERIAL PRIMARY KEY,
	shop_list_id INTEGER REFERENCES shop_lists(id_shop_list) NOT NULL,
	ingredient_id INTEGER REFERENCES ingredients(id_ingredient) NOT NULL,
	unit_id INTEGER REFERENCES units(id_unit) NOT NULL,
	amount VARCHAR(50) NOT NULL
);

-- Persistant session table
CREATE TABLE IF NOT EXISTS user_session (
    "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE user_session ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;