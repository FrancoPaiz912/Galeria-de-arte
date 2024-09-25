import {abrirModal} from '../views/modal.js';
import {updateApiUri, mappedObjects, generarContenedor} from '../controllers/principal.js';
import {insertHeaderNavFooter, botonResetSearch,notificacion} from '../views/contenidoDinamico.js'

$(document).on('click', '.contenedor-tarjeta', function() {
    // Obtener los datos del elemento clickeado
    const id = $(this).attr('data-id'); // Obtener el 'data-id' directamente del contenedor
    console.log('Ocurrio el evento');
    abrirModal(id);
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
    console.log(encontrado);
    return encontrado;
};

$(document).ready(function() {
    // Carga header, nav y footer
    insertHeaderNavFooter('header-nav-template', 'footer-template', function() {
        // Este código se ejecuta después de que ambos templates han sido insertados

        // Oculta el nav al cargar la página 
        $('#nav-menu').hide(); 

        // Alterna la visibilidad del menú al hacer clic en el botón
        $('#menu-toggle').click(function() { 
            $('#nav-menu').slideToggle(); 
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Obtener la imagen de reset y añadir el event listener
    const resetButton = document.getElementById('reset-busqueda');
    
    resetButton.addEventListener('click', botonResetSearch);
});