import * as pup from 'puppeteer';
import { Config } from './config';
import { VideoObject, IConfig } from './interfaces';
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
        console.log('All ready!');
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
        const nextButton = await this.page.evaluate(elem => document.querySelector(elem) , this.config.htmlElements.elemNextButton);
        if (nextButton) {
            await this.page.click(this.config.htmlElements.elemNextButton);
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
            this.config.htmlElements.elemTitle
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

    private async login() {
        console.log('Loging user...')
        await this.page.waitForSelector(this.config.htmlElements.entrarButton)
        await this.page.click(this.config.htmlElements.entrarButton);
        await this.page.click(this.config.htmlElements.emailInput);
        await this.page.keyboard.type(this.config.auth.email);
        await this.page.click(this.config.htmlElements.passwordInput);
        await this.page.keyboard.type(this.config.auth.password);
        await this.page.click(this.config.htmlElements.submitButton);
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
