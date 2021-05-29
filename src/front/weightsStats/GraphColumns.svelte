<script>
    import { pop }from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";


    var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";

    let weightData = [];
    let weightChartInfo = [];
    let weightchartNormalWeight = [];
    let weightChartOverweight = [];
    let weightChartObesity = [];

    async function loadGraph(){
        console.log("Fetching data...");
        const res = await fetch(BASE_WEIGHTS_PATH);
        weightData = await res.json();
        if(res.ok){
            weightData.forEach(stat => {
                weightChartInfo.push(stat.provinces+"/"+stat.year);
                weightchartNormalWeight.push(stat["normal_weight"]);
                weightChartOverweight.push(stat["overweight"]);
                weightChartObesity.push(stat["obesity"]);
            });
        }

        console.log("Generando datos...");
        // Set up the chart
        const chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'column',
                options3d: {
                    enabled: true,
                    alpha: 0,
                    beta: 15,
                    depth: 50,
                    viewDistance: 25
                }
            },
            title: {
                text: 'Gráfica IMC por comunidades'
            },

            yAxis: {
                title: {
                    text: 'Porcentaje'
                }
            },

            xAxis: {
                title: {
                    text: 'Comunidad autónoma/año'
                },
                categories: weightChartInfo,
            },
            plotOptions: {
                column: {
                    depth: 25
                }
            },
            series: [
            {
            name: 'Peso normal',
            data: weightchartNormalWeight
            },
            {
            name: 'Sobrepeso',
            data: weightChartOverweight
            },
            {
            name: 'Obesidad',
            data: weightChartObesity}
            ]
        });

        function showValues() {
            document.getElementById('alpha-value').innerHTML = chart.options.chart.options3d.alpha;
            document.getElementById('beta-value').innerHTML = chart.options.chart.options3d.beta;
            document.getElementById('depth-value').innerHTML = chart.options.chart.options3d.depth;
        }

        // Activate the sliders
        document.querySelectorAll('#sliders input').forEach(input => input.addEventListener('input', e => {
            chart.options.chart.options3d[e.target.id] = parseFloat(e.target.value);
            showValues();
            chart.redraw(false);
        }));

        showValues();
    }
     
</script>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-3d.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>

</svelte:head>


<main>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Gráfico de barras 3D en el que se ve representado el porcentaje por comunidades autónomas en los años 2014 y 2017 el IMC
        </p>
        <div id="sliders">
            <table>
                <tr>
                    <td><label for="alpha">Alpha Angle</label></td>
                    <td><input id="alpha" type="range" min="0" max="45" value="15"/> <span id="alpha-value" class="value"></span></td>
                </tr>
                <tr>
                    <td><label for="beta">Beta Angle</label></td>
                    <td><input id="beta" type="range" min="-45" max="45" value="15"/> <span id="beta-value" class="value"></span></td>
                </tr>
                <tr>
                    <td><label for="depth">Depth</label></td>
                    <td><input id="depth" type="range" min="20" max="100" value="50"/> <span id="depth-value" class="value"></span></td>
                </tr>
            </table>
        </div>
    </figure>

  <Button outline color="secondary" on:click="{pop}">Atrás</Button>
 
</main>