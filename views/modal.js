import { getObjectMapper } from '../controllers/modal.js';
import { fetchAndPopulateTemplate } from '../views/contenidoDinamico.js';

$(document).ready(function () {
    $('#nav-menu').hide(); // Oculta el nav al cargar la página 

    $('#menu-toggle').click(function () {
        $('#nav-menu').slideToggle(); // Alterna la visibilidad con una animación 
    });
});

$(document).ready(function () {
    $('.opcion-tamano').on('click', function () {
        // Remover la clase 'seleccionado' de todas las opciones
        $('.opcion-tamano').removeClass('seleccionado');

        // Agregar la clase 'seleccionado' a la opción clickeada
        $(this).addClass('seleccionado');

        // Obtener el tamaño seleccionado a través del atributo 'data-size'
        var size = $(this).data('size');

        // Ocultar todos los detalles de tamaño
        $('.detalles-tamano').hide();

        // Mostrar los detalles correspondientes al tamaño seleccionado
        $('#detalles-' + size).show();
    });
});


export async function abrirModal(id) {
    console.log("id del objeto buscado: " + id);

    let mappedData = await getObjectMapper(id);
    console.log(mappedData);
    await fetchAndPopulateTemplate('modal-card-template', '#contenedor-modal',mappedData);

    // Obtener el modal ya insertado en el DOM
    const $modal = $('#modal-tarjeta'); 

    // Cambiar la visibilidad del modal
    $modal.css('display', 'flex');

    // Prevenir el scroll del body
    $('body').addClass('modal-abierto');

    // Cerrar el modal al hacer clic en el botón de cerrar
    $modal.find('.cerrar-modal').on('click', function () {
        // Habilitar de nuevo el scroll en el body
        $('body').removeClass('modal-abierto');
        $modal.css('display', 'none');
    });

    // Aquí añades el listener para cambiar entre tamaños al hacer clic
    $modal.find('.opcion-tamano').on('click', function () {
        // Remover la clase 'seleccionado' de todas las opciones
        $modal.find('.opcion-tamano').removeClass('seleccionado');

        // Agregar la clase 'seleccionado' a la opción clickeada
        $(this).addClass('seleccionado');

        // Obtener el tamaño seleccionado a través del atributo 'data-size'
        var size = $(this).data('size');

        // Ocultar todos los detalles de tamaño
        $modal.find('.detalles-tamano').hide();

        // Mostrar los detalles correspondientes al tamaño seleccionado
        $modal.find('#detalles-' + size).show();
    });
}