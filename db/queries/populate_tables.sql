INSERT INTO users (email_address,password,nickname,date_of_join,name,surname,is_admin,state,activation_url) VALUES
('jkowalski@gmail.com','9b8180df6f2059807fa0f2f0f4e95f3f7a813b2a4e09b48d8f3d2161c4294ede','Kowal',clock_timestamp(),'Jan','Kowalski',false,1,'url.com/test'),
('serduszko@gmail.com','d5159aab57cab09e3e6dd52d029c28d614ad827cb26a1669a7689d92081712df','Agusia','2019-02-28 14:32:13','','',false,1,'url.com/asdasd'),
('nieoficjalny@gmail.com','a9fd3f94ea352ac9d1ccc2cbfb1fa5395ec3033391d5a4e83a068293281b925b','Predator','2019-01-16 12:12:23','Maciej','Nowak',true,1,'url.com/sss'),
('banan@o2.pl','d50e3d3f1031033d026bfd7ed4a17c872edf9b221457dfb1450572cce74b207c','Tester',clock_timestamp(),'Krzysztof','Kot',false,0,'url.com/balaals'),
('test@wp.pl','4294de7bdacf80160f2610d081193a599dffd6127a1bc99a13ab2159bc4294e1','Lechita','2019-03-12 08:12:23','','',false,1,'url.com/sdaascvzx'),
('cukiereczek@gmail.com','b2f14b180b1ba910d062d8bcfffc8306d841948de70f5eb80d9493463b2e0279','Bandzior','2019-01-21 11:54:23','Sebastian','Dres',false,0,'url.com/321dsada'),
('najlepszeszanty@gmail.com','c56e582934fce95d0c8c97ad31957b9e1937e46349520ddd63aec6f8b3ad2dec','Szaman',clock_timestamp(),'','',false,1,'url.com/sssdadas'),
('indegrients@gmail.com','f38afe1266d247cf1f6f836ffdbb0ab946c0a7edbcb4ba6e7324b32b9050441e','Szefu','2018-11-16 14:52:32','Szymon','Szymanski',true,1,'url.com/fdfd');

INSERT INTO user_activities (user_id,date_of_login,browser_info) VALUES
(1,clock_timestamp(),'Mozzila Firefox'),
(2,'2019-03-13 08:12:23','Internet Explorer'),
(8,'2019-04-12 12:42:23','Opera'),
(7,clock_timestamp(),'Mozzila Firefox'),
(3,'2019-03-12 20:12:23','Google Chrome'),
(3,clock_timestamp(),'Google Chrome'),
(2,'2019-04-10 08:12:23','Safari'),
(8,'2019-02-02 10:12:23','Microsoft Edge'),
(4,clock_timestamp(),'Mozzila Firefox'),
(6,clock_timestamp(),'Mozzila Firefox');

INSERT INTO categories (category_name) VALUES
('Śniadanie'),
('Obiad'),
('Kolacja'),
('Przystawki'),
('Deser'),
('Drinki'),
('Kuchnia włoska'),
('Kuchnia francuska'),
('Kuchnia chińska'),
('Kuchnia polska');

INSERT INTO recipes (user_id,recipe_name,state,score,date_of_creation,date_of_modification,complicity,preparation_time,description,number_of_people,photo_one, photo_two, photo_three, photo_four, link_to_recipe) VALUES
(3,'Pierogi','Zweryfikowany',3.5,'2019-03-12 21:00:00',null,2,'1h30min','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam varius porttitor felis. Praesent ultrices nisi eget mauris sodales semper. Proin.',4,'/images/pierogi-z-jagodami.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Pierogi'), ' ', '_')),
(2,'Ziemniaki z gzikiem','Zweryfikowany',4.0,'2019-03-13 9:30:00','2019-04-10 9:00:00',1,'1h','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam varius porttitor felis. Praesent ultrices nisi eget mauris sodales semper',3,'/images/pyry-z-gzikiem.jpg',NULL,NULL,NULL, '/recipes/' || replace(lower('Ziemniaki z gzikiem'), ' ', '_')),
(4,'Stek z warzywami','Oczekuje akceptacji',0.0,clock_timestamp(),null,3,'2h','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tincidunt risus nec mauris venenatis, ut pulvinar ante euismod. Maecenas scelerisque.',2,'/images/stek-z-warzywami.jpg',NULL,NULL,NULL, '/recipes/' || replace(lower('Stek z warzywami'), ' ', '_')),
(3,'Spaghetti bolognese','Zweryfikowany',4.73,'2019-02-28 19:00:12',null,3,'1h','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat, metus at sodales auctor, nulla lorem eleifend massa, non dignissim.',2,'/images/spaghetti-bolognese.jpg',NULL,NULL,NULL, '/recipes/' || replace(lower('Spaghetti bolognese'), ' ', '_')),
(8,'Pulpety z sosem','Oczekuje akceptacji',0.0,clock_timestamp(),null,1,'30min','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempor nulla eget elit tristique scelerisque. Quisque eget sollicitudin velit, sed.',5,'/images/pulpety-z-sosem.jpg',NULL,NULL,NULL, '/recipes/' || replace(lower('Pulpety z sosem'), ' ', '_')),
(7,'Krokiety','Usuniety',4.0,'2019-03-28 21:00:12',null,2,'2h','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id pretium purus, et sagittis erat. Curabitur vestibulum nisi ac interdum.',4,'/images/krokiety.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Krokiety'), ' ', '_')),
(1,'Poutine','Zweryfikowany',2.0,'2019-04-01 22:10:12',null,2,'1h','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis pretium erat, a lacinia magna. Proin sodales placerat hendrerit. Aenean..',5,'/images/poutine.jpg',NULL,NULL,NULL, '/recipes/' || replace(lower('Poutine'), ' ', '_')),
(4,'Smoothie owocowe','Oczekuje akceptacji',0.0,clock_timestamp(),null,1,'2h','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nisl turpis, euismod in lacus vel, tincidunt mollis odio. Quisque non.',1,'/images/smoothie-z-owocami.jpg',NULL,NULL,NULL, '/recipes/' || replace(lower('Smoothie owocowe'), ' ', '_')),
(4,'Frytki z warzyw','Zweryfikowany',3.0,clock_timestamp(),null,2,'30min','Lorem Ipsum blablaaablalbalabal',4,'/images/frytki-z-warzyw.jpg',NULL,NULL,NULL, '/recipes/' || replace(lower('Frytki z warzyw'), ' ', '_'));

INSERT INTO categories_per_recipe (recipe_id,category_id) VALUES
(1,2),
(2,2),
(3,2),
(3,3),
(4,2),
(5,2),
(6,2),
(6,10),
(7,2),
(8,4),
(8,1),
(9,4);

INSERT INTO favourites (user_id, recipe_id, date_of_favourite) VALUES
(1,1,clock_timestamp()),
(3,7,'2019-04-03 19:23:30'),
(8,4,'2019-03-31 13:30:00'),
(8,7,clock_timestamp()),
(1,2,clock_timestamp()),
(2,1,clock_timestamp()),
(4,4,'2019-02-02 10:12:23'),
(3,7,'2019-02-02 10:12:23');



INSERT INTO user_votes (user_id,recipe_id,score, date_of_vote) VALUES
(1,1,3.0,clock_timestamp()),
(3,7,3.5,'2019-04-03 19:23:30'),
(8,4,4.0,'2019-03-31 13:30:00'),
(8,7,4.5,clock_timestamp()),
(1,2,2.0,clock_timestamp()),
(2,1,5.0,clock_timestamp()),
(4,4,3.5,'2019-02-02 10:12:23'),
(3,7,4.5,'2019-02-02 10:12:23');

INSERT INTO reports (reportee_id,reported_id,assigned_admin_id,recipe_id,description,status,date_of_report) VALUES
(8,1,3,7,'LOREM IPSUM',0,'2019-04-12'),
(4,3,8,4,'LOREM IPSUM TESTOWANIE',0,'2019-04-12'),
(2,7,3,6,'Naruszenie regulaminu',1,'2019-04-01'),
(2,3,8,1,'Nie lubie go',0,'2019-04-02'),
(6,8,3,5,'LOREM IPSU',-1,'2019-03-12');

INSERT INTO types (name) VALUES
('warzywa'),
('owoce'),
('mieso'),
('grzyby'),
('owoce morza'),
('zboza'),
('przyprawy'),
('ryby'),
('wyroby cukiernicze');

INSERT INTO ingredients (type_id,ingredient_name) VALUES
(1,'Marchew'),
(1,'Pomidor'),
(2,'Jablko'),
(3,'Wolowina'),
(4,'Pieczarki'),
(5,'Krewetki'),
(8,'Losos'),
(9,'Cukier'),
(3,'Piers z kurczaka'),
(4,'Shitake'),
(9,'Miod');


INSERT INTO alternative_ingredients (ingredient_id,replacement_id) VALUES
(8,11),
(11,8),
(4,9),
(9,4),
(5,10),
(10,5);

INSERT INTO units (unit_name) VALUES
('g'),
('kg'),
('ml'),
('l'),
('lyzeczka'),
('lyzka'),
('szklanka'),
('dkg'),
('szczypta');

INSERT INTO ingredients_used_in_recipe (recipe_id,ingredient_id,unit_id,amount) VALUES
(4,2,2,'1'),
(8,3,1,'200'),
(4,4,1,'500'),
(5,4,2,'1'),
(5,2,1,'1'),
(1,8,9,'1');
