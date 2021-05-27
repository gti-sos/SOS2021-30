<script>
    import * as JSC from "jscharting";
    import { onMount } from "svelte";
    import { Alert } from "sveltestrap";
    import { pop } from "svelte-spa-router";

    //ALERTAS
    let visible = false;
    let color = "danger";
    var checkMSG = "";

    //Uso API grupo 05 rental-arms
    const BASE_RENTALS_API_PATH = "https://sos2021-07.herokuapp.com/api/v1/integration/rentals";
    const BASE_SMOKERS_PATH = "/api/v3/smokers-stats";

    //Variables SMOKER
    var smokersData = [];
    var smokerChartProvince = [];
    var smokerChartDaily = [];
    var smokerType = null;

    //Variables RENTAL
    var rentalData = [];
    var rentalProvince = [];
    var rentalRent = [];
    var rentalType = null;

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

    console.log(rentalType);
    console.log(smokerType);

    async function loadGraph() {
        await getSmoker();
        await getRental();
        console.log("Nº datos smoker recibidos para pintar: "+smokersData.length);
        console.log("Nº datos rental recibidos para pintar: "+rentalData.length);

        //Gestión de datos de ambas apis
        smokersData.forEach((stat) => {
            smokerChartProvince.push(stat.province);
            smokerChartDaily.push(stat["dailySmoker"]);
            smokerType = "Smoker";
        });
        rentalData.forEach((stat) => {
            rentalProvince.push(stat.province);
            rentalRent.push(stat["rent"]);
            rentalType = "Rental";
        })

        console.log(smokerChartDaily);
        console.log(rentalRent);


        //Tratamiento de datos

        
        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }

        //Genera la serie 1
        var serie1 = JSC.nest()
            .key("province") // X values
            .pointRollup(function (key, value) {
                return {
                    x: key,
                    y: JSC.sum(value, "dailySmoker")/1000,  //datos en miles
                };
            }) // Y values
            
            .series(smokersData); // Generate serie1
        
        //Genera la serie 2
        var serie2 = JSC.nest()
            .key("autonomous_community")
            .pointRollup(function(key, value) {
                return {
                    x: key.replace('andalucia', 'Andalucía')
                    .replaceAll('cataluna', 'Catalunya')
                    .replaceAll('castilla-y-leon', 'Castilla y León')
                    .replaceAll('comunidad_de_madrid', 'Comunidad de Madrid'), // X values,
                    y: JSC.sum(value, "rent")
                };
            }) // Y values
            .series(rentalData); // Generate serie2

            console.log(serie1);
            console.log(serie2);

        //Convert data to series array.
        var chart = JSC.chart('chartDiv', { 
            debug: true, 
            type: 'column aqua', 
            title_label_text: 'SmokerVSRental', 
            yAxis: {label_text: 'Unidades' },
            xAxis: {
                /*scale: {
                    range: {min: 0}
                },
                */
                label_text:'Comunidad Autónoma'
            },
            series: [{ 
                name: 'Fumadores diarios (en miles)',
                points: serie1[0].points 
                }, 
                { 
                name: 'Renta',
                points: serie2[0].points
                }]
            }); 
    }

loadGraph();
</script>

<main>
    <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto"></div>
</main>
