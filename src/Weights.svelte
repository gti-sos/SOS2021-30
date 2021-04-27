<script>
    import { onMount } from "svelte";
    import Table from "sveltestrap/src/Table.svelte";
    let weights = [];
    
    async function getWeights(){
        console.log("fetching data");
        const res = await fetch("/api/v1/table-weights-stats/loadInitialData");
        if (res.ok) {
            console.log("Ok");
            const json = await res.json();
            weights = json;
            console.log("We have " + weights.length +" datas.");
        } else {
            console.log("Error");
        }
    }
    console.log("Before call");
    onMount(getWeights)
    console.log("After call");
</script>

<main>
    <body>
        
   
    
    <Table bordered responsive> 
        <thead>
            <tr>
                <td>ID</td>
                <td>Pais</td>
                <td>Comunidad autonoma</td>
                <td>Año</td>
                <td>Peso normal</td>
                <td>Sobrepeso</td>
                <td>Obesidad</td>
            </tr>
    </thead>
    <tbody>
    {#each weights as data}
        <tr>
            <td>{data.id}</td>
            <td>{data.country}</td>
            <td>{data.provinces}</td>
            <td>{data.year}</td>
            <td>{data.normal_weight}</td>
            <td>{data.overweight}</td>
            <td>{data.obesity}</td>
    </tr>
            
        {/each}
    </tbody>
    </Table>
</body>
</main>

<style>
    td{
        text-align: center;
    }
    thead{
        font-weight: bold;
    }
</style>