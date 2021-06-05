<script>
	import {pop} from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

	const HEARTHSTONE_PATH =  "https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/sets/Goblins%20vs%20Gnomes?rapidapi-key=16a223c8b0msh4bfbfb189f95a0dp1822e1jsnfbfe42809539";
                        
	let hearthstoneStats = [];
    let common = [];
    let rare = [];
    let epic = [];
    let legendary = [];
    let numCartasPorRareza = [];
    let rarezas = [];
    

	async function loadGraph(){
        
        console.log("Fetching url...");	
		const res = await fetch(HEARTHSTONE_PATH); 
		if (res.ok) {
            hearthstoneStats = await res.json();
			console.log("Recived cocktail data...");
            console.log(hearthstoneStats);
            hearthstoneStats.forEach(stat => {
            if(stat.rarity != null){
                rarezas.push(stat.rarity);
                if(stat.rarity == "Common"){
                    common.push(stat.rarity);
                }else if(stat.rarity == "Rare"){
                    rare.push(stat.rarity);
                }else if(stat.rarity == "Epic"){
                     epic.push(stat.rarity);
                }else{
                    legendary.push(stat.rarity);
                }


              }
        });
            
             var rarezasSR = rarezas.filter((valor, indice) => { //Eliminando datos repetidos
                return rarezas.indexOf(valor) === indice;
            }
            );

            rarezas = rarezasSR;

            numCartasPorRareza = [rare.length,common.length,epic.length,legendary.length]; //Numero de cartas por rareza
            console.log(numCartasPorRareza);
		}    
        
            console.log(hearthstoneStats);
            console.log(common);
            console.log(rare);
            console.log(epic);
            console.log(legendary);
            console.log(rarezas);

        const data = {
            labels: rarezas,
            datasets: [{
                label: 'Goblins vs Gnomos',
                data: numCartasPorRareza,
                backgroundColor: [
                'rgb(17, 49, 255)',
                'rgb(218, 223, 255)',
                'rgb(144, 18, 255)',
                'rgb(255, 205, 86)',
                ]
            }]
            };

            var ctx = document.getElementById('myChart');

            new Chart(ctx, {
                type: 'pie',
                data: data,
                options: {}
            });

    }







</script>

<svelte:head>
    <script src="https://github.com/chartjs/Chart.js/blob/master/docs/scripts/utils.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js" on:load={loadGraph}></script>
  </svelte:head>



<main>
  
    <div>
        <h2>Uso API externa HearhStone </h2>
      </div>
    
    
    
    
      <div>
      <canvas id="myChart" width="200" height="200"></canvas>
      </div>
    
    
      <div>
        <figure class="highcharts-figure">
          <div id="container" />
          <p class="highcharts-description">
            Representación del número de cartas por rareza en la coleccion de cartas Goblins vs Gnomes del juego HearthStone.
          </p>
        </figure>
      </div>
    
    
    
    
          <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>

</main>

<style>
    #myChart{
      font-family: Verdana, sans-serif;
      margin: 10px auto;
      text-align: center;
      width: 100%;
      max-width: 1000px;
      height: 100%;
      max-height: 500px;
    }
    main {
      text-align: center;
      padding: 1em;
      margin: 0 auto;
    }
    div {
      margin-bottom: 15px;
    }

</style>