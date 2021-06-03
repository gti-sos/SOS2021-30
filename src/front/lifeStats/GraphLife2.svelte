<script>
        import {Button} from "sveltestrap";
        const BASE_API_PATH = "/api/v2/life-expectancy-stats";
        let lifeData = [];
        let lifeChartData = [];
        let lifeChartWoman = [];
        let lifeChartMan = [];
        let provinces = [];
        let errorMsg = "";
        let okMsg = "";

        async function loadGraphic() {
        console.log("Fetching data...");
        const res = await fetch(BASE_API_PATH);
        lifeData = await res.json();
        if (res.ok) {
            lifeData.forEach(stat => {
                lifeChartMan.push(stat.lifeExpectancyMan);
                lifeChartWoman.push(stat.lifeExpectancyWoman);
                provinces.push(stat.province);
            });
        }
      
      console.log("Life Expectancy Chart Data: " + lifeChartData);

            var provincias = provinces


            Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Esperanza de vida por comunidades en España 2017'
            },
            subtitle: {
                text: 'Source: <a href="https://datosmacro.expansion.com/demografia/esperanza-vida/espana-comunidades-autonomas">datosmacro.com</a>'
            },
            xAxis: {
                categories: provincias,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                max: 120,
                title: {
                    text: 'Edad (Años)',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Hombres',
                data: lifeChartMan,
            }, {
                name: 'Mujeres',
                data: lifeChartWoman
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
          Representación de la esperanza de vida en hombres y mujeres por comunidades. (Gráfica creada con Highcharts)
        </p>
      </figure>
    </div>
    <a href="#/life-stats"><Button outline color="primary">Volver</Button></a>
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
    .highcharts-figure, .highcharts-data-table table {
        min-width: 310px; 
        max-width: 800px;
        margin: 1em auto;
    }

    #container {
        height: 500px;
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