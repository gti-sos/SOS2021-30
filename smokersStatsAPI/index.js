var _= require("underscore");
var Datastore = require("nedb");
var db = new Datastore();

var BASE_API_PATH = "/api/v1";
var smokersStats = [];

module.exports.register = (app) => {

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

    db.insert(smokersStats);

    
    //GET inicial (loadInitialData) para inicializar
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

        db.find({},(err, data) => {
            if(err){
                console.error("ERROR accesing DB in GET: "+err);
                res.sendStatus(500);
            }else{
                if (data.length == 0) {
                    db.insert(smokersStats);
                    console.log(`Loaded initial data: <${JSON.stringify(smokersStats, null, 2)}>`);
                    res.sendStatus(201);
                }else{
                    console.error(`initial data already exists: `+err);
                    res.sendStatus(409);
                }
            }
        })
    });

    //GET A UNA LISTA DE RECURSOS DE SMOKERS-STATS
    app.get(BASE_API_PATH+"/smokers-stats", (req,res)=>{
        var query = req.query;
        var limit = parseInt(query.limit);
        var offset = parseInt(query.offset);
        var dbquery = {};

        //"Parseamos" los datos a su tipo original antes de buscar
        if (req.query.id) dbquery["id"] = parseInt(req.query.id);
        if (req.query.country) dbquery["country"] = parseInt(req.query.country);
        if (req.query.province) dbquery["province"] = parseInt(req.query.province);
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
            console.log("The GET REQUEST have been sent.");
        });
    });

    //POST A LA LISTA DE RECURSOS DE SMOKERS-STATS
    app.post(BASE_API_PATH+"/smokers-stats",(req,res)=>{
        var newData = req.body;
        console.log(`new data to be added: <${JSON.stringify(newData,null,2)}>`);
    
        db.find({province : newData.province}, (err, dataInDB) => {
            if (err){
                console.log("ERROR accesing DB in POST: "+err);
                res.sendStatus(500);
            }else{
                if(dataInDB.length == 0){
                    console.log(`Inserting new data in DB: <${JSON.stringify(newData,null,2)}>`);
                    db.insert(newData);
                    res.sendStatus(201);
                }else{
                    console.log("Data already exists in DB.");
                    res.sendStatus(409);
                }
            }
        })
    });

    //PUT A UNA LISTA DE RECURSOS DE SMOKERS STATS (Debe dar error)
    app.put(BASE_API_PATH+"/smokers-stats",(req,res) => {
        res.sendStatus(405);
    });

    //DELETE A LISTA DE RECURSOS DE SMOKERS STATS
    app.delete(BASE_API_PATH+"/smokers-stats", (req,res) => {
        db.remove({}, {multi: true}, (err, numDataRemoved) => {
            if (err){
                console.log("ERROR deleting DB: "+err);
                res.sendStatus(500);
            }else{
                console.log("Se ha borrado correctamente "+numDataRemoved+" recursos de la BD.");
                res.sendStatus(200);
            }
        });
    });

    //GET A UN RECURSO CONCRETO DE SMOKER POR ID
    app.get(BASE_API_PATH+"/smokers-stats/:id",(req,res)=>{
        const {id} = req.params;
        _.each(smokersStats,(smokersStats,i)=>{
            if(smokersStats.id==id){
                res.send(JSON.stringify(smokersStats,null,2));
            }
        });
        res.sendStatus(200);
    });

    //GET A UN RECURSO CONCRETO DE SMOKER POR PROVINCE/YEAR    
    app.get(BASE_API_PATH+"/smokers-stats/:province/:year", (req, res) => {
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
                    res.sendStatus(404);
                }

            }
        });
    });
    
    //POST A UN RECURSO DE SMOKER (Debe dar error)
    app.post(BASE_API_PATH+"/smokers-stats/:id",(req,res)=>{
    res.sendStatus(405);
    console.log("Se ha intentado hacer POST a un recurso concreto.");
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

    //PUT A UN RECURSO CONCRETO DE SMOKER POR PROVINCE/YEAR 
    app.put(BASE_API_PATH + "/:province/:year", (req,res)=>{
        var reqprovince = req.params.province;
        var reqyear = parseInt(req.params.year);
        var data = req.body;
        
        if (Object.keys(data).length != 8) {
            console.log("Actualizacion de campos no valida.")
            res.sendStatus(400);
        } else {
            db.update({ province: reqprovince, year: reqyear }, { $set: data }, {}, function (err, dataUpdate) {
                if (err) {
                    console.error("ERROR accesing DB in GET.");
                    res.sendStatus(500);
                } else {
                    if (dataUpdate == 0) {
                        console.error("No data found.");
                        res.sendStatus(404);
                    } else {
                        console.log("Campos actualizados.")
                        res.sendStatus(200);
                    }
                }
            });
        }
    });

    //DELETE A UN RECURSO CONCRETO DE SMOKER POR ID
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

    //DELETE A UN RECURSO CONCRETO DE SMOKER POR PROVINCE/YEAR
    app.delete(BASE_API_PATH + "/smokers-stats/:province/:year", (req,res)=>{
        var reqprovince = req.params.province;
        var reqyear = parseInt(req.params.year);

        db.remove({province : reqprovince, year : reqyear},{multi:true}, (err, data) => {
            if (err) {
                console.error("ERROR in GET: "+err);
                res.sendStatus(500);
            } else {
                if(data != 0){
                    console.log(`NEW DELETE request to <${reqprovince}>, <${reqyear}>`);
                    res.status(200).send("The corresponding data for " + reqprovince + " and " + reqyear + " has been deleted.");
                }else if(data != 1){
                    console.log(`Previous error detected. Deleted more than 1 data with the same attribute.`);
                    res.sendStatus(200);
                }else{
                    console.log("Data not found in DB.");
                    res.sendStatus(404);
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