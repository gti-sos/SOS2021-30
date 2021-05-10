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
            totaldata=19;
            console.log("Received " + LifeExpectancyStats.length + " life data.");
            color = "success";
            checkMSG = "Datos cargados correctamente";
        } else {
            color = "danger";
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
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
                 body:JSON.stringify(newLife),
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


    //EDIT (B)

  /*  async function editLife(province, year){

                if (newLife.country == "" || newLife.province == "" || newLife.year == null ||
          newLife.lifeExpectancyWoman == null || newLife.lifeExpectancyMan == null || newLife.averageLifeExpectancy == null) {
                alert("Los campos no pueden estar vacios");
                }else if (province != newLife.province || year != newLife.year){
                alert("Los campos 'Comunidad Autónoma' y 'Año' no pueden ser distintos al recurso a actualizar");
                }else{
                
                console.log("Editing resources...");
                const res = await fetch(BASE_API_PATH + "/" + province + "/" + year, {
                        method:"PUT",
                        body:JSON.stringify(newLife),
                        headers:{
                            "Content-Type": "application/json"
                        }
                    }).then(function (res) {
                        visible=true;
                        if (res.status == 200){
                            console.log("Data updated");
                            getLife();
                            color = "success";
                            checkMSG ="Entrada modificada correctamente en la base de datos";
                        }else if(res.status == 400){
                            console.log("ERROR Data was not correctly introduced");
                            color = "danger";
                            checkMSG= "Los datos de la entrada no fueron introducidos correctamente";
                        }else if(res.status == 409){
                            console.log("ERROR There is already a data with that province and year in the da tabase");
                            color = "danger";
                            checkMSG= "Ya existe una entrada en la base de datos con los datos introducidos";
                        }
                    });	
                }
            }

            */
     

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
                checkMSG= res.status + ": " + res.statusText;
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
					errorMSG= "¡No hay datos para borrar!";
                } else{
					console.log("ERROR Data was not erased");
                    color = "danger";
					errorMSG= "No se han podido eliminar los datos";
				}
			});
		}
	}


        //SEARCH 
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

        <Table bordered responsive> 
            <thead>
                <tr>
                    <th>Pais</th>
                    <th>Comunidad autonoma</th>
                    <th>Año</th>
                    <th>Esperanza en mujeres</th>
                    <th>Esperanza en hombre</th>
                    <th>Esperanza de vida media</th>
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
        </Table>
        <Button color="success" on:click="{getLifeExpectancy}">
            Cargar datos inciales
        </Button>
        <Button color="danger" on:click="{deleteALL}">
            Eliminar todo
        </Button>
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