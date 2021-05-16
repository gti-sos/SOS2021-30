<script>
    import { onMount }from "svelte";
    import { pop }from "svelte-spa-router";
    import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";
    import { Alert } from 'sveltestrap';

    var BASE_ALCOHOL_PATH = "/api/v2/alcohol-consumption-stats";

    let visible = false;
    let checkMSG = "";
    let color = "danger";
    export let params = {};
    let alcoholStats = {};
    let updatedAlcoholPrematureDeath = null;
    let updatedPrevalenceOfAlcoholUseDisorder = null;
    let errorMsg = "";

    onMount(getStat);

    async function getStat(){
        console.log("Fetching datas...");
        const res = await fetch(BASE_ALCOHOL_PATH + "/" + params.country + "/" + params.year + "/" + params.ageRange);
        if(res.ok){
            console.log("Ok");
            const json = await res.json();
            updatedAlcoholPrematureDeath = alcoholStats.alcoholPrematureDeath;
            updatedPrevalenceOfAlcoholUseDisorder = alcoholStats.prevalenceOfAlcoholUseDisorder;
            console.log("Recived data");
        }else{
            errorMsg = res.status + " " + res.statusText;
            console.log("ERROR" + errorMsg);
        }
        
    }
    async function updateAlcohol(){          
            console.log("Editing alcohol data...");
            const res = await fetch(BASE_ALCOHOL_PATH + "/" + params.country + "/" + params.year + "/" + params.ageRange, {
                    method:"PUT",
                    body : JSON.stringify({
                        country: params.country,
                        year: params.year,
                        ageRange: params.ageRange,
                        alcoholPrematureDeath: parseFloat(updatedAlcoholPrematureDeath),
                        prevalenceOfAlcoholUseDisorder: parseFloat(updatedPrevalenceOfAlcoholUseDisorder)
                    }),
                    headers:{
                        "Content-Type": "application/json"
                    }
                }).then(function (res) {
                    visible = true;
                    if(res.status == 200){
                        getStat(); 
                        console.log("Data introduced");
                        color = "success";
                        checkMSG="Recurso actualizado correctamente";
                    }else{
                        console.log("Data not edited");
                        checkMSG= "Se ha producido un error y no se ha podido editar correctamente el recurso solicitado";
                    }
                });	
    }

</script>

<main>

    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if checkMSG}
		    {checkMSG}
	    {/if}
    </Alert>

    <h1>Recurso '{params.country} , {params.year} , {params.ageRange}' listo para editar</h1>
    <Table bordered>
        <thead>
            <tr>
                <th>País</th>
                <th>Año</th>
                <th>Rango de edad</th>
                <th>Muertes prematuras a causa del alcohol</th>
                <th>Prevalencia del trastorno por consumo de alcohol</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{params.country}</td>
                <td>{params.year}</td>
                <td>{params.ageRange}</td>
                <td><input bind:value="{updatedAlcoholPrematureDeath}"></td>
                <td><input bind:value="{updatedPrevalenceOfAlcoholUseDisorder}"></td>
                <td><Button outline color="primary" on:click={updateAlcohol}>Actualizar</Button></td>
            </tr>
        </tbody>
    </Table>

    {#if errorMsg}
        <p style="color: red">ERROR: {errorMsg}</p>
    {/if}
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>