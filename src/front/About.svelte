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
        <li type="circle"><a href="https://www.youtube.com/watch?v=lfujfXZZSqA">Enlace al vídeo de la API sobre consumo de alcohol (Víctor Caballero Sánchez)</a></li>
      </CardBody>
    </Card>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Vídeo sobre consumo de tabaco en España</h2></CardTitle>
      </CardHeader>
      <CardBody>
        <li type="circle"><a href="https://mixdrop.sx/f/knxdpdz9sdk7g6">Enlace al vídeo de la API sobre consumo de tabaco (Juan Pedro Hurtado Masero)</a></li>
      </CardBody>
    </Card>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Vídeo con las estadísticas sobre IMC</h2></CardTitle>
      </CardHeader>
      <CardBody>
        <li type="circle"><a href="https://www.youtube.com/watch?v=5medEV8SQ5k">Enlace al vídeo explicativo IMC (Jesús Ruiz Domínguez)</a></li>
      </CardBody>
    </Card>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Vídeo con las estadísticas sobre la esperanza de vida</h2></CardTitle>
      </CardHeader>
      <CardBody>
        <li type="circle"><a href="https://youtu.be/URB-d0D1I6A">Enlace al vídeo explicativo esperanza de vida (Alejandro Sánchez Márquez)</a></li>
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