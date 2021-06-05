<script>
	import {pop} from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

	const EXT_PATH =  "https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/europe?rapidapi-key=16a223c8b0msh4bfbfb189f95a0dp1822e1jsnfbfe42809539";
                        
	let ext2Stats = [];
    let covid = [];
    let paises = [];
    let muertes = [];
    

	async function loadGraph(){
        
        console.log("Fetching url...");	
		const res = await fetch(EXT_PATH); 
		if (res.ok) {
            ext2Stats = await res.json();
			console.log("Recived hearthstone data...");
            console.log(ext2Stats);
            ext2Stats.forEach(stat => {
                paises.push(stat.Country);
                muertes.push(stat.TotalDeaths);
            });
            
		}    
        console.log(ext2Stats);
        console.log(paises);
        console.log(muertes);


        const data = {
        labels: paises,
        datasets: [
            {
            label: 'Europa',
            data: muertes,
            backgroundColor: [
                "#FF4B4B80",
            ]
            }
        ]
        };



        var ctx = document.getElementById('myChart');

        new Chart(ctx, {
            type: 'polarArea',
            data: data,
            options: {
                responsive: true,
                plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Polar Area Chart'
                }
                }
            },
            });












    }





</script>

<svelte:head>
    <script src="https://github.com/chartjs/Chart.js/blob/master/docs/scripts/utils.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"on:load={loadGraph}></script>
  </svelte:head>



<main>
  
    <div>
        <h2>Uso API externa VACCOVID </h2>
      </div>
    
    
    
    
      <div>
      <canvas id="myChart" width="200" height="200"></canvas>
      </div>
    
    
      <div>
        <figure class="highcharts-figure">
          <div id="container" />
          <p class="highcharts-description">
            Representación del número de muertes por covid en los paises europeos.
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