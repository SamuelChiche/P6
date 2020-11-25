const Sauce = require('../models/Sauce');
const fs = require('fs');
const User = require('../models/User');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Saved sauce !' }))
        .catch(error => {
            console.log(error);
            res.status(400).json({ error })
        });
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => {
            console.log(error);
            res.status(404).json({ error })
        });
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => {
            console.log(error);
            res.status(400).json({ error })
        });
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }   : { ...req.body }
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modified !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce =>{
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () =>{
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce deleted !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const userId = req.body.userId;
            const like = req.body.likes;
            
            usersLiked = sauce.usersLiked;
            usersDisliked = sauce.usersDisliked;
            likesCount = sauce.likes;
            dislikesCount = sauce.dislikes;


            switch (req.body.like) {
                case 1:
                    Sauce.updateOne({_id: req.params.id}, { $push: { usersLiked: userId } , $inc: { likesCount : 1} })
                        .then(() => res.status(200).json({ message : 'Sauce liked !' }))
                        .catch(error => {
                            console.log(error);
                            res.status(400).json({ error })
                        });
                    break;
        
                case 0:
                    if (usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull : { usersLiked: userId }, $inc: { likesCount : -1 } })
                            .then(() => res.status(200).json({ message: 'Like removed !'}))
                            .catch(error => {
                                console.log(error);
                                res.status(400).json({ error })
                            })
                    } 
                    else if (usersDisliked.includes(userId) ){
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked : userId }, $inc: { dislikesCount : -1 } })
                            .then(() => res.status(200).json({ message: 'Dislike removed !' }))
                            .catch(error => {
                                console.log(error);
                                res.status(400).json({ error })
                            })
                    }
                    break;
                
                case -1:
                    Sauce.updateOne({ _id: req.params.id }, {  $push: { usersDisliked: userId }, $inc: { dislikesCount: 1 } })
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