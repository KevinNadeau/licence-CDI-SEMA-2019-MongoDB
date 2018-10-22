/** START Import Module NodeJs **/
const express = require('express');
const mysql = require('mysql');
/** END Import Module NodeJs **/

/** START Création des constant utiliser dans le serveur NodeJs **/
const app = express() // Création d'un object express
const user = { _id: 1, name: "Sylvestre", lastname: "Mike" } // Varible user de test api
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
}); // Initialisation de la base de donnée
/** END Création des constant utiliser dans le serveur NodeJs **/

connection.connect(); // Connection à la base de donnée MySql


/** START Création de route sous express NodeJs **/
app.get('/', function(req, res) { // Création d'un route sous express
    res.sendFile(__dirname + '/index.html') // Envoi au client, le fichier html
})

app.get('/user', function(req, res) {
    connection.query('SELECT * FROM users', function(error, results, fields) { // Lancement de la requet SQL
        if (error) throw error;
        res.writeHead(200, { "Content-Type": "application/json" });
        console.log('The solution is: ', results[0]._id);
        res.end(JSON.stringify(results))
    });
})

app.post('/user', function(req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    user._id = 2;
    res.end(JSON.stringify(user))
})

app.delete('/user', function(req, res) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({}))
    })
    /** END Création de route sous express NodeJs **/

app.listen(8080, function() { // Lancement du serveur sur un port
    console.log('Example app listening on port 8080!')
})