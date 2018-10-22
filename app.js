const express = require('express');
const mysql = require('mysql');
const app = express()

const user = { _id: 1, name: "Sylvestre", lastname: "Mike" }

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
});

connection.connect();


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.get('/user', function(req, res) {
    connection.query('SELECT * FROM users', function(error, results, fields) {
        if (error) throw error;
        res.writeHead(200, { "Content-Type": "application/json" });
        console.log('The solution is: ', results[0]._id);
        res.end(JSON.stringify(results))
    });
})

app.post('/user', function(req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user))
})

app.delete('/user', function(req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({}))
})

app.listen(8080, function() {
    console.log('Example app listening on port 8080!')
})