<script>
	import { onMount } from "svelte";
    import { pop }from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";
	import { Alert } from 'sveltestrap';
	
    //ALERTAS
    let visible = false;
    let color = "danger";
    

    //Variables
    export let params = {};
    let BASE_SMOKERS_PATH = "/api/v2/smokers-stats";
    let SmokerStats = {};
    let newprovince = "XXXXX";
    let newyear = 2017;
    let newdailySmoker = "";
    let newocasionalSmoker = "";
    let newexSmoker = "";
    let newnonSmoker = "";

    let checkMSG = "";
    
    
    onMount(getSmoker);
 
    //GET
    async function getSmoker() {
 
        console.log("Fetching smokers Data...");
        const res = await fetch(BASE_SMOKERS_PATH+"/"+params.province+"/"+params.year);
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            SmokerStats = json;
            console.log("Received smokers Data.");
        } else {
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR! "+checkMSG);
        }
    }
    
    //EDIT
    async function editSmokers(){
        console.log("Updating item..." + JSON.stringify(params.province));
        const res = await fetch(BASE_SMOKERS_PATH+"/"+params.province+"/"+params.year, {
            method: "PUT",
            body : JSON.stringify({
                country : "España",
                province: params.province,
		        year: params.year,
		        dailySmoker: parseFloat(newdailySmoker),
		        ocasionalSmoker: parseFloat(newocasionalSmoker),
		        exSmoker: parseFloat(newexSmoker),
                nonSmoker: parseFloat(newnonSmoker)
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res){
            visible = true;
            if(res.status == 200){
               console.log("Data introduced");
               color = "success";
               checkMSG="Recurso actualizado correctamente";
            }else{
                console.log("Data not edited");
                checkMSG= "Se ha producido un error y no se ha podido editar correctamente el recurso solicitado";
            }
            
        })
    }


/*
    onMount(getUpdaters);
    async function getUpdaters() {
        console.log("Fetching data updated...");
        const res = await fetch(BASE_SMOKERS_PATH+"/"+params.province+"/"+params.year);
        if (res.ok) {
            console.log("All OK");
            const json = await res.json();
            register = json;
            newyear = parseInt(register.year);
            newprovince = register.province;
            newdailySmoker = parseFloat(register.dailySmoker);
            newocasionalSmoker = parseFloat(register.ocasionalSmoker);
            newexSmoker =parseFloat(register.exSmoker);
            newnonSmoker =parseFloat(register.nonSmoker);
            console.log("Received register.");
        } else {
            errorMsg = res.status + ": " + res.statusText;
            console.log("ERROR!" + errorMsg);
        }
    }

    async function updateReg() {
        console.log("Updating register...");
        const res = await fetch(BASE_SMOKERS_PATH+"/"+params.province+"/"+params.year, {
            method: "PUT",
            body: JSON.stringify({
                province: params.province,
		        year: params.year,
		        dailySmoker: newdailySmoker,
		        ocasionalSmoker: newocasionalSmoker,
		        exSmoker: newexSmoker,
                nonSmoker: newnonSmoker 
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getUpdaters();
            console.log("Data introduced");
            color = "success";
            checkMSG="Recurso actualizado correctamente";
        });
    }
*/
</script>

<main>
    
    <h1 style ="text-align: center;">Modificación de {params.province} {params.year}</h1>

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
                    <td>{params.province}</td>
                    <td>{params.year}</td>
                    <td><input bind:value="{newdailySmoker}"></td> 
                    <td><input bind:value="{newocasionalSmoker}"></td>    
                    <td><input bind:value="{newexSmoker}"></td>  
                    <td><input bind:value="{newnonSmoker}"></td>  
                    <td style="text-align: center;"><Button outline color="primary" on:click={editSmokers}>Actualizar</Button></td>          
                </tr>
            </tbody>
        </Table>
        
        <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>