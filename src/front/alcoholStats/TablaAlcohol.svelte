<script>

    import{
        onMount
    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";

    import Button from "sveltestrap/src/Button.svelte";

    import { Alert } from 'sveltestrap';

    let visible = false;
    let color = "white";
    let page = 1;
    let totaldata=14; // Número total de los datos
    let errorMSG = "";

    var BASE_ALCOHOL_PATH = "/api/v1/alcohol-consumption-stats/";
    let b_ageRange = [];
    let alcoholStats = [];
    let newAlcohol = {
        country:"",
        year:"",
        ageRange:"",
        alcoholPrematureDeath: "",
        prevalenceOfAlcoholUseDisorder:""
	}
    let busquedaCountry = "";
    let busquedaYear = "";
    let busquedaAgeRange = "";
    let busquedaAlcoholPrematureDeath = "";
    let busquedaPrevalenceOfAlcoholUseDisorder = "";

    onMount(getStats);

    //GET INITIALDATA
    async function loadInitialData() {
        console.log("Fetching employment data...");
        await fetch("/api/v1/alcohol-consumption-stats/loadInitialData");
        const res = await fetch("/api/v1/alcohol-consumption-stats?limit=10&offset=0");
            if (res.ok) {
                console.log("Ok:");
                const json = await res.json();
                alcoholStats = json;
                totaldata=14;
                console.log("Received " + alcoholStats.length + " alcohol data.");
                color = "success";
                errorMSG = "Datos cargados correctamente";
            } else {
                color = "danger";
                errorMSG= res.status + ": " + res.statusText;
                console.log("ERROR!");
            }
    }
    //INSERT
    
    async function insertAlcohol(){
		 
         console.log("Inserting alcohol data...");
         if (newAlcohol.year == "" || newAlcohol.year == null || newAlcohol.country == "" || newAlcohol.ageRange=="") {
             alert("Los campos 'País' y 'Año' no pueden estar vacios");
         } else{
             const res = await fetch("/api/v1/alcohol-consumption-stats",{
             method:"POST",
             body:JSON.stringify(newAlcohol),
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
                     errorMSG="Entrada introducida correctamente a la base de datos";
                 }else if(res.status == 400){
                     console.log("ERROR Data was not correctly introduced");
                     color = "danger";
                     errorMSG= "Los datos de la entrada no fueron introducidos correctamente";
                 }else if(res.status == 409){
                     console.log("ERROR There is already a data with that province and year in the da tabase");
                     color = "danger";
                     errorMSG= "Ya existe una entrada en la base de datos con el país, el año y el rango de edad";
                 }
             });	
         }
     }

    //Mostrar datos
    async function getStats() { 
        console.log("Fetching Data...");
        const res = await fetch(BASE_ALCOHOL_PATH + "?limit=10&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            alcoholStats = json;

            b_ageRange = json.map((d) =>{
                return d.ageRange;
            });
            b_ageRange = Array.from(new Set(b_ageRange));
            console.log("Received " + alcoholStats.length + " alcohol Data.");
        } else {
            errorMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }

    //Borrar datos
    async function deleteALL() {
		console.log("Deleting weights data...");
		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")){
			console.log("Deleting all weights data...");
			const res = await fetch(BASE_ALCOHOL_PATH, {
				method: "DELETE"
			}).then(function (res) {
                visible=true;
				if (res.ok && totaldata>0){
                    totaldata = 0;
					getStats();
                    color = "success";
					errorMSG="Datos eliminados correctamente";
					console.log("OK All data erased");
				} else if (totaldata == 0){
                    console.log("ERROR Data was not erased");
                    color = "danger";
					errorMSG= "¡No hay datos para borrar!";
                } else{
					console.log("ERROR Data was not erased");
                    color = "danger";
					errorMSG= "No se han podido eliminar los datos";
				}
			});
		}
	}
    //Borrar dato especifico
    async function deleteSpecificAlcohol(country,ageRange, year) {
        const res = await fetch(BASE_ALCOHOL_PATH + country + "/" + year + "/" + ageRange, {
            method: "DELETE"
        }).then(function (res) {
            visible = true;
            getStats();      
            if (res.status==200) {
                totaldata--;
                color = "success";
                errorMSG = "Recurso "+ "'" + country + ", " + year +  ", " + ageRange + "'" + " borrado correctamente";
                console.log("Deleted " + country);            
            } else if (res.status==404) {
                color = "danger";
                errorMSG = "No se ha encontrado el objeto" + country;
                console.log("STAT NOT FOUND");            
            } else {
                color = "danger";
                errorMSG= res.status + ": " + res.statusText;
                console.log("ERROR!");
            }      
        });
    }
    //Funcion de busqueda
    async function busqueda(busquedaCountry, busquedaYear, busquedaAgeRange, busquedaAlcoholPrematureDeath, busquedaPrevalenceOfAlcoholUseDisorder){
    if(typeof busquedaCountry=='undefined'){
        busquedaCountry="";
    }
    if(typeof busquedaYear=='undefined'){
        busquedaYear="";
    }
    if(typeof busquedaAgeRange=='undefined'){
        busquedaAgeRange="";
    }
    if(typeof busquedaAlcoholPrematureDeath=='undefined'){
        busquedaAlcoholPrematureDeath="";
    }
    if(typeof busquedaPrevalenceOfAlcoholUseDisorder=='undefined'){
        busquedaPrevalenceOfAlcoholUseDisorder="";
    }
    const res = await fetch(BASE_ALCOHOL_PATH + "?country="+busquedaCountry+"&year="+busquedaYear+"&ageRange="+busquedaAgeRange+"&alcoholPrematureDeath="+busquedaAlcoholPrematureDeath+"&prevalenceOfAlcoholUseDisorder="+busquedaPrevalenceOfAlcoholUseDisorder);
    if (res.ok){
        const json = await res.json();
        alcoholStats = json;
        console.log("Found "+ alcoholStats.length + " data");
        
        if(alcoholStats.length==1){
            color = "success"
            errorMSG = "Se ha encontrado " + alcoholStats.length + " dato";
        }else{
            color = "success"
            errorMSG = "Se han encontrado " + alcoholStats.length + " datos";
        }
    }
}

    //siguiente pagina
    async function getNextPage() {

        console.log(totaldata);
        if (page+10 > totaldata) {
            page = 1
        } else {
            page+=10
        }
        
        visible = true;
        console.log("Charging page... Listing since: "+page);
        const res = await fetch("/api/v1/alcohol-consumption-stats/?limit=10&offset="+(-1+page));
        color = "success";
        errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);

        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            errorMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            alcoholStats = json;
            console.log("Received " + alcoholStats.length + " resources.");
        } else {
            errorMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }
    //getPreviewPage    
    async function getPreviewPage() {

        console.log(totaldata);
        if (page-10 > 1) {
            page-=5; 
        } else page = 1

        visible = true;
        console.log("Charging page... Listing since: "+page);
        const res = await fetch(BASE_ALCOHOL_PATH + "?limit=10&offset="+(-1+page));
        color = "success";
        errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);

        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            errorMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            alcoholStats = json;
            console.log("Received "+alcoholStats.length+" resources.");
        } else {
            errorMSG= res.status+": "+res.statusText;
            console.log("ERROR!");
        }
    }

</script>

<main>
    <h1  style ="text-align: center;">Datos sobre consumo de alcohol</h1>
    <br>

    
    {#await alcoholStats}
        Loading alcohol data...
    {:then alcoholStats}
    
    <Alert color={color} isOpen={true} toggle={() => (visible = false)}>
        {#if errorMSG.length>0}
		    {errorMSG}
	    {/if}
    </Alert>
    <h4 style="text-align:center"><strong>Búsqueda general de parámetros</strong></h4>

    <Table>
        <th>Búsqueda por país</th>
        <th>Búsqueda por año</th>
        <th>Búsqueda por rango de edad</th>
        <th>Búsqueda por muertes prematuras</th>
        <th>Búsqueda por prevalencia del trastorno por consumo de alcohol</th>
        <tr>
            <td><input type = "text" placeholder="País" bind:value="{busquedaCountry}"></td>
            <td><input type = "text" placeholder="2017" bind:value="{busquedaYear}"></td>
            <td><input type = "text" placeholder="0" bind:value="{busquedaAgeRange}"></td>
            <td><input type = "number" placeholder="0.0" bind:value="{busquedaAlcoholPrematureDeath}"></td>
            <td><input type = "number" placeholder="0.0" bind:value="{busquedaPrevalenceOfAlcoholUseDisorder}"></td>
        </tr>
    </Table>
    <div style="text-align:center">
        <Button outline color="primary" on:click="{busqueda (busquedaCountry, busquedaYear, busquedaAgeRange, busquedaAlcoholPrematureDeath, busquedaPrevalenceOfAlcoholUseDisorder)}">Buscar</Button>
    </div>
    <br>
    <h4 style="text-align:center"><strong>Datos</strong></h4>

        <Table bordered responsive>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Rango de edad </th>
                    <th>Muertes prematuras a causa del alcohol</th>
                    <th>Prevalencia de trastornos por consumo de alcohol</th>
                    <th colspan="2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type = "text" placeholder="España" bind:value="{newAlcohol.country}"></td>
                    <td><input type = "text" placeholder="2017" bind:value="{newAlcohol.year}"></td> 
                    <td><input type = "text" placeholder="40-45" bind:value="{newAlcohol.ageRange}"></td> 
                    <td><input type = "number" placeholder="10" bind:value="{newAlcohol.alcoholPrematureDeath}"></td>    
                    <td><input type = "number" placeholder="0.4" bind:value="{newAlcohol.prevalenceOfAlcoholUseDisorder}"></td>  
                    <td><Button outline color="primary" on:click={insertAlcohol}>Insertar</Button></td>           
                </tr>
 
                {#each alcoholStats as stat}
                    <tr>
                        <td>{stat.country}</td>
                        <td>{stat.year}</td>
                        <td>{stat.ageRange}</td>
                        <td>{stat.alcoholPrematureDeath}</td>
                        <td>{stat.prevalenceOfAlcoholUseDisorder}</td>
                        <td><a href="#/alcohol-stats/{stat.country}/{stat.year}/{stat.ageRange}"><Button outline color="primary">Editar</Button></a></td>
                        <td><Button outline color="danger" on:click="{deleteSpecificAlcohol(stat.country, stat.ageRange,stat.year)}">Borrar</Button></td>
                    </tr>
                {/each}
            </tbody>
        </Table>
          <Button color="success" on:click="{loadInitialData}">
            Cargar datos inciales
        </Button>
        <Button color="danger" on:click="{deleteALL}">
            Eliminar todo
        </Button>
        <Button outline color="primary" on:click="{getPreviewPage}">
           Anterior
        </Button>
        <Button outline color="primary" on:click="{getNextPage}">
            Siguiente
         </Button>
         
    {/await}
</main>