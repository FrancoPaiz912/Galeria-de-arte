import {generarContenedor, updateApiUri} from '../controllers/principal.js';
import {notificacion } from '../views/contenidoDinamico.js';

window.resetForm = resetForm;

// Función para obtener el parámetro de la URL
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

$(document).ready(function() {

});

// Cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID de la URL
    const id = getParameterByName('id');
    updateApiUri({id:id});
    generarContenedor("resultado-compartido-template", "#resultado-compartido");

});

document.getElementById('encuesta').addEventListener('submit', function(event) {
    event.preventDefault();

    if (!validarFormulario()) {
        return; // Si la validación falla, no se envía el mailto
    }

    var sender = document.getElementById('emailEmisor').value;
    var recipient = document.getElementById('emailReceptor').value;
    var commentary = document.getElementById('comentario').value;
    var artist = document.getElementById('modal-artist').textContent || "No artist";
    var title = document.getElementById('modal-title').textContent || "Untitled";
    var link = "http://127.0.0.1:5501/views/Index.html?id="+getParameterByName('id');  // Esto podría ser dinámico

    // Crear el cuerpo y el enlace mailto
    var body = createBody(sender, commentary, artist, title, link);
    var mailtoLink = createMailtoLink(recipient, "Mira como esta esa obra papá: " + title, body);
    notificacion ("Abriendo gestor de correo");

    // Abrir el enlace mailto
    window.location.href = mailtoLink;
});


function resetForm() {
    document.getElementById('encuesta').reset();

    resetStyles();
}

// Function to create mailto link
function createMailtoLink(to, subject, body) {

    var encodedSubject = encodeURIComponent(subject);
    var encodedBody = encodeURIComponent(body);

    var mailtoLink = "mailto:" + to + "?subject=" + encodedSubject + "&body=" + encodedBody;

    return mailtoLink;
}


function createBody(sender, commentary, artist, title, link) {
    // Enviar comentario
    if (!commentary || commentary.trim() === "") {
        commentary = "Hola, mira esta obra. En este sitio se pueden comprar impresiones de alta calidad en varios tamaños.";
    }

    // Texto del cuerpo
    var body = `Enviado por: ${sender}\n\n${commentary}\n\nArtista: ${artist}\nObra: ${title}\nEnlace: ${link}`;

    return body;
}

function resetStyles() {
    var emailEmisorLabel = document.querySelector('label[for="emailEmisor"]');
    var emailReceptorLabel = document.querySelector('label[for="emailReceptor"]');

    emailEmisorLabel.style.color = "";
    emailReceptorLabel.style.color = "";
}

function validarFormulario() {
    
    var emailEmisorInput = document.getElementById("emailEmisor");
    var emailReceptorInput = document.getElementById("emailReceptor");
    var comentarioInput = document.getElementById("comentario");

    var emailEmisorLabel = document.querySelector('label[for="emailEmisor"]');
    var emailReceptorLabel = document.querySelector('label[for="emailReceptor"]');

    // Expresión regular para el formato de correo
    var regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Restablecer estilos antes de validar
    resetStyles();

    // Variable para almacenar el primer campo con error
    var primerCampoConError = null;
    var mensajeError = '';

    // Validar Email emisor
    if (!emailEmisorInput.value.trim()) {
        emailEmisorLabel.style.color = "red";
        if (!primerCampoConError) {
            primerCampoConError = emailEmisorInput;
            mensajeError = "El campo Email emisor es obligatorio.";
        }
    } else if (!regexEmail.test(emailEmisorInput.value.trim())) {
        emailEmisorLabel.style.color = "red";
        if (!primerCampoConError) {
            primerCampoConError = emailEmisorInput;
            mensajeError = "El formato del Email emisor es inválido.";
        }
    }

    // Validar Email receptor
    if (!emailReceptorInput.value.trim()) {
        emailReceptorLabel.style.color = "red";
        if (!primerCampoConError) {
            primerCampoConError = emailReceptorInput;
            if (!mensajeError) mensajeError = "El campo Email receptor es obligatorio.";
        }
    } else if (!regexEmail.test(emailReceptorInput.value.trim())) {
        emailReceptorLabel.style.color = "red";
        if (!primerCampoConError) {
            primerCampoConError = emailReceptorInput;
            if (!mensajeError) mensajeError = "El formato del Email receptor es inválido.";
        }
    }

    // Si hay un campo con error, centrar el foco y mostrar mensaje
    if (primerCampoConError) {
        primerCampoConError.focus();
        return false; // Evita el envío del mailto
    }

    return true; // Si no hay errores, permite continuar
}