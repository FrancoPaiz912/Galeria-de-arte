import {abrirModal} from '../views/modal.js';
import {updateApiUri, mappedObjects, generarContenedor} from '../controllers/principal.js';
// import {insertHeaderNavFooter} from '../views/contenidoDinamico.js'

$(document).on('click', '.contenedor-tarjeta', function() {
    // Obtener los datos del elemento clickeado
    const id = $(this).attr('data-id'); // Obtener el 'data-id' directamente del contenedor

    let templateId = $('#contenedor-modal').data('size');
    abrirModal(id, templateId);
});

// Manejar el evento de click en los números de página
$(document).on('click', '.page-numbers a', function(e) {
    e.preventDefault(); // Evitar comportamiento por defecto del enlace
    const pageNumber = $(this).data('page'); // Obtener el número de página del enlace

    updateApiUri({ page: pageNumber });
    generarContenedor(templateId, containerId);

    $('.page-numbers a').removeClass('active');
    $(this).addClass('active');
});

export function getObjectMapper(id){
    const encontrado = mappedObjects.find(objeto => String(objeto.id) === String(id));
    return encontrado;
};