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
        console.log("We hace " + golesFavor.length + " datas from de goals of each team");
        Highcharts.chart('container', {

        title: {
            text: 'Gráfica La Liga'
        },

        yAxis: {
            title: {
                text: 'Número'
            }
        },

        xAxis: {
            title: {
                text: 'Equipo'
            },
            categories: equipo
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        annootations: [
            {
                labels: [
                    {
                      point: "date",
                      text: "",  
                    },
                    {
                        point: "min",
                        text: "Min",
                        backgroundColor: "white",
                    },                    
                ],
            },
        ],

        series: [
            {
            name: 'Puntos',
            data: puntos
        }, {
            name: 'Goles a favor',
            data: golesFavor
        }, {
            name: 'Goles en contra',
            data: golesContra
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

        });
    }
     
</script>

<svelte:head>

  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/series-label.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>

</svelte:head>


<main>

  <figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
      Gráfico que muestra el resultado de la liga española indicando los puntos, goles a favor y goles en contra de cada equipo.
    </p>
  </figure>

  <Button outline color="secondary" on:click="{pop}">Atrás</Button>
 
</main>

