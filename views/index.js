import {updateApiUri, generarContenedor} from '../controllers/principal.js';

const templateId = 'card-template';
const containerId = '#card-container';

generarContenedor(templateId, containerId);

export function botonResetSearch() {

        // Resetear los selectores de filtro al valor "Todos"
        document.getElementById('filtro-Clasificacion').value = '21|26'; // Clasificación
        document.getElementById('filtro-Cultura').value = ''; // Cultura
        document.getElementById('filtro-Siglo').value = ''; // Siglo
        document.getElementById('filtro-Tipo-Trabajo').value = ''; // Tipo de trabajo
    
        updateApiUri({ q: '', page: '', classification: '21|26', culture: '', century: '',  worktype:'' });
    
        generarContenedor('card-template', '#card-container');
}

export function opcionesFiltros(opciones, select) {
    select.innerHTML = '<option value="">Todos</option>';
    opciones.forEach(opcion => {
        const Subfiltro = document.createElement('option');
        Subfiltro.value = opcion;
        Subfiltro.textContent = opcion;
        select.appendChild(Subfiltro);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Obtener la imagen de reset y añadir el event listener
    const resetButton = document.getElementById('reset-busqueda');
    
    resetButton.addEventListener('click', botonResetSearch);
});