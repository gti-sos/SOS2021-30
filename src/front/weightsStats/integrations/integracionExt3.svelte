<script>
    import { pop }from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";


    const BASE_FUTBOL_PATH = "https://apiv3.apifootball.com/?action=get_standings&league_id=302&APIkey=238fa8f2f748e83ca2569474a8f848897110a90bb6837bd17d6cdc66a02eb14a";

    let futbolData = [];
    let equipo = [];
    let puntos = [];
    let golesFavor = [];
    let golesContra = [];

    async function loadGraph(){
        console.log("Fetching data...");
        const res = await fetch(BASE_FUTBOL_PATH);
        futbolData = await res.json();

        if(res.ok){
            futbolData.forEach(stat => {
                equipo.push(stat.team_name);
                puntos.push(stat["overall_league_PTS"]);
                golesFavor.push(stat["overall_league_GF"]);
                golesContra.push(stat["overall_league_GA"]);
            });
        }

        

        console.log("Generando datos...");
        console.log("We have " + equipo.length + " teams in the league");
        console.log("We hace " + puntos.length + " datas from de points of each team");
        console.log("We hace " + golesFavor.length + " datas from the goals of each team");
        console.log("We hace " + golesContra.length + " datas from the goals against each team");

        new Morris.Bar({
            element: 'myfirstchart',
            //Tratamiento de datos de la integración manual
            data: [
                { equipo: "Atletico de Madrid", value: puntos[0] , value2: golesFavor[0], value3: golesContra[0]},
                { equipo: "Madrid", value: puntos[1] , value2: golesFavor[1], value3: golesContra[1]},
                { equipo: "Barcelona", value: puntos[2] , value2: golesFavor[2], value3: golesContra[2]},
                { equipo: "Sevilla", value: puntos[3] , value2: golesFavor[2], value3: golesContra[3]},
            ],
            xkey: 'equipo',
            ykeys: ['value', 'value2', 'value3'],
            labels: ['Puntos', 'Goles a favor', 'Goles en contra']
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
    <p>Gráfico que muestra el resultado de la liga española indicando los puntos, goles a favor y goles en contra de cada equipo.</p>

  <p>Datos obtenidos de: <a href="https://apifootball.com/">https://apifootball.com/</a></p>
  <Button outline color="secondary" on:click="{pop}">Atrás</Button>
 
</main>
