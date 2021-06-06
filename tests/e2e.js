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
    console.log("> Captura tomada...");

    // Info page
    await page.click("body > main > main > a:nth-child(3)");
    console.log("Pagina INFO abierta!");
    await page.screenshot({ path: path + (counter++) + '.png'});
    console.log("> Captura tomada...");
    
    // Tabla IMC page
    await page.click("body > nav > ul > li:nth-child(6) > a");
    console.log("Pagina FrontEnd IMC abierta!");
    await page.screenshot({ path: path + (counter++) + '.png'});
    console.log("> Captura tomada...");
/*
    // About page
    await page.click("#about");
    console.log("Pagina ABOUT abierta!");
    await page.screenshot({ path: path + (counter++) + '.png'});
    console.log("> Captura tomada...");
    await page.click("#nav-back"); // Volvemos a la Home page

    // Integrations page
    await page.click("#integrations");
    console.log("Pagina INTEGRATIONS abierta!");
    console.log("> Captura tomada...");
    await page.screenshot({ path: path + (counter++) + '.png'});
    await page.click("#nav-back"); // Volvemos a la Home page*/
})()