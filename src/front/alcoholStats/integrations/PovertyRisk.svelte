<script>
  import { pop }from "svelte-spa-router";
  import { Button } from "sveltestrap";
  import Dygraph from 'dygraphs';
  //Uso API grupo 11
  const BASE_API_PATH = "/api/v2";
  var povertyStats = [];
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

  async function getPovertyStats() {
      console.log("Fetching poverty data...");
      const res = await fetch("https://endpoint-poverty-risks.herokuapp.com/api/v1/");
      console.log(res);
      if (res.ok) {
        const json = await res.json();
        povertyStats = json;
        console.log(`We have received ${povertyStats.length} poverty-stats.`);
        console.log(povertyStats);
        console.log("Ok");
      } else {
        errorMsg = "Error recuperando datos de pobreza";
        console.log("ERROR!" + errorMsg);
      }
  }
  async function loadGraph() {
    console.log("Inicio getStats loadGraph");
    await getPovertyStats();
    await getStats();
    console.log('Datos alcohol recibidos para pintar el grafo:');
    console.log(alcoholData);
    console.log('Datos pobreza recibidos para pintar el grafo:');
    console.log(povertyStats);
    let mediaPobreza = [];
    for (let index = 0; index < povertyStats.length; index++) {
      mediaPobreza.push(povertyStats[index].people_in_risk_of_poverty);
    }// Calcular media y representarlo en una linea en el grafico , ampliar los campos del grafico a 4
    let arrayDatos = [];
    for (let index = 0; index < alcoholData.length; index++) {
      let separa = alcoholData[index].ageRange.split('-'); 
      let parseo = parseInt(separa[1]);
      arrayDatos.push([parseo,alcoholData[index].alcoholPrematureDeath,povertyStats[index].percentage_risk_of_poverty]);
      
    } // Etiqueta (Valorx) Numero asociado al rango de edad, Dato grafica muertes , Dato grafica ansiedad
    console.log("Array de datos para el grafo:");
    console.log(arrayDatos);
    new Dygraph(document.getElementById("grafo1"),arrayDatos,
    { 
            labels:["RangoEdad","Muertes","Porcentaje riesgo de pobreza mundial"],
            legend: 'always',
            title: 'Muertes prematuras y ansiedad España 2017',
            titleHeight: 32,
            ylabel: 'Valor',
            xlabel: 'Rango de edad'
  
          });
  };

</script>

<svelte:head>
  <script src="//cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.min.js" on:load={loadGraph}></script>
</svelte:head>

<main>
  <div>
    <h2>Integración API SOS poverty-stats</h2>
  </div>
  {#if errorMsg}
    <p>{errorMsg}</p>
  {:else}
  <style>.dygraph-legend { text-align: right; background: none; }
      #grafo1 .dygraph-label { font-family: Georgia, Verdana, serif; }

      #grafo1 .dygraph-title { font-size: 20px; text-shadow: gray 2px 2px 2px; margin: -30px 0px 0px 50px}

      #grafo1 .dygraph-ylabel { font-size: 18px; text-shadow: gray -2px 2px 2px; margin: 0px 0px 0px 90px }

      #grafo1 .dygraph-xlabel { font-size: 18px; text-shadow: gray -2px 2px 2px; margin: 20px 0px 0px 0px }

      .chart { border: 1px hidden black; margin: 50px 5px 5px 400px; padding: 2px; }
  </style>
  <div  id="grafo1" class="chart" style="width:600px; height:300px;"></div>
  <br>
  <br>
  <h6>Gráfico en dónde se muestra el riesgo de pobreza junto con las muertes prematuras</h6>
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