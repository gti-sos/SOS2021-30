<script>
    import { pop }from "svelte-spa-router";
    import {Button} from "sveltestrap";
    import Chart from 'chart.js/auto';
    const BASE_API_PATH = "/api/v2/life-expectancy-stats";
    let lifeData = [];
    let lifeChartData = [];
    let lifeChartCountryProvinceYear = [];
    let lifeChartLifeExpectancyWoman = [];
    let lifeChartLifeExpectancyMan = [];
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
            lifeChartLifeExpectancyWoman.push(stat.lifeExpectancyWoman);
            lifeChartLifeExpectancyMan.push(stat.lifeExpectancyMan);
            lifeChartAverageLifeExpectancy.push(stat.averageLifeExpectancy);
            provinces.push(stat.province);
        });
      }
      
      console.log("Life Expectancy Chart Data: " + lifeChartData);
      



        const labels = lifeChartCountryProvinceYear;
        const data = {
        labels: labels,
        datasets: [            {
            label: 'Hombres',
            data: lifeChartLifeExpectancyMan,
            borderColor: 'rgba(0, 66, 255,  0.8)',
            backgroundColor: 'rgba(76, 123, 255,  0.5)',
            fill: true
            },
            {
            label: 'Mujeres',
            data: lifeChartLifeExpectancyWoman,
            borderColor: 'rgba(2255, 0, 0 , 0.8)',
            backgroundColor: 'rgba(255, 82, 82 , 0.5)',
            fill: true
            },            {
            label: 'Media',
            data: lifeChartAverageLifeExpectancy,
            borderColor: 'rgba(0, 255, 40, 0.8)',
            backgroundColor: 'rgba(78, 255, 106, 0.5)',
            fill: true
            }

        ]
        };




        var ctx = document.getElementById('myChart');

        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Esperanza de vida por comunidades en España 2017'
                }
                }
            },scales: {
                x: {
                    display: true,
                    title: {
                    display: true,
                    text: 'País/Provincia/Año'
                    }
                },
                y: {
                    display: true,
                    title: {
                    display: true,
                    text: 'Edad(Años)'
                    }
                }
            }
            });






    }
  </script>

  <svelte:head>
    <script src="https://github.com/chartjs/Chart.js/blob/master/docs/scripts/utils.js"></script>
    <script
      src="https://cdn.jsdelivr.net/npm/chart.js"
      on:load={loadGraphic}></script>
  </svelte:head>

  <main>
    <div>
      <h2>
        Gráfico
      </h2>
    </div>
        <canvas id="myChart" width="400" height="400"></canvas>
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
          Representación en columnas de la esperanza de vida por País,Comunidad y Año
          en mujeres, hombres y la media. (Gráfica creada con Chart.js)
        </p>
      </figure>
    </div>
    <a href="#/life-stats"><Button outline color="primary"  on:click={pop}>Volver</Button></a>
  </main>
  
  <style>
    #myChart{
      font-family: Verdana, sans-serif;
      margin: 10px auto;
      text-align: center;
      width: 100%;
      max-width: 1000px;
      height: 100%;
      max-height: 550px;
    }
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