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

app.get('/user', function(req, res) {
    res.sendFile(__dirname + '/add-user.html')
})

app.post('/user', jsonParser, function(req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(req.body.password, salt, (err, passwordCrypt) => {
            var myUser = {
                firstName: req.body.firstName,
                lastname: req.body.lastname,
                email: req.body.email,
                password: passwordCrypt,
                avatar: "toto.png"
            }
            var newUser = new userModel(myUser);
            newUser.save(function() {
                console.log("User register")
            })
            console.log(req.body.email)
            res.end(JSON.stringify(myUser))
        })
    })
})


app.post('/login', jsonParser, function(req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
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