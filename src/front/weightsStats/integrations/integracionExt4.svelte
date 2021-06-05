<script>
    import { pop }from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
    
    const BASE_GAMES_PATH = "/proxyExterno/api/giveaways";

    let gamesStats = [];
    let gameTitle = [];
    let activeUsers = [];

    async function getGames(){
        const res = await fetch(BASE_GAMES_PATH);
        if(res.ok){
            gamesStats = await res.json();
            console.log("Recived data from de url...");
        }
    }

    async function loadGraph(){
        console.log("Fetching data...");
        await getGames();
        console.log("Recived " + gamesStats.length + " games data...");

        gamesStats.forEach((stat) => {
            if(stat.users > 5000){
                gameTitle.push(stat.title);
                activeUsers.push(parseFloat(stat["users"]));
            }
        });

        console.log("Generando datos...");
        Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: 'Jugadores activos en juegos gratis'
            },
            subtitle: {
                text: 'Source: Heinz  2003'
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: 'Titulo del juego'
                },
                categories: gameTitle,
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: 'Usuarios activos'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: activeUsers,
                floating: true,
                backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                borderWidth: 1
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>'
                    }
                }
            },
            series: [{
                name: 'Usuarios activos',
                color: 'rgba(83, 217, 101, .5)',
                data: activeUsers
            }]
});

        
    }
     
</script>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>

</svelte:head>


<main>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Gráfico en el que se aprecia la cantidad de jugadores activos que tienen ciertos juegos
            que son gratis</p>
    </figure>
    

    <p>Datos obtenidos de: <a href="https://www.gamerpower.com/">https://www.gamerpower.com/</a></p>	
    <h7 style="color: gray;">Gráfica diseñada con Highcharts - type: 'scatter'</h7>

    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
 
</main>

