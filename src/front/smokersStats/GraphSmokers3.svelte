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
    .highcharts-figure,
    .highcharts-data-table table {
        min-width: 360px;
        max-width: 600px;
        margin: 1em auto;
    }

    .highcharts-data-table table {
        font-family: Verdana, sans-serif;
        border-collapse: collapse;
        border: 1px solid #ebebeb;
        margin: 10px auto;
        text-align: center;
        width: 100%;
        max-width: 500px;
    }
    .highcharts-data-table caption {
        padding: 1em 0;
        font-size: 1.2em;
        color: #555;
    }
    .highcharts-data-table th {
        font-weight: 600;
        padding: 0.5em;
    }
    .highcharts-data-table td,
    .highcharts-data-table th,
    .highcharts-data-table caption {
        padding: 0.5em;
    }
    .highcharts-data-table thead tr,
    .highcharts-data-table tr:nth-child(even) {
        background: #f8f8f8;
    }
    .highcharts-data-table tr:hover {
        background: #f1f7ff;
    }
</style>
