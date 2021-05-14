<script>
	import { onMount } from "svelte";
  import { pop }from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";
    import Input from "sveltestrap/src/Input.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";
	import { Alert } from 'sveltestrap';
    import { } from "node:os";
    
	
    let visible = false;
    let wvisible = false;
    let color = "danger";
    let page = 1;
    let totaldata=38;
    let weightStats = [];
    let newWeight = {
        provinces: "",
        year: "",
        normal_weight: "",
        overweight: "",
        obesity:""
    }
    let s_provinces= [];
    let current_province = "-";
	let checkMSG = "";
    let warningMSG = "";
    var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";

    let sProvince = "";
    let sYear = "";
    let sNormalWeight = "";
    let sOverWeight = "";
    let sObesity = "";
    
    //onMount(getStats);
 
    //Función GET para listar los recursos
    async function getStats() { 
        console.log("Fetching Data...");
        const res = await fetch(BASE_WEIGHTS_PATH + "?limit=10&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightStats = json;

            s_provinces = json.map((d) =>{
                return d.provinces;
            });
            s_provinces = Array.from(new Set(s_provinces));
            console.log("Received " + weightStats.length + " weight Data.");
        } else {
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }
 
    //Función LOADINITIALDATA para cargar los datos iniciales
    async function loadInitialData() { 
        console.log("Fetching data...");
        await fetch(BASE_WEIGHTS_PATH + "/loadInitialData");
        const res = await fetch(BASE_WEIGHTS_PATH + "?limit=10&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightStats = json;
            totaldata=38;
            console.log("Received " + weightStats.length + " weight data.");
            color = "success";
            checkMSG = "Datos cargados correctamente";
        } else {
            color = "danger";
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }
    
    //Función POST para añadir nuevos recursos  
    async function insertWeight(){		 
        console.log("Inserting data...");
        if (newWeight.year == "" || newWeight.year == null || newWeight.provinces == "") {
            alert("Los campos 'Comunidad Autónoma' y 'Año' no pueden estar vacios");
        } else{
            const res = await fetch(BASE_WEIGHTS_PATH,{
                method:"POST",
                body:JSON.stringify(newWeight),
                headers:{
                    "Content-Type": "application/json"
                }
            }).then(function (res) {
                visible=true;
                if (res.status == 201){
                    getStats();
                    totaldata++;
                    console.log("Data introduced");
                    color = "success";
                    checkMSG="Entrada introducida correctamente a la base de datos";
                }else if(res.status == 400){
                    console.log("ERROR Data was not correctly introduced");
                    color = "danger";
                    checkMSG= "Los datos de la entrada no fueron introducidos correctamente";
                }else if(res.status == 409){
                    console.log("ERROR There is already a data with that province and year in the da tabase");
                    color = "danger";
                    checkMSG= "Ya existe una entrada en la base de datos con la provincia y el año introducido";
                }
            });	
        }
    }    
    
    //Función DELETE para eliminar un recurso específico
    async function deleteWeights(province, year) {
        const res = await fetch(BASE_WEIGHTS_PATH + "/" + province + "/" + year, {
            method: "DELETE"
        }).then(function (res) {
            visible = true;
            getStats();      
            if (res.status==200) {
                totaldata--;
                color = "success";
                checkMSG = "Recurso "+province+" "+year+ " borrado correctamente";
                console.log("Deleted " + province);            
            } else if (res.status==404) {
                color = "danger";
                checkMSG = "No se ha encontrado el objeto " + province;
                console.log("SUICIDE NOT FOUND");            
            } else {
                color = "danger";
                checkMSG= res.status + ": " + res.statusText;
                console.log("ERROR!");
            }      
        });
    }

    //Función DELETE para eliminar todos los recursos
    async function deleteALL() {
		console.log("Deleting all weights data...");
		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")){
			console.log("Deleting all weights data...");
			const res = await fetch(BASE_WEIGHTS_PATH, {
				method: "DELETE"
			}).then(function (res) {
                visible=true;
				if (res.ok && totaldata>0){
                    totaldata = 0;
					getStats();
                    color = "success";
					checkMSG="Datos eliminados correctamente";
					console.log("OK All data erased");
				} else if (totaldata == 0){
                    console.log("ERROR Data was not erased");
                    color = "danger";
					checkMSG= "¡No hay datos para borrar!";
                } else{
					console.log("ERROR Data was not erased");
                    color = "danger";
					checkMSG= "No se han podido eliminar los datos";
				}
			});
		}
	} 

    //FUNCION DE BUSQUEDA COMPLETA
    async function busqueda (sProvince, sYear, sNormalWeight, sOverWeight, sObesity){
        if(typeof sProvince=='undefined'){
        sProvince="";
        }
        if(typeof sYear=='undefined'){
            sYear="";
        }
        if(typeof sNormalWeight=='undefined'){
            sNormalWeight="";
        }
        if(typeof sOverWeight=='undefined'){
            sOverWeight="";
        }
        if(typeof sObesity=='undefined'){
            sObesity="";
        }
		const res = await fetch(BASE_WEIGHTS_PATH + "?provinces="+sProvince+"&year="+sYear+"&normal_weight="+sNormalWeight+"&overweight="+sOverWeight+"&obesity="+sObesity)
		if (res.ok){
			const json = await res.json();
			weightStats = json;
			console.log("Found "+ weightStats.length + " data");
            visible = true;
			
			if(weightStats.length == 1){
                color = "success";
				checkMSG = "Se ha encontrado un dato para tu búsqueda";
			}else if(weightStats.length == 0){
                wvisible = true;
                color = "danger";
				checkMSG = "No se han encontrado datos para tu búsqueda";
                warningMSG = "Puede que haya un conflicto con los datos de tu búsqueda. Prueba a recargar la página!"			    
            }else{
                color = "success";
				checkMSG = "Se han encontrado " + weightStats.length + " datos para tu búsqueda";
                
            }
	    }
    }

    ////Función de paginación que consigue la página posterior
    async function getNextPage() { 
        console.log(totaldata);
        if (page+10 > totaldata) {
            page = 1
        } else {
            page+=10
        }
        
        visible = true;
        console.log("Charging page... Listing since: "+page);
        const res = await fetch(BASE_WEIGHTS_PATH + "?limit=10&offset="+(-1+page));
        color = "success";
        checkMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);

        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
			checkMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightStats = json;
            console.log("Received " + weightStats.length + " resources.");
        } else {
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }

    //Función de paginación que consigue la página anterior
    async function getPreviewPage() {

        console.log(totaldata);
        if (page-10 > 1) {
            page-=10; 
        } else page = 1

        visible = true;
        console.log("Charging page... Listing since: "+page);
        const res = await fetch(BASE_WEIGHTS_PATH + "?limit=10&offset="+(-1+page));
        color = "success";
        checkMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);

        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
			checkMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightStats = json;
            console.log("Received "+weightStats.length+" resources.");
        } else {
            checkMSG= res.status+": "+res.statusText;
            console.log("ERROR!");
        }
    }

  async function loadGraph(){
    Highcharts.chart('container', {

      title: {
          text: 'Gráfica IMC por comunidades'
      },

      yAxis: {
          title: {
              text: 'Porcentaje'
          }
      },

      xAxis: {
          accessibility: {
              rangeDescription: 'Range: 2011 to 2017'
          }
      },

      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
      },

      plotOptions: {
          series: {
              label: {
                  connectorAllowed: false
              },
              pointStart: 2011
          }
      },

      series: [{
          name: 'Peso normal',
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
      }, {
          name: 'Sobrepeso',
          data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
      }, {
          name: 'Obesidad',
          data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
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
      Gráfico de líneas en el que se ve representado el porcentaje por comunidades autónomas en los años 2014 y 2017 el IMC
    </p>
  </figure>

  <Button outline color="secondary" on:click="{pop}">Atrás</Button>
 
</main>

<style>
  .highcharts-figure, .highcharts-data-table table {
    min-width: 360px; 
    max-width: 800px;
    margin: 1em auto;
}

.highcharts-data-table table {
	font-family: Verdana, sans-serif;
	border-collapse: collapse;
	border: 1px solid #EBEBEB;
	margin: 10px auto;
	text-align: center;
	width: 100%;
	max-width: 500px;
}
.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}
.highcharts-data-table th {
	font-weight: 600;
    padding: 0.5em;
}
.highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
    padding: 0.5em;
}
.highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
    background: #f8f8f8;
}
.highcharts-data-table tr:hover {
    background: #f1f7ff;
}

</style>