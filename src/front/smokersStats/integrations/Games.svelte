<script>
    import * as JSC from "jscharting";
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    //ALERTAS
    let visible = false;
    let color = "danger";
    var checkMSG = "";

    //Uso API Canadá
    const BASE_GAMES_API_PATH = "https://www.freetogame.com/api/games";
    const BASE_SMOKERS_PATH = "/api/v3/smokers-stats";

    //Variables SMOKER
    var smokersData = [];
    var smokerChartProvince = [];
    var smokerChartDaily = [];

    //Variables GAMES
    var gamesData = [];
    var gamesName = [];
    var gamesFecha = [];
    var gamesPlatform = [];
    var gamesGenre = [];
    var gamesPublisher = [];

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
    //GET games
    async function getGames() {
        const res = await fetch(BASE_GAMES_API_PATH);
        if (res.ok) {
            gamesData = await res.json();
            console.log("Received Games Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de GAMES-API");
        }
    }

    //LOAD
    async function loadGraph() {
        await getSmoker();
        await getgames();
        console.log("Nº datos smoker recibidos para pintar: " + smokersData.length);
        console.log("Nº datos games recibidos para pintar: " + gamesData.length);

        //Gestión de datos de ambas apis y reparto en variables
        smokersData.forEach((stat) => {
            smokerChartProvince.push(stat.province);
            smokerChartDaily.push(stat["dailySmoker"]);
        });

        
        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }
        
        gamesData.forEach((stat) => {
            gamesFecha.push(stat.release_date.valueOf());  //extraemos las fechas de lanzamiento
            gamesName.push(stat.title.valueOf());    //extraemos el nombre de cada juego
            gamesGenre.push(stat.genre.valueOf());    //extraemos el género
            gamesPlatform.push(stat.platform.valueOf());  //extraemos la plataforma
            gamesPublisher.push(stat.publisher.valueOf());
            });

        console.log(gamesFecha);
        console.log(gamesNameFiesta);
        console.log(gamesProvinceNum);
        

        //Tratamiento de datos
        // dataFin será donde acaben estando los datos a representar
        for (let i=0; i<gamesData.holidays.length; i++){
            let tablaAux = [];
            tablaAux.push(gamesFecha[i]);
            tablaAux.push(gamesProvinceNum[i]);
            dataFin.push(tablaAux);
        }

        console.log(dataFin);

        //Una vez cargados los datos en las variables, podemos instanciar la función mostrarDatos
        await mostrarDatos();

        //Convierte los datos en un gráfico 
        var chart = JSC.chart('chartDiv', { 
            debug: true, 
            type: 'marker', 
            title_label_text: 'Días de vacaciones en Canadá (por nº de provincias festivas)', 
            legend_visible: false, 
            defaultSeries: { 
                opacity: 0.5, 
                defaultPoint_marker: { size: 40 } 
            }, 
            xAxis: { 
                scale: { range_padding: 0.2 }, 
                scale_type: 'time'
            },

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
        for (let i=0; i<gamesData.holidays.valueOf().length;i++){
            let linea = new Object();
            linea.Fiesta = gamesNameFiesta[i];
            linea.Fecha = formatea(gamesFecha[i]);
            gamesMostrar.push(linea);
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
		gamesMostrar = gamesMostrar.sort(sort);
	}
	
	
</script>

<main>
    <div>
        {#if checkMSG.length!=0}
          <p class="msgRed" style="color: #9d1c24">ERROR: {checkMSG}</p>
        {/if}
      </div>

    <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto"/>
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
            {#each gamesMostrar as row}
                <tr>
                    <td>{row.Fiesta}</td>
                    <td>{row.Fecha}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    <br>
    <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>

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