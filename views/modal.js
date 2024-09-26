import { getObjectMapper } from '../controllers/modal.js';
import { fetchAndPopulateTemplate } from '../views/contenidoDinamico.js';

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
    console.log("id del objeto buscado: " + id);

    let mappedData = await getObjectMapper(id);
    console.log(mappedData);
    await fetchAndPopulateTemplate(templateId, '#contenedor-modal', mappedData);

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

    //obtener el tamaño y id. 

    if ($('.buy-section').length) {

        const boton = $('.buy-section');
        // Configura el evento click en el botón de compra
        boton.on("click", function () {
            // Recupera los objetos guardados del localStorage o inicializa un array vacío
            let objetosGuardados = JSON.parse(localStorage.getItem('carrito')) || [];

            console.log("Objetos guardados:", objetosGuardados);

            // Obtiene la dimensión seleccionada
            const dimensionSeleccionada = $('.top-section .seleccionado').data('size');
            console.log("Tamaño seleccionado:", dimensionSeleccionada);

            // Selecciona el botón de compra y el ID del objeto
            const id = Number(boton.data('id')); // Asegúrate de convertirlo a número

            // Obtiene los detalles visibles de dimensión y precio
            const detalleVisible = $('.detalles-tamano:visible');
            const dimension = detalleVisible.find('.dimenciones-modal').text().trim(); // Asegúrate de eliminar espacios
            const precio = detalleVisible.find('.precio-modal').text().trim(); // Asegúrate de eliminar espacios
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

            localStorage.setItem('carrito', JSON.stringify(objetosGuardados));

        });
    }
}

