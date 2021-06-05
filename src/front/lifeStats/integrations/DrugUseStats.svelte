<script>
    import { pop }from "svelte-spa-router";
    import { Button } from "sveltestrap";
    import Chart from 'chart.js/auto';
  
    const BASE_API_PATH = "/api/v2/life-expectancy-stats";
    const BASE_DRUG_API_PATH = "https://sos2021-23.herokuapp.com/api/v1/du-stats"
    var lifeStats = [];
    var errorMsg = "";
    var comunidades = [];
    var lifeExpectancyAverage = [];
    var drugStats = [];
    var drugDependence = [];
  
    console.log("Cargando página...");
  
    
  
    async function getStats() {
      console.log("Fetching life expectancy data...");
      const res = await fetch(BASE_API_PATH);
      if (res.ok) {
        console.log("OK");
        lifeStats = await res.json();
        lifeStats.forEach(stat => {
            comunidades.push(stat.province);
            lifeExpectancyAverage.push(stat.averageLifeExpectancy);
        });
  
        console.log("Datos sobre esperanza de vida recibidos")
        console.log(lifeStats);
        console.log(`We have received ${lifeStats.length} life-expectancy-stats.`);
      } else {
        console.log("Error");
        errorMsg = "Error al cargar los datos de la API";
      }
    }
  
  
    async function getDrugsStats() {
      console.log("Fetching unemployment data...");
      await fetch(BASE_DRUG_API_PATH);
      const res = await fetch(BASE_DRUG_API_PATH); 
      console.log(res);
      if (res.ok) {
        const json = await res.json();
        drugStats = json;
        drugStats.forEach(stat => {
            if(stat.country == "Spain" ){
                drugDependence.push(stat.dudead);
              }
  
            });

            var drugDependenceSR = drugDependence.filter((valor, indice) => { //Eliminando datos repetidos
                return drugDependence.indexOf(valor) === indice;
            }
            );

            drugDependence = drugDependenceSR;
        
        console.log(drugDependence);
        console.log(`We have received ${drugStats.length} unemployment.`);
        console.log("Ok");
      } else {
        errorMsg = "Error recuperando datos de desempleo";
        console.log("ERROR!" + errorMsg);
      }
    }
  
  
  
    async function loadGraph() {
  
      console.log("Inicio getStats");
      await getDrugsStats();
      await getStats();
      console.log('Datos sobre esperanza de vida recibidos para pintar el grafo:');
      console.log(lifeStats);
      console.log('Datos sobre el uso de drogas recibidos para pintar el grafo:');
      console.log(drugStats);
  
      var drugDependenceSpain = []

      for(var i=0;i<lifeStats.length;i++){           // lista con porcentaje de dependencia por cada comunidad
        drugDependenceSpain.push(drugDependence[0]);
      }
      console.log(drugDependenceSpain)

      const data = {
        labels: comunidades,
        datasets: [
            {
            label: 'Esperanza de vida media',
            data: lifeExpectancyAverage,
            borderColor: "#FF000080",
            backgroundColor: "#FF4B4B80",
            },
            {
            label: '% Dependencia de uso de drogas',
            data: drugDependenceSpain,
            borderColor: "#0023FF80",
            backgroundColor: "#3F59FF80",
            }
        ]
        };

    var ctx = document.getElementById('myChart');

      new Chart(ctx, {
                type: 'radar',
        data: data,
        options: {
            responsive: true,
            plugins: {
            title: {
                display: true,
                text: 'Chart.js Radar Chart'
            }
            }
        },
        });







    }
  
  </script>
  
  <svelte:head>
    <script src="https://github.com/chartjs/Chart.js/blob/master/docs/scripts/utils.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js" on:load={loadGraph}></script>
  </svelte:head>
  
  
  <main>
  
    <div>
      <h2>Integración SOS G23 API druguse   </h2>
    </div>
  
  
  
  
    <div>
    <canvas id="myChart" width="200" height="200"></canvas>
    </div>
  
  
    <div>
      <figure class="highcharts-figure">
        <div id="container" />
        <p class="highcharts-description">
          Representación de radar de la esperanza de vida media (en años) por comunidades frente al porcentaje de adictos a las drogas en España.
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