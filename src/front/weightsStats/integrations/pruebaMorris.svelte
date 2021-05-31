<script>
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";


    const BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    const stressBASE_PATH = "/proxyStress/api/v2/stress_stats/";

    let weightStats = [];
    let weightProvinces = [];
    let weightObesity = [];

    let stressStats = [];
    let stressProvinces = [];
    let stressPoblation = [];

    async function getWeight(){
        const res = await fetch(BASE_WEIGHTS_PATH);
        if(res.ok){
            weightStats = await res.json();
            console.log("Recived " + weightStats.length + " weights data...");
        }
    }

    async function getStress(){
        const res = await fetch(stressBASE_PATH);
        if(res.ok){
            stressStats = await res.json();
            console.log("Recived " + stressStats.length + " stress data...");
        }
    }

    async function loadGraph(){
        console.log("Fetching data...");

        await getWeight();
        await getStress();
        console.log("Procesing all data...");

        weightStats.forEach((stat) => {
            if(stat.year == 2017){
                if(stat.provinces == "Cataluña"
                || stat.provinces == "Melilla"
                || stat.provinces == "Aragón"
                || stat.provinces == "Navarra"
                || stat.provinces == "Islas Baleares"
                || stat.provinces == "Comunidad de Madrid"){
                    weightProvinces.push(stat.provinces);
                    weightObesity.push(stat["obesity"]);
                }

            }

        });

        stressStats.forEach((stat) => {
            stressProvinces.push(stat.country);
            stressPoblation.push(stat["stress_population"]);
        });

        console.log("Generando datos para la gráfica...");
        new Morris.Bar({
  // ID of the element in which to draw the chart.
  element: 'myfirstchart',
  // Chart data records -- each entry in this array corresponds to a point on
  // the chart.
  data: [
    { year: '2008', value: weightObesity[0] , value2: stressPoblation[0]},
    { year: '2009', value: weightObesity[1] , value2: stressPoblation[1]},
    { year: '2010', value: weightObesity[2] , value2: stressPoblation[2]},
    { year: '2011', value: weightObesity[3] , value2: stressPoblation[3]},
    { year: '2012', value: weightObesity[4] , value2: stressPoblation[4]},
    { year: '2013', value: weightObesity[5] , value2: stressPoblation[5]},
  ],
  // The name of the data record attribute that contains x-values.
  xkey: 'year',
  // A list of names of data record attributes that contain y-values.
  ykeys: ['value', 'value2'],
  // Labels for the ykeys -- will be displayed when you hover over the
  // chart.
  labels: ['Porcentaje de peso normal en el año 2017', 'Recaudación total de la industria cinematográfica(contada por millones)']
});
        
    }    
</script>

<svelte:head>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js" on:load="{loadGraph}"></script>

</svelte:head>


<main>
    
    <div id="myfirstchart" style="height: 250px;"></div>
    
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>
