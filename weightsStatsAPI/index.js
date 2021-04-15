//~~~~~~~~~~~~~~~~~~~~~~~~ API REST WEIGHTS-STATS ~~~~~~~~~~~~~~~~~~~~~~~~
var _= require("underscore");
var BASE_WEIGHTS_PATH = "/api/v1/table-weights-stats";
var weights_stats = [];

module.exports.register = (app) => {
    //5.2 - GET loadInitialData
    app.get(BASE_WEIGHTS_PATH + "/loadInitialData", (req, res) => {
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
                "id": 3,
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

    //6.1 - GET a la lista de recursos
    app.get(BASE_WEIGHTS_PATH, (req, res) => {
        res.send(JSON.stringify(weights_stats, null, 2));
        res.sendStatus(200);
    });

    //6.2 - POST a la lista de recursos
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
            weights_stats.push(newData);
            return res.sendStatus(201);
        }
    });

    //6.3 - GET a un recurso por PROVINCES/YEAR     
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
    /*app.delete(BASE_WEIGHTS_PATH + "/:id", (req, res) => {
        var id = req.params.id;

        for (var i = 0; i < weights_stats.length; i++) {
            if (weights_stats[i].id == id) {
                weights_stats.splice(i, 1);
                return res.sendStatus(200);
            }
        }
        res.sendStatus(404);
    });*/

    //6.4 - DELETE a un recurso por PROVINCES/YEAR
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
    /*
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
    });*/

    //6.5 - PUT a un recurso por PROVINCES/YEAR    
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
        weights_stats.splice(0, weights_stats.length);
        //Envio de recurso actualizado
        res.send(weights_stats);
        res.sendStatus(200);
    });
};

//~~~~~~~~~~~~~~~~~~~ END: API REST WEIGHTS-STATS ~~~~~~~~~~~~~~~~~~~~~~~~