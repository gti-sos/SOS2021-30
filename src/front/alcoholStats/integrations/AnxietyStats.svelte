<script>
    import { pop }from "svelte-spa-router";
    import { Button } from "sveltestrap";
    import Dygraph from 'dygraphs';
    //Uso API grupo 11
    const BASE_API_PATH = "/api/v2";
    const BASE_ANXIETY_API_PATH = "/anxiety-stats/api/v2"
    var anxietyStats = [];
    var alcoholData = [];
    var errorMsg = "";

    console.log("Cargando página...");

    

    async function getStats() {
      console.log("Fetching alcohol data...");
      const res = await fetch(BASE_API_PATH + "/alcohol-consumption-stats/loadInitialData");
      if (res.ok) {
        console.log("OK");
        alcoholData = await res.json();
        console.log("Datos alcohol recibidos ahora mismo")
        console.log(alcoholData);
        console.log(`We have received ${alcoholData.length} alcohol-consumption-stats.`);
      } else {
        console.log("Error");
        errorMsg = "Error al cargar los datos de la API";
      }
    }
    async function getAnxietyStats() {
      console.log("Fetching anxiety data...");
      await fetch(BASE_ANXIETY_API_PATH + "/anxiety_stats/loadInitialData");
      const res = await fetch(BASE_ANXIETY_API_PATH + "/anxiety_stats"); // Modificar cuando nos den el endpoint
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
      console.log("Inicio getStats");
      await getAnxietyStats();
      await getStats();
      console.log('Datos alcohol recibidos para pintar el grafo:');
      console.log(alcoholData);
      console.log('Datos ansiedad recibidos para pintar el grafo:');
      console.log(anxietyStats);
      var label = [];

      label.push("Media ansiedad");
      label.push("Media muertes prematuras por consumo de alcohol");

      let muertesPrematuras = [];
      let ansiedad = [];
      for (let index = 0; index < alcoholData.length-2; index++) {
        muertesPrematuras.push(alcoholData[index].alcoholPrematureDeath);
        ansiedad.push(anxietyStats[index].anxiety_population);
        
      } 
      let datos = []
      let suma = 0;
      let suma1 = 0;
      for (let index = 0; index < muertesPrematuras.length; index++) {
        suma += muertesPrematuras[index];
        suma1 += ansiedad[index];
      }
      datos.push(parseFloat(suma/muertesPrematuras.length));
      datos.push(parseFloat(suma1/ansiedad.length));
      console.log("Datos:");
      console.log(datos);
      var ctx = document.getElementById("myChart").getContext("2d");
      var myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: label,
          datasets: [
            {
              label: "Ansiedad por población",
              data: datos,
              backgroundColor: ["rgb(129, 162, 2)", "rgb(123, 34, 137)"],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              title: {
                  display: true,
                  text: 'Comparativa de la ansiedad y el consumo de alcohol'
              }
          },
        },
      });
    };

</script>
  
  <svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js" on:load={loadGraph}></script>
  </svelte:head>
  
  <main>
    <div>
      <h2>Integración API SOS anxiety-stats</h2>
    </div>
    {#if errorMsg}
      <p>{errorMsg}</p>
    {:else}
    <div>
      <canvas id="myChart" />
    </div>
    <div  id="grafo1" class="chart" style="width:600px; height:300px;"></div>
    <br>
    <br>
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