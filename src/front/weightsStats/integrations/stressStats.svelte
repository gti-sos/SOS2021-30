<script>
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";


    const BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    //const culturaBASE_PATH = "https://sos2021-26.herokuapp.com/integration/api/v2/culturaBASE";
    const stressBASE_PATH = "/proxyStress/api/v2/stress_stats/";

    let weightStats = [];
    let weightProvinces = [];
    let weightNormalWeight = [];

    let stressStats = [];
    let stressProvinces = [];
    let stressPoblation = [];

    async function getWeight(){
        const res = await fetch(BASE_WEIGHTS_PATH);
        if(res.ok){
            weightStats = await res.json();
            console.log("Recived " + weightStats.length + " weights data...");
        }
    }

    async function getStress(){
        const res = await fetch(stressBASE_PATH);
        if(res.ok){
            stressStats = await res.json();
            console.log("Recived " + stressStats.length + " cultura data...");
        }
    }

    async function loadGraph(){
        console.log("Fetching data...");

        await getWeight();
        await getStress();
        console.log("Procesing all data...");

        weightStats.forEach((stat) => {
            if(stat.year == 2017){
                weightProvinces.push(stat.provinces);
                weightNormalWeight.push(stat["normal_weight"]);
            }

        });

        stressStats.forEach((stat) => {
            stressProvinces.push(stat.country);
            stressPoblation.push(stat["stress_population"]);
        });

        console.log("Generando datos para la gráfica...");
        Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Integración Stress-Stats API'
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
                data: stressPoblation
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
