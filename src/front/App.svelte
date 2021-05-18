
<script lang="ts">
  
	
	import NotFound from "./NotFound.svelte";
	import Home from "./Home.svelte";
  import Info from "./Info.svelte";
	import Router from 'svelte-spa-router';
  import LifeExpectancy from './lifeStats/lifeExpectancy.svelte';
  import EditLife from './lifeStats/EditLife.svelte';
	import TablaAlcohol from "./alcoholStats/TablaAlcohol.svelte";
  import EditAlcohol from "./alcoholStats/EditAlcohol.svelte";
  import GraphAlcohol from "./alcoholStats/GraphAlcohol.svelte";
  import SmokerStats from "./smokersStats/Smokers.svelte";
  import SmokersItems from "./smokersStats/SmokersItems.svelte";
  import GraphSmokers from "./smokersStats/GraphSmokers.svelte";
  import FrontWeight from "./weightsStats/TablaWeights.svelte";
  import EditWeight from "./weightsStats/EditWeight.svelte";
  import GraphWeight from "./weightsStats/GraphWeight.svelte";
  import GroupGraph from "./GroupGraph.svelte";
  import GroupGraph2 from "./GroupGraph2.svelte";
	import {Navbar,NavbarBrand,Nav,NavItem,NavLink } from 'sveltestrap';
import GraphLife from "./lifeStats/GraphLife.svelte";


	const routes = {
		"/":Home,
    "/info": Info,
		"/alcohol-stats": TablaAlcohol,
    "/alcohol-stats/:country/:year/:ageRange": EditAlcohol,
    "/alcohol-graph": GraphAlcohol,
    "/life-stats" : LifeExpectancy,
    "/life-stats/:province/:year" : EditLife,
    "/life-graph": GraphLife,
    "/weights-stats" : FrontWeight,
    "/weights-stats/:provinces/:year" : EditWeight,
    "/weights-graph" : GraphWeight,
    "/smokers-stats" : SmokerStats,
    "/smokers-stats/:province/:year" : SmokersItems,
    "/smokers-graph" : GraphSmokers,
    "/group-graph" : GroupGraph,
    "/group-graph2" : GroupGraph2,
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
              <NavItem  >
                <NavLink href="#/info">Información</NavLink>
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
