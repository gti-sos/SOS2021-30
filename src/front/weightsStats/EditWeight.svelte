<script>
    import { onMount }from "svelte";
    import { pop }from "svelte-spa-router";
    import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";
    import { Alert } from 'sveltestrap';

    var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";

    let visible = false;
    let checkMSG = "";
    let color = "danger";
    export let params = {};
    let weightsStats = {};
    let uptadatedNormalWeight = null;
    let updatedOverweight = null;
    let updatedObesity = null;
    let errorMsg = "";

    onMount(getStat);

    async function getStat(){
        console.log("Fetching datas...");
        const res = await fetch(BASE_WEIGHTS_PATH + "/" + params.provinces + "/" + params.year);
        if(res.ok){
            console.log("Ok");
            const json = await res.json();
            uptadatedNormalWeight = weightsStats.normal_weight;
            updatedOverweight = weightsStats.overweight;
            updatedObesity = weightsStats.obesity;
            console.log("Recived data");
        }else{
            errorMsg = res.status + " " + res.statusText;
            console.log("ERROR" + errorMsg);
        }
    }

    async function updateWeight(){
        console.log("Updating contact..." + JSON.stringify(params.provinces));
        
        const res = await fetch(BASE_WEIGHTS_PATH + "/" + params.provinces + "/" + params.year, {
            method: "PUT",
            body : JSON.stringify({
                provinces: params.provinces,
                year: parseInt(params.year),
                normal_weight: parseFloat(uptadatedNormalWeight),
                overweight: parseFloat(updatedOverweight),
                obesity: parseFloat(updatedObesity)
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res){
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
            
        })
    }
</script>

<main>

    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if checkMSG}
		    {checkMSG}
	    {/if}
    </Alert>

    <h1>Recurso {params.provinces} {params.year} listo para editar</h1>
    <Table bordered>
        <thead>
            <tr>
                <th>Comunidad autónoma</th>
                <th>Año</th>
                <th>Peso normal</th>
                <th>Sobrepeso</th>
                <th>Obesidad</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{params.provinces}</td>
                <td>{params.year}</td>
                <td><input bind:value="{uptadatedNormalWeight}"></td>
                <td><input bind:value="{updatedOverweight}"></td>
                <td><input bind:value="{updatedObesity}"></td>
                <td><Button outline color="primary" on:click={updateWeight}>Actualizar</Button></td>
            </tr>
        </tbody>
    </Table>

    {#if errorMsg}
        <p style="color: red">ERROR: {errorMsg}</p>
    {/if}
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>