<script>
  import { pop }from "svelte-spa-router";
  import { Button } from "sveltestrap";
  import Chart from 'chart.js/auto';

  const BASE_API_PATH = "/api/v2/life-expectancy-stats";
  const BASE_UNEMPLOY_API_PATH = "https://sos2021-07.herokuapp.com/api/v2/unemployment"
  var unemploymentStats = [];
  var lifeStats = [];
  var errorMsg = "";
  var provinces = [];

  console.log("Cargando página...");





  

  async function getStats() {
    console.log("Fetching life expectancy data...");
    const res = await fetch(BASE_API_PATH);
    if (res.ok) {
      console.log("OK");
      lifeStats = await res.json();
      console.log("Datos sobre esperanza de vida recibidos")
      console.log(lifeStats);
      console.log(`We have received ${lifeStats.length} life-expectancy-stats.`);
      
      lifeStats.forEach(stat => {
              provinces.push(stat.province);
          });
          console.log(provinces);
    } else {
      console.log("Error");
      errorMsg = "Error al cargar los datos de la API";
    }
    


  }
  async function getUnemploymentStats() {
    console.log("Fetching unemployment data...");
    await fetch(BASE_UNEMPLOY_API_PATH);
    const res = await fetch(BASE_UNEMPLOY_API_PATH); 
    console.log(res);
    if (res.ok) {
      const json = await res.json();
      unemploymentStats = json;
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

    var ctx = document.getElementById('myChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
          labels: provinces,
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                suggestedMin: 50,
                suggestedMax: 100
              }
          }
      }
  });




  };

</script>

<svelte:head>

</svelte:head>


<main>

<div>
  <h2>Integración API SOS unemployment</h2>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js" on:load={loadGraph}></script>

<div>
<canvas id="myChart" width="200" height="200"></canvas>
</div>


    <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>
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