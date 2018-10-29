const express = require('express'),
    mongoose = require('mongoose'),
    bcryptjs = require('bcryptjs'),
    bodyParser = require('body-parser'),
    app = express(),
    jsonParser = bodyParser.urlencoded({ extended: false });

mongoose.connect("mongodb://localhost:27017/sylvestre", function(err) {
    console.log((err) ? err : 'Connection au mongo correct')
})

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
var userModel = mongoose.model('Users', userSchema);

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
    res.sendFile(__dirname + '/index.html')
})

app.get('/admin', function(req, res) {
    res.sendFile(__dirname + '/admin.html')
})

app.get('/add-user', function(req, res) {
    res.sendFile(__dirname + '/add-user.html')
})

app.get('/user', function(req, res) {
    userModel.find({}, function(err, data) {
        return (err) ? sendJson(res, 501, err) : (data == null) ? sendJson(res, 204, "We did not find a user") : sendJson(res, 200, data);
    })
})

app.get('/user/:id', function(req, res) {
    userModel.findOne({ _id: req.params.id }, function(err, data) {
        return (err) ? sendJson(res, 501, err) : (data != null) ? sendJson(res, 200, data) : sendJson(res, 402, "User not found");
    })
})


app.post('/user', jsonParser, function(req, res) {
    userModel.findOne({ email: req.body.email }, function(err, data) {
        var err = (err) ? sendJson(res, 501, err) : (data != null) ? sendJson(res, 203, "User already exist") : false;
        console.log(err)
        if (err === false)
            bcryptjs.genSalt(10, (err, salt) => {
                bcryptjs.hash(req.body.password, salt, (err, passwordCrypt) => {
                    new userModel({ firstName: req.body.firstName, lastname: req.body.lastname, email: req.body.email, password: passwordCrypt, avatar: "toto.png" }).save(sendJson(res, 201, "User created"))
                })
            })
        else
            return err;
    })
})

app.put('/user', jsonParser, function(req, res) {
    userModel.updateOne({ _id: req.body.id }, upatedElem(req.body), function(err) {
        return (err || req.body.id === undefined) ? sendJson(res, 502, err) : sendJson(res, 200, "User upadte")
    })
})

app.post('/login', jsonParser, function(req, res) {
    userModel.findOne({ email: req.body.email }, function(err, data) {
        var error = (err) ? sendJson(res, 501, err) : (data == null) ? sendJson(res, 203, "User already exist") : false;
        if (error === false)
            bcryptjs.compare(req.body.password, data.password, function(err, reponse) {
                (!reponse) ? sendJson(res, 402, "User not found"): sendJson(res, 200, data)
            })
        return error
    })
})

app.delete('/user', function(req, res) {
    userModel.deleteMany({}, function(err) {
        return (err) ? sendJson(res, 502, err) : sendJson(res, 200, "Clear collection User")
    })
})

app.delete('/user/:id', function(req, res) {
    userModel.findOneAndDelete({ _id: req.params.id }, function(err, data) {
        return (err) ? sendJson(res, 501, err) : (data == null) ? sendJson(res, 402, "User not found") : sendJson(res, 200, "User delete");
    })
})

/**
 * sendJson -
 * @param res {Object}
 * @param code {Integer}
 * @param data {Any}
 * @return res
 */
function sendJson(res, code = 200, data = "") {
    res.status(code)
    if (code === 200 || code === 201) {
        return res.json({
            error: false,
            httpCode: code,
            users: data
        })
    }
    return res.json({
        error: true,
        httpCode: code,
        messageError: data
    })
}

/**
 * 
 * 
 * @param {Array} data 
 * @param {Array} [key=["firstName", "lastname", "avatar"]] 
 * @returns {Object} user 
 */
function upatedElem(data, key = ["firstName", "lastname", "avatar"]) {
    var user = Object.create(null) // Création d'un Object vide
    for (let i = 0; i < key.length; i++) // Boucle sur les elelments dans l'elements key
        if (Object.prototype.hasOwnProperty.call(data, key[i])) // Verification si la key de trouve dans l'object data
            user[key[i]] = data[key[i]] // Ajoute dans le nouvelle Object
    user.updatedAt = new Date(); // Mets à jour la date de mise à jour
    return user; // Renvoi le nouvelle Object
}


/**
 * Lancement du serveur
 */
app.listen(8080, function() {
    console.log('Example app listening on port 8080!')
})