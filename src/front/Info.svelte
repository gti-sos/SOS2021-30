<script>
    import Button from "sveltestrap/src/Button.svelte";
    import Table from "sveltestrap/src/Table.svelte"; 
</script>

<main  style="text-align:center">
    <h1  style="text-align:center">Equipo</h1>
    <li type="circle"><a href="https://github.com/Alesanmar">Alejandro Sánchez Márquez (life-expectancy-stats)</a></li>
    <li type="circle"><a href="https://github.com/Juanpepitt">Juan Pedro Hurtado Masero (smokers-stats)</a></li>
    <li type="circle"><a href="https://github.com/jesruidom">Jesús Ruiz Domínguez (table-weights-stats)</a></li>
    <li type="circle"><a href="https://github.com/vic3214">Víctor Caballero Sánchez (alcohol-consumption-stats)</a></li>
    <br>
    <h1>Descripción del proyecto</h1>
    <p>La relación entre la calidad de vida inducida por los factores de consumo de alcohol y tabaco, 
        el índice de masa corporal y la esperanza de vida al nacer según la región de España en el año 2017, 
        ¿influye el imc o el consumo de alcohol y tabaco en la evolución de la esperanza de vida?
        ¿Influye la situación geográfica, edad, género en el consumo de alcohol y tabaco?</p>
    <br>
    <h1>Repositorio <a href="https://github.com/gti-sos/SOS2021-30"><Button color="info">gti-sos/SOS2021-30</Button></a></h1>
    <br>
    <br>
    <h1>URL  <a href="http://sos2021-30.herokuapp.com"><Button color="info">http://sos2021-30.herokuapp.com</Button></a></h1>
    <br>
    <br>
    <h1>APIS</h1>
   <Table bordered responsive>
        <thead>
          <tr>
            <th>Desarrollador</th>
            <th>API</th>
            <th>Enlaces</th>
        </thead>
        <tbody>
            <tr>
                <td>Alejandro Sánchez Márquez</td>
                <td>API life-expectancy-stats</td>
                <td><a href="https://sos2021-30.herokuapp.com/api/v1/life-expectancy-stats"><Button color="info">API v1</Button></a>
                    <a href="https://sos2021-30.herokuapp.com/api/v2/life-expectancy-stats"><Button color="info">API v2</Button></a></td>
            </tr>
            <tr>
                <td>Juan Pedro Hurtado Masero</td>
                <td>API smokers-Stats</td>
                <td><a href="https://sos2021-30.herokuapp.com/api/v1/smokers-stats"><Button color="info">API v1</Button></a>
                    <a href="https://sos2021-30.herokuapp.com/api/v2/smokers-stats"><Button color="info">API v2</Button></a></td>
            </tr>
            <tr>
                <td>Jesús Ruiz Domínguez</td>
                <td>API Weights-Stats</td>
                <td><a href="https://sos2021-30.herokuapp.com/api/v1/table-weights-stats"><Button color="info">API v1</Button></a>
                    <a href="https://sos2021-30.herokuapp.com/api/v2/table-weights-stats"><Button color="info">API v2</Button></a></td>
            </tr>
            <tr>
                <td>Víctor Caballero Sánchez</td>
                <td>API alcohol-consumption-stats</td>
                <td><a href="https://sos2021-30.herokuapp.com/api/v1/alcohol-consumption-stats"><Button color="info">API v1</Button></a>
                    <a href="https://sos2021-30.herokuapp.com/api/v2/alcohol-consumption-stats"><Button color="info">API v2</Button></a></td>
            </tr>
        </tbody>
    </Table>
    <br>
    <h1>DOCUMENTACIÓN POSTMAN DE LAS APIS</h1>
    <Table bordered responsive>
        <thead>
          <tr>
            <th>Desarrollador</th>
            <th>API</th>
            <th>Documentación</th>
        </thead>
        <tbody>
            <tr>
                <td>Alejandro Sánchez Márquez</td>
                <td>API life-expectancy-stats</td>
                <td><a href="https://documenter.getpostman.com/view/14968155/TzJsecsr"><Button color="info">Documentación v1</Button></a>
                    <a href="https://documenter.getpostman.com/view/14968155/TzRSgnE6"><Button color="info">Documentación v2</Button></a></td>
            </tr>
            <tr>
                <td>Juan Pedro Hurtado Masero</td>
                <td>API smokers-Stats</td>
                <td><a href="https://documenter.getpostman.com/view/14966429/TzJoFgHe"><Button color="info">Documentación v1</Button></a>
                    <a href="https://documenter.getpostman.com/view/14966429/TzRU9RjW"><Button color="info">Documentación v2</Button></a></td>
            </tr>
            <tr>
                <td>Jesús Ruiz Domínguez</td>
                <td>API Weights-Stats</td>
                <td><a href="https://documenter.getpostman.com/view/14975289/TzRLjpaY"><Button color="info">Documentación v1</Button></a>
                    <a href="https://documenter.getpostman.com/view/14975289/TzRLnWWU"><Button color="info">Documentación v2</Button></a></td>
            </tr>
            <tr>
                <td>Víctor Caballero Sánchez</td>
                <td>API alcohol-consumption-stats</td>
                <td><a href="https://documenter.getpostman.com/view/14942936/TzJsheDD"><Button color="info">Documentación v1</Button></a>
                    <a href="https://documenter.getpostman.com/view/14942936/TzRX85Lc"><Button color="info">Documentación v1</Button></a></td>

                
            </tr>
        </tbody>
    </Table>
    <br>
    <h1>ENLACES FRONT-END</h1>
    <Table bordered responsive>
        <thead>
          <tr>
            <th>Desarrollador</th>
            <th>Front-End</th>
            <th>Enlace</th>
        </thead>
        <tbody>
            <tr>
                <td>Alejandro Sánchez Márquez</td>
                <td>Front-End API life-expectancy-stats</td>
                <td><a href="http://sos2021-30.herokuapp.com/#/life-stats"><Button color="info">life-expectancy-stats</Button></a></td>
            </tr>
            <tr>
                <td>Juan Pedro Hurtado Masero</td>
                <td>Front-End API smokers-stats</td>
                <td><a href="http://sos2021-30.herokuapp.com/#/smokers-stats"><Button color="info">smokers-stats</Button></a></td>
            </tr>
            <tr>
                <td>Jesús Ruiz Domínguez</td>
                <td>Front-End API weight-stats</td>
                <td><a href="http://sos2021-30.herokuapp.com/#/weights-stats"><Button color="info">weight-stats</Button></a></td>
            </tr>
            <tr>
                <td>Víctor Caballero Sánchez</td>
                <td>Front-End API alcohol-consumption-stats</td>
                <td><a href="http://sos2021-30.herokuapp.com/#/alcohol-stats"><Button color="info">alcohol-consumption-stats</Button></a></td>
            </tr>
        </tbody>
    </Table>

</main>