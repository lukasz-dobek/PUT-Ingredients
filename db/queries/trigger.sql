CREATE OR REPLACE FUNCTION add_to_favourites()
  RETURNS trigger AS
$BODY$
BEGIN
   IF NEW.score > 4 THEN
       	INSERT INTO favourites (user_id, recipe_id, date_of_favourite)
       	VALUES(new.user_id, new.recipe_id, new.date_of_vote);
   END IF;
   RETURN NEW;
END;
$BODY$
language plpgsql;

CREATE TRIGGER add_to_favourites
AFTER INSERT 
ON user_votes
FOR EACH ROW
EXECUTE PROCEDURE add_to_favourites();

CREATE OR REPLACE FUNCTION add_ingredients_to_shopping_list()
  RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO ingredients_used_in_shop_list (shop_list_id, ingredient_id,unit_id,amount)
    select sl.id_shop_list, i.id_ingredient,u.id_unit,iur.amount  from shop_lists sl
    join recipes r on r.id_recipe=sl.recipe_id
    join ingredients_used_in_recipe iur on iur.recipe_id=r.id_recipe
    join ingredients i on i.id_ingredient=iur.ingredient_id
    join units u on u.id_unit=iur.unit_id
    join users us on sl.user_id=us.id_user
    where sl.recipe_id= new.recipe_id;
    RETURN NEW;
END;
$BODY$
language plpgsql;

CREATE TRIGGER add_ingredients_to_shopping_list
AFTER INSERT
ON shop_lists
FOR EACH ROW
EXECUTE PROCEDURE add_ingredients_to_shopping_list();

CREATE OR REPLACE FUNCTION favourites_to_activities()
  RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO user_activities (user_id, date_of_activity, activity_name, link)
    VALUES(NEW.user_id, NEW.date_of_favourite, 'Dodanie do ulubionych', (SELECT rec.link_to_recipe FROM recipes rec WHERE rec.id_recipe = NEW.recipe_id));
   RETURN NEW;
END;
$BODY$
language plpgsql;

CREATE TRIGGER favourites_to_activities
AFTER INSERT 
ON favourites
FOR EACH ROW
EXECUTE PROCEDURE favourites_to_activities();

CREATE OR REPLACE FUNCTION reports_to_activities()
  RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO user_activities (user_id, date_of_activity, activity_name, link)
    VALUES(NEW.reportee_id, NEW.date_of_report, 'Zgłoszenie', (SELECT rec.link_to_recipe FROM recipes rec WHERE rec.id_recipe = NEW.recipe_id));
   RETURN NEW;
END;
$BODY$
language plpgsql;

CREATE TRIGGER reports_to_activities
AFTER INSERT 
ON reports
FOR EACH ROW
EXECUTE PROCEDURE reports_to_activities();

CREATE OR REPLACE FUNCTION votes_to_activities()
  RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO user_activities (user_id, date_of_activity, activity_name, link, details)
    VALUES(NEW.user_id, 
    NEW.date_of_vote, 
    'Ocena', 
    (SELECT rec.link_to_recipe 
      FROM recipes rec 
      WHERE rec.id_recipe = NEW.recipe_id), 'Ocena:' || NEW.score);
   RETURN NEW;
END;
$BODY$
language plpgsql;

CREATE TRIGGER votes_to_activities
AFTER INSERT 
ON user_votes
FOR EACH ROW
EXECUTE PROCEDURE votes_to_activities();

CREATE OR REPLACE FUNCTION recipes_to_activities()
  RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO user_activities (user_id, date_of_activity, activity_name, link)
    VALUES(NEW.user_id, 
    NEW.date_of_creation, 
    'Dodanie przepisu', 
    NEW.link_to_recipe);
   RETURN NEW;
END;
$BODY$
language plpgsql;

CREATE TRIGGER recipes_to_activities
AFTER INSERT 
ON recipes
FOR EACH ROW
EXECUTE PROCEDURE recipes_to_activities();

CREATE OR REPLACE FUNCTION register_to_activities()
  RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO user_activities (user_id, date_of_activity, activity_name)
    VALUES(NEW.id_user, 
    NEW.date_of_join, 
    'Rejestracja'
    );
   RETURN NEW;
END;
$BODY$
language plpgsql;

CREATE TRIGGER register_to_activities
AFTER INSERT 
ON users
FOR EACH ROW
EXECUTE PROCEDURE register_to_activities();


CREATE OR REPLACE FUNCTION recipe_modification_to_activities()
  RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO user_activities (user_id, date_of_activity, activity_name, link)
    VALUES(NEW.user_id, 
    NEW.date_of_modification, 
    'Modyfikacja przepisu',
    NEW.link_to_recipe
    );
   RETURN NEW;
END;
$BODY$
language plpgsql;

CREATE TRIGGER recipe_modification_to_activities
AFTER UPDATE 
ON recipes
FOR EACH ROW
EXECUTE PROCEDURE recipe_modification_to_activities();