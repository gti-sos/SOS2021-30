<script>
    import { onMount }from "svelte";
    import { pop }from "svelte-spa-router";
    import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";

    var BASE_WEIGHTS_PATH = "/api/v1/table-weights-stats";
    export let params = {};
    let weight = {};
    let updatedProvince = "XXXX";
    let uptadatedYear = 2075;
    let uptadatedNormalWeight = 1000;
    let updatedOverweight = 1000;
    let updatedObesity = 1000;
    let errorMsg = "";

    onMount(getStat);

    async function getStat(){
        console.log("Fetching datas...");
        const res = await fetch(BASE_WEIGHTS_PATH + params.provinces);
        if(res.ok){
            console.log("Ok");
            const json = await res.json();
            weight = json;
            updatedProvince = weight.provinces;
            uptadatedYear = weight.year;
            uptadatedNormalWeight = weight.normal_weight;
            updatedOverweight = weight.overweight;
            updatedObesity = weight.obesity;
            console.log("Recived data");
        }else{
            errorMsg = res.status + ": " + res.statusText;
            console.log("ERROR" + errorMsg);
        }
    }

    async function updateWeight(){
        console.log("Updating contact..." + JSON.stringify(params.provinces));
        
        const res = await fetch(BASE_WEIGHTS_PATH + params.provinces, {
            method: "PUT",
            body : JSON.stringify({
                provinces: params.provinces,
                year: uptadatedYear,
                normal_weight: uptadatedNormalWeight,
                overweight: updatedOverweight,
                obesity: updatedObesity
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res){
            getStat();
        })
    }
</script>

<main>
    <h1>Parámetro a editar</h1>
    <Table bordered>
        <thead>
            <tr>
                <th>Comunidad autónoma</th>
                <th>Año</th>
                <th>Peso normal</th>
                <th>Sobrepeso</th>
                <th>Obesidad</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{updatedProvince}</td>
                <td><input bind:value="{uptadatedYear}"></td>
                <td><input bind:value="{uptadatedNormalWeight}"></td>
                <td><input bind:value="{updatedOverweight}"></td>
                <td><input bind:value="{updatedObesity}"></td>
                <td><Button outline color="primary" on:click={updateWeight}></Button></td>
            </tr>
        </tbody>
    </Table>

    {#if errorMsg}
        <p style="color: red">ERROR: {errorMsg}</p>
    {/if}
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>