<script>
	import { onMount } from "svelte";
	import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";
	import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';
	import { Form, FormGroup, FormText, Input, Label } from 'sveltestrap';
	import { Alert } from 'sveltestrap';
    import { UncontrolledCollapse, Collapse, CardBody, Card } from "sveltestrap";
	import { pop } from "svelte-spa-router";
    import { get } from "svelte/store";
	
    
    let isOpen = false;
    let busquedas = "/api/v1/smokers-stats";
    //ALERTAS
    let visible = false;
    let color = "danger";
    
    let page = 1;
    let totaldata=14;
    let SmokerStats = [];
	let newSmoker = {
        province: "",
		year: "",
		dailySmoker:"",
		ocasionalSmoker:"",
		exSmoker:"",
        nonSmoker:""
	}
    
    let errorMSG = "";
    let okayMSG = "";
    onMount(getSmoker);
 
    //GET
    async function getSmoker() {
 
        console.log("Fetching employment Data...");
        const res = await fetch("/api/v1/smokers-stats?limit=5&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            SmokerStats = json;
            console.log("Received " + SmokerStats.length + " Smokers Data.");
        } else {
            errorMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }
 
    //GET INITIALDATA
    async function loadInitialData() {
 
        console.log("Fetching employment data...");
        await fetch("/api/v1/smokers-stats/loadInitialData");
        const res = await fetch("/api/v1/smokers-stats?limit=5&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            SmokerStats = json;
            totaldata=14;
            console.log("Received " + SmokerStats.length + " Smokers data.");
            color = "success";
            errorMSG = "Datos cargados correctamente";
        } else {
            color = "danger";
            errorMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }
    
    //INSERT
    
    async function insertSmokers(){
		 
         console.log("Inserting smokers data...");
         //Comprobamos que el año y la fecha no estén vacíos, el string vacio no es null
         if (newSmoker.year == "" || newSmoker.year == null || newSmoker.province == "") {
             alert("Los campos 'Provincia' y 'Año' no pueden estar vacios");
         } else{
             const res = await fetch("/api/v1/smokers-stats",{
             method:"POST",
             body:JSON.stringify(newSmoker),
             headers:{
                 "Content-Type": "application/json"
             }
             }).then(function (res) {
                 visible=true;
                 if (res.status == 201){
                     getSmoker();
                     console.log("Data introduced");
                     color = "success";
                     errorMSG="Entrada introducida correctamente a la base de datos";
                 }else if(res.status == 400){
                     console.log("ERROR Data was not correctly introduced");
                     color = "danger";
                     errorMSG= "Los datos de la entrada no fueron introducidos correctamente";
                 }else if(res.status == 409){
                     console.log("ERROR There is already a data with that country and year in the da tabase");
                     color = "danger";
                     errorMSG= "Ya existe una entrada en la base de datos con la fecha y el país introducido";
                 }
             });	
         }
     }

    //DELETE SPECIFIC
    async function deleteSmokers(province, year) {
        const res = await fetch("/api/v1/smokers-stats/" + province + "/" + year, {
            method: "DELETE"
        }).then(function (res) {
            visible = true;
            getSmoker();      
            if (res.status==200) {
                totaldata--;
                color = "success";
                errorMSG = "Recurso "+province+" "+year+ " borrado correctamente";
                console.log("Deleted " + province);            
            } else if (res.status==404) {
                color = "danger";
                errorMSG = "No se ha encontrado el objeto" + province;
                console.log("SUICIDE NOT FOUND");            
            } else {
                color = "danger";
                errorMSG= res.status + ": " + res.statusText;
                console.log("ERROR!");
            }      
        });
    }

    //DELETE ALL
    async function deleteALL() {
		console.log("Deleting employment data...");
		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")){
			console.log("Deleting all employment data...");
			const res = await fetch("/api/v1/smokers-stats/", {
				method: "DELETE"
			}).then(function (res) {
                visible=true;
				if (res.ok && totaldata>1){
                    totaldata = 0;
					getSmoker();
                    color = "success";
					errorMSG="Datos eliminados correctamente";
					console.log("OK All data erased");
				} else if (totaldata == 0 || totaldata == 1){
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
    //SEARCH
    /*
    
    */
    //getNextPage
    async function getNextPage() {
 
        console.log(totaldata);
        if (page+5 > totaldata) {
            page = 1
        } else {
            page+=5
        }
        console.log("Charging page... Listing: "+page);
        const res = await fetch("/api/v1/smokers-stats?limit=5&offset="+(-1+page));
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            SmokerStats = json;
            console.log("Received " + SmokerStats.length + " resources.");
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
        console.log("Charging page... Listing: "+page);
        const res = await fetch("/api/v1/smokers-stats?limit=5&offset="+(-1+page));
        if (totaldata == 0 || totaldata == 1){
                    console.log("ERROR Data was not erased");
                    color = "danger";
					errorMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            SmokerStats = json;
            console.log("Received "+SmokerStats.length+" resources.");
        } else {
            errorMSG= res.status+": "+res.statusText;
            console.log("ERROR!");
        }
    }
    
</script>

<main>
    <h1 style ="text-align: center;">Administración de datos de fumadores</h1>

    {#await SmokerStats}
        Loading smokers data...
    {:then SmokerStats}
    
    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if errorMSG}
		    {errorMSG}
	    {/if}
    </Alert>

        <Table bordered responsive>
            <thead>
                <tr>
                    <th>Comunidad Autónoma</th>
                    <th>Año</th>
                    <th>Fumadores diarios </th>
                    <th>Fumadores ocasionales </th>
                    <th>Ex-fumadores </th>
                    <th>No fumadores </th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type = "text" placeholder="Extremadura" bind:value="{newSmoker.province}"></td>
                    <td><input type = "number" placeholder="2075" bind:value="{newSmoker.year}"></td>
                    <td><input type = "number" placeholder="0000" bind:value="{newSmoker.dailySmoker}"></td> 
                    <td><input type = "number" placeholder="0000" bind:value="{newSmoker.ocasionalSmoker}"></td>    
                    <td><input type = "number" placeholder="0000" bind:value="{newSmoker.exSmoker}"></td>  
                    <td><input type = "number" placeholder="0000" bind:value="{newSmoker.nonSmoker}"></td>  
                    <td><Button outline color="primary" on:click={insertSmokers}>Insertar</Button></td>           
                </tr>
 
                {#each SmokerStats as sc}
                    <tr>
                        <td><a href="#/smokers-stats/{sc.province}/{sc.year}">{sc.province}</a></td>
                        <td>{sc.year}</td>
                        <td>{sc.dailySmoker}</td>
                        <td>{sc.ocasionalSmoker}</td>
                        <td>{sc.exSmoker}</td>
                        <td>{sc.nonSmoker}</td>
                        <td><Button outline color="danger" on:click="{deleteSmokers(sc.province, sc.year)}">Borrar</Button></td>
                        
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