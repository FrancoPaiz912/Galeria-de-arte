export async function cargarFiltrosDibujos() { //Model
    try {
        const [sigloDib, culturaDib, tipoTrabajoDib] = await Promise.all([
            fetch('http://localhost:3000/api/sigloDib').then(res => res.json()),
            fetch('http://localhost:3000/api/culturaDib').then(res => res.json()),
            fetch('http://localhost:3000/api/tipoTrabajoDib').then(res => res.json())
        ]);
        return {
            siglo: sigloDib,
            cultura: culturaDib,
            tipoTrabajo: tipoTrabajoDib
        };

    } catch (error) {
        console.error('Error al cargar los filtros de dibujos:', error);
        return {
            siglo: [],
            cultura: [],
            tipoTrabajo: []
        };
    }
}

export async function cargarFiltrosPinturas() { //Model
    try {
        const [sigloPin, culturaPin, tipoTrabajoPin] = await Promise.all([
            fetch('http://localhost:3000/api/sigloPin').then(res => res.json()),
            fetch('http://localhost:3000/api/culturaPin').then(res => res.json()),
            fetch('http://localhost:3000/api/tipoTrabajoPin').then(res => res.json())
        ]);

        return {
            siglo: sigloPin,
            cultura: culturaPin,
            tipoTrabajo: tipoTrabajoPin
        };

    } catch (error) {
        console.error('Error al cargar los filtros de dibujos:', error);
        return {
            siglo: [],
            cultura: [],
            tipoTrabajo: []
        };
    }
}

export default {
    cargarFiltrosDibujos,
    cargarFiltrosPinturas,
}
