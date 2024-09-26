const jsonFilesDib = [
    '/Models/datos/culturaDib.json',
    '/Models/datos/sigloDib.json',
    '/Models/datos/tipoTrabajoDib.json'
];

const jsonFilesPin = [
    '/Models/datos/culturaPin.json',
    '/Models/datos/sigloPin.json',
    '/Models/datos/tipoTrabajoPin.json'
]

export async function cargarFiltrosPinturas() {
    const promises = jsonFilesPin.map(file => {
        return new Promise((resolve, reject) => {
            $.getJSON(file, function(data) {
                $('#json-data').append('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
                resolve(data);
            }).fail(function() {
                console.error('Error al cargar el archivo JSON: ' + file);
                $('#json-data').append('<p>Error al cargar ' + file + '</p>');
                reject('Error al cargar ' + file);
            });
        });
    });

    return Promise.all(promises);
}



// Recorrer cada archivo JSON
export async function cargarFiltrosDibujos() {
    const promises = jsonFilesDib.map(file => {
        return new Promise((resolve, reject) => {
            $.getJSON(file, function(data) {
                $('#json-data').append('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
                resolve(data);
            }).fail(function() {
                console.error('Error al cargar el archivo JSON: ' + file);
                $('#json-data').append('<p>Error al cargar ' + file + '</p>');
                reject('Error al cargar ' + file);
            });
        });
    });

    return Promise.all(promises);
}

$.getJSON('/Models/datos/culturaDib.json', function(data) {
    $('#json-data').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
}).fail(function() {
    console.error('Error al cargar el archivo JSON');
    $('#json-data').text('Error al cargar el archivo JSON');
});

$.getJSON('/Models/datos/sigloPin.json', function(data) {
    $('#json-data').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
}).fail(function() {
    console.error('Error al cargar el archivo JSON');
    $('#json-data').text('Error al cargar el archivo JSON');
});

$.getJSON('/Models/datos/culturaDib.json', function(data) {
    $('#json-data').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
}).fail(function() {
    console.error('Error al cargar el archivo JSON');
    $('#json-data').text('Error al cargar el archivo JSON');
});

$.getJSON('/Models/datos/culturaPin.json', function(data) {
    $('#json-data').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
}).fail(function() {
    console.error('Error al cargar el archivo JSON');
    $('#json-data').text('Error al cargar el archivo JSON');
});

$.getJSON('/Models/datos/tipoTrabajoDib.json', function(data) {
    $('#json-data').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
}).fail(function() {
    console.error('Error al cargar el archivo JSON');
    $('#json-data').text('Error al cargar el archivo JSON');
});

$.getJSON('/Models/datos/tipoTrabajoPin.json', function(data) {
    $('#json-data').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
}).fail(function() {
    console.error('Error al cargar el archivo JSON');
    $('#json-data').text('Error al cargar el archivo JSON');
});

export default {
    cargarFiltrosDibujos,
    cargarFiltrosPinturas,
}
