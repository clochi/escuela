const fs = require('fs');
const https = require('https')
import * as puppeteer from 'puppeteer';
const url = 'https://escuela.it';
const emailInput = "input[name='email']";
const passwordInput = "input[name='password']";
const email = 'toronacii@gmail.com';
const password = 'trni99';
const loginButton = 'button[name="enviar"]';
const nextButton = '';
const firstVideoCourse = 'https://escuela.it/cursos/programacion-orientada-a-objetos/clase/4-usar-objetos-vista-privada-de-las-clases';
const courseName = firstVideoCourse.match(/cursos\/([a-z-]+)/)[1].replace(/-/g, ' ');
const dir = `./${courseName}`;

async function getBrowserAndPage() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    return {browser, page}
}

async function start() {
    const { browser, page } = await getBrowserAndPage();
    const loginData: Login = {
        input: { email: emailInput, password: passwordInput },
        data: { email: email, password: password }
    }
    await page.setViewport({width: 1366, height: 768});
    await page.goto(url)
    await page.click("#In");
    await login(page, loginData)
    await page.screenshot({path: 'escuela.png'})
    console.log('Going to a course')
    await goToCourse(page, firstVideoCourse);
    console.log('Creating directory')
    await !fs.existsSync(dir) && await fs.mkdirSync(dir);
    await download(page);
}

async function login(page: puppeteer.Page, login: Login) {
    await page.click(login.input.email);
    await page.keyboard.type(login.data.email);
    await page.click(login.input.password);
    await page.keyboard.type(login.data.password);
    await page.click(loginButton);
    console.log('logged, going to a course')
}

async function download(page: puppeteer.Page) {
    const elemTitle = '#theClassTitle';
    const elemNextButton = '.Classes-PrevNext--next a';
    const videoTitle = await qSelector(page, elemTitle);
    const str = await page.frames()[1].content()
    const obj = JSON.parse(str.match(/var config = \{(.+)\};/)[0].match(/\{(.+)\};/)[0].replace(';', '')) as VideoObject;
    const videoUrl = obj.request.files.progressive.find(video => video.quality === '720p').url;
    console.log('Downloading video ' + videoTitle)
    await downloadVideo(videoUrl, `${dir}/${videoTitle}.mp4`, callbk)

    async function callbk(err) {
        if(err) { 
            console.log(err)
        }
        const nextButton = await page.evaluate(elem => document.querySelector(elem) , elemNextButton);
        if (nextButton) {
            console.log(nextButton)
            await page.click(elemNextButton);
            await page.waitFor(10000);
            await page.screenshot({path: 'nextPage.png'})
            console.log('Next page snapshot baby!');
            await download(page);
        } else {
            console.log('Finished!!! :)')
        }
    }
}

async function goToCourse(page: puppeteer.Page, url: string) {
    await page.goto(url);
}
async function qSelector(page: puppeteer.Page, selector) {
    return await page.evaluate((sel) => document.querySelector(sel).textContent, selector);
}

async function downloadVideo(url, dest, cb) {
    const file = await fs.createWriteStream(dest);
    const request = await https.get(url, async function(response) {
      await response.pipe(file);
      await file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
  };

start();



interface LoginInput {
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface Login {
    input: LoginInput;
    data: LoginData;
}

interface VideoObject {
    request: {
        files: {
            progressive: [
                {
                    quality: string,
                    url: string,
                }
            ]
        }
    }
}