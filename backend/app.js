const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://Schiche24:ecG7pueX0S6u0573@cluster0.gwhtj.mongodb.net/piquante?retryWrites=true&w=majority', 
   {  useNewUrlParser: true,
      useUnifiedTopology: true})
   .then(() => console.log('Connexion à MongoDB réussi !'))
   .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

app.use(bodyParser.json());


module.exports = app;