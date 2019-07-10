INSERT INTO users (email_address,password,nickname,date_of_join,name,surname,is_admin,state,activation_url) VALUES
('ingredients@op.pl','$argon2i$v=19$m=4096,t=3,p=1$+l2YsT0n/bnO1SaL74/5Vg$VR+izSUIQ7+7QDZGroVnjVF68rN30szkuWBpPL1KK4k','Marek','2019-07-01 20:11:20.331','Marek','Drzewo',true,1,null),
('fzm99349@bcaoo.com','$argon2i$v=19$m=4096,t=3,p=1$QKMZ2KtLB8s0uwsYy68Cig$dIoyqoV4ZjpI1GYh6B585wwGt+y262JEmSRqUADAfWU','RóżowaPantera','2019-07-01 20:40:01.206','Małgorzata','Koperek',false,1,null),
('rtd30603@bcaoo.com','$argon2i$v=19$m=4096,t=3,p=1$MmX1XLXN6pFlNNMFH8hJEg$Z+QD8lxuMAbJvoTApkF96d2veD5gq0+7FT7Feuy2KlQ','Hanka','2019-07-01 20:43:20.871','Hanna','Mikołajczyk',false,1,null),
('ymv54842@bcaoo.com','$argon2i$v=19$m=4096,t=3,p=1$PhsoTYCj2G1a3iZL7UYT6A$anR+yjUeUkDkzDO0wdeL2L4XRJnDkgHI0L0Fxi4/PYo','Szalono-oki','2019-07-01 20:48:45.527','Szymon','Kęsy',false,1,null),
('detko.olga@gmail.com','$argon2i$v=19$m=4096,t=3,p=1$bnc/gRhPsZkO38ZnYkXkHA$jAeUrZbmeFZr160YXUAoKKHUTkMfUtO3ame7g4CLuZE','Ola','2019-07-01 20:50:33','Olga','Detko',false,1,null),
('hhc73140@bcaoo.com','$argon2i$v=19$m=4096,t=3,p=1$gLKVfjl4eHI2i666KMMcgQ$rqu/7UReQSTJWvky31Ev8hdM32MP6MtP+UedFO6PrgI','Pawlo','2019-07-01 20:52:08.839','Paweł','Nosek',false,1,null),
('cth05124@bcaoo.com','$argon2i$v=19$m=4096,t=3,p=1$BmV0AtcMECsNZuvvCHXj+g$ypO5m3ZL/SOTnhLjP0pylyxAVa+uDAHF7XMOGRMEq0k','MaTYlda','2019-07-01 20:53:41.948','Matylda','Dobierała',false,1,null),
('del48851@bcaoo.com','$argon2i$v=19$m=4096,t=3,p=1$lsIkrJdJWsmCkyrIvvjiOQ$VhA5o6nNu8D+8ET/M6aQZh0nEbeDcszF0/Y5Uklb73o','samuraj','2019-07-01 20:55:46.454','Kinga','Bartłomiej',false,1,null),
('jfq23989@bcaoo.com','$argon2i$v=19$m=4096,t=3,p=1$5Z6sleuhvp1FLzrm8Nr6bg$3XNIYuhNp+1/hrMo/hAdy+D6/tqeWIWibDrX1Llq+J4','NoneOne','2019-07-01 20:58:10.237','Kamil','Nowal',false,0,'61aff79bbff3ddbdbc7ac6bdda4ac722356aa36bd902d2a1d0e290e56f7824b4616b116ab41c4e091fda4af07182ae2c'),
('adepcio@gmail.com','$argon2i$v=19$m=4096,t=3,p=1$QQwvDUGaIWmp/hxUy8F/7A$O9RTi42j+4146zqFN/n5TAaGpjMZAz3NGFy4Vci8xeU','Łukasz','2019-07-01 20:59:48.111','Łukasz','Dobek',false,1,null);


INSERT INTO user_activities (user_id,date_of_login,browser_info) VALUES
(1,'2019-06-01 08:11:09.931','Mozzila Firefox'),
(2,'2019-06-01 14:11:20.319','Internet Explorer'),
(4,'2019-06-01 15:12:30.130','Google Chrome'),
(7,'2019-06-02 20:17:20.337','Mozzila Firefox'),
(10,'2019-06-02 20:19:35.860','Google Chrome'),
(3,'2019-06-02 22:19:21.330','Google Chrome'),
(2,'2019-06-03 09:19:21.330','Safari'),
(8,'2019-06-03 22:01:27.625','Microsoft Edge'),
(4,'2019-06-04 11:55:21.310','Google Chrome'),
(6,'2019-06-04 22:11:27.625','Google Chrome'),
(5,'2019-06-04 23:13:37.623','Mozzila Firefox'),
(2,'2019-06-05 22:51:25.555','Internet Explorer'),
(8,'2019-06-05 22:56:26.611','Opera'),
(7,'2019-06-05 23:11:33.325','Mozzila Firefox'),
(3,'2019-06-05 23:13:27.828','Google Chrome'),
(10,'2019-06-06 06:03:26.668','Google Chrome'),
(2,'2019-06-06 06:07:25.008','Safari'),
(1,'2019-06-06 06:44:34.062','Microsoft Edge'),
(4,'2019-06-07 02:03:26.111','Mozzila Firefox'),
(6,'2019-06-07 07:49:19.955','Opera'),
(6,'2019-06-07 08:35:56.131','Mozzila Firefox'),
(10,'2019-06-08 10:16:26.369','Internet Explorer'),
(8,'2019-06-08 11:17:37.100','Opera'),
(3,'2019-06-08 21:11:23.355','Mozzila Firefox'),
(7,'2019-06-08 22:21:34.669','Google Chrome'),
(10,'2019-06-08 23:25:45.330','Google Chrome'),
(2,'2019-06-08 23:57:57.980','Safari'),
(10,'2019-06-09 06:21:32.025','Microsoft Edge'),
(4,'2019-06-09 14:04:01.090','Mozzila Firefox'),
(6,'2019-06-09 15:33:47.105','Opera'),
(5,'2019-06-09 15:41:31.112','Mozzila Firefox'),
(2,'2019-06-09 16:41:21.518','Internet Explorer'),
(8,'2019-06-09 22:32:59.199','Opera'),
(5,'2019-06-10 04:55:10.005','Mozzila Firefox'),
(5,'2019-06-10 07:13:13.828','Google Chrome'),
(3,'2019-06-11 08:03:26.668','Google Chrome'),
(2,'2019-06-11 09:19:25.808','Safari'),
(2,'2019-06-11 14:57:55.062','Microsoft Edge'),
(4,'2019-06-12 16:03:26.181','Mozzila Firefox'),
(6,'2019-06-14 18:47:00.205','Google Chrome');


INSERT INTO categories (category_name) VALUES
('Śniadanie'),
('Obiad'),
('Kolacja'),
('Przystawka'),
('Przekąska'),
('Deser'),
('Napoje'),
('Smoothies'),
('Zupy'),
('Sałatki'),
('Makaron'),
('Owoce morza'),
('Fit'),
('Kuchnia włoska'),
('Kuchnia japońska'),
('Kuchnia polska'),
('Kuchnia amerykańska'),
('Kuchnia meksykańska'),
('Kuchnia tajska'),
('Kuchnia chińska'),
('Kuchnia francuska'),
('Kuchnia angielska'),
('Kuchnia orientalna');


INSERT INTO types (name) VALUES
('warzywa'),
('owoce'),
('mieso'),
('nabiał'),
('oleje'),
('orzechy i nasiona'),
('grzyby'),
('owoce morza'),
('zboża'),
('przyprawy'),
('ryby'),
('konserwy i przetwory'),
('napoje'),
('wyroby cukiernicze');


INSERT INTO ingredients (type_id,ingredient_name) VALUES
(1,'Marchew'),
(1,'Pomidor'),
(2,'Jabłko'),
(3,'Wołowina'),
(7,'Pieczarki'),
(8,'Krewetki'),
(11,'Łosoś'),
(14,'Cukier'),
(3,'Pierś z kurczaka'),
(7,'Shitake'),
(14,'Miód'),
(4,'Twaróg'),
(4,'Jajka'),
(4,'Mleko'),
(9,'Mąka pszenna'),
(9,'Proszek do pieczenia'),
(2,'Borówki'),
(4,'Maślanka'),
(4,'Jogurt naturlany'),
(2,'Banan'),
(4,'Masło'),
(9,'Płatki owsiane'),
(6,'Ziarna słonecznika'),
(6,'Pestki dyni'),
(5,'Olej roślinny'),
(12,'Sos sojowy'),
(12,'Ocet ryżowy'),
(12,'Syrop klonowy'),
(14,'Cukier trzcinowy'),
(1,'Czosnek'),
(1,'Imbir'),
(9,'Ryż biały'),
(9,'Ryż brązowy'),
(5,'Oliwa'),
(1,'Papryka'),
(1,'Groszek zielony'),
(5,'Olej sezamowy'),
(6,'Sezam'),
(1,'Szczypiorek'),
(4,'Mozarella'),
(4,'Mozarella Light'),
(3,'Salami'),
(12,'Ketchup'),
(12,'Koncentrat pomidorowy'),
(9,'Kasza jaglana'),
(4,'Mleko roślinne'),
(12,'Kako'),
(14,'Cziemna czekolada'),
(14,'Czekolada mleczna'),
(2,'Maliny'),
(2,'Maliny mrożone'),
(2,'Melon'),
(4,'Mozarella kuleczki'),
(3,'Szynka parmeńska'),
(3,'Szynka suszona'),
(3,'Prosciutto crudo'),
(10,'Bazylia świeża'),
(5,'Ocet balsamiczny'),
(5,'Zagęszczony Ocet balsamiczny'),
(5,'Oliwa extra vergine'),
(1,'Cebula'),
(13,'Wino białe'),
(5,'Ocet winny'),
(1,'Bulion drobiowy'),
(12,'Bulion jarzynowy'),
(10,'Chilli'),
(1,'Limonka'),
(1,'Cytryna'),
(9,'Ryż jaśminowy'),
(12,'Pomidorki koktajlowe'),
(10,'Oregano'),
(10,'Bazylia suszona'),
(10,'Natka pietruszki'),
(10,'Suszona natka pietruszki'),
(10,'Papryka słodka'),
(10,'Kurkuma'),
(10,'Curry'),
(10,'Suszone Oregano'),
(10,'Papryka ostra'),
(10,'Sól'),
(10,'Pieprz'),
(4,'Śmietana gęsta'),
(1,'Fasolka świża'),
(10,'Fasolka suszona'),
(12,'Fasolka z puszki'),
(10,'Papryczka chilli'),
(12,'Passata pomidorowa'),
(12,'Pomidory z puszki krojone'),
(12,'Pomidory z puszki całe'),
(9,'Pieczywo'),
(2,'Ananas'),
(4,'Mleko kokosowe'),
(14,'Lody waniliowe'),
(14,'Lody śmietankowe'),
(13,'Rum biały'),
(13,'Likier kokosowy'),
(14,'Lód'),
(14,'Wiórki kokosowe'),
(13,'Woda'),
(12,'Pasta tom yum'),
(7,'Grzyby chińskie z puszki'),
(12,'Sos rybny'),
(1,'Sok z cytryny'),
(10,'Kolendra'),
(9,'Makraon'),
(11,'Łosoś wędzony'),
(10,'Koperek'),
(4,'Śmietanka 30%'),
(1,'Roszponka'),
(5,'Ser cheddar'),
(5,'Ser gouda'),
(12,'Bulion warzywny'),
(3,'Wędzone żeberka'),
(3,'Wędzone kości wołowe'),
(3,'Biała kiełbasa'),
(12,'Żur'),
(10,'Majeranek suszony'),
(4,'Śmietanka 18%'),
(6,'Orzechy pinii'),
(4,'Parmezan'),
(7,'Tortilla'),
(2,'Truskawki'),
(1,'Sok z limonki');


INSERT INTO recipes (user_id,recipe_name,state,score,date_of_creation,date_of_modification,complicity,preparation_time,description,number_of_people,photo_one, photo_two, photo_three, photo_four, link_to_recipe) VALUES
(5,'Zielone Pesto','Zweryfikowany',3.5,'2019-03-12 21:00:00',null,1,'30min','Wszystkie składniki utrzeć w moździerzu lub zmiksować rozdrabniaczem (lub mini melakserem lub blenderem), tak aby powstały małe drobinki składników, na koniec doprawić solą morską i pieprzem.',6,'/images/pesto_1.jpeg','/images/pesto_2.jpeg',NULL,NULL, '/recipes/' || replace(lower('Zielone Pesto'), ' ', '_')),
(1,'Sałatka cheddar','Zweryfikowany',4.3,'2019-05-15 21:00:00',null,1,'30min','Na talerzach ułożyć sałatę, dodać ugotowane jajka pokrojone na ćwiartki, posypać pokrojonymi pomidorkami koktajlowymi, zrumienionym na suchej patelni słonecznikiem i startym na tarce serem cheddar. Wymieszać składniki winegretu i polać do sałatce. Posypać szczypiorkiem i udekorować listkami bazylii.',2,'/images/salatka-cheddar_1.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Sałatka cheddar'), ' ', '_')),
(2,'Makaron z łososiem wędzonym','Zweryfikowany',4.5,'2019-05-10 23:00:00',null,2,'1h','Ugotować makaron w osolonej wodzie, odcedzić i wsypać do miski.
Garnek po makaronie postawić z powrotem na palniku, wlać oliwę i zeszklić pokrojoną w kosteczkę cebulę.
Dodać pokrojonego łososia, masło oraz zmielony pieprz i smażyć co chwilę mieszając przez ok. 1 minutę.
Dodać sok z cytryny, koperek, ugotowany makaron i wlać śmietankę. Wymieszać i podgrzewać jeszcze przez ok. 1 minutę aż cały makaron będzie gorący, w międzyczasie delikatnie zamieszać od czasu do czasu.',2,'/images/makaron-z-łososiem-wędzonym_1.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Makaron z łososiem wędzonym'), ' ', '_')),
(5,'Zupa tajska z krewetkami','Zweryfikowany',4.9,'2019-05-11 23:00:00',null,3,'1h 30min','Do garnka wlać wodę lub bulion, dodać pastę tom yum i zagotować. Dodać mleko kokosowe, pomidory oraz odcedzone i pokrojone na połówki grzyby, gotować przez ok. 5 minut.
Dodać oczyszczone (z pancerzy, ogonków i jelit) krewetki. Gotować przez około 1 minutę na małym ogniu. Doprawić sosem rybnym i sokiem z cytryny.
Dodać posiekany szczypiorek, liście kolendry, pokrojoną papryczkę chili oraz liście tajskiej bazylii jeśli mamy.',4,'/images/zupa-tajska-z-krewetkami_1.jpeg','/images/zupa-tajska-z-krewetkami_2.jpeg',NULL,NULL, '/recipes/' || replace(lower('Zupa tajska z krewetkami'), ' ', '_')),
(7,'Pina Colada','Zweryfikowany',4.1,'2019-06-11 23:00:00',null,1,'30min','Wszystkie składniki oprócz lodu włożyć do blendera i dokładnie zmiksować.
Dodać kruszony lód i przez chwilę (ok. 3 sek) ponownie zmiksować.
Przelać do pucharków i podawać.',2,'/images/pina-colada_1.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Pina Colada'), ' ', '_')),
(8,'Krewetki z fasolką','Zweryfikowany',3.1,'2019-06-10 23:00:00',null,2,'1h','Krewetki umyć, osuszyć, oprószyć solą oraz pieprzem. Na patelni rozgrzać 2 łyżki oliwy, delikatnie zrumienić czosnek i papryczkę chilli, uważając aby ich nie przypalić. Dodać krewetki i smażyć przez około 1,5 minuty, aż zmienią kolor z szarego na różowy (krewetki ugotowane, różowe wystarczy tylko przez chwilę podgrzać). Jeśli smażymy krewetki z głowami, można je docisnąć do patelni, aby uwolnić soki.
Na patelnię wlać wino i chwilę razem pogotować. Wyjąć krewetki na talerzyk i trzymać w cieple. Na patelnię włożyć ugotowaną fasolkę wraz z gęstą zalewą, doprawić solą oraz pieprzem, gotować przez pół minuty. Następnie dodać passatę i natkę pietruszki, doprawić ewentualnie szczyptą cukru. Pogotować 1/2 minuty, widelcem rozgnieść część fasolek, uzyskując odpowiednio gęstą konsystencję sosu.
Włożyć krewetki na patelnię, wymieszać i razem podgrzać. Doprawić solą oraz pieprzem. Rozłożyć na talerze, posypać posiekanym świeżym czosnkiem oraz dodatkową natką pietruszki, polać oliwą extra vergine. Podawać z pieczywem.',2,'/images/krewetki-z-fasolka_1.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Krewetki z fasolką'), ' ', '_')),
(4,'Łosoś pieczony na ryżu','Zweryfikowany',4.3,'2019-06-14 23:00:00',null,2,'1h','Odciąć skórkę z łososia, pokroić na 4 kawałki. Opłukać, osuszyć i włożyć do miski. Doprawić solą, pieprzem, mieloną papryką i kurkumą (lub curry) oraz suszonym oregano. Dodać miód, sos sojowy, 2 łyżki oliwy oraz 2 łyżki soku z cytryny, wszystko wymieszać.
Ugotować ryż w osolonej wodzie zgodnie z instrukcją na opakowaniu. Odcedzić, następnie wysypać do formy żaroodpornej, wymieszać z 1 łyżką oliwy i rozłożyć po całej powierzchni naczynia.
Na wierzchu położyć filety łososia, obłożyć połówkami pomidorków koktajlowych, posypać chili i listkami bazylii (lub ziół lub natki).
Dodać plasterki cytryny, całość skropić pozostałą oliwą i wstawić do piekarnika nagrzanego do 200 stopni C. Piec przez 15 minut.',4,'/images/losos-pieczony-na-ryzu_1.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Łosoś pieczony na ryżu'), ' ', '_')),
(2,'Krem pomidorowy','Zweryfikowany',4.5,'2019-06-15 23:00:00',null,2,'1h 30min','W garnku na oliwie i maśle zeszklić pokrojoną w kosteczkę cebulę oraz pokrojony na plasterki czosnek. Wlać wino jeśli je używamy i gotować przez minutę.
Pomidory sparzyć wrzątkiem, obrać, pokroić na ćwiartki, odciąć szypułki, miąższ pokroić w kostkę. Odłożyć ok. pół szklanki pokrojonych pomidorów a resztę włożyć do garnka. 
Dodać ocet i cukier oraz składniki opcjonalne jeśli ich używamy (sos worcestershire, ajvar, chili), zagotować. Wlać gorący bulion i znów zagotować. Przykryć i gotować przez ok. 5 minut.
Zmiksować ręcznym blenderem (żyrafą), ale niekoniecznie na idealnie gładki krem, i gotować przez 1 minutę.
Dodać odłożone świeże pomidory i po zagotowaniu odstawić z ognia. Wymieszć z posiekaną bazylią, następnie w razie potrzeby doprawić solą oraz pieprzem i skropić oliwą extra vergine.',4,'/images/krem-pomidorowy_1.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Krem pomidorowy'), ' ', '_')),
(2,'Koreczki imprezowe','Zweryfikowany',4.5,'2019-06-17 23:00:00',null,1,'15min','Melona obrać i pokroić w kostkę. Suszoną szynkę pokroić w paski.
Kawałki melona nadziać na patyczki razem z kulką mozzarelli, bazylią oraz złożonym paseczkiem suszonej szynki.
Ułożyć na półmisku, przed podaniem skropić zagęszczonym octem balsamicznym.',4,'/images/koreczki-imprezowe_1.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Koreczki imprezowe'), ' ', '_')),
(3,'Czekoladowy budyń jaglany','Zweryfikowany',4.8,'2019-06-19 23:00:00',null,1,'30min','Kaszę jaglaną przepłukać na sicie pod strumieniem ciepłej wody. Przełożyć do rondelka, wlać mleko, przykryć i zagotować. Zmniejszyć ogień i gotować pod przykryciem ok. 15 minut aż kasza wchłonie cały płyn i będzie miękka.
Dodać kakao oraz syrop klonowy lub cukier (opcjonalnie można dodać też kilka kosteczek czekolady). Dokładnie wymieszać do rozpuszczenia się kakao.
Zmiksować w pojemniku blendera stojącego, aż budyń będzie gładki i jedwabisty (przez ok. 2 minuty). W razie potrzeby dodawać więcej mleka.',4,'/images/czekoladowy-budyn-jaglany_1.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Czekoladowy budyń jaglany'), ' ', '_')),
(3,'Kurczak Teriyaki','Zweryfikowany',3.2,'2019-06-19 21:00:00',null,2,'1h','Filety oczyścić z błonek i kostek. Ugotować brązowy ryż w osolonej wodzie zgodnie z instrukcją na opakowaniu (zwykle ok. 30 - 35 minut, ale warto sprawdzić). Odcedzić.
Na patelnię wlać składniki sosu teriyaki: olej, sos sojowy, ocet ryżowy lub sok z limonki, syrop klonowy (lub miód lub cukier trzcinowy). Dodać starty czosnek i imbir, zagotować.
Włożyć filety z kurczaka i przykryć patelnię. Dusić przez ok. 5 minut na umiarkowanym ogniu, przewrócić na drugą stronę i powtórzyć gotowanie pod przykryciem przez 5 minut. Zdjąć pokrywę i gotować przez 5 minut, w międzyczasie 1 - 2 razy przewracając mięso.
Posypać uprażonym sezamem i szczypiorkiem.
Ryż smażony z warzywami: na patelnię wlać oliwę, zeszklić pokrojoną w kosteczkę cebulę. Pod koniec dodać starty czosnek i imbir. Dodać groszek i mieszając smażyć przez ok. minutę. Dodać pokrojoną w kosteczkę paprykę i smażyć mieszając przez ok. 1 - 2 minuty. Dodać ryż, sos sojowy i olej sezamowy, mieszając chwilę podsmażać.',3,'/images/kurczak-teriyaki_1.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Kurczak Teriyaki'), ' ', '_')),
(6,'Pizzadilla z salami i papryką','Zweryfikowany',4.9,'2019-06-19 21:00:00',null,2,'30min','Paprykę pokroić w drobną kostkę, doprawić solą i podsmażyć chwilę na łyżeczce oliwy, odłożyć na talerz.
Na dużej patelni rozgrzać i rozprowadzić łyżeczkę masła. Położyć placek tortilli i wyłożyć na niego połowę tartego sera, podsmażoną paprykę i plasterki salami. Skropić równomiernie sosem, posypać suszonym oregano i listkami bazylii. Posypać drugą połową tartego sera.
Przykryć drugim plackiem tortilli i podsmażać ok. 2 minuty, aż tortilla na spodzie się zrumieni.
Podgrzaną z jednej strony pizzadillę przełożyć na drugą stronę** i ponownie podsmażyć na maśle do zrumienienia. Przełożyć na deskę, posypać listkami bazylii i kroić na kawałki jak pizzę.',2,'/images/pizzadella-z-salami-i-papryka_1.jpeg','/images/pizzadella-z-salami-i-papryka_2.jpeg',NULL,NULL, '/recipes/' || replace(lower('Pizzadilla z salami i papryką'), ' ', '_')),
(6,'Ciasteczka owsiane z ziarnami','Zweryfikowany',4.0,'2019-06-19 21:00:00',null,1,'45min','Masło roztopić. Do czystej miski wsypać płatki owsiane, mąkę, cukier, proszek do pieczenia i ziarna.
Wlać roztopione masło i wymieszać. Dodać jajka oraz miód jeśli używamy i wymieszać. Jeśli mamy czas, dobrze jest odstawić masę na ok. 1/2 - 1 godzinę.
Piekarnik nagrzać do 180 stopni C. Blachę wyłożyć papierem do pieczenia. Nabierać łyżkę stołową masy i nakładać na blaszkę formując okręgi i delikatnie je płaszczając.
Piec przez ok. 15 minut na złoty kolor.',2,'/images/ciasteczka-owsiane-z-ziarnami_1.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Ciasteczka owsiane z ziarnami'), ' ', '_')),
(6,'Koktajl z borówek','Zweryfikowany',4.9,'2019-06-19 21:00:00',null,1,'15min','Do pojemnika blendera włożyć wszystkie składniki: umytą borówkę, mleko, maślankę, obranego banana, miód i pastę tahini jeśli jej używamy.
Zmiksować na płynny koktajl.',1,'/images/koktajl-z-borowek_1.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Koktajl z borówek'), ' ', '_')),
(10,'Placki serowe z truskawkami','Zweryfikowany',4.3,'2019-06-19 21:00:00',null,1,'30min','Do miski włożyć twaróg i rozgnieść go praską do ziemniaków. Dodać jajka, cukier i wymieszać rózgą, następnie wlać olej oraz mleko i ponownie wymieszać.
W drugiej misce wymieszać mąkę z proszkiem do pieczenia. Krótko połączyć składniki z dwóch misek za pomocą łyżki na dość gęstą masę.
Rozgrzać patelnię (np. naleśnikową lub inną z nieprzywierającą powłoką), nakładać po 2 łyżki ciasta na jednego placka, wyrównać powierzchnię i smażyć na średnim ogniu do czasu aż urosną i będą ładnie zrumienione przez około 2,5 minuty.
Gdy placki trochę podrosną wcisnąć w ciasto po ok. 4 plasterki truskawek. Przewrócić na drugą stronę i smażyć do zrumienienia w podobnym czasie jak poprzednio. Posypać cukrem pudrem.',4,'/images/placki-serowe-z-truskawkami_1.jpeg',NULL,NULL,NULL, '/recipes/' || replace(lower('Placki serowe z truskawkami'), ' ', '_'));


INSERT INTO units (unit_name) VALUES
('g'),
('kg'),
('ml'),
('l'),
('łyżeczki'),
('łyżki'),
('szklanki'),
('plastery'),
('szczypty'),
('sztuki');

INSERT INTO categories_per_recipe (recipe_id,category_id) VALUES
(1,14),
(2,5),
(2,10),
(3,11),
(3,2),
(4,23),
(4,19),
(4,9),
(4,12),
(5,7),
(6,12),
(6,14),
(6,3),
(7,13),
(7,2),
(7,3),
(8,13),
(8,9),
(9,4),
(9,14),
(10,1),
(10,5),
(10,6),
(10,13),
(11,13),
(11,2),
(11,15),
(12,18),
(12,2),
(12,3),
(13,13),
(13,5),
(13,6),
(14,8),
(14,17),
(14,13),
(15,1),
(15,6);


INSERT INTO favourites (user_id, recipe_id, date_of_favourite) VALUES
(1,1,'2019-04-03 19:23:30'),
(3,7,'2019-04-23 21:00:20'),
(7,4,'2019-05-01 13:34:44'),
(8,7,'2019-05-11 06:24:34'),
(1,3,'2019-05-27 11:11:30'),
(2,11,'2019-05-28 19:44:21'),
(4,1,'2019-06-02 10:12:23'),
(4,5,'2019-06-09 10:16:13'),
(3,9,'2019-06-11 19:57:37'),
(5,12,'2019-06-19 14:34:04'),
(8,13,'2019-06-20 15:53:55'),
(1,14,'2019-06-24 23:23:34'),
(2,15,'2019-06-28 17:19:07'),
(6,8,'2019-07-01 18:18:33'),
(2,10,'2019-07-01 20:03:55'),
(5,8,'2019-07-02 10:52:15'),
(7,2,'2019-07-02 12:12:22');


INSERT INTO user_votes (user_id,recipe_id,score, date_of_vote) VALUES
(1,3,3.0,'2019-04-03 19:23:30'),
(3,10,3.5,'2019-04-03 21:23:30'),
(8,4,4.0,'2019-04-11 13:30:00'),
(8,7,4.5,'2019-04-13 11:23:30'),
(1,2,2.0,'2019-04-23 12:23:30'),
(2,1,5.0,'2019-05-03 14:23:30'),
(4,4,3.5,'2019-05-05 18:12:23'),
(1,5,3.0,'2019-05-06 18:23:30'),
(2,7,3.5,'2019-05-13 22:23:30'),
(2,14,4.0,'2019-05-27 13:30:00'),
(7,7,4.5,'2019-05-28 12:23:30'),
(5,2,2.0,'2019-05-29 19:23:30'),
(5,10,5.0,'2019-05-30 20:23:30'),
(4,3,3.5,'2019-05-30 21:12:23'),
(1,9,3.0,'2019-06-01 02:23:30'),
(3,5,3.5,'2019-06-03 06:23:30'),
(8,14,4.0,'2019-06-05 11:30:00'),
(6,7,4.5,'2019-06-10 19:23:30'),
(1,12,2.0,'2019-06-13 05:23:30'),
(2,11,5.0,'2019-06-18 14:23:30'),
(4,14,3.5,'2019-06-19 14:12:23'),
(1,1,3.0,'2019-06-20 20:23:30'),
(6,3,3.5,'2019-06-21 22:23:30'),
(2,4,4.0,'2019-06-23 13:30:00'),
(7,15,4.5,'2019-06-24 16:23:30'),
(5,15,2.0,'2019-07-01 16:23:30'),
(5,11,5.0,'2019-07-01 19:23:30'),
(1,9,3.5,'2019-07-02 10:12:23'),
(3,14,4.5,'2019-07-02 19:12:23');


INSERT INTO reports (reportee_id,reported_id,assigned_admin_id,recipe_id,description,status,date_of_report) VALUES
(8,1,3,7,'LOREM IPSUM',0,'2019-04-12'),
(4,3,8,4,'LOREM IPSUM TESTOWANIE',0,'2019-04-12'),
(2,7,3,6,'Naruszenie regulaminu',1,'2019-04-01'),
(2,3,8,1,'Nie lubie go',0,'2019-04-02'),
(6,8,3,5,'LOREM IPSU',-1,'2019-03-12');


INSERT INTO ingredients_used_in_recipe (recipe_id,ingredient_id,unit_id,amount) VALUES
(1,57,1,'25'),
(1,30,1,'20'),
(1,118,1,'25'),
(1,119,1,'10'),
(1,60,3,'70'),
(1,80,9,'do smaku'),
(1,81,9,'do smaku'),
(2,13,10,'2'),
(2,108,1,'100'),
(2,69,1,'1150'),
(2,109,1,'40'),
(2,39,6,'2'),
(2,58,6,'1'),
(2,11,6,'2'),
(2,60,6,'4'),
(2,80,9,'do smaku'),
(2,81,9,'do smaku'),
(3,105,1,'150'),
(3,61,10,'1/2'),
(3,106,1,'200'),
(3,21,6,'1'),
(3,80,5,'1/2'),
(3,103,5,'2'),
(3,107,6,'2'),
(3,108,7,'1/2'),
(4,112,4,'1'),
(4,100,1,'30'),
(4,88,10,'1/3'),
(4,101,1,'100'),
(4,6,1,'200'),
(4,102,6,'2'),
(4,103,6,'1'),
(4,39,9,'4'),
(5,104,9,'3'),
(5,86,9,'1'),
(5,91,1,'300'),
(5,92,3,'200'),
(5,93,1,'60'),
(5,95,3,'50'),
(5,96,3,'25'),
(5,97,7,'1'),
(5,98,1,'20'),
(6,6,10,'12'),
(6,83,7,'1'),
(6,30,1,'30'),
(6,34,6,'2'),
(6,86,5,'1'),
(6,62,7,'1/4'),
(6,87,6,'3'),
(6,73,6,'2'),
(6,90,1,'150'),
(7,7,1,'600'),
(7,11,5,'1'),
(7,26,6,'2'),
(7,60,6,'4'),
(7,67,8,'6'),
(7,8,9,'2'),
(7,69,1,'200'),
(7,70,1,'100'),
(7,57,9,'4'),
(7,75,5,'2'),
(7,75,5,'1/2'),
(7,78,5,'1'),
(7,66,8,'1'),
(7,57,9,'4'),
(7,80,9,'3'),
(7,81,9,'3'),
(7,19,6,'2'),
(8,60,6,'1'),
(8,21,6,'1/2'),
(8,61,10,'1/2'),
(8,30,1,'45'),
(8,62,7,'1/4'),
(8,2,2,'1'),
(8,63,6,'1/2'),
(8,42,3,'350'),
(8,57,6,'2'),
(8,66,8,'1'),
(9,52,10,'1/2'),
(9,53,1,'250'),
(9,54,1,'150'),
(9,57,9,'4'),
(9,58,5,'1'),
(10,45,7,'1/2'),
(10,14,7,'2,5'),
(10,47,6,'3'),
(10,28,6,'2'),
(10,48,1,'20'),
(11,9,1,'450'),
(11,35,6,'1'),
(11,26,6,'7'),
(11,28,6,'2'),
(11,27,6,'2'),
(11,30,1,'45'),
(11,31,5,'3'),
(11,33,1,'100'),
(11,61,10,'1/2'),
(11,35,10,'1/2'),
(11,36,7,'1/2'),
(11,37,5,'1'),
(11,38,6,'2'),
(11,38,5,'3'),
(12,34,6,'2'),
(12,35,10,'2'),
(12,40,1,'180'),
(12,43,6,'4'),
(12,78,5,'1/2'),
(12,21,5,'2'),
(12,121,10,'1'),
(13,21,1,'100'),
(13,22,7,'1,5'),
(13,15,6,'2'),
(13,8,6,'4'),
(13,16,5,'1'),
(13,23,6,'2'),
(13,13,10,'2'),
(13,11,5,'1'),
(14,17,7,'1'),
(14,14,7,'1/2'),
(14,19,7,'1/2'),
(14,20,10,'1/2'),
(15,12,1,'250'),
(15,13,10,'2'),
(15,8,6,'3'),
(15,14,7,'1/3'),
(15,15,7,'1/3'),
(15,16,5,'2'),
(15,122,1,'60');


INSERT INTO alternative_ingredients (ingredient_id,replacement_id) VALUES
(8,11),
(11,8),
(4,9),
(9,4),
(5,10),
(10,5),
(32,33),
(33,32),
(64,65),
(65,64),
(64,112),
(112,64),
(8,29),
(29,8),
(48,49),
(49,48),
(57,72),
(72,57),
(75,79),
(79,75),
(14,92),
(92,14),
(14,46),
(46,14),
(18,19),
(19,18),
(28,11),
(11,28),
(57,72),
(28,8),
(8,28),
(79,75),
(58,59),
(59,58),
(103,123),
(123,103);
