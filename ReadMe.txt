MSPR Projet Wildlens

POITRENAUD Romain , FOUGEROUD Léo

WILDLENS : Association française engagée dans la protection des animaux

développement d'une application d’identification des traces de pas d'animaux

Données fournies avant le projet + DataAugmentation

Choix du Modele : Resnet

fonctionnalitées de l'appli :

Page regroupant les infos de plusieurs especes

Classification d’une photo

 Affichage des informations sur l’espèce reconnue
 
Recueil des données de prise de photo


Pour install le projet, suivre les instructions décrites dans setup/setup.txt


API

Empreintes:

Description de l'objet empreinte
GET'/api/empreinte/describe'

Recuperation de toute les empreintes
GET '/api/empreinte/all'

Recuperation des infos de l'empreinte :id
GET '/api/empreinte/:id'

Ajout d'une empreinte
POST '/api/empreinte'

Suppression de l'empereinte :id
DELETE '/api/empreinte/:id'

Modification de l'empreinte :id
PUT '/api/empreinte/:id'

Especes:

Recuperation de toute les espèces
GET '/api/espece/all'