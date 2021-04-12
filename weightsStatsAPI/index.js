//~~~~~~~~~~~~~~~~~~~~~~~~ API REST WEIGHTS-STATS ~~~~~~~~~~~~~~~~~~~~~~~~

var BASE_API_PATH2 = "/api/v1/table-weights-stats";
var weights_stats = [];

module.exports.register = (app, BASE_API_PATH) => {
    //5.2 - GET loadInitialData
    app.get(BASE_API_PATH2 + "/loadInitialData", (req, res) => {
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
    app.get(BASE_API_PATH2, (req, res) => {
        res.send(JSON.stringify(weights_stats, null, 2));
        res.sendStatus(200);
    });

    //6.2 - POST a la lista de recursos
    app.post(BASE_API_PATH2, (req, res) => {
        const id = weights_stats.length + 1;

        var newStat = { ...req.body, id };

        var newStat = { ...req.body, id };
        console.log(`new stat added: <${JSON.stringify(newStat, null, 2)}>`);
        weights_stats.push(newStat);
        res.sendStatus(201);
    });

    //6.3 - GET a un recurso 
    app.get(BASE_API_PATH2 + "/:id", (req, res) => {
        const { id } = req.params;
        _.each(weights_stats, (weights_stats, i) => {
            if (weights_stats.id == id) {
                res.send(JSON.stringify(weights_stats, null, 2));
            }
        });
        res.sendStatus(200);
    });

    //6.4 - DELETE a un recurso
    app.delete(BASE_API_PATH2 + "/:id", (req, res) => {
        var id = req.params.id;

        for (var i = 0; i < weights_stats.length; i++) {
            if (weights_stats[i].id == id) {
                weights_stats.splice(i, 1);
                return res.sendStatus(200);
            }
        }
        res.sendStatus(404);
    });

    //6.5 - PUT a un recurso
    app.put(BASE_API_PATH2 + "/:id", (req, res) => {
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
            res.status(500).json({ error: 'There was an error.' });
        }
    });

    //6.6 - POST a un recurso (Debe dar error)
    app.post(BASE_API_PATH2 + "/:id", (req, res) => {
        res.sendStatus(405);
    });

    //6.7 - PUT a la lista de recursos (Debe dar error)
    app.put(BASE_API_PATH2, (req, res) => {
        res.sendStatus(405);
    });

    //6.8 - DELETE a la lista de recursos
    app.delete(BASE_API_PATH2, (req, res) => {
        weights_stats.splice(0, weights_stats.length);
        //Envio de recurso actualizado
        res.send(weights_stats);
        res.sendStatus(200);
    });
};

//~~~~~~~~~~~~~~~~~~~ END: API REST WEIGHTS-STATS ~~~~~~~~~~~~~~~~~~~~~~~~