var BASE_API_PATH = "/api/v1";
var Database = require("nedb");

var db = new Database();

var  alcoholConsumptionStats= [];

module.exports.register = (app) => {
    app.get(BASE_API_PATH+"/alcohol-consumption-stats/loadInitialData",(req,res)=>{

        alcoholConsumptionStats=[
            {
                "country":"España",
                "year":"2017",
                "ageRange":"0-5",
                "alcoholPrematureDeath":0,
                "prevalenceOfAlcoholUseDisorder":0.00
            },
            {
                "country":"España",
                "year":"2017",
                "ageRange":"5-14",
                "alcoholPrematureDeath":10,
                "prevalenceOfAlcoholUseDisorder":0.05
            }
        ];
        // Inicialización base de datos
        //Borra todo lo anterior para evitar duplicidades al hacer loadInitialData
        db.remove({}, { multi: true }, function (err, numRemoved) {
        });
        // Inserta los datos iniciales en la base de datos
        db.insert(alcoholConsumptionStats);
        
        res.send(JSON.stringify(alcoholConsumptionStats,null,2));
    });

    
    //GET A UNA LISTA DE RECURSOS (Funciona)
    app.get(BASE_API_PATH+"/alcohol-consumption-stats",(req,res)=>{
        var query = req.query;
        var limit = parseInt(query.limit);
        var offset = parseInt(query.offset);
        var dbquery = {};

        //Búsquedas
        if (req.query.country) dbquery["country"] = req.query.country;
        if (req.query.year) dbquery["year"] = req.query.year;
        if (req.query.ageRange) dbquery["ageRange"] = req.query.ageRange;
        if (req.query.alcoholPrematureDeath) dbquery["alcoholPrematureDeath"] = parseInt(req.query.alcoholPrematureDeath);
        if (req.query.prevalenceOfAlcoholUseDisorder) dbquery["prevalenceOfAlcoholUseDisorder"] = parseFloat(req.query.prevalenceOfAlcoholUseDisorder);

        db.find(dbquery).sort({ageRange:1}).skip(offset).limit(limit).exec((err, statsInDB) =>{

			statsInDB.forEach((t)=>{
				delete t._id
			});
			res.send(JSON.stringify(statsInDB,null,2));
			console.log("The GET REQUEST have been send");
		});

    });
    //POST A LA LISTA DE RECURSOS (Funciona)
    app.post(BASE_API_PATH+"/alcohol-consumption-stats",(req,res)=>{
        var newIncomingStat=req.body;

        console.log(`new alcohol stat to be added <${JSON.stringify(newIncomingStat,null,2)}>`);

        if(Object.keys(newIncomingStat).length!=5){
            res.status(400).json({error: 'Bad request'});
        }else{
            db.find({$and:[{country: newIncomingStat.country},{year: newIncomingStat.year},{ageRange: newIncomingStat.ageRange}]},(err,statsInDB)=>{
                if(err){
                    console.log("Error accessing DB in GET: "+ err);
                    res.sendStatus(500);
                }else{
                    if(statsInDB.length==0){
                        console.log(`Inserting new alcohol stat in db: <${JSON.stringify(newIncomingStat,null,2)}>`);
                        db.insert(newIncomingStat);
                        res.sendStatus(201); // Recurso creado
                    }else{
                        res.sendStatus(409); //Conflicto
                    }
                }
            });
        };
        
    });

    //GET A UN RECURSO (Funciona)
    app.get(BASE_API_PATH+"/alcohol-consumption-stats/:country/:year/:ageRange",(req,res)=>{

        var pais = req.params.country;
        var año = req.params.year;
        var rangoEdad = req.params.ageRange;

        db.find({$and: [{ country: pais }, { year: año },{ ageRange: rangoEdad } ]},(err, statsInDB)=>{
            if(err){
                console.log("Error accessing DB in GET: "+ err);
                res.sendStatus(500);
            }else {
                if (statsInDB.length == 0) {
                    console.error("No data found");
                    res.sendStatus(404);
                } else {
                    var statsToSend = statsInDB.map((stats)=>{
                        return{country: stats.country, year: stats.year,ageRange: stats.ageRange, alcoholPrematureDeath: stats.alcoholPrematureDeath,
                        prevalenceOfAlcoholUseDisorder: stats.prevalenceOfAlcoholUseDisorder};
                    });
                    console.log(`GET stat by country: <${pais}> , year: <${año}> and age range: <${rangoEdad}> `);
                    res.status(200).send(JSON.stringify(statsToSend[0], null, 2));
                }
            }
            
        });
    });

    
    //PUT A UN RECURSO (Funciona)
    app.put(BASE_API_PATH+"/alcohol-consumption-stats/:country/:year/:ageRange",(req,res)=>{

        var pais = req.params.country;
        var año = req.params.year;
        var rangoEdad = req.params.ageRange;
        var newIncomingStat = req.body;

        if(Object.keys(newIncomingStat).length!=5){
            res.status(400).json({error: 'Bad request'});
        }else{
            db.update({$and: [{ country: pais }, { year: año },{ ageRange: rangoEdad } ]} ,{$set:newIncomingStat},{},(err, statsInDB)=>{
                if(err){
                    console.log("Error accessing DB in GET: "+ err);
                    res.sendStatus(500);
                }else{
                    if (statsInDB.length == 0) {
                        console.error("No data found");
                        res.sendStatus(404);
                    } else {
                        console.log(`Valores del recurso actualizados`);
                        res.sendStatus(200);
                    }
                }
            });
        }
    });
    //DELETE A UN RECURSO (Funciona)
    app.delete(BASE_API_PATH+"/alcohol-consumption-stats/:country/:year/:ageRange",(req,res)=>{

        var pais = req.params.country;
        var año = req.params.year;
        var rangoEdad = req.params.ageRange;

        db.remove({ $and: [{ country: pais }, { year: año }, { ageRange: rangoEdad}] }, { multi: true }, function (err, dataDeleted) {
            if (err) {
                console.error("ERROR accesing DB in DELETE");
                res.sendStatus(500);
            } else {
                if (dataDeleted.length == 0) {
                    console.error("No data found");
                    res.sendStatus(404);
                } else {
                    console.log(`stat with country: <${pais}>, year: <${año}> and ageRange: <${rangoEdad}> deleted`);
                    res.sendStatus(200);
                }
            }
        });

    });
    
    //DELETE A LISTA DE RECURSOS (Funciona)
    app.delete(BASE_API_PATH+"/alcohol-consumption-stats/",(req,res)=>{
        db.remove({}, { multi: true },(err, numRemoved)=>{
            if (err) {
                console.error("ERROR deleting DB contacts in DELETE");
                res.sendStatus(500);
            } else {
                if (numRemoved == 0) {
                    console.error("ERROR alcohol stats not found");
                    res.sendStatus(404);
                } else {
                    res.sendStatus(200);
                }
            }
        });
    });
    //PUT A UNA LISTA DE RECURSOS (Debe dar error)
    app.put(BASE_API_PATH+"/alcohol-consumption-stats",(req,res)=>{
        res.sendStatus(405);
    });
    //POST A UN RECURSO (Debe dar error)
    app.post(BASE_API_PATH+"/alcohol-consumption-stats/:country/:year/:ageRange",(req,res)=>{
        res.sendStatus(405);
    });
};
