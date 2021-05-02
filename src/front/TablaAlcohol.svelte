<script>

    import{
        onMount
    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";

    let alcoholStats = [];

    async function getStats(){
        console.log("Fetching stats...");
        const res= await fetch("/api/v1/alcohol-consumption-stats/loadInitialData");

        if(res.ok){
            console.log("ok");
            const json= await res.json();
            alcoholStats=json;
            console.log(`We have received ${alcoholStats.length} alcohol stats`);
        }else{
            console.log("Error")
        }
    }

    onMount(getStats);

</script>

<main>
    <h1>Tabla sobre consumo de alcohol</h1>

    <Table>
        <thead>
          <tr>
            <th>País</th>
            <th>Año</th>
            <th>Rango de edad</th>
            <th>Muertes prematuras a causa del alcohol</th>
            <th>Prevalencia de trastornos por consumo de alcohol</th>
          </tr>
        </thead>
        <tbody>
            {#each alcoholStats as alcoholStat}
                <tr>
                    <td>{alcoholStat.country}</td>
                    <td>{alcoholStat.year}</td>
                    <td>{alcoholStat.ageRange}</td>
                    <td>{alcoholStat.alcoholPrematureDeath}</td>
                    <td>{alcoholStat.prevalenceOfAlcoholUseDisorder}</td>
                </tr>
            {/each}
        </tbody>
    </Table>
</main>