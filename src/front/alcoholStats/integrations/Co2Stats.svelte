<script>
    import { pop }from "svelte-spa-router";
    import { Button } from "sveltestrap";
  
    var co2Stats = [];
    var errorMsg = "";
  
    console.log("Cargando página...");
    
    async function getCo2Stats() {
      console.log("Fetching co2 data...");
      const res = await fetch("https://daily-atmosphere-carbon-dioxide-concentration.p.rapidapi.com/api/co2-api", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "8bc009cf62msh21716bede95b074p10450fjsnae5393291199",
		"x-rapidapi-host": "daily-atmosphere-carbon-dioxide-concentration.p.rapidapi.com"
	}
}); 
      console.log(res);
      if (res.ok) {
        const json = await res.json();
        co2Stats = json;
        console.log("Ok");
      } else {
        errorMsg = "Error recuperando datos de co2";
        console.log("ERROR!" + errorMsg);
      }
    }
    async function loadGraph() {
      console.log("Inicio getStats");
      await getCo2Stats();
      let categorias = [];
      let ciclo = [];
      let tendencia = [];

      for (let index = co2Stats.co2.length-29; index < co2Stats.co2.length; index++) {
          categorias.push("Mes: " + co2Stats.co2[index].month + " Día: " + co2Stats.co2[index].day);
          ciclo.push(parseFloat(co2Stats.co2[index].cycle));
          tendencia.push(parseFloat(co2Stats.co2[index].trend));
      }
      Highcharts.chart('container', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Datos Co2 registrados y su tendencia en marzo 2021'
            },
            xAxis: [{
                categories: categorias,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}ppm',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Tendencia',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Ciclo',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value} ppm',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 100,
                floating: true,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || 
                    'rgba(255,255,255,0.25)'
            },
            series: [{
                name: 'Ciclo',
                type: 'column',
                yAxis: 1,
                data: ciclo,
                tooltip: {
                    valueSuffix: ' ppm'
                }

            }, {
                name: 'Tendencia',
                type: 'spline',
                data: tendencia,
                tooltip: {
                    valueSuffix: 'ppm'
                }
            }]
        });
  
    }
  
  </script>
  
  <svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load={loadGraph}></script>
  </svelte:head>
  
  <main>
    <div>
      <h2>Integración API SOS co2-stats</h2>
    </div>
    {#if errorMsg}
      <p>{errorMsg}</p>
    {:else}
    <style>
            .highcharts-figure, .highcharts-data-table table {
          min-width: 310px; 
          max-width: 800px;
          margin: 1em auto;
      }
  
      #container {
          height: 400px;
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
  
    <figure class="highcharts-figure">
      <div id="container"></div>
  </figure>
    <br>
    <br>
    <h6>Gráfico </h6>
    {/if}
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
  </main>
  
  <style>
    main {
      text-align: center;
      padding: 1em;
      margin: 0 auto;
    }
    div {
      margin-bottom: 15px;
    }
  </style>