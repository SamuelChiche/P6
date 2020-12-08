// Sauce model
const Sauce = require('../models/Sauce');

// Node JS package
const fs = require('fs');
const sanitize = require('mongo-sanitize');
const User = require('../models/User');


// Requête POST : ajout d'une sauce par un utilisateur
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const cleanSauceObject = sanitize(sauceObject);
    // Création du nouvel objet sauce
    const sauce = new Sauce({
        ...cleanSauceObject,
        // Chemin de stockage de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // Sauvegarde dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Saved sauce !' }))
        .catch(error => {
            console.log(error);
            res.status(400).json({ error })
        });
};

// Requête GET : Affichage de la page de la sauce unique selectionée
exports.getOneSauce = (req, res, next) => {
    const cleanSauceId = sanitize(req.params.id);
    Sauce.findOne({ _id: cleanSauceId})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => {
            console.log(error);
            res.status(404).json({ error })
        });
};

// Requête GET : Affichage de la page affichant toutes les sauces de la base de données
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => {
            console.log(error);
            res.status(400).json({ error })
        });
};

// Requête PUT : Permet la modification d'une sauce déjà présente dans la base de données
exports.modifySauce = (req, res, next) => {
    const cleanSauce = sanitize(req.body.sauce);
    const sauceObject = req.file ?
    {
        ...JSON.parse(cleanSauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }   : { ...req.body }
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modified !' }))
        .catch(error => res.status(400).json({ error }));
};

// Requête DELETE : Supprime la sauce avec l'ID fourni
exports.deleteSauce = (req, res, next) => {
    const cleanSauceId = sanitize(req.params.id);
    Sauce.findOne({_id: cleanSauceId})
        .then(sauce => {
            // L'image est supprimé du dossier de stockage
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () =>{
                // La sauce est supprimé de la base de données
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce deleted !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Requête POST : Permet de définir le statut like d'une sauce pour l'userID fourni
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const userId = sanitize(req.body.userId);
            const like = sanitize(req.body.like);
            
            usersLiked = sauce.usersLiked;
            usersDisliked = sauce.usersDisliked;
            likes = sauce.likes;
            dislikes = sauce.dislikes;


            switch (req.body.like) {
                // L'utilisateur aime la sauce
                case 1:
                    // Son userId est ajouté à la chaine correspondant dans la base de données et son like est comptablilisé
                    Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: userId } , $inc: { likes : 1} })
                        .then(() => res.status(200).json({ message : 'Sauce liked !' }))
                        .catch(error => {
                            console.log(error);
                            res.status(400).json({ error })
                        });
                    break;
                
                // L'utilisateur annule ce qu'il aime ou n'aime pas
                case 0:
                    // Si il aimait la sauce
                    if (usersLiked.includes(userId)) {
                        // Son userId est retiré de la chaîne et son like est enlevé du compteur
                        Sauce.updateOne({ _id: req.params.id }, { $pull : { usersLiked: userId }, $inc: { likes : -1 } })
                            .then(() => res.status(200).json({ message: 'Like removed !'}))
                            .catch(error => {
                                console.log(error);
                                res.status(400).json({ error })
                            })
                    }
                    // Si il n'aimait pas la sauce
                    else if (usersDisliked.includes(userId) ){
                        // Son userId est retiré de la chaîne et son dislike est enlevé du compteur
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked : userId }, $inc: { dislikes : -1 } })
                            .then(() => res.status(200).json({ message: 'Dislike removed !' }))
                            .catch(error => {
                                console.log(error);
                                res.status(400).json({ error })
                            })
                    }
                    break;
                // L'utilisateur n'aime pas la sauce
                case -1:
                    // Son userId est ajouté à la chaine correspondant dans la base de données et son dislike est comptablilisé
                    Sauce.updateOne({ _id: req.params.id }, {  $push: { usersDisliked: userId }, $inc: { dislikes: 1 } })
                        .then(() => res.status(200).json({ message: 'Sauce disliked !' }))
                        .catch(error => {
                            console.log(error);
                            res.status(400).json({ error })
                        })
                    break;
            }
        })
        .catch(error => {
            console.log(error);
            res.status(401).json({ error })
        });
};