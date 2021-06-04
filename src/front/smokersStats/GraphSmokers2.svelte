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
    var dataFin1 = []; //Objeto final (provincias+daily) que se representará en la gráfica
    var dataFin2 = []; //Objeto final () que se representará en la gráfica

    var checkMSG = [];

    async function loadGraph() {
        console.log("Fetching data...");
        const res = await fetch(BASE_SMOKER_PATH);
        fullDat = await res.json();
        if (res.ok) {
            fullDat.forEach((stat) => {
                smokerChartInfo.push(stat.province);
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

        //Tratamiento de datos

        //Primer for, que proporciona los datos organizados para la primera capa del gráfico -> series/data
        for (let i = 0; i < smokerChartInfo.length; i++) {
            //creando el objeto e insertándolo en dataFin
            let objSmoker = new Object();
            objSmoker.name = smokerChartInfo[i];
            objSmoker.y = smokerChartDaily[i];
            objSmoker.drilldown = smokerChartInfo[i];

            dataFin1.push(objSmoker);
        }

        //Segundo for, que proporciona los datos para la segunda capa del gráfico -> drilldown/series/data
        var tipos = ["Fumadores diarios", "Fumadores ocasionales", "Ex-fumadores", "No fumadores",];
        for (let i = 0; i < smokerChartInfo.length; i++) {
            let tablaAux = [];
            let objSmoker = new Object();
            objSmoker.name = smokerChartInfo[i];
            objSmoker.id = smokerChartInfo[i];
            //for interno
            for (var j = 0; j < tipos.length; j++) {
                let minitablaAux = [];
                minitablaAux.push(tipos[j]);
                switch (tipos[j]) {
                    case "Fumadores diarios": minitablaAux.push(smokerChartDaily[i]); break;
                    case "Fumadores ocasionales": minitablaAux.push(smokerChartOcasional[i]); break;
                    case "Ex-fumadores": minitablaAux.push(smokerChartEx[i]); break;
                    case "No fumadores": minitablaAux.push(smokerChartNon[i]); break;
                    default: checkMSG = "No se ha podido completar el objeto para formar la gráfica."; break;
                }
                tablaAux.push(minitablaAux); //se rellena la tabla con tablas de 2 elementos
                objSmoker.data = tablaAux; //se establece como nuevo elemento del objeto
            }   
            dataFin2.push(objSmoker);   //se pushea a dataFin por requerimientos de formato
        }
        console.log(dataFin2);

        console.log("Graphical data sent");

        // Create the chart
        Highcharts.chart("container", {
            chart: {
                type: "pie",
            },
            lang: {
                viewFullscreen: "Ver en pantalla completa",
                downloadJPEG: "Descargar en formato JPEG",
                downloadPDF: "Descargar en formato PDF",
                downloadPNG: "Descargar en formato JPEG",
                downloadSVG: "Descargar en formato JPEG",
                downloadCSV: "Descargar en formato CSV",
                downloadXLS: "Descargar en formato XLS",
                exitFullscreen: "Salir de pantalla completa",
                printChart: "Imprimir gráfico",
            },
            title: {
                text: "Número y tipo de fumadores en cada Comunidad Autónoma, en España a 2017",
            },
            subtitle: {
                text: 'Click para ver el origen de los datos => <a href="#/smokers-stats" target="_blank">API fuente de datos</a>',
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            accessibility: {
                announceNewData: {
                    enabled: true,
                },
                point: {
                    valueSuffix: "personas",
                },
            },

            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: "{point.name}: {point.y:.1f}",
                    },
                },
            },

            tooltip: {
                headerFormat:
                    '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat:
                    '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> de la población total de la comunidad<br/>',
            },

            series: [
                {
                    name: "Fumadores diarios",
                    colorByPoint: true,
                    data: dataFin1,
                },
            ],
            drilldown: {
                series: dataFin2
                /*
                series: [
                    {
                        name: "Andalucía",
                        id: "Andalucía",
                        data: [
                            ["Fumadores diarios", smokerChartDaily[0]],
                            ["Fumadores ocasionales", smokerChartOcasional[0]],
                            ["Ex-fumadores", smokerChartEx[0]],
                            ["No fumadores", smokerChartNon[0]],
                        ],
                    },
                ],
                */
            },
        });
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/data.js"></script>
    <script src="https://code.highcharts.com/modules/drilldown.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script
        src="https://code.highcharts.com/modules/accessibility.js"
        on:load={loadGraph}></script>
</svelte:head>


<main>
    <div>
        {#if checkMSG.length != 0}
            <p class="msgRed" style="color: #9d1c24">ERROR: {checkMSG}</p>
        {/if}
    </div>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Scatter charts are often used to visualize the relationships
            between data in two dimensions. This chart is visualizing
            height and weight by gender, showing a clear trend where men
            are on average taller and heavier than women.
        </p>
    </figure>
    <p align="center">
        <Button outline color="primary" on:click={pop}>Volver al gráfico Highcharts Line</Button>
    </p>
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
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
