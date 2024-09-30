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
        .filter(record => record.hasOwnProperty('primaryimageurl') && record.primaryimageurl !== null)  // Filtrar si primaryimageurl no existe o es null
        .map(record => {
            const id = record.id;
            const imageUrl = record.primaryimageurl;
            // Obtener el ancho y alto de la primera imagen si está disponible
            let width = null;
            let height = null;
            if (record.images && record.images.length > 0) {
                width = record.images[0].width || null;
                height = record.images[0].height || null;
            }
            let dimensions = parseDimensions(record.dimensions) || 'Mediano';
            let dimensionsChico= reSize(record.dimensions, 0.75);
            let dimensionsGrande=  reSize(record.dimensions, 1.5);
            
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
                classification: record.classification || 'No classification', // Already present, no duplication
                medium: record.medium || 'No medium', // Already present, no duplication
                dated: record.dated || 'No date', // Already present, no duplication
                century: record.century || 'No century', // Already present, no duplication
                culture: record.culture || 'No culture', // New addition
                dimensions, // New addition
                dimensionsChico,
                dimensionsGrande,
                titlesCount: record.titlescount || 0,
                peopleCount: record.peoplecount || 0,
                people: record.people ? record.people.filter(person => person.role === 'Artist').map(person => person.displayname).join(', ') : 'No artist',
                url: record.url || 'No URL',
                priceSmall: calculateCost(dimensionsChico, 10),
                priceMedium: calculateCost(dimensions, 10),
                priceLarge: calculateCost(dimensionsGrande, 10),
                tamaño: null,
                cantidad: null,
                precioXcantidad: null,
                height: height,  
                width: width,    
                aspectRatio: width/height
            };
            mappedObjects.push(mappedObject);
            return mappedObject;
        });
}
function parseDimensions(input) {
    try {
        // Expresión regular para capturar dimensiones en cm
        const regex = /(\d+(\.\d+)?)\s*x\s*(\d+(\.\d+)?)/;
        const match = input.match(regex);
        
        if (match) {
            // Convertir las dimensiones a números y devolverlas en cm
            const width = parseFloat(match[1]).toFixed(2); // Limit to 2 decimal places
            const height = parseFloat(match[3]).toFixed(2); // Limit to 2 decimal places
            return `${width} cm x ${height} cm`;
        }
        return null; // Si no se encuentra una coincidencia
    } catch (error) {
        return "10 cm X 15 cm"; // Si ocurre un error
    }
}

function reSize(dimensions, multiplier) {
    try {
        // Check if the dimensions string is valid
        if (typeof dimensions !== 'string' || !dimensions.includes('x')) {
            return multiplier < 1 ? "Chico" : "Grande";
        }

        // Split the dimensions string by 'x' to separate width and height
        const [widthStr, heightStr] = dimensions.split('x');

        // Strip whitespace and convert to float
        const width = parseFloat(widthStr.trim().replace('cm', ''));
        const height = parseFloat(heightStr.trim().replace('cm', ''));

        // Check if parsing was successful
        if (isNaN(width) || isNaN(height)) {
            return multiplier < 1 ? "Chico" : "Grande";
        }

        // Calculate the new dimensions
        const newWidth = (width * multiplier).toFixed(2); // Limit to 2 decimal places
        const newHeight = (height * multiplier).toFixed(2); // Limit to 2 decimal places

        return `${newWidth} cm x ${newHeight} cm`;
    } catch (error) {
        // Return "Chico" if multiplier < 1, otherwise return "Grande"
        return multiplier < 1 ? "Chico" : "Grande";
    }
}

function calculateCost(dimensionsInput, PrecioPorCm, size) {
    try {
        // Extract the width and height from the dimensions input
        const [widthStr, heightStr] = dimensionsInput.split('x').map(dim => dim.trim());

        // Parse the numerical values from the strings
        const width = parseFloat(widthStr.replace('cm', ''));
        const height = parseFloat(heightStr.replace('cm', ''));

        // Check if parsing was successful
        if (isNaN(width) || isNaN(height)) {
            throw new Error("Invalid dimensions");
        }

        // Adjust PrecioPorCm based on size
        if (size === 'chico') {
            PrecioPorCm *= 1.5;
        } else if (size === 'grande') {
            PrecioPorCm *= 0.75;
        }

        // Calculate area and then cost
        const area = width * height; // Area in cm²
        const cost = area * PrecioPorCm; // Total cost based on area and price per cm

        return `$${cost.toFixed(2)}`; // Return the cost formatted to 2 decimal places
    } catch (error) {
        // Return specific costs based on the size
        if (size === 'chico' || dimensionsInput=== 'Chico') {
            return "$ 6000";
        } else if (size === 'mediano' || dimensionsInput=== 'Mediano') {
            return "$ 12000";
        } else if (size === 'grande' || dimensionsInput=== 'Grande') {
            return "$ 24000";
        }
        return "$ 12000"; // Handle any errors if size is not recognized
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