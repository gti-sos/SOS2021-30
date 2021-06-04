<script>
    import * as JSC from "jscharting";
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
import Smokers from "../Smokers.svelte";

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
    var smokerChartNon = [];
    var smokerDailyAsoc = [];

    //Variables RENTAL
    var hostelData = [];
    var hostelProvince = [];
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
            smokerChartNon.push(stat["nonSmoker"]);
        });
        //
        hostelData.forEach((stat) => {
            hostelProvince.push(stat.district.allReplace({"Andalucia": "Andalucía", "Aragon": "Aragón", "Madrid": "Comunidad de Madrid",}));
            hostelSites.push(stat["establishment_open"]);
            hostelTraveler.push(stat["traveler_numer"]);
        });

        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }


    //Tratamiento de los datos: al final quedan todos los objetos en un array dataFin=[obj], que será la serie del gráfico. Points=[obj]
    var tipos = ["Fumadores diarios", "Establecimientos abiertos", "Turistas recibidos", "No fumadores",];

    //Se van iterando las opciones. Luego fijando un smokersData, se checkea la igualdad con hostelData
    for (let i = 0; i < tipos.length; i++){
        let tablaPoint = [];
        let objSmoker = new Object();
        objSmoker.name = tipos[i];
        for(let k=0; k<smokersData.length; k++){
            for (let j = 0; j<hostelData.length; j++){
                let objInterno = new Object();
                objInterno.x = smokerChartProvince[k];     // va metiendo todas las provincias
                if(smokerChartProvince[k] == hostelProvince[j]){    //se recorrerán todas las provincias pero solo se crean las que tienen ambas apis
                    switch (tipos[i]) {
                        case tipos[0]: objInterno.y = smokerChartDaily[k]; break;
                        case tipos[1]: objInterno.y = hostelData[j].establishment_open; break;
                        case tipos[2]: objInterno.y = hostelData[j].traveler_numer; break;
                        case tipos[3]: objInterno.y = smokerChartNon[k]; break;
                        default: checkMSG = "No se ha podido completar el objeto para formar la gráfica."; break;
                    }
                    tablaPoint.push(objInterno);
                }
            }
        }
        objSmoker.points = tablaPoint;
        dataFin.push(objSmoker);
    }

        console.log(dataFin);


        /////////////////////////////////GRAPH
        //Convierte los datos en un gráfico 
        var chart = JSC.chart('chartDiv', { 
            degug: true,
            defaultSeries_type: 'horizontal column', 
            legend_description: 'chart legend', 
            legend_defaultEntry_description: '%name', 
            toolbar_items_export_description: 'export menu', 
            defaultPoint_description: '%name %value', 
            series: dataFin
        }); 
    }
    //Llamada a la función
    loadGraph();
</script>

<main>
    <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto"></div>
    <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>

</main>
