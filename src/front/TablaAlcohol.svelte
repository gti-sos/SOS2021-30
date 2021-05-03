<script>

    import{
        onMount
    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";

    import Button from "sveltestrap/src/Button.svelte";

    import { Alert } from 'sveltestrap';

    let visible = false;
    let color = "danger";
    let page = 1;
    let totaldata=5; // Número total de los datos
    let errorMSG = "";

    var BASE_ALCOHOL_PATH = "/api/v1/alcohol-consumption-stats/";

    let alcoholStats = [];
    let newAlcohol = {
        country:"",
        year:"",
        ageRange:"",
        alcoholPrematureDeath: "",
        prevalenceOfAlcoholUseDisorder:""
	}

    //GET INITIALDATA
    async function loadInitialData() {
        console.log("Fetching employment data...");
        await fetch("/api/v1/alcohol-consumption-stats/loadInitialData");
        const res = await fetch("/api/v1/alcohol-consumption-stats?limit=3&offset=0");
            if (res.ok) {
                console.log("Ok:");
                const json = await res.json();
                alcoholStats = json;
                totaldata=13;
                console.log("Received " + alcoholStats.length + " alcohol data.");
                color = "success";
                errorMSG = "Datos cargados correctamente";
            } else {
                color = "danger";
                errorMSG= res.status + ": " + res.statusText;
                console.log("ERROR!");
            }
    }
    //Actualizarsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss

    async function updateAlcohol(country, year, ageRange){
        if (newAlcohol.year == "" || newAlcohol.year == null || newAlcohol.country == "" || newAlcohol.ageRange == "") {
            alert("Los campos País, Año y Rango de edad no pueden estar vacíos");
        }else if (country != newAlcohol.country || year != newAlcohol.year || ageRange != newAlcohol.ageRange){
            alert("Los campos País, Año y Rango de edad no pueden ser distintos");
        }else{
            
            console.log("Editing alcohol data...");
            const res = await fetch(BASE_ALCOHOL_PATH + country + "/" + year + "/" + ageRange, {
                    method:"PUT",
                    body:JSON.stringify(newAlcohol),
                    headers:{
                        "Content-Type": "application/json"
                    }
                }).then(function (res) {
                    visible=true;
                    if (res.status == 200){
                        console.log("Data updated");
                        getStats();
                        color = "success";
                        checkMSG ="Entrada modificada correctamente en la base de datos";
                    }else if(res.status == 400){
                        console.log("ERROR Data was not correctly introduced");
                        color = "danger";
                        checkMSG= "Los datos de la entrada no fueron introducidos correctamente";
                    }else if(res.status == 409){
                        console.log("ERROR There is already a data with that province and year in the da tabase");
                        color = "danger";
                        checkMSG= "Ya existe una entrada en la base de datos con los datos introducidos";
                    }
                });	
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
    async function getStats(){
        console.log("Fetching stats...");
        const res= await fetch(BASE_ALCOHOL_PATH);

        if(res.ok){
            console.log("ok");
            const json= await res.json();
            alcoholStats=json;
            updateAgeRange=alcoholStats.ageRange;
            updatePrematureDeath=alcoholStats.alcoholPrematureDeath;
            updateDisorder=alcoholStats.prevalenceOfAlcoholUseDisorder;
            console.log(`We have received ${alcoholStats.length} alcohol stats`);
        }else{
            console.log("Error")
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
                errorMSG = "Recurso "+province+" "+year+ + " " + ageRange+ " borrado correctamente";
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

        //sigueinte pagina
        async function getNextPage() {
 
            console.log(totaldata);
            if (page+5 > totaldata) {
                page = 1
            } else {
                page+=5
            }
            
            visible = true;
            console.log("Charging page... Listing since: "+page);
            const res = await fetch("/api/v1/alcohol-consumption-stats?limit=3&offset="+(-1+page));
            color = "success";
            errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+4);

            if (totaldata == 0){
                console.log("ERROR Data was not erased");
                color = "danger";
                errorMSG= "¡No hay datos!";
            }else if (res.ok) {
                console.log("Ok:");
                const json = await res.json();
                SmokerStats = json;
                console.log("Received " + alcoholStats.length + " resources.");
            } else {
                errorMSG= res.status + ": " + res.statusText;
                console.log("ERROR!");
            }
        }
            //getPreviewPage
            async function getPreviewPage() {

                console.log(totaldata);
                if (page-5 > 1) {
                    page-=5; 
                } else page = 1

                visible = true;
                console.log("Charging page... Listing since: "+page);
                const res = await fetch("/api/v1/alcohol-consumption-stats?limit=5&offset="+(-1+page));
                color = "success";
                errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+4);

                if (totaldata == 0){
                    console.log("ERROR Data was not erased");
                    color = "danger";
                    errorMSG= "¡No hay datos!";
                }else if (res.ok) {
                    console.log("Ok:");
                    const json = await res.json();
                    SmokerStats = json;
                    console.log("Received "+alcoholStats.length+" resources.");
                } else {
                    errorMSG= res.status+": "+res.statusText;
                    console.log("ERROR!");
                }
            }

    onMount(getStats);

</script>

<main>
    <h1  style ="text-align: center;">Datos sobre consumo de alcohol</h1>
    <br>

    
    {#await alcoholStats}
        Loading alcohol data...
    {:then alcoholStats}
    
    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if errorMSG}
		    {errorMSG}
	    {/if}
    </Alert>

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
                    <td colspan="2" style="text-align: center;"><Button outline color="primary" on:click={insertAlcohol}>Insertar</Button></td>           
                </tr>
 
                {#each alcoholStats as stat}
                    <tr>
                        <td><a href="#/alcohol-stats/{stat.country}/{stat.year}/{stat.ageRange}">{stat.country}</a></td>
                        <td>{stat.year}</td>
                        <td>{stat.ageRange}</td>
                        <td>{stat.alcoholPrematureDeath}</td>
                        <td>{stat.prevalenceOfAlcoholUseDisorder}</td>
                        <td><Button outline color="danger" on:click="{deleteSpecificAlcohol(stat.country, stat.ageRange,stat.year)}">Borrar</Button></td>
                        <td><Button outline color="primary" on:click="{updateAlcohol(stat.country,stat.year,stat.ageRange)}">Editar</Button></td>
                        
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
           Atrás
        </Button>
        <Button outline color="primary" on:click="{getNextPage}">
            Siguiente
         </Button>
         
    {/await}
</main>