<script>
    import{ 
        onMount

    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
	import { Alert } from 'sveltestrap';

    let LifeExpectancyStats = [];
    let newLife = {
        country:"",
        province:"",
        year:"",
        lifeExpectancyWoman:"",
        lifeExpectancyMan: "",
        averageLifeExpectancy:""
	}
    let checkMSG = "";
    let visible = false;
    let color = "danger";
    let page = 1;
    let totaldata=3; // Número total de los datos

    onMount(getLife);


    //Get initialData

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


    
    //Get
        async function getLife() {
            console.log("Fetching resources...");
            const res = await fetch("/api/v1/life-expectancy-stats?limit=5&offset=0");
            if (res.ok) {
                console.log("Ok:");
                const json = await res.json();
                LifeExpectancyStats = json;
                console.log("Received " + LifeExpectancyStats.length + " Life Data.");
            } else {
                checkMSG= res.status + ": " + res.statusText;
                console.log("ERROR!");
            }
        }




    //Insert

    async function insertLife(){
		 
         console.log("Inserting resources...");
         if (newLife.country == "" || newLife.province == "" || newLife.year == null) {
             alert("Los campos 'País' 'Comunidad Autonoma'y 'Año' no pueden estar vacios");
         } else{
             const res = await fetch("/api/v1/life-expectancy-stats",{
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


    //EDIT

    async function editLife(province, year){

            //Comprobamos que el año y la fecha no estén vacíos, el string vacio no es null
                if (newLife.province == "" || newLife.year == null) {
                alert("Los campos 'Comunidad Autonoma'y 'Año' no pueden estar vacios");
                }else if (province != newLife.province || year != newLife.year){
                alert("Los campos 'Comunidad Autónoma' y 'Año' no pueden ser distintos");
                }else{
                
                console.log("Editing resources...");
                const res = await fetch("/api/v1/life-expectancy-stats/" + province + "/" + year, {
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


     

     //Delete

     async function deleteLife(province, year) {
        const res = await fetch("/api/v1/life-expectancy-stats/" + province + "/" + year, {
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
                console.log("SUICIDE NOT FOUND");            
            } else {
                color = "danger";
                checkMSG= res.status + ": " + res.statusText;
                console.log("ERROR!");
            }      
        });
    }

        //DELETE ALL
        async function deleteALL() {
		console.log("Deleting life stats data...");
		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")){
			console.log("Deleting all life stats data...");
			const res = await fetch("/api/v1/life-expectancy-stats/", {
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
            const res = await fetch("/api/v1/life-expectancy-stats?limit=5&offset="+(-1+page));
            //condicional imprime msg
            color = "success";
            checkMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+4);

            if (totaldata == 0){
                console.log("ERROR Data was not erased");
                color = "danger";
                checkMSG= "¡No hay datos!";
            }else if (res.ok) {
                console.log("Ok:");
                const json = await res.json();
                SmokerStats = json;
                console.log("Received " + LifeExpectancyStats.length + " resources.");
            } else {
                checkMSG= res.status + ": " + res.statusText;
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
                const res = await fetch("/api/v1/life-expectancy-stats?limit=5&offset="+(-1+page));
                color = "success";
                errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+4);

                if (totaldata == 0){
                    console.log("ERROR Data was not erased");
                    color = "danger";
                    errorMSG= "¡No hay datos!";
                }else if (res.ok) {
                    console.log("Ok:");
                    const json = await res.json();
                    SmokerStats = json;
                    console.log("Received "+LifeExpectancyStats.length+" resources.");
                } else {
                    errorMSG= res.status+": "+res.statusText;
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
                    <th>Esperanza de vida en mujeres</th>
                    <th>Esperanza de vida en hombre</th>
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
                <td><a href="api/v1/life-expectancy-stats/{life.province}/{life.year}">{life.province}</a></td>
                <td>{life.year}</td>
                <td>{life.lifeExpectancyWoman}</td>
                <td>{life.lifeExpectancyMan}</td>
                <td>{life.averageLifeExpectancy}</td>
                <td><Button outline color="danger" on:click="{deleteLife(life.province, life.year)}">Borrar</Button></td>
                <td><Button outline color="primary" on:click="{editLife(life.province, life.year)}">Editar</Button></td>
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