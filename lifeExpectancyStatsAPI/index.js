var _= require("underscore");

var BASE_API_PATH = "/api/v1";


var lifeExpectancyStats=[];
 
module.exports.register = (app) => {
    
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
        app.get(BASE_API_PATH+"/life-expectancy-stats/:province/:year",(req,res)=>{
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
        app.delete(BASE_API_PATH +"/life-expectancy-stats/:province/:year", (req, res) =>{ 
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
        app.put(BASE_API_PATH+"/life-expectancy-stats/:province/:year",(req,res)=>{
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

        app.put(BASE_API_PATH+"/life-expectancy-stats/:id",(req,res)=>{
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
        app.post(BASE_API_PATH+"/life-expectancy-stats/:province/:year",(req,res)=>{
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

};