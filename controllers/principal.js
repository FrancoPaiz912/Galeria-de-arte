import { currentUri, setURL } from '../Models/llamadas.js';
import { fetchAndPopulateTemplate, updatePagination } from '../views/contenidoDinamico.js';
import { updateContent } from '../Models/llamadas.js';
import { insertHeaderNavFooter } from '../views/contenidoDinamico.js'

let paginasTotales;
export const mappedObjects = [];

export function mapApiData(apiData) {
    paginasTotales = apiData.info.pages;
    mappedObjects.length = 0;
    return apiData.records
        .filter(record => record.hasOwnProperty('primaryimageurl') && record.primaryimageurl !== null)
        .map(record => {
            const id = record.id;
            const imageUrl = record.primaryimageurl;
            let width = null;
            let height = null;
            if (record.images && record.images.length > 0) {
                width = record.images[0].width || null;
                height = record.images[0].height || null;
            }
            let dimensions = parseDimensions(record.dimensions) || 'Mediano';
            let dimensionsChico = reSize(record.dimensions, 0.75);
            let dimensionsGrande = reSize(record.dimensions, 1.5);
            const mappedObject = {
                imageUrl,
                title: record.title || 'No title',
                price: '$9000',
                classificationId: record.classificationid || 'No classification ID',
                division: record.division || 'No division',
                colorCount: record.colorcount || 0,
                id: record.id || 'No ID',
                workTypes: record.worktypes ? record.worktypes.map(type => type.worktype).join(', ') : 'No work types',
                imageCount: record.imagecount || 0,
                classification: record.classification || 'No classification',
                medium: record.medium || 'No medium',
                dated: record.dated || 'No date',
                century: record.century || 'No century',
                culture: record.culture || 'No culture',
                dimensions,
                dimensionsChico,
                dimensionsGrande,
                titlesCount: record.titlescount || 0,
                peopleCount: record.peoplecount || 0,
                people: record.people ? record.people.filter(person => person.role === 'Artist').map(person => person.displayname).join(', ') : 'No artist',
                url: record.url || 'No URL',
                priceSmall: calculateCost(dimensionsChico, 10, 'chico'),
                priceMedium: calculateCost(dimensions, 10, 'mediano'),
                priceLarge: calculateCost(dimensionsGrande, 10, 'grande'),
                tamaño: null,
                cantidad: null,
                precioXcantidad: null,
                height,
                width,
                aspectRatio: width / height
            };
            mappedObjects.push(mappedObject);
            return mappedObject;
        });
}

function parseDimensions(input) {
    try {
        const cleanedInput = input
            .replace(/(?:\w+:)?/g, '')
            .replace(/[^\d.xX×\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        const regex = /(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)/i;
        const match = cleanedInput.match(regex);
        if (match) {
            const width = parseFloat(match[1]).toFixed(2);
            const height = parseFloat(match[2]).toFixed(2);
            return `${width} cm x ${height} cm`;
        }
        return null;
    } catch (error) {
        return "10 cm x 15 cm";
    }
}

function reSize(dimensions, multiplier) {
    try {
        if (typeof dimensions !== 'string' || !dimensions.includes('x')) {
            return multiplier < 1 ? "Chico" : "Grande";
        }
        const dimensionParts = dimensions.match(/(\d+(\.\d+)?)(\s*cm)?\s*x\s*(\d+(\.\d+)?)(\s*cm)?/i);
        if (!dimensionParts) {
            return multiplier < 1 ? "Chico" : "Grande";
        }
        const widthStr = dimensionParts[1];
        const heightStr = dimensionParts[4];
        const width = parseFloat(widthStr.trim());
        const height = parseFloat(heightStr.trim());
        if (isNaN(width) || isNaN(height)) {
            return multiplier < 1 ? "Chico" : "Grande";
        }
        const newWidth = (width * multiplier).toFixed(2);
        const newHeight = (height * multiplier).toFixed(2);
        return `${newWidth} cm x ${newHeight} cm`;
    } catch (error) {
        return multiplier < 1 ? "Chico" : "Grande";
    }
}

function calculateCost(dimensionsInput, PrecioPorCm, size) {
    try {
        const [widthStr, heightStr] = dimensionsInput.split('x').map(dim => dim.trim());
        const width = parseFloat(widthStr.replace('cm', ''));
        const height = parseFloat(heightStr.replace('cm', ''));
        if (isNaN(width) || isNaN(height)) {
            throw new Error("Invalid dimensions");
        }
        if (size === 'chico') PrecioPorCm *= 1.5;
        else if (size === 'grande') PrecioPorCm *= 0.75;
        const area = width * height;
        let cost = area * PrecioPorCm;
        if (cost < 6000 && size === 'chico') cost = 6000;
        if (cost < 12000 && size === 'mediano') cost = 12000;
        if (cost < 24000 && size === 'grande') cost = 24000;
        cost = Math.round(cost);
        return `$${cost}`;
    } catch (error) {
        if (size === 'chico') return "$6000";
        else if (size === 'mediano') return "$12000";
        else if (size === 'grande') return "$24000";
        return "$12000";
    }
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

    return currentUri;
}

export async function generarContenedor(templateId, containerId, funcion = (mappedData) => { }) {
    const data = await updateContent();
    let mappedData = mapApiData(data);

    if (funcion && typeof funcion === 'function') {
        const resultado = await funcion(mappedData); // No quitar este await, por más que VSCODE diga lo contrario.
        if (resultado !== undefined) {
            mappedData = resultado;
        }
    } 
    $('#sin-contenido').remove();

    if (mappedData.length === 0) {
        const $container = $(containerId);
        $container.empty();
        $container.after('<div id="sin-contenido"> No hay resultados para mostrar</div>');
    }
    else {
        fetchAndPopulateTemplate(templateId, containerId, mappedData);
    }
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

$(document).ready(function () {
    insertHeaderNavFooter('header-nav-template', 'footer-template', function () {

        // Alterna la visibilidad del menú al hacer clic en el botón
        $('#menu-toggle').click(function () {
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