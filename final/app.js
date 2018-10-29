const cors = require("cors"),
    express = require('express'),
    bcryptjs = require('bcryptjs'),
    bodyParser = require('body-parser'),
    model = require('./model.js').retour,
    app = express(),
    jsonParser = bodyParser.urlencoded({ extended: false });

app.use(cors({
    origin: ["http://localhost:8080"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

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
    model.userModel.find({}, function(err, data) {
        return (err) ? sendJson(res, 501, err) : (data == null) ? sendJson(res, 204, "We did not find a user") : sendJson(res, 200, data);
    })
})

app.get('/user/:id', function(req, res) {
    model.userModel.findOne({ _id: req.params.id }, function(err, data) {
        return (err) ? sendJson(res, 501, err) : (data != null) ? sendJson(res, 200, data) : sendJson(res, 402, "User not found");
    })
})

app.post('/user', jsonParser, validateParamUser, function(req, res) {
    model.userModel.findOne({ email: req.body.email }, function(err, data) {
        var err = (err) ? sendJson(res, 501, err) : (data != null) ? sendJson(res, 203, "User already exist") : false;
        console.log(err)
        if (err === false)
            bcryptjs.genSalt(10, (err, salt) => {
                bcryptjs.hash(req.body.password, salt, (err, passwordCrypt) => {
                    new model.userModel({ firstName: req.body.firstName, lastname: req.body.lastname, email: req.body.email, password: passwordCrypt, avatar: "toto.png" }).save(sendJson(res, 201, "User created"))
                })
            })
        else
            return err;
    })
})

app.put('/user', jsonParser, function(req, res) {
    model.userModel.updateOne({ _id: req.body.id }, upatedElem(req.body), function(err) {
        return (err || req.body.id === undefined) ? sendJson(res, 502, "update fail") : sendJson(res, 200, "User upadte")
    })
})

app.post('/login', jsonParser, validateParamLogin, function(req, res) {
    model.userModel.findOne({ email: req.body.email }, function(err, data) {
        var error = (err) ? sendJson(res, 501, err) : (data == null) ? sendJson(res, 203, "User already exist") : false;
        if (error === false)
            bcryptjs.compare(req.body.password, data.password, function(err, reponse) {
                (!reponse) ? sendJson(res, 402, "User not found"): sendJson(res, 200, data)
            })
        return error
    })
})

app.delete('/user', function(req, res) {
    model.userModel.deleteMany({}, function(err) {
        return (err) ? sendJson(res, 502, err) : sendJson(res, 200, "Clear collection User")
    })
})

app.delete('/user/:id', function(req, res) {
    model.userModel.findOneAndDelete({ _id: req.params.id }, function(err, data) {
        return (err) ? sendJson(res, 501, err) : (data == null) ? sendJson(res, 402, "User not found") : sendJson(res, 200, "User delete");
    })
})

function validateParamLogin(req, res, next) {
    (req.body.email === undefined || req.body.password === undefined) ? sendJson(res, 401, "Missing parameter"): next();
}

function validateParamUser(req, res, next) {
    (
        req.body.email === undefined ||
        req.body.password === undefined ||
        req.body.firstName === undefined ||
        req.body.lastname === undefined
    ) ? sendJson(res, 401, "Missing parameter"): next();
}

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

function upatedElem(data, key = ["firstName", "lastname", "avatar"]) {
    var user = Object.create(null)
    for (let i = 0; i < key.length; i++)
        if (Object.prototype.hasOwnProperty.call(data, key[i]))
            user[key[i]] = data[key[i]]
    user.updatedAt = new Date();
    return user;
}

app.listen(8080, function() {
    console.log('Example app listening on port 8080!')
})