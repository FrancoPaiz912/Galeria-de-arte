import {abrirModal} from '../views/modal.js';
import {updateApiUri, mappedObjects, generarContenedor} from '../controllers/principal.js';

$(document).on('click', '.contenedor-tarjeta', function() {
    const id = $(this).attr('data-id'); 
    let templateId = $('#contenedor-modal').data('size');
    abrirModal(id, templateId);
});

$(document).on('click', '.page-numbers a', function(e) {
    e.preventDefault(); 
    const pageNumber = $(this).data('page');

    updateApiUri({ page: pageNumber });
    generarContenedor(templateId, containerId);

    $('.page-numbers a').removeClass('active');
    $(this).addClass('active');
});

export function getObjectMapper(id){
    const encontrado = mappedObjects.find(objeto => String(objeto.id) === String(id));
    return encontrado;
};