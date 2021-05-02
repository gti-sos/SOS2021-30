var _= require("underscore");
var Datastore = require("nedb");
var db = new Datastore();

var BASE_API_PATH = "/api/v1/smokers-stats";

module.exports.register = (app) => {

/*--------------Variable Objeto-----------------------*/
    smokersStats=[
        {   
            "country": "España",
            "province":"Andalucía",
            "year":2017,
            "dailySmoker": 1902219.14,
            "ocasionalSmoker": 260612.40,
            "exSmoker": 242773.13,
            "nonSmoker": 4294657.75
        },
        {
            "country": "España",
            "province":"Aragón",
            "year":2017,
            "dailySmoker": 315408.75,
            "ocasionalSmoker": 18846.00,
            "exSmoker": 274678.38,
            "nonSmoker": 603988.13
        },
        {
            "country": "España",
            "province":"Asturias (Principado De)",
            "year":2017,
            "dailySmoker": 246320.48,
            "ocasionalSmoker": 45124.26,
            "exSmoker": 220967.80,
            "nonSmoker": 559602.87
        },
        {
            "country": "España",
            "province": "Cantabria",
            "year": 2017,
            "dailySmoker": 132887.56,
            "ocasionalSmoker": 4526.30,
            "exSmoker": 541681.36,
            "nonSmoker": 307382.26
        },
        {
            "country": "España",
            "province":"Castilla y León",
            "year":2017,
            "dailySmoker": 550656.83,
            "ocasionalSmoker": 72774.03,
            "exSmoker": 465208.69,
            "nonSmoker": 1244193.33
        },
        {
            "country": "España",
            "province":"Castilla-La Mancha",
            "year":2017,
            "dailySmoker": 499743.83,
            "ocasionalSmoker": 55865.67,
            "exSmoker": 1294313.68,
            "nonSmoker": 1129502.32
        },
        {
            "country": "España",
            "province":"Cataluña",
            "year":2017,
            "dailySmoker": 1700061.75,
            "ocasionalSmoker": 174539.67,
            "exSmoker": 994231.61,
            "nonSmoker": 4125483.18
        },
        {
            "country": "España",
            "province":"Comunidad Valenciana",
            "year":2017,
            "dailySmoker": 1225494.23,
            "ocasionalSmoker": 123043.57,
            "exSmoker": 220519.66,
            "nonSmoker": 2447035.26
        },
        {
            "country": "España",
            "province":"Extremadura",
            "year":2017,
            "dailySmoker": 258100.88,
            "ocasionalSmoker": 30885.71,
            "exSmoker": 524605.26,
            "nonSmoker": 573221.54
        },
        {
            "country": "España",
            "province":"Galicia",
            "year":2017,
            "dailySmoker": 482084.34,
            "ocasionalSmoker": 108333.56,
            "exSmoker": 1068479.61,
            "nonSmoker": 1606045.03
        },
        {
            "country": "España",
            "province":"Madrid (Comunidad De)",
            "year":2017,
            "dailySmoker": 1236364.96,
            "ocasionalSmoker": 211483.48,
            "exSmoker": 304346.51,
            "nonSmoker": 3586109.10
        },
        {
            "country": "España",
            "province":"Navarra (Comunidad Foral De)",
            "year":2017,
            "dailySmoker": 131219.74,
            "ocasionalSmoker": 16788.41,
            "exSmoker": 308937.45,
            "nonSmoker": 385747.43
        },
        {
            "country": "España",
            "province":"País Vasco",
            "year":2017,
            "dailySmoker": 434443.28,
            "ocasionalSmoker": 83816.84,
            "exSmoker": 74051.46,
            "nonSmoker": 1083694.64
        }
    ];

    //Inserta
    function ordenar(array, key) {
        array.sort(function (a, b) {
           return a[key] > b[key];
        });
    }
    db.insert(ordenar(smokersStats, "province"));
/*--------------------fin constructor-----------------------*/

    //GET inicial (loadInitialData) para inicializar la BD (constructor)
    app.get(BASE_API_PATH+"/loadInitialData",(req,res)=>{
    smokersStatsIni=[
        {   
            "country": "España",
            "province":"Andalucía",
            "year":2017,
            "dailySmoker": 1902219.14,
            "ocasionalSmoker": 260612.40,
            "exSmoker": 242773.13,
            "nonSmoker": 4294657.75
        },
        {
            "country": "España",
            "province":"Aragón",
            "year":2017,
            "dailySmoker": 315408.75,
            "ocasionalSmoker": 18846.00,
            "exSmoker": 274678.38,
            "nonSmoker": 603988.13
        },
        {
            "country": "España",
            "province":"Asturias (Principado De)",
            "year":2017,
            "dailySmoker": 246320.48,
            "ocasionalSmoker": 45124.26,
            "exSmoker": 220967.80,
            "nonSmoker": 559602.87
        },
        {
            "country": "España",
            "province": "Cantabria",
            "year": 2017,
            "dailySmoker": 132887.56,
            "ocasionalSmoker": 4526.30,
            "exSmoker": 541681.36,
            "nonSmoker": 307382.26
        },
        {
            "country": "España",
            "province":"Castilla y León",
            "year":2017,
            "dailySmoker": 550656.83,
            "ocasionalSmoker": 72774.03,
            "exSmoker": 465208.69,
            "nonSmoker": 1244193.33
        },
        {
            "country": "España",
            "province":"Castilla-La Mancha",
            "year":2017,
            "dailySmoker": 499743.83,
            "ocasionalSmoker": 55865.67,
            "exSmoker": 1294313.68,
            "nonSmoker": 1129502.32
        },
        {
            "country": "España",
            "province":"Cataluña",
            "year":2017,
            "dailySmoker": 1700061.75,
            "ocasionalSmoker": 174539.67,
            "exSmoker": 994231.61,
            "nonSmoker": 4125483.18
        },
        {
            "country": "España",
            "province":"Comunidad Valenciana",
            "year":2017,
            "dailySmoker": 1225494.23,
            "ocasionalSmoker": 123043.57,
            "exSmoker": 220519.66,
            "nonSmoker": 2447035.26
        },
        {
            "country": "España",
            "province":"Extremadura",
            "year":2017,
            "dailySmoker": 258100.88,
            "ocasionalSmoker": 30885.71,
            "exSmoker": 524605.26,
            "nonSmoker": 573221.54
        },
        {
            "country": "España",
            "province":"Galicia",
            "year":2017,
            "dailySmoker": 482084.34,
            "ocasionalSmoker": 108333.56,
            "exSmoker": 1068479.61,
            "nonSmoker": 1606045.03
        },
        {
            "country": "España",
            "province":"Madrid (Comunidad De)",
            "year":2017,
            "dailySmoker": 1236364.96,
            "ocasionalSmoker": 211483.48,
            "exSmoker": 304346.51,
            "nonSmoker": 3586109.10
        },
        {
            "country": "España",
            "province":"Navarra (Comunidad Foral De)",
            "year":2017,
            "dailySmoker": 131219.74,
            "ocasionalSmoker": 16788.41,
            "exSmoker": 308937.45,
            "nonSmoker": 385747.43
        },
        {
            "country": "España",
            "province":"País Vasco",
            "year":2017,
            "dailySmoker": 434443.28,
            "ocasionalSmoker": 83816.84,
            "exSmoker": 74051.46,
            "nonSmoker": 1083694.64
        }
    ];

    // Inicialización base de datos
        //Borra todo lo anterior para evitar duplicidades al hacer loadInitialData
        db.remove({}, { multi: true }, function (err, numRemoved) {
        });
    // Inserta los datos iniciales en la base de datos
    db.insert(ordenar(smokersStatsIni, "province"));
       
       res.send(JSON.stringify(smokersStats,null,2));

    });

    //GET A UNA LISTA DE RECURSOS DE SMOKERS-STATS
    app.get(BASE_API_PATH, (req,res)=>{
        var query = req.query;
        var limit = parseInt(query.limit);
        var offset = parseInt(query.offset);
        var dbquery = {};

        //"Parseamos" los datos a su tipo original antes de buscar
        if (req.query.country) dbquery["country"] = req.query.country;
        if (req.query.province) dbquery["province"] = req.query.province;
        if (req.query.year) dbquery["year"] = parseInt(req.query.year);
        if (req.query.dailySmoker) dbquery["dailySmoker"] = parseFloat(req.query.dailySmoker);
        if (req.query.ocasionalSmoker) dbquery["ocasionalSmoker"] = parseFloat(req.query.ocasionalSmoker);
        if (req.query.exSmoker) dbquery["exSmoker"] = parseFloat(req.query.exSmoker);
        if (req.query.nonSmoker) dbquery["nonSmoker"] = parseFloat(req.query.nonSmoker);


        //Búsqueda de datos 
        db.find(dbquery).sort({country:1, year:-1}).skip(offset).limit(limit).exec((error, nonSmoker) => {


            //Se elimina el _id creado automáticamente
            nonSmoker.forEach((t) => {
                delete t._id
            });

            res.send(JSON.stringify(nonSmoker, null, 2));
            console.log("GET REQUEST have been sent.");
        });
    });

    //POST A LA LISTA DE RECURSOS DE SMOKERS-STATS 
    app.post(BASE_API_PATH,(req,res)=>{
        var dataNew = req.body;
        var provinceNew = req.body.province;
        var yearNew = req.body.year;
        
        
        db.find({ province: provinceNew, year: yearNew }, (err, data) => {
            if (err) {
                console.error("Error accessing DB in POST: " + err);
                res.sendStatus(500);
            } else {
                if (data.length == 0) {
                    if (!dataNew.province ||
                        !dataNew.year ||
                        !dataNew.dailySmoker ||
                        !dataNew.ocasionalSmoker ||
                        !dataNew.exSmoker ||
                        !dataNew.nonSmoker) {
                        console.log(`Number of parameters is incorrect.`);
                        return res.status(400).send("Format incorrect.");
                    }else {
                        console.log("Inserting new data in DB: " + JSON.stringify(dataNew, null, 2));
                        db.insert(dataNew);
                        return res.status(201).send("Se ha creado correctamente: " +JSON.stringify(dataNew, null, 2));
                    }
                } else {
                    console.log("Conflit is detected.");
                    res.sendStatus(409);
                }
            }
        });
    });

    //PUT A UNA LISTA DE RECURSOS DE SMOKERS STATS (Debe dar error)
    app.put(BASE_API_PATH,(req,res) => {
        res.sendStatus(405);
    });

    //DELETE A LISTA DE RECURSOS DE SMOKERS STATS
    app.delete(BASE_API_PATH, (req,res) => {
        db.remove({}, {multi: true}, (err, numDataRemoved) => {
            if (err || numDataRemoved == 0){
                console.log("ERROR deleting DB: "+err);
                res.sendStatus(500);
            }else{
                console.log(numDataRemoved+" has been successfully deleted from the BD.");
                res.sendStatus(200);
            }
        });
    });
    
    //GET A UN RECURSO CONCRETO DE SMOKER POR PROVINCE/YEAR    
    app.get(BASE_API_PATH+"/:province/:year", (req, res) => {
        var reqprovince = req.params.province;
        var reqyear = parseInt(req.params.year);

        db.find({ province: reqprovince, year: reqyear }, { _id: 0 }, function (err, data) {
            if (err) {
                console.error("ERROR in GET: "+err);
                res.sendStatus(500);
            } else {
                if(data.length != 0){                
                console.log(`NEW GET request to <${reqprovince}>, <${reqyear}>`);
                res.status(200).send(JSON.stringify(data,null,2));
                }else{
                    console.error("Data not found");
                    res.status(404).send("Data not found in DB.");
                }

            }
        });
    });
    
    //POST A UN RECURSO DE SMOKER (No está permitido)
    app.post(BASE_API_PATH+"/:province/:year",(req,res)=>{
        res.sendStatus(405);
        console.log("Se ha intentado hacer POST a un recurso concreto.");
    });

    //PUT A UN RECURSO CONCRETO DE SMOKER POR PROVINCE/YEAR
    app.put(BASE_API_PATH+"/:province/:year",(req,res)=>{
        
        var provinceNew = req.params.province;
        var yearNew = parseInt(req.params.year);
        var dataNew = req.body;

        if (Object.keys(dataNew).length !=7 ) {
            console.log("Actualizacion de campos no valida");
            res.sendStatus(400);
        }else{
            db.update({$and: [{ province: provinceNew }, { year: yearNew }]} ,{$set:dataNew},{},(err, data)=>{
                if (err) {
                    console.log("Error accessing DB in GET: "+ err);
                    res.sendStatus(500);
                }else{
                    if (data.length == 0) {
                        console.error("No data found.");
                        res.status(404).send(`Not  found. Data is not in DB.`);
                    }else if (data == 0){
                        console.log("Data not found in DB.");
                        res.status(404).send(`Not Found. Data do not exists.`); 
                    }else {
                        console.log(`Valores del recurso actualizados.`);
                        res.status(200).send(`Se ha actualizado correctamente el recurso.`);
                    }
                }
            });
        }
    });

    //DELETE A UN RECURSO CONCRETO DE SMOKER POR PROVINCE/YEAR
    app.delete(BASE_API_PATH + "/:province/:year", (req,res)=>{
        var reqprovince = req.params.province;
        var reqyear = parseInt(req.params.year);

        db.remove({province : reqprovince, year : reqyear},{multi:true}, (err, data) => {
            if (err) {
                console.error("ERROR in GET: "+err);
                res.sendStatus(500);
            } else if (data == 0){
                console.log("Data not found in DB.");
                res.status(404).send(`Not Found. Data <${reqprovince}>, <${reqyear}> do not exists.`);
            }else {
                if(data != 0){
                    console.log(`NEW DELETE request to <${reqprovince}>, <${reqyear}>`);
                    res.status(200).send("The corresponding data for " + reqprovince + " and " + reqyear + " has been deleted.");
                }else if(data != 1){
                    console.log(`Previous error should have been detected. Deleted more than 1 data with the same attribute.`);
                    res.sendStatus(200);
                }else{
                    res.sendStatus(500); //En cualquier otro caso, habrá error.
                }
            }
        });
    });
};

/*----------------------------------------------------------------------------------------------------------------------------------------*/
/*
module.exports.register = (app) => {
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

    app.delete(BASE_API_PATH +"/smokers-stats/:id", (req, res) =>{ 
        var id = req.params.id;

        for (var i = 0; i <  smokersStats.length; i++){
    		if(smokersStats[i].id == id){
			    smokersStats.splice(i,1);
			    return res.sendStatus(200);
		    }
	    }
	    res.sendStatus(404);
    });
};
*/