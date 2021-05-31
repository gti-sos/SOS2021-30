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
                type: 'area'
            },
            title: {
                text: 'Integración CulturalBASE API'
            },
            xAxis: {
                title: {
                    text: 'Comunidad autónoma'
                },
                categories: weightProvinces
            },
            yAxis: {
                title: {
                    text: 'Porcentaje y €(en M)'
                }
            },
            tooltip: {
                pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
            },series: [{
                name: 'Porcentaje de peso normal en el año 2017',
                data: weightNormalWeight
            }, {
                name: 'Recaudación total de la industria cinematográfica(contada por millones)',
                data: culturaFundraising
            }]
        });
        
    }    
</script>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
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
