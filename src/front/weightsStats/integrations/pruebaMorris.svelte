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
        await fetch(stressBASE_PATH+"loadInitialData");
        console.log("Se cargan los datos desde la dirección: " + stressBASE_PATH+"loadInitialData");
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
                if(stat.provinces == "Asturias"
                || stat.provinces == "Islas Baleares"
                || stat.provinces == "Aragón"
                || stat.provinces == "Cantabria"
                || stat.provinces == "Canarias"
                || stat.provinces == "Andalucía"){
                    weightProvinces.push(stat.provinces);
                    var comunidadesAutonomas = [];
                    comunidadesAutonomas.push(stat.provinces);
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
            element: 'myfirstchart',
            //Tratamiento de datos de la integración manual
            data: [
                { province: "Aragón", value: weightObesity[0] , value2: stressPoblation[0]},
                { province: "Islas Baleares", value: weightObesity[1] , value2: stressPoblation[1]},
                { province: "Asturias", value: weightObesity[2] , value2: stressPoblation[2]},
                { province: "Andalucía", value: weightObesity[3] , value2: stressPoblation[3]},
                { province: "Canarias", value: weightObesity[4] , value2: stressPoblation[4]},
                { province: "Cantabria", value: weightObesity[5] , value2: stressPoblation[5]},
            ],
            xkey: 'province',
            ykeys: ['value', 'value2'],
            labels: ['Porcentaje de obesidad en el año 2017', 'Datos de estres de la poblacion(radio/media)']
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
    <h1 style="text-align: center">Estadística de obesidad integradas con el estrés</h1>
    <div id="myfirstchart" style="height: 250px;"></div>
    <p>Gráfico en el que se muestra el porcentaje de obesidad en algunas comunidades autónomas de españa
        en el año 2017 combinado con el ratio medio de estrés en dichas comunidades.
    </p>
    <h7 style="color: gray;">Gráfica diseñada con Morris.js</h7>    
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>
