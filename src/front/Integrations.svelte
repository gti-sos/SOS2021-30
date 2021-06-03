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
        <a href="/#/integrations/co2-stats"
        ><Button color="primary">Estadísticas sobre CO2</Button></a>
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
        <a href="/#/integrations/rentals"><Button color="primary">Estadísticas Rental-Smoker (G07)</Button></a>
        <a href="/#/integrations/hostelries"><Button color="primary">Estadísticas Hostelries-Smoker (G26)</Button></a>
        <a href="/#/integrations/canada"><Button color="primary">Estadísticas Vacaciones en Canadá (EXT)</Button></a>
        <a href="/#/integrations/bikewise"><Button color="primary">Estadísticas Accidentes en bicicleta en EEUU (EXT)</Button></a>
      </CardBody>
    </Card>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Integrado con las estadísticas sobre IMC</h2></CardTitle>
      </CardHeader>
      <CardBody>
        <CardSubtitle />
        <CardText />
        <a href="/#/integrations/culturaBASE"><Button color="primary">Estadísticas CulturaBASE-Weights (G26)</Button></a>
        <a href="/#/integrations/stress-stats"><Button color="primary">Estadísticas Stress-Stats-Weights (G11)</Button></a>
        <a href="/#/integrations/NBA-position"><Button color="primary">Posiciones NBA (Ext1)</Button></a>
        <a href="/#/integrations/covid-integration"><Button color="primary">Integración COVID (Ext2)</Button></a>
        <a href="/#/integrations/liga-futbol"><Button color="primary">Integración Liga de fútbol (Ext3)</Button></a>
      </CardBody>
    </Card>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Integrado con las estadísticas sobre la esperanza de vida</h2></CardTitle>
      </CardHeader>
      <CardBody>
        <CardSubtitle />
        <CardText />
        <a href="/#/integrations/unemployment"
          ><Button color="primary">Estadísticas Desempleo</Button></a>
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