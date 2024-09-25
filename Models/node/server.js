const express = require('express');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000; 
const apiKey = process.env.API_KEY;
const cors = require('cors');
app.use(cors());

let page = 1;
let pages = 0;

const sigloDib = new Set();
const culturaDib = new Set();
const tipoTrabajoDib = new Set();

const sigloPin = new Set();
const culturaPin = new Set();
const tipoTrabajoPin = new Set();

app.get('/api/init', async (req, res) => {
    const result = await init();
    res.json(result);
});

app.get('/api/sigloDib', async (req, res) => {
    fs.readFile('../datos/sigloDib.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error leyendo el archivo JSON' });
        }
        res.json(JSON.parse(data));
    });
});

app.get('/api/sigloPin', async (req, res) => {
    fs.readFile('../datos/sigloPin.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error leyendo el archivo JSON' });
        }
        return res.json(JSON.parse(data));
    });
});

app.get('/api/culturaDib', async (req, res) => {
    fs.readFile('../datos/culturaDib.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error leyendo el archivo JSON' });
        }
        return res.json(JSON.parse(data));
    });
});

app.get('/api/culturaPin', async (req, res) => {
    fs.readFile('../datos/culturaPin.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error leyendo el archivo JSON' });
        }
        return res.json(JSON.parse(data));
    });
});

app.get('/api/tipoTrabajoDib', async (req, res) => {
    fs.readFile('../datos/tipoTrabajoDib.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error leyendo el archivo JSON' });
        }
        return res.json(JSON.parse(data));
    });
});

app.get('/api/tipoTrabajoPin', async (req, res) => {
    fs.readFile('../datos/tipoTrabajoPin.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error leyendo el archivo JSON' });
        }
        return res.json(JSON.parse(data));
    });
});

async function init() {
    do {
        await axios.get(`https://api.harvardartmuseums.org/object?apikey=5003baa9-f734-4f2e-8651-9adae8ce6b0b&classification=21&size=100&page=${page}`)
            .then(response => {
                const data = response.data;
                console.log('página:' + page);
                page++;
                pages = data.info.pages;
                console.log('paginas totales:' + pages);
                data.records.forEach(element => {
                    if(element.primaryimageurl !== undefined && element.primaryimageurl !== null){
                        sigloDib.add(element.century);
                        culturaDib.add(element.culture);
                        element.worktypes.forEach(elements => {
                            tipoTrabajoDib.add(elements.worktype);
                        });
                    }
                });
            })
            .catch(() => {
                console.error('Error fetching data from API');
            });
    } while (page < pages);

    page = 1;

    do {
        await axios.get(`https://api.harvardartmuseums.org/object?apikey=5003baa9-f734-4f2e-8651-9adae8ce6b0b&classification=26&size=100&page=${page}`)
            .then(response => {
                const data = response.data;
                console.log('página:' + page);
                page++;
                pages = data.info.pages;
                console.log('paginas totales:' + pages);
                data.records.forEach(element => {
                    if(element.primaryimageurl !== undefined && element.primaryimageurl !== null){
                        sigloPin.add(element.century);
                        culturaPin.add(element.culture);
                        element.worktypes.forEach(elements => {
                            tipoTrabajoPin.add(elements.worktype);
                        });
                    }
                });
            })
            .catch(() => {
                console.error('Error fetching data from API');
            });
    } while (page <= pages);

    sigloDib.delete(null);
    sigloPin.delete(null);
    culturaDib.delete(null);
    culturaPin.delete(null);
    tipoTrabajoDib.delete(null);
    tipoTrabajoPin.delete(null);
    culturaDib.forEach(item => item.endsWith('?') && culturaDib.delete(item));
    culturaPin.forEach(item => item.endsWith('?') && culturaPin.delete(item));

    fs.writeFile('../datos/sigloDib.json', JSON.stringify([...sigloDib].sort(), null, 2), err => {
        if (err) console.error('Error writing sigloDib.json', err);
    });
    fs.writeFile('../datos/sigloPin.json', JSON.stringify([...sigloPin].sort(), null, 2), err => {
        if (err) console.error('Error writing sigloPin.json', err);
    });
    fs.writeFile('../datos/culturaDib.json', JSON.stringify([...culturaDib].sort(), null, 2), err => {
        if (err) console.error('Error writing culturaDib.json', err);
    });
    fs.writeFile('../datos/culturaPin.json', JSON.stringify([...culturaPin].sort(), null, 2), err => {
        if (err) console.error('Error writing culturaPin.json', err);
    });
    fs.writeFile('../datos/tipoTrabajoDib.json', JSON.stringify([...tipoTrabajoDib].sort(), null, 2), err => {
        if (err) console.error('Error writing tipoTrabajoDib.json', err);
    });
    fs.writeFile('../datos/tipoTrabajoPin.json', JSON.stringify([...tipoTrabajoPin].sort(), null, 2), err => {
        if (err) console.error('Error writing tipoTrabajoPin.json', err);
    });
}

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});