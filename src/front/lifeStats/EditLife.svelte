<script>
    import { onMount }from "svelte";
    import { pop }from "svelte-spa-router";
    import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";
    import { Alert } from 'sveltestrap';

    var BASE_API_PATH = "/api/v2/life-expectancy-stats";

    let visible = false;
    let color = "danger";
    export let params = {};
    let lifeStats = {};
    let updatedCountry = "";
    let updatedLifeExpectancyWoman = null;
    let updatedLifeExpectancyMan = null;
    let updatedAverageLifeExpectancy = null;
    let errorMsg = "";

    onMount(getLife);

    async function getLife(){
        console.log("Fetching datas...");
        const res = await fetch(BASE_API_PATH + "/" + params.province + "/" + params.year);
        if(res.ok){
            console.log("Ok");
            const json = await res.json();
            updatedCountry = lifeStats.updatedCountry;
            updatedLifeExpectancyWoman = lifeStats.updatedLifeExpectancyWoman;
            updatedLifeExpectancyMan = lifeStats.updatedLifeExpectancyMan;
            updatedAverageLifeExpectancy = lifeStats.updatedAverageLifeExpectancy;
            console.log("Recived data");
        }else{
            visible = true;
            color = "danger"
            errorMsg = "Error " + res.status + " : " + "Ningún recurso con los parametros " + params.province +" " + params.year;
            console.log("ERROR" + errorMsg);
        }
    }

    async function updateLife(){            
            console.log("Editing life stats data...");
            const res = await fetch(BASE_API_PATH + "/" + params.province + "/" + params.year, {
                    method:"PUT",
                    body : JSON.stringify({
                        country: updatedCountry,
                        province: params.province,
                        year: parseInt(params.year),
                        lifeExpectancyWoman: parseFloat(updatedLifeExpectancyWoman),
                        lifeExpectancyMan: parseFloat(updatedLifeExpectancyMan),
                        averageLifeExpectancy: parseFloat(updatedAverageLifeExpectancy)
                    }),
                    headers:{
                        "Content-Type": "application/json"
                    }
                }).then(function (res) {
                    visible = true;
                    if(res.status == 200){
                        getLife(); 
                        console.log("Data introduced");
                        color = "success";
                        errorMsg="Recurso actualizado correctamente";
                    }else{
                        console.log("Data not edited");
                        errorMsg= "Rellene todos los campos";
                    }
                });	
    }

</script>

<main>

    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if errorMsg}
		    {errorMsg}
	    {/if}
    </Alert>

    <h1>Recurso '{params.province} , {params.year} ' listo para editar</h1>
    <Table bordered>
        <thead>
            <tr>
                <th>País</th>
                <th>Comunidad Autónoma</th>
                <th>Año</th>
                <th>Esperanza en mujeres</th>
                <th>Esperanza en hombre</th>
                <th>Esperanza de vida media</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input bind:value="{updatedCountry}"></td>
                <td>{params.province}</td>
                <td>{params.year}</td>
                <td><input bind:value="{updatedLifeExpectancyWoman}"></td>
                <td><input bind:value="{updatedLifeExpectancyMan}"></td>
                <td><input bind:value="{updatedAverageLifeExpectancy}"></td>
                <td><Button outline color="primary" on:click={updateLife}>Actualizar</Button></td>
            </tr>
        </tbody>
    </Table>

    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>