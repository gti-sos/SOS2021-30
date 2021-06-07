<script>
  import { pop }from "svelte-spa-router";
  import { Button } from "sveltestrap";
  import Chart from 'chart.js/auto';

  const BASE_API_PATH = "/api/v2/life-expectancy-stats";
  const BASE_UNEMPLOY_API_PATH = "https://sos2021-07.herokuapp.com/api/v2/unemployment"
  var unemploymentStats = [];
  var lifeStats = [];
  var lifeExpectancy = [];
  var errorMsg = "";
  var provinces = [];
  var unemployment = [];

  console.log("Cargando página...");

  

  async function getStats() {
    console.log("Fetching life expectancy data...");
    await fetch(BASE_API_PATH + "/loadInitialData");
    const res = await fetch(BASE_API_PATH);
    if (res.ok) {
      console.log("OK");
      lifeStats = await res.json();
      lifeStats.forEach(stat => {
          if(stat.province == "Andalucía" ){
            lifeExpectancy.push(stat.averageLifeExpectancy);
            }

          });

      console.log("Datos sobre esperanza de vida recibidos")
      console.log(lifeStats);
      console.log(`We have received ${lifeStats.length} life-expectancy-stats.`);
    } else {
      console.log("Error");
      errorMsg = "Error al cargar los datos de la API";
    }
  }


  async function getUnemploymentStats() {
    console.log("Fetching unemployment data...");
    await fetch(BASE_UNEMPLOY_API_PATH + "/loadInitialData");
    const res = await fetch(BASE_UNEMPLOY_API_PATH); 
    console.log(res);
    if (res.ok) {
      const json = await res.json();
      unemploymentStats = json;
      provinces.push("Andalucia"); // añado andalucia a la lista de provincias
      unemployment.push(0); //le agrego valor 0 para que no se vea representado en el nivel inferior del donut
      unemploymentStats.forEach(stat => {
          if(stat.autonomous_community == "andalucia" ){
              provinces.push(stat.province);
              unemployment.push(stat.unemployment_rate);
            }

          });
      console.log(provinces);
      provinces.sort;
      console.log(provinces);
      console.log(`We have received ${unemploymentStats.length} unemployment.`);
      console.log("Ok");
    } else {
      errorMsg = "Error recuperando datos de desempleo";
      console.log("ERROR!" + errorMsg);
    }
  }



  async function loadGraph() {

    console.log("Inicio getStats");
    await getUnemploymentStats();
    await getStats();
    console.log('Datos sobre esperanza de vida recibidos para pintar el grafo:');
    console.log(lifeStats);
    console.log('Datos sobre desempleo recibidos para pintar el grafo:');
    console.log(unemploymentStats);

      const data = {
              datasets: [{

                  data: unemployment,

                      backgroundColor: [
                      "#00FF28",
                      "#F7464A",
                      "#46BFBD",
                      "#FDB45C",
                      "#949FB1",
                      "#4D5360",
                      "#E4FF00",
                      "#008BFF",
                      "#B900FF"
                  ],
                 
              }, {
                  data: lifeExpectancy,
                     backgroundColor: [
                        "#00FF28",
                  ],
                 
              }],        
                labels: provinces
          }



      var ctx = document.getElementById('myChart');

      new Chart(ctx, {
          type: 'doughnut',
          data: data,
          options: {
              responsive: true
          }
      });
  };

</script>

<svelte:head>
  <script src="https://github.com/chartjs/Chart.js/blob/master/docs/scripts/utils.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js" on:load={loadGraph}></script>
</svelte:head>


<main>

  <div>
    <h2>Integración SOS G7 API unemployment   </h2>
  </div>




  <div>
  <canvas id="myChart" width="200" height="200"></canvas>
  </div>


  <div>
    <figure class="highcharts-figure">
      <div id="container" />
      <p class="highcharts-description">
        Representación en dos niveles de la esperanza de vida media (en años) de la comunidad autonoma Andalucia frente
        al porcentaje de paro de sus provincias.
      </p>
    </figure>
  </div>




      <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>
</main>

<style>
  #myChart{
    font-family: Verdana, sans-serif;
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 1000px;
    height: 100%;
    max-height: 500px;
  }
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
  div {
    margin-bottom: 15px;
  }
</style>