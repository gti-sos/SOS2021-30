<script>
    import {Button} from "sveltestrap";
    const BASE_API_PATH = "/api/v2";
    let alcoholData = [];
    let alcoholChartData = [];
    let alcoholChartAgeRangeCountryYearData = [];
    let alcoholChartPrematureDeathData = [];
    let alcoholChartAgeRangeData = [];
    let alcoholChartPrevalenceData = [];
    let errorMsg = "";
    let okMsg = "";

    async function loadChart() {
      console.log("Fetching data...");
      const res = await fetch(BASE_API_PATH + "/alcohol-consumption-stats");
      alcoholData = await res.json();
      if (res.ok) {
        alcoholData.forEach(stat => {
        alcoholChartAgeRangeCountryYearData.push(stat.ageRange+"/"+stat.country+"/"+stat.year);
        alcoholChartAgeRangeData.push(stat.ageRange);
        alcoholChartPrevalenceData.push(stat.prevalenceOfAlcoholUseDisorder);
        alcoholChartPrematureDeathData.push(stat.alcoholPrematureDeath);
        });
      }
      
      console.log("Alcohol Consumption Chart Data: " + alcoholChartData);
      Highcharts.chart("container", {
        title: {
          text: "Estadísticas sobre consumo de alcohol",
        },
        yAxis: {
          title: {
            text: "Valor",
          },
        },
        xAxis: {
          title: {
            text: "Rango de edad , País y Año",
          },
          categories: alcoholChartAgeRangeCountryYearData,
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
            name: "Muertes prematuras a causa del alcohol",
            data: alcoholChartPrematureDeathData,
          },
          {
            name: "Prevalencia de trastornos por conusmo de alcohol (%)",
            data: alcoholChartPrevalenceData,
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
      on:load={loadChart}></script>
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
          Gráfico dónde se muestras los valores de los datos.
        </p>
      </figure>
    </div>
    <a href="#/alcohol-stats"><Button outline color="primary">Ver datos</Button></a>
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