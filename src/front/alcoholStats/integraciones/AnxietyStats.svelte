<script>
    import { pop }from "svelte-spa-router";
    import { Button } from "sveltestrap";
    import Dygraph from 'dygraphs';
import { insert } from "svelte/internal";
    //Uso API grupo 11
    const BASE_API_PATH = "/api/v2";
    const BASE_ANXIETY_API_PATH = "/anxiety-stats/api/v2"
    var anxietyStats = [];
    var alcoholData = [];
    var errorMsg = "";

    console.log("Cargando página...");

    async function loadStats() {
      console.log("Loading loadInitialData alcohol data...");
      const res = await fetch(
        BASE_API_PATH + "/alcohol-consumption-stats/loadInitialData"
      ).then(function (res) {
        if (res.ok) {
          getStats();
          errorMsg = "";
          console.log("OK");
        } else {
          if (res.status === 500) {
            errorMsg = "No se ha podido acceder a la base de datos";
          }
          console.log("ERROR!" + errorMsg);
        }
      });
    }
    async function getStats() {
      console.log("Fetching alcohol data...");
      await loadStats();
      const res = await fetch(BASE_API_PATH + "/alcohol-consumption-stats");
      if (res.ok) {
        console.log("OK");
        alcoholData = await res.json();
        console.log(`We have received ${alcoholData.length} alcohol-consumption-stats.`);
      } else {
        console.log("Error");
        errorMsg = "Error al cargar los datos de la API";
      }
    }
    async function getAnxietyStats() {
      console.log("Fetching anxiety data...");
      const res = await fetch(BASE_ANXIETY_API_PATH + "/anxiety_stats");
      console.log(res);
      if (res.ok) {
        const json = await res.json();
        anxietyStats = json;
        console.log(`We have received ${anxietyStats.length} anxiety-stats.`);
        console.log("Ok");
      } else {
        errorMsg = "Error recuperando datos de ansiedad";
        console.log("ERROR!" + errorMsg);
      }
    }
    async function loadGraph() {
      console.log("Alcohol data -> " + alcoholData);
      console.log("Anxiety data -> " + anxietyStats);
      new Dygraph(document.getElementById("grafo1"),[ //Datos
        [1,2,3],
        [4,5,6],
        [7,8,9]
      ],
      { 
              labels:["A","B","C"],
              rollPeriod: 7,
              legend: 'always',
              title: 'Muertes prematuras y ansiedad',
              titleHeight: 32,
              ylabel: 'Valor',
              xlabel: 'Rango de edad / Año / País',
              strokeWidth: 1.5
            });
    };

</script>
  
  <svelte:head>
    <script
      src="https://cdn.jsdelivr.net/npm/chart.js"
      on:load={loadGraph}></script>
  </svelte:head>
  
  <main>
    <div>
      <h2>Integración API SOS anxiety-stats</h2>
    </div>
    {#if errorMsg}
      <p>{errorMsg}</p>
    {:else}
    <style>.dygraph-legend { text-align: right; background: none; }
        #grafo1 .dygraph-label { font-family: Georgia, Verdana, serif; }

        #grafo1 .dygraph-title { font-size: 30px; text-shadow: gray 2px 2px 2px; }

        #grafo1 .dygraph-ylabel { font-size: 18px; text-shadow: gray -2px 2px 2px; }

        #grafo1 .dygraph-xlabel { font-size: 18px; text-shadow: gray -2px 2px 2px; }

        .chart { border: 1px hidden black; margin: 50px 5px 5px 400px; padding: 2px; }
    </style>
    <div  id="grafo1" class="chart" style="width:600px; height:300px;"></div>
      <h6>Gráfico en dónde se muestra las muertes prematuras por consumo de alcohol en correlación con la ansiedad</h6>
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