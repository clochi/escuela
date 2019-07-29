"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var pup = require("puppeteer");
var fs = require('fs');
var https = require('https');
var NiceDownload = /** @class */ (function () {
    function NiceDownload(config) {
        this.config = new Config(config);
    }
    NiceDownload.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log('Starting...');
                        _a = this;
                        return [4 /*yield*/, pup.launch()];
                    case 1:
                        _a.browser = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.browser.newPage()];
                    case 2:
                        _b.page = _c.sent();
                        console.log('System ready');
                        return [4 /*yield*/, this.page.setViewport(this.config.viewPortSize)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, this.page.goto(this.config.url)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, this.page.screenshot({ path: 'beforelogin.png' })];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, this.login()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, this.page.screenshot({ path: 'afterlogin.png' })];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, this.page.goto(this.config.url)];
                    case 8:
                        _c.sent();
                        this.createFolder();
                        this.prepareAndDownload();
                        return [2 /*return*/];
                }
            });
        });
    };
    NiceDownload.prototype.callbk = function (err) {
        return __awaiter(this, void 0, void 0, function () {
            var nextButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            console.log(err);
                        }
                        return [4 /*yield*/, this.page.evaluate(function (elem) { return document.querySelector(elem); }, this.config.getHtmlElements().elemNextButton)];
                    case 1:
                        nextButton = _a.sent();
                        if (!nextButton) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.page.click(this.config.getHtmlElements().elemNextButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.page.waitFor(10000)];
                    case 3:
                        _a.sent();
                        this.config.videoNumber += 1;
                        return [4 /*yield*/, this.prepareAndDownload()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        console.log('Finished!!! :)');
                        process.exit();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    NiceDownload.prototype.download = function (url, dest, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cb = cb.bind(this);
                        return [4 /*yield*/, fs.createWriteStream(dest)];
                    case 1:
                        file = _a.sent();
                        return [4 /*yield*/, https.get(url, function (response) {
                                response.pipe(file);
                                file.on('finish', function () {
                                    file.close(cb);
                                });
                            }).on('error', function (err) {
                                fs.unlink(dest);
                                if (cb)
                                    cb(err.message);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    NiceDownload.prototype.prepareAndDownload = function () {
        return __awaiter(this, void 0, void 0, function () {
            function findFrame() {
                return __awaiter(this, void 0, void 0, function () {
                    var contentList, contentResolved;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                contentList = [];
                                frames.forEach(function (frame) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        contentList.push(frame.content());
                                        return [2 /*return*/];
                                    });
                                }); });
                                return [4 /*yield*/, Promise.all(contentList)];
                            case 1:
                                contentResolved = _a.sent();
                                return [2 /*return*/, contentResolved.find(function (content) {
                                        var hasConfig = content.match(/var config = \{(.+)\};/);
                                        return !!hasConfig;
                                    })];
                        }
                    });
                });
            }
            var frames, video;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Preparing download...');
                        return [4 /*yield*/, this.page.waitFor(10000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page.frames()];
                    case 2:
                        frames = _a.sent();
                        return [4 /*yield*/, findFrame()];
                    case 3: return [4 /*yield*/, (_a.sent())];
                    case 4:
                        video = _a.sent();
                        video = JSON.parse(video.match(/var config = \{(.+)\};/)[0].match(/\{(.+)\};/)[0].replace(';', ''));
                        // const pageContent = await this.page.frames()[1].content();
                        // const video = JSON.parse(pageContent.match(/var config = \{(.+)\};/)[0].match(/\{(.+)\};/)[0].replace(';', '')) as VideoObject;
                        this.config.captureVideoUrl(video);
                        return [4 /*yield*/, this.config.getVideoTitle(this.page, this.config.getHtmlElements().elemTitle)];
                    case 5:
                        _a.sent();
                        console.log("Downloading video " + this.config.videoTitle);
                        return [4 /*yield*/, this.download(this.config.getUrlVideoCaptured(), this.config.getDestinationPath(), this.callbk)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NiceDownload.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Loging user...');
                        return [4 /*yield*/, this.page.waitFor(10000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page.click(this.config.getHtmlElements().entrarButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.page.click(this.config.getHtmlElements().emailInput)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.type(this.config.auth.email)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.page.click(this.config.getHtmlElements().passwordInput)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.type(this.config.auth.password)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.page.click(this.config.getHtmlElements().submitButton)];
                    case 7:
                        _a.sent();
                        this.page.waitFor(3000);
                        return [4 /*yield*/, this.page.url().match(/\/buy/)];
                    case 8:
                        if (_a.sent()) {
                            console.log('Login fail due to a typo on your login data or you account not have access.');
                        }
                        else {
                            console.log('Login success! Going to the course video...');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    NiceDownload.prototype.createFolder = function () {
        return __awaiter(this, void 0, void 0, function () {
            var folder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Creating a folder for this course...');
                        folder = this.config.getFolderName();
                        return [4 /*yield*/, !fs.existsSync(folder)];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, fs.mkdirSync(folder)];
                    case 2:
                        _a.sent();
                        console.log("The " + folder + " was created!");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return NiceDownload;
}());
exports.NiceDownload = NiceDownload;
var Config = /** @class */ (function () {
    function Config(obj) {
        this.videoNumber = 1;
        this.viewPortSize = { width: 1366, height: 768 };
        Object.assign(this, obj);
    }
    Config.prototype.getCourseName = function () {
        return this.url.match(/cursos\/([a-z-]+)/)[1].replace(/-/g, ' ');
    };
    Config.prototype.getDestinationPath = function () {
        return this.getFolderName() + "/" + this.videoNumber + " - " + this.videoTitle + ".mp4";
    };
    Config.prototype.getFolderName = function () {
        return "./" + this.getCourseName();
    };
    Config.prototype.captureVideoUrl = function (video) {
        this.videoUrlCaptured = video.request.files.progressive.find(function (video) { return video.quality === '1080p' || video.quality === '720p'; }).url;
    };
    Config.prototype.getUrlVideoCaptured = function () {
        return this.videoUrlCaptured;
    };
    Config.prototype.getVideoTitle = function (page, selector) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, page.evaluate(function (sel) { return document.querySelector(sel).textContent; }, selector)];
                    case 1:
                        _a.videoTitle = (_b.sent()).replace(/[\/-:*\\]/g, ' ');
                        return [2 /*return*/];
                }
            });
        });
    };
    Config.prototype.getHtmlElements = function () {
        return {
            emailInput: "input[name='email']",
            passwordInput: "input[name='password']",
            entrarButton: "#In",
            submitButton: "button[name='enviar']",
            elemTitle: "#theClassTitle",
            elemNextButton: ".Classes-PrevNext--next a"
        };
    };
    Config.prototype.getTextContent = function (page, selector) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.evaluate(function (sel) { return document.querySelector(sel).textContent; }, selector)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=nice-download.js.map