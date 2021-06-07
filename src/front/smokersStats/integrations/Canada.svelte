<script>
    import * as JSC from "jscharting";
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    //ALERTAS
    let visible = false;
    let color = "danger";
    var checkMSG = "";

    //Uso API Canadá
    const BASE_CANADA_API_PATH = "https://canada-holidays.ca/api/v1/holidays";
    const BASE_SMOKERS_PATH = "/api/v3/smokers-stats";

    //Variables SMOKER
    var smokersData = [];
    var smokerChartProvince = [];
    var smokerChartDaily = [];

    //Variables CANADA
    var canadaData = [];
    var canadaNameFiesta = [];
    var canadaFecha = [];
    //var canadaProvince = [];
    var canadaProvinceNum = [];
    var canadaMostrar = [];

    //Variables globales
    var dataFin = [];

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
    //GET CANADA
    async function getCanada() {
        const res = await fetch(BASE_CANADA_API_PATH);
        if (res.ok) {
            canadaData = await res.json();
            console.log("Received Canada Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de CANADA-API");
        }
    }

    //LOAD
    async function loadGraph() {
        await getSmoker();
        await getCanada();
        console.log("Nº datos smoker recibidos para pintar: " + smokersData.length);
        console.log("Nº datos canada recibidos para pintar: " + canadaData.holidays.length);

        //Gestión de datos de ambas apis y reparto en variables
        smokersData.forEach((stat) => {
            smokerChartProvince.push(stat.province);
            smokerChartDaily.push(stat["dailySmoker"]);
        });
        //
        canadaData.holidays.forEach((stat) => {
            canadaFecha.push(stat.date.valueOf());  //extraemos las fechas de las fiestas
            canadaNameFiesta.push(stat.nameEn.valueOf());    //extraemos el nombre de cada fiesta
            canadaProvinceNum.push(stat.provinces.valueOf().length);    //extraemos el numero de provincias que celebran
        });
        
        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }
        
        console.log(canadaFecha);
        console.log(canadaNameFiesta);
        console.log(canadaProvinceNum);
        

        ///////////////////////////////////////////////Tratamiento de datos
        // dataFin=[[]] será donde acaben estando los datos a representar
        for (let i=0; i<canadaData.holidays.length; i++){
            let tablaAux = [];
            tablaAux.push(canadaFecha[i]);
            tablaAux.push(canadaProvinceNum[i]);
            dataFin.push(tablaAux);
        }
        console.log(dataFin);

        //Una vez cargados los datos en las variables, podemos instanciar la función mostrarDatos
        await mostrarDatos();

        /////////////////////////////////GRAPH
        //Convierte los datos en un gráfico 
        var chart = JSC.chart('chartDiv', { 
            debug: false, 
            type: 'marker', 
            title_label_text: 'Días de vacaciones en regiones de Canadá', 
            legend_visible: false, 
            defaultSeries: { 
                opacity: 0.5, 
                defaultPoint_marker: { size: 40 } 
            }, 
            xAxis: { 
                scale: { range_padding: 0.2 }, 
                scale_type: 'time'
            },
            yAxis_label_text: 'Nº de provincias',

            toolbar_items: { 
                'Marker Type': { 
                type: 'select', 
                label_style_fontSize: 13, 
                margin: 5, 
                value: 'diamond',
                items: 'enum_markerTypes', 
                events_change: function(val) { 
                    chart 
                    .series() 
                    .options({ 
                        defaultPoint_marker_type: val 
                    }); 
                } 
                } 
            }, 
            series: [ 
                { 
                palette: 'oceanMidtones', 
                defaultPoint_marker_type: 'diamond',
                name: 'Número de provincias', 
                points: dataFin 
                } 
            ]
            }); 
            
    }

    //Llamada a la función 
    loadGraph();

    //Función para cambiar el formato de las fechas
    function formatea(texto){
        return texto.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1');
    }
    
    //Función para mostrar los datos debajo del gráfico JSCharting
    async function mostrarDatos(){
        for (let i=0; i<canadaData.holidays.valueOf().length;i++){
            let linea = new Object();
            linea.Fiesta = canadaNameFiesta[i];
            linea.Fecha = formatea(canadaFecha[i]);
            canadaMostrar.push(linea);
        }
    }
    
    // Holds table sort state.  Initialized to reflect table sorted by id column ascending.
    // Necesario para poder ordenar las columnas alfanuméricamente al hacer click
	let sortBy = {col: "Fiesta", ascending: true};
	$: sort = (column) => {
		
		if (sortBy.col == column) {
			sortBy.ascending = !sortBy.ascending
		} else {
			sortBy.col = column
			sortBy.ascending = true
		}
		
		// Modifier to sorting function for ascending or descending
		let sortModifier = (sortBy.ascending) ? 1 : -1;
		let sort = (a, b) => (a[column] < b[column]) ? -1 * sortModifier : (a[column] > b[column]) ? 1 * sortModifier : 0;
		canadaMostrar = canadaMostrar.sort(sort);
	}
	
	
</script>

<main  style= "background-image: url('images/fondoCan.png'); background-repeat: no-repeat; background-position: center;">
    <div>
        {#if checkMSG.length!=0}
          <p class="msgRed" style="color: #9d1c24">ERROR: {checkMSG}</p>
        {/if}
      </div>

    <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto"/>
    <br>
    <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>
    <br>
    <br>
    <p>Haz click en el título para mostrar la tabla ordenada</p>
    <br>
    <table align="center">
        <thead>
            <tr>
                <th on:click={sort("Fiesta")}>Día festivo</th>
                <th on:click={sort("Fecha")}>Fecha del día festivo</th>
            </tr>
        </thead>
        <tbody>
            {#each canadaMostrar as row}
                <tr>
                    <td>{row.Fiesta}</td>
                    <td>{row.Fecha}</td>
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
  
  </style>