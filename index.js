var express = require("express");
var bodyParser = require("body-parser");
var _= require("underscore");
const request = require("request");

var app = express();

app.use(bodyParser.json());

var port = process.env.PORT || 10000;

const path = require("path");

//--------------------------- API REST ALCOHOL-CONSUMPTION-STATS-----------------
var alcoholAPI = require("./src/back/alcoholConsumptionStatsAPI/v1");
alcoholAPI.register(app);

var alcoholAPIv2 = require("./src/back/alcoholConsumptionStatsAPI/v2");
alcoholAPIv2.register(app);

//Integración grupo 11

app.use("/anxiety-stats", function(req, res) {
    var apiServerHostAnxietyStats = ' http://sos2021-11.herokuapp.com';
    //anxiety-stats/api/v2/anxiety_stats
    var url = apiServerHostAnxietyStats + req.url;
    console.log('piped: /anxiety-stats -> ' + url);
    req.pipe(request(url)).pipe(res);
});

//Integración grupo 4

app.use("/poverty-risk-stats", function(req, res) {
    var apiServerHostAnxietyStats = 'http://sos2021-04.herokuapp.com';
    //  poverty-risk-stats/api/v1/poverty_risks
    var url = apiServerHostAnxietyStats + req.url;
    console.log('piped: /poverty-risk-stats -> ' + url);
    req.pipe(request(url)).pipe(res);
});

/* // Integracion API externa Cocktails
app.use("/cocktails", function(req, res) {
    var apiServerHostAnxietyStats = 'https://corona-virus-world-and-india-data.p.rapidapi.com/api';
    var url = apiServerHostAnxietyStats + req.url;
    console.log('piped: /cocktail-stats -> ' + url);
    req.headers({
        "x-rapidapi-key": "8bc009cf62msh21716bede95b074p10450fjsnae5393291199",
        "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com",
        "useQueryString": true
    });
    req.pipe(request(url)).pipe(res);
}); */


//---------------------------END: API REST ALCOHOL-CONSUMPTION-STATS-----------------

//~~~~~~~~~~~~~~~~~~~~~~~~ API REST WEIGHTS-STATS ~~~~~~~~~~~~~~~~~~~~~~~~
var weightsStatsAPI = require("./src/back/weightsStatsAPI/v1");
weightsStatsAPI.register(app);

var weightsStatsAPIv2 = require("./src/back/weightsStatsAPI/v2");
weightsStatsAPIv2.register(app);
//~~~~~~~~~~~~~~~~~~~ END: API REST WEIGHTS-STATS ~~~~~~~~~~~~~~~~~~~~~~~~

//--------------------------- API REST SMOKERS-CONSUMPTION-STATS-----------------
var smokersAPIv1 = require("./src/back/smokersStatsAPI/v1");
smokersAPIv1.register(app);
var smokersAPIv2 = require("./src/back/smokersStatsAPI/v2");
smokersAPIv2.register(app);
var smokersAPIv3 = require("./src/back/smokersStatsAPI/v3");
smokersAPIv3.register(app);

//INTEGRACIONES A SMOKER

app.use("/api/v1/arms-sales-stats", function(req, res) {
    var apiServerHostArmsSales = ' http://sos2021-05.herokuapp.com';

    //SALES-STATS
    var url = apiServerHostArmsSales + req.url;
    console.log('piped: /api/v1/arms-sales-stats -> ' + url);
    // request solo hace get, investigar como hacer put, post, delete, etc.
    req.pipe(request(url)).pipe(res);
});


//---------------------------END: API REST SMOKERS-CONSUMPTION-STATS-----------------

//~~~~~~~~~~~~~~~~~~~~~~~~ API REST LIFE-EXPECTANCY-STATS ~~~~~~~~~~~~~~~~~~~~~~~~
var lifeAPI = require("./src/back/lifeExpectancyStatsAPI/v1");
lifeAPI.register(app);
var lifeAPIv2 = require("./src/back/lifeExpectancyStatsAPI/v2");
lifeAPIv2.register(app);
//~~~~~~~~~~~~~~~~~~~ END: API LIFE-EXPECTANCY-STATS ~~~~~~~~~~~~~~~~~~~~~~~~




app.use("/",express.static(path.join(__dirname,"public")));

app.listen(port,()=>{
    console.log("Server ready listening on port "+port);
});


app.get("/index.html",(request,response) =>{
    response.sendFile(path.join(__dirname,"/index.html"));
    console.log("File sent");
});

app.get("/info/life-expectancy-stats",(request,response) =>{
    response.send("<html><body><p>Datos de la esperanza de vida en España por provincia/año/media mujeres/media hombres/media conjunta</p><table border='1'><tr><td>country</td><td>province</td><td>year</td><td>life-expectancy-woman</td><td>life-expentancy-man</td><td>average-life-expectancy</td></tr><tr><td>España</td><td>Andalucia</td><td>2017</td><td>84,41</td> <td>79,23</td><td>81,63</td> </tr><tr><td>España</td><td>Aragón</td><td>2017</td><td>86,06</td> <td>80,43</td><td>83,23</td></tr><tr><td>España</td><td>Asturias</td><td>2017</td><td>85.51</td><td>79,50</td><td>82,58</td></tr><tr><td>España</td><td>Cantabria</td><td>2017</td><td>86,22</td><td>80,34</td><td>83,33</td></tr><tr><td>España</td><td>Ceuta</td><td>2017</td><td>82,11</td><td>76,65</td><td>79,31</td></tr></table></body></html>");
    console.log("Info sent");
});

app.get("/info/smokers-stats",(request,response) =>{
    response.send("<html><body><p>Datos de fumadores en España por provincia: fumadores diarios, fumadores habituales, exfumadores y no fumadores; expresado en nº de habitantes</p><table border='5'><tr><td>country</td><td>provinces</td><td>years</td><td>daily-smokers</td><td>ocasional-smokers</td><td>ex-smokers</td><td>no-smokers</td></tr><tr><td>España</td><td>Andalucia</td><td>2017</td><td>1.902.219,14</td><td>260.612,40</td><td>242.773,13</td><td>4.294.657,75</td> </tr><tr><td>España</td><td>Aragón</td><td>2017</td><td>315.408,75</td> <td>18.846,00</td><td>274.678,38</td><td>603.988,13</td></tr><tr><td>España</td><td>Asturias</td><td>2017</td><td>246.320,48</td><td>45.124,26</td><td>220.967,80</td><td>559.602,87</td></tr><tr><td>España</td><td>Cantabria</td><td>2017</td><td>132.887,56</td><td>4.526,30</td><td>541.681,36</td><td>307.382,26</td></tr><tr><td>España</td><td>Castilla y León</td><td>2017</td><td>550.656,83</td><td>72.774,03</td><td>465.208,69</td><td>1.244.193,33</td></tr><tr><td>España</td><td>Castilla La Mancha</td><td>2017</td><td>499.743,83</td><td>55.865,67</td><td>1.294.313,68</td><td>1.129.502,32</td></tr><tr><td>España</td><td>Cataluña</td><td>2017</td><td>1.700.061,75</td><td>174.539,67</td><td>994.231,61</td><td>4.125.483,18</td></tr><tr><td>España</td><td>Comunidad Valenciana</td><td>2017</td><td>1.225.494,23</td><td>123.043,57</td><td>220.519,66</td><td>2.447.035,26</td></tr><tr><td>España</td><td>Extremadura</td><td>2017</td><td>258.100,88</td><td>30.885,71</td><td>524.605,26</td><td>573.221,54</td></tr><tr><td>España</td><td>Galicia</td><td>2017</td><td>482.084,34</td><td>108.333,56</td><td>1.068.479,61</td><td>1.606.045,03</td></tr><tr><td>España</td><td>Madrid (Comunidad de)</td><td>2017</td><td>1.236.364,96</td><td>211.483,48</td><td>304.346,51</td><td>3.586.109,10</td></tr><tr><td>España</td><td>Navarra (Comunidad Foral De)</td><td>2017</td><td>131.219,74</td><td>16.788,41</td><td>308.937,45</td><td>385.747,43</td></tr><tr><td>España</td><td>País Vasco</td><td>2017</td><td>434.443,28</td><td>83.816,84</td><td>74.051,46</td><td>1.083.694,64</td></tr></table></body></html>");
});

app.get("/info/table-weights-stats",(request,response) =>{
    response.send("<html><body><p>Datos del IMC por comunidades autónomas de España teniendo en cuenta el peso normal, sobre peso y obesidad.(Expresando el dato en % de habitantes)</p><table border='1'><tr><td>country</td><td>province</td><td>year</td><td>normal weight</td><td>overweight</td><td>obesity</td></tr><tr><td>España</td><td>Andalucia</td><td>2017</td><td>45,1</td> <td>37,5</td><td>21,0</td> </tr><tr><td>España</td><td>Canarias</td><td>2017</td><td>43,5</td> <td>37,2</td><td>19,3</td></tr><tr><td>España</td><td>Castilla y León</td><td>2017</td><td>47,6</td><td>39,2</td><td>13,2</td></tr><tr><td>España</td><td>Cataluña</td><td>2017</td><td>48,4</td><td>36,7</td><td>14,9</td></tr><tr><td>España</td><td>Comunidad Valenciana</td><td>2017</td><td>45,0</td><td>36,2</td><td>18,8</td></tr><tr><td>España</td><td>País Vasco</td><td>2017</td><td>50,3</td><td>35,9</td><td>13,8</td></tr></table></body></html>");
});

app.get("/info/alcohol-consumption-stats",(request,response) =>{
    response.send("<html><body><p>Datos de consumo de alcohol en España: rango de edad, muertes prematuras por consumo, prevalencia del trastorno por consumo de alcohol</p><table border='5'><tr><td>country</td><td>years</td><td>age range</td><td>alcohol premature death</td><td>prevalence of alcohol use disorder </td></tr><tr><td>España</td><td>2017</td><td>0-5</td><td>0</td><td>0.00</td></tr><tr><td>España</td><td>2017</td><td>5-14</td><td>10</td><td>0.05</td></tr><tr><td>España</td><td>2017</td><td>15-49</td><td>2,529</td><td>1.32</td></tr><tr><td>España</td><td>2017</td><td>50-69</td><td>10,184</td><td>0.63</td></tr><tr><td>España</td><td>2017</td><td>70-</td><td>18,864</td><td>0.25</td></tr></table></body></html>");
    console.log("Info about alcohol-consumption-stats sent");
});

