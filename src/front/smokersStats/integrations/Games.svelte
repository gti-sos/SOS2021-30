<script>
    import * as JSC from "jscharting";
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    //ALERTAS
    let visible = false;
    let color = "danger";
    var checkMSG = "";

    //Uso API Canadá
    const BASE_GAMES_API_PATH = "https://free-to-play-games-database.p.rapidapi.com/api/games";
    const BASE_SMOKERS_PATH = "/api/v3/smokers-stats";

    //Variables SMOKER
    var smokersData = [];
    var smokerChartProvince = [];
    var smokerChartDaily = [];

    //Variables GAMES
    var gamesData = [];
    var gamesName = [];
    var gamesFecha = [];
    var gamesGenre = [];
    var gamePlatform = [];
    var gamesMostrar = [];

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
    
    //GET GAMES (cabeceras necesarias para poder obtener los datos)
    async function getGames() {
        const res = await fetch(BASE_GAMES_API_PATH, {
            headers: {
                'x-rapidapi-key': '6cbbc0122amsh6f393ab96de4d0bp1b8d19jsn7bdcc295e8c3',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com',
                useQueryString: true
            }
        });

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
        await getGames();
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
            gamePlatform.push(stat.platform.valueOf());     //extraemos la plataforma
            });

            
       ///////////////////////////////////////////////Tratamiento de datos
        var genreFine = Array.from(new Set(gamesGenre));   //eliminamos los géneros repetidos
        

        //Al final quedan todos los objetos en un array dataFin=[obj], que será la serie del gráfico. points = [obj]. 
        for (let i=0; i<genreFine.length; i++){
            let objData = new Object();
            let points = [];
            objData.name = genreFine[i];
            for (let j=0; j<gamesData.length; j++){
                if (genreFine[i] == gamesData[j].genre){
                    let objPoint = new Object();
                    objPoint.x = gamesData[j].release_date;
                    objPoint.y = gamesData[j].platform;
                    points.push(objPoint);
                } 
            }
            objData.points = points;
            dataFin.push(objData);

        }
        console.log(dataFin);


        //Una vez cargados los datos en las variables, podemos instanciar la función mostrarDatos
        await mostrarDatos();
        
    /////////////////////////////////GRAPH
        //Convierte los datos en un gráfico 
        var chart = JSC.chart('chartDiv', { 
  debug: true, 
  defaultSeries_type: 'marker',
  title_label_text: 'Juegos publicados en la web www.freetogame.com',
  legend: {
          position: 'right',
          fill: '#f1f8ff',
          boxVisible: true,
          radius: 2,
          margin_left: 20,
          outline: { color: '#a5c6ee', width: 0.5 },
          template: '%icon %name',
        },
  yAxis: { label_text: 'Plataforma de lanzamiento' }, 
  xAxis_scale_type: 'time',
  series: dataFin
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
        for (let i=0; i<gamesData.length; i++){
            let linea = new Object();
            linea.Nombre = gamesName[i];
            linea.Genero = gamesGenre[i];
            linea.Fecha = gamesFecha[i];
            gamesMostrar.push(linea);
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
		gamesMostrar = gamesMostrar.sort(sort);
	}
	
	
</script>

<main style= "background-image: url('images/games.png'); background-repeat: no-repeat; background-position: center center;">
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
                <th on:click={sort("Nombre")}>Nombre del juego</th>
                <th on:click={sort("Genero")}>Género</th>
                <th on:click={sort("Fecha")}>Fecha de lanzamiento</th>
            </tr>
        </thead>
        <tbody>
            {#each gamesMostrar as row}
                <tr>
                    <td>{row.Nombre}</td>
                    <td>{row.Genero}</td>
                    <td>{formatea(row.Fecha)}</td>
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