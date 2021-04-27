<script>

    import{
        onMount
    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";

    let weightsStats = [];

    async function getStats(){
        console.log("Fetching stats...");
        const res= await fetch("/api/v1/table-weights-stats/loadInitialData");

        if(res.ok){
            console.log("ok");
            const json= await res.json();
            weightsStats=json;
            console.log(`We have received ${weightsStats.length} alcohol stats`);
        }else{
            console.log("Error")
        }
    }

    onMount(getStats);

</script>

<main>
    <h1>Tabla sobre el IMC por comunidades</h1>

    <Table>
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
            {#each weightsStats as weightsStat}
                <tr>
                    <td>{weightsStat.provinces}</td>
                    <td>{weightsStat.year}</td>
                    <td>{weightsStat.normal_weight}</td>
                    <td>{weightsStat.overweight}</td>
                    <td>{weightsStat.obesity}</td>
                </tr>
            {/each}
        </tbody>
    </Table>
</main>