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
      console.log(alcoholData);
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
      //Calculos para los datos de Highchart2
      let nombres = [];
      let muertes = [];
      for (let index = 0; index < alcoholData.length; index++) {
        nombres.push(alcoholData[index].ageRange)
        muertes.push(alcoholData[index].alcoholPrematureDeath);
      }
      console.log(nombres);
      console.log(muertes);
      Highcharts.chart('container2', {

        chart: {
            type: 'item'
        },

        title: {
            text: 'Muertes prematuras por rango de edad'
        },

        legend: {
            labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
        },

        series: [{
            name: 'Muertes prematuras',
            keys: ['name', 'y', 'color', 'label'],
            data: [
                [nombres[0], muertes[0], '#BE3075', nombres[0]],
                [nombres[1], muertes[1], '#EB001F', nombres[1]],
                [nombres[2], muertes[2], '#64A12D', nombres[2]],
                [nombres[3], muertes[3], '#FFED00', nombres[3]],
                [nombres[4], muertes[4], '#000000', nombres[4]],
                [nombres[5], muertes[5], '#008AC5', nombres[5]],
                [nombres[6], muertes[6], '#009EE0', nombres[6]]
                [nombres[7], muertes[7], '#008AC5', nombres[7]],
                [nombres[8], muertes[8], '#008AC5', nombres[8]],
                [nombres[9], muertes[9], '#008AC5', nombres[9]],
                [nombres[10], muertes[10], '#008AC5', nombres[10]],
                [nombres[11], muertes[11], '#008AC5', nombres[11]],
                [nombres[12], muertes[12], '#008AC5', nombres[12]],
                [nombres[13], muertes[13], '#008AC5', nombres[13]]
            ],
            dataLabels: {
                enabled: true,
                format: '{point.label}'
            },

            // Circular options
            center: ['50%', '88%'],
            size: '170%',
            startAngle: -100,
            endAngle: 100
        }]
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
    <a href="#/alcohol-graph2"><Button outline color="primary">Ver otra representación</Button></a>
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