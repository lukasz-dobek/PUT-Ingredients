INSERT INTO users VALUES 
(1,'jkowalski@gmail.com','9b8180df6f2059807fa0f2f0f4e95f3f7a813b2a4e09b48d8f3d2161c4294ede','Kowal',clock_timestamp(),'Jan','Kowalski',false,1,'url.com/test',true,'somesalt'),
(2,'serduszko@gmail.com','d5159aab57cab09e3e6dd52d029c28d614ad827cb26a1669a7689d92081712df','Agusia','2019-02-28 14:32:13','','',false,1,'url.com/asdasd',true,'somesalt'),
(3,'nieoficjalny@gmail.com','a9fd3f94ea352ac9d1ccc2cbfb1fa5395ec3033391d5a4e83a068293281b925b','Predator','2019-01-16 12:12:23','Maciej','Nowak',true,1,'url.com/sss',true,'somesalt'),
(4,'banan@o2.pl','d50e3d3f1031033d026bfd7ed4a17c872edf9b221457dfb1450572cce74b207c','Tester',clock_timestamp(),'Krzysztof','Kot',false,0,'url.com/balaals',false,'somesalt'),
(5,'test@wp.pl','4294de7bdacf80160f2610d081193a599dffd6127a1bc99a13ab2159bc4294e1','Lechita','2019-03-12 08:12:23','','',false,1,'url.com/sdaascvzx',true,'somesalt'),
(6,'cukiereczek@gmail.com','b2f14b180b1ba910d062d8bcfffc8306d841948de70f5eb80d9493463b2e0279','Bandzior','2019-01-21 11:54:23','Sebastian','Dres',false,0,'url.com/321dsada',false,'somesalt'),
(7,'najlepszeszanty@gmail.com','c56e582934fce95d0c8c97ad31957b9e1937e46349520ddd63aec6f8b3ad2dec','Szaman',clock_timestamp(),'','',false,1,'url.com/sssdadas',true,'somesalt'),
(8,'indegrients@gmail.com','f38afe1266d247cf1f6f836ffdbb0ab946c0a7edbcb4ba6e7324b32b9050441e','Szefu','2018-11-16 14:52:32','Szymon','Szymanski',true,1,'url.com/fdfd',true,'somesalt');

INSERT INTO user_activities VALUES
(1,1,clock_timestamp(),'Mozzila Firefox'),
(2,2,'2019-03-13 08:12:23','Internet Explorer'),
(3,8,'2019-04-12 12:42:23','Opera'),
(4,7,clock_timestamp(),'Mozzila Firefox'),
(5,3,'2019-03-12 20:12:23','Google Chrome'),
(6,3,clock_timestamp(),'Google Chrome'),
(7,2,'2019-04-10 08:12:23','Safari'),
(8,8,'2019-02-02 10:12:23','Microsoft Edge'),
(9,4,clock_timestamp(),'Mozzila Firefox'),
(10,6,clock_timestamp(),'Mozzila Firefox');

INSERT INTO categories VALUES
(1,'Sniadanie'),
(2,'Obiad'),
(3,'Kolacja'),
(4,'Przystawki'),
(5,'Deser'),
(6,'Drinki'),
(7,'Kuchnia wloska'),
(8,'Kuchania francuska'),
(9,'Kuchnia chinska'),
(10,'Kuchnia polska');

INSERT INTO recipes VALUES
(1,3,'Pierogi','Zweryfikowany',3.5,'2019-03-12 21:00:00',null,2,'1h30min','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam varius porttitor felis. Praesent ultrices nisi eget mauris sodales semper. Proin.',4,'test'),
(2,2,'Ziemniaki z gzikiem','Zweryfikowany',4.0,'2019-03-13 9:30:00','2019-04-10 9:00:00',1,'1h','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam varius porttitor felis. Praesent ultrices nisi eget mauris sodales semper',3,'test1'),
(3,4,'Stek z warzywami','Oczekuje akceptacji',0.0,clock_timestamp(),null,3,'2h','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tincidunt risus nec mauris venenatis, ut pulvinar ante euismod. Maecenas scelerisque.',2,'test2'),
(4,3,'Spaghetti bolognese','Zweryfikowany',4.73,'2019-02-28 19:00:12',null,3,'1h','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat, metus at sodales auctor, nulla lorem eleifend massa, non dignissim.',2,'test3'),
(5,8,'Pulpety z sosem','Oczekuje akceptacji',0.0,clock_timestamp(),null,1,'30min','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempor nulla eget elit tristique scelerisque. Quisque eget sollicitudin velit, sed.',5,'test3'),
(6,7,'Krokiety','Usuniety',4.0,'2019-03-28 21:00:12',null,2,'2h','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id pretium purus, et sagittis erat. Curabitur vestibulum nisi ac interdum.',4,'test2'),
(7,1,'Poutine','Zweryfikowany',2.0,'2019-04-01 22:10:12',null,2,'1h','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis pretium erat, a lacinia magna. Proin sodales placerat hendrerit. Aenean..',5,'test2'),
(8,4,'Smoothie owocowe','Oczekuje akceptacji',0.0,clock_timestamp(),null,1,'2h','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nisl turpis, euismod in lacus vel, tincidunt mollis odio. Quisque non.',1,'test2');

INSERT INTO categories_per_recipe VALUES
(1,1,2),
(2,2,2),
(3,3,2),
(4,3,3),
(5,4,2),
(6,5,2),
(7,6,2),
(8,6,10),
(9,7,2),
(10,8,4),
(11,8,1);

INSERT INTO favourites VALUES
(1,1,1,clock_timestamp()),
(2,3,7,'2019-04-03 19:23:30'),
(3,8,4,'2019-03-31 13:30:00'),
(4,8,7,clock_timestamp()),
(5,1,2,clock_timestamp()),
(6,2,1,clock_timestamp()),
(7,4,4,'2019-02-02 10:12:23'),
(8,3,7,'2019-02-02 10:12:23');



INSERT INTO user_votes VALUES
(1,1,1,3.0,clock_timestamp()),
(2,3,7,3.5,'2019-04-03 19:23:30'),
(3,8,4,4.0,'2019-03-31 13:30:00'),
(4,8,7,4.5,clock_timestamp()),
(5,1,2,2.0,clock_timestamp()),
(6,2,1,5.0,clock_timestamp()),
(7,4,4,3.5,'2019-02-02 10:12:23'),
(8,3,7,4.5,'2019-02-02 10:12:23');

INSERT INTO reports VALUES
(1,8,1,3,7,'LOREM IPSUM',0,'2019-04-12'),
(2,4,3,8,4,'LOREM IPSUM TESTOWANIE',0,'2019-04-12'),
(3,2,7,3,6,'Naruszenie regulaminu',1,'2019-04-01'),
(4,2,3,8,1,'Nie lubie go',0,'2019-04-02'),
(5,6,8,3,5,'LOREM IPSU',-1,'2019-03-12');

INSERT INTO types VALUES
(1,'warzywa'),
(2,'owoce'),
(3,'mieso'),
(4,'grzyby'),
(5,'owoce morza'),
(6,'zboza'),
(7,'przyprawy'),
(8,'ryby'),
(9,'wyroby cukiernicze');

INSERT INTO ingredients VALUES
(1,1,'Marchew'),
(2,1,'Pomidor'),
(3,2,'Jablko'),
(4,3,'Wolowina'),
(5,4,'Pieczarki'),
(6,5,'Krewetki'),
(7,8,'Losos'),
(8,9,'Cukier'),
(9,3,'Piers z kurczaka'),
(10,4,'Shitake'),
(11,9,'Miod');


INSERT INTO alternative_ingredients VALUES
(1,8,11),
(2,11,8),
(3,4,9),
(4,9,4),
(5,5,10),
(6,10,5);

INSERT INTO units VALUES
(1,'g'),
(2,'kg'),
(3,'ml'),
(4,'l'),
(5,'lyzeczka'),
(6,'lyzka'),
(7,'szklanka'),
(8,'dkg'),
(9,'szczypta');

INSERT INTO ingredients_used_in_recipe VALUES
(1,4,2,2,'1'),
(2,8,3,1,'200'),
(3,4,4,1,'500'),
(4,5,4,2,'1'),
(5,5,2,1,'1'),
(6,1,8,9,'1');
