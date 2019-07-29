import { NiceDownload, IConfig } from './nice-download';

const config: IConfig = {
    auth: {
        email: 'toronacii@gmail.com',
        password: 'trni99'
    },
    videoNumber: 1,
    url: 'https://escuela.it/cursos/curso-buenas-practicas-angular/clase/buenas-practicas-angular-i',

}
const ND = new NiceDownload(config);
ND.start()