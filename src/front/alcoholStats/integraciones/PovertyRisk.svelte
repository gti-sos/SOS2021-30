<script>
    import { pop }from "svelte-spa-router";
    import { Button } from "sveltestrap";
    //Uso API grupo 11
    const BASE_API_PATH = "/api/v2";
    var anxietyStats = [];
    var alcoholData = [];
    var errorMsg = "";
    async function loadStats() {
      console.log("Loading data...");
      const res = await fetch(
        BASE_API_PATH + "/alcohol-consumption-stats/loadInitialData"
      ).then(function (res) {
        if (res.ok) {
          getStats();
          errorMsg = "";
          okMsg = "Datos cargados correctamente";
          console.log("OK");
        } else {
          if (res.status === 500) {
            errorMsg = "No se ha podido acceder a la base de datos";
          }
          okMsg = "";
          console.log("ERROR!" + errorMsg);
        }
      });
    }
    async function getStats() {
      console.log("Fetching data...");
      await loadStats();
      const res = await fetch(BASE_API_PATH + "/alcohol-consumption-stats");
      if (res.ok) {
        console.log("OK");
        alcoholData = await res.json();
        okMsg = "";
        console.log(`We have received ${alcoholData.length} alcohol-consumption-stats.`);
      } else {
        console.log("Error");
        errorMsg = "Error al cargar los datos de la API";
      }
    }
    async function getAnxietyStats() {
      console.log("Fetching data...");
      const res = await fetch("/anxiety-stats");
      if (res.ok) {
        const json = await res.json();
        anxietyStats = json;
        console.log(`We have received ${anxietyStats.length} anxiety-stats.`);
        console.log("Ok");
      } else {
        errorMsg = "Error recuperando datos de restcountries";
        okMsg = "";
        console.log("ERROR!" + errorMsg);
      }
    }
    async function loadChart() {
      await getStats();
      await getAnxietyStats();
      var xAxis = [];
      var yAxis = [];
      var yAxis1 = [];
      //-------------------anxiety-stats
      console.log("Calculating anxiety-stats...");
      var index = 0;
      sanxietyStats.forEach(element => {
        var e = element.country+"-"+element.year;
        if (!xAxis.includes(e)){
          xAxis.push(e);
          yAxis.push(Math.round(element.health_expenditure_in_percentage));
          index++;
          console.log("X: "+xAxis);
          console.log("Y: "+yAxis);
        }
      });
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("Calculating alcohol-stats...");
      alcoholData.forEach(element => {
        var e = element.country+"-"+element.date;
        if (!xAxis.includes(e)){
          if(element["natality-rate"]!=undefined){
            console.log("natalite-rite "+element["natality-rate"]);
            xAxis.push(e);
          yAxis.push(Math.round(element["natality-rate"]));
          console.log("X: "+xAxis);
          console.log("Y: "+yAxis);
          }
          
        }
      });
      var yAxis1 = [];
      for (let i = 0; i < index; i++) {
        yAxis1.push(0);    
      }
      var copy = yAxis.slice(index,yAxis.lengt);
    for (let i = 0; i < copy.length; i++) {
      yAxis1.push(copy[i]);
      
    }
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("X: "+xAxis.length);
      console.log("Y: "+yAxis.length);
      console.log("X-Anxiety: "+xAxis.slice(0,index));
      console.log("X-Alcohol: "+xAxis.slice(index,yAxis.length));
      console.log("Y-Anxiety: "+yAxis.slice(0,index));
      console.log("Y-Alcohol: "+yAxis.slice(index,yAxis.length));
      console.log("index: "+index);
      var ctx = document.getElementById("myChart").getContext("2d");
      var myChart = new Chart(ctx, {
        
        data: {
          
          datasets: [
            {
              type: 'line',
              label: "Gasto en sanidad (%)",
              data: yAxis.slice(0,index),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)'
            
            },
            {
              type: 'bar',
              label: "Ratio de natalidad (%)",
              data: yAxis1,
              borderColor: 'rgb(54, 162, 235)'
            },
          ],
          labels: xAxis
        },
      });
    }
  </script>
  
  <svelte:head>
    <script
      src="https://cdn.jsdelivr.net/npm/chart.js"
      on:load={loadChart}></script>
  </svelte:head>
  
  <main>
    <div>
      <h2>Integración API SOS poverty-risk-stats</h2>
    </div>
  
    {#if errorMsg}
      <p>{errorMsg}</p>
    {:else}
      <div>
        <canvas id="myChart" />
      </div>
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