<script>
    import { pop }from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    const BASE_FUTBOL_PATH = "https://apiv3.apifootball.com/?action=get_standings&league_id=302&APIkey=238fa8f2f748e83ca2569474a8f848897110a90bb6837bd17d6cdc66a02eb14a";

    let futbolData = [];
    let equipo = [];
    let puntos = [];
    let golesFavor = [];
    let golesContra = [];

    async function getLiga(){
        const res = await fetch(BASE_FUTBOL_PATH);
        if(res.ok){
            futbolData = await res.json();
            console.log("Recived futbol data");
        }
    }        

    async function loadGraph(){
        console.log("Fetching data...");

        await getLiga();
        console.log("Procesing all data...");

        futbolData.forEach(stat => {
            equipo.push(stat.team_name);
            puntos.push(stat["overall_league_PTS"]);
            golesFavor.push(stat["overall_league_GF"]);
            golesContra.push(stat["overall_league_GA"]);
        });  

        new Morris.Bar({
            element: 'myfirstchart',
            //Tratamiento de datos de la integración manual
            data: [
                {x: equipo[0], value: puntos[0], value2: golesFavor[0], value3: golesContra[0]},
                {x: equipo[1], value: puntos[1], value2: golesFavor[1], value3: golesContra[1]},
                {x: equipo[2], value: puntos[2], value2: golesFavor[2], value3: golesContra[2]},
                {x: equipo[3], value: puntos[3], value2: golesFavor[3], value3: golesContra[3]},
                {x: equipo[4], value: puntos[4], value2: golesFavor[4], value3: golesContra[4]},
                {x: equipo[5], value: puntos[5], value2: golesFavor[5], value3: golesContra[5]},
                {x: equipo[6], value: puntos[6], value2: golesFavor[6], value3: golesContra[6]},
                {x: equipo[7], value: puntos[7], value2: golesFavor[7], value3: golesContra[7]},
                {x: equipo[8], value: puntos[8], value2: golesFavor[8], value3: golesContra[8]},
                {x: equipo[9], value: puntos[9], value2: golesFavor[9], value3: golesContra[9]},
                {x: equipo[10], value: puntos[10], value2: golesFavor[10], value3: golesContra[10]},
                {x: equipo[11], value: puntos[11], value2: golesFavor[11], value3: golesContra[11]},
                {x: equipo[12], value: puntos[12], value2: golesFavor[12], value3: golesContra[12]},
                {x: equipo[13], value: puntos[13], value2: golesFavor[13], value3: golesContra[13]},
                {x: equipo[14], value: puntos[14], value2: golesFavor[14], value3: golesContra[14]},
                {x: equipo[15], value: puntos[15], value2: golesFavor[15], value3: golesContra[15]},
                {x: equipo[16], value: puntos[16], value2: golesFavor[16], value3: golesContra[16]},
                {x: equipo[17], value: puntos[17], value2: golesFavor[17], value3: golesContra[17]},
                {x: equipo[18], value: puntos[18], value2: golesFavor[18], value3: golesContra[18]},
                {x: equipo[19], value: puntos[19], value2: golesFavor[19], value3: golesContra[19]}
            ],
            xkey: 'x',
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
    <p>Gráfico en el que se ve reflejado el resultado de la liga de fútbol profesional 20/21.</p>
    <p>Se puede observar cada equipo de primera división ordenados desde el primer clasificado al último y viendo los puntos,
        goles a favor y goles en contra de cada uno.
    </p>
    <p>Datos obtenidos de: <a href="https://apifootball.com/">https://apifootball.com/</a></p>
    <h7 style="color: gray;">Gráfica diseñada con Morris.js - type: 'Bar'</h7>    
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>