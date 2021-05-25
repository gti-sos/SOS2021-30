<script>
    import * as JSC from "jscharting";
    import { Alert } from "sveltestrap";

    //ALERTAS
    let visible = false;
    let color = "danger";
    var checkMSG = "";

    //Uso API grupo 05 rental-arms
    const BASE_ARMS_API_PATH = "/api/v1/arms-sales-stats";
    let BASE_SMOKERS_PATH = "/api/v3/smokers-stats";
    var armsStats = [];
    var smokersData = [];
    var fullDat = [];

    console.log("Cargando datos...");

    JSC.fetch(armsStats)
        .then((response) => response.json())
        .then((json) => {});

    console.log("Received " + armsStats.length + " data");
    console.log(armsStats);

    /*
    //GET SMOKER
    async function getSmoker() {
        console.log("Fetching smokers Data...");
        const res = await fetch(BASE_SMOKERS_PATH + "/loadInitialData");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            smokersData = json;
            console.log("Received Smokers Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de SMOKERS");
        }
    }

    //GET ARMS
    async function getArms() {
        console.log("Fetching arms Data...");
        const res = await fetch(BASE_ARMS_API_PATH);
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            smokersData = json;
            console.log("Received Arms Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de ARMS");
        }
    }
    
    async function loadGraph() {
        console.log("Fetching data...");
        const res = await fetch(BASE_SMOKER_PATH);
        fullDat = await res.json();
        if (res.ok) {
            fullDat.forEach((stat) => {
                smokerChartInfo.push(stat.province + "/" + stat.year);
                smokerChartDaily.push(stat["dailySmoker"]);
                smokerChartOcasional.push(stat["ocasionalSmoker"]);
                smokerChartEx.push(stat["exSmoker"]);
                smokerChartNon.push(stat["nonSmoker"]);
            });

            //Comprueba que la gráfica no aparezca vacía y vuelve atrás
            if (fullDat.length == 0) {
                console.log("ERROR MSG");
                alert("Por favor, primero cargue los datos de la API");
                pop();
            }
        }
    }
    */
   
    var data = [
                { name: "Greg", sales: 10 },
                { name: "Mike", sales: 12 },
                { name: "Chris", sales: 9 },
                { name: "Jeff", sales: 11 },
                { name: "John", sales: 13 },
            ];

            //Convert data to series array.
            var series = JSC.nest()
                .key("name") // X values
                .rollup("sales") // Y values
                .series(data); // Generate series

            var chart = JSC.chart("chartDiv", {
                type: "column",
                defaultBox_boxVisible: false,
                legend_visible: false,
                series: series,
            });
</script>

<main>
    <div text-align="center" id="chartDiv" style="width: 100%; height: 400px;"></div>
</main>
