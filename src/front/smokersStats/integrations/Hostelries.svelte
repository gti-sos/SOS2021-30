<script>
    import * as JSC from "jscharting";
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    //ALERTAS
    let visible = false;
    let color = "danger";
    var checkMSG = "";

    //Constantes
    const BASE_HOSTEL_API_PATH = "https://sos2021-26.herokuapp.com/proxy/api/v2/hostelries";
    const BASE_SMOKERS_PATH = "/api/v3/smokers-stats";

    //Variables SMOKER
    var smokersData = [];
    var smokerChartProvince = [];
    var smokerChartDaily = [];
    //Variables RENTAL
    var hostelData = [];
    var hostelProvince = [];
    var hostelSites = [];

    console.log("Cargando datos...");

    //GET SMOKER
    async function getSmoker() {
        const res = await fetch(BASE_SMOKERS_PATH);
        if (res.ok) {
            smokersData = await res.json();
            console.log("Received Smokers Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de SMOKERS");
        }
    }
    //GET HOSTELRIES
    async function getHostel() {
        const res = await fetch(BASE_HOSTEL_API_PATH);
        if (res.ok) {
            hostelData = await res.json();
            console.log("Received hostelries Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de HOSTELRIES");
        }
    }


    //LOADGRAPH
    async function loadGraph() {
        await getSmoker();
        await getHostel();
        console.log("Datos recibidos para pintar smoker: "+smokersData.length);
        console.log("Datos recibidos para pintar hostelries: "+hostelData.length);

        smokersData.forEach((stat) => {
            smokerChartProvince.push(stat.province);
            smokerChartDaily.push(stat["dailySmoker"]);
        });

        hostelData.forEach((stat) => {
            hostelProvince.push(stat.district);
            hostelSites.push(stat["establishment_open"]);
        })


        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }

        //Tratamiento de datos


        //Convert data to serieSmoker
        var serieSmoker = JSC.nest()
            .key("province") // X values
            .pointRollup(function (key, value) {
                return {
                    x: key,
                    y: JSC.sum(value, "dailySmoker"),
                };
            }) // Y values
            .series(smokersData); // Generate series

        //Convert data to serieRental
        var serieHostel = JSC.nest()
            .key("district") // X values
            .pointRollup(function (key, value) {
                return {
                    x: key,
                    y: JSC.sum(value, "establishment_open"),
                };
            }) // Y values
            .series(smokersData); // Generate series
        
            
        //Convert data to series array.
        var chart = JSC.chart('chartDiv', {
        debug: true,
        type: 'bubble',
        defaultSeries_size_max: '40%',
        xAxis_formatString: 'n1',
        annotations: [
          {
            label: { text: 'Data shown represents regional averages' },
            position: 'inside bottom left'
          }
        ],
        defaultPoint: {
          tooltip:
            '<b>%name</b> <br/>Population: <b>{%zValue/1000000} Mil</b><br/>Fertility Rate: <b>{%yValue:n2}</b><br/>Life Expectancy:<b> %xValue</b>',
          label_text: '%code'
        },
        legend: {
          position: 'bottom',
          template: '%icon,%name,{%zSum/1000000}M,{%yAverage:n2},{%xAverage:n2}',
          header: ',Region,Population,Fertility Rate,Life Expectancy'
        },
        title: {
          label_text: 'Correlation between life expectancy, fertility rate, and population.'
        },
        xAxis_label_text: 'Life Expectancy',
        yAxis_label_text: 'Fertility Rate',
        series: [
          {
            name: 'Eastern Asia',
            points: [
              {
                name: 'China',
                x: 74.99,
                y: 1.55,
                z: 254547,
                attributes: { code: 'CHN' }
              },
              {
                name: 'Japan',
                x: 84.19,
                y: 1.39,
                z: 127253075,
                attributes: { code: 'JPN' }
              }
            ]
          },
          {
            name: 'South-Central Asia',
            points: [
              {
                name: 'India',
                x: 67.48,
                y: 2.55,
                z: 1220800359,
                attributes: { code: 'IND' }
              },
              {
                name: 'Pakistan',
                x: 66.71,
                y: 2.96,
                z: 193238868,
                attributes: { code: 'PAK' }
              },
              {
                name: 'Bangladesh',
                x: 70.36,
                y: 2.5,
                z: 163654860,
                attributes: { code: 'BGD' }
              }
            ]
          },
          {
            name: 'North America',
            points: [
              {
                name: 'United States',
                x: 78.62,
                y: 2.06,
                z: 316438601,
                attributes: { code: 'USA' }
              },
              {
                name: 'Mexico',
                x: 76.86,
                y: 2.25,
                z: 118818228,
                attributes: { code: 'MEX' }
              }
            ]
          },
        ]
      });
    }

loadGraph();
</script>

<main>
    <div id="chartDiv" style="max-width: 770px; height: 600px; margin: 0px auto;"></div>
    <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>

</main>
