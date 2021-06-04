<script>
    import * as JSC from "jscharting";
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    //ALERTAS
    let visible = false;
    let color = "danger";
    var checkMSG = "";

    //Constantes
    const BASE_HOSTEL_API_PATH = "https://sos2021-26.herokuapp.com/proxy/api/v2/hostelries";
    const BASE_SMOKERS_PATH = "/api/v3/smokers-stats";

    //Variables SMOKER
    var smokersData = [];
    var smokerChartProvince = [];
    var smokerChartDaily = [];
    var smokerDailyAsoc = [];

    //Variables RENTAL
    var hostelData = [];
    var hostelProvince = [];
    var hostelProvinceParsed = [];
    var hostelYear = [];
    var hostelSites = [];
    var hostelSitesAv = [];
    var hostelTraveler = [];
    var hostelTravelerAv = [];

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
    //GET HOSTELRIES
    async function getHostel() {
        await fetch(BASE_HOSTEL_API_PATH+"/loadInitialData"); //no tiene persistencia
        const res = await fetch(BASE_HOSTEL_API_PATH);
        if (res.ok) {
            hostelData = await res.json();
            console.log("Received hostelries Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de HOSTELRIES");
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

    //LOADGRAPH
    async function loadGraph() {
        await getSmoker();
        await getHostel();
        console.log("Datos recibidos para pintar smoker: "+smokersData.length);
        console.log("Datos recibidos para pintar hostelries: "+hostelData.length);

        //Gestión de datos de ambas apis y reparto en variables
        smokersData.forEach((stat) => {
            smokerChartProvince.push(stat.province);
            smokerChartDaily.push(stat["dailySmoker"]);
        });

        hostelData.forEach((stat) => {
            hostelProvince.push(stat.district);
            hostelYear.push(stat.year);
            hostelSites.push(stat["establishment_open"]);
            let sum1 = hostelSites.reduce((previous, current) => current += previous);
            hostelSitesAv = sum1/hostelSites.length;
            hostelTraveler.push(stat["traveler_numer"]);
            let sum2 = hostelTraveler.reduce((previous, current) => current += previous);
            hostelTravelerAv = sum2/hostelTraveler.length;
        });

        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }

        //Bucle para reemplazar las provincias y sacar las medias de locales abiertos y de travelers
        for (var i = 0; i < hostelProvince.length; i++) {
          hostelProvinceParsed.push(hostelProvince[i]
                .allReplace({"Andalucia": "Andalucía", "Aragon": "Aragón", "Madrid": "Comunidad de Madrid",}));

          var hostelProvinceParsedAv = Array.from(new Set(hostelProvinceParsed));   //eliminamos las provincias repetidas 
          
          var AndSites = (hostelSites[0] + hostelSites[1] + hostelSites[2])/3;  //media sitios Andalucía
          var AndTraveler = (hostelTraveler[0] + hostelTraveler[1] + hostelTraveler[2])/3; //media viajeros Andalucía
          
          var AraSites = (hostelSites[3] + hostelSites[4] + hostelSites[5])/3;  //media sitios Aragón
          var AraTraveler = (hostelTraveler[3] + hostelTraveler[4] + hostelTraveler[5])/3; //media viajeros Aragón
          
          var CanSites = (hostelSites[6] + hostelSites[7] + hostelSites[8])/3;  //media sitios Canarias
          var CanTraveler = (hostelTraveler[6] + hostelTraveler[7] + hostelTraveler[8])/3; //media viajeros Canarias
          
          var CatSites = (hostelSites[9] + hostelSites[10] + hostelSites[11])/3;  //media sitios Cataluña
          var CatTraveler = (hostelTraveler[9] + hostelTraveler[10] + hostelTraveler[11])/3; //media viajeros Cataluña
          
          var MadSites = (hostelSites[12] + hostelSites[13] + hostelSites[14])/3; //media sitios Comunidad de Madrid
          var MadTraveler = (hostelTraveler[12] + hostelTraveler[13] + hostelTraveler[14])/3; //media viajeros Comunidad de Madrid
          hostelSitesAv.push(AndSites);
          hostelTravelerAv.push(AndTraveler);     //se introducen las medias de los sitios y viajeros
          hostelSitesAv.push(AraSites);
          hostelTravelerAv.push(AraTraveler);     //
          hostelSitesAv.push(CanSites);
          hostelTravelerAv.push(CanTraveler);     //
          hostelSitesAv.push(CatSites);
          hostelTravelerAv.push(CatTraveler);     //
          hostelSitesAv.push(MadSites);
          hostelTravelerAv.push(MadTraveler);     //
          
        }

       //Tratamiento de los datos: al final quedan todos los objetos en un array dataFin, que será la serie del gráfico
       for (let i = 0; i < smokerChartProvince.length; i++) {
            //creando el objeto e insertandolo en dataFin
            let objSeries = new Object();
            objSeries.province = smokerChartProvince[i]; 
            objSeries.dailySmoker = smokerChartDaily[i];
            //tras insertar en el objeto, el campo provincia y el campo dailySmoker, se busca la coincidencia con las provincias parseadas de hostelries
            for (var j = 0; j < hostelProvinceParsed.length; j++) {
              if(objSeries.province == hostelProvinceParsed[j]){
                objSeries.sitesAv = hostelSitesAv[j];
                objSeries.travelAv = hostelTravelerAv[j];
              }
            }

            dataFin.push(objSeries);
        }
        
        console.log(dataFin);
        

        //Define del nido con el que se desarrolla la gráfica
        var nido = JSC.nest().key("province");


        //Reúso del nido para cada uno de los diferentes datos del objeto que se quiere mostrar (rollup calls)
        var series = [
          JSC.merge(
            { name: "Fumadores diarios" }, nido.rollup("dailySmoker").series(dataFin)[0] //primera parte de la serie, dailySmoker
          ),
          
          JSC.merge(
            { name: "Media de sitios abiertos"}, nido.rollup("establishment_open").series(hostelData)   //segunda parte de la serie, establecimientos abiertos
          ),
          /*JSC.merge(
            { name: "Media de viajeros recibidos"}, nido.rollup("travelAv").series(dataFin)[0] //tercera parte de la serie, viajeros recibidos
          )
          */
        ];


        //Convert data to series array.
        var chart = JSC.chart("chartDiv", {
            debug: true,
            type: "horizontal column",
            title_label_text: "SmokerVSHostel",
            yAxis: { label_text: "Unidades" },
            xAxis: { label_text: "Comunidad Autónoma" },
            series: series,
        });
    }

loadGraph();
</script>

<main>
    <div id="chartDiv" style="max-width: 770px; height: 600px; margin: 0px auto;"></div>
    <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>

</main>
