//~~~~~~~~~~~~~~~~~~~~~~~~ API REST WEIGHTS-STATS ~~~~~~~~~~~~~~~~~~~~~~~~

var BASE_WEIGHTS_STATS_PATH = ("/api/v1")
var weights_stats = [];

module.exports.register = (app) => {
//5.2 - GET loadInitialData
app.get(BASE_WEIGHTS_STATS_PATH + "/table-weights-stats/loadInitialData", (req, res) => {
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
app.get(BASE_WEIGHTS_STATS_PATH+"/table-weights-stats",(req,res)=>{
    res.send(JSON.stringify(weights_stats,null,2));
    res.sendStatus(200);
});

//POST A LA LISTA DE RECURSOS
app.post(BASE_WEIGHTS_STATS_PATH+"/table-weights-stats",(req,res)=>{
    const id = weights_stats.length +1;

    var newStat={...req.body, id};

    var newStat={...req.body,id};
    console.log(`new stat added: <${JSON.stringify(newStat,null,2)}>`);
    weights_stats.push(newStat);
    res.sendStatus(201);
});

//GET A UN RECURSO 
app.get(BASE_WEIGHTS_STATS_PATH+"/table-weights-stats/:id",(req,res)=>{
    const {id} = req.params;
    _.each(weights_stats,(weights_stats,i)=>{
        if(weights_stats.id==id){
            res.send(JSON.stringify(weights_stats,null,2));
        }
    });
    res.sendStatus(200);
});

//PUT A UN RECURSO
app.put(BASE_WEIGHTS_STATS_PATH+"/table-weights-stats/:id",(req,res)=>{
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
app.delete(BASE_WEIGHTS_STATS_PATH +"/table-weights-stats/:id", (req, res) =>{ 
    var id = req.params.id;

    for (var i = 0; i <  weights_stats.length; i++){
		if(weights_stats[i].id == id){
			weights_stats.splice(i,1);
			return res.sendStatus(200);
		}
	}
	res.sendStatus(404);
});

//DELETE A LISTA DE RECURSOS
app.delete(BASE_WEIGHTS_STATS_PATH+"/table-weights-stats/",(req,res)=>{
    weights_stats.splice(0, weights_stats.length);
    //Envio de recurso actualizado
    res.send(weights_stats);
    res.sendStatus(200);
});

//PUT A UNA LISTA DE RECURSOS (Debe dar error)
app.put(BASE_WEIGHTS_STATS_PATH+"/table-weights-stats",(req,res)=>{
    res.sendStatus(405);
});

//POST A UN RECURSO (Debe dar error)
app.post(BASE_WEIGHTS_STATS_PATH+"/table-weights-stats/:id",(req,res)=>{
    res.sendStatus(405);
});
};

//~~~~~~~~~~~~~~~~~~~ END: API REST WEIGHTS-STATS ~~~~~~~~~~~~~~~~~~~~~~~~