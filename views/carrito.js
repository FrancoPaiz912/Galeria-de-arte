import { cargarObras } from '../views/contenidoDinamico.js';

$(document).ready(async function () {
    const modalElement = $('#contenedor-modal').data('size');

    if (modalElement === 'carrito-modal-card-template') {
        await cargarObras('carrito-card-template', '#card-container', 'carrito');
    }
});

export function notificacion(message) {
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
    }, 6000);
}

export function calculoPrecio(objetosGuardados) {
    let precioTotal = 0;

    objetosGuardados.forEach(objeto => {
        let precio = parseFloat(objeto.precio.replace('$', ''));
        let subtotal = precio * objeto.cantidad;
        precioTotal += subtotal;
    });
    $('#precio-final').text('$' + precioTotal);
}

$(document).on('click', '.botonMas', function (e) {
    e.stopPropagation(); //Evita que el evento se propague por todos los padres que tiene(tiene como 5 weh)
    const boton = $(this);
    const tarjeta = boton.closest('.contenedor-tarjeta'); 
    const id = tarjeta.data('id');
    const dimension = tarjeta.find('.tamano').text();
    let objetosGuardados = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const objeto = objetosGuardados.find(obra => obra.id === id && obra.dimension === dimension);
    if (objeto) {
        objeto.cantidad += 1;
        localStorage.setItem('carrito', JSON.stringify(objetosGuardados));
        tarjeta.find('.cantidad').text(`Cantidad: ${objeto.cantidad}`);
        let precio = parseFloat(objeto.precio.replace('$', ''));
        let subtotal = precio * objeto.cantidad;
        tarjeta.find('.precio').text(subtotal.toFixed(2));
    }
    calculoPrecio(objetosGuardados);
});

$(document).on('click', '.botonMenos', function (e) {
    e.stopPropagation(); 
    const boton = $(this);
    const tarjeta = boton.closest('.contenedor-tarjeta'); 
    const id = tarjeta.data('id');
    const dimension = tarjeta.find('.tamano').text();
    let objetosGuardados = JSON.parse(localStorage.getItem('carrito')) || [];

    const objeto = objetosGuardados.find(obra => obra.id === id && obra.dimension === dimension);
    if (objeto) {
        objeto.cantidad -= 1;
        if (objeto.cantidad === 0) {
            objetosGuardados = objetosGuardados.filter(obra => !(obra.id === id && obra.dimension === dimension));
            tarjeta.remove();
        }
        tarjeta.find('.cantidad').text(`Cantidad: ${objeto.cantidad}`);
        let precio = parseFloat(objeto.precio.replace('$', ''));
        let subtotal = precio * objeto.cantidad;
        tarjeta.find('.precio').text(subtotal.toFixed(2));
        localStorage.setItem('carrito', JSON.stringify(objetosGuardados));
    }
    calculoPrecio(objetosGuardados);
});


