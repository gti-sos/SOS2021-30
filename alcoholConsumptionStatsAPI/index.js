var _= require("underscore");
var BASE_API_PATH = "/api/v1";

var  alcoholConsumptionStats= [];

module.exports.register = (app) => {
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
        var newIncomingStat=req.body;
        if(Object.keys(newIncomingStat).length!=6){
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
                    
                };
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
    

};