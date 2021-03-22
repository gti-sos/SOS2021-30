var cool = require("cool-ascii-faces");

var express = require("express");

var app = express();

var port = (process.env.PORT || 10000);

const path = require("path");

app.get("/cool",(request,response) =>{
    response.send(cool());
    console.log("New request to /cool has arrived");
});

app.use("/",express.static(path.join(__dirname,"public")));

app.get("/index.html",(request,response) =>{
    response.sendFile(path.join(__dirname,"/index.html"));
    console.log("File sent");
});

app.get("/info/life-expectancy-stats",(request,response) =>{
    response.send("<html><body><p>Datos de la esperanza de vida en España por provincia/año/media mujeres/media hombres/media conjunta</p><table border='1'><tr><td>country</td><td>province</td><td>year</td><td>life-expectancy-woman</td><td>life-expentancy-man</td><td>average-life-expectancy</td></tr><tr><td>España</td><td>Andalucia</td><td>2017</td><td>84,41</td> <td>79,23</td><td>81,63</td> </tr><tr><td>España</td><td>Aragón</td><td>2017</td><td>86,06</td> <td>80,43</td><td>83,23</td></tr><tr><td>España</td><td>Asturias</td><td>2017</td><td>85.51</td><td>79,50</td><td>82,58</td></tr><tr><td>España</td><td>Cantabria</td><td>2017</td><td>86,22</td><td>80,34</td><td>83,33</td></tr><tr><td>España</td><td>Ceuta</td><td>2017</td><td>82,11</td><td>76,65</td><td>79,31</td></tr></table></body></html>");
    console.log("Info sent");
});


app.listen(port,()=>{
    console.log("Server ready listening on port "+port);
});

console.log(cool());
