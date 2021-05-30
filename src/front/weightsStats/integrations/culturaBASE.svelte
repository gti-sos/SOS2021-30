<script>
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";


    const BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    //const culturaBASE_PATH = "https://sos2021-26.herokuapp.com/integration/api/v2/culturaBASE";
    const culturaBASE_PATH = "/proxyHeroku/integration/api/v2/culturaBASE";

    let weightStats = [];
    let weightProvinces = [];
    let weightNormalWeight = [];

    let culturaStats = [];
    let culturaProvinces = [];
    //let culturaFundraising = [];

    async function getWeight(){
        const res = await fetch(BASE_WEIGHTS_PATH);
        if(res.ok){
            weightStats = await res.json();
            console.log("Recived weights data...");
        }
    }

    async function getCultura(){
        const res = await fetch(culturaBASE_PATH);
        if(res.ok){
            culturaStats = await res.json();
            console.log("Recived cultura data...");
        }
    }

    async function loadGraph(){
        console.log("Fetching data...");

        await getWeight();
        await getCultura();
        console.log("Procesing all data...");

        weightStats.forEach((stat) => {
            weightProvinces.push(stat.provinces);
            weightNormalWeight.push(stat["normal_weight"]);
        });

        culturaStats.forEach((stat) => {
            culturaProvinces.push(stat.district);
        });

        console.log("Generando datos para la gráfica...");
        Highcharts.chart('container', {
        
        title: {
            text: 'Gráfica de la primera integracion'
        },
        lang: {
            viewFullscreen:"Ver en pantalla completa",
            downloadJPEG: "Descargar en formato JPEG",
            downloadPDF: "Descargar en formato PDF",
            downloadPNG:"Descargar en formato JPEG",
            downloadSVG:"Descargar en formato JPEG",
            downloadCSV:"Descargar en formato CSV",
            downloadXLS:"Descargar en formato XLS",
            exitFullscreen:"Salir de pantalla completa",
  	        printChart: 'Imprimir gráfico',
        },
        yAxis: {
            title: {
                text: 'Porcentaje'
            }
        },
        xAxis: {
            title: {
                text: 'Comunidad Autónoma'
            },
            categories: weightProvinces,
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        annootations: [
            {
                labels: [
                    {
                      point: "date",
                      text: "",  
                    },
                    {
                        point: "min",
                        text: "Min",
                        backgroundColor: "white",
                    },                    
                ],
            },
        ],
        series: [
            {
                name: 'Peso normal',
                data: weightNormalWeight
            }],
        resWeightponsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
        });
    }    
</script>

<svelte:head>

  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/series-label.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>

</svelte:head>


<main>
    <figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
      Gráfico de líneas en el que se representa el porcentaje por comunidades autónomas en el año 2017 de cada API
    </p>
  </figure>
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>
