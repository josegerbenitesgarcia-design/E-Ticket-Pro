const db = require('../config/db');

exports.getAllEvents = async (req, res) => {
    try {
        const { categoria, busqueda } = req.query;


        let query = `
            SELECT 
                e.id_evento, 
                e.nombre_evento, 
                e.descripcion,
                e.categoria, 
                e.fecha_evento, 
                e.hora_evento, 
                e.lugar, 
                e.imagen_url, 
                MIN(z.precio) as precio_min
            FROM eventos e
            LEFT JOIN zonas_evento z ON e.id_evento = z.id_evento
            WHERE e.estado = 'Activo'
        `;

        const params = [];

        if (categoria && categoria !== 'Todos') {
            query += ` AND e.categoria = ?`;
            params.push(categoria);
        }

        if (busqueda) {
            query += ` AND (e.nombre_evento LIKE ? OR e.lugar LIKE ?)`;
            params.push(`%${busqueda}%`, `%${busqueda}%`);
        }

        query += ` GROUP BY e.id_evento ORDER BY e.fecha_evento ASC`;

        const [rows] = await db.query(query, params);
        res.json(rows);

    } catch (error) {
        console.error("Error cartelera:", error);
        res.status(500).json({ message: "Error al obtener la cartelera" });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT e.*, z.precio, z.capacidad 
            FROM eventos e
            LEFT JOIN zonas_evento z ON e.id_evento = z.id_evento
            WHERE e.id_evento = ?
        `;

        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }
        res.json(rows[0]);

    } catch (error) {
        console.error("Error detalle:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const {
            nombre_evento, categoria, fecha_evento, hora_evento,
            lugar, imagen_url, descripcion, id_organizador,
            precio, capacidad
        } = req.body;

        const queryEvento = `
            INSERT INTO eventos 
            (id_organizador, nombre_evento, descripcion, categoria, fecha_evento, hora_evento, lugar, imagen_url, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Activo')
        `;

        const [resultEvento] = await db.query(queryEvento, [
            id_organizador, nombre_evento, descripcion, categoria,
            fecha_evento, hora_evento, lugar,
            imagen_url || 'https://source.unsplash.com/random/800x600/?event'
        ]);

        const idNuevoEvento = resultEvento.insertId;

        const queryZona = `
            INSERT INTO zonas_evento 
            (id_evento, nombre_zona, precio, capacidad, disponibles)
            VALUES (?, 'General', ?, ?, ?)
        `;

        await db.query(queryZona, [idNuevoEvento, precio, capacidad, capacidad]);

        res.send(`
            <script>
                alert("¡Evento publicado exitosamente!");
                window.location.href = "/organizer";
            </script>
        `);

    } catch (error) {
        console.error("Error crear evento:", error);
        res.send(`
            <script>
                alert("Error al guardar: ${error.message}");
                window.history.back();
            </script>
        `);
    }
};

exports.getEventsByOrganizer = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM eventos WHERE id_organizador = ? ORDER BY fecha_evento DESC', [id]);
        res.json(rows);
    } catch (error) {
        console.error("Error mis eventos:", error);
        res.status(500).json({ message: "Error al cargar tus eventos" });
    }
};


exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre_evento, categoria, fecha_evento, hora_evento,
            lugar, imagen_url, descripcion,
            precio, capacidad
        } = req.body;

        const queryEvento = `
            UPDATE eventos 
            SET nombre_evento = ?, categoria = ?, fecha_evento = ?, hora_evento = ?, lugar = ?, imagen_url = ?, descripcion = ?
            WHERE id_evento = ?
        `;
        await db.query(queryEvento, [nombre_evento, categoria, fecha_evento, hora_evento, lugar, imagen_url, descripcion, id]);
        const queryZona = `
            UPDATE zonas_evento
            SET precio = ?, capacidad = ?
            WHERE id_evento = ?
        `;
        await db.query(queryZona, [precio, capacidad, id]);

        res.json({ message: "Evento actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar:", error);
        res.status(500).json({ message: "Error al actualizar el evento" });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM zonas_evento WHERE id_evento = ?', [id]);
        await db.query('DELETE FROM eventos WHERE id_evento = ?', [id]);
        res.json({ message: "Evento eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).json({ message: "No se pudo eliminar el evento." });
    }
};