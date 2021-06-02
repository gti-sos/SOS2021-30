<script>
    import { pop }from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    const BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    const BASE_COVID_PATH = "https://covid-api.com/api/reports";

    let weightStats = [];
    let weightChartProvinces = [];
    let weightChartOverweight = [];

    let covidStats = [];
    let covidChartProvinces = [];
    let covidChartDeadDiff = [];

    async function getWeight(){
        await fetch(BASE_WEIGHTS_PATH+"/loadInitialData");
        console.log("Se cargan los datos desde la dirección: " + BASE_WEIGHTS_PATH+"/loadInitialData");
        const res = await fetch(BASE_WEIGHTS_PATH);
        if(res.ok){
            weightStats = await res.json();
            console.log("Recived " + weightStats.length + " weights data...");
        }
    }

    async function getCovid(){
        const res = await fetch(BASE_COVID_PATH);
        if(res.ok){
            covidStats = await res.json();
            console.log("Recived " + covidStats.length + " covid data...");
        }
    }

    async function loadGraph(){
        console.log("Fetching data...");
        await getWeight();
        await getCovid();

        weightStats.forEach((stat) => {
            if(stat.year == 2017){
                weightChartProvinces.push(stat.provinces);
                weightChartOverweight.push(stat["overweight"]);
            }
        });
        
        /*for(let i = 0; i < covidStats.length; i++){
            if(covidStats[i].name == "Spain"){
                covidChartProvinces.push(province[i]);
                covidChartDeadDiff.push(deaths_diff[i]);
            }
        }

        console.log("En los datos covid se han encontrado " + covidChartProvinces.length + " provincias.")
        /*
        covidStats.forEach((stat) => {
            if(stat.name == "Spain"){
                covidChartProvinces.push(stat["province"]);
                covidChartDeadDiff.push(stat["deaths_diff"]);
            }
        });*/

        console.log("Generando datos...");
        Highcharts.chart('container', {

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
            categories: weightChartProvinces,
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
            name: 'Sobrepeso',
            data: weightChartOverweight
        }/*, {
            name: 'Sobrepeso',
            data: weightChartOverweight
        }*/],

        responsive: {
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
      Gráfico de líneas en el que se ve representado el porcentaje por comunidades autónomas en los años 2014 y 2017 el IMC
    </p>
  </figure>

  <Button outline color="secondary" on:click="{pop}">Atrás</Button>
 
</main>

