<script>
    import{ 
        onMount

    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
	import { Alert } from 'sveltestrap';

    var BASE_API_PATH = "/api/v2/life-expectancy-stats";

    let LifeExpectancyStats = [];
    let newLife = {
        country:"",
        province:"",
        year:null,
        lifeExpectancyWoman:null,
        lifeExpectancyMan: null,
        averageLifeExpectancy:null
	}
    let checkMSG = "";
    let visible = false;
    let color = "danger";
    let page = 1;
    let totaldata=19; // Número total de los datos

    let sCountry = "";
    let sProvince = "";
    let sYear = "";
    let sLifeExpectancyWoman = "";
    let sLifeExpectancyMan = "";
    let sAverageLifeExpectancy = "";

    onMount(getLife);


    //Get initialData (B)

    async function getLifeExpectancy() {
 
        console.log("Fetching life data...");
        await fetch(BASE_API_PATH + "/loadInitialData");
        const res = await fetch(BASE_API_PATH + "?limit=10&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            LifeExpectancyStats = json;
            visible = true;
            totaldata=19;
            console.log("Received " + LifeExpectancyStats.length + " life data.");
            color = "success";
            checkMSG = "Datos cargados correctamente";
        } else {
            color = "danger";
            checkMSG= res.status + ": " + "No se pudo cargar los datos";
            console.log("ERROR! ");
        }
    }


    
    //Get (B)
        async function getLife() {
            console.log("Fetching resources...");
            const res = await fetch(BASE_API_PATH);
            if (res.ok) {
                console.log("Ok:");
                const json = await res.json();
                LifeExpectancyStats = json;
                console.log("Received " + LifeExpectancyStats.length + " Life Data.");
            } else {
                checkMSG= res.status + ": Recursos no encontrados ";
                console.log("ERROR! no encontrado");
            }
        }


    //Insert (B)

    async function insertLife(){
		 
         console.log("Inserting resources...");
         if (newLife.country == "" || newLife.province == "" || newLife.year == null ||
          newLife.lifeExpectancyWoman == null || newLife.lifeExpectancyMan == null || newLife.averageLifeExpectancy == null) {
             alert("Los campos no pueden estar vacios");
         } else{
             const res = await fetch(BASE_API_PATH,{
                 method:"POST",
                 body:JSON.stringify({
                        country: newLife.country,
                        province: newLife.province,
                        year: parseInt(newLife.year),
                        lifeExpectancyWoman: parseFloat(newLife.lifeExpectancyWoman),
                        lifeExpectancyMan: parseFloat(newLife.lifeExpectancyMan),
                        averageLifeExpectancy: parseFloat(newLife.averageLifeExpectancy)
                    }),
                 headers:{
                     "Content-Type": "application/json"
                 }
             }).then(function (res) {
                 visible=true;
                 if (res.status == 201){
                     getLife();
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

     

    //Delete (B)

     async function deleteLife(province, year) {
        const res = await fetch(BASE_API_PATH+ "/" + province + "/" + year, {
            method: "DELETE"
        }).then(function (res) {
            visible = true;
            getLife();      
            if (res.status==200) {
                totaldata--;
                color = "success";
                checkMSG = "Recurso "+province+" "+year+ " borrado correctamente";
                console.log("Deleted " + province);            
            } else if (res.status==404) {
                color = "danger";
                checkMSG = "No se ha encontrado el objeto " + province;
                console.log("Resource NOT FOUND");            
            } else {
                color = "danger";
                checkMSG= res.status + ": " + "No se pudo borrar el recurso";
                console.log("ERROR!");
            }      
        });
    }

    //DELETE ALL

        async function deleteALL() {
		console.log("Deleting life data...");
		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")){
			console.log("Deleting all life data...");
			const res = await fetch(BASE_API_PATH, {
				method: "DELETE"
			}).then(function (res) {
                visible=true;
				if (res.ok && totaldata>0){
                    totaldata = 0;
					getLife();
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


    
    //SEARCH 

        async function search (sCountry, sProvince, sYear, sLifeExpectancyWoman, sLifeExpectancyMan, sAverageLifeExpectancy){
            
        if(sCountry==null){
            sCountry="";
        }
        if(sProvince==null){
            sProvince="";
        }
        if(sYear==null){
            sYear="";
        }
        if(sLifeExpectancyWoman==null){
            sLifeExpectancyWoman="";
        }
        if(sLifeExpectancyMan==null){
            sLifeExpectancyMan="";
        }
        if(sAverageLifeExpectancy==null){
            sAverageLifeExpectancy="";
        }
        visible = true;
		const res = await fetch(BASE_API_PATH + "?country="+sCountry+"&province="+sProvince+"&year="+sYear+"&lifeExpectancyWoman="+sLifeExpectancyWoman+"&lifeExpectancyMan="+sLifeExpectancyMan+"&averageLifeExpectancy="+sAverageLifeExpectancy)
		if (res.ok){
			const json = await res.json();
			LifeExpectancyStats = json;
			console.log("Found "+ LifeExpectancyStats.length + " data");
			if(LifeExpectancyStats.length==1){
                color = "success"
				checkMSG = "Se ha encontrado un dato para tu búsqueda";
			}else{
                color = "success"
				checkMSG = "Se han encontrado " + LifeExpectancyStats.length + " datos para tu búsqueda";
			}
	    }
    }



    //getNextPage (B)

        async function getNextPage() {
    
                console.log(totaldata);
                if (page+10 > totaldata) {
                    page = 1
                } else {
                    page+=10
                }
                
                visible = true;
                console.log("Charging page... Listing since: "+page);
                const res = await fetch(BASE_API_PATH + "?limit=10&offset="+(-1+page));
                //condicional imprime msg
                color = "success";
                checkMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);

                if (totaldata == 0){
                    console.log("ERROR Data was not erased");
                    color = "danger";
                    checkMSG= "¡No hay datos!";
                }else if (res.ok) {
                    console.log("Ok:");
                    const json = await res.json();
                    LifeExpectancyStats = json;
                    console.log("Received " + LifeExpectancyStats.length + " resources.");
                } else {
                    checkMSG= res.status + ": " + res.statusText;
                    console.log("ERROR!");
                }
            }

    //getPreviewPage (B)

        async function getPreviewPage() {

            console.log(totaldata);
            if (page-10 > 1) {
                page-=10; 
            } else page = 1

            visible = true;
            console.log("Charging page... Listing since: "+page);
            const res = await fetch(BASE_API_PATH + "?limit=10&offset="+(-1+page));
            color = "success";
            checkMSG = (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);

            if (totaldata == 0){
                console.log("ERROR Data was not erased");
                color = "danger";
                checkMSG = "¡No hay datos!";
            }else if (res.ok) {
                console.log("Ok:");
                const json = await res.json();
                LifeExpectancyStats = json;
                console.log("Received "+LifeExpectancyStats.length+" resources.");
            } else {
                checkMSG = res.status+": "+res.statusText;
                console.log("ERROR!");
            }
        }








</script>

<main>

        <h1 style ="text-align: center;">Tabla de datos de Esperanza de vida</h1>

        {#await LifeExpectancyStats}
            Loading life stats data...
        {:then LifeExpectancyStats}
        
        <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
            {#if checkMSG}
                {checkMSG}
            {/if}
        </Alert>
        <br>
        <h4 style="text-align:center"><strong>Búsqueda general de parámetros</strong></h4>

        <Table>

            <th>Búsqueda por país</th>
            <th>Búsqueda por provincia</th>
            <th>Búsqueda por año</th>
            <th>Búsqueda por esperanza en mujeres</th>
            <th>Búsqueda por esperanza en hombres</th>
            <th>Búsqueda por esperanza de vida media</th>
            <tr>
                <td><input type = "text" placeholder="País" bind:value="{sCountry}"></td>
                <td><input type = "text" placeholder="Provincia" bind:value="{sProvince}"></td>
                <td><input type = "number" placeholder="2017" bind:value="{sYear}"></td>
                <td><input type = "number" placeholder="0.0" bind:value="{sLifeExpectancyWoman}"></td>
                <td><input type = "number" placeholder="0.0" bind:value="{sLifeExpectancyMan}"></td>
                <td><input type = "number" placeholder="0.0" bind:value="{sAverageLifeExpectancy}"></td>
            </tr>
        </Table>
        <div style="text-align:center">
            <Button outline color="primary" on:click="{search (sCountry, sProvince, sYear, sLifeExpectancyWoman, sLifeExpectancyMan, sAverageLifeExpectancy)}">Buscar</Button>
        </div>
        <br>

        <Table bordered responsive> 
            <thead>
                <tr>
                    <th>Pais</th>
                    <th>Comunidad autonoma</th>
                    <th>Año</th>
                    <th>Esperanza en mujeres</th>
                    <th>Esperanza en hombre</th>
                    <th>Esperanza media</th>
                    <th colspan="2">Acciones</th>
                </tr>
        </thead>
        <tbody>
            <tr>
                <td><input type = "text" placeholder="España" bind:value="{newLife.country}"></td>
                <td><input type = "text" placeholder="Cataluña" bind:value="{newLife.province}"></td> 
                <td><input type = "text" placeholder="2017" bind:value="{newLife.year}"></td> 
                <td><input type = "number" placeholder="80" bind:value="{newLife.lifeExpectancyWoman}"></td>    
                <td><input type = "number" placeholder="81.4" bind:value="{newLife.lifeExpectancyMan}"></td>  
                <td><input type = "number" placeholder="80.8" bind:value="{newLife.averageLifeExpectancy}"></td>  
                <td colspan="2" style="text-align: center;"><Button outline color="primary" on:click={insertLife}>Insertar</Button></td>  
            </tr>

        {#each LifeExpectancyStats as life}
            <tr>
                
                <td>{life.country}</td>
                <td><a href="api/v2/life-expectancy-stats/{life.province}/{life.year}">{life.province}</a></td>
                <td>{life.year}</td>
                <td>{life.lifeExpectancyWoman}</td>
                <td>{life.lifeExpectancyMan}</td>
                <td>{life.averageLifeExpectancy}</td>
                <td><Button outline color="danger" on:click="{deleteLife(life.province, life.year)}">Borrar</Button></td>
                <td><a href="#/life-stats/{life.province}/{life.year}"><Button outline color="primary">Editar</Button></a></td>
            </tr>
                
        {/each}
        </tbody>
        <br>
        </Table>
        <Button color="success" on:click="{getLifeExpectancy}">
            Cargar datos inciales
        </Button>
        <Button color="danger" on:click="{deleteALL}">
            Eliminar todo
        </Button>
        <a href="#/life-graph"><Button outline color="primary">Ver gráfico</Button></a>
        <a href="#/life-graph2"><Button outline color="primary">Ver gráfico de barras (D03)</Button></a>
        <a href="#/life-graph3"><Button outline color="primary">Ver gráfico Chart.js (D03)</Button></a>
        <Button outline color="primary" on:click="{getPreviewPage}">
           Atrás
        </Button>
        <Button outline color="primary" on:click="{getNextPage}">
            Siguiente
         </Button>

    {/await}
</main>


<style>

</style>