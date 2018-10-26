const mongoose = require('mongoose')

let retour = {}

retour.connect = mongoose.connect("mongodb://localhost:27017/sylvestre", function(err) {
    console.log((err) ? err : 'Connection au mongo correct')
});

let userSchema = mongoose.Schema({
    firstName: String,
    lastname: String,
    email: String,
    password: String,
    avatar: String,
    status: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})
retour.userModel = mongoose.model('Users', userSchema);

let messageSchema = mongoose.Schema({
    message: String,
    user: userSchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})
retour.messageModel = mongoose.model('Message', messageSchema);

let messagerieSchema = mongoose.Schema({
    sender: userSchema,
    receiver: userSchema,
    message: Array,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})
retour.messagerieModel = mongoose.model('Messagerie', messagerieSchema);


retour.user = { firstName: "Sylvestre", lastname: "Mike", email: "mike.sylvestre@lyknowledge.io", password: "toto", avatar: "toto.png", status: 1 } // Element de Test

exports.retour = retour;