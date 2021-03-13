var cool = require("cool-ascii-faces");

var express = require("express");

var app = express();

var port = 10000;

const path = require("path");

app.get("/cool",(request,response) =>{
    response.send(cool());
    console.log("New request to /cool has arrived");
});

app.get("/public/index.html",(request,response) =>{
    response.sendFile(path.join(__dirname,"public/index.html"));
    console.log("File sent");
});

app.listen(port,()=>{
    console.log("Server ready listening on port "+port);
});




console.log(cool());