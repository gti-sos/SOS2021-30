<script>
  import { pop }from "svelte-spa-router";
  import { Button } from "sveltestrap";
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
      await fetch("https://endpoint-poverty-risks.herokuapp.com/api/v1/loadInitialData");
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
    let alcoholValue = [];
    let povertyValue = [];
    for (let index = 0; index < alcoholData.length; index++) {
      alcoholValue.push(alcoholData[index].alcoholPrematureDeath);
      povertyValue.push(povertyStats[index].percentage_risk_of_poverty);
      
    }
    let suma = 0;
    let suma1 = 0;
    for (let index = 0; index < alcoholValue.length; index++) {
      suma += alcoholValue[index];
      suma1 += povertyValue[index];
    }
    let mediaAlcohol = parseInt(suma/alcoholValue.length);
    let mediaPoverty = parseInt(suma1/povertyValue.length);
    console.log("Medias");
    console.log(mediaAlcohol);
    console.log(mediaPoverty);

    console.log("Array de datos para el grafo:");
    console.log(alcoholValue);
    console.log(povertyValue);
    Highcharts.chart('grafo1', {
    accessibility: {
        point: {
            valueDescriptionFormat: '{point.name}: {point.longDescription}.'
        }
    },
    series: [{
        type: 'venn',
        data: [{
          sets: ['A'],
            value: 2,//mediaPoverty
            name: 'Riesgo de pobreza',
            longDescription: 'Riesgo de pobreza mundial.'
        }, {
          sets: ['B'],
            value: 4,//mediaAlcohol
            name: 'Consumo de alcohol',
            longDescription: 'Consumo de alcohol es España año 2017.'
        }, {
            sets: ['A', 'B'],
            value: 1
        }]
    }],
    tooltip: {
        headerFormat:
            '<span style="color:{point.color}">\u2022</span> ' +
            '<span style="font-size: 14px"> {point.point.name}</span><br/>',
        pointFormat: '{point.longDescription}<br><span style="font-size: 10px"></span>'
    },
    title: {
        text: 'Relación entre el riesgo de pobreza y el consumo de alcohol'
    }
});
  };

</script>

<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/venn.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js" on:load={loadGraph}></script>
</svelte:head>

<main>
  <div>
    <h2>Integración API SOS poverty-stats</h2>
  </div>
  {#if errorMsg}
    <p>{errorMsg}</p>
  {:else}
  <style>
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