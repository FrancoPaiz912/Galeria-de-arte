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


export async function abrirModal(id, templateId) { //Hacer lo mas general posible. 
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
        
        let objetosGuardados = JSON.parse(localStorage.getItem('coleccion')) || [];
        const ifExist = objetosGuardados.find(obra => obra.id === Number(id) );
        if (window.location.pathname.endsWith('Coleccion.html') && !ifExist) {
                
            const elemento = $('.contenedor-tarjeta[data-id="' + id + '"]');
            
            $(elemento).remove();
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
    const ifExist = objetosGuardados.find(obra => obra.id === Number(id) );
    if(objetosGuardados.length > 0 && ifExist){
        const element = $('.derecha');
        $(element).toggleClass('en-coleccion');
        $(element).html('<img src="/img/basicas/minus-regular-24.png" /> En coleccion ');
    }

    $('.buy-section, .derecha').on("click", function () {

        let arrayLS;
        
        const elementHTML = this;
        
        if (elementHTML.classList.contains('buy-section')) {
            arrayLS = 'carrito';
        } else if (elementHTML.classList.contains('derecha')) {
            arrayLS = 'coleccion';
        }
        
        let objetosGuardados = JSON.parse(localStorage.getItem(arrayLS)) || [];

        const id = $('.buy-section').data('id');
        
        const detalleVisible = $('.detalles-tamano:visible');
        const dimension = detalleVisible.find('.dimenciones-modal').text().trim(); 
        const precio = detalleVisible.find('.precio-modal').text().trim(); 
        const objeto = objetosGuardados.find(obra => obra.id === id & obra.dimension === dimension);
        const ifExist = objetosGuardados.find(obra => obra.id === id );
        if(arrayLS === 'coleccion' && ifExist) {
            objetosGuardados = objetosGuardados.filter(obra => obra.id !== id);
            localStorage.setItem(arrayLS, JSON.stringify(objetosGuardados));
            $(elementHTML).toggleClass('en-coleccion');
            $(elementHTML).html('<img src="/img/basicas/plus-regular-24 (1).png" />Coleccionar ');
            return;
        }
        else if(arrayLS === 'coleccion' && !ifExist){
            $(elementHTML).toggleClass('en-coleccion');
            $(elementHTML).html('<img src="/img/basicas/minus-regular-24.png" /> En coleccion ');
        }

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

    });
};


