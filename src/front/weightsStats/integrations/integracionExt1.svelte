<script>
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    const NBA_PATH = "https://www.balldontlie.io/api/v1/players";

    let NBAStats = [];
    let positions = [];
    let name = [];

    async function getNBA(){
        const res = await fetch(NBA_PATH);
        if(res.ok){
            NBAStats = await res.json();
            console.log("Recived " + NBAStats.length + " NBA data...");
        }
    }

    async function loadGraph(){
        console.log("Fetching data...");

        await getNBA();
        console.log("Procesing all data...");

        NBAStats.forEach((stat) => {            
            positions.push(stat["position"]);
            name.push(stat["first_name"]);
        });

        console.log("Generando datos para la gráfica...");
        Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Posiciones por jugador en la NBA'
            },
            xAxis: {
                title: {
                    text: 'Posición'
                },
                categories: positions
            },
            yAxis: {
                title: {
                    text: 'Porcentaje y €(en M)'
                }
            },
            series: [{
                name: 'Porcentaje de peso normal en el año 2017',
                data: name
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