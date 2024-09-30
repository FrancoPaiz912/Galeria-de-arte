import { getObjectMapper } from '../controllers/modal.js';
import { fetchAndPopulateTemplate, notificacion } from '../views/contenidoDinamico.js';

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

export async function abrirModal(id, templateId) {

    let mappedData = await getObjectMapper(id);

    await fetchAndPopulateTemplate(templateId, '#contenedor-modal', mappedData);

    const $modal = $('#modal-tarjeta');

    $modal.css('display', 'flex');

    $('body').addClass('modal-abierto');

    $modal.find('.cerrar-modal').on('click', function () {

        let objetosGuardados = JSON.parse(localStorage.getItem('coleccion')) || [];
        const ifExist = objetosGuardados.find(obra => obra.id === Number(id));
        if (window.location.pathname.endsWith('Coleccion.html') && !ifExist) {

            const elemento = $('.contenedor-tarjeta[data-id="' + id + '"]');
            $(elemento).remove();

            if (objetosGuardados.length == 0) {
                location.reload();
            }
        }

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

    let objetosGuardados = JSON.parse(localStorage.getItem('coleccion')) || [];
    const ifExist = objetosGuardados.find(obra => obra.id === Number(id));
    if (objetosGuardados.length > 0 && ifExist) {
        const element = $('.derecha');
        $(element).toggleClass('en-coleccion');
        $(element).html('<img src="/img/basicas/minus-regular-24.png" /> En coleccion ');
    }

    $('.buy-section, .derecha').on("click", function () {

        let arrayLS;
        let bool = true;

        const elementHTML = this;
        const id = $('.buy-section').data('id');

        if (elementHTML.classList.contains('buy-section')) {
            arrayLS = 'carrito';
            notificacion("Agregado a carrito");
        } else if (elementHTML.classList.contains('derecha')) {
            arrayLS = 'coleccion';
            bool = coleccion(id, elementHTML);
        }

        if (bool) {
            let objetosGuardados = JSON.parse(localStorage.getItem(arrayLS)) || [];
            const detalleVisible = $('.detalles-tamano:visible');
            const dimension = detalleVisible.find('.dimenciones-modal').text().trim();
            const precio = detalleVisible.find('.precio-modal').text().trim();
            const objeto = objetosGuardados.find(obra => obra.id === id & obra.dimension === dimension);

            if (objeto) {
                objeto.cantidad += 1;
            } else {
                const nuevaObra = {
                    id: id,
                    precio: precio,
                    dimension: dimension,
                    cantidad: 1
                };
                objetosGuardados.push(nuevaObra);
            }
            localStorage.setItem(arrayLS, JSON.stringify(objetosGuardados));
            notificacion("Agregado a Colección");
        }
    });
};

function coleccion(id, elementHTML) {
    let objetosGuardados = JSON.parse(localStorage.getItem('coleccion')) || [];
    const ifExist = objetosGuardados.find(obra => obra.id === id);
    if (ifExist) {
        objetosGuardados = objetosGuardados.filter(obra => obra.id !== id);
        $(elementHTML).toggleClass('en-coleccion');
        $(elementHTML).html('<img src="/img/basicas/coleccion.png"> Coleccionar');
        notificacion("Eliminado de Colección");
        localStorage.setItem('coleccion', JSON.stringify(objetosGuardados));
        return false;
    }
    else if (!ifExist) {
        $(elementHTML).toggleClass('en-coleccion');
        $(elementHTML).html('<img src="/img/basicas/minus-regular-24.png" /> En coleccion ');
        return true;
    }
}

