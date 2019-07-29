import { NiceDownload, IConfig } from './nice-download';

const config: IConfig = {
    auth: {
        email: 'toronacii@gmail.com',
        password: 'trni99'
    },
    videoNumber: 1,
    url: 'https://escuela.it/cursos/curso-de-redux-y-angular-con-ngrx/clase/primeros-pasos-con-redux',

}
const ND = new NiceDownload(config);
ND.start()