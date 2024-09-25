import {mapApiData} from "../controllers/principal.js";
import {fetchAndPopulateTemplate, updatePagination} from "../views/contenidoDinamico.js";

export let currentUri = 'https://api.harvardartmuseums.org/object?hasimage=1&apikey=5003baa9-f734-4f2e-8651-9adae8ce6b0b&classification=21|26';

export async function updateContent(uri = currentUri) { 
    try {
        const data = await $.getJSON(uri);
        return data;
    } catch (error) {
        console.error('Error fetching data from API', error);
    }
}

export function setURL(uri){
    currentUri= uri;
}

export default {
    updateContent,
    setURL,
    currentUri,
    
}