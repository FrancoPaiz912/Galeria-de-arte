import {updateApiUri} from '../controllers/principal.js';

export async function getListId(ids) {
    updateApiUri({
        q: '',
        page: '',
        classification: '21|26',
        culture: '',
        century: '',
        worktype: '',
        id: `${ids}` 
    });
}

