import { cargarObras } from '../views/contenidoDinamico.js';
import {abrirModal} from '../views/modal.js'; //No sacar, se realiza la insersion del modal allí

$(document).ready(async function () {
    await cargarObras('card-template', '#card-container', 'coleccion');
});