<script>
    import { pop }from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";


    var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";

    let weightData = [];
    let weightChartInfo = [];
    let weightchartNormalWeight = [];



    async function loadGraph(){
        console.log("Fetching data...");
        const resWeight = await fetch(BASE_WEIGHTS_PATH);
        weightData = await resWeight.json();
        if(resWeight.ok){
            weightData.forEach(stat => {
                weightChartInfo.push(stat.provinces+"/"+stat.year);
                weightchartNormalWeight.push(stat["normal_weight"]);
                //AÑADIR UN DATO DE CADA UNA DE LAS APIs (preferiblemente un porcentaje para que todo tenga relacion y se vea bien el grafico)
            });
        }

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
            categories: weightChartInfo,
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
            data: weightchartNormalWeight
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
      Gráfico de líneas en el que se ve representado el porcentaje por comunidades autónomas en los años 2014 y 2017 el IMC
    </p>
  </figure>

  <Button outline color="secondary" on:click="{pop}">Atrás</Button>
 
</main>

<style>
  .highcharts-figure, .highcharts-data-table table {
    min-width: 360px; 
    max-width: 800px;
    margin: 1em auto;
}

.highcharts-data-table table {
	font-family: Verdana, sans-serif;
	border-collapse: collapse;
	border: 1px solid #EBEBEB;
	margin: 10px auto;
	text-align: center;
	width: 100%;
	max-width: 500px;
}
.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}
.highcharts-data-table th {
	font-weight: 600;
    padding: 0.5em;
}
.highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
    padding: 0.5em;
}
.highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
    background: #f8f8f8;
}
.highcharts-data-table tr:hover {
    background: #f1f7ff;
}

</style>