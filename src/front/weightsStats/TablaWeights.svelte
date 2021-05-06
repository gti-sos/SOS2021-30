<script>
	import { onMount } from "svelte";
	import Table from "sveltestrap/src/Table.svelte"; 
	import Button from "sveltestrap/src/Button.svelte";
    import Input from "sveltestrap/src/Input.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";
	import { Alert } from 'sveltestrap';
import { } from "node:os";
    
	
    let visible = false;
    let color = "danger";
    let page = 1;
    let totaldata=9;
    let weightStats = [];
    let newWeight = {
        provinces: "",
        year: "",
        normal_weight: "",
        overweight: "",
        obesity:""
    }
    let s_provinces= [];
    let current_province = "-";
    let current_year = "";
	let checkMSG = "";
    var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    
    onMount(getStats);
 
    //Función GET para listar los recursos
    async function getStats() { 
        console.log("Fetching Data...");
        const res = await fetch(BASE_WEIGHTS_PATH + "?limit=10&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightStats = json;

            s_provinces = json.map((d) =>{
                return d.provinces;
            });
            s_provinces = Array.from(new Set(s_provinces));
            console.log("Received " + weightStats.length + " weight Data.");
        } else {
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }
 
    //Función LOADINITIALDATA para cargar los datos iniciales
    async function loadInitialData() { 
        console.log("Fetching data...");
        await fetch(BASE_WEIGHTS_PATH + "/loadInitialData");
        const res = await fetch(BASE_WEIGHTS_PATH + "?limit=10&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightStats = json;
            totaldata=13;
            console.log("Received " + weightStats.length + " weight data.");
            color = "success";
            checkMSG = "Datos cargados correctamente";
        } else {
            color = "danger";
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }
    
    //Función POST para añadir nuevos recursos  
    async function insertWeight(){		 
        console.log("Inserting data...");
        if (newWeight.year == "" || newWeight.year == null || newWeight.provinces == "") {
            alert("Los campos 'Comunidad Autónoma' y 'Año' no pueden estar vacios");
        } else{
            const res = await fetch(BASE_WEIGHTS_PATH,{
                method:"POST",
                body:JSON.stringify(newWeight),
                headers:{
                    "Content-Type": "application/json"
                }
            }).then(function (res) {
                visible=true;
                if (res.status == 201){
                    getStats();
                    totaldata++;
                    console.log("Data introduced");
                    color = "success";
                    checkMSG="Entrada introducida correctamente a la base de datos";
                }else if(res.status == 400){
                    console.log("ERROR Data was not correctly introduced");
                    color = "danger";
                    checkMSG= "Los datos de la entrada no fueron introducidos correctamente";
                }else if(res.status == 409){
                    console.log("ERROR There is already a data with that province and year in the da tabase");
                    color = "danger";
                    checkMSG= "Ya existe una entrada en la base de datos con la provincia y el año introducido";
                }
            });	
        }
    }    
    
    //Función DELETE para eliminar un recurso específico
    async function deleteWeights(province, year) {
        const res = await fetch(BASE_WEIGHTS_PATH + "/" + province + "/" + year, {
            method: "DELETE"
        }).then(function (res) {
            visible = true;
            getStats();      
            if (res.status==200) {
                totaldata--;
                color = "success";
                checkMSG = "Recurso "+province+" "+year+ " borrado correctamente";
                console.log("Deleted " + province);            
            } else if (res.status==404) {
                color = "danger";
                checkMSG = "No se ha encontrado el objeto " + province;
                console.log("SUICIDE NOT FOUND");            
            } else {
                color = "danger";
                checkMSG= res.status + ": " + res.statusText;
                console.log("ERROR!");
            }      
        });
    }

    //Función DELETE para eliminar todos los recursos
    async function deleteALL() {
		console.log("Deleting all weights data...");
		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")){
			console.log("Deleting all weights data...");
			const res = await fetch(BASE_WEIGHTS_PATH, {
				method: "DELETE"
			}).then(function (res) {
                visible=true;
				if (res.ok && totaldata>0){
                    totaldata = 0;
					getStats();
                    color = "success";
					checkMSG="Datos eliminados correctamente";
					console.log("OK All data erased");
				} else if (totaldata == 0){
                    console.log("ERROR Data was not erased");
                    color = "danger";
					checkMSG= "¡No hay datos para borrar!";
                } else{
					console.log("ERROR Data was not erased");
                    color = "danger";
					checkMSG= "No se han podido eliminar los datos";
				}
			});
		}
	} 

    //Función de busqueda por comunidades
    async function searchProvinces(provinces){
        console.log("Buscando por comunidad autonoma...");
		const res = await fetch(BASE_WEIGHTS_PATH + "?provinces=" + provinces)		
		if (res.ok){
            const json = await res.json();
            weightStats = json;
			
			weightStats.map((d)=>{
			return d.provinces;
			});
            color = "success";
			checkMSG="Busqueda de la comunidad encontrada";
			console.log("Data found");
		}else {
			alert("No existe");
			console.log("ERROR!");
		}
	}   

    //Función de busqueda por año
    async function searchYear(year){
        console.log("Buscando por año autonoma...");
		const res = await fetch(BASE_WEIGHTS_PATH + "?year=" + year)		
		if (res.ok){
            const json = await res.json();
            weightStats = json;
			
			weightStats.map((d)=>{
			return d.year;
			});
            color = "success";
			checkMSG="Busqueda de la comunidad encontrada";
			console.log("Data found")
		}else {
			checkMSG="No existe";
			console.log("ERROR!");
		}
	} 

    ////Función de paginación que consigue la página posterior
    async function getNextPage() { 
        console.log(totaldata);
        if (page+5 > totaldata) {
            page = 1
        } else {
            page+=5
        }
        
        visible = true;
        console.log("Charging page... Listing since: "+page);
        const res = await fetch(BASE_WEIGHTS_PATH + "?limit=10&offset="+(-1+page));
        color = "success";
        checkMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+4);

        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
			checkMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightStats = json;
            console.log("Received " + weightStats.length + " resources.");
        } else {
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }

    //Función de paginación que consigue la página anterior
    async function getPreviewPage() {

        console.log(totaldata);
        if (page-5 > 1) {
            page-=5; 
        } else page = 1

        visible = true;
        console.log("Charging page... Listing since: "+page);
        const res = await fetch(BASE_WEIGHTS_PATH + "?limit=10&offset="+(-1+page));
        color = "success";
        checkMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+4);

        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
			checkMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            weightStats = json;
            console.log("Received "+weightStats.length+" resources.");
        } else {
            checkMSG= res.status+": "+res.statusText;
            console.log("ERROR!");
        }
    }
    
</script>

<main>
    <h1 style ="text-align: center;">Tabla sobre el IMC por comunidades</h1>

    {#await weightStats}
        Loading smokers data...
    {:then weightStats}

    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if checkMSG}
		    {checkMSG}
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
                <td><Button outline color="success" on:click={insertWeight}>Insertar</Button></td>
            </tr>
            {#each weightStats as weightsStat}
                <tr>
                    <td><a href="#/weights-stats/{weightsStat.provinces}/{weightsStat.year}">{weightsStat.provinces}</td>
                    <td>{weightsStat.year}</td>
                    <td>{weightsStat.normal_weight}</td>
                    <td>{weightsStat.overweight}</td>
                    <td>{weightsStat.obesity}</td>
                    <td>
                        <Button outline color="primary" on:click="{deleteWeights(weightsStat.provinces, weightsStat.year)}">Editar</Button>
                        <Button outline color="danger" on:click="{deleteWeights(weightsStat.provinces, weightsStat.year)}">Borrar</Button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </Table>

    <Table>
        <th>Búsqueda por comunidad autónoma</th>
        <th>Búsqueda por año</th>
        <tr>
            <td>
                <FormGroup>
                        <Input type="select" name="selectProvince" id="selectProvince" bind:value="{current_province}">
                            {#each s_provinces as comunidad}
                                <option>{comunidad}</option>
                            {/each}
                                <option>-</option>
                        </Input>
                </FormGroup>
                <Button outline color="secondary" on:click="{searchProvinces(current_province)}">Buscar</Button>
            </td>
            <td><input type = "number" placeholder="2075" bind:value="{current_year}">
                <Button outline color="secondary" on:click="{searchYear(current_year)}">Buscar</Button>
            </td>

        </tr>
    </Table>

    <p align="center">   
        <Button outline color="primary" on:click="{getPreviewPage}">Atrás</Button>
        <Button outline color="primary" on:click="{getNextPage}">Siguiente</Button>
    </p>

    <Button color="success" on:click="{loadInitialData}">
        Cargar datos inciales
    </Button>

    <Button color="danger" on:click="{deleteALL}">
        Eliminar todos los datos
    </Button>

    {/await}
 
</main>