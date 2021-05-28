<script>
    import {
      Button,
      Card,
      CardBody,
      CardHeader,
      CardSubtitle,
      CardText,
      CardTitle,
    } from "sveltestrap";
    import { pop }from "svelte-spa-router";
  </script>
  
  <main>
  
    <div>
    <h1>integrations</h1>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Integrado con las estadísticas sobre consumo de alcohol</h2></CardTitle>
      </CardHeader>
      <CardBody>
        <CardSubtitle />
        <CardText />
        <a href="/#/integrations/anxiety-stats"
          ><Button color="primary">Estadísticas Ansiedad</Button></a>
        <a href="/#/integrations/poverty-risk-stats"
        ><Button color="primary">Estadísticas Riesgo de pobreza</Button></a>
        <a href="/#/integrations/covid-stats"
        ><Button color="primary">Estadísticas sobre coronavirus</Button></a>
      </CardBody>
    </Card>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Integrado con las estadísticas sobre consumo de tabaco en España</h2></CardTitle>
      </CardHeader>
      <CardBody>
        <CardSubtitle />
        <CardText />
        <a href="/#/integrations/rentals"
          ><Button color="primary">Estadísticas Alquileres por comunidades</Button></a>
        <a href="/#/integrations/hostelries"
        ><Button color="primary">Estadísticas Hostelries-Smoker</Button></a>
      </CardBody>
    </Card>
  </div>
  <Button outline color="secondary" on:click="{pop}">Atrás</Button>
  
  </main>
  
  <style>
     main {
      text-align: center;
      padding: 1em;
      max-width: 240px;
      margin: 0 auto;
    }
    h1 {
      color: #1488F4;
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
    }
    div{
      margin-bottom: 15px;
    }
    @media (min-width: 640px) {
      main {
        max-width: none;
      }
    }
  </style>