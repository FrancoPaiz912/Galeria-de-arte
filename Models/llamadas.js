export let currentUri = 'https://api.harvardartmuseums.org/object?size=15&hasimage=1&apikey=5003baa9-f734-4f2e-8651-9adae8ce6b0b&sort=rank&sortorder=asc&classification=21|26';

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