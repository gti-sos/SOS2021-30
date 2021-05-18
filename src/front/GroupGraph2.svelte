<script>
    import { Button, Nav, NavItem, NavLink } from "sveltestrap";
    
    var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    var BASE_SMOKERS_PATH = "/api/v2/smokers-stats";
    var BASE_ALCOHOL_PATH = "/api/v2/alcohol-consumption-stats";
    var BASE_LIFE_PATH = "/api/v2/life-expectancy-stats";

    let weightData = [];
    let weightchartNormalWeight = [];
    let smokersData = [];
    let smokersChartPercent = [];
    let alcoholData=[];
    let alcoholChartPrematureDeath = [];
    var provinces = [];
    let msg = "";
    function distinctRecords(MYJSON, prop) {
      return MYJSON.filter((obj, pos, arr) => {
        return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
    }
    async function loadChart() {
      console.log("Fetching data...");
      const res = await fetch(BASE_WEIGHTS_PATH);
      const res1 = await fetch(BASE_SMOKERS_PATH);
      const res2 = await fetch(BASE_ALCOHOL_PATH);
      if (res.ok || res1.ok || res2.ok) {
        console.log("procesing school data....");
        if (res1.ok) {
          smokersData = await res1.json();
          console.log("RES OK");
          //Quitamos fechas repetidas y las ordenamos
          var distinctprovinces1 = distinctRecords(smokersData, "province");
          distinctprovinces1.sort(function (a, b) {
            return a.province - b.province;
          });
          distinctprovinces1.forEach((element) => {
            provinces.push(element.province);
            console.log("provinces: " + element.province);
          });
          console.log("Distinct provinces: " + provinces);
          //Sumamos los valores para las fechas iguales
         
          provinces.forEach((e) => {
            var yAxis = smokersData
              .filter((d) => d.province === e)
              .map((dr) => dr["dailySmoker"])
              .reduce((acc, dr) => dr + acc);
            console.log("YAxis: " + yAxis);
            smokersChartPercent.push(Math.round(yAxis));
          });
          msg = "";
        }
        console.log("procesing HIV data....");
        if (res.ok) {
          weightData = await res.json();
          console.log("RES OK");
          //Quitamos fechas repetidas y las ordenamos
          var distinctprovinces = distinctRecords(weightData, "provinces");
          distinctprovinces.sort(function (a, b) {
            return a.province - b.province;
          });
          distinctprovinces.forEach((element) => {
            if (!provinces.includes(element.province)) {
              provinces.push(element.province);
              console.log("provinces: " + element.province);
            }
          });
          console.log("Distinct provinces: " + provinces);
          //Sumamos los valores para las fechas iguales
          
          
          //weightchartNormalWeight.push("");
          
          provinces.forEach((e) => {
            var yAxis = weightData
              .filter((d) => d.province === e)
              .map((nr) => nr["normal_weight"])
              .reduce((acc, nr) => nr + acc,0);
            console.log("YAxis: " + yAxis);
            weightchartNormalWeight.push(Math.round(yAxis));
            
          });
          msg = "";
        }
        if(res2.ok){
          alcoholData = await res2.json();
          console.log("RES2 OK");
          //Quitamos fechas repetidas y las ordenamos
          var distinctprovinces = distinctRecords(alcoholData, "provinces");
          distinctprovinces.sort(function (a, b) {
            return a.province - b.province;
          });
          distinctprovinces.forEach((element) => {
            if (!provinces.includes(element.province)) {
              provinces.push(element.province);
              console.log("provinces: " + element.province);
            }
          });
          console.log("Distinct provinces: " + provinces);
          //Sumamos los valores para las fechas iguales         
          provinces.forEach((e) => {
            var yAxis = alcoholData
              .filter((d) => d.province === e)
              .map((qli) => qli["alcoholPrematureDeath"])
              .reduce((acc, qli) => qli + acc,0);
            console.log("YAxis: " + yAxis);
            alcoholChartPrematureDeath.push(Math.round(yAxis));
            
          });
          msg = "";
        }
      } else {
        console.log("ERROR MSG");
        msg = "Por favor primero cargue los datos en al menos una de las APIs";
      }
      console.log("Smokers: " + smokersChartPercent);
      console.log("Weights: " + weightchartNormalWeight);
      console.log("Alcohol: " + alcoholChartPrematureDeath);
      Highcharts.chart("container", {
        title: {
          text: "Smokers || Weights || Alcohol",
        },
        yAxis: {
          title: {
            text: "Ratio",
          },
        },
        xAxis: {
          title: {
            text: "Años",
          },
          categories: provinces,
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
                point: "province",
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
            name: "Weights",
            data: weightchartNormalWeight,
          },
          {
            name: "Smokers",
            data: smokersChartPercent,
          },
          {
            name: "Alcohol",
            data: alcoholChartPrematureDeath,
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
      <h1>Gráfica Común</h1>
    </div>
  
    {#if msg}
      <p>{msg}</p>
    {:else}
      <figure class="highcharts-figure">
        <div id="container" />
        <p class="highcharts-description">
          Gráfico de líneas básico que muestra la correlación entre:<br> 
          - El total de niños/as que abanandonan la escuela<br>
          - El total de niños/as que están infectados por VIH<br> 
          - El total de niños/as que están empleados.
        </p>
      </figure>
    {/if}
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
  </style>