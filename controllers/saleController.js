const db = require('../config/db');

exports.procesarCompra = async (req, res) => {
    try {
        const { id_usuario, id_evento, metodo_pago } = req.body;

        const [zonas] = await db.query('SELECT * FROM zonas_evento WHERE id_evento = ? LIMIT 1', [id_evento]);

        if (zonas.length === 0) {
            return res.status(404).json({ message: "Error: Este evento no tiene entradas configuradas." });
        }

        const zona = zonas[0];

        if (zona.disponibles <= 0) {
            return res.status(400).json({ message: "¡Lo sentimos! Las entradas están agotadas." });
        }

        await db.query(
            'INSERT INTO transacciones (id_usuario, monto_total, metodo_pago, estado_pago) VALUES (?, ?, ?, ?)',
            [id_usuario, zona.precio, metodo_pago, 'Completado']
        );

        const codigoQrData = `TICKET-${id_usuario}-${Date.now()}`;

        await db.query(
            'INSERT INTO tickets (id_usuario, id_zona, codigo_qr, estado) VALUES (?, ?, ?, ?)',
            [id_usuario, zona.id_zona, codigoQrData, 'Valido']
        );

        await db.query(
            'UPDATE zonas_evento SET disponibles = disponibles - 1 WHERE id_zona = ?',
            [zona.id_zona]
        );

        res.json({ message: "¡Compra realizada con éxito! Revisa la sección 'Mis Tickets'." });

    } catch (error) {
        console.error("Error en compra:", error);
        res.status(500).json({ message: "Error al procesar la compra en el servidor." });
    }
};

exports.getUserTickets = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                t.id_ticket, 
                t.codigo_qr, 
                t.estado, 
                t.fecha_compra,
                e.nombre_evento, 
                e.fecha_evento, 
                e.hora_evento, 
                e.lugar, 
                e.imagen_url,
                z.nombre_zona, 
                z.precio
            FROM tickets t
            JOIN zonas_evento z ON t.id_zona = z.id_zona
            JOIN eventos e ON z.id_evento = e.id_evento
            WHERE t.id_usuario = ?
            ORDER BY t.fecha_compra DESC
        `;

        const [rows] = await db.query(query, [id]);
        res.json(rows);

    } catch (error) {
        console.error("Error obteniendo tickets:", error);
        res.status(500).json({ message: "Error al cargar tus compras" });
    }
};