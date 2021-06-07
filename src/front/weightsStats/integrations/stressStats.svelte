<script>
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    const BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    const stressBASE_PATH = "/proxyStress/api/v2/stress_stats/";

    let weightStats = [];
    let weightProvinces = [];
    let weightObesity = [];

    let stressStats = [];
    let stressProvinces = [];
    let stressPoblation = [];

    async function getWeight(){
        await fetch(BASE_WEIGHTS_PATH+"/loadInitialData");
        console.log("Se cargan los datos desde la dirección: " + BASE_WEIGHTS_PATH+"/loadInitialData");
        const res = await fetch(BASE_WEIGHTS_PATH);
        if(res.ok){
            weightStats = await res.json();
            console.log("Recived " + weightStats.length + " weights data...");
        }
    }

    async function getStress(){
        await fetch(stressBASE_PATH+"loadInitialData");
        console.log("Se cargan los datos desde la dirección: " + stressBASE_PATH+"loadInitialData");
        const res = await fetch(stressBASE_PATH);
        if(res.ok){
            stressStats = await res.json();
            console.log("Recived " + stressStats.length + " stress data...");
        }
    }

    async function loadGraph(){
        console.log("Fetching data...");

        await getWeight();
        await getStress();
        console.log("Procesing all data...");

        weightStats.forEach((stat) => {
            if(stat.year == 2017){
                if(stat.provinces == "Asturias"
                || stat.provinces == "Islas Baleares"
                || stat.provinces == "Aragón"
                || stat.provinces == "Cantabria"
                || stat.provinces == "Canarias"
                || stat.provinces == "Andalucía"){
                    weightProvinces.push(stat.provinces);
                    var comunidadesAutonomas = [];
                    comunidadesAutonomas.push(stat.provinces);
                    weightObesity.push(stat["obesity"]);
                }

            }

        });

        stressStats.forEach((stat) => {
            stressProvinces.push(stat.country);
            stressPoblation.push(stat["stress_population"]);
        });

        console.log("Generando datos para la gráfica...");
        Highcharts.chart('container', {
            chart: {
                type: 'columnpyramid'
            },
            title: {
                text: 'Estadística de obesidad integradas con el estrés'
            },
            
            xAxis: {
                title: {
                    text: 'Comunidad autónoma'
                },
                categories: weightProvinces,
                crosshair: true,
                labels: {
                    style: {
                        fontSize: '14px'
                    }
                },
                type: 'category'
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Porcentaje'
                }
            },
            series: [
                {
                name: 'Porcentaje de obesidad en el año 2017',
                colorByPoint: true,
                data: weightObesity,
                showInLegend: false
                }, {
                    name: 'Datos de estrés de la poblacion(ratio/media)',
                    colorByPoint: true,
                    data: stressPoblation,
                    showInLegend: false
                }
            ]
        });
        
    }    
</script>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>


</svelte:head>


<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Gráfico en el que se muestra el porcentaje de obesidad en algunas comunidades autónomas 
            de españa en el año 2017 combinado con el ratio medio de estrés en dichas comunidades.
        </p>
    </figure>
    
    <h7 style="color: gray;">Gráfica diseñada con Highcharts - type: 'columnpyramid'</h7>    
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>

