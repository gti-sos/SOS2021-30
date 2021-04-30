
<script lang="ts">
  
	
	import NotFound from "./front/NotFound.svelte";
	import Home from "./front/Home.svelte";
  import Info from "./front/Info.svelte";
	import Router from 'svelte-spa-router';
  import LifeExpectancy from './lifeExpectancy.svelte';
	import TablaAlcohol from "./TablaAlcohol.svelte";
  import SmokerStats from "./Smokers.svelte";
  import FrontWeight from "./front/TablaWeights.svelte";
	import {Navbar,NavbarBrand,Nav,NavItem,NavLink } from 'sveltestrap';

	const routes = {
		"/":Home,
    "/info": Info,
		"/alcohol-stats": TablaAlcohol,
    "/life-stats" : LifeExpectancy,
    "/weights-stats" : FrontWeight,
    "/smokers-stats" : SmokerStats,
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
              <NavItem>
                <NavLink href="#/smokers-stats">Tabla fumadores</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#/life-stats">Tabla esperanza de vida</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#/weights-stats">Tabla IMC</NavLink>
              </NavItem>
            </Nav>
        </Navbar>
    
    </body>

	<Router {routes}> </Router>
</main>
