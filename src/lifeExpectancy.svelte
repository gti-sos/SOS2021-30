<script>
    import{ 
        onMount

    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";

    let LifeExpectancyStats = [];

    async function getLifeExpectancy(){
        console.log("Fetching resources...");
        const res = await fetch("/api/v1/life-expectancy-stats/loadInitialData");

        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            LifeExpectancyStats = json;
            console.log(`We have received ${LifeExpectancyStats.lenght} resources`);
        }else{
            console.log("Error!");
        }
    }

    onMount(getLifeExpectancy);

    console.log("Before getLifeExpectancy");
    getLifeExpectancy();
    console.log("After getLifeExpectancy");





</script>

<main>
    <body>
 
        <h1>Tabla sobre esperanza de vida</h1>

        <Table bordered responsive> 
            <thead>
                <tr>
                    <td>Pais</td>
                    <td>Comunidad autonoma</td>
                    <td>Año</td>
                    <td>Esperanza de vida en mujeres</td>
                    <td>Esperanza de vida en hombre</td>
                    <td>Esperanza de vida media</td>
                </tr>
        </thead>
        <tbody>
        {#each LifeExpectancyStats as life}
            <tr>
                <td>{life.country}</td>
                <td>{life.province}</td>
                <td>{life.year}</td>
                <td>{life.lifeExpectancyWoman}</td>
                <td>{life.lifeExpectancyMan}</td>
                <td>{life.averageLifeExpectancy}</td>
        </tr>
                
            {/each}
        </tbody>
        </Table>
    </body>
</main>


<style>
    table{
        border: 1px solid black;
    }

</style>