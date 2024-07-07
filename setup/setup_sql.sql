drop database if exists MSPR61;
create database MSPR61;
use MSPR61;

Drop table if exists Espece;
Drop table if exists Empreinte;
Drop table if exists utilisateur;


CREATE TABLE  IF NOT EXISTS Utilisateur(
 idUser int NOT NULL AUTO_INCREMENT,
 nomUser varchar(255),
 courielUser varchar(255),
 mdpUser varchar(255),
 PRIMARY KEY(idUser)
 );
 
CREATE TABLE  IF NOT EXISTS Espece(
 idEspece int NOT NULL AUTO_INCREMENT,
 nomEspece varchar(255),
 descriptionEspece varchar(255),
 nomLatin varchar(255),
 famille ENUM('Félin','Canidé','Rongeur','Lagomorphe','Ursidé','Procyonidé'),
 taille varchar(255),
 region varchar(255),
 habitat varchar(255),
 funfact TEXT,
 PRIMARY KEY(idEspece)
 );
 
 
 CREATE TABLE IF NOT EXISTS Empreinte(
 idEmpreinte int NOT NULL AUTO_INCREMENT,
 idUser int NOT NULL,
 idEspece int NOT NULL,
 adresseImage varchar(255),
 datePhoto date,
 heurePhoto time,
 localisationempreinte varchar(255),
 PRIMARY KEY(idEmpreinte),
 FOREIGN KEY (idUser) REFERENCES Utilisateur(idUser),
 FOREIGN KEY (idEspece) REFERENCES Espece(idEspece)
 );
 
 
INSERT INTO Espece (nomEspece, descriptionEspece, nomLatin, famille, taille, region, habitat, funfact) 
VALUES  ('Castor', 'Le castor d’Europe, appelé également le castor commun ou le castor d’Eurasie, est un mammifère rongeur aquatique de la famille des castoridés.', 'Castor canadensis', 'Lagomorphe', '100 à 135 cm queue comprise', 'Europe du nord et Eurasie', 'Le castor d’Europe vit le long des rivières, des ruisseaux, des lacs et des étangs.', 'À l’exception des humains, le castor est l’un des seuls mammifères qui façonnent son environnement.'),
		('Chat', 'Le chat est un petit mammifère carnivore domestiqué, connu pour son agilité et son comportement indépendant.', 'Felis catus', 'Félin', '30 à 50 cm', 'Mondial', 'Habitats domestiques et naturels variés.', 'Les chats passent environ 70% de leur vie à dormir.'),
        ('Chien', 'Le chien est un mammifère domestiqué et un compagnon fidèle de homme depuis des millénaires.', 'Canis lupus familiaris', 'Canidé', '45 à 110 cm', 'Mondial', 'Divers habitats, souvent dans des environnements humains.', 'Les chiens ont une capacité remarquable à comprendre et à interpréter les émotions humaines.'),
        ('Coyote', 'Le coyote est un canidé de taille moyenne connu pour sa grande adaptabilité et ses hurlements nocturnes.', 'Canis latrans', 'Canidé', '75 à 100 cm', 'Amérique du Nord et Centrale', 'Prairies, forêts, montagnes et zones urbaines.', 'Les coyotes sont capables de courir à des vitesses allant jusquà 65 km/h.'),
        ('Ecureuil', 'Les écureuils sont de petits rongeurs arboricoles connus pour leur habileté à grimper aux arbres et à stocker de la nourriture.', 'Sciurus vulgaris', 'Rongeur', '20 à 35 cm', 'Hémisphère nord', 'Forêts, parcs et jardins.', 'Les écureuils peuvent faire des sauts de 10 fois la longueur de leur corps.'),
        ('Lapin', 'Le lapin est un petit mammifère herbivore connu pour ses grandes oreilles et sa capacité à se reproduire rapidement.', 'Oryctolagus cuniculus', 'Lagomorphe', '30 à 50 cm', 'Europe, Asie, Afrique du Nord', 'Prairies, forêts et milieux urbains.', 'Les lapins peuvent tourner leurs oreilles à 180 degrés pour capter les sons provenant de différentes directions.'),
        ('Loup', 'Le loup est un grand carnivore de la famille des canidés. Il est connu pour sa structure sociale complexe et son intelligence.', 'Canis lupus', 'Canidé', '105 à 160 cm', 'Hémisphère nord', 'Forêts, montagnes, plaines, toundra et déserts.', 'Les loups sont capables de parcourir jusquà 80 km en une journée.'),
		('Lynx', 'Le lynx est un félin de taille moyenne connu pour ses oreilles pointues et sa fourrure tachetée.', 'Lynx lynx', 'Félin', '80 à 130 cm', 'Europe, Asie et Amérique du Nord', 'Forêts denses et montagnes.', 'Les lynx ont des touffes de poils caractéristiques sur le dessus des oreilles.'),
		('Ours', 'Lours est un grand mammifère omnivore qui habite principalement dans les régions boisées et montagneuses.', 'Ursus arctos', 'Ursidé', '150 à 300 cm', 'Hémisphère nord', 'Forêts, montagnes et toundra.', 'Les ours ont un sens de lodorat extrêmement développé, capable de détecter une carcasse à plusieurs kilomètres.'),
		('Puma', 'Le puma est un grand félin solitaire qui habite les montagnes et les forêts dAmérique.', 'Puma concolor', 'Félin', '105 à 200 cm', 'Amériques', 'Montagnes, forêts, prairies et déserts.', 'Les pumas peuvent sauter jusquà 5,5 mètres en hauteur.'),
		('Rat', 'Le rat est un rongeur omniprésent dans de nombreux habitats, y compris les environnements urbains et ruraux.', 'Rattus norvegicus', 'Rongeur', '20 à 25 cm sans la queue', 'Mondial', 'Villes, fermes, forêts, savanes et déserts.', 'Les rats ont une excellente mémoire et sont capables de naviguer dans des labyrinthes complexes.'),
		('Raton Laveur', 'Le raton laveur est un mammifère omnivore connu pour ses compétences en manipulation et ses habitudes nocturnes.', 'Procyon lotor', 'Procyonidé', '40 à 70 cm', 'Amérique du Nord', 'Forêts, zones humides, banlieues et villes.', 'Les ratons laveurs lavent souvent leur nourriture avant de la manger.'),
		('Renard', 'Le renard est un petit carnivore de la famille des canidés, reconnaissable par sa queue touffue et son comportement rusé.', 'Vulpes vulpes', 'Canidé', '45 à 90 cm', 'Hémisphère nord', 'Forêts, prairies, montagnes et déserts.', 'Les renards utilisent leurs queues comme couverture et pour se réchauffer.');


INSERT INTO Utilisateur ( nomUser,courielUser,mdpUser)
VALUES ('root','root@root.com','root');



SELECT * FROM Espece WHERE idEspece = 1;
SELECT * FROM Espece;
SELECT * FROM utilisateur;
SELECT * FROM Empreinte;
SHOW tables;