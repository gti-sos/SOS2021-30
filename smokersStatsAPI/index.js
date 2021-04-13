

/*-----------------------------------------------SMOKERS-STATS------------------------------------------*/

var BASE_SMOKERS_API_PATH2 = "/api/v1";
var smokersStats = [];


module.exports.register = (app) => {
app.get(BASE_SMOKERS_API_PATH2+"/smokers-stats/loadInitialData",(req,res)=>{
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
app.get(BASE_SMOKERS_API_PATH2+"/smokers-stats",(req,res)=>{
    res.send(JSON.stringify(smokersStats,null,2));
    res.sendStatus(200);
});

//POST A LA LISTA DE RECURSOS DE SMOKERS-STATS
app.post(BASE_SMOKERS_API_PATH2+"/smokers-stats",(req,res)=>{
    const id = smokersStats.length +1;

    var newStat={...req.body, id};

    var newStat={...req.body,id};
    console.log(`new stat added: <${JSON.stringify(newStat,null,2)}>`);
    smokersStats.push(newStat);
    res.sendStatus(201);
});

//PUT A UNA LISTA DE RECURSOS DE SMOKERS STATS (Debe dar error)
app.put(BASE_SMOKERS_API_PATH2+"/smokers-stats",(req,res)=>{
    res.sendStatus(405);
});

//DELETE A LISTA DE RECURSOS DE SMOKERS STATS
app.delete(BASE_SMOKERS_API_PATH2+"/smokers-stats/",(req,res)=>{
    smokersStats.splice(0, smokersStats.length);
    //Envio de recurso actualizado
    res.send(smokersStats);
    res.sendStatus(200);
});


//GET A UN RECURSO CONCRETO DE SMOKER
app.get(BASE_SMOKERS_API_PATH2+"/smokers-stats/:id",(req,res)=>{
    const {id} = req.params;
    _.each(smokersStats,(smokersStats,i)=>{
        if(smokersStats.id==id){
            res.send(JSON.stringify(smokersStats,null,2));
        }
    });
    res.sendStatus(200);
});

//POST A UN RECURSO DE SMOKER (Debe dar error)
app.post(BASE_SMOKERS_API_PATH2+"/smokers-stats/:id",(req,res)=>{
    res.sendStatus(405);
});

//PUT A UN RECURSO CONCRETO DE SMOKER
app.put(BASE_SMOKERS_API_PATH2+"/smokers-stats/:id",(req,res)=>{
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

app.delete(BASE_SMOKERS_API_PATH2 +"/smokers-stats/:id", (req, res) =>{ 
    var id = req.params.id;

    for (var i = 0; i <  smokersStats.length; i++){
		if(smokersStats[i].id == id){
			smokersStats.splice(i,1);
			return res.sendStatus(200);
		}
	}
	res.sendStatus(404);
});




}