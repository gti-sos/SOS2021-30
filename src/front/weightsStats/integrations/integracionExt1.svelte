<script>
	import {pop} from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

	const NBA_PATH = "https://www.balldontlie.io/api/v1/players";
	let NBAStats = [];

	async function loadGraph(){
        
        console.log("Fetching url...");	
		const res = await fetch(NBA_PATH); 
		if (res.ok) {
            NBAStats = await res.json();
			console.log("Recived NBA data...");
		}  

		console.log("Se cargan los datos desde la dirección: " + NBA_PATH);      
		
		let DataChart = NBAStats.data;

		//POSICION G
        let positionG = DataChart.filter((y) => {
			return y.position == "G";
			}).map((x) => {
				let res = {name: x.first_name + " " + x.last_name, value: x.id};
			return res;
		});

		//POSICION C
		let positionC = DataChart.filter((y) => {
			return y.position == "C";
			}).map((x) => {
				let res = {name: x.first_name + " " + x.last_name, value: x.id};
			return res;
		});

		//POSICION C
		let positionF = DataChart.filter((y) => {
			return y.position == "F";
			}).map((x) => {
				let res = {name: x.first_name + " " + x.last_name, value: x.id};
			return res;
		});

		//POSICION C-F
		let positionCF = DataChart.filter((y) => {
			return y.position == "C-F";
			}).map((x) => {
				let res = {name: x.first_name + " " + x.last_name, value: x.id};
			return res;
		});

		//POSICION F-C
		let positionFC = DataChart.filter((y) => {
			return y.position == "F-C";
			}).map((x) => {
				let res = {name: x.first_name + " " + x.last_name, value: x.id};
			return res;
		});

		//POSICION G-F
		let positionGF = DataChart.filter((y) => {
			return y.position == "G-F";
			}).map((x) => {
				let res = {name: x.first_name + " " + x.last_name, value: x.id};
			return res;
		});		
		
		let datosJuntos = 
        [
            {
                name: "Jugadores Posicion Escolta",
                data: positionG
            },
			{
                name: "Jugadores NBA Pívot",
                data: positionC
            },
			{
                name: "Jugadores NBA Base",
                data: positionF
            },
			{
                name: "Jugadores NBA Ala-Pívot",
                data: positionCF
            },
			{
                name: "Jugadores NBA Alero",
                data: positionFC
            },
			{
                name: "Jugadores NBA Escolta-Base",
                data: positionGF
            }
        ];
        
        Highcharts.chart('container', {
			chart: {
				type: 'packedbubble',
				height: '100%'
			},
			title: {
				text: 'Integración que representa algunos de los jugadores de la NBA según su posición'
			},
			tooltip: {
				useHTML: true,
				pointFormat: '<b>{point.name}:</b> {point.value}'
			},
			plotOptions: {
				packedbubble: {
					minSize: '30%',
					maxSize: '120%',
					zMin: 0,
					zMax: 1000,
					layoutAlgorithm: {
						splitSeries: true,
						gravitationalConstant: 0.02
					},
					dataLabels: {
						enabled: true,
						format: '{point.name}',
						filter: {
							property: 'y',
							operator: '>',
							value: 250
						},
						style: {
							color: 'black',
							textOutline: 'none',
							fontWeight: 'normal'
						}
					}
				}
			},
			series: datosJuntos
		});
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load={loadGraph}></script>
    
</svelte:head>
<main>
	<figure class="highcharts-figure">
		<div id="container"></div>
	</figure>
	<p>Gráfico de burbujas en el que cada una de las burbujas representa una posición en el campo de jugadores de 
		la NBA y cada una de las burbujas interiores es un jugador que juega en dicha posición.
	</p>
	<p>Datos obtenidos de: <a href="https://www.balldontlie.io">https://www.balldontlie.io</a></p>	
	<h7 style="color: gray;">Gráfica diseñada con Highcharts - type: 'packedbubble'</h7>
	<Button outline color="secondary" on:click="{pop}"> Volver</Button>

</main>

<style>
  .highcharts-figure, .highcharts-data-table table {
  min-width: 320px; 
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