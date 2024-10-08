import { cargarObras, notificacion } from '../views/contenidoDinamico.js';

$(document).ready(async function () {
    const modalElement = $('#contenedor-modal').data('size');

    if (modalElement === 'carrito-modal-card-template') {
        await cargarObras('carrito-card-template', '#card-container', 'carrito');
    }
});

export function calculoPrecio(objetosGuardados) {

    let precioTotal = 0;

    objetosGuardados.forEach(objeto => {
        let precio = parseFloat(objeto.precio.replace('$', ''));
        let subtotal = precio * objeto.cantidad;
        precioTotal += subtotal;
    });
    $('#precio-final').text('$' + precioTotal);
}

$("#finalizar-compra").click(function () {
    notificacion("¡Compra Finalizada!");
    localStorage.removeItem("carrito");
    setTimeout(function () {
        location.reload();
    }, 1000);
});

function actualizarCantidad(boton, operacion) {
    const tarjeta = boton.closest('.contenedor-tarjeta');
    const id = tarjeta.data('id');
    const dimension = tarjeta.find('.tamano').text();
    let objetosGuardados = JSON.parse(localStorage.getItem('carrito')) || [];

    const objeto = objetosGuardados.find(obra => obra.id === id && obra.dimension === dimension);
    
    if (objeto) {
        objeto.cantidad += operacion; // operación puede ser 1 o -1
        if (objeto.cantidad === 0) {
            objetosGuardados = objetosGuardados.filter(obra => !(obra.id === id && obra.dimension === dimension));
            tarjeta.remove();
        } else {
            tarjeta.find('.cantidad').text(`Cantidad: ${objeto.cantidad}`);
        }
        localStorage.setItem('carrito', JSON.stringify(objetosGuardados));
    }
    if (objetosGuardados.length === 0) {
        location.reload();
    }
    let precio = parseFloat(objeto.precio.replace('$', ''));
    let subtotal = precio * objeto.cantidad;
    tarjeta.find('.precio').text(subtotal.toFixed(2));
    calculoPrecio(objetosGuardados, tarjeta);
}

$(document).on('click', '.botonMenos', function (e) {
    e.stopPropagation();
    actualizarCantidad($(this), -1);
});

$(document).on('click', '.botonMas', function (e) {
    e.stopPropagation();
    actualizarCantidad($(this), 1);
});

