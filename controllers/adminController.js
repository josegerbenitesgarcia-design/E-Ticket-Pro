const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id_usuario, nombre, apellido, correo, rol, telefono, fecha_registro FROM usuarios WHERE rol != 'Administrador'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const [userCheck] = await db.query("SELECT rol FROM usuarios WHERE id_usuario = ?", [id]);

        if (userCheck.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

        const rol = userCheck[0].rol;
        let data = [];

        if (rol === 'Cliente') {
            const query = `
                SELECT t.id_ticket, t.codigo_qr, t.estado, e.nombre_evento, z.nombre_zona, z.precio
                FROM tickets t
                JOIN zonas_evento z ON t.id_zona = z.id_zona
                JOIN eventos e ON z.id_evento = e.id_evento
                WHERE t.id_usuario = ?
            `;
            const [tickets] = await db.query(query, [id]);
            data = { tipo: 'Cliente', items: tickets };

        } else if (rol === 'Organizador') {
            const query = `
                SELECT id_evento, nombre_evento, fecha_evento, lugar, estado
                FROM eventos
                WHERE id_organizador = ?
            `;
            const [eventos] = await db.query(query, [id]);
            data = { tipo: 'Organizador', items: eventos };
        }

        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener detalles" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query("DELETE FROM tickets WHERE id_usuario = ?", [id]);

        await db.query("DELETE FROM transacciones WHERE id_usuario = ?", [id]);

        await db.query(`
            DELETE FROM zonas_evento 
            WHERE id_evento IN (SELECT id_evento FROM eventos WHERE id_organizador = ?)
        `, [id]);
        await db.query("DELETE FROM eventos WHERE id_organizador = ?", [id]);

        await db.query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);

        res.json({ message: "Usuario y todos sus datos eliminados." });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error al eliminar. Puede tener datos relacionados complejos." });
    }
};

exports.getAllEventsAdmin = async (req, res) => {
    try {
        const query = `
            SELECT e.id_evento, e.nombre_evento, e.fecha_evento, e.estado, 
                   CONCAT(u.nombre, ' ', u.apellido) as organizador
            FROM eventos e
            JOIN usuarios u ON e.id_organizador = u.id_usuario
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al cargar eventos" });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { nombre, apellido, correo, contrasena, telefono, rol } = req.body;

        if (!nombre || !correo || !contrasena || !rol) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const query = `
            INSERT INTO usuarios (nombre, apellido, correo, contrasena, telefono, rol)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [nombre, apellido, correo, contrasena, telefono, rol]);

        res.json({ message: "Usuario creado exitosamente" });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: "El correo ya está registrado." });
        } else {
            res.status(500).json({ message: "Error del servidor al crear usuario." });
        }
    }
};

exports.getAllSales = async (req, res) => {
    try {
        const query = `
            SELECT 
                t.id_ticket,
                CONCAT(u.nombre, ' ', u.apellido) as comprador,
                u.correo,
                e.nombre_evento,
                z.nombre_zona,
                z.precio,
                t.fecha_compra,
                t.estado
            FROM tickets t
            JOIN usuarios u ON t.id_usuario = u.id_usuario
            JOIN zonas_evento z ON t.id_zona = z.id_zona
            JOIN eventos e ON z.id_evento = e.id_evento
            ORDER BY t.fecha_compra DESC
        `;

        const [rows] = await db.query(query);
        res.json(rows);

    } catch (error) {
        console.error("Error reporte ventas:", error);
        res.status(500).json({ message: "Error al generar reporte de ventas" });
    }
};