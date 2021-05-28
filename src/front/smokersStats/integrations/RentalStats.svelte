<<<<<<< HEAD
<!-- <script>

=======
<script>
>>>>>>> e3d57d6b00e06d5b16c73c44250b6051f11562c8
    import * as JSC from "jscharting";
    import { onMount } from "svelte";
    import { Alert } from "sveltestrap";
    import { pop, replace } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
    import { select_multiple_value } from "svelte/internal";

    //ALERTAS
    let visible = false;
    let color = "danger";
    var checkMSG = "";

    //Uso API grupo 05 rental-arms
    const BASE_RENTALS_API_PATH =
        "https://sos2021-07.herokuapp.com/api/v1/integration/rentals";
    const BASE_SMOKERS_PATH = "/api/v3/smokers-stats";

    //Variables SMOKER
    var smokersData = [];
    var smokerChartProvince = [];
    var smokerChartDaily = [];

    //Variables RENTAL
    var rentalData = [];
    var rentalProvince = [];
    var rentalRent = [];
    var rentalFin = [];

    //Variables globales
    var dataFin = [];

    console.log("Cargando datos...");

    //GET SMOKER
    async function getSmoker() {
        const res = await fetch(BASE_SMOKERS_PATH);
        if (res.ok) {
            smokersData = await res.json();
            console.log("Received Smokers Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de SMOKERS");
        }
    }
    //GET RENTAL
    async function getRental() {
        const res = await fetch(BASE_RENTALS_API_PATH);
        if (res.ok) {
            rentalData = await res.json();
            console.log("Received Rental Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de RENTALS");
        }
    }

    //Función auxiliar para parsear las provincias y dejarlas con el mismo formato
    String.prototype.allReplace = function (obj) {
        var retStr = this;
        for (var x in obj) {
            retStr = retStr.replace(new RegExp(x, "g"), obj[x]);
        }
        return retStr;
    };
    

    //LOAD
    async function loadGraph() {
        await getSmoker();
        await getRental();
        console.log("Nº datos smoker recibidos para pintar: " + smokersData.length);
        console.log("Nº datos rental recibidos para pintar: " + rentalData.length);

        //Gestión de datos de ambas apis y reparto en variables
        smokersData.forEach((stat) => {
            smokerChartProvince.push(stat.province);
            smokerChartDaily.push(stat["dailySmoker"] / 1000);
        });
        rentalData.forEach((stat) => {
            rentalProvince.push(stat["autonomous_community"]);
            rentalRent.push(stat["rent"]);
        });
        smokerChartProvince.sort();
        rentalProvince.sort();

        //Bucle para reemplazar las provincias
        for (var i = 0; i < rentalRent.length; i++) {
            rentalFin.push(rentalProvince[i]
                .allReplace({andalucia: "Andalucía", cataluna: "Cataluña", "castilla-y-leon": "Castilla y León", comunidad_de_madrid: "Comunidad de Madrid",}));
        }

        //Tratamiento de los datos: al final quedan todos los objetos en un array dataFin, que será la serie del gráfico
        for (var i = 0; i < smokersData.length; i++) {
            //creando el objeto e insertandolo en dataFin
            var objDaily = new Object();
            objDaily.province = smokerChartProvince[i];
            objDaily.dailySmoker = smokerChartDaily[i];
            //tras insertar en el objeto, el campo provincia y el campo dailySmoker, se busca la coincidencia con las provincias parseadas de rental
            for (var j = 0; j < rentalFin.length; j++) {
                if (objDaily.province == rentalFin[j]) {
                    objDaily.rent = parseFloat(rentalRent[j]); //si coincide, se añade el campo renta al objeto
                }
            }
            dataFin.push(objDaily);
        }

        console.log(dataFin);

        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }
        
        //Define the nest object that applies to both series    
        var nido = JSC.nest().key("province");

        //Reuse myNest with different rollup calls.
        var series = [
            JSC.merge(
                { name: "Fumadores diarios (en miles)" },
                nido.rollup("dailySmoker").series(dataFin)[0] //primera parte de la serie, dailySmoker
            ),
            JSC.merge(
                { name: "Renta en miles" },
                nido.rollup("rent").series(dataFin)[0]  //segunda parte de la serie, rent
            ),
        ];
        //Convert data to series array.
        var chart = JSC.chart("chartDiv", {
            debug: true,
            type: "column",
            title_label_text: "SmokerVSRental",
            yAxis: { label_text: "Unidades" },
            xAxis: { label_text: "Comunidad Autónoma" },
            series: series,
        });
    }

    loadGraph();
</script>

<main>
<<<<<<< HEAD
    
    <div id="chartDiv" style="width: 100%; height: 400px;">
        <p> Hola que pasa no funciona</p>
    </div>

</main> -->
=======
    <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto"/>
    <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>
</main>
>>>>>>> e3d57d6b00e06d5b16c73c44250b6051f11562c8
