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
    const BASE_ARMS_API_PATH = "/api/v1/arms-sales-stats";
    const BASE_SMOKERS_PATH = "/api/v3/smokers-stats";

    //Variables SMOKER
    var smokersData = [];
    var smokerChartProvince = [];
    var smokerChartDaily = [];
    //Variables RENTAL
    var rentalData = [];
    var rentalProvince = [];
    var rental = [];

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
    
    async function loadGraph() {
        await getSmoker();
        console.log("Datos smoker recibidos para pintar: "+smokersData);

        smokersData.forEach((stat) => {
            smokerChartProvince.push(stat.province);
            smokerChartDaily.push(stat["dailySmoker"]);
        });

        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }

        //Convert data to series array.
        var series = JSC.nest()
            .key("province") // X values
            .pointRollup(function (key, value) {
                return {
                    x: key,
                    y: JSC.sum(value, "dailySmoker"),
                    z: JSC.sum(value, "nonSmoker"),
                };
            }) // Y values
            .series(smokersData); // Generate series

            var chart = JSC.chart("chartDiv", {
                type: "bubble",
                defaultBox_boxVisible: false,
                legend_visible: false,
                toolbar_items_export_visible: false,
                xAxis_label_text: "Provincias",
                yAxis_label_text: "FumDiario",
                zAxis_label_text: "NO fumadores",
                series:series
            });     
    }

loadGraph();
</script>

<main>
    <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto"></div>
</main>
