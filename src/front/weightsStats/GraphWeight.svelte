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
    
	/*
    let visible = false;
    let wvisible = false;
    let color = "danger";
    let page = 1;
    let totaldata=38;
    let weightStats = [];
    let newWeight = {
        provinces: "",
        year: "",
        normal_weight: "",
        overweight: "",
        obesity:""
    }
    let s_provinces= [];
    let current_province = "-";
	  let checkMSG = "";
    let warningMSG = "";*/
    var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";

    let weightData = [];
    let weightChartData = [];
    let weightChartInfo = [];
    let weightchartNormalWeight = [];
    let weightChartOverweight = [];
    let weightChartObesity = [];

    //Función GET para listar los recursos
    async function getStats() { 
        console.log("Fetching Data...");
        const res = await fetch(BASE_WEIGHTS_PATH);
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightStats = json;

            s_provinces = json.map((d) =>{
                return d.provinces;
            });
            s_provinces = Array.from(new Set(s_provinces));
            console.log("Received " + weightStats.length + " weight Data.");
        } else {
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }



    onMount(getStats);

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

        console.log("Prueba");
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
        }, {
            name: 'Sobrepeso',
            data: weightChartOverweight
        }, {
            name: 'Obesidad',
            data: weightChartObesity
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