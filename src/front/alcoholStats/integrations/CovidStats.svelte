<script>
  import { pop }from "svelte-spa-router";
  import { Button } from "sveltestrap";

  var covidStats = [];
  var errorMsg = "";

  console.log("Cargando página...");

  function cleanChar(str, char) {
    while (true) {
        var result_1 = str.replace(char, '');
        if (result_1 === str) {
            break;
        }
        str = result_1;
    }
    return str;
}
  
  async function getCovidStats() {
    console.log("Fetching covid data...");
    const res = await fetch("https://corona-virus-world-and-india-data.p.rapidapi.com/api", {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "8bc009cf62msh21716bede95b074p10450fjsnae5393291199",
        "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com"
      }
}); 
    console.log(res);
    if (res.ok) {
      const json = await res.json();
      covidStats = json;
      console.log(`We have received ${covidStats.length} covid-stats.`);
      console.log("Ok");
    } else {
      errorMsg = "Error recuperando datos de ansiedad";
      console.log("ERROR!" + errorMsg);
    }
  }
  async function loadGraph() {
    console.log("Inicio getStats");
    await getCovidStats();
    console.log('Datos ansiedad recibidos para pintar el grafo:');
    console.log(covidStats);
    Highcharts.chart('container', {
        chart: {
            type: 'pyramid3d',
            options3d: {
                enabled: true,
                alpha: 10,
                depth: 50,
                viewDistance: 50
            }
        },
        title: {
            text: 'Datos coronavirus'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    allowOverlap: true,
                    x: 10,
                    y: -5
                },
                width: '60%',
                height: '80%',
                center: ['50%', '45%']
            }
        },
        series: [{
            name: 'Estadísticas en el mundo',
            data: [
                ['Muertes',parseInt(cleanChar(covidStats.world_total.total_deaths,","))],
                ['Recuperados', parseInt(cleanChar(cleanCharcovidStats.world_total.total_recovered,","))],
                ['Casos activos', parseInt(cleanChar(covidStats.world_total.active_cases,","))]
            ]
        }]
    });
};

</script>

<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-3d.js"></script>
  <script src="https://code.highcharts.com/modules/cylinder.js"></script>
  <script src="https://code.highcharts.com/modules/funnel3d.js"></script>
  <script src="https://code.highcharts.com/modules/pyramid3d.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js" on:load={loadGraph}></script>
</svelte:head>

<main>
  <div>
    <h2>Integración API SOS covid-stats</h2>
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
  <h6>Gráfico en dónde se muestra las muertes por coronavirus, casos activos y total de recuperados (divididos en un factor de 10)</h6>
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