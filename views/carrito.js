import { getListId } from '../controllers/carrito.js';
import { generarContenedor } from '../controllers/principal.js';

$(document).ready(async function () {
    let arrayIds = [];

    let objetosGuardados = JSON.parse(localStorage.getItem('carrito')) || [];

    objetosGuardados.forEach(objeto => {
        arrayIds.push(objeto.id);
    });
    let ids = arrayIds.join('|');
    await getListId(ids);
    await generarContenedor('carrito-card-template', '#card-container', async function (mappedData) {
        let objetosGuardados = JSON.parse(localStorage.getItem('carrito')) || [];
        let objetosMappeados = [];

        objetosGuardados.forEach(objeto => {
            let objetoOriginal = mappedData.find(obj => obj.id === objeto.id);

            if (objetoOriginal) {
                let copiaDelObjeto = JSON.parse(JSON.stringify(objetoOriginal));
                copiaDelObjeto.tamaño = objeto.dimension;
                copiaDelObjeto.cantidad = objeto.cantidad;
                copiaDelObjeto.precio = objeto.precio;
                copiaDelObjeto.precioXcantidad = (parseFloat(objeto.precio.replace('$', '')) * objeto.cantidad).toFixed(2)
                objetosMappeados.push(copiaDelObjeto);
            }
        });
        return objetosMappeados;
    });
    calculoPrecio(objetosGuardados);

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

function calculoPrecio(objetosGuardados) {
    let precioTotal = 0;

    objetosGuardados.forEach(objeto => {
        let precio = parseFloat(objeto.precio.replace('$', ''));
        let subtotal = precio * objeto.cantidad;
        precioTotal += subtotal;
    });
    $('#precio-final').text('$' + precioTotal);
}

$(document).on('click', '.botonMas', function (e) {
    e.stopPropagation(); // Evita que el clic se propague al contenedor-tarjeta
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
    e.stopPropagation(); // Evita que el clic se propague al contenedor-tarjeta
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


