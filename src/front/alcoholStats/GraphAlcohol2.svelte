<script>
    import {Button} from "sveltestrap";
    import ItemSeries from 'highcharts/modules/item-series';
    const BASE_API_PATH = "/api/v2";
    let alcoholData = [];
    let errorMsg = "";
    let okMsg = "";

    async function loadChart() {
      console.log("Fetching data...");
      const res = await fetch(BASE_API_PATH + "/alcohol-consumption-stats");
      alcoholData = await res.json();
      //Calculos para los datos de Highchart2
      let nombres = [];
      let muertes = [];
      for (let index = 0; index < alcoholData.length; index++) {
        nombres.push(alcoholData[index].ageRange)
        muertes.push(alcoholData[index].alcoholPrematureDeath);
      }

      Highcharts.chart('container', {

        chart: {
            type: 'item'
        },

        title: {
            text: 'Muertes prematuras por rango de edad España 2017'
        },

        legend: {
            labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
        },

        series: [{
            name: 'Muertes prematuras',
            keys: ['name', 'y', 'color', 'label'],
            data: [
                [nombres[0], muertes[0], '#FAFAFA', nombres[0]],
                [nombres[1], muertes[1], '#5659A2', nombres[1]],
                [nombres[2], muertes[2], '#93533A', nombres[2]],
                [nombres[3], muertes[3], '#5BA5AA', nombres[3]],
                [nombres[4], muertes[4], '#6D933C', nombres[4]],
                [nombres[5], muertes[5], '#E625ED', nombres[5]],
                [nombres[6], muertes[6], '#111112', nombres[6]],
                [nombres[7], muertes[7], '#1838FA', nombres[7]],
                [nombres[8], muertes[8], '#18FA42', nombres[8]],
                [nombres[9], muertes[9], '#18FAA7', nombres[9]],
                [nombres[10], muertes[10], '#FA6D18', nombres[10]],
                [nombres[11], muertes[11], '#F8EB20', nombres[11]],
                [nombres[12], muertes[12], '#E21F44', nombres[12]],
                [nombres[13], muertes[13], '#1FE2E2', nombres[13]]
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
    ItemSeries(Highcharts);
    }
   
  </script>
  <svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/item-series.js" on:load={loadChart}></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

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
          Representación de los datos.
        </p>
      </figure>
    </div>
    <a href="#/alcohol-graph3"><Button outline color="primary">Ver representación lineal dygraph</Button></a>
    <a href="#/alcohol-graph"><Button outline color="primary">Ver representación lineal Highcharts</Button></a>
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