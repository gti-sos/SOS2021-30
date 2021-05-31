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
    <h1>About: vídeos</h1>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Vídeo sobre consumo de alcohol</h2></CardTitle>
      </CardHeader>
      <CardBody>
        
      </CardBody>
    </Card>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Vídeo sobre consumo de tabaco en España</h2></CardTitle>
      </CardHeader>
      <CardBody>
        
      </CardBody>
    </Card>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Vídeo con las estadísticas sobre IMC</h2></CardTitle>
      </CardHeader>
      <CardBody>

      </CardBody>
    </Card>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Vídeo con las estadísticas sobre la esperanza de vida</h2></CardTitle>
      </CardHeader>
      <CardBody>

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