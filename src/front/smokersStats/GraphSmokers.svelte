<script>
	import { onMount } from "svelte";
  import { pop }from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";
    import Input from "sveltestrap/src/Input.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";
	import { Alert } from 'sveltestrap';
    import { } from "node:os";
import { text } from "svelte/internal";
    
	var BASE_SMOKER_PATH = "/api/v2/smokers-stats";

    let fullDat = [];
    let smokerChartInfo = [];
    let smokerChartDaily = [];
    let smokerChartOcasional = [];
    let smokerChartEx = [];
    let smokerChartNon = [];

    
    async function loadGraph(){
        console.log("Fetching data...");
        const res = await fetch(BASE_SMOKER_PATH);
        fullDat = await res.json();
        if(res.ok){
            fullDat.forEach(stat => {
                smokerChartInfo.push(stat.province+"/"+stat.year);
                smokerChartDaily.push(stat["dailySmoker"]);
                smokerChartOcasional.push(stat["ocasionalSmoker"]);
                smokerChartEx.push(stat["exSmoker"]);
                smokerChartNon.push(stat["nonSmoker"]);
            });
            
            //Comprueba que la gráfica no aparezca vacía y vuelve atrás
            if (fullDat.length == 0){
            console.log("ERROR MSG");
            alert("Por favor, primero cargue los datos de la API");
            pop();
            }
        }

        console.log("Graphical data sent");
        Highcharts.chart('container', {

        title: {
            text: 'Gráfica Smoker por comunidades'
        },

        yAxis: {
            title: {
                text: 'Cantidad'
            }
        },

        xAxis: {
            title: {
                text: 'Comunidad autónoma/año'
            },
            categories: smokerChartInfo,
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
                name: 'Fumadores diarios',
                data: smokerChartDaily
        }, {
            name: 'Fumadores ocasionales',
            data: smokerChartOcasional
        }, {
            name: 'Ex-fumadores',
            data: smokerChartEx
        }, {
            name: 'No fumadores',
            data: smokerChartNon
        }],

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
      En el gráfico se representa el dato por comunidades autónomas en el año 2017 en España.
      Fumadores diarios, ocasionales, ex-fumadores y no fumadores.
    </p>
  </figure>
  <p align="center"><Button outline color="primary" on:click="{pop}">Atrás</Button></p>
  
  
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