<script>
    import { pop }from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";


    var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";

    let weightData = [];
    let weightChartInfo = [];
    let weightchartNormalWeight = [];
    let weightChartOverweight = [];
    let weightChartObesity = [];

    async function loadGraph(){
        console.log("Fetching data...");
        const res = await fetch(BASE_WEIGHTS_PATH);
        weightData = await res.json();
        if(res.ok){
            weightData.forEach(stat => {
                weightChartInfo.push(stat.provinces+"/"+stat.year);
                weightchartNormalWeight.push(stat["normal_weight"]);
                weightChartOverweight.push(stat["overweight"]);
                weightChartObesity.push(stat["obesity"]);
            });
        }

        console.log("Generando datos...");
        Highcharts.chart('container', {
            chart: {
                type: 'cylinder',
                options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 15,
                    depth: 50,
                    viewDistance: 35
                }
            },
            title: {
                text: 'Gráfica IMC por comunidades'
            },
            yAxis: {
                title: {
                    text: 'Porcentaje'
                }
            },
            xAxis: {
                title: {
                    text: 'Comunidad autónoma/año'
                },
                categories: weightChartInfo
            },
            plotOptions: {
                series: {
                    depth: 25,
                    colorByPoint: true
                }
            },            
            series: [
            {
            name: 'Peso normal',
            data: weightchartNormalWeight
            },
            {
            name: 'Sobrepeso',
            data: weightChartOverweight
            },
            {
            name: 'Obesidad',
            data: weightChartObesity}
            ]
        });

    }
     
</script>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-3d.js"></script>
    <script src="https://code.highcharts.com/modules/cylinder.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>

</svelte:head>


<main>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Gráfico de cilindros 3D en el que se ve representado el porcentaje por comunidades 
            autónomas en los años 2014 y 2017 el IMC</p>
    </figure>
    
    <h7 style="color: gray;">Gráfica diseñada con Highcharts - type: 'cylinder'</h7>
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
 
</main>

<style>
#container {
    height: 650px; 
    width: 2200px;
}
</style>