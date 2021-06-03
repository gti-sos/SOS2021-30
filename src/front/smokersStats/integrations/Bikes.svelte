<script>
    import * as JSC from "jscharting";
    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    //ALERTAS
    let visible = false;
    let color = "danger";
    var checkMSG = "";

    //Uso API Canadá
    const BASE_BIKES_API_PATH = "https://bikewise.org/api/v2/incidents";
    const BASE_SMOKERS_PATH = "/api/v3/smokers-stats";

    //Variables SMOKER
    var smokersData = [];
    var smokerChartProvince = [];
    var smokerChartDaily = [];

    //Variables BIKES
    var bikesData = [];
    var bikesTitle = [];
    var bikesUrl = [];
    var bikesAddress = [];
    var bikesType = [];

    //Variables globales
    var dataFin = [];

    console.log("Cargando datos...");

    //GET SMOKER
    async function getSmoker() {
        const res = await fetch(BASE_SMOKERS_PATH);
        if (res.ok) {
            smokersData = await res.json();
            console.log("Received Smokers Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de SMOKERS");
        }
    }
    //GET BIKEWISE
    async function getBikes() {
        const res = await fetch(BASE_BIKES_API_PATH);
        if (res.ok) {
            bikesData = await res.json();
            console.log("Received Bikes Data.");
        } else {
            checkMSG = res.status + ": " + res.statusText;
            console.log("ERROR al cargar los datos de BIKEWISE-API");
        }
    }

    //LOAD
    async function loadGraph() {
        await getSmoker();
        await getBikes();
        console.log("Nº datos smoker recibidos para pintar: " + smokersData.length);
        console.log("Nº datos bikewise recibidos para pintar: " + bikesData.incidents.length);

        //Gestión de datos de ambas apis y reparto en variables
        smokersData.forEach((stat) => {
            smokerChartProvince.push(stat.province);
            smokerChartDaily.push(stat["dailySmoker"]);
        });

        
        //Comprueba que la gráfica no aparezca vacía y vuelve atrás
        if (smokersData.length == 0) {
            console.log("No hay datos cargados en la API!");
            alert("Por favor, primero cargue los datos de la API 'FUMADORES' ");
            pop();
        }
        
        bikesData.incidents.forEach((stat) => {
            bikesTitle.push(stat.title.valueOf());  //extraemos el título del evento
            bikesUrl.push(stat.url.valueOf());    //extraemos la descripción del evento
            bikesAddress.push(stat.address.valueOf());    //extraemos la dirección del evento
            bikesType.push(stat.type.valueOf());    //extraemos el tipo de evento
        });

        console.log(bikesTitle);
        console.log(bikesUrl);
        console.log(bikesAddress);
        console.log(bikesType);
        

        //Tratamiento de datos
        // dataFin será donde acaben estando los datos a representar
        for (let i=0; i<bikesData.incidents.length; i++){
            let tablaAux = [];
            tablaAux.push(canadaFecha[i]);
            tablaAux.push(canadaProvinceNum[i]);
            dataFin.push(tablaAux);
        }

        console.log(dataFin);




        var config = { 
  type: 'organization down', 
  defaultPoint: { 
    outline_width: 0, 
    annotation: { 
      asHTML: true, 
      label: { 
        text: 
          '<div class="department" style="border-bottom:5px solid %color;"><b>%position</b>%name%units</div>', 
        align: 'center'
      } 
    } 
  }, 
  defaultSeries: { 
    mouseTracking_enabled: false, 
    line: { width: 1, color: '#e0e0e0' } 
  }, 
  series: [ 
    { 
      points: [ 
        { 
          name: 'Ellis Davidson', 
          id: 'dhr', 
          attributes: { 
            position: 
              'Director of Human Resources<br>', 
            units: ''
          }, 
          label_style_fontSize: 14, 
          color: 'white'
        }, 
        { 
          name: 'Leroy Gonzalez', 
          id: 'ca', 
          parent: 'dhr', 
          attributes: { 
            position: 'Compensation Analysis<br>', 
            units: ''
          }, 
          label_style_fontSize: 12, 
          color: '#ba68c8'
        }, 
        { 
          name: '', 
          id: 'ca_', 
          parent: 'ca', 
          attributes: { 
            position: '', 
            units: 
              '<ul><li><b>Job Evaluation</b><br>Martha Butler</li><li><b>Salary Board</b><br>Jacquelyn Aguilar</li><li><b>Merit Admin</b><br>Gregory Floyd</li><li><b>Attendance Incentive</b><br>Devin Wells</li><li><b>HRIS</b><br>Lauren Thornton</li></ul>'
          }, 
          label_style_fontSize: 10, 
          color: '#ce93d8', 
          annotation_label_text: 
            '<div class="units"><b>%position</b>%name%units</div>'
        }, 
        { 
          name: 'Dana Payne', 
          id: 'ba', 
          parent: 'dhr', 
          attributes: { 
            position: 
              'Benefits Administration<br>', 
            units: ''
          }, 
          label_style_fontSize: 12, 
          color: '#f06292'
        }, 
        { 
          name: '', 
          id: 'ba_', 
          parent: 'ba', 
          attributes: { 
            position: '', 
            units: 
              "<ul><li><b>Flex Benefits</b><br>Kathleen Lynch</li><li><b>Worker's Comp</b><br>Grant Foster</li><li><b>LTD</b><br>Edwin Carson</li><li><b>Open Enrollment</b><br>Vickie Price</li></ul>"
          }, 
          label_style_fontSize: 10, 
          color: '#f48fb1', 
          annotation_label_text: 
            '<div class="units"><b>%position</b>%name%units</div>' 
        }, 
        { 
          name: 'Kristen Hughes', 
          id: 'rm', 
          parent: 'dhr', 
          attributes: { 
            position: 'Risk Management<br>', 
            units: '' 
          }, 
          label_style_fontSize: 12, 
          color: '#64b5f6' 
        }, 
        { 
          name: '', 
          id: 'rm_', 
          parent: 'rm', 
          attributes: { 
            position: '', 
            units: 
              '<ul><li><b>Property Insurance</b><br>Florence Mcguire</li><li><b>General Liability</b><br>Brandi Russell</li><li><b>Professional Liability</b><br>Jill Todd</li><li><b>Emergency Procedures</b><br>Lola Ramos</li><li><b>Safety Program</b><br>Ismael Jenkins</li></ul>' 
          }, 
          label_style_fontSize: 10, 
          color: '#90caf9', 
          annotation_label_text: 
            '<div class="units"><b>%position</b>%name%units</div>' 
        }, 
        { 
          name: 'Sheri Tate', 
          id: 't', 
          parent: 'dhr', 
          attributes: { 
            position: 'Training<br>', 
            units: '' 
          }, 
          label_style_fontSize: 12, 
          color: '#4db6ac' 
        }, 
        { 
          name: '', 
          id: 't_', 
          parent: 't', 
          attributes: { 
            position: '', 
            units: 
              '<ul><li><b>Training Partnership</b><br>Fannie Chandler</li><li><b>Course Procedure</b><br>Frankie Clark</li><li><b>Workforce Committee</b><br>Amos Wong</li><li><b>Program Development</b><br>Israel Edwards</li></ul>' 
          }, 
          label_style_fontSize: 10, 
          color: '#80cbc4', 
          annotation_label_text: 
            '<div class="units"><b>%position</b>%name%units</div>' 
        }, 
        { 
          name: 'Dolores Robbins', 
          id: 'er', 
          parent: 'dhr', 
          attributes: { 
            position: 'Employee Relations<br>', 
            units: '' 
          }, 
          label_style_fontSize: 12, 
          color: '#aed581' 
        }, 
        { 
          name: '', 
          id: 'er_', 
          parent: 'er', 
          attributes: { 
            position: '', 
            units: 
              '<ul><li><b>Client Consultations</b><br>Victoria Robertson</li><li><b>Grievance Procedure</b><br>Opal Sparks</li><li><b>FMLA Administration</b><br>Lorena Larson</li><li><b>Unemployment Comp</b><br>Wade King</li><li><b>EEO</b><br>Rene Ellis</li></ul>' 
          }, 
          label_style_fontSize: 10, 
          color: '#c5e1a5', 
          annotation_label_text: 
            '<div class="units"><b>%position</b>%name%units</div>' 
        }, 
        { 
          name: 'Lance Mendoza', 
          id: 's', 
          parent: 'dhr', 
          attributes: { 
            position: 'Staffing<br>', 
            units: '' 
          }, 
          label_style_fontSize: 12, 
          color: '#ffd54f' 
        }, 
        { 
          name: '', 
          id: 's_', 
          parent: 's', 
          attributes: { 
            position: '', 
            units: 
              '<ul><li><b>Job Postings</b><br>Randal Schultz</li><li><b>Applicant Sourcing</b><br>Lydia Holt</li><li><b>Summer Employment</b><br>John Alvarado</li><li><b>Applicant Screening</b><br>Ralph Meyer</li></ul>' 
          }, 
          label_style_fontSize: 10, 
          color: '#ffe082', 
          annotation_label_text: 
            '<div class="units"><b>%position</b>%name%units</div>' 
        } 
      ] 
    } 
  ] 
}; 
  
config.series[0].points.forEach(function(point) { 
  point.attributes.units = point.attributes.units.replace( 
    /<li>/g, 
    '<li style="background-color: %color;">' 
  ); 
}); 

var chart = JSC.chart('chartDiv', config); 
    }
    //Llamada a la función 
    loadGraph();
    
	
</script>

<main>
    <div>
        {#if checkMSG.length!=0}
          <p class="msgRed" style="color: #9d1c24">ERROR: {checkMSG}</p>
        {/if}
      </div>

    <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto"/>
    <br>
    <p align="center"><Button outline color="primary" on:click={pop}>Atrás</Button></p>

</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
      }
      div{
        margin-bottom: 15px;
      }
      p {
        display: inline;
      }
      .msgRed {
        padding: 8px;
        background-color: #ffffff;
      }
  
  </style>