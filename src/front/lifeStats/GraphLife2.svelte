<script>
        import {Button} from "sveltestrap";
        const BASE_API_PATH = "/api/v2/life-expectancy-stats";
        let lifeData = [];
        let lifeChartData = [];
        let lifeChartCountryProvinceYear = [];
        let lifeChartLifeExpectancyMan = [];
        let lifeChartProvinceAverage = [];
        let lifeChartLifeExpectancyWoman = [];
        let lifeChartAverageLifeExpectancy = [];
        let provinces = [];
        let errorMsg = "";
        let okMsg = "";

        async function loadGraphic() {
        console.log("Fetching data...");
        const res = await fetch(BASE_API_PATH);
        lifeData = await res.json();
        if (res.ok) {
            lifeData.forEach(stat => {
                lifeChartCountryProvinceYear.push(stat.country+"/"+stat.province+"/"+stat.year);
                lifeChartProvinceAverage.push([stat.province,stat.averageLifeExpectancy]);

                provinces.push(stat.province);
            });
        }
      
      console.log("Life Expectancy Chart Data: " + lifeChartData);
            var ranges = lifeChartLifeExpectancyWoman;
            var averages = lifeChartAverageLifeExpectancy;
            var provincias = provinces

            
            Highcharts.chart('container', {
              chart: {
                  type: 'column'
              },
              title: {
                  text: 'Esperanza de vida media en España 2017'
              },
              subtitle: {
                  text: 'Source: <a href="https://datosmacro.expansion.com/demografia/esperanza-vida/espana-comunidades-autonomas">datosmacro.com</a>'
              },
              xAxis: {
                  type: 'category',
                  labels: {
                      rotation: -45,
                      style: {
                          fontSize: '13px',
                          fontFamily: 'Verdana, sans-serif'
                      }
                  }
              },
              yAxis: {
                  min: 0,
                  title: {
                      text: 'años'
                  }
              },
              legend: {
                  enabled: false
              },
              tooltip: {
                  pointFormat: 'Edad: <b>{point.y:.1f} años</b>'
              },
              series: [{
                  name: 'Population',
                  data: lifeChartProvinceAverage,
                  dataLabels: {
                      enabled: true,
                      rotation: -90,
                      color: '#FFFFFF',
                      align: 'right',
                      format: '{point.y:.1f}', // one decimal
                      y: 10, // 10 pixels down from the top
                      style: {
                          fontSize: '13px',
                          fontFamily: 'Verdana, sans-serif'
                      }
                  }
              }]
          });
        
        }
</script>

  <svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/boost.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
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
          Representación de la esperanza de vida media por comunidades. (Gráfica creada con Highcharts)
        </p>
      </figure>
    </div>
    <a href="#/life-stats"><Button outline color="primary">Volver</Button></a>
  </main>
  
  <style>
      #container {
          height: 400px; 
      }

      .highcharts-figure, .highcharts-data-table table {
          min-width: 310px; 
          max-width: 800px;
          margin: 1em auto;
      }

      .highcharts-data-table table {
          font-family: Verdana, sans-serif;
          border-collapse: collapse;
          border: 1px solid #EBEBEB;
          margin: 10px auto;
          text-align: center;
          width: 100%;
          max-width: 500px;
      }
      .highcharts-data-table caption {
          padding: 1em 0;
          font-size: 1.2em;
          color: #555;
      }
      .highcharts-data-table th {
        font-weight: 600;
          padding: 0.5em;
      }
      .highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
          padding: 0.5em;
      }
      .highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
          background: #f8f8f8;
      }
      .highcharts-data-table tr:hover {
          background: #f1f7ff;
      }

  </style>