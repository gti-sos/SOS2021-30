<script type="text/javascript">
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";

    var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    async function loadGraph(){ 
        console.log("Fetching data...");    
        let datos = [];
        var dic = {};
        const res = await fetch(BASE_WEIGHTS_PATH);
        const weightData = await res.json();
        weightData.forEach( (v) => {
             if(v.provinces in dic){
              dic[v.provinces] += v.normal_weight;
            }
            else{
              dic[v.provinces]= v.normal_weight;
            }  
        });
        for(var dato in dic){
             datos.push({
                label: dato,
                value: dic[dato]
            })
        }
        console.log("Generando datos...");
        new Morris.Donut({
            element: 'AwesomeChart',
            data: datos,
            colors: ["#3c8dbc", "red", "#A9DFBF", "yellow", "purple", "black", "#138D75", "silver"] 
        });
    }
    </script>
    
    <svelte:head>
    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css">
    <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js" on:load="{loadGraph}"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    </svelte:head>
    
    <main>
        <h1 style="text-align: center">Estadística de peso normal en los años 2014 y 2017</h1>
    
        <div id="AwesomeChart" style="height: 250px;"></div>
    
        <p>Gráfico en el que se muestra la suma de los porcentajes del peso normal en los años 2014 y 2017 en cada comunidad autónoma de España</p>
        <p style= "color: red;">En caso de que no se muestre la gráfica correctamente, volver a la página anterior y entrar de nuevo</p>
        <h7 style="color: gray;">Gráfica diseñada con Morris.js - type: 'Donut'</h7>
        <Button outline color="secondary" on:click="{pop}">Atrás</Button>
    </main>
