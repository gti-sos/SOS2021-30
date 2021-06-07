<script>
    import { pop }from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";


    var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    var BASE_SMOKERS_PATH = "/api/v3/smokers-stats";
    var BASE_ALCOHOL_PATH = "/api/v2/alcohol-consumption-stats";
    var BASE_LIFE_PATH = "/api/v2/life-expectancy-stats";

    let weightData = [];
    let weightChartInfo = [];
    let weightchartNormalWeight = [];

    
    let smokersData = [];
    let smokerChartInfo = [];
    let smokerChartDaily = [];
    //auxiliar para porcentajes
    let smokerChartPercent = [];

    let alcoholData = [];
    let alcoholChartInfo = [];
    let alcoholChartPrematureDeath = [];

    let lifeData = [];
    let lifeChartInfo = [];
    let lifeChartAverageLifeExpectancy = [];

    async function loadGraph(){
        console.log("Fetching graphic data...");
        

        // UNA CONST POR API
        const resWeight = await fetch(BASE_WEIGHTS_PATH);
        const resSmokers = await fetch(BASE_SMOKERS_PATH);
        const resAlcohol = await fetch(BASE_ALCOHOL_PATH);
        const resLife = await fetch(BASE_LIFE_PATH);
         
        
        // UN AWAIT POR CADA CONST
        weightData = await resWeight.json();
        smokersData = await resSmokers.json();
        alcoholData = await resAlcohol.json();
        lifeData = await resLife.json();
        
     
        console.log("procesing all data....");

        if((resWeight || resSmokers || resAlcohol || resLife) == 0){
            console.log("ERROR MSG");
            alert("Por favor, primero cargue los datos de alguna API");
            pop();
        }
     
        // CONDICIONES PARA CADA API CON UNA VARIABLE BASADA EN EL PORCENTAJE
        //WEIGHTS-STATS
        if(resWeight.ok){
            weightData.forEach(stat => {
                if(stat.year == "2017"){
                weightChartInfo.push(stat.provinces+"/"+stat.year);
                weightchartNormalWeight.push(stat["normal_weight"]);
                }
                //AÑADIR UN DATO DE CADA UNA DE LAS APIs (preferiblemente un porcentaje para que todo tenga relacion y se vea bien el grafico)
            });
        }
        //SMOKERS-STATS
        if(resSmokers.ok){
            smokersData.forEach(stat => {
                if(stat.year == "2017"){
                smokerChartInfo.push(stat.province+"/"+stat.year);
                smokerChartDaily.push(stat["dailySmoker"]);
                }
                smokerChartDaily.sort();
            });
        }
        //ALCOHOL-STATS
        if (resAlcohol.ok) {
            alcoholData.forEach(stat =>{
                if(stat.year == "2017"){
                alcoholChartInfo.push(stat.country+"/"+stat.year);
                alcoholChartPrematureDeath.push(stat["alcoholPrematureDeath"]);
                }
            })
        }
        //LIFE-STATS
        if(resLife.ok){
            lifeData.forEach(stat => {
                if(stat.year == "2017"){
                lifeChartInfo.push(stat.province+"/"+stat.year);
                lifeChartAverageLifeExpectancy.push(stat["averageLifeExpectancy"]);
                }

            });
        }

        // ADAPTACIÓN DE DATOS SMOKER PUROS A PORCENTAJES REALES PARA REPRESENTACIÓN, SEGÚN POBLACIÓN DE CADA COMUNIDAD //
        let i = 0;
        while (i < smokerChartDaily.length){
            switch (smokerChartDaily[i]){
                case 1902219.14:
                    smokerChartPercent[i] =  22.47;
                    break;
                case 315408.75:
                    smokerChartPercent[i] =  23.72;
                    break;
                case 246320.48:
                    smokerChartPercent[i] =  24.17;
                    break;
                case 132887.56:
                    smokerChartPercent[i] =  22.80;
                    break;
                case 550656.83:
                    smokerChartPercent[i] =  23.00;
                    break;
                case 499743.83:
                    smokerChartPercent[i] =  24.43;
                    break;
                case 1700061.75:
                    smokerChartPercent[i] =  21.85;
                    break;
                case 1225494.23:
                    smokerChartPercent[i] =  24.23;
                    break;
                case 258100.88:
                    smokerChartPercent[i] =  24.25;
                    break;
                case 482084.34:
                    smokerChartPercent[i] =  17.84;
                    break;
                case 1236364.96:
                    smokerChartPercent[i] =  18.23;
                    break;
                case 131219.74:
                    smokerChartPercent[i] =  19.84;
                    break;
                case 434443.28:
                    smokerChartPercent[i] =  19.56;
                    break;
                default:
                    smokerChartPercent[i] = 22.00; //media
            }
            i++;
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////

      if (weightChartInfo.length == 0 && smokerChartInfo.length == 0 && alcoholChartInfo.length == 0 && lifeChartInfo.length == 0) {
        console.log("ERROR MSG");
        alert("Por favor primero cargue los datos en al menos una de las APIs");
        pop();
      }

        //ADMIN GRAFICA
        console.log("Generando datos...");
        Highcharts.chart('container', {
            chart: {
                type: 'lollipop'
            },
            title: {
                text: 'Gráfica conjunta España'
            },
            xAxis: {
                allowDecimals: false,  
                title: {
                    text: 'Comunidad Autónoma/año'
                },
                categories: lifeChartInfo,
            },
            yAxis: {
                title: {
                    text: 'Valores'
                },
            },
            series: [{
                name: 'Esperanza de vida (años)',
                data: lifeChartAverageLifeExpectancy
            }, {
                name: 'Muertes prematuras por alcohol',
                data: alcoholChartPrematureDeath
            }, {
                name: 'Fumadores diarios (%)',
                data: smokerChartPercent
            }, {
                name: 'Peso normal (kg)',
                data: weightchartNormalWeight
            }]
        });
    }


     
</script>

<svelte:head>

  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/series-label.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/dumbbell.js"></script>
  <script src="https://code.highcharts.com/modules/lollipop.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>

</svelte:head>


<main>

  <figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
      Gráfico en el que se representa la esperanza de vida media, el porcentaje de fumadores diarios, el peso normal y el numero de muertes por alcohol por comunidades autónomas en el año 2017
    </p>
  </figure>

  <p align="center"><Button outline color="secondary" on:click="{pop}">Atrás</Button></p>
 
</main>

<style>
        .highcharts-figure, .highcharts-data-table table {
            min-width: 320px; 
            max-width: 800px;
            margin: 1em auto;
        }

        #container {
            height: 450px;
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