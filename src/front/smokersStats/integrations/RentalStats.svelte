<script>
    import * as JSC from "jscharting";
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    //ALERTAS
    let visible = false;
    let color = "danger";
    var checkMSG = "";

    //Uso API grupo 07 rentals
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
    var rentalMeter = [];
    var rentalSalary = [];
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
        //await fetch(BASE_RENTALS_API_PATH+"/loadInitialData"); //si no tiene persistencia
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
            rentalMeter.push(stat["meter"]);
            rentalSalary.push(stat["salary"]);
        });
        

        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }

        
        //Bucle para reemplazar las provincias
        for (var i = 0; i < rentalRent.length; i++) {
            rentalFin.push(rentalProvince[i]
                .allReplace({"andalucia": "Andalucía", "cataluna": "Cataluña", "castilla-y-leon": "Castilla y León", "comunidad_de_madrid": "Comunidad de Madrid",}));
        }
        

        ///////////////////////////////////////////////Tratamiento de datos
        // al final quedan todos los objetos en un array dataFin=[obj], que será la serie del gráfico
        for (var i = 0; i < smokersData.length; i++) {
            //creando el objeto e insertandolo en dataFin
            var objSerie = new Object();
            objSerie.province = smokerChartProvince[i];
            objSerie.dailySmoker = smokerChartDaily[i];
            //tras insertar en el objeto, el campo provincia y el campo dailySmoker, se busca la coincidencia con las provincias parseadas de rental
            for (var j = 0; j < rentalFin.length; j++) {
                if (objSerie.province == rentalFin[j]) {
                    objSerie.rent = parseFloat(rentalRent[j]); //si coincide, se añade el campo renta al objeto
                    objSerie.meter = parseFloat(rentalMeter[j]);
                    objSerie.salary = parseFloat(rentalSalary[j]);
                }
            }
            dataFin.push(objSerie);
        }

        console.log(dataFin);



        /////////////////////////////////GRAPH
        //Define del nido con el que se desarrolla la gráfica
        var nido = JSC.nest().key("province");

        //Reúso del nido para cada uno de los diferentes datos del objeto que se quiere mostrar (rollup calls)
        var series = [
            JSC.merge(
                { name: "Fumadores diarios (en miles)" },{color: "blue"},
                nido.rollup("dailySmoker").series(dataFin)[0] //primera parte de la serie, dailySmoker
            ),
            JSC.merge(
                { name: "Renta media" },{color: "red"},
                nido.rollup("rent").series(dataFin)[0]  //segunda parte de la serie, rent   
            ),
            JSC.merge(
                { name: "Metros de media" },{color: "yellow"},
                nido.rollup("meter").series(dataFin)[0]  //tercera parte de la serie, meter
            ),
            JSC.merge(
                { name: "Salarios medios (en miles)" },{color: "green"},
                nido.rollup("salary").series(dataFin)[0]  //cuarta parte de la serie, salary
            ),
        ];

        //Convert data to series array.
        //Convierte los datos en grafo
        var chart = JSC.chart("chartDiv", {
            debug: true,
            type: "column aqua",
            title_label_text: "SmokerVSRental",
            yAxis: { label_text: "Unidades" },
            xAxis: { label_text: "Comunidad Autónoma" },
            series: series,
        });
    }

    //Llamada a la función 
    loadGraph();
</script>

<main>
    <div>
        {#if checkMSG.length!=0}
          <p class="msgRed" style="color: #9d1c24">ERROR: {checkMSG}</p>
        {/if}
      </div>

    <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto"/>
    <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>

</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
      }
      div{
        margin-bottom: 15px;
      }
      p {
        display: inline;
      }
      .msgRed {
        padding: 8px;
        background-color: #ffffff;
      }
  
  </style>