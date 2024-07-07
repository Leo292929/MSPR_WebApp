const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la connexion à la base de données MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mspr61'
});
// Connexion à la base de données
connection.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à la base de données : ', err);
      return;
    }
    console.log('Connecté à la base de données MySQL');
});


// Fonction de gestion des erreurs
function handleRequestError(res, error) {
    console.error(error);
    res.status(500).send('Une erreur est survenue sur le serveur');
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///SECURITE

// Configurer les sessions
app.use(session({
    secret: 'votre_secret',
    resave: false,
    saveUninitialized: false
  }));
  


// Initialiser Passport
app.use(passport.initialize());
app.use(passport.session());


// Configurer la stratégie d'authentification locale
passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('jarrive dans le localstrat');
      // Chercher l'utilisateur dans la base de données
      connection.query('SELECT * FROM Utilisateur WHERE nomUser = ?', [username], function(err, results, fields) {
        if (err) { 
            console.log("y'a une erreur");
            return done(err); 
         }
        if (results.length === 0) {
          console.log('Incorrect username.');
          return done(null, false, { message: 'Incorrect username.' });
          
        }
        const user = results[0];
        if (user.mdpUser !== password) { // En pratique, comparez les mots de passe hachés
          console.log('Incorrect password.');
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));


// Middleware pour vérifier l'authentification
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
  

// Sérialiser et désérialiser l'utilisateur
passport.serializeUser(function(user, done) {
    done(null, user.idUser);
  });


passport.deserializeUser(function(id, done) {
    connection.query('SELECT * FROM Utilisateur WHERE idUser = ?', [id], function(err, results, fields) {
      if (err) { return done(err); }
      done(null, results[0]);
    });
  });


// Routes
app.get('/login', (req, res) => {
    res.send('<form action="/login" method="post"><div><label>Username:</label><input type="text" name="username"/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Log In"/></div></form>');
  });
  
app.post('/login',
    passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/inscription' })
  );
  

  
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Description de l'objet empreinte
app.get('/api/empreinte/describe', (req, res) => {
    // Requête SQL pour récupérer les détails de l'empreinte depuis la base de données
    const query = 'SHOW COLUMNS FROM Empreinte;';
  
    // Exécuter la requête SQL
    connection.query(query, (error, results, fields) => {
      if (error) {
        handleRequestError(res, error);
      return;
      }
  
      // Vérifier si des résultats ont été retournés
      if (results.length > 0) {
        // Récupérer les détails de l'empreinte à partir des résultats de la requête
        const empreinte = results.map(column => {
            return {
                name: column.Field,
                type: column.Type,
                allowNull: column.Null === 'YES' ? true : false,
                key: column.Key,
                default: column.Default,
                extra: column.Extra
            };
        });
  
        // Envoyer les détails de l'empreinte en tant que réponse JSON
        res.json(empreinte);
      } else {
        res.status(404).send('Aucune empreinte trouvée avec l\'identifiant spécifié');
      }
    });
});

// Recuperation de toute les empreintes
app.get('/api/empreinte/all', (req, res) => {
    // Requête SQL pour récupérer les détails de l'empreinte depuis la base de données
    const query = 'SELECT * FROM Empreinte';
  
    // Exécuter la requête SQL
    connection.query(query, (error, results, fields) => {
      if (error) {
        send('test')
        handleRequestError(res, error);
        return;
      }
  
      // Vérifier si des résultats ont été retournés
      if (results.length > 0) {
        // Récupérer les détails de l'empreinte à partir des résultats de la requête
        const empreintes = results.map(row => ({
            idEmpreinte: row.idEmpreinte,
            idUser: row.idUser,
            idEspece: row.idEspece,
            adresseImage: row.adresseImage,
            datePhoto: row.datePhoto,
            heurePhoto: row.heurePhoto,
            localisation: row.localisation
        }));
  
        // Envoyer les détails de l'empreinte en tant que réponse JSON
        res.json(empreintes);
      } else {
        res.status(404).send('Aucune empreinte trouvée avec l\'identifiant spécifié');
      }
    });
});

// Recuperation des infos de l'empreinte :id
app.get('/api/empreinte/:id', (req, res) => {
  // Récupérer l'id à partir des paramètres de route
  const id = req.params.id;
  // Requête SQL pour récupérer les détails de l'empreinte depuis la base de données
  const query = 'SELECT * FROM empreinte WHERE idEmpreinte = ?';

  // Exécuter la requête SQL
  connection.query(query, [id],(error, results, fields) => {
    if (error) {
      handleRequestError(res, error);
      return;
    }

    // Vérifier si des résultats ont été retournés
    if (results.length > 0) {
      // Récupérer les détails de l'empreinte à partir des résultats de la requête
      const empreintes = results.map(row => ({
          idEmpreinte: row.idEmpreinte,
          idUser: row.idUser,
          idEspece: row.idEspece,
          adresseImage: row.adresseImage,
          datePhoto: row.datePhoto,
          heurePhoto: row.heurePhoto,
          localisation: row.localisation
      }));

      // Envoyer les détails de l'empreinte en tant que réponse JSON
      res.json(empreintes);
    } else {
      res.status(404).send('Aucune empreinte trouvée avec l\'identifiant spécifié');
    }
  });
});



// Menu principal? 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});



// Ajout d'une empreinte
app.post('/api/empreinte', (req, res) => {
  const { idUser ,idEspece, adresseImage, datePhoto, heurePhoto, localisation} = req.body;

  // Valider les données d'entrée
  if (!idUser || !idEspece) {
    return res.status(400).send('Nom et description sont requis');
  }

  // Requête SQL pour insérer une nouvelle empreinte dans la base de données
  const query = 'INSERT INTO empreinte (idUser, idEspece, adresseImage, datePhoto, heurePhoto, localisation) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [idUser, idEspece, adresseImage, datePhoto, heurePhoto, localisation], (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de l\'insertion de l\'empreinte : ', error);
      return res.status(500).send('Erreur lors de la création de l\'empreinte');
    }

    // Envoyer une réponse avec le nouvel ID de l'empreinte créée
    res.status(201).json({ id: results.insertId,idUser ,idEspece, adresseImage, datePhoto, heurePhoto, localisation });
  });
});

// Suppression de l'empereinte :id
app.delete('/api/empreinte/:id', (req, res) => {
  const empreinteId = req.params.id;
  const query = 'DELETE FROM Empreinte WHERE idEmpreinte = ?';
  connection.query(query, [empreinteId], (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de la suppression de l\'empreinte : ', error);
      res.status(500).send('Erreur lors de la suppression de l\'empreinte');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Aucune empreinte trouvée avec l\'identifiant spécifié');
      return;
    }
    res.status(200).send('Empreinte supprimée avec succès');
  });
});

// Modification de l'empreinte :id
app.put('/api/empreinte/:id', (req, res) => {
  const empreinteId = req.params.id;
  const updatedFields = req.body; // Les nouveaux champs à mettre à jour

  // Vérifier si aucun champ n'est fourni pour la mise à jour
  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: "Aucun champ fourni pour la mise à jour de l'empreinte." });
  }

  // Construire la clause SET de la requête SQL en fonction des champs fournis
  let updateClause = '';
  const values = [];
  for (const key in updatedFields) {
    if (Object.prototype.hasOwnProperty.call(updatedFields, key)) {
      updateClause += `${key} = ?, `;
      values.push(updatedFields[key]);
    }
  }
  // Supprimer la virgule finale
  updateClause = updateClause.slice(0, -2);

  // Requête SQL pour mettre à jour l'empreinte dans la base de données
  const query = `UPDATE Empreinte SET ${updateClause} WHERE idEmpreinte = ?`;
  values.push(empreinteId);
  connection.query(query, values, (error, results, fields) => {
    // Gestion des erreurs et envoi de la réponse
    if (error) {
      console.error('Erreur lors de la mise à jour de l\'empreinte : ', error);
      return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de l'empreinte." });
    }
    // Vérifier si l'empreinte a été mise à jour avec succès
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Aucune empreinte trouvée avec l'identifiant spécifié." });
    }
    // Envoyer une réponse indiquant que l'empreinte a été mise à jour avec succès
    res.status(200).json({ message: "L'empreinte a été mise à jour avec succès." });
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////

// Description de l'objet user

// Recuperation de tous les user

// Recuperation des infos de l'user :id

// Ajout d'un user

// Suppression de l'user :id

// Modification de l'user :id

///////////////////////////////////////////////////////////////////////////////////////////////////

// Description de l'objet espèce

// Recuperation de toute les espèces
app.get('/api/espece/all', (req, res) => {
    // Requête SQL pour récupérer les détails de l'empreinte depuis la base de données
    const query = 'SELECT * FROM Espece';
  
    // Exécuter la requête SQL
    connection.query(query, (error, results, fields) => {
      if (error) {
        send('test')
        handleRequestError(res, error);
        return;
      }
  
      // Vérifier si des résultats ont été retournés
      if (results.length > 0) {
        // Récupérer les détails de l'empreinte à partir des résultats de la requête
        const Espece = results.map(row => ({
            idEspece: row.idEspece,
            nomEspece: row.nomEspece,
            descriptionEspece: row.descriptionEspece,
            nomLatin: row.nomLatin,
            famille: row.famille,
            taille: row.taille,
            region: row.region,
            habitat: row.habitat,
            funfact: row.funfact
        }));
  
        // Envoyer les détails de l'empreinte en tant que réponse JSON
        res.json(Espece);
      } else {
        res.status(404).send('Aucune empreinte trouvée avec l\'identifiant spécifié');
      }
    });
});

// Recuperation des infos de l'espèce :id

// Ajout d'une espèce

// Suppression de l'espèce :id

// Modification de l'espèce :id

//////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get('/inscription', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'inscription.html'));
});

app.get('/home',ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Servir le formulaire HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint pour gérer les uploads de fichiers
app.post('/upload', upload.single('fileToUpload'), (req, res) => {
  const filePath = path.resolve(req.file.path);
  console.log('filePath:', filePath);

  exec(`python process/process_file.py "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Erreur d'exécution: ${error}`);
        res.status(500).send(`Erreur d'exécution: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Erreur dans le script Python: ${stderr}`);
        res.status(500).send(`Erreur dans le script Python: ${stderr}`);
        return;
    }

    // Envoyer le résultat du script Python au client
    res.send(`${stdout}`);
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// Port sur lequel le serveur écoutera
const port = 3000;

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});