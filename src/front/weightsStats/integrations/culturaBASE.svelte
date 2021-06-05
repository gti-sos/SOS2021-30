<script>
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    const BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    //const culturaBASE_PATH = "https://sos2021-26.herokuapp.com/integration/api/v2/culturaBASE";
    //const culturaBASE_PATH = "/proxyHeroku/integration/api/v2/culturaBASE";
    const culturaBASE_PATH = "/proxyHeroku/api/v2/culturaBASE";

    let weightStats = [];
    let weightProvinces = [];
    let weightNormalWeight = [];

    let culturaStats = [];
    let culturaProvinces = [];
    let culturaFundraising = [];

    async function getWeight(){
        await fetch(BASE_WEIGHTS_PATH+"/loadInitialData");
        console.log("Se cargan los datos desde la dirección: " + BASE_WEIGHTS_PATH+"/loadInitialData");
        const res = await fetch(BASE_WEIGHTS_PATH);
        if(res.ok){
            weightStats = await res.json();
            console.log("Recived " + weightStats.length + " weights data...");
        }
    }

    async function getCultura(){
        await fetch(culturaBASE_PATH+"/loadInitialData");
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
            series: [{
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
            Gráfico de área en el que se representa el porcentaje de peso normal según IMC por comunidades autónomas en el año 2017
            integrado con los datos de la recaudación total en la industria cinematográfica en cada comunidad autónoma.
        </p>
    </figure>

    <h7 style="color: gray;">Gráfica diseñada con Highcharts - type: 'area'</h7>
    
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>
