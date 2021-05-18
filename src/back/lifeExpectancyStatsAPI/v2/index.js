var _= require("underscore");
var Datastore = require("nedb");
const { sortBy } = require("underscore");

var db = new Datastore();

var BASE_API_PATH = "/api/v2/life-expectancy-stats";

var lifeExpectancyStats = [];

 
module.exports.register = (app) => {
    


    app.get(BASE_API_PATH+"/loadInitialData",(req,res)=>{


        lifeExpectancyStats=[
            {
                "country":"España",
                "province":"Andalucía",
                "year":2017,
                "lifeExpectancyWoman":84.41,
                "lifeExpectancyMan":79.23,
                "averageLifeExpectancy":81.63
            },
            {
                "country":"España",
                "province":"Aragón",
                "year":2017,
                "lifeExpectancyWoman":86.06,
                "lifeExpectancyMan":80.43,
                "averageLifeExpectancy":83.23
            },
            {
                "country":"España",
                "province":"Asturias",
                "year":2017,
                "lifeExpectancyWoman":85.51,
                "lifeExpectancyMan":79.50,
                "averageLifeExpectancy":82.58
            },
            {
                "country":"España",
                "province":"Cantabria",
                "year":2017,
                "lifeExpectancyWoman":86.22,
                "lifeExpectancyMan":80.34,
                "averageLifeExpectancy":83.33
            },
            {
                "country":"España",
                "province":"Ceuta",
                "year":2017,
                "lifeExpectancyWoman":82.11,
                "lifeExpectancyMan":76.65,
                "averageLifeExpectancy":79.31
            },
            {
                "country":"España",
                "province":"Castilla y León",
                "year":2017,
                "lifeExpectancyWoman":86.51,
                "lifeExpectancyMan":81.18,
                "averageLifeExpectancy":83.82
            },            {
                "country":"España",
                "province":"Castilla La Mancha",
                "year":2017,
                "lifeExpectancyWoman":85.56,
                "lifeExpectancyMan":80.53,
                "averageLifeExpectancy":83.01
            },
            {
                "country":"España",
                "province":"Canarias",
                "year":2017,
                "lifeExpectancyWoman":84.79,
                "lifeExpectancyMan":80.00,
                "averageLifeExpectancy":82.39
            },
            {
                "country":"España",
                "province":"Cataluña",
                "year":2017,
                "lifeExpectancyWoman":86.01,
                "lifeExpectancyMan":80.53,
                "averageLifeExpectancy":83.33
            },
            {
                "country":"España",
                "province":"Extremadura",
                "year":2017,
                "lifeExpectancyWoman":85.03,
                "lifeExpectancyMan":79.53,
                "averageLifeExpectancy":82.24
            },
            {
                "country":"España",
                "province":"Galicia",
                "year":2017,
                "lifeExpectancyWoman":85.90,
                "lifeExpectancyMan":80.15,
                "averageLifeExpectancy":83.07
            },
            {
                "country":"España",
                "province":"Islas Baleares",
                "year":2017,
                "lifeExpectancyWoman":85.44,
                "lifeExpectancyMan":80.36,
                "averageLifeExpectancy":82.90
            },
            {
                "country":"España",
                "province":"Murcia",
                "year":2017,
                "lifeExpectancyWoman":85.03,
                "lifeExpectancyMan":79.80,
                "averageLifeExpectancy":82.41
            },
            {
                "country":"España",
                "province":"Comunidad de Madrid",
                "year":2017,
                "lifeExpectancyWoman":86.81,
                "lifeExpectancyMan":81.91,
                "averageLifeExpectancy":84.53
            },
            {
                "country":"España",
                "province":"Melilla",
                "year":2017,
                "lifeExpectancyWoman":82.78,
                "lifeExpectancyMan":77.82,
                "averageLifeExpectancy":80.28
            },
            {
                "country":"España",
                "province":"Navarra",
                "year":2017,
                "lifeExpectancyWoman":86.56,
                "lifeExpectancyMan":81.07,
                "averageLifeExpectancy":83.52
            },
            {
                "country":"España",
                "province":"País Vasco",
                "year":2017,
                "lifeExpectancyWoman":86.35,
                "lifeExpectancyMan":80.58,
                "averageLifeExpectancy":83.54
            },
            {
                "country":"España",
                "province":"La Rioja",
                "year":2017,
                "lifeExpectancyWoman":86.32,
                "lifeExpectancyMan":80.90,
                "averageLifeExpectancy":83.60
            },
            {
                "country":"España",
                "province":"Comunidad Valenciana",
                "year":2017,
                "lifeExpectancyWoman":85.09,
                "lifeExpectancyMan":79.90,
                "averageLifeExpectancy":82.50
            }
        ];

        db.remove({}, { multi: true }, function (err, numRemoved) {
        });
        db.insert(lifeExpectancyStats);
        res.send(JSON.stringify(lifeExpectancyStats,null,2));
    });



    //GET A LA LISTA DE RECURSOS 
    app.get(BASE_API_PATH, (req,res)=>{
		var query = req.query;
        var limit = parseInt(query.limit);
        var offset = parseInt(query.offset);
        var dbquery = {};

		if(req.query.country) dbquery["country"]= req.query.country;
        if(req.query.province) dbquery["province"]= req.query.province;
		if(req.query.year) dbquery["year"] = parseInt(req.query.year);
		if(req.query.lifeExpectancyWoman) dbquery["lifeExpectancyWoman"] = parseFloat(req.query.lifeExpectancyWoman);
		if(req.query.lifeExpectancyMan) dbquery["lifeExpectancyMan"] = parseFloat(req.query.lifeExpectancyMan);
		if(req.query.averageLifeExpectancy) dbquery["averageLifeExpectancy"] = parseFloat(req.query.averageLifeExpectancy);	
		
		db.find(dbquery).sort({province:1,year:-1}).skip(offset).limit(limit).exec((error, life) =>{

			life.forEach((t)=>{
				delete t._id
			});

			res.send(JSON.stringify(life,null,2));
			console.log("The GET REQUEST have been send");
		});
    
    });



    //POST A LA LISTA DE RECURSOS

    app.post(BASE_API_PATH, (req,res)=>{
        var newLifeStat = req.body;

        console.log(`new stat to be added: <${JSON.stringify(newLifeStat,null,2)}>`);
        if(Object.keys(newLifeStat).length!=6){
            console.log("Bad Request");
            res.sendStatus(400);
        }else{
        db.find({province : newLifeStat.province,year : newLifeStat.year},(err, lifeExpectancyStatsInDB)=>{
            if(err){
                console.error("ERROR accesing DB in POST: " + err);
                res.sendStatus(500);
            }else{
                if(lifeExpectancyStatsInDB.length == 0){
                    console.log("Inserting new life expectancy stat in db:"+ JSON.stringify(newLifeStat,null,2));
                    db.insert(newLifeStat);
                    res.sendStatus(201);
                }else{
                    res.sendStatus(409);
                }
               
            }
        });
      }
    });
 
        //DELETE A LA LISTA DE RECURSOS
        app.delete(BASE_API_PATH,(req,res)=>{
            db.remove({}, { multi: true },(err, numRemoved)=>{
                if (err) {
                    console.error("ERROR deleting DB stats in DELETE");
                    res.sendStatus(500);
                } else {
                    if (numRemoved == 0) {
                        console.error("ERROR stats not found");
                        res.sendStatus(404);
                    } else {
                        res.sendStatus(200);
                    }
                }
            });
        });




        





    //GET A RECURSO /province/year
    app.get(BASE_API_PATH+"/:province/:year",(req,res)=>{

        var provinceToGet = req.params.province;
        var yearToGet = parseInt(req.params.year);

        db.find({$and: [{ province: provinceToGet }, { year: yearToGet }]},(err, lifeExpectancyStatsInDB)=>{
            if(err){
                console.log("ERROR getting DB stat in GET: "+ err);
                res.sendStatus(500);
            }else {
                if (lifeExpectancyStatsInDB.length == 0) {
                    console.error("No data found");
                    res.sendStatus(404);
                } else {
                    var lifeStatsToSend = lifeExpectancyStatsInDB.map((l)=>{
                        return{country : l.country,
                            province : l.province, 
                            year : l.year,
                            lifeExpectancyWoman : l.lifeExpectancyWoman,
                            lifeExpectancyMan : l.lifeExpectancyMan,
                            averageLifeExpectancy : l.averageLifeExpectancy};
                    });
                    res.status(200).send(JSON.stringify(lifeStatsToSend[0], null, 2));
                }
            }
            
        });
    });

    //PUT A RECURSO /province/year

    app.put(BASE_API_PATH+"/:province/:year",(req,res)=>{

        var provinceToGet = req.params.province;
        var yearToGet = parseInt(req.params.year);
        var newLifeStat = req.body;

        if(Object.keys(newLifeStat).length!=6){
            res.status(400).json({error: 'Bad request'});
        }else{
            db.update({$and: [{ province: provinceToGet }, { year: yearToGet }]} ,{$set:newLifeStat},{},(err, lifeExpectancyStatsInDB)=>{
                if(err){
                    console.log("Error accessing DB in GET: "+ err);
                    res.sendStatus(500);
                }else{
                    if (lifeExpectancyStatsInDB.length == 0) {
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

    //DELETE A RECURSO /province/year

    app.delete(BASE_API_PATH+"/:province/:year",(req,res)=>{
        var provinceToBeDeleted = req.params.province;
        var yearToBeDeleted = parseInt(req.params.year);

        db.remove({province : provinceToBeDeleted,year : yearToBeDeleted},{multi:true},(err,numStatsRemoved)=>{
            if(err){
                console.error("ERROR deleting DB stat in DELETE:" + err);
                res.sendStatus(500);
            }else{
                if(numStatsRemoved == 0){
                    res.sendStatus(404);
                }else{
                    res.sendStatus(200);
                }
            }
        });

    })

    //POST  A RECURSO /province/year (Debe dar error)
    app.post(BASE_API_PATH+"/:province/:year",(req,res)=>{
        res.sendStatus(405);
    });


    //PUT A LA LISTA DE RECURSOS (Debe dar error)
    app.put(BASE_API_PATH,(req,res)=>{
        res.sendStatus(405);
    });


};