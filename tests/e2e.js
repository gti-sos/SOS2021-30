const puppeteer = require('puppeteer');
const path = './tests/screenshots/';
var counter = 0;

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // Especificamos que el navegador no es headless
        slowMo: 300, // Añadimos un delay de 1 segundo entre cada comado.
    });
    console.log("Browser opened.");

    const page = await browser.newPage();
    await page.setViewport({ width: 1980, height: 1280 });
    await page.goto('https://sos2021-30.herokuapp.com');

    // Home page
    console.log("Pagina HOME abierta!");
    await page.screenshot({ path: path + (counter++) + '.png'});
    console.log("Captura tomada...");

    // Info page
    await page.click("body > main > main > a:nth-child(3)");
    console.log("Pagina INFO abierta!");
    await page.screenshot({ path: path + (counter++) + '.png'});
    console.log("Captura tomada...");
    
    // Tabla IMC page
    await page.click("body > nav > ul > li:nth-child(6) > a");
    console.log("Pagina FrontEnd IMC abierta!");
    await page.screenshot({ path: path + (counter++) + '.png'});
    console.log("Captura tomada...");
    await page.click("body > main > main > button.btn.btn-success");
    console.log("Pulsado botón para cargar los datos iniciales");
    await page.screenshot({ path: path + (counter++) + '.png'});

    var datosWeight = (await page.$$("body > main > main > table.table.table-bordered > tbody > tr")).length;
    console.log("Hay un total de " + datosWeight + " en la tabla de la página inicial");

    await page.click("body > main > main > a:nth-child(10) > button");
    console.log("Pulsado botón para ver gráfica de cilindros");
    await page.screenshot({path: path + "graficaCilindrosWeights.png"});
    console.log("Captura de grafico cilindros tomada...");
    await page.click("body > main > main > button");
    console.log("Volviendo a la página de datos IMC");

    await page.click("body > main > main > a:nth-child(11) > button");
    console.log("Pulsado botón para ver gráfica de morris.js");
    await page.screenshot({path: path + "graficaMorrisWeights.png"});
    console.log("Captura de grafico cilindros tomada...");
    await page.click("body > main > main > button");
    console.log("Volviendo a la página de datos IMC");
    
    if(datosWeight != 11){
        console.log("No se ha pasado el test");
        console.log("El número de filas detectadas no es el correcto");
        process.exit(1);
    } 

    //Tabla Life Stats
    console.log("------------------------------------------------");
    console.log("Test e2e Life-Stats");
    console.log("------------------------------------------------");
    await page.click("body > nav > ul > li:nth-child(5) > a");
    console.log("Pagina FrontEnd Esperanza de vida abierta!");
    await page.screenshot({ path: path + "paginaInicialLife.png"});
    console.log("Captura tomada...");
    await page.click("body > main > main > button.btn.btn-success");
    console.log("Pulsado botón para cargar los datos iniciales");
    await page.screenshot({ path: path + 'paginaCargadaLife.png'});

    var datosLife = (await page.$$("body > main > main > div.table-responsive > table > tbody > tr")).length;
    console.log("Hay un total de " + datosLife + " en la tabla de la página inicial");

    await page.click("body > main > main > a:nth-child(11) > button");
    console.log("Pulsado botón para ver gráfica de barras");
    await page.screenshot({path: path + "graficaBarrasLife.png"});
    console.log("Captura de grafico de barras tomada...");
    await page.click("body > main > main > a > button");
    console.log("Volviendo a la página de datos Esperanza de vida");

    await page.click("body > main > main > a:nth-child(12) > button");
    console.log("Pulsado botón para ver gráfica de Chart.js");
    await page.screenshot({path: path + "graficaChartLife.png"});
    console.log("Captura de grafica de columnas tomada...");
    await page.click("body > main > main > a > button");
    console.log("Volviendo a la página de datos Esperanza de vida");

    if(datosLife != 11){
        console.log("No se ha pasado el test");
        console.log("El número de filas detectadas no es el correcto");
        process.exit(1);
    } 

    //Cerramos el navegador
    await browser.close();
    console.log("Browser closed!");
    console.log("Test pasado correctamente!")
    process.exit(0);    
})()