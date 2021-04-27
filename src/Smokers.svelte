<script>
    import{ 
        onMount
    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";

    let SmokerStats = [];

    async function getSmokers(){
        console.log("Fetching resources...");
        const res = await fetch("/api/v1/smokers-stats/loadInitialData");

        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            SmokersStats = json;
            console.log(`We have received ${SmokerStats.lenght} resources`);
        }else{
            console.log("Error!");
        }
    }

    onMount(getSmokers);

</script>

<main>
    <body>
 
        <h1>Tabla sobre fumadores</h1>

        <Table bordered responsive> 
            <thead>
                <tr>
                    <td>Pais</td>
                    <td>Comunidad autonoma</td>
                    <td>Año</td>
                    <td>Fumadores diarios</td>
                    <td>Fumadores ocasionales</td>
                    <td>Ex-Fumadores</td>
                    <td>No Fumadores</td>
                </tr>
        </thead>
        <tbody>
        {#each SmokerStats as smokers}
            <tr>
                <td>{smokers.country}</td>
                <td>{smokers.province}</td>
                <td>{smokers.year}</td>
                <td>{smokers.dailySmoker}</td>
                <td>{smokers.ocasionalSmoker}</td>
                <td>{smokers.exSmoker}</td>
                <td>{smokers.nonSmoker}</td>
        </tr>
                
            {/each}
        </tbody>
        </Table>
    </body>
</main>


<style>

</style>