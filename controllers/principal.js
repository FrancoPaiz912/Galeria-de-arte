import {currentUri, setURL} from '../Models/llamadas.js';
import {fetchAndPopulateTemplate, updatePagination} from '../views/contenidoDinamico.js';
import {updateContent} from '../Models/llamadas.js';

let paginasTotales;
export const mappedObjects = [];

export function mapApiData(apiData) {
    paginasTotales = apiData.info.pages;
    mappedObjects.length = 0;
    return apiData.records
        .filter(record => record.hasOwnProperty('primaryimageurl') && record.primaryimageurl !== null)  // Filtrar si primaryimageurl no existe o es null
        .map(record => {
            
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
                priceLarge: 'No price'
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

    return currentUri;
}

export async function generarContenedor(templateId, containerId){
    const data = await updateContent(); 
    const mappedData = mapApiData(data); 
    console.log('datos retornados: ' + mappedData);
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
};

export default{
    mapApiData,
    getCurrentPage,
    updateApiUri,
    mappedObjects,
    generarContenedor,

}