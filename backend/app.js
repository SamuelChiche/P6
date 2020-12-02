// Node JS Package
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const dotenv = require('dotenv').config()

// Routes
const authRoutes = require('./routes/auth');
const saucesRoutes = require('./routes/sauces');

mongoose.set('useCreateIndex', true);

// Connexion à la base de données : MongoDB
mongoose.connect(process.env.MONGODB_URL, 
   {  useNewUrlParser: true,
      useUnifiedTopology: true})
   .then(() => console.log('Connection to MongoDB succesful !'))
   .catch(() => console.log('Connection to MongoDB failed !'));

const app = express();

// Headers
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });


app.use(bodyParser.json());

app.use(helmet());

// Chemin de stockage des images
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/api/auth', authRoutes);
app.use('/api/sauces', saucesRoutes);


module.exports = app;