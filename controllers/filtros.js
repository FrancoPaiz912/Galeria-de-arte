import {cargarFiltrosDibujos, cargarFiltrosPinturas } from '../Models/filtros.js';
import {opcionesFiltros} from '../views/index.js';
import {updateApiUri} from '../controllers/principal.js';
import {generarContenedor} from '../controllers/principal.js';

$(window).on('load', async function () {
    const filtrosdib = await cargarFiltrosDibujos();
    const filtrospin = await cargarFiltrosPinturas();
    opcionesFiltros([...new Set([...filtrosdib[0], ...filtrospin[0]])], cultura);
    opcionesFiltros([...new Set([...filtrosdib[1], ...filtrospin[1]])], siglo);
    opcionesFiltros([...new Set([...filtrosdib[2], ...filtrospin[2]])], tipoTrabajo);
    // try {
    //     const response = await fetch('http://localhost:3000/api/init');
    //     const data = await response.json();
    //     console.log('Respuesta del servidor:', data);
    // } catch (error) {
    //     console.error('Error al llamar al servidor:', error);
    // } //Carga de opciones para los filtros
});

const cultura = document.getElementById('filtro-Cultura');
const siglo = document.getElementById('filtro-Siglo');
const tipoTrabajo = document.getElementById('filtro-Tipo-Trabajo');

$('#filtro-Clasificacion').on('change', async function () {
    const selectedValue = $(this).val();
    updateApiUri({ classification: selectedValue, page: '' });
    generarContenedor('card-template', '#card-container');
    if (selectedValue === "21|26") {
        const filtrosdib = await cargarFiltrosDibujos();
        const filtrospin = await cargarFiltrosPinturas();
        opcionesFiltros([...new Set([...filtrosdib[0], ...filtrospin[0]])], cultura);
        opcionesFiltros([...new Set([...filtrosdib[1], ...filtrospin[1]])], siglo);
        opcionesFiltros([...new Set([...filtrosdib[2], ...filtrospin[2]])], tipoTrabajo);
    }
    else if (selectedValue === "21") {
        const filtrosdib = await cargarFiltrosDibujos();
        opcionesFiltros(filtrosdib[0], cultura);
        opcionesFiltros(filtrosdib[1], siglo);
        opcionesFiltros(filtrosdib[2], tipoTrabajo);
    }
    else if (selectedValue === "26") {
        const filtrospin = await cargarFiltrosPinturas();
        opcionesFiltros(filtrospin[0], cultura);
        opcionesFiltros(filtrospin[1], siglo);
        opcionesFiltros(filtrospin[2], tipoTrabajo);
    }
});

$(document).ready(function() {
    let debounceTimer;

    $('#search-input').on('input', function() {
        const searchString = $(this).val();

        // Limpiar el temporizador anterior 
        clearTimeout(debounceTimer);

        // Crear un nuevo temporizador
        debounceTimer = setTimeout(function() {
            updateApiUri({ q: searchString, page: '' });
            generarContenedor('card-template', '#card-container');
        }, 1000);
    });

    $('#filtro-Clasificacion').on('change', function () {
        const value = $(this).val();
        updateApiUri({ q: '', page: '', classification: value, culture: '', century: '',  worktype:'' });
        generarContenedor('card-template', '#card-container');
    });

    $('#filtro-Cultura').on('change', function () {
        const value = $(this).val();
        updateApiUri({ culture: value, page: '' });
        generarContenedor('card-template', '#card-container');
    });
    
    $('#filtro-Siglo').on('change', function () {
        const value = $(this).val();
        updateApiUri({ century: value, page: '' });
        generarContenedor('card-template', '#card-container');
    });
    
    $('#filtro-Tipo-Trabajo').on('change', function () {
        const value = $(this).val();
        updateApiUri({ worktype: value, page: '' });
        generarContenedor('card-template', '#card-container');
    });
});



