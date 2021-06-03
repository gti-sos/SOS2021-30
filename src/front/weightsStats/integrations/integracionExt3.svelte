<script>
    import { pop }from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
    import anychart from "anychart";


    const BASE_FUTBOL_PATH = "https://apiv3.apifootball.com/?action=get_standings&league_id=302&APIkey=238fa8f2f748e83ca2569474a8f848897110a90bb6837bd17d6cdc66a02eb14a";

    let futbolData = [];
    let equipo = [];
    let puntos = [];
    let golesFavor = [];
    let golesContra = [];

    anychart.onDocumentReady(async function(){
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

        //Tratamiento de los datos integrados de la API a mano
            var data = anychart.data.set([
                {x: equipo[0], value: puntos[0]},
                {x: equipo[1], value: puntos[1]},
                {x: equipo[2], value: puntos[2]},
                {x: equipo[3], value: puntos[3]},
                {x: equipo[4], value: puntos[4]},
                {x: equipo[5], value: puntos[5]},
                {x: equipo[6], value: puntos[6]},
                {x: equipo[7], value: puntos[7]},
                {x: equipo[8], value: puntos[8]},
                {x: equipo[9], value: puntos[9]},
                {x: equipo[10], value: puntos[10]},
                {x: equipo[11], value: puntos[11]},
                {x: equipo[12], value: puntos[12]},
                {x: equipo[13], value: puntos[13]},
                {x: equipo[14], value: puntos[14]},
                {x: equipo[15], value: puntos[15]},
                {x: equipo[16], value: puntos[16]},
                {x: equipo[17], value: puntos[17]},
                {x: equipo[18], value: puntos[18]},
                {x: equipo[19], value: puntos[19]}
            ]);

            var seriesData_1 = data.mapAs({x: 0, value: 1});

            var chart = anychart.column();

            var series1 = chart.column(seriesData_1);
            series1.name("Puntos");

            chart.title("Estadísitcas liga española de fútbol");
            
            chart.xAxis().title("Equipos");
            chart.yAxis().title("Puntos");

            chart.container("container");
            chart.draw();
        });
 
</script>

<svelte:head>

    <script src="https://cdn.anychart.com/releases/v8/js/anychart-base.min.js"></script>
    <script src="https://cdn.anychart.com/releases/v8/js/anychart-ui.min.js"></script>
    <script src="https://cdn.anychart.com/releases/v8/js/anychart-exports.min.js"></script>
    <link href="https://cdn.anychart.com/releases/v8/css/anychart-ui.min.css" type="text/css" rel="stylesheet">
    <link href="https://cdn.anychart.com/releases/v8/fonts/css/anychart-font.min.css" type="text/css" rel="stylesheet">

</svelte:head>

<main>
    <div id="container" />
    <p>Gráfico que muestra el resultado de la liga española indicando los puntos, goles a favor y goles en contra de cada equipo.</p>

  <p>Datos obtenidos de: <a href="https://apifootball.com/">https://apifootball.com/</a></p>
  <h7 style="color: gray;">Gráfica diseñada con anychart</h7> 
  <Button outline color="secondary" on:click="{pop}">Atrás</Button>
 
</main>

<style>
#container {
    width: 100%;
    height: 350px;
    margin: 0;
    padding: 0;
}
</style>