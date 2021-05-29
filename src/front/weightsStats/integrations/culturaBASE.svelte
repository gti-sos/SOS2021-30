<script>
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";


    const BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    const culturaBASE_PATh = "https://sos2021-26.herokuapp.com/api/v2/culturaBASE";

    let weightStats = [];
    let weightProvinces = [];
    let weightNormalWeight = [];

    let culturaStats = [];
    let culturaProvinces = [];

    async function loadWeight(){
        console.log("Fetching data...");
        const res = await fetch(BASE_WEIGHTS_PATH);
        weightStats = await res.json();
        console.log("Recived weights data");
    }

    async function loadGraph(){
        await loadWeight();
        console.log(weightStats.length + " recived from loadWeight");

        weightStats.forEach( (data) => {
            weightProvinces.push(data.provinces);
            weightNormalWeight.push(data["normal_weight"]);
        })
    }
</script>

<main>
    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>
