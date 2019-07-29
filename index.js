"use strict";
exports.__esModule = true;
var nice_download_1 = require("./nice-download");
var config = {
    auth: {
        email: 'toronacii@gmail.com',
        password: 'trni99'
    },
    videoNumber: 1,
    url: 'https://escuela.it/cursos/curso-de-redux-y-angular-con-ngrx/clase/primeros-pasos-con-redux'
};
var ND = new nice_download_1.NiceDownload(config);
ND.start();
//# sourceMappingURL=index.js.map