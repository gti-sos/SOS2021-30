<script>
  import { pop }from "svelte-spa-router";
	import Button from "sveltestrap/src/Button.svelte";


    
	var BASE_SMOKER_PATH = "/api/v3/smokers-stats";

    var fullDat = [];
    var smokerChartInfo = [];
    var smokerChartDaily = [];
    var smokerChartOcasional = [];
    var smokerChartEx = [];
    var smokerChartNon = [];

    var checkMSG = [];
    
    async function loadGraph(){
        console.log("Fetching data...");
        const res = await fetch(BASE_SMOKER_PATH);
        fullDat = await res.json();
        if(res.ok){
            fullDat.forEach(stat => {
                smokerChartInfo.push(stat.province);
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
        ///////////////////////////////////////////GRAPH
        Highcharts.chart('container', {
            chart: {
            type: 'line'
        },
        lang: {
            viewFullscreen:"Ver en pantalla completa",
            downloadJPEG: "Descargar en formato JPEG",
            downloadPDF: "Descargar en formato PDF",
            downloadPNG:"Descargar en formato JPEG",
            downloadSVG:"Descargar en formato JPEG",
            downloadCSV:"Descargar en formato CSV",
            downloadXLS:"Descargar en formato XLS",
            exitFullscreen:"Salir de pantalla completa",
  	        printChart: 'Imprimir gráfico',
        },

        title: {
            text: 'Gráfica Smoker por comunidades'
        },
        subtitle: {
                text: 'Click para ver el origen de los datos => <a href="#/smokers-stats" target="_blank">API fuente de datos</a>',
        },
        yAxis: {
            title: {
                text: 'Nº de personas'
            }
        },

        xAxis: {
            title: {
                text: 'Comunidad autónoma'
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
    <div>
        {#if checkMSG.length!=0}
          <p class="msgRed" style="color: #9d1c24">ERROR: {checkMSG}</p>
        {/if}
      </div>

  <figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
      En el gráfico se representa el dato por comunidades autónomas en el año 2017 en España.
      Fumadores diarios, ocasionales, ex-fumadores y no fumadores.
    </p>
  </figure>
  <p align="center"><Button outline color="primary" on:click="{pop}">Atrás</Button>
    <a href= "#/smokers-graph2"><Button outline color="primary" >Ir al gráfico interactivo Highcharts</Button></a>
    
    </p>
  
  
</main>

<style>
  main {
      text-align: center;
      padding: 1em;
      margin: 0 auto;
    }
    div{
      margin-bottom: 15px;
    }
    p {
      display: inline;
    }
    .msgRed {
      padding: 8px;
      background-color: #ffffff;
    }

</style>