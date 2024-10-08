import { updateApiUri, generarContenedor, getCurrentPage } from '../controllers/principal.js';
import { getListId } from '../controllers/carrito.js';
import { calculoPrecio } from '../views/carrito.js';

export function updatePagination(paginasTotales) {
    const currentPage = getCurrentPage();
    const totalPages = paginasTotales;

    // Comprobamos la cantidad de pàginas para tener o no paginacion
    if (totalPages <2 ) {
        $('#pagination-container').html('<div class="pagination" style="display: none;"></div>');
        return; 
    }

    let paginationHtml = '<div class="pagination">';

    paginationHtml += `<a href="#" class="prev" data-page="1" style="visibility: ${currentPage <= 1 ? 'hidden' : 'visible'};">&lt;&lt;</a>`;
    paginationHtml += `<a href="#" class="prev" data-page="${currentPage - 1}" style="visibility: ${currentPage <= 1 ? 'hidden' : 'visible'};">&lt;</a>`;

    paginationHtml += `<div class="page-numbers"><a href="#" class="active" data-page="${currentPage}">${currentPage}</a></div>`;

    paginationHtml += `<a href="#" class="next" data-page="${currentPage + 1}" style="visibility: ${currentPage >= totalPages ? 'hidden' : 'visible'};">&gt;</a>`;
    paginationHtml += `<a href="#" class="next" data-page="${totalPages}" style="visibility: ${currentPage >= totalPages ? 'hidden' : 'visible'};">&gt;&gt;</a>`;

    paginationHtml += '</div>';

    $('#pagination-container').html(paginationHtml);

    $('#pagination-container a').on('click', function (e) {
        e.preventDefault(); 
        const page = $(this).data('page');
        if (page) {
            updateApiUri({ page: page });
            generarContenedor('card-template', '#card-container');
        }
        scrollToContainer();
    });
}
function scrollToContainer() {
    $('html, body').animate({
        scrollTop: $('.contenedor-busqueda').offset().top
    }, 100); // Duration of the scroll animation in milliseconds
}

function fetchTemplate(templateId, callback) {
    $.get('template.html')
        .done(function (templateFile) {
            let tempDom = $('<div>').html(templateFile);
            let template = tempDom.find(`#${templateId}`).html();
            if (template) {
                callback(template);
            } else {
                console.error('Template not found:', templateId);
            }
        })
        .fail(function () {
            console.error('Error fetching template file');
        });
}

function populateTemplate(template, data) {
    if (!data) {
        console.error('Data is undefined or null');
        return template;
    }

    const placeholders = [
        'imageUrl', 'altText', 'title', 'price', 'classificationId',
        'division', 'colorCount', 'id', 'workTypes', 'imageCount',
        'classification', 'titlesCount', 'peopleCount', 'medium',
        'dated', 'people', 'url', 'century', 'priceSmall', 'priceMedium',
        'priceLarge', 'culture', 'tamaño', 'cantidad', 'precioXcantidad', 'dimensions', 'dimensionsChico', 'dimensionsGrande',
        'priceSmall', 'priceMedium', 'priceLarge'
    ];

    placeholders.forEach(key => {
        const value = data[key] || 'error';
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, value);
    });

    return template;
}

export async function fetchAndPopulateTemplate(templateId, containerId, jsonData) {
    return new Promise((resolve) => {
        if (!Array.isArray(jsonData)) {
            jsonData = [jsonData];
        }

            fetchTemplate(templateId, function (template) {
                const populatedHtml = jsonData.map(item => populateTemplate(template, item)).join('');
                $(containerId).html(populatedHtml);
                jsonData.forEach(item => {
                    if (item.imageUrl && item.aspectRatio) {
                        const imgElement = $(`${containerId} img[src*='${item.imageUrl}']`);
                        if (imgElement.length > 0) {
                            // Obtener el ancho actual de la imagen (esto puede cambiar según la responsividad)
                            const imageWidth = imgElement.width();
                            // Calcular la altura usando el aspectRatio
                            const imageHeight = imageWidth / item.aspectRatio;
                            // Aplicar la altura a la imagen
                            imgElement.css('aspect-ratio', `${item.aspectRatio}`);
                        }
                    }
                });
                resolve();
            });
    });

}

export function insertHeaderNavFooter(headerNavId, footerId, callback) {
    fetchTemplate(headerNavId, function(headerNavTemplate) {
        $('#wrapper').prepend(headerNavTemplate);

        $('header h1').text($('title').text());
        
        fetchTemplate(footerId, function(footerTemplate) {
            $('#wrapper').append(footerTemplate);
            
            // Llama al callback después de cargar ambos templates
            if (typeof callback === 'function') callback();
        });
    });
}

export function notificacion(message) {

    if ($('#notification').length === 0) {
        $('body').append('<div class="notification" id="notification"></div>');
    }

    $('#notification').text(message);

    $('#notification').fadeIn();

    setTimeout(function () {
        $('#notification').fadeOut();
    }, 3000);
}

export async function cargarObras(templateId, contenedor, arrayLT) {

    let arrayIds = [];

    let objetosGuardados = JSON.parse(localStorage.getItem(arrayLT)) || [];

    objetosGuardados.forEach(objeto => {
        arrayIds.push(objeto.id);
    });

    if (arrayIds.length === 0) {
        arrayIds.push(-1); // Agregar -1 si el array está vacío
    }
    
    let ids = arrayIds.join('|');
    await getListId(ids);
    await generarContenedor(templateId, contenedor, async function (mappedData) {
        let objetosGuardados = JSON.parse(localStorage.getItem(arrayLT)) || [];
        let objetosMappeados = [];

        objetosGuardados.forEach(objeto => {
            let objetoOriginal = mappedData.find(obj => obj.id === objeto.id);

            if (objetoOriginal) {
                let copiaDelObjeto = JSON.parse(JSON.stringify(objetoOriginal));
                copiaDelObjeto.tamaño = objeto.dimension;
                copiaDelObjeto.cantidad = objeto.cantidad;
                copiaDelObjeto.precio = objeto.precio;
                copiaDelObjeto.precioXcantidad = (parseFloat(objeto.precio.replace('$', '')) * objeto.cantidad).toFixed(2);
                objetosMappeados.push(copiaDelObjeto);
            }
        });
        return objetosMappeados;
    });
    if (arrayLT == "carrito") {
        calculoPrecio(objetosGuardados);
    }
};

export default {
    updatePagination,
    fetchAndPopulateTemplate,
    insertHeaderNavFooter,
    notificacion,
}