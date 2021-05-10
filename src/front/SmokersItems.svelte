<script>
	import { onMount } from "svelte";
	import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";
	import { Alert } from 'sveltestrap';
    
    import Datos from './Smokers.svelte';
	
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
    
</script>

<main>
    <h1 style ="text-align: center;">Modificación</h1>

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
                <tr style ="text-align: center;">
                    <th>Comunidad Autónoma</th>
                    <th>Año</th>
                    <th>Fumadores diarios</th>
                    <th>Fumadores ocasionales</th>
                    <th>Ex-fumadores</th>
                    <th>No fumadores</th>
                    <th colspan="2">Acción</th>
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
                    <td colspan="2" style="text-align: center;"><Button outline color="primary" on:click={Datos.insertSmokers}>Insertar</Button></td>          
                </tr>
            </tbody>
        </Table>
          <Button color="primary" on:click="{Datos}">
            Volver
        </Button>
         
    {/await}
</main>