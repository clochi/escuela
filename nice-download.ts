import * as pup from 'puppeteer';
const fs = require('fs');
const https = require('https')

export class NiceDownload {
    private browser: pup.Browser;
    private config: Config;
    private page: pup.Page;

    constructor(config: IConfig) {
        this.config = new Config(config as Config);
    }

    public async start() {
        console.log('Starting...');
        this.browser = await pup.launch();
        this.page = await this.browser.newPage();
        console.log('System ready');
        await this.page.setViewport(this.config.viewPortSize);
        await this.page.goto(this.config.url);
        await this.login();
        await this.page.goto(this.config.url);
        this.createFolder();
        this.prepareAndDownload();

    }

    private async callbk(err) {
        if(err) { 
            console.log(err)
        }
        const nextButton = await this.page.evaluate(elem => document.querySelector(elem) , this.config.getHtmlElements().elemNextButton);
        if (nextButton) {
            await this.page.click(this.config.getHtmlElements().elemNextButton);
            await this.page.waitFor(4000);
            this.config.videoNumber+= 1;
            await this.prepareAndDownload();
        } else {
            console.log('Finished!!! :)');
            process.exit();
        }
    }

    private async download(url, dest, cb) {
        cb = cb.bind(this);
        const file = await fs.createWriteStream(dest);
        await https.get(url, function(response) {
          response.pipe(file);
          file.on('finish', function() {
            file.close(cb);
          });
        }).on('error', function(err) {
          fs.unlink(dest);
          if (cb) cb(err.message);
        });
      };

    private async prepareAndDownload() {
        console.log('Preparing download...');
        await this.page.waitFor(4000);
        const frames = await this.page.frames();
        let video: any = await (await findFrame());
        video = JSON.parse(video.match(/var config = \{(.+)\};/)[0].match(/\{(.+)\};/)[0].replace(';', '')) as VideoObject;
        this.config.captureVideoUrl(video);
        await this.config.getVideoTitle(
            this.page,
            this.config.getHtmlElements().elemTitle
            )
            console.log(`Downloading video ${this.config.videoTitle}`);
            await this.download(
                this.config.getUrlVideoCaptured(),
                this.config.getDestinationPath(),
                this.callbk
                )
        async function findFrame() {
            return (await Promise.all(frames.map(frame => frame.content())))
                .find(content => !!content.match(/var config = \{(.+)\};/));
        }
    }

    private async 

    private async login() {
        console.log('Loging user...')
        await this.page.waitFor(4000);
        await this.page.click(this.config.getHtmlElements().entrarButton);
        await this.page.click(this.config.getHtmlElements().emailInput);
        await this.page.keyboard.type(this.config.auth.email);
        await this.page.click(this.config.getHtmlElements().passwordInput);
        await this.page.keyboard.type(this.config.auth.password);
        await this.page.click(this.config.getHtmlElements().submitButton);
        this.page.waitFor(3000);
        if (await this.page.url().match(/\/buy/)) {
            console.log('Login fail due to a typo on your login data or you account not have access.')
        } else {
            console.log('Login success! Going to the course video...');
        }
    }

    private async createFolder() {
        const folder = this.config.getFolderName();
        if (await !fs.existsSync(folder)) {
            console.log('Creating a folder for this course...')
            await fs.mkdirSync(folder);
            console.log(`The ${folder} was created!`);
        }
    }
}


export class Config {
    auth: AuthUser;
    private htmlElements?: HtmlElements;
    videoNumber?: number = 1;
    videoTitle?: string;
    private videoUrlCaptured?: string;
    viewPortSize?: ViewPortSize = { width: 1366, height: 768 };
    url: string;

    constructor(obj: Config) {
        Object.assign(this, obj);
    }

    getCourseName() {
        return this.url.match(/cursos\/([a-z-]+)/)[1].replace(/-/g, ' ');
    }

    getDestinationPath() {
        return `${this.getFolderName()}/${this.videoNumber} - ${this.videoTitle}.mp4`;
    }

    getFolderName() {
        return `./${this.getCourseName()}`;
    }

    captureVideoUrl(video: VideoObject) {
        this.videoUrlCaptured = video.request.files.progressive.find(video => video.quality === '1080p' || video.quality === '720p').url;
    }

    getUrlVideoCaptured() {
        return this.videoUrlCaptured;
    }

    async getVideoTitle(page: pup.Page, selector: string) {
        this.videoTitle = (await page.evaluate((sel) => document.querySelector(sel).textContent, selector)).replace(/[\/-:*\\]/g, ' ');
    }

    getHtmlElements(): HtmlElements {
        return {
            emailInput: "input[name='email']",
            passwordInput: "input[name='password']",
            entrarButton: "#In",
            submitButton: "button[name='enviar']",
            elemTitle: "#theClassTitle",
            elemNextButton: ".Classes-PrevNext--next a"
        }
    }

    async getTextContent(page: pup.Page, selector: string) {
        return await page.evaluate((sel) => document.querySelector(sel).textContent, selector);
    }
}

export interface ViewPortSize {
    width: number;
    height: number;
}

export interface AuthUser {
    email: string;
    password: string;
}

export interface HtmlElements {
    entrarButton: string;
    emailInput: string;
    passwordInput: string;
    submitButton: string;
    elemTitle: string;
    elemNextButton: string;
}

export interface IConfig {
    auth: AuthUser;
    url: string;
    videoNumber?: number;
    viewPortSize?: ViewPortSize;
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