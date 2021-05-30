//~~~~~~~~~~~~~~~~~~~~~~~~ API REST WEIGHTS-STATS ~~~~~~~~~~~~~~~~~~~~~~~~
var _= require("underscore");
const request = require("request");
var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";

var Datastore = require("nedb");
var db = new Datastore();

var weights_stats = [];

module.exports.register = (app) => {
    //5.2 - GET loadInitialData.
    app.get(BASE_WEIGHTS_PATH + "/loadInitialData", (req, res) => {
        weights_stats = [
            {
                "id": 1,
                "country": 'España',
                "provinces": 'Andalucía',
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
                "id": 3,
                "country": 'España',
                "provinces": 'Castilla y León',
                "year": 2017,
                "normal_weight": 47.6,
                "overweight": 39.2,
                "obesity": 13.2
            },
            {
                "id": 4,
                "country": 'España',
                "provinces": 'Cataluña',
                "year": 2017,
                "normal_weight": 48.4,
                "overweight": 36.7,
                "obesity": 14.9
            },
            {
                "id": 5,
                "country": 'España',
                "provinces": 'Comunidad Valenciana',
                "year": 2017,
                "normal_weight": 45.0,
                "overweight": 36.2,
                "obesity": 18.8
            },
            {
                "id": 6,
                "country": 'España',
                "provinces": 'País Vasco',
                "year": 2017,
                "normal_weight": 50.3,
                "overweight": 35.9,
                "obesity": 13.8
            },
            {
                "id": 7,
                "country": 'España',
                "provinces": 'Aragón',
                "year": 2017,
                "normal_weight": 47.5,
                "overweight": 36.8,
                "obesity": 15.7
            },
            {
                "id": 8,
                "country": 'España',
                "provinces": 'Comunidad de Madrid',
                "year": 2017,
                "normal_weight": 48.9,
                "overweight": 35.2,
                "obesity": 15.9
            },
            {
                "id": 9,
                "country": 'España',
                "provinces": 'La Rioja',
                "year": 2017,
                "normal_weight": 47.5,
                "overweight": 37.5,
                "obesity": 15.0
            },
            {
                "id": 10,
                "country": 'España',
                "provinces": 'Asturias',
                "year": 2017,
                "normal_weight": 40.9,
                "overweight": 37.4,
                "obesity": 21.7
            },
            {
                "id": 11,
                "country": 'España',
                "provinces": 'Islas Baleares',
                "year": 2017,
                "normal_weight": 53.4,
                "overweight": 31.1,
                "obesity": 15.5
            },
            {
                "id": 12,
                "country": 'España',
                "provinces": 'Castilla La Mancha',
                "year": 2017,
                "normal_weight": 45,
                "overweight": 38.1,
                "obesity": 29.3
            },
            {
                "id": 13,
                "country": 'España',
                "provinces": 'Extremadura',
                "year": 2017,
                "normal_weight": 42.6,
                "overweight": 37.5,
                "obesity": 15.0
            },
            {
                "id": 14,
                "country": 'España',
                "provinces": 'Galicia',
                "year": 2017,
                "normal_weight": 40.2,
                "overweight": 41.4,
                "obesity": 18.4
            },
            {
                "id": 15,
                "country": 'España',
                "provinces": 'Murcia',
                "year": 2017,
                "normal_weight": 38.9,
                "overweight": 45.0,
                "obesity": 16.1
            },
            {
                "id": 16,
                "country": 'España',
                "provinces": 'Navarra',
                "year": 2017,
                "normal_weight": 49,
                "overweight": 35.6,
                "obesity": 15.4
            },
            {
                "id": 17,
                "country": 'España',
                "provinces": 'Ceuta',
                "year": 2017,
                "normal_weight": 34.5,
                "overweight": 41.4,
                "obesity": 24.1
            },
            {
                "id": 18,
                "country": 'España',
                "provinces": 'Melilla',
                "year": 2017,
                "normal_weight": 39.8,
                "overweight": 40.5,
                "obesity": 19.7
            },
            {
                "id": 19,
                "country": 'España',
                "provinces": 'Cantabria',
                "year": 2017,
                "normal_weight": 46.3,
                "overweight": 36.2,
                "obesity": 17.5
            },
            {
                "id": 20,
                "country": 'España',
                "provinces": 'Andalucía',
                "year": 2014,
                "normal_weight": 43,
                "overweight": 37.1,
                "obesity": 19.9
            },
            {
                "id": 21,
                "country": 'España',
                "provinces": 'Canarias',
                "year": 2014,
                "normal_weight": 45.3,
                "overweight": 35.4,
                "obesity": 19.3
            },
            {
                "id": 22,
                "country": 'España',
                "provinces": 'Castilla y León',
                "year": 2014,
                "normal_weight": 48.4,
                "overweight": 37.1,
                "obesity": 15.5
            },
            {
                "id": 23,
                "country": 'España',
                "provinces": 'Cataluña',
                "year": 2014,
                "normal_weight": 49.7,
                "overweight": 35.3,
                "obesity": 15
            },
            {
                "id": 24,
                "country": 'España',
                "provinces": 'Comunidad Valenciana',
                "year": 2014,
                "normal_weight": 46.2,
                "overweight": 36.5,
                "obesity": 17.3
            },
            {
                "id": 25,
                "country": 'España',
                "provinces": 'País Vasco',
                "year": 2014,
                "normal_weight": 52.6,
                "overweight": 34.4,
                "obesity": 13
            },
            {
                "id": 26,
                "country": 'España',
                "provinces": 'Aragón',
                "year": 2014,
                "normal_weight": 45.2,
                "overweight": 38.2,
                "obesity": 16.6
            },
            {
                "id": 27,
                "country": 'España',
                "provinces": 'Comunidad de Madrid',
                "year": 2014,
                "normal_weight": 53.5,
                "overweight": 31.9,
                "obesity": 14.6
            },
            {
                "id": 28,
                "country": 'España',
                "provinces": 'La Rioja',
                "year": 2014,
                "normal_weight": 50.7,
                "overweight": 34.9,
                "obesity": 14.4
            },
            {
                "id": 29,
                "country": 'España',
                "provinces": 'Asturias',
                "year": 2014,
                "normal_weight": 43.5,
                "overweight": 37.9,
                "obesity": 18.6
            },
            {
                "id": 30,
                "country": 'España',
                "provinces": 'Islas Baleares',
                "year": 2014,
                "normal_weight": 53.4,
                "overweight": 33.4,
                "obesity": 13.2
            },
            {
                "id": 31,
                "country": 'España',
                "provinces": 'Castilla La Mancha',
                "year": 2014,
                "normal_weight": 45,
                "overweight": 35.3,
                "obesity": 19.7
            },
            {
                "id": 32,
                "country": 'España',
                "provinces": 'Extremadura',
                "year": 2014,
                "normal_weight": 45.4,
                "overweight": 37.8,
                "obesity": 16.8
            },
            {
                "id": 33,
                "country": 'España',
                "provinces": 'Galicia',
                "year": 2014,
                "normal_weight": 41.3,
                "overweight": 38,
                "obesity": 20.7
            },
            {
                "id": 34,
                "country": 'España',
                "provinces": 'Murcia',
                "year": 2014,
                "normal_weight": 44.8,
                "overweight": 37.9,
                "obesity": 17.3
            },
            {
                "id": 35,
                "country": 'España',
                "provinces": 'Navarra',
                "year": 2014,
                "normal_weight": 51.2,
                "overweight": 37.1,
                "obesity": 11.7
            },
            {
                "id": 36,
                "country": 'España',
                "provinces": 'Ceuta',
                "year": 2014,
                "normal_weight": 46.8,
                "overweight": 35,
                "obesity": 18.2
            },
            {
                "id": 37,
                "country": 'España',
                "provinces": 'Melilla',
                "year": 2014,
                "normal_weight": 33.8,
                "overweight": 46.8,
                "obesity": 19.4
            },
            {
                "id": 38,
                "country": 'España',
                "provinces": 'Cantabria',
                "year": 2014,
                "normal_weight": 47.9,
                "overweight": 37,
                "obesity": 15.1
            }
        ];

        db.find({},(err, data) => {
            if (err) {
                console.error("ERROR accesing DB in GET");
                res.sendStatus(500);
            } else {
                if (data.length == 0) {
                    db.insert(weights_stats);
                    console.log(`Loaded initial data: <${JSON.stringify(weights_stats, null, 2)}>`);
                    res.sendStatus(201);
                } else {
                    console.error(`initial data already exists`);
                    res.sendStatus(409);
                }
            }
        });
    });

    //6.1 - GET a la lista de recursos
    app.get(BASE_WEIGHTS_PATH, (req,res)=>{
		var query = req.query;
        var limit = parseInt(query.limit);
        var offset = parseInt(query.offset);
        var dbquery = {};

        if(req.query.id) dbquery["id"]= parseInt(req.query.id);
		if(req.query.country) dbquery["country"]= req.query.country;
        if(req.query.provinces) dbquery["provinces"]= req.query.provinces;
		if(req.query.year) dbquery["year"] = parseInt(req.query.year);
		if(req.query.normal_weight) dbquery["normal_weight"] = parseFloat(req.query.normal_weight);
		if(req.query.overweight) dbquery["overweight"] = parseFloat(req.query.overweight);
		if(req.query.obesity) dbquery["obesity"] = parseFloat(req.query.obesity);	
		
		db.find(dbquery).sort({country:1,year:-1}).skip(offset).limit(limit).exec((error, obesity) =>{

			obesity.forEach((t)=>{
				delete t._id
			});

			res.send(JSON.stringify(obesity,null,2));
			console.log("The GET REQUEST have been send");
		});
    
 });

    //6.2 - POST a la lista de recursos
    app.post(BASE_WEIGHTS_PATH, (req, res) => {
        var newData = req.body; 
        console.log(`new data to be added: <${JSON.stringify(newData, null, 2)}>`);

        db.find({provinces : newData.provinces}, (err, dataInDB) => {
            if(err){
                console.log("ERROR accessing DB in POST: " + err);
                res.sendStatus(500);
            }else{
                if(dataInDB.length == 0){
                    console.log(`new data to be added: <${JSON.stringify(newData, null, 2)}>`);
                    db.insert(newData);
                    res.sendStatus(201);
                }
                else{
                    console.log("Ese recurso ya se encuentra en la DB");
                    res.sendStatus(409);
                }
            }
        });
    });

    //6.3 - GET a un recurso por PROVINCES/YEAR    
    app.get(BASE_WEIGHTS_PATH + "/:provinces/:year", (req,res)=>{ 	
        var reqprovinces = req.params.provinces;
        var reqyear = parseInt(req.params.year);
        db.find({provinces: reqprovinces, year:reqyear}, function(err, data) {            
            console.log(data);
            
            if (data.length==0) {               
                res.status(404).send("Data not found");        
            }else{                
            var aux = data.map((c)=>{
                return {id: c.id, country:c.country, provinces: c.provinces, year: c.year, normal_weight:c.normal_weight, overweight: c.overweight, obesity: c.obesity }
                });
                if (aux.length == 1) {
                    res.status(200).send(aux[0]);
                }else{
                    res.status(200).send(aux);
                }  
            }                
        });        
    });

    //6.4 - DELETE a un recurso por PROVINCES/YEAR
    app.delete(BASE_WEIGHTS_PATH + "/:provinces/:year", (req,res)=>{
			var reqprovinces = req.params.provinces;
			var reqyear = parseInt(req.params.year);
			db.remove({provinces : reqprovinces, year : reqyear},{multi:true}, (err, data) => {
                if (err) {
                    console.error("ERROR in GET");
                    res.sendStatus(500);
                } else {
                    if(data != 0){
                        console.log(`NEW DELETE request to <${reqprovinces}>, <${reqyear}>`);
                        res.status(200).send("The corresponding data for " + reqprovinces + " and " + reqyear + " has been deleted");
                    }else{
                        console.log("Data not found");
                        res.sendStatus(404);
                    }
                }
			});
	});

    //6.5 - PUT a un recurso por PROVINCES/YEAR 
    app.put(BASE_WEIGHTS_PATH + "/:provinces/:year", (req,res)=>{
        var reqprovinces = req.params.provinces;
        var reqyear = parseInt(req.params.year);
        var data = req.body;
        
        if (Object.keys(data).length != 5) {
            console.log("Actualizacion de campos no valida")
            res.sendStatus(400);
        } else {
            db.update({ provinces: reqprovinces, year: reqyear }, { $set: data }, {}, function (err, dataUpdate) {
                if (err) {
                    console.error("ERROR accesing DB in GET");
                    res.sendStatus(500);
                } else {
                    if (dataUpdate == 0) {
                        console.error("No data found");
                        res.sendStatus(404);
                    } else {
                        console.log("Campos actualizados")
                        res.sendStatus(200);
                    }
                }
            });
        }
    });

    //6.6 - POST a un recurso (Debe dar error)
    app.post(BASE_WEIGHTS_PATH + "/:id", (req, res) => {
        res.sendStatus(405);
    });

    //6.7 - PUT a la lista de recursos (Debe dar error)
    app.put(BASE_WEIGHTS_PATH, (req, res) => {
        res.sendStatus(405);
    });

    //6.8 - DELETE a la lista de recursos
    app.delete(BASE_WEIGHTS_PATH, (req, res) => {

        db.remove({}, {multi: true}, (err, numDataRemoved) =>{
            if(err){
                console.log("ERROR deleting DB : " + err);
                res.sendStatus(500);
            }else{
                console.log("Se han borrado " + numDataRemoved + "recursos de la BD");
                res.sendStatus(200);
            }
        });
    });

    //PROXY
    app.use("/proxyHeroku", function(req, res) {
        console.log("New proxy call");
        var apiServerHost = 'https://sos2021-26.herokuapp.com';
        var url = apiServerHost + req.url;
        console.log("piped: /proxyHeroku -> " + url);

        req.pipe(request(url)).pipe(res);
    })
};

//~~~~~~~~~~~~~~~~~~~ END: API REST WEIGHTS-STATS ~~~~~~~~~~~~~~~~~~~~~~~~

///////////////////// MÉTODOS ANTERIORES A LA DB /////////////////////

//6.2 - POST a la lista de recursos
    /*app.post(BASE_WEIGHTS_PATH, (req,res)=>{
        var newData = req.body;        
        console.log(`new data to be added: <${JSON.stringify(newData,null,2)}>`);    
        weights_stats.push(newData);    
        res.sendStatus(201);
     });

     app.post(BASE_WEIGHTS_PATH, (req, res) => {
        var newData = req.body;
        var provinces = req.body.provinces;
        var year = req.body.year;

        for (var stat of weights_stats) {
            if (stat.provinces === provinces && stat.year === year) {
                console.log("Ese recurso ya se encuentra en la lista de recursos");
                return res.sendStatus(409);
            }
        }
        if (!newData.id
            || !newData.country
            || !newData.provinces
            || !newData.year
            || !newData['normal_weight']
            || !newData['overweight']
            || !newData['obesity']
            || Object.keys(newData).length != 7) {
            console.log("Numero de parametros incorrectos");
            return res.sendStatus(400);
        } else {
            console.log(`new data to be added: <${JSON.stringify(newData, null, 2)}>`);
            db.insert(newData);
            //weights_stats.push(newData);
            return res.sendStatus(201);
        }
    });

    //6.3 - GET a un recurso por provinces/YEAR
    app.get(BASE_WEIGHTS_PATH+"/:provinces/:year", (req, res) =>{
        var provinces = req.params.provinces;       
        var year = req.params.year;
        var sendData = [];
        for(var i=0; i<weights_stats.length; i++) {
            if (weights_stats[i].provinces == provinces && weights_stats[i].year == year) {
                sendData.push(weights_stats[i]);
            }
        }
        res.send(JSON.stringify(sendData, null, 2));
        res.sendStatus(200);
    });

    //6.4 - DELETE a un recurso por ID
    app.delete(BASE_WEIGHTS_PATH + "/:id", (req, res) => {
        var id = req.params.id;

        for (var i = 0; i < weights_stats.length; i++) {
            if (weights_stats[i].id == id) {
                weights_stats.splice(i, 1);
                return res.sendStatus(200);
            }
        }
        res.sendStatus(404);
    });

    //6.4 - DELETE a un recurso por provinces/YEAR
    app.delete(BASE_WEIGHTS_PATH + "/:provinces/:year", (req, res) => {
        var provinces = req.params.provinces;
        var year = req.params.year;

        for (var i = 0; i < weights_stats.length; i++) {
            if (weights_stats[i].provinces == provinces && weights_stats[i].year == year) {
                weights_stats.splice(i, 1);
                return res.sendStatus(200);
            }
        }
        res.sendStatus(404);
    });
    
    //6.5 - PUT a un recurso por ID
    
    app.put(BASE_WEIGHTS_PATH + "/:id", (req, res) => {
        const { id } = req.params;
        const { country, provinces, year, normal_weight, overweight, obesity } = req.body;
        if (country && provinces && year && normal_weight && overweight && obesity) {
            _.each(weights_stats, (weights_stats, i) => {
                if (weights_stats.id == id) {
                    weights_stats.country = country;
                    weights_stats.provinces = provinces;
                    weights_stats.year = year;
                    weights_stats.normal_weight = normal_weight;
                    weights_stats.overweight = overweight;
                    weights_stats.obesity = obesity;
                }
            });
            res.json(weights_stats);
            res.status(200);

        } else {
            res.status(400).json({ error: 'El dato JSON no tiene exactamente la estructura de campos esperada.' });
        }
    });

    //6.5 - PUT a un recurso por provinces/YEAR    
    app.put(BASE_WEIGHTS_PATH + "/:provinces/:year", (req, res) => {
        const { provinces, year } = req.params;
        const { id, country, normal_weight, overweight, obesity } = req.body;
        if (id && country && provinces && year && normal_weight && overweight && obesity) {
            _.each(weights_stats, (weights_stats, i) => {
                if (weights_stats.provinces == provinces && weights_stats.year == year) {
                    weights_stats.id = id;
                    weights_stats.country = country;
                    weights_stats.provinces = provinces;
                    weights_stats.year = year;
                    weights_stats.normal_weight = normal_weight;
                    weights_stats.overweight = overweight;
                    weights_stats.obesity = obesity;
                }
            });
            res.json(weights_stats);
            res.status(200);

        } else {
            res.status(400).json({ error: 'El dato JSON no tiene exactamente la estructura de campos esperada.' });
        }
    });*/

