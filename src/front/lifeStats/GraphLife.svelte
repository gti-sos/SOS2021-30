<script>
    import { pop }from "svelte-spa-router";
    import {Button} from "sveltestrap";
    const BASE_API_PATH = "/api/v2/life-expectancy-stats";
    let lifeData = [];
    let lifeChartData = [];
    let lifeChartCountryProvinceYear = [];
    let lifeChartLifeExpectancyWoman = [];
    let lifeChartLifeExpectancyMan = [];
    let lifeChartAverageLifeExpectancy = [];
    let errorMsg = "";
    let okMsg = "";

    async function loadGraphic() {
      console.log("Fetching data...");
      const res = await fetch(BASE_API_PATH);
      lifeData = await res.json();
      if (res.ok) {
        lifeData.forEach(stat => {
            lifeChartCountryProvinceYear.push(stat.country+"/"+stat.province+"/"+stat.year);
            lifeChartLifeExpectancyWoman.push(stat.lifeExpectancyWoman);
            lifeChartLifeExpectancyMan.push(stat.lifeExpectancyMan);
            lifeChartAverageLifeExpectancy.push(stat.averageLifeExpectancy);
        });
      }
      
      console.log("Life Expectancy Chart Data: " + lifeChartData);
      Highcharts.chart("container", {
        title: {
          text: "Estadísticas sobre la esperanza de vida",
        },
        yAxis: {
          title: {
            text: "Años",
          },
        },
        xAxis: {
          title: {
            text: "País , Comunidad y Año",
          },
          categories: lifeChartCountryProvinceYear,
        },
        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "middle",
        },
        annotations: [
          {
            labels: [
              {
                point: "date",
                text: "",
              },
              {
                point: "min",
                text: "Min",
                backgroundColor: "white",
              },
            ],
          },
        ],
        series: [
          {
            name: "Esperanza de vida en mujeres",
            data: lifeChartLifeExpectancyWoman,
          },
          {
            name: "Esperanza de vida en hombres",
            data: lifeChartLifeExpectancyMan,
          },
          {
            name: "Esperanza de vida media",
            data: lifeChartAverageLifeExpectancy,
          }
          
        ],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                },
              },
            },
          ],
        },
      });
    }
  </script>

  <svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script
      src="https://code.highcharts.com/modules/accessibility.js"
      on:load={loadGraphic}></script>
  </svelte:head>

  <main>
    <div>
      <h2>
        Gráfico
      </h2>
    </div>
  
    <div>
      {#if errorMsg}
        <p class="msgRed" style="color: #9d1c24">ERROR: {errorMsg}</p>
      {/if}
      {#if okMsg}
        <p class="msgGreen" style="color: #155724">{okMsg}</p>
      {/if}
    </div>
  
    <div>
      <figure class="highcharts-figure">
        <div id="container" />
        <p class="highcharts-description">
          Representación lineal de la esperanza de vida por País,Comunidad y Año
          en mujeres, hombres y la media.
        </p>
      </figure>
    </div>
    <a href="#/life-stats"><Button outline color="primary"  on:click={pop} >Volver</Button></a>
  </main>
  
  <style>
    main {
      text-align: center;
      padding: 1em;
      margin: 0 auto;
    }
    div{
      margin-bottom: 15px;
    }
    p {
      display: inline;
    }
    .msgRed {
      padding: 8px;
      background-color: #f8d7da;
    }
    .msgGreen {
      padding: 8px;
      background-color: #d4edda;
    }
  </style>