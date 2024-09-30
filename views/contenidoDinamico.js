import { updateApiUri, generarContenedor, getCurrentPage } from '../controllers/principal.js';
import { getListId } from '../controllers/carrito.js';
import { calculoPrecio } from '../views/carrito.js';

export function updatePagination(paginasTotales) {
    const currentPage = getCurrentPage();
    const totalPages = paginasTotales;

    // Check if total pages is 1, if so, hide the pagination div
    if (totalPages <2 ) {
        $('#pagination-container').html('<div class="pagination" style="display: none;"></div>');
        return; // No need to generate pagination for single page
    }

    // Create pagination HTML
    let paginationHtml = '<div class="pagination">'; // Wrap everything in a pagination container

    // Add First and Previous buttons
    // Use 'visibility: hidden' instead of 'display: none' to preserve space
    paginationHtml += `<a href="#" class="prev" data-page="1" style="visibility: ${currentPage <= 1 ? 'hidden' : 'visible'};">&lt;&lt;</a>`;
    paginationHtml += `<a href="#" class="prev" data-page="${currentPage - 1}" style="visibility: ${currentPage <= 1 ? 'hidden' : 'visible'};">&lt;</a>`;

    // Add Current Page
    paginationHtml += `<div class="page-numbers"><a href="#" class="active" data-page="${currentPage}">${currentPage}</a></div>`;

    // Add Next and Last buttons
    // Use 'visibility: hidden' instead of 'display: none' to preserve space
    paginationHtml += `<a href="#" class="next" data-page="${currentPage + 1}" style="visibility: ${currentPage >= totalPages ? 'hidden' : 'visible'};">&gt;</a>`;
    paginationHtml += `<a href="#" class="next" data-page="${totalPages}" style="visibility: ${currentPage >= totalPages ? 'hidden' : 'visible'};">&gt;&gt;</a>`;

    paginationHtml += '</div>'; // Close the pagination container

    // Insert pagination HTML into the container
    $('#pagination-container').html(paginationHtml);

    // Configure the page number links
    $('#pagination-container a').on('click', function (e) {
        e.preventDefault(); // Prevent default link behavior
        const page = $(this).data('page');
        if (page) {
            updateApiUri({ page: page });
            generarContenedor('card-template', '#card-container'); // Adjust templateId and containerId as needed
        }
    });
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
    console.log("notificacion: " + message)
    // Verificar si el contenedor de notificación ya existe
    if ($('#notification').length === 0) {
        // Crear el div de notificación y agregarlo al body
        $('body').append('<div class="notification" id="notification"></div>');
    }
    console.log(message);

    // Colocar el mensaje dentro del contenedor de notificación
    $('#notification').text(message);

    // Mostrar la caja de notificación
    $('#notification').fadeIn();

    // Hacer que desaparezca después de 6 segundos
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