const http = require("http");

var serv = http.createServer(function(req, res) {
    console.log(req.url)
    if (req.url == '/') {
        res.end("<p>OOUUII je suis présent</p><script>console.log('Test')</script>")
    } else if (req.url == '/user') {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user))
    } else {
        res.end("<p>Non je ne suis pas présent</p>")
    }
})

serv.listen(8080);