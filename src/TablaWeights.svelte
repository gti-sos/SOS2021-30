<script>

    import{
        onMount
    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    var BASE_WEIGHTS_PATH = "/api/v1/table-weights-stats";
    let weightsStats = [];

    async function loadInitialData() { 
        console.log("Fetching data...");
        await fetch(BASE_WEIGHTS_PATH + "/loadInitialData");
        const res = await fetch(BASE_WEIGHTS_PATH);

        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightsStats = json;
            console.log("Received " + weightsStats.length + " datas.");
            color = "success";
            errorMSG = "Datos cargados correctamente";
        } else {
            color = "danger";
            errorMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }

    async function getStats(){
        console.log("Fetching stats...");
        const res= await fetch(BASE_WEIGHTS_PATH);

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
    <Table bordered responsive>
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
    <Button color="success" on:click="{loadInitialData}">
        Cargar datos inciales
    </Button>
</main>