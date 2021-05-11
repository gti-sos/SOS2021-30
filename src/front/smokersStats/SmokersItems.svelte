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
    let stats = {};
    let updDaily = null;
    let updOcasional = null;
    let updEx = null;
    let updNon = null;

    let checkMSG = "";
 
    onMount(getGET);

    async function getGET() {
        console.log("Fetching award...");
        const res = await fetch(BASE_SMOKERS_PATH+"/"+params.province+"/"+params.year);
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            stats = json;
            updDaily = stats.dailySmoker;
            updOcasional = stats.ocasionalSmoker;
            updEx = stats.exSmoker;
            updNon = stats.nonSmoker;
            console.log("Received data.");
        }else {
            if(res.status===404){
                checkMSG = "No se encuentra el dato solicitado";
                }else if(res.status ===500){
                errorMsg = "No se han podido acceder a la base de datos";
                }        
                console.log("ERROR!" + checkMSG);
            }
    }

    async function updateUPD() {
        console.log("Updating award..." + JSON.stringify(params.province));
        const res = await fetch(BASE_SMOKERS_PATH+"/" + params.province + "/" + params.year, {
        method: "PUT",
        body: JSON.stringify({
                country : "España",
                province: params.province,
		        year: params.year,
		        dailySmoker: updDaily,
		        ocasionalSmoker: updOcasional,
		        exSmoker: updEx,
                nonSmoker: updNon
            }),
    headers: {
        "Content-Type": "application/json"
    }
}).then(function (res) {
      if (res.ok) {
        console.log("OK");
        getGET();
        checkMSG = "Operación realizada correctamente, vuelva atras para ver todos los datos en la tabla";
      } else {
        if(res.status===404){
          checkMSG = "No se encuentra el dato a editar";
        }else if(res.status ===500){
          checkMSG = "No se han podido acceder a la base de datos";
        }else if(res.status ===400){
          checkMSG = "se han introducido datos erroneos";
          }        
        checkMSG = "";
        console.log("ERROR!" + checkMSG);
      }
    });
  }



    //GET
    async function getStats() {
 
        console.log("Fetching smokers Data...");
        const res = await fetch(BASE_SMOKERS_PATH+"/"+params.province+"/"+params.year);
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            updDaily = stats.dailySmoker;
            updOcasional = stats.ocasionalSmoker;
            updEx = stats.exSmoker;
            updNon = stats.nonSmoker;
            stats = json;
            console.log("Received smokers stats.");
        } else {
            checkMSG = " El tipo de error es: " + res.status + ", y quiere decir: " + res.statusText;
            console.log("ERROR! ");
        }
    }
    
    //EDIT
    async function updateStat(){
        console.log("Updating item..." + JSON.stringify(params.province));
        const res = await fetch(BASE_SMOKERS_PATH+"/"+params.province+"/"+params.year, {
            method: "PUT",
            body : JSON.stringify({
                country : "España",
                province: params.province,
		        year: params.year,
		        dailySmoker: updDaily,
		        ocasionalSmoker: updOcasional,
		        exSmoker: updEx,
                nonSmoker: updNon
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
                    <td><input bind:value="{updDaily}"></td> 
                    <td><input bind:value="{updOcasional}"></td>    
                    <td><input bind:value="{updEx}"></td>  
                    <td><input bind:value="{updNon}"></td>  
                    <td style="text-align: center;"><Button outline color="primary" on:click={updateUPD}>Actualizar</Button></td>          
                </tr>
            </tbody>
        </Table>
        <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>