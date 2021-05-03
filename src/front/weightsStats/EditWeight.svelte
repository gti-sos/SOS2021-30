<script>
    import { onMount }from "svelte";
    import { pop }from "svelte-spa-router";
    import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";

    var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
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
        }).then( (res) =>{
            getStat();
        })
    }
</script>

<main>
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