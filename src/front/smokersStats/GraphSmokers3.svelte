<script>
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    var BASE_SMOKER_PATH = "/api/v3/smokers-stats";

    var fullDat = [];
    var smokerChartInfo = [];
    var smokerChartDaily = [];
    var smokerChartOcasional = [];
    var smokerChartEx = [];
    var smokerChartNon = [];

    var checkMSG = [];

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

        console.log("Graphical data sent");
        Highcharts.chart("container", {
            chart: {
                type: "pyramid",
            },
            title: {
                text: "Sales pyramid",
                x: -50,
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: "<b>{point.name}</b> ({point.y:,.0f})",
                        softConnector: true,
                    },
                    center: ["40%", "50%"],
                    width: "80%",
                },
            },
            legend: {
                enabled: false,
            },
            series: [
                {
                    name: "Unique users",
                    data: [
                        ["Website visits", 15654],
                        ["Downloads", 4064],
                        ["Requested price list", 1987],
                        ["Invoice sent", 976],
                        ["Finalized", 846],
                    ],
                },
            ],

            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 500,
                        },
                        chartOptions: {
                            plotOptions: {
                                series: {
                                    dataLabels: {
                                        inside: true,
                                    },
                                    center: ["50%", "50%"],
                                    width: "100%",
                                },
                            },
                        },
                    },
                ],
            },
        });
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/funnel.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Pyramid charts are related to funnel charts, and show a hierarchical
            structure that has a progressive order, such as a sales process.
        </p>
    </figure>
    
        on:load={loadGraph}>
</svelte:head>

<main>
    <div>
        {#if checkMSG.length != 0}
            <p class="msgRed" style="color: #9d1c24">ERROR: {checkMSG}</p>
        {/if}
    </div>

    <figure class="highcharts-figure">
        <div id="container" />
        <p class="highcharts-description">
            En el gráfico se representa el dato por comunidades autónomas en el
            año 2017 en España. Fumadores diarios, ocasionales, ex-fumadores y
            no fumadores.
        </p>
    </figure>
    <p align="center">
        <Button outline color="primary" on:click={pop}>Atrás</Button>
    </p>
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
        text-align: center;
    }
    div {
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
