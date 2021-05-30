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
    let culturaFundraising = [];

    async function getWeight(){
        const res = await fetch(BASE_WEIGHTS_PATH);
        if(res.ok){
            weightStats = await res.json();
            console.log("Recived " + weightStats.length + " weights data...");
        }
    }

    async function getCultura(){
        const res = await fetch(culturaBASE_PATH);
        if(res.ok){
            culturaStats = await res.json();
            console.log("Recived " + culturaStats.length + " cultura data...");
        }
    }

    async function loadGraph(){
        console.log("Fetching data...");

        await getWeight();
        await getCultura();
        console.log("Procesing all data...");

        weightStats.forEach((stat) => {
            if(stat.year == 2017){
                weightProvinces.push(stat.provinces);
                weightNormalWeight.push(stat["normal_weight"]);
            }

        });

        culturaStats.forEach((stat) => {
            culturaProvinces.push(stat.district);
            culturaFundraising.push(stat["fundraising"]);
        });

        console.log("Generando datos para la gráfica...");
        Highcharts.chart('container', {
    chart: {
        type: 'area',
        options3d: {
            enabled: true,
            alpha: 15,
            beta: 30,
            depth: 200
        }
    },
    title: {
        text: "Integración CulturalBASE API"
    },
    yAxis: {
        title: {
            text: 'Porcentaje y €(en M)',
            x: -40
        }
    },
    xAxis: [{
        visible: false
    }, {
        visible: false
    }, {
        visible: false
    }],
    plotOptions: {
        area: {
            depth: 100,
            marker: {
                enabled: false
            },
            states: {
                inactive: {
                    enabled: false
                }
            }
        }
    },
    series: [{
        name: "Porcentaje de peso normal en el año 2017",
        lineColor: 'rgb(180,90,50)',
        color: 'rgb(200,110,50)',
        fillColor: 'rgb(200,110,50)',
        data: weightNormalWeight
    }, {
        xAxis: 1,
        lineColor: 'rgb(120,160,180)',
        color: 'rgb(140,180,200)',
        fillColor: 'rgb(140,180,200)',
        name: "Recaudación total de la industria cinematográfica(contada por millones)",
        data: culturaFundraising
    }]
});

    }    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-3d.js" on:load="{loadGraph}"></script>
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
