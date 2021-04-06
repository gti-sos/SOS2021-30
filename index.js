var cool = require("cool-ascii-faces");

var express = require("express");
var bodyParser = require("body-parser");

var _= require("underscore");

var app = express();

var port = process.env.PORT || 10000;

//RUTA BASE DE LA API
var BASE_API_PATH = "/api/v1";

const path = require("path");

app.use(bodyParser.json());

app.listen(port,()=>{
    console.log("Server ready listening on port "+port);
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

 var alcoholConsumptionStats=[];
 
app.get(BASE_API_PATH+"/alcohol-consumption-stats/loadInitialData",(req,res)=>{
    alcoholConsumptionStats=[
        {
            "id":1,
            "country":"España",
            "years":"2017",
            "ageRange":"0-5",
            "alcoholPrematureDeath":0,
            "prevalenceOfAlcoholUseDisorder":0.00
        },
        {
            "id":2,
            "country":"España",
            "years":"2017",
            "ageRange":"5-14",
            "alcoholPrematureDeath":10,
            "prevalenceOfAlcoholUseDisorder":0.05
        }
    ];
    res.send(JSON.stringify(alcoholConsumptionStats,null,2));
});

//GET A UNA LISTA DE RECURSOS
app.get(BASE_API_PATH+"/alcohol-consumption-stats",(req,res)=>{
    res.send(JSON.stringify(alcoholConsumptionStats,null,2));
    res.sendStatus(200);
});
//POST A LA LISTA DE RECURSOS
app.post(BASE_API_PATH+"/alcohol-consumption-stats",(req,res)=>{
    if(Object.keys(req.body).length>6){
        res.status(400).json({error: 'Bad request'});
    }else{
        const id = alcoholConsumptionStats.length +1;
        var newStat={...req.body,id};
        console.log(`new stat added: <${JSON.stringify(newStat,null,2)}>`);
        alcoholConsumptionStats.push(newStat);
        res.sendStatus(201);
    }
    res.end();
});
//GET A UN RECURSO 
app.get(BASE_API_PATH+"/alcohol-consumption-stats/:id",(req,res)=>{
    const {id} = req.params;
    _.each(alcoholConsumptionStats,(alcoholConsumptionStat,i)=>{
        if(alcoholConsumptionStat.id==id){
            res.send(JSON.stringify(alcoholConsumptionStat,null,2));
        }
    });
    res.sendStatus(200);
});

//PUT A UN RECURSO
app.put(BASE_API_PATH+"/alcohol-consumption-stats/:id",(req,res)=>{
    const {id} = req.params;
    const {country,years,ageRange,alcoholPrematureDeath,prevalenceOfAlcoholUseDisorder}=req.body;
    if(country&&years&&ageRange&&alcoholPrematureDeath&&prevalenceOfAlcoholUseDisorder){
        _.each(alcoholConsumptionStats,(alcoholConsumptionStat,i)=>{
            if(alcoholConsumptionStat.id==id){
                alcoholConsumptionStat.country=country;
                alcoholConsumptionStat.years=years;
                alcoholConsumptionStat.ageRange=ageRange;
                alcoholConsumptionStat.alcoholPrematureDeath=alcoholPrematureDeath;
                alcoholConsumptionStat.prevalenceOfAlcoholUseDisorder=prevalenceOfAlcoholUseDisorder;

            }
        });
        res.json(alcoholConsumptionStats);
        res.status(200);
    
    }else{
        res.status(500).json({error: 'There was an error.'});
    }
});
//DELETE A UN RECURSO
app.delete(BASE_API_PATH+"/alcohol-consumption-stats/:id",(req,res)=>{
    const {id} = req.params;
    _.each(alcoholConsumptionStats,(alcoholConsumptionStat,i)=>{
        if(alcoholConsumptionStat.id==id){
            alcoholConsumptionStats.splice(i,1);
            res.send(alcoholConsumptionStats);
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    });
});

//DELETE A LISTA DE RECURSOS
app.delete(BASE_API_PATH+"/alcohol-consumption-stats/",(req,res)=>{
    alcoholConsumptionStats.splice(0, alcoholConsumptionStats.length);
    //Envio de recurso actualizado
    res.send(alcoholConsumptionStats);
    res.sendStatus(200);
});
//PUT A UNA LISTA DE RECURSOS (Debe dar error)
app.put(BASE_API_PATH+"/alcohol-consumption-stats",(req,res)=>{
    res.sendStatus(405);
});
//POST A UN RECURSO (Debe dar error)
app.post(BASE_API_PATH+"/alcohol-consumption-stats/:id",(req,res)=>{
    res.sendStatus(405);
});

/*-----------------------------------------------SMOKERS-STATS------------------------------------------*/
var smokersStats = [];

app.get(BASE_API_PATH+"/smokers-stats/loadInitialData",(req,res)=>{
    smokersStats=[
        {   
            "id": 1,
            "country": "España",
            "province":"Andalucía",
            "year":2017,
            "dailySmoker": 1902219.14,
            "ocasionalSmoker": 260612.40,
            "exSmoker": 242773.13,
            "nonSmoker": 4294657.75
        },
        {
            "id": 2,
            "country": "España",
            "province":"Aragón",
            "year":2017,
            "dailySmoker": 315408.75,
            "ocasionalSmoker": 18846.00,
            "exSmoker": 274678.38,
            "nonSmoker": 603988.13
        },
        {
            "id": 3,
            "country": "España",
            "province":"Asturias (Principado De)",
            "year":2017,
            "dailySmoker": 246320.48,
            "ocasionalSmoker": 45124.26,
            "exSmoker": 220967.80,
            "nonSmoker": 559602.87
        }
    ];
    res.send(JSON.stringify(smokersStats,null,2));
});

//GET A UNA LISTA DE RECURSOS DE SMOKERS-STATS
app.get(BASE_API_PATH+"/smokers-stats",(req,res)=>{
    res.send(JSON.stringify(smokersStats,null,2));
    res.sendStatus(200);
});

//POST A LA LISTA DE RECURSOS DE SMOKERS-STATS
app.post(BASE_API_PATH+"/smokers-stats",(req,res)=>{
    const id = smokersStats.length +1;

    var newStat={...req.body, id};

    var newStat={...req.body,id};
    console.log(`new stat added: <${JSON.stringify(newStat,null,2)}>`);
    smokersStats.push(newStat);
    res.sendStatus(201);
});

//PUT A UNA LISTA DE RECURSOS DE SMOKERS STATS (Debe dar error)
app.put(BASE_API_PATH+"/smokers-stats",(req,res)=>{
    res.sendStatus(405);
});

//DELETE A LISTA DE RECURSOS DE SMOKERS STATS
app.delete(BASE_API_PATH+"/smokers-stats/",(req,res)=>{
    smokersStats.splice(0, smokersStats.length);
    //Envio de recurso actualizado
    res.send(smokersStats);
    res.sendStatus(200);
});


//GET A UN RECURSO CONCRETO DE SMOKER
app.get(BASE_API_PATH+"/smokers-stats/:id",(req,res)=>{
    const {id} = req.params;
    _.each(smokersStats,(smokersStats,i)=>{
        if(smokersStats.id==id){
            res.send(JSON.stringify(smokersStats,null,2));
        }else{
            sendStatus(404);
        }
    });
    res.sendStatus(200);
});

//POST A UN RECURSO DE SMOKER (Debe dar error)
app.post(BASE_API_PATH+"/smokers-stats/:id",(req,res)=>{
    res.sendStatus(405);
});

//PUT A UN RECURSO CONCRETO DE SMOKER
app.put(BASE_API_PATH+"/smokers-stats/:id",(req,res)=>{
    const {id} = req.params;
    const {country,province,year,dailySmoker,ocasionalSmoker,exSmoker, nonSmoker}=req.body;
    if(country&&province&&year&&dailySmoker&&ocasionalSmoker&&exSmoker&&nonSmoker){
        _.each(smokersStats,(smokersStats,i)=>{
            if(smokersStats.id==id){
                smokersStats.country = country;
                smokersStats.province = province;
                smokersStats.year = year;
                smokersStats.dailySmoker = dailySmoker;
                smokersStats.ocasionalSmoker = ocasionalSmoker;
                smokersStats.exSmoker = exSmoker;
                smokersStats.nonSmoker = nonSmoker;
            }
        });
        //Envio de recurso actualizado
        res.json(smokersStats);
        res.status(200);
    
    }else{
        res.status(500).json({error: 'There was an error.'})
    }
});

//DELETE A UN RECURSO
app.delete(BASE_API_PATH+"/table-weights-stats/:id",(req,res)=>{
    const {id} = req.params;
    _.each(smokersStats,(smokersStats,i)=>{
        if(smokersStats.id==id){
            smokersStats.splice(i,1);
            res.send(smokersStats);
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    });
});


//~~~~~~~~~~~~~~~~~~~~~~~~ API REST WEIGHTS-STATS ~~~~~~~~~~~~~~~~~~~~~~~~

//5.2 - GET loadInitialData
var weights_stats = [];

app.get(BASE_API_PATH + "/table-weights-stats/loadInitialData", (req, res) => {
    weights_stats = [
        {
            "id": 1,
            "country": 'España',
            "provinces": 'Andalucia',
            "year": 2017,
            "normal_weight": 41.5,
            "overweight": 37.5,
            "obesity": 21.0
        },
        {
            "id": 2,
            "country": 'España',
            "provinces": 'Canarias',
            "year": 2017,
            "normal_weight": 43.5,
            "overweight": 37.2,
            "obesity": 19.3
        },
        {
            "id":3,
            "country": 'España',
            "provinces": 'Castilla y leon',
            "year": 2017,
            "normal_weight": 47.6,
            "overweight": 39.2,
            "obesity": 13.2
        }
    ];

    res.send(JSON.stringify(weights_stats, null, 2));
    return res.sendStatus(201);
});

//GET A UNA LISTA DE RECURSOS
app.get(BASE_API_PATH+"/table-weights-stats",(req,res)=>{
    res.send(JSON.stringify(weights_stats,null,2));
    res.sendStatus(200);
});
//POST A LA LISTA DE RECURSOS


app.post(BASE_API_PATH+"/table-weights-stats",(req,res)=>{
    if(Object.keys(req.body).length>6){
        res.status(400).json({error: 'Bad request'});
    }else{
        const id = weights_stats.length +1;
        var newStat={...req.body,id};
        console.log(`new stat added: <${JSON.stringify(newStat,null,2)}>`);
        weights_stats.push(newStat);
        res.sendStatus(201);
    }
    res.end();
});
//GET A UN RECURSO 
app.get(BASE_API_PATH+"/table-weights-stats/:id",(req,res)=>{
    const {id} = req.params;
    _.each(weights_stats,(weights_stats,i)=>{
        if(weights_stats.id==id){
            res.send(JSON.stringify(weights_stats,null,2));
        }
    });
    res.sendStatus(200);
});

//PUT A UN RECURSO
app.put(BASE_API_PATH+"/table-weights-stats/:id",(req,res)=>{
    const {id} = req.params;
    const {country,provinces,year,normal_weight,overweight, obesity}=req.body;
    if(country&&provinces&&year&&normal_weight&&overweight&&obesity){
        _.each(weights_stats,(weights_stats,i)=>{
            if(weights_stats.id==id){
                weights_stats.country=country;
                weights_stats.provinces=provinces;
                weights_stats.year=year;
                weights_stats.normal_weight=normal_weight;
                weights_stats.overweight=overweight;
                weights_stats.obesity=obesity;
            }
        });
        res.json(weights_stats);
        res.status(200);
    
    }else{
        res.status(500).json({error: 'There was an error.'});
    }
});
//DELETE A UN RECURSO
app.delete(BASE_API_PATH+"/table-weights-stats/:id",(req,res)=>{
    const {id} = req.params;
    _.each(weights_stats,(weights_stats,i)=>{
        if(weights_stats.id==id){
            weights_stats.splice(i,1);
            res.send(weights_stats);
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    });
});

//DELETE A LISTA DE RECURSOS
app.delete(BASE_API_PATH+"/table-weights-stats/",(req,res)=>{
    weights_stats.splice(0, weights_stats.length);
    //Envio de recurso actualizado
    res.send(weights_stats);
    res.sendStatus(200);
});
//PUT A UNA LISTA DE RECURSOS (Debe dar error)
app.put(BASE_API_PATH+"/table-weights-stats",(req,res)=>{
    res.sendStatus(405);
});
//POST A UN RECURSO (Debe dar error)
app.post(BASE_API_PATH+"/table-weights-stats",(req,res)=>{
    res.sendStatus(405);
});

//~~~~~~~~~~~~~~~~~~~ END: API REST WEIGHTS-STATS ~~~~~~~~~~~~~~~~~~~~~~~~




//~~~~~~~~~~~~~~~~~~~~~~~~ API REST LIFE-EXPECTANCY-STATS ~~~~~~~~~~~~~~~~~~~~~~~~


var lifeExpectancyStats=[];
 
app.get(BASE_API_PATH+"/life-expectancy-stats/loadInitialData",(req,res)=>{
    lifeExpectancyStats=[
        {
            "id":1,
            "country":"España",
            "province":"Andalucia",
            "year":"2017",
            "lifeExpectancyWoman":"84,41",
            "lifeExpentancyMan":"79,23",
            "averageLifeExpectancy":"81,63"
        },
        {
            "id":2,
            "country":"España",
            "province":"Aragón",
            "year":"2017",
            "lifeExpectancyWoman":"86,06",
            "lifeExpentancyMan":"80,43",
            "averageLifeExpectancy":"83,23"
        },
        {
            "id":3,
            "country":"España",
            "province":"Asturias",
            "year":"2017",
            "lifeExpectancyWoman":"85,51",
            "lifeExpentancyMan":"79,50",
            "averageLifeExpectancy":"82,58"
        }
    ];
    res.send(JSON.stringify(lifeExpectancyStats,null,2));
});

//GET A UNA LISTA DE RECURSOS
app.get(BASE_API_PATH+"/life-expectancy-stats",(req,res)=>{
    res.send(JSON.stringify(lifeExpectancyStats,null,2));
    res.sendStatus(200);
});
//POST A LA LISTA DE RECURSOS
app.post(BASE_API_PATH+"/life-expectancy-stats",(req,res)=>{
    const id = lifeExpectancyStats.length +1;
    var newStat={...req.body,id};
    console.log(`new stat added: <${JSON.stringify(newStat,null,2)}>`);
    lifeExpectancyStats.push(newStat);
    res.sendStatus(201);
});
//GET A UN RECURSO 
app.get(BASE_API_PATH+"/life-expectancy-stats/:id",(req,res)=>{
    const {id} = req.params;
    _.each(lifeExpectancyStats,(lifeExpectancyStats,i)=>{
        if(lifeExpectancyStats.id==id){
            res.send(JSON.stringify(lifeExpectancyStats,null,2));
        }
    });
    res.sendStatus(200);
});


//DELETE A UN RECURSO
app.delete(BASE_API_PATH+"/life-expectancy-stats/:id",(req,res)=>{
    const {id} = req.params;
    _.each(lifeExpectancyStats,(lifeExpectancyStats,i)=>{
        if(lifeExpectancyStats.id==id){
            lifeExpectancyStats.splice(i,1);
            res.send(lifeExpectancyStats);
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    });
});

//PUT A UN RECURSO
app.put(BASE_API_PATH+"/life-expectancy-stats/:id",(req,res)=>{
    const {id} = req.params;
    const {country,province,year,lifeExpectancyWoman,lifeExpentancyMan,averageLifeExpectancy}=req.body;
    if(country&&province&&year&&lifeExpectancyWoman&&lifeExpentancyMan&&averageLifeExpectancy){
        _.each(lifeExpectancyStats,(lifeExpectancyStats,i)=>{
            if(lifeExpectancyStats.id==id){
                lifeExpectancyStats.province=country;
                lifeExpectancyStats.province=province;
                lifeExpectancyStats.year=year;
                lifeExpectancyStats.lifeExpectancyWoman=lifeExpectancyWoman;
                lifeExpectancyStats.lifeExpentancyMan=lifeExpentancyMan;
                lifeExpectancyStats.averageLifeExpectancy=averageLifeExpectancy;
            }
        });
        //Envio de recurso actualizado
        res.json(lifeExpectancyStats);
        res.status(200);
    
    }else{
        res.status(500).json({error: 'There was an error.'})
    }
});


//POST A UN RECURSO (Debe dar error)
app.post(BASE_API_PATH+"/life-expectancy-stats/:id",(req,res)=>{
    res.sendStatus(405);
});


//PUT A UNA LISTA DE RECURSOS (Debe dar error)
app.put(BASE_API_PATH+"/life-expectancy-stats/",(req,res)=>{
    res.sendStatus(405);
});

//DELETE A LISTA DE RECURSOS
app.delete(BASE_API_PATH+"/life-expectancy-stats/",(req,res)=>{
    lifeExpectancyStats.splice(0, lifeExpectancyStats.length);
    //Envio de recurso actualizado
    res.send(lifeExpectancyStats);
    res.sendStatus(200);
});

//~~~~~~~~~~~~~~~~~~~ END: API LIFE-EXPECTANCY-STATS ~~~~~~~~~~~~~~~~~~~~~~~~