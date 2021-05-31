<script>
    import * as JSC from "jscharting";
    import { onMount } from "svelte";
    import { Alert } from "sveltestrap";
    import { pop } from "svelte-spa-router";

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
    //Variables RENTAL
    var hostelData = [];
    var hostelProvince = [];
    var hostelSites = [];

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
        const res = await fetch(BASE_HOSTEL_API_PATH);
        if (res.ok) {
            hostelData = await res.json();
            console.log("Received hostelries Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de HOSTELRIES");
        }
    }


    //LOADGRAPH
    async function loadGraph() {
        await getSmoker();
        await getHostel();
        console.log("Datos recibidos para pintar smoker: "+smokersData.length);
        console.log("Datos recibidos para pintar hostelries: "+hostelData.length);

        smokersData.forEach((stat) => {
            smokerChartProvince.push(stat.province);
            smokerChartDaily.push(stat["dailySmoker"]);
        });

        hostelData.forEach((stat) => {
            hostelProvince.push(stat.district);
            hostelSites.push(stat["establishment_open"]);
        })


        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }

        //Tratamiento de datos

        //Convert data to serieSmoker
        var serieSmoker = JSC.nest()
            .key("province") // X values
            .pointRollup(function (key, value) {
                return {
                    x: key,
                    y: JSC.sum(value, "dailySmoker"),
                };
            }) // Y values
            .series(smokersData); // Generate series

        //Convert data to serieRental
        var serieHostel = JSC.nest()
            .key("district") // X values
            .pointRollup(function (key, value) {
                return {
                    x: key,
                    y: JSC.sum(value, "establishment_open"),
                };
            }) // Y values
            .series(smokersData); // Generate series
        
            
        //Convert data to series array.
        var chart = JSC.chart('chartDiv', {
        debug: true,
        type: 'column',
        title_label_text: 'SmokerVSHostelries',
        xAxis_label_text: 'Provincia',
        yAxis: [
          { id: 'normal', 
            label_text: 'Número de elementos' 
            }
        ],
        series: [
            {
                name: 'Fumadores diarios',
                id: 's1',
                points: serieSmoker[0].points
            },
            {
                name: 'Establecimientos abiertos',
                id: 's2',
                points: serieHostel[0].points
            }
        ]
      });
    }

loadGraph();
</script>

<main>
    <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto"></div>
</main>
