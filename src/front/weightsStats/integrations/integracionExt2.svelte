<script>
    import { pop }from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
    
    const BASE_GAMES_PATH = "https://www.cheapshark.com/api/1.0/deals?storeID=1";

    let gamesStats = [];
    let gameTitle = [];
    let price = [];
    let salePrice = [];

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
            if(stat.normalPrice > 14.99){
                gameTitle.push(stat.title);
                price.push(parseFloat(stat["normalPrice"]));
                salePrice.push(parseFloat(stat["salePrice"]));
            }
        });

        console.log("Generando datos...");
        Highcharts.chart('container', {
            chart: {
                type: 'areaspline'
            },
            title: {
                text: 'Integración juegos de Steam'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
            },
            xAxis: {
                title: {
                    text: 'Titulo del juego'
                },
                categories: gameTitle,
                type: 'category',
                plotBands: [{
                    from: 0,
                    to: 4,
                    color: 'rgba(56, 231, 46, .2)'
                }]
            },
            yAxis: {
                title: {
                    text: 'Precio'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' €'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: 'Precio',
                data: price
            }, {
                name: 'Valoraciones',
                data: salePrice
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
        Gráfico en el que se ve representado el precio de algunos juegos rebajados en Steam con un valor 
        superior a los 15€, comparando su precio real con el precio rebajado. La zona verde marca los 5 juegos
        con mejor valoración en la plataforma</p>
    </figure>

    <p>Datos obtenidos de: <a href="https://www.cheapshark.com/">https://www.cheapshark.com/</a></p>	
    <h7 style="color: gray;">Gráfica diseñada con Highcharts - type: 'areaspline'</h7>

    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
 
</main>

