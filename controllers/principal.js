import { currentUri, setURL } from '../Models/llamadas.js';
import { fetchAndPopulateTemplate, updatePagination } from '../views/contenidoDinamico.js';
import { updateContent } from '../Models/llamadas.js';
import {insertHeaderNavFooter} from '../views/contenidoDinamico.js'

let paginasTotales;
export const mappedObjects = [];

export function mapApiData(apiData) {
    paginasTotales = apiData.info.pages;

    mappedObjects.length = 0;
    return apiData.records
        .filter(record => record.hasOwnProperty('primaryimageurl') && record.primaryimageurl !== null)  // Filtrar si primaryimageurl no existe o es null
        .map(record => {
            const id = record.id;
            const imageUrl = record.primaryimageurl;
            const mappedObject = {
                imageUrl,
                title: record.title || 'No title',
                price: '$9000', // Placeholder, modificar si es necesario
                classificationId: record.classificationid || 'No classification ID',
                division: record.division || 'No division',
                colorCount: record.colorcount || 0,
                id: record.id || 'No ID',
                workTypes: record.worktypes ? record.worktypes.map(type => type.worktype).join(', ') : 'No work types',
                imageCount: record.imagecount || 0,
                classification: record.classification || 'No classification', // Already present, no duplication
                medium: record.medium || 'No medium', // Already present, no duplication
                dated: record.dated || 'No date', // Already present, no duplication
                century: record.century || 'No century', // Already present, no duplication
                culture: record.culture || 'No culture', // New addition
                dimensions: record.dimensions || 'No dimensions', // New addition
                titlesCount: record.titlescount || 0,
                peopleCount: record.peoplecount || 0,
                people: record.people ? record.people.filter(person => person.role === 'Artist').map(person => person.displayname).join(', ') : 'No artist',
                url: record.url || 'No URL',
                priceSmall: 'No price',
                priceMedium: 'No price',
                priceLarge: 'No price',
                tamaño: null,
                cantidad: null,
                precioXcantidad: null
            };
            mappedObjects.push(mappedObject);
            return mappedObject;
        });
}

export function getCurrentPage() {
    const url = new URL(currentUri);
    const pageParam = url.searchParams.get('page');
    return parseInt(pageParam, 10) || 1;  // Return 1 if 'page' parameter is not present
}

export function updateApiUri(params) {
    const url = new URL(currentUri);

    for (const [key, value] of Object.entries(params)) {
        if (value === '') {
            url.searchParams.delete(key);
        } else if (value !== undefined) {
            url.searchParams.set(key, value);
        }
    }
    setURL(url.toString());
    console.log(currentUri);

    return currentUri;
}

export async function generarContenedor(templateId, containerId, funcion = (mappedData) => { }) {
    const data = await updateContent();
    console.log("updateContent");
    let mappedData = mapApiData(data);

    if (funcion  && typeof funcion === 'function') {
        const resultado = await funcion(mappedData); //No quitar este await, por mas que VSCODE diga lo contrario.
        if (resultado !== undefined) {
            mappedData = resultado;
        }
    }

    fetchAndPopulateTemplate(templateId, containerId, mappedData);
    updatePagination(data.info.pages);
}

const params = {
    q: '',
    size: '',
    page: '',
    sort: '',
    sortorder: '',
    medium: '',
    yearmade: '',
    classification: '',
    century: '',
    culture: '',
    worktype: '',
    id: '',
};

$(document).ready(function() {
    // Carga header, nav y footer
    insertHeaderNavFooter('header-nav-template', 'footer-template', function() {
        // Este código se ejecuta después de que ambos templates han sido insertados

        // Alterna la visibilidad del menú al hacer clic en el botón
        $('#menu-toggle').click(function() { 
            $('#nav-menu').slideToggle(); 
        });
    });
});

export default {
    mapApiData,
    getCurrentPage,
    updateApiUri,
    mappedObjects,
    generarContenedor
}