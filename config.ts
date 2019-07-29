import { AuthUser, HtmlElements, ViewPortSize, VideoObject } from './interfaces';
import { Page } from 'puppeteer';

export class Config {
  auth: AuthUser;
  htmlElements: HtmlElements = {
      emailInput: "input[name='email']",
      passwordInput: "input[name='password']",
      entrarButton: "#In",
      submitButton: "button[name='enviar']",
      elemTitle: "#theClassTitle",
      elemNextButton: ".Classes-PrevNext--next a"
  };
  videoNumber?: number = 1;
  videoTitle?: string;
  private videoUrlCaptured?: string;
  viewPortSize?: ViewPortSize = { width: 1366, height: 768 };
  url: string;

  constructor(obj: Config) {
      Object.assign(this, obj);
  }

  private getCourseName() {
      return this.url.match(/cursos\/([a-z-]+)/)[1].replace(/-/g, ' ').trim();
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

  async getVideoTitle(page: Page, selector: string) {
      this.videoTitle = (await page.evaluate((sel) => document.querySelector(sel).textContent, selector)).replace(/[\/-:*\\]/g, ' ').trim();
  }

}