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
        <p><a href="https://github.com/vic3214">Víctor Caballero Sánchez</a></p>
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
        <p><a href="https://github.com/Juanpepitt">Juan Pedro Hurtado Masero</a></p>
        <a href="/#/integrations/rentals"><Button color="primary">Estadísticas Rental-Smoker (G07)</Button></a>
        <a href="/#/integrations/hostelries"><Button color="primary">Estadísticas Hostelries-Smoker (G26)</Button></a>
        <a href="/#/integrations/canada"><Button color="primary">Estadísticas Vacaciones en Canadá (EXT)</Button></a>
        <a href="/#/integrations/airlines"><Button color="primary">Estadísticas Aerolíneas mundiales (EXT)</Button></a>
        <a href="/#/integrations/games"><Button color="primary">Estadísticas Juegos lanzados en web (EXT)</Button></a>
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
        <p><a href="https://github.com/jesruidom">Jesús Ruiz Domínguez</a></p>
        <a href="/#/integrations/culturaBASE"><Button color="primary">Estadísticas CulturaBASE-Weights (G26)</Button></a>
        <a href="/#/integrations/stress-stats"><Button color="primary">Estadísticas Stress-Stats-Weights (G11)</Button></a>
        <a href="/#/integrations/NBA-position"><Button color="primary">Posiciones NBA (Ext1)</Button></a>
        <a href="/#/integrations/steam-games"><Button color="primary">Integración juegos Steam (Ext2)</Button></a>
        <a href="/#/integrations/liga-futbol"><Button color="primary">Integración Liga de fútbol (Ext3)</Button></a>
        <a href="/#/integrations/juegos-gratis"><Button color="primary">Integración juegos gratis (Ext4)</Button></a>
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
        <p><a href="https://github.com/Alesanmar">Alejandro Sánchez Márquez</a></p>
        <a href="/#/integrations/unemployment"><Button color="primary">Estadísticas Desempleo (G7)</Button></a>
        <a href="/#/integrations/druguse"><Button color="primary">Estadísticas Uso de Drogas (G23) </Button></a>
        <a href="/#/integrations/hearthstone"><Button color="primary">Estadísticas HearthStone (Ext) </Button></a>
        <a href="/#/integrations/covideu"><Button color="primary">Estadísticas Covid Europa (Ext2) </Button></a>
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