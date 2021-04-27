<script lang="ts">
  
	
	import NotFound from "./NotFound.svelte";
	import Home from "./Home.svelte";
	import Router from 'svelte-spa-router';
	import TablaAlcohol from "./TablaAlcohol.svelte";
	import {Navbar,NavbarBrand,Nav,NavItem,NavLink } from 'sveltestrap';

	const routes = {
		"/":Home,
		"/alcohol-stats": TablaAlcohol,
		'*': NotFound};
</script>

<main>
	<body >
        <Navbar color="dark" dark expand = "md" >
            <NavbarBrand href="/">SOS2021-30</NavbarBrand>
            <Nav navbar >
              <NavItem  >
                <NavLink href="#/">Inicio</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#/alcohol-stats">Tabla alcohol</NavLink>
              </NavItem>
            </Nav>
        </Navbar>
    
    </body>

	<Router {routes}> </Router>
</main>