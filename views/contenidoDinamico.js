import {updateApiUri, generarContenedor, getCurrentPage} from '../controllers/principal.js';

export function updatePagination(paginasTotales) {
    const currentPage = getCurrentPage();
    const totalPages = paginasTotales;

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
    $('#pagination-container a').on('click', function(e) {
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
        .done(function(templateFile) {
            let tempDom = $('<div>').html(templateFile);
            let template = tempDom.find(`#${templateId}`).html();
            if (template) {
                callback(template);
            } else {
                console.error('Template not found:', templateId);
            }
        })
        .fail(function() {
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
        'priceLarge', 'culture', 'tamaño', 'cantidad', 'precioXcantidad'
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

    fetchTemplate(templateId, function(template) {
        const populatedHtml =  jsonData.map(item => populateTemplate(template, item)).join('');
        $(containerId).html(populatedHtml);
         resolve();
        });
    });
}

export function insertHeaderNavFooter(headerNavId, footerId, callback) {
    fetchTemplate(headerNavId, function(headerNavTemplate) {
        $('body').prepend(headerNavTemplate);

        $('header h1').text($('title').text());
        
        fetchTemplate(footerId, function(footerTemplate) {
            $('body').append(footerTemplate);
            
            // Llama al callback después de cargar ambos templates
            if (typeof callback === 'function') callback();
        });
    });
}

export function notificacion(message) {
    console.log("notificacion: "+message)
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
    setTimeout(function() {
        $('#notification').fadeOut();
    }, 4000);
}

export default{
    updatePagination,
    fetchAndPopulateTemplate,
    insertHeaderNavFooter,
    notificacion,
}