const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const bcrypt = require("bcrypt");
const mustacheExpress = require("mustache-express");
const db = require("./config/firebase.js");
const cors = require("cors");

const app = express();
app.use(express.json());
const { check, validationResult } = require("express-validator");
const { type } = require("os");

app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "mustache");
app.engine("mustache", mustacheExpress());
const filmsTest = require("./DonneesTest/filmsTest2.js");

app.get("/api/films", async (req, res) => {
  try {
    const direction = req.query["order"] || "asc";
    const tri = req.query["tri"] || "annee";

    const docs = await db.collection("films").orderBy(tri, direction).get();
    const films = [];

    docs.forEach((doc) => {
      const film = doc.data();
      film.id = doc.id;
      films.push(film);
    });

    if (films.length != 0) {
      return res.status(200).json(films);
    } else res.status(400).send("Invalide query");
  } catch (error) {
    res.status(500).json({ message: "Oops! Give it another shot shortly." });
  }
});

app.get("/api/films/:id", async (req, res) => {
  try {
    const dbFilm = await db.collection("films").doc(req.params.id).get();

    if (dbFilm.exists) {
      return res.status(200).json(dbFilm.data());
    } else {
      res.status(404).send({ message: "No film found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Oops! Give it another shot shortly." });
  }
});

<<<<<<< HEAD
app.post("/api/films/init", async (req, res) => {
  filmsTest.forEach(async (film) => {
    await db.collection("films").add(film);
  });

  res.status(200);
=======
app.post("/api/films" , [
    check("titre").escape().trim().notEmpty().withMessage("Title cannot be empty"),
    check("titreVignette").escape().trim().notEmpty().withMessage("Thumbnail title cannot be empty"),
    check("description").escape().trim().notEmpty().withMessage("Description cannot be empty"),
    check("realisation").escape().trim().notEmpty().withMessage("Director field cannot be empty"),
    check("annee").escape().trim().notEmpty().withMessage("Year cannot be empty").bail().isInt({min: 1800, max: 2024}).withMessage("Please provide a valid year"),
    check("genres").escape().trim().notEmpty().withMessage("Genre cannot be empty").bail().isArray().withMessage("Genre must be an array"),
    check("commentaires").escape().trim().optional().isArray().withMessage("commentre must be in array").custom((commentaire) =>{

        console.log(commentaire)
        try {
            JSON.stringify(commentaire);
            console.log("Votre variable est un objet JSON.");
          } catch (error) {
            console.log("Votre variable n'est pas un objet JSON.");
          }

          return false
          
    }),
],async (req, res) => {
    try {
        const resultAddFilm = validationResult(req); 
        const resultErrors = []
        

        if (resultAddFilm.errors.length === 0 ) {

            const nouveauFilm = req.body;
            const idFilm = await db.collection("films").add(nouveauFilm);
            return res.status(200).json({message: `Successful insertion completed. The ID for the inserted film is provided => ${idFilm.id}`})

        }
        resultAddFilm.errors.forEach((error) => {
            // erreurs.push(error)
            resultErrors.push(error.msg)
        });

        res.status(400).json(resultErrors);
        
    } catch (error) {
        res.status(500).json({ message: "Oops! Give it another shot shortly." });
    }
});

app.put("/api/films/:id", [
    check("titre").escape().trim().optional(),
    check("titreVignette").escape().trim().optional(),
    check("description").escape().trim().optional(),
    check("realisation").escape().trim().optional(), 
    check("annee").escape().trim().optional().isInt({min: 1800, max: 2024}).withMessage("Please provide a valid year"),
    check("genres").escape().trim().optional().isArray().withMessage("Genre must be an array"),
    // check("commentaires").escape().trim().optional().isArray().withMessage("Genre must be an array"),
], async (req, res) => {

    try {
        
        if (!req.body.genres || req.body.genres.length === 0) {
            delete req.body.genres
        } else {
            req.body.genres.forEach((genre, index)=> {

                if ( genre.trim() === '' || !isNaN(Number(genre)) ) {
                    req.body.genres.splice(index)
                }
            });
        }

        const resultEditFilm = validationResult(req);

        const resultErrors = [];

        if (!resultEditFilm.isEmpty()) {

            resultEditFilm.errors.forEach((error) => {
                console.log(error)
                // erreurs.push(error)
                resultErrors.push(error.msg)
                return res.status(400).json({message: `${resultErrors}`})
            });
            // resultErrors.push(error.msg)
        }


        const id = req.params.id;
        const donneesModifiees = req.body;
        // Validation ici

        // console.log(id);
        // console.log(donneesModifiees);

        await db.collection("films").doc(id).update(donneesModifiees);

        res.status(200).json({ message: "The data has been altered." });

    } catch (error) {

    }
});

app.delete("/api/films/:id", async (req, res) => {
    const id = req.params.id;

    const resultat = await db.collection("films").doc(id).delete();

    res.statusCode = 200;
    res.json({ message: "The document has been deleted" });
>>>>>>> 40166849ddd6ba1b455b23ea24bf1648311787cc
});

app.post(
  "/api/films",
  [
    check("titre")
      .escape()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),
    check("titreVignette")
      .escape()
      .trim()
      .notEmpty()
      .withMessage("Thumbnail title cannot be empty"),
    check("description")
      .escape()
      .trim()
      .notEmpty()
      .withMessage("Description cannot be empty"),
    check("realisation")
      .escape()
      .trim()
      .notEmpty()
      .withMessage("Director field cannot be empty"),
    check("annee")
      .escape()
      .trim()
      .notEmpty()
      .withMessage("Year cannot be empty")
      .isInt({ min: 1800, max: 2024 })
      .withMessage("Please provide a valid year"),
    check("genres")
      .escape()
      .trim()
      .notEmpty()
      .withMessage("Genre cannot be empty")
      .isArray()
      .withMessage("Genre must be an array"),
    check("commentaires")
      .escape()
      .trim()
      .optional()
      .isArray()
      .withMessage("commentre must be in array")
      .bail()
      .custom((commentaires) => {
        console.log(typeof commentaires);
        console.log(typeof commentaires[0]);
        if (commentaires[0]) {
          commentaires.forEach((commentaire) => {
            console.log(typeof commentaire);
            if (typeof commentaire !== "object") {
              throw new Error(
                `your comment "${commentaire}" must be a JSON object`
              );
            }
          });
          // console.log(typeof commentaire[0])
          // console.log(commentaire)
          // JSON.stringify(commentaire);
        }
        console.log("Votre variable est un objet JSON.");

        return true;
      }),
  ],
  async (req, res) => {
    try {
      const resultAddFilm = validationResult(req);
      const resultErrors = [];

      if (resultAddFilm.errors.length === 0) {
        const nouveauFilm = req.body;
        const idFilm = await db.collection("films").add(nouveauFilm);
        return res.status(200).json({
          message: `Successful insertion completed. The ID for the inserted film is provided => ${idFilm.id}`,
        });
      }

      filmsTest.forEach(async (film) => {
        await db.collection("films").add(film);
      });
      resultAddFilm.errors.forEach((error) => {
        // erreurs.push(error)
        resultErrors.push(error.msg);
      });

      res.status(400).json(resultErrors);
    } catch (error) {
      res.status(500).json({ message: "Oops! Give it another shot shortly." });
    }
  }
);

app.put(
  "/api/films/:id",
  [
    check("titre").escape().trim().optional(),
    check("titreVignette").escape().trim().optional(),
    check("description").escape().trim().optional(),
    check("realisation").escape().trim().optional(),
    check("annee")
      .escape()
      .trim()
      .optional()
      .isInt({ min: 1800, max: 2024 })
      .withMessage("Please provide a valid year"),
    check("genres")
      .escape()
      .trim()
      .optional()
      .isArray()
      .withMessage("Genre must be an array"),
    check("commentaires")
      .escape()
      .trim()
      .optional()
      .isArray()
      .custom((commentaires) => {
        console.log(commentaires);
      }),
  ],
  async (req, res) => {
    try {
      if (!req.body.genres || req.body.genres.length === 0) {
        delete req.body.genres;
      } else {
        req.body.genres.forEach((genre, index) => {
          if (genre.trim() === "" || !isNaN(Number(genre))) {
            req.body.genres.splice(index);
          }
        });
      }

      const resultEditFilm = validationResult(req);

      const resultErrors = [];

      if (!resultEditFilm.isEmpty()) {
        resultEditFilm.errors.forEach((error) => {
          console.log(error);
          // erreurs.push(error)
          resultErrors.push(error.msg);
          return res.status(400).json({ message: `${resultErrors}` });
        });
        // resultErrors.push(error.msg)
      }

      const id = req.params.id;
      const donneesModifiees = req.body;
      // Validation ici

      // console.log(id);
      // console.log(donneesModifiees);

      await db.collection("films").doc(id).update(donneesModifiees);

      res.status(200).json({ message: "The data has been altered." });
    } catch (error) {}
  }
);

app.delete("/api/films/:id", async (req, res) => {
  const id = req.params.id;

  const resultat = await db.collection("films").doc(id).delete();

  res.statusCode = 200;
  res.json({ message: "The document has been deleted" });
});

app.post(
  "/utilisateurs/inscription",
  [
    check("courriel").escape().trim().notEmpty().isEmail().normalizeEmail(),
    check("mdp")
      .escape()
      .trim()
      .notEmpty()
      .isLength({ min: 5, max: 20 })
      .isStrongPassword({
        minLength: 5,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1,
      }),
  ],
  async (req, res) => {
    const validation = validationResult(req);
    if (validation.errors.length > 0) {
      res.statusCode = 400;
      return res.json({ message: "Données non-conformes" });
    }

    // On récupère les infos du body
    const { courriel, mdp } = req.body;
    console.log(courriel);

    // On vérifie si le courriel existe
    const docRef = await db
      .collection("utilisateurs")
      .where("courriel", "==", courriel)
      .get();
    const utilisateurs = [];

    docRef.forEach((doc) => {
      utilisateurs.push(doc.data());
    });

    // Si oui, erreur
    if (utilisateurs.length > 0) {
      return res
        .status(400)
        .json({ message: "Email already taken. Please use a different one." });
    }

    // On encrypte le mot de passe
    const hash = await bcrypt.hash(mdp, 10);

    // On enregistre dans la DB
    const nouvelUtilisateur = { courriel, mdp: hash };
    const nouvelUtilisateurId = await db
      .collection("utilisateurs")
      .add(nouvelUtilisateur);

    // On valide/nettoie la donnée
    delete nouvelUtilisateur.mdp;

    // On renvoie true;
    res.status(200).json({
      message: `Great news, ${nouvelUtilisateur.courriel}! You're now a registered user.`,
    });
  }
);

app.post("/utilisateurs/connexion", [], async (req, res) => {
  // On récupère les infos du body
  const { mdp, courriel } = req.body;

  // On vérifie si le courriel existe
  const docRef = await db
    .collection("utilisateurs")
    .where("courriel", "==", courriel)
    .get();

  const utilisateurs = [];
  docRef.forEach((utilisateur) => {
    utilisateurs.push(utilisateur.data());
  });

  // Si non, erreur
  if (utilisateurs.length == 0) {
    return res
      .status(400)
      .json({ message: "Email does not exist. Please try again." });
  }

  //  On compare
  const utilisateurAValider = utilisateurs[0];
  const estValide = await bcrypt.compare(mdp, utilisateurAValider.mdp);

  // Si pas pareil, erreur
  if (!estValide) {
    return res
      .status(400)
      .json({ message: "Oops! The password you entered is incorrect." });
  }

  // On retourne les infos de l'utilisateur sans le mot de passe
  delete utilisateurAValider.mdp;
  res.status(200).json({
    message: `Congratulations ${utilisateurAValider.courriel}! You have successfully logged in.`,
  });
});

app.use((req, res) => {
  // res.statusCode = 404;
  res.status(404).render("404", { url: req.url });
});
app.listen(process.env.PORT, () => {
  console.log("Le serveur a démarré");
});
