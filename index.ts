import { NiceDownload } from './nice-download';
import { IConfig } from './interfaces';

const config: IConfig = {
    auth: {
        email: 'toronacii@gmail.com',
        password: 'trni99'
    },
    videoNumber: 1,
    url: 'https://escuela.it/cursos/curso-de-analisis-y-diseno-orientados-a-objetos/clase/introduccion-al-analisis-y-diseno-orientados-a-objetos',

}
const ND = new NiceDownload(config);
ND.start();