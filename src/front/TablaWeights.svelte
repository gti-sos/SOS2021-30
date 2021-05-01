<script>
	import { onMount } from "svelte";
	import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";
	import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';
	import { Form, FormGroup, FormText, Input, Label } from 'sveltestrap';
	import { Alert } from 'sveltestrap';
    import { UncontrolledCollapse, Collapse, CardBody, Card } from "sveltestrap";
	import { pop } from "svelte-spa-router";
    import { get } from "svelte/store";

    var BASE_WEIGHTS_PATH = "/api/v1/table-weights-stats";
    let weightsStats = [];
    let newWeight = {
        provinces: "",
        year: "",
        normal_weight: "",
        overweight: "",
        obesity:""
    }
    let isOpen = false;
    let busquedas = BASE_WEIGHTS_PATH;
    //ALERTAS
    let visible = false;
    let color = "danger";
    let page = 1;
    let totaldata = weightsStats.length;
    let errorMSG = "";
    let okayMSG = "";    
    onMount(getStats);

    //Función LOADINITIAL para generar datos iniciales
    async function loadInitialData() { 
        console.log("Fetching data...");
        await fetch(BASE_WEIGHTS_PATH + "/loadInitialData");
        const res = await fetch(BASE_WEIGHTS_PATH + "?limit=5&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightsStats = json;
            totaldata = weightsStats.length;
            console.log("Received " + weightsStats.length + " datas.");
            color = "success";
            errorMSG = "Datos cargados correctamente";
        } else {
            color = "danger";
            errorMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }

    //Función GET para mostrar todos los datos
    async function getStats(){
        console.log("Fetching stats...");
        const res= await fetch(BASE_WEIGHTS_PATH + "?limit=5&offset=0");
        if(res.ok){
            console.log("ok");
            const json= await res.json();
            weightsStats=json;
            console.log(`We have received ${weightsStats.length} alcohol stats`);
        }else{
            console.log("Error")
        }
    }

    //Función DELETE para eliminar todos los datos
    async function deleteALL() {
		console.log("Deleting weights data...");
		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")){
			console.log("Deleting all weights data...");
			const res = await fetch(BASE_WEIGHTS_PATH, {
				method: "DELETE"
			}).then( (res) => {
                visible = true;
                if(res.ok && totaldata > 0){
                    totaldata = 0;
                    getStats();
                   color = "succes"; 
                   errorMSG = "Datos eliminados correctamente";
                   console.log("OK all data have been deleted");
                }else if(totaldata == 0){
                    console.log("error");
                    color = "danger";
                    errorMSG = "No hay datos para borrar";
                }else{
                    console.log("error");
                    color = "danger";
                    errorMSG = "No se han podido elminar los datos";
                }
            })
		}
	}

    //Función DELETE para elminar dato específico
    async function deleteWeights(provinces, year) {
        const res = await fetch(BASE_WEIGHTS_PATH + "/" + provinces + "/" + year, {
            method: "DELETE"
        }).then( (res) => {
            visible = true;
            getStats();
            if(res.status == 200){
                totaldata--;
                color = "succes";
                errorMSG = "recurso eliminado"
                console.log("recurso eliminado");
            }else if(res.status == 404){
                color = "danger";
                errorMSG = "no se ha encontrado el recurso";
                console.log("error");
            }else{
                color = "danger";
                errorMSG = "error"
                console.log("error");
            }
        })
    }

    //Función POST para insertar un nuevo dato
    async function insertWeight(){
        console.log("Inserting weights data...");
         if (newWeight.year == "" || newWeight.year == null || newWeight.provinces == "") {
             alert("Los campos 'Provincia' y 'Año' no pueden estar vacios");
         } else{
             const res = await fetch(BASE_WEIGHTS_PATH,{
             method:"POST",
             body:JSON.stringify(newWeight),
             headers:{
                 "Content-Type": "application/json"
             }
             }).then( (res) => {
                visible = true;
                if(res.status == 201){
                    getStats();
                    totaldata++;
                    console.log("Data introduced");
                    color = "succes";
                    errorMSG= "Entrada correcta";
                }else if(res.status ==400){
                    console.log("ERROR");
                    color = "danger";
                    errorMSG = "Los datos no fueron introducidos";
                }else if(res.status == 409){
                    console.log("error");
                    color = "danger";
                    errorMSG = "Ya existe esa entrada";
                }
             });	
         }
    }

    //getNextPage
    async function getNextPage() { 
        console.log(totaldata);
        if (page+5 > totaldata) {
            page = 1
        } else {
            page+=5
        }        
        visible = true;
        console.log("Charging page... Listing since: "+page);
        const res = await fetch(BASE_WEIGHTS_PATH + "?limit=5&offset="+(-1+page));
        //condicional imprime msg
        color = "success";
        errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+4);

        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            errorMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightStats = json;
            console.log("Received " + weightStats.length + " resources.");
        } else {
            errorMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }

    //getPreviewPage
    async function getPreviewPage() {
        console.log(totaldata);
        if (page-5 > 1) {
            page-=5; 
        } else page = 1
        visible = true;
        console.log("Charging page... Listing since: "+page);
        const res = await fetch(BASE_WEIGHTS_PATH + "?limit=5&offset="+(-1+page));
        //condicional imprime msg
        color = "success";
        errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+4);

        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            errorMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightStats = json;
            console.log("Received "+weightStats.length+" resources.");
        } else {
            errorMSG= res.status+": "+res.statusText;
            console.log("ERROR!");
        }
    }

</script>

<main>
    <h1 style ="text-align: center;">Tabla sobre el IMC por comunidades</h1>

    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if errorMSG}
		    {errorMSG}
	    {/if}
    </Alert>

    <Table bordered responsive>
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
                <td><input type = "text" placeholder="Comunidad autónoma" bind:value="{newWeight.provinces}"></td>
                <td><input type = "number" placeholder="2075" bind:value="{newWeight.year}"></td>
                <td><input type = "number" placeholder="0000" bind:value="{newWeight.normal_weight}"></td>
                <td><input type = "number" placeholder="0000" bind:value="{newWeight.overweight}"></td>
                <td><input type = "number" placeholder="0000" bind:value="{newWeight.obesity}"></td>
                <td><Button on:click={insertWeight}>Insertar</Button></td>
            </tr>
            {#each weightsStats as weightsStat}
                <tr>
                    <td><a href="#/weights-stats/{weightsStat.provinces}">{weightsStat.provinces}</td>
                    <td>{weightsStat.year}</td>
                    <td>{weightsStat.normal_weight}</td>
                    <td>{weightsStat.overweight}</td>
                    <td>{weightsStat.obesity}</td>
                    <td><Button outline color="danger" on:click="{deleteWeights(weightsStat.provinces, weightsStat.year)}">Borrar</Button></td>
                </tr>
            {/each}
        </tbody>
    </Table>

    <Button color="success" on:click="{loadInitialData}">
        Cargar datos inciales
    </Button>

    <Button color="danger" on:click="{deleteALL}">
        Eliminar todos los datos
    </Button>

    <Button outline color="primary" on:click="{getNextPage}">
        Siguiente
    </Button>

    <Button outline color="primary" on:click="{getPreviewPage}">
        Atrás
    </Button>
</main>