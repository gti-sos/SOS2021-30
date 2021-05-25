<script>

    import * as JSC from "jscharting";
    
    //Uso API grupo 05 rental-arms
    const BASE_ARMS_API_PATH = "/api/v1/integration/rentals"
    var rentalStats = [];
    var smokersData = [];
    var errorMsg = "";

    console.log("Cargando datos...");

   JSC.Chart('chartDiv', { 
        series:[{
        points: [{ x: 'A', y: 10 }, { x: 'B', y: 5 }]
        }], 
    });
    JSC.fetch("./data.json")
        .then(response => response.json())
        .then(json => {
        //Use JSON to populate the chart.
        });

</script>

<main>
    
    <div id="chartDiv" style="width: 100%; height: 400px;">
        <p> Hola que pasa no funciona</p>
    </div>

</main>