var _= require("underscore");
var Datastore = require("nedb");
const { sortBy } = require("underscore");

var db = new Datastore();

var BASE_API_PATH = "/api/v1/life-expectancy-stats";

var lifeExpectancyStats = [];

 
module.exports.register = (app) => {
    


    app.get(BASE_API_PATH+"/loadInitialData",(req,res)=>{


        lifeExpectancyStats=[
            {
                "country":"España",
                "province":"Andalucia",
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
        ];

        db.remove({}, { multi: true }, function (err, numRemoved) {
        });
        db.insert(lifeExpectancyStats);
        res.send(JSON.stringify(lifeExpectancyStats,null,2));
    });


    //GET PAGINACION + BÚSQUEDA
    app.get(BASE_API_PATH , (req, res) =>{
        console.log("NEW GET OF SPECIFIC RESOURCE WITH SPECIFIC FIELDS: ")
        
        var query = req.query;	
        
        var offset = req.query.offset;	
        var limit = req.query.limit;	
        
        delete req.query.offset;
        delete req.query.limit;
        
        var country = req.query.country;
        var province = req.query.province;
        var year = req.query.year;
        var lifeExpectancyWoman = req.query.lifeExpectancyWoman;
        var lifeExpectancyMan = req.query.lifeExpectancyMan;
        var averageLifeExpectancy = req.query.averageLifeExpectancy;
        
        
        if(query.hasOwnProperty("country")){
            query.country = query.country;
        }
        if(query.hasOwnProperty("province")){
            query.province = query.province;
        }
        if(query.hasOwnProperty("year")){
            query.year = parseInt(query.year);
        }
        if(query.hasOwnProperty("lifeExpectancyWoman")){
            query.lifeExpectancyWoman = parseFloat(query.lifeExpectancyWoman);
        }
        if(query.hasOwnProperty("lifeExpectancyMan")){
            query.lifeExpectancyMan = parseFloat(query.lifeExpectancyMan);
        }
        if(query.hasOwnProperty("averageLifeExpectancy")){
            query.averageLifeExpectancy = parseFloat(query.averageLifeExpectancy);
        }
        

            db.find(query).skip(offset).limit(limit).exec((err, lifeExpectancyStatsInDB) =>{
                
                lifeExpectancyStatsInDB.forEach( (c) =>{ 
                delete c._id;
                });
                
                
                if(lifeExpectancyStatsInDB.length < 1){	
                     res.status(404).send("Not found");
                    console.log("Failed to make request");
                }
                else {	
                        
                    res.send(JSON.stringify(lifeExpectancyStatsInDB, null, 2));
                    console.log("Data Sent: "+JSON.stringify(lifeExpectancyStatsInDB, null, 2));
                }
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
        var yearToGet = req.params.year;

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
        var yearToGet = req.params.year;
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
        var yearToBeDeleted = req.params.year;

        db.remove({province : provinceToBeDeleted,year : yearToBeDeleted},{},(err,numStatsRemoved)=>{
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




    //Metodos no DB

/*
    //GET A UNA LISTA DE RECURSOS
        app.get(BASE_API_PATH,(req,res)=>{
            res.send(JSON.stringify(lifeExpectancyStats,null,2));
            res.sendStatus(200);
        });
    //POST A LA LISTA DE RECURSOS
        app.post(BASE_API_PATH,(req,res)=>{
            const id = lifeExpectancyStats.length +1;
            var newStat={...req.body,id};
            console.log(`new stat added: <${JSON.stringify(newStat,null,2)}>`);
            lifeExpectancyStats.push(newStat);
            res.sendStatus(201);
        });
    //GET A UN RECURSO 
        app.get(BASE_API_PATH+"/:province/:year",(req,res)=>{
            const {province,year} = req.params;
            console.log(province);
            console.log(year);
            _.each(lifeExpectancyStats,(lifeExpectancyStats,i)=>{
                if(lifeExpectancyStats.province==province && lifeExpectancyStats.year==year){
                    res.send(JSON.stringify(lifeExpectancyStats,null,2));
                    res.sendStatus(200);
                }else{
                    res.sendStatus(404);
                }
            });
            
        });


    //DELETE A UN RECURSO
        app.delete(BASE_API_PATH +"/:province/:year", (req, res) =>{ 
            const {province,year} = req.params;

            for (var i = 0; i <  lifeExpectancyStats.length; i++){
                if(lifeExpectancyStats[i].province == province && lifeExpectancyStats[i].year == year){
                    lifeExpectancyStats.splice(i,1);
                    return res.sendStatus(200);
                }
            }
            res.sendStatus(404);
        });

    //PUT A UN RECURSO
        app.put(BASE_API_PATH+"/:province/:year",(req,res)=>{
            const {province,year} = req.params;
            const {country,provinceData,yearData,lifeExpectancyWoman,lifeExpentancyMan,averageLifeExpectancy}=req.body;
                for (var i = 0; i <  lifeExpectancyStats.length; i++){
                    if(lifeExpectancyStats[i].province==province && lifeExpectancyStats[i].year==year){
                        lifeExpectancyStats[i].country=country;
                        lifeExpectancyStats[i].province=province;
                        lifeExpectancyStats[i].year=year;
                        lifeExpectancyStats[i].lifeExpectancyWoman=lifeExpectancyWoman;
                        lifeExpectancyStats[i].lifeExpentancyMan=lifeExpentancyMan;
                        lifeExpectancyStats[i].averageLifeExpectancy=averageLifeExpectancy;

                        //Envio de recurso actualizado
                        res.json(lifeExpectancyStats);
                        res.status(200);
                    }else{
                        res.status(500).json({error: 'There was an error.'});
                    }
                }

            
                
            
        });

        app.put(BASE_API_PATH+"/:id",(req,res)=>{
            const {id} = req.params;
            const {country,province,year,lifeExpectancyWoman,lifeExpentancyMan,averageLifeExpectancy}=req.body;
            if(country&&province&&year&&lifeExpectancyWoman&&lifeExpentancyMan&&averageLifeExpectancy){
                _.each(lifeExpectancyStats,(lifeExpectancyStats,i)=>{
                    if(lifeExpectancyStats.id==id){
                        lifeExpectancyStats.country = country;
                        lifeExpectancyStats.province = province;
                        lifeExpectancyStats.year = year;
                        lifeExpectancyStats.lifeExpectancyWoman = lifeExpectancyWoman;
                        lifeExpectancyStats.lifeExpentancyMan = lifeExpentancyMan;
                        lifeExpectancyStats.averageLifeExpectancy = averageLifeExpectancy;
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
        app.post(BASE_API_PATH+"/:province/:year",(req,res)=>{
            res.sendStatus(405);
        });


    //PUT A UNA LISTA DE RECURSOS (Debe dar error)
        app.put(BASE_API_PATH,(req,res)=>{
            res.sendStatus(405);
        });

    //DELETE A LISTA DE RECURSOS
        app.delete(BASE_API_PATH,(req,res)=>{
            lifeExpectancyStats.splice(0, lifeExpectancyStats.length);
            //Envio de recurso actualizado
            res.send(lifeExpectancyStats);
            res.sendStatus(200);
        });

*/

};