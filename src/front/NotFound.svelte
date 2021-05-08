<script>
import {
    Button
  } from "sveltestrap";
</script>

<main>
  <h2>404</h2>
<h4>Upps! Página no encontrada</h4>
<p>La página que estabas buscando no existe. Tal vez hallas escrito 
  mal la dirección o está ha cambiado.</p>
  <a href="/">
    <Button color="primary">Volver a la página principal</Button></a>

</main>

<style>
    main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    max-width: 380px;
  }
  h2{
    font-size: 100px;
  }
  h4{
    background-color: grey;
    color: white;
    padding: 10px;
    margin: 5px;
    
  }
</style>