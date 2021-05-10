<script>
	import { onMount } from "svelte";
	import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";
	import { Alert } from 'sveltestrap';
    import { } from "node:os";
	
    //ALERTAS
    let visible = false;
    let color = "danger";
    
    //Variables
    let page = 1;
    let totaldata=13;
    let SmokerStats = [];
	let newSmoker = {
        country: "España",
        province: "",
		year: "",
		dailySmoker:"",
		ocasionalSmoker:"",
		exSmoker:"",
        nonSmoker:""
	}
    let checkMSG = "";
    onMount(getSmoker);
 
    //GET
    async function getSmoker() {
 
        console.log("Fetching smokers Data...");
        const res = await fetch("/api/v1/smokers-stats?limit=5&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            SmokerStats = json;
            console.log("Received " + SmokerStats.length + " Smokers Data.");
        } else {
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }
 
    //GET INITIALDATA
    async function loadInitialData() {
 
        console.log("Fetching smokers data...");
        await fetch("/api/v1/smokers-stats/loadInitialData");
        const res = await fetch("/api/v1/smokers-stats?limit=5&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            SmokerStats = json;
            totaldata=13;
            console.log("Received " + SmokerStats.length + " Smokers data.");
            color = "success";
            checkMSG = "Datos cargados correctamente";
        } else {
            color = "danger";
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }
    
    //INSERT  
    async function insertSmokers(){
		 
        console.log("Inserting smokers data...");
        //Comprobamos que el año y la fecha no estén vacíos, el string vacio no es null
        if (newSmoker.year == "" || newSmoker.year == null || newSmoker.province == "") {
            alert("Los campos 'Comunidad Autónoma' y 'Año' no pueden estar vacios");
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
    /*
    //EDIT
    async function editSmokers(province, year){

         //Comprobamos que el año y la fecha no estén vacíos, el string vacio no es null
        if (newSmoker.year == "" || newSmoker.year == null || newSmoker.province == "") {
            alert("Los campos 'Comunidad Autónoma' y 'Año' no pueden estar vacíos");
        }else if (province != newSmoker.province || year != newSmoker.year){
            alert("Los campos 'Comunidad Autónoma' y 'Año' no pueden ser distintos");
        }else{
            
            console.log("Editing smokers data...");
            const res = await fetch("/api/v1/smokers-stats/" + province + "/" + year, {
                    method:"PUT",
                    body:JSON.stringify(newSmoker),
                    headers:{
                        "Content-Type": "application/json"
                    }
                }).then(function (res) {
                    visible=true;
                    if (res.status == 200){
                        console.log("Data updated");
                        getSmoker();
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
*/
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

    //DELETE ALL
    async function deleteALL() {
		console.log("Deleting smokers data...");
		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")){
			console.log("Deleting all smokers data...");
			const res = await fetch("/api/v1/smokers-stats/", {
				method: "DELETE"
			}).then(function (res) {
                visible=true;
				if (res.ok && totaldata>0){
                    totaldata = 0;
					getSmoker();
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
    
    
    //SEARCH
    //getNextPage
    async function getNextPage() {
 
        console.log(totaldata);
        if (page+5 > totaldata) {
            page = 1
        } else {
            page+=5
        }
        
        visible = true;
        console.log("Charging page... Listing since: "+page);
        const res = await fetch("/api/v1/smokers-stats?limit=5&offset="+(-1+page));
        //condicional imprime msg
        color = "success";
        checkMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+4);

        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
			checkMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            SmokerStats = json;
            console.log("Received " + SmokerStats.length + " resources.");
        } else {
            checkMSG= res.status + ": " + res.statusText;
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
        const res = await fetch("/api/v1/smokers-stats?limit=5&offset="+(-1+page));
        //condicional imprime msg
        color = "success";
        checkMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+4);

        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
			checkMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            SmokerStats = json;
            console.log("Received "+SmokerStats.length+" resources.");
        } else {
            checkMSG= res.status+": "+res.statusText;
            console.log("ERROR!");
        }
    }
    
</script>

<main>
    <h1 style ="text-align: center;">Administración: Datos de fumadores en España por comunidad autónoma</h1>

    {#await SmokerStats}
        Loading smokers data...
    {:then SmokerStats}
    
    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if checkMSG}
		    {checkMSG}
	    {/if}
    </Alert>

        <Table bordered responsive>
            <thead>
                <tr style ="text-align: center; background-color: lightslategray;">
                    <th>Comunidad Autónoma</th>
                    <th>Año</th>
                    <th>Fumadores diarios</th>
                    <th>Fumadores ocasionales</th>
                    <th>Ex-fumadores</th>
                    <th>No fumadores</th>
                    <th colspan="2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type = "text" placeholder="Babylon" bind:value="{newSmoker.province}"></td>
                    <td><input type = "number" placeholder="2075" bind:value="{newSmoker.year}"></td>
                    <td><input type = "number" placeholder="0000" bind:value="{newSmoker.dailySmoker}"></td> 
                    <td><input type = "number" placeholder="0000" bind:value="{newSmoker.ocasionalSmoker}"></td>    
                    <td><input type = "number" placeholder="0000" bind:value="{newSmoker.exSmoker}"></td>  
                    <td><input type = "number" placeholder="0000" bind:value="{newSmoker.nonSmoker}"></td>  
                    <td colspan="2" style="text-align: center;"><Button outline color="success" on:click={insertSmokers}>Insertar</Button></td>          
                </tr>
 
                {#each SmokerStats as sc}
                    <tr>
                        <td><b>{sc.province}</b></td>
                        <td>{sc.year}</td>
                        <td>{sc.dailySmoker}</td>
                        <td>{sc.ocasionalSmoker}</td>
                        <td>{sc.exSmoker}</td>
                        <td>{sc.nonSmoker}</td>
                        <td><Button outline color="danger" on:click="{deleteSmokers(sc.province, sc.year)}">Borrar</Button></td>
                        <td><a href="#/smokers-stats/{sc.province}/{sc.year}"><Button outline color="primary">Editar</Button></a></td>
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