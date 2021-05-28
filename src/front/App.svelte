
<script lang="ts">
  
	
	import NotFound from "./NotFound.svelte";
	import Home from "./Home.svelte";
  import Info from "./Info.svelte";
	import Router from 'svelte-spa-router';
  import Integrations from './Integrations.svelte';
  import LifeExpectancy from './lifeStats/lifeExpectancy.svelte';
  import EditLife from './lifeStats/EditLife.svelte';
	import TablaAlcohol from "./alcoholStats/TablaAlcohol.svelte";
  import EditAlcohol from "./alcoholStats/EditAlcohol.svelte";
  import GraphAlcohol from "./alcoholStats/GraphAlcohol.svelte";
  import GraphAlcohol2 from "./alcoholStats/GraphAlcohol2.svelte";
  import AnxietyStats from "./alcoholStats/integrations/AnxietyStats.svelte";
  import PovertyRiskStats from "./alcoholStats/integrations/PovertyRisk.svelte";
  import SmokerStats from "./smokersStats/Smokers.svelte";
  import SmokersItems from "./smokersStats/SmokersItems.svelte";
  import GraphSmokers from "./smokersStats/GraphSmokers.svelte";
  import RentalStats from "./smokersStats/integrations/RentalStats.svelte";
  import Hostelries from "./smokersStats/integrations/Hostelries.svelte";
  import FrontWeight from "./weightsStats/TablaWeights.svelte";
  import EditWeight from "./weightsStats/EditWeight.svelte";
  import GraphWeight from "./weightsStats/GraphWeight.svelte";
  import GroupGraph from "./GroupGraph.svelte";
	import {Navbar,NavbarBrand,Nav,NavItem,NavLink } from 'sveltestrap';
  import GraphLife from "./lifeStats/GraphLife.svelte";

	const routes = {
		"/":Home,
    "/info": Info,
    "/integrations": Integrations,
		"/alcohol-stats": TablaAlcohol,
    "/alcohol-stats/:country/:year/:ageRange": EditAlcohol,
    "/alcohol-graph": GraphAlcohol,
    "/alcohol-graph2": GraphAlcohol2,
    "/integrations/anxiety-stats": AnxietyStats,
    "/integrations/poverty-risk-stats": PovertyRiskStats,
    "/life-stats" : LifeExpectancy,
    "/life-stats/:province/:year" : EditLife,
    "/life-graph": GraphLife,
    "/weights-stats" : FrontWeight,
    "/weights-stats/:provinces/:year" : EditWeight,
    "/weights-graph" : GraphWeight,
    "/smokers-stats" : SmokerStats,
    "/smokers-stats/:province/:year" : SmokersItems,
    "/smokers-graph" : GraphSmokers,
    "/integrations/rentals": RentalStats,
    "/integrations/hostelries": Hostelries,
    "/group-graph" : GroupGraph,
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
