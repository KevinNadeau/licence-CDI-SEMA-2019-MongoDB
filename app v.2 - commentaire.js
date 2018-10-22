/** START Import Module NodeJs **/
const express = require('express'), // Modele de routing - Permet la gestion les routes.
    mongoose = require('mongoose'), // Module de connection et gestion de MongoDB via le NodeJs - En php equivalent de PDO
    bcryptjs = require('bcryptjs'), // Cryptage du password
    bodyParser = require('body-parser'), // Middleware - Permet de parser les données envoyer par l'utilisateur et de les traiter de manière facile.
    app = express(),
    jsonParser = bodyParser.urlencoded({ extended: false }); // Middleware - Il ce declache avant le lancenement de la function (Pour notre cas, avanc les fonction lier au route pour parser les data envoyer par le client)
/** END Import Module NodeJs **/


/** 
 * Conncetion MongoDb
 * mongodb://<address du serveur>:<port du serveur moongoDb>/<nom de la database>
 */
mongoose.connect("mongodb://localhost:27017/sylvestre", function(err) {
    console.log((err) ? err : 'Connection au mongo correct') // Terner - Si tout ce passe bien, data = 'Connection au mongo correct' sinon à l'erreur lier à la connection
})

/**
 * Les Schema seront la sructure de nos données. Ils permettent de definir les attributs de données inserers
 * { type: Date, default: Date.now } => Permet de definir une valeur par default
 */
var userSchema = mongoose.Schema({
    firstName: String,
    lastname: String,
    email: String,
    password: String,
    avatar: String,
    status: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})
var userModel = mongoose.model('Users', userSchema); // Le model permet la relation entre les collection et les schemas.

var messageSchema = mongoose.Schema({
    message: String,
    user: userSchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})
var messageModel = mongoose.model('Message', messageSchema);

var messagerieSchema = mongoose.Schema({
    sender: userSchema,
    receiver: userSchema,
    message: Array,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})
var messagerieModel = mongoose.model('Messagerie', messagerieSchema);


var user = { firstName: "Sylvestre", lastname: "Mike", email: "mike.sylvestre@lyknowledge.io", password: "toto", avatar: "toto.png", status: 1 } // Element de Test

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html') // Afficher la page index.html cote client
})

app.get('/user', function(req, res) {
    res.sendFile(__dirname + '/add-user.html') // Afficher la page add-user.html cote client
})

app.post('/user', jsonParser, function(req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    bcryptjs.genSalt(10, (err, salt) => { // Creation d'une salt (grain de sel) permettant le cryptage du password.
        bcryptjs.hash(req.body.password, salt, (err, passwordCrypt) => { // Cryptage du password avec la salt
            var myUser = {
                    firstName: req.body.firstName,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: passwordCrypt,
                    avatar: "toto.png"
                } // Initialisation d'un object user
            var newUser = new userModel(myUser); // Nouvelle instance de model avec en param. dans le constructeur, un object permmettant la création d'un nouvelle entiter avec les caract. de l'object inserer
            newUser.save(function() { // Savegarde de l'instance
                console.log("User register")
                console.log(req.body.email)
                res.end(JSON.stringify(myUser))
            })
        })
    })
})


app.post('/login', jsonParser, function(req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    // userModel.find({ email: req.body.email }, function(){}) - Rechcercher un ensemble d'utilisateur ayant la meme adress email => req.body.email
    /**
     * findOne
     * Rechcercher un SEUL utilisateur ayant la meme adress email => req.body.email
     */
    userModel.findOne({ email: req.body.email }, function(err, data) {
        if (err) {
            return res.end(JSON.parse({
                error: true,
                errorCode: 502,
                messageErro: err
            }))
        } else {
            if (data != null) {
                console.log("Tout est ok")
            } else {
                return res.end(JSON.parse({
                    error: true,
                    errorCode: 402,
                    messageErro: "Not user by email"
                }))
            }
        }
    })
})

app.listen(8080, function() {
    console.log('Example app listening on port 8080!')
})