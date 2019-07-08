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