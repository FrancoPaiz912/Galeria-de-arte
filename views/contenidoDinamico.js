import {getCurrentPage } from '../controllers/principal.js';
import {updateApiUri} from '../controllers/principal.js';
import {generarContenedor} from '../controllers/principal.js';

export function updatePagination(paginasTotales) {
    const currentPage = getCurrentPage();
    const totalPages = paginasTotales;

    // Create pagination HTML
    let paginationHtml = '<div class="pagination">'; // Wrap everything in a pagination container

    // Add First and Previous buttons
    paginationHtml += `<a href="#" class="prev ${currentPage <= 1 ? 'disabled' : ''}" data-page="1">&lt;&lt;</a>`;
    paginationHtml += `<a href="#" class="prev ${currentPage <= 1 ? 'disabled' : ''}" data-page="${currentPage - 1}">&lt;</a>`;

    // Add Current Page
    paginationHtml += `<div class="page-numbers"><a href="#" class="active" data-page="${currentPage}">${currentPage}</a></div>`;

    // Add Next and Last buttons
    paginationHtml += `<a href="#" class="next ${currentPage >= totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}">&gt;</a>`;
    paginationHtml += `<a href="#" class="next ${currentPage >= totalPages ? 'disabled' : ''}" data-page="${totalPages}">&gt;&gt;</a>`;

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
        'priceLarge', 'culture', 
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

const templateId = 'card-template';
const containerId = '#card-container';

generarContenedor(templateId, containerId);

export function opcionesFiltros(opciones, select) { //Vista
    select.innerHTML = '<option value="">Todos</option>';
    opciones.forEach(opcion => {
        const Subfiltro = document.createElement('option');
        Subfiltro.value = opcion;
        Subfiltro.textContent = opcion;
        select.appendChild(Subfiltro);
    });
}

export default{
    updatePagination,
    opcionesFiltros,
    fetchAndPopulateTemplate,

}