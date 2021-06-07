<script>
    import * as JSC from "jscharting";
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
import Smokers from "../Smokers.svelte";

    //ALERTAS
    let visible = false;
    let color = "danger";
    var checkMSG = "";

    //Constantes
    const BASE_HOSTEL_API_PATH = "https://sos2021-26.herokuapp.com/proxy/api/v2/hostelries";
    const BASE_SMOKERS_PATH = "/api/v3/smokers-stats";

    //Variables SMOKER
    var smokersData = [];
    var smokerChartProvince = [];
    var smokerChartDaily = [];
    var smokerChartNon = [];
    var smokerDailyAsoc = [];

    //Variables RENTAL
    var hostelData = [];
    var hostelProvince = [];
    var hostelYear = [];
    var hostelSites = [];
    var hostelSitesAv = [];
    var hostelTraveler = [];
    var hostelTravelerAv = [];

    var dataFin = [];

    console.log("Cargando datos...");

    //GET SMOKER
    async function getSmoker() {
        const res = await fetch(BASE_SMOKERS_PATH);
        if (res.ok) {
            smokersData = await res.json();
            console.log("Received Smokers Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de SMOKERS");
        }
    }
    //GET HOSTELRIES
    async function getHostel() {
        await fetch(BASE_HOSTEL_API_PATH+"/loadInitialData"); //no tiene persistencia
        const res = await fetch(BASE_HOSTEL_API_PATH);
        if (res.ok) {
            hostelData = await res.json();
            console.log("Received hostelries Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de HOSTELRIES");
        }
    }

    //Función auxiliar para parsear las provincias y dejarlas con el mismo formato
    String.prototype.allReplace = function (obj) {
        var retStr = this;
        for (var x in obj) {
            retStr = retStr.replace(new RegExp(x, "g"), obj[x]);
        }
        return retStr;
    };

    //LOADGRAPH
    async function loadGraph() {
        await getSmoker();
        await getHostel();
        console.log("Datos recibidos para pintar smoker: "+smokersData.length);
        console.log("Datos recibidos para pintar hostelries: "+hostelData.length);

        //Gestión de datos de ambas apis y reparto en variables
        smokersData.forEach((stat) => {
            smokerChartProvince.push(stat.province);
            smokerChartDaily.push(stat["dailySmoker"]);
            smokerChartNon.push(stat["nonSmoker"]);
        });
        //
        hostelData.forEach((stat) => {
            hostelProvince.push(stat.district.allReplace({"Andalucia": "Andalucía", "Aragon": "Aragón", "Madrid": "Comunidad de Madrid",}));
            hostelSites.push(stat["establishment_open"]);
            hostelTraveler.push(stat["traveler_numer"]);
        });

        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }


    ///////////////////////////////////////////////Tratamiento de datos
    // al final quedan todos los objetos en un array dataFin=[obj], que será la serie del gráfico. Points=[obj]
    var tipos = ["Fumadores diarios", "Establecimientos abiertos", "Turistas recibidos", "No fumadores",];

    //Se van iterando las opciones. Luego fijando un smokersData, se checkea la igualdad con hostelData
    for (let i = 0; i < tipos.length; i++){
        let tablaPoint = [];
        let objSmoker = new Object();
        objSmoker.name = tipos[i];
        for(let k=0; k<smokersData.length; k++){
            for (let j = 0; j<hostelData.length; j++){
                let objInterno = new Object();
                objInterno.x = smokerChartProvince[k];     // va metiendo todas las provincias
                if(smokerChartProvince[k] == hostelProvince[j]){    //se recorrerán todas las provincias pero solo se crean las que tienen ambas apis
                    switch (tipos[i]) {
                        case tipos[0]: objInterno.y = smokerChartDaily[k]; break;
                        case tipos[1]: objInterno.y = hostelData[j].establishment_open; break;
                        case tipos[2]: objInterno.y = hostelData[j].traveler_numer; break;
                        case tipos[3]: objInterno.y = smokerChartNon[k]; break;
                        default: checkMSG = "No se ha podido completar el objeto para formar la gráfica."; break;
                    }
                    tablaPoint.push(objInterno);
                }
            }
        }
        objSmoker.points = tablaPoint;
        dataFin.push(objSmoker);
    }

    var nuevoPlot = [];
    for (let i=0; i < tipos.length; i++){
        
    }
        console.log(dataFin);


        /////////////////////////////////GRAPH
        /*
        //Convierte los datos en un gráfico 
        var chart = JSC.chart('chartDiv', { 
            degug: true,
            defaultSeries_type: 'horizontal column', 
            legend_description: 'chart legend', 
            legend_defaultEntry_description: '%name', 
            toolbar_items_export_description: 'export menu', 
            defaultPoint_description: '%name %value', 
            series: dataFin
        }); 
        */


        var img = 'data:image/png;base64,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';

var plots = tablaPoint;

var cols = 40, rows = 10;

var cdata = {
    graphset : [
        {
            x : 0,
            y : 0,
            width : 18 * cols + 40,
            height : '100%',
            type : 'scatter',
            title : {
                text : 'Top 10 United States Largest Private Employers (as of 2020)'
            },
            plotarea : {
                maskTolerance : [99, 99],
                margin : '50 20 100 20'
            },
            legend : {
                offsetY : 10,
                layout : '2x5',
                margin : 'auto auto 0 auto',
                height : 80,
                borderWidth : 0,
                marker : {
                    type : 'rectangle',
                    width : 16,
                    height : 32,
                    backgroundColor : 'none',
                    borderWidth : 0
                }
            },
            scaleX : {
                visible : false
            },
            scaleY : {
                mirrored : true,
                visible : false
            },
            tooltip : {
                backgroundColor : '#eee',
                borderColor : '#333',
                fontSize : 17,
                padding : 20,
                fontWeight : null,
                thousandsSeparator : ',',
                text : '<b>%plot-text:</b> %data-employees employees (%data-percent%)'
            },
            plot : {
                animation : {
                  speed : 150,
                  effect : 1,
                  method : 0,
                  sequence : 1
                },
                marker : {
                    backgroundColor : 'none',
                    type : 'rectangle',
                    width : 16,
                    height : 32
                },
                hoverMarker : {
                    type : 'none',
                    visible : false    
                }
            },
            series : [
            ]
        },
        {
            x : 18 * cols + 40,
            y : 0,
            width : 300,
            height : '100%',
            type : 'hbar',
            plotarea : {
                margin : '20 20 70 100'
            },
            tooltip : {
                visible : false
            },
            scaleX : {
                visible : false
            },
            scaleY : {
                lineWidth : 0,
                guide : {
                    visible : false
                },                
                item : {
                    visible : false
                },
                tick : {
                    visible : false
                },
                label : {
                    align : 'left',
                    text : 'Median annual pay',
                    padding : 0,
                    fontSize : 15,
                    color : '#000'
                }
            },
            source : {
                text : 'Source: API en rapidapi',
                align : 'left',
                target : '_blank',
                url : 'https://iata-and-icao-codes.p.rapidapi.com/airlines'
            },
            plot : {
                animation : {
                  speed : 150,
                  effect : 4,
                  method : 0,
                  sequence : 1
                },
                barSpace : 0.1,
                barsSpaceLeft : 0.1,
                barsSpaceRight : 0.1,
                valueBox : [
                    {
                        placement : 'top-out',
                        rules : [
                            {
                                rule : '%node-value > 25000',
                                placement : 'top-in',
                                color : '#fff'
                            }    
                        ],
                        thousandsSeparator : ',',
                        text : '$%node-value'    
                    },
                    {
                        placement : 'bottom-out',
                        text : '%plot-text',
                        color : '#000'
                    }
                ]
            },
            series : []
        }
    ]
};

// calculate number of items per plot
var total_employees = 0;
for (var p=0;p<plots.length;p++) {
    total_employees += plots[p].employees;
}
var total_items = 0
for (var p=0;p<plots.length;p++) {
    var pc = (plots[p].employees / total_employees);
    var items = Math.round((cols * rows) * pc);
    if (p === plots.length-1) {
        // avoid rounding conflicts
        plots[p].items = (cols * rows) - total_items;
    } else {
        plots[p].items = items;
    }
    plots[p].dataPercent = (100 * pc).toFixed(2);
    total_items += items;
}
 
var col = 0, row = 0;
for (var p=0;p<plots.length;p++) {
    cdata.graphset[1].series.push({
        text : plots[p].text,
        values : [plots[p].medianpay],
        backgroundColor : plots[p].color
    });
    cdata.graphset[0].series.push({
        text : plots[p].text,
        dataPercent : plots[p].dataPercent,
        dataEmployees : plots[p].employees,
        tooltip : {
            color : plots[p].color
        },
        marker : {
            backgroundRepeat : 'no-repeat',
            backgroundImage : img,
            backgroundPosition : -p*16 + 'px 0px'
        },
        legendMarker : {
            backgroundRepeat : 'no-repeat',
            backgroundImage : img,
            backgroundPosition : -p*16 + 'px 0px'            
        },
        values : []
    });
    for (var n=0;n<plots[p].items;n++) {
        cdata.graphset[0].series[p].values.push([col, row]);
        col++;
        if (col === cols) {
            col = 0;
            row++;
        }
    }
}

zingchart.render({
  id : 'myChart',
	width : '100%',
	height : '100%',
	output : 'svg',
	data : cdata
});



    }
    //Llamada a la función
    loadGraph();
</script>

<main>
    <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto"></div>
    <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>

</main>
