<script>

    import zingchart from "zingchart/es6";
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    //ALERTAS
    let visible = false;
    let color = "danger";
    var checkMSG = "";

    //Uso API Canadá
    const BASE_AIR_API_PATH = "https://iata-and-icao-codes.p.rapidapi.com/airlines";
    const BASE_SMOKERS_PATH = "/api/v3/smokers-stats";

    //Variables SMOKER
    var smokersData = [];
    var smokerChartProvince = [];
    var smokerChartDaily = [];

    //Variables AIR
    var airData = [];
    var airCompany = [];
    var airIata = [];
    var airIcao = [];
    var airMostrar = [];

 
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
    //GET BIKEWISE
    async function getBikes() {
        const res = await fetch(BASE_AIR_API_PATH, {
          headers: {
            "x-rapidapi-key": "6cbbc0122amsh6f393ab96de4d0bp1b8d19jsn7bdcc295e8c3",
	          "x-rapidapi-host": "iata-and-icao-codes.p.rapidapi.com",
	          "useQueryString": true
          }
        });

        if (res.ok) {
            airData = await res.json();
            console.log("Received Bikes Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de AIRLINES-API");
        }
    }

    

    //LOAD
    async function loadGraph() {
        await getSmoker();
        await getBikes();
        
        console.log("Nº datos smoker recibidos para pintar: " + smokersData.length);
        console.log("Nº datos airlines recibidos para pintar: " + airData.length);

        //Gestión de datos de ambas apis y reparto en variables
        smokersData.forEach((stat) => {
            smokerChartProvince.push(stat.province);
            smokerChartDaily.push(stat["dailySmoker"]);
        });
        //
        airData.forEach((stat) => {
            airCompany.push(stat.name);
            airIata.push(stat.iata_code);
            airIcao.push(stat.icao_code);
        });

        console.log(airData);
        
        
        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }

        ///////////////////////////////////////////////Tratamiento de datos
        
        var airNames = Array.from(new Set(airCompany));   //eliminamos los géneros repetidos

        //tablas que proporcionan cuantas aerolineas tienen esa palabra en su nombre
        var airlines = [];
        var express = [];
        var airways = [];
        var air = [];
        var aviation = [];
        var company = [];

        airNames.forEach(stat => {

          if(stat.toLowerCase().includes("airlines")){
            airlines.push(stat);
          } else if (stat.toLowerCase().includes("express")){
            express.push(stat);
          } else if (stat.toLowerCase().includes("airways")){
            airways.push(stat);
          } else if(stat.toLowerCase().includes("air")){
            air.push(stat);
          } else if(stat.toLowerCase().includes("aviation")){
            aviation.push(stat);
          } else if(stat.toLowerCase().includes("fly")){
            company.push(stat);
          }

        });
        
        
        //Una vez cargados los datos en las variables, podemos instanciar la función mostrarDatos
        await mostrarDatos();

        /////////////////////////////////GRAPH
  let chartConfig = {
    type: 'ring',
    title: {
      text: "Número de Aerolíneas"
    },
    subtitle: {
      text: "con la palabra indicada en su nombre",
      color: "#7CA82B",
      'font-style': "Georgia",
      'font-size': 14
    },
    source: {
      text: "Gráfico ZingChart"
    },
    legend: {
      align: 'center',
      borderWidth: '0px',
      item: {
        cursor: 'pointer',
        fontSize: '15px',
        offsetX: '-5px'
      },
      layout: 'vertical',
      marker: {
        type: 'circle',
        cursor: 'pointer',
        size: '10px'
      },
      toggleAction: 'remove', // remove plot so it re-calculates percentage
      verticalAlign: 'middle'
    },
    plot: {
      detached: false, // turn off click on slices
      slice: 150 // set hole size in middle of chart
    },
    tooltip: {
      visible: false
    },
    series: [
      {
        text: 'Contiene "Airline"',
        values: [airlines.length],
        backgroundColor: '#FE7A5D'
      },
      {
        text: 'Contiene "Express"',
        values: [express.length],
        backgroundColor: '#69A8F8'
      },
      {
        text: 'Contiene "Airways"',
        values: [airways.length],
        backgroundColor: '#54DBB9'
      },
      {
        text: 'Contiene "Air"',
        values: [air.length],
        backgroundColor: '#FEDA60'
      },
      {
        text: 'Contiene "Aviation"',
        values: [aviation.length],
        backgroundColor: '#D291BC'
      }
    ]
  };

  zingchart.render({
    id: 'myChart',
    data: chartConfig,
    height: '100%',
    width: '100%',
  });

//Cada 40 ms se actualiza el ángulo del gráfico para simular rotación
  let angle = 0;
  setInterval(function () {
    angle = angle + 1.5;
    zingchart.exec('myChart', 'modify', {
      object: 'plot',
      data: {
        refAngle: angle % 360
      }
    });
  }, 40);

  }
    //Llamada a la función 
    loadGraph();
    

 //Función para mostrar los datos debajo del gráfico JSCharting
 async function mostrarDatos(){
        for (let i=0; i<airData.length; i++){
            let linea = new Object();
            linea.Nombre = airCompany[i];
            linea.Iata = airIata[i];
            linea.Icao = airIcao[i];
            airMostrar.push(linea);
        }
    }
    
    // Holds table sort state.  Initialized to reflect table sorted by id column ascending.
    // Necesario para poder ordenar las columnas alfanuméricamente al hacer click
	let sortBy = {col: "Nombre", ascending: true};
	$: sort = (column) => {
		
		if (sortBy.col == column) {
			sortBy.ascending = !sortBy.ascending
		} else {
			sortBy.col = column
			sortBy.ascending = true
		}
		
		let sortModifier = (sortBy.ascending) ? 1 : -1;
		let sort = (a, b) => (a[column] < b[column]) ? -1 * sortModifier : (a[column] > b[column]) ? 1 * sortModifier : 0;
		airMostrar = airMostrar.sort(sort);
	}
	

</script>

<main>
    <div>
        {#if checkMSG.length!=0}
          <p class="msgRed" style="color: #9d1c24">ERROR: {checkMSG}</p>
        {/if}
      </div>

      <head>
        <meta charset="utf-8">
        <title>ZingSoft Demo</title>
        <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
      </head>
      <body>
        <div id="myChart" class="chart--container">
          <a class="zc-ref" href="https://www.zingchart.com/">Powered by ZingChart</a>
        </div>
      </body>
    <br>  
    <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>
    <br>
    <br>
    <p>Haz click en el título para mostrar la tabla ordenada</p>
    <br>
    <table align="center">
        <thead>
            <tr>
                <th on:click={sort("Nombre")}>Nombre de la aerolínea</th>
                <th on:click={sort("Iata")}>Código IATA</th>
                <th on:click={sort("Icao")}>Código ICAO</th>
            </tr>
        </thead>
        <tbody>
            {#each airMostrar as row}
                <tr>
                    <td>{row.Nombre}</td>
                    <td>{row.Iata}</td>
                    <td>{row.Icao}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    <br>


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
        background-color: #ffffff;
      }
      table, th, td {
		border: 1px solid black;
		border-collapse: collapse;
	}
	  table {
		  background: #eee;
		  width: 50%;
		  text-align: center;
	  }
    .chart--container {
      min-height: 530px;
      width: 100%;
      height: 100%;
    } 

    .zc-ref {
      display: none;
    }
  </style>