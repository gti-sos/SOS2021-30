<script>
    import * as JSC from "jscharting";
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    var BASE_SMOKER_PATH = "/api/v3/smokers-stats";

    var fullDat = [];
    var smokerChartInfo = [];
    var smokerChartDaily = [];
    var smokerChartOcasional = [];
    var smokerChartEx = [];
    var smokerChartNon = [];

    var smokerFin = [];

    var checkMSG = "";

    async function loadGraph() {
        console.log("Fetching data...");
        const res = await fetch(BASE_SMOKER_PATH);
        fullDat = await res.json();
        if (res.ok) {
            fullDat.forEach((stat) => {
                smokerChartInfo.push(stat.province);
                smokerChartDaily.push(stat["dailySmoker"]);
                smokerChartOcasional.push(stat["ocasionalSmoker"]);
                smokerChartEx.push(stat["exSmoker"]);
                smokerChartNon.push(stat["nonSmoker"]);
            });

            //Comprueba que la gráfica no aparezca vacía y vuelve atrás
            if (fullDat.length == 0) {
                console.log("ERROR MSG");
                alert("Por favor, primero cargue los datos de la API");
                pop();
            }
        }

        //Tratamiento de datos
        var tipos = ["Fumadores diarios", "Fumadores ocasionales", "Ex-fumadores", "No fumadores",];

        for (let i = 0; i < tipos.length; i++){
            let tablaPoint = [];
            let objSmoker = new Object();
            objSmoker.name = tipos[i];
            for (let j = 0; j<smokerChartInfo.length; j++){
                let objInterno = new Object();
                objInterno.x = smokerChartInfo[j];
                switch (tipos[i]) {
                    case tipos[0]: objInterno.y = smokerChartDaily[j]; break;
                    case tipos[1]: objInterno.y = smokerChartOcasional[j]; break;
                    case tipos[2]: objInterno.y = smokerChartEx[j]; break;
                    case tipos[3]: objInterno.y = smokerChartNon[j]; break;
                    default: checkMSG = "No se ha podido completar el objeto para formar la gráfica."; break;
                }
                tablaPoint.push(objInterno);
            }
        objSmoker.points = tablaPoint;
        smokerFin.push(objSmoker);
        }

        console.log(smokerFin);

        console.log("Graphical data sent");


        //Variable principal del gráfico
        var chart = JSC.chart('chartDiv', {
        debug: true,
        type: 'column',
        yAxis: {
          scale_type: 'stacked',
          label_text: 'Nº de personas'
        },
        title_label_text: 'Gráfica sobre la frecuencia de fumadores en España en 2017',
        xAxis_label_text: 'Comunidad Autónoma',
        series: smokerFin
        /*
        [
          {
            name: 'Grinder',
            points: [
              { x: 'Q1', y: 285 },
              { x: 'Q2', y: 292 },
              { x: 'Q3', y: 267 },
              { x: 'Q4', y: 218 }
            ]
          }
        ]
        */
      });
    }

    // Llamada a la función
    loadGraph();
</script>

<main>
    <div>
        {#if checkMSG.length != 0}
            <p class="msgRed" style="color: #9d1c24">ERROR: {checkMSG}</p>
        {/if}
    </div>

    <div id="chartDiv" style="max-width: 740px; height: 400px; margin: 0px auto;"></div>
    <p align="center"><Button outline color="primary" on:click={pop}>Volver al gráfico Highcharts Line</Button></p>
</main>
