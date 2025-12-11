const db = require('../config/db');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send('<script>alert("Por favor ingrese correo y contraseña"); window.history.back();</script>');
        }

        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [email]);

        if (rows.length === 0) {
            return res.send('<script>alert("El correo no está registrado."); window.history.back();</script>');
        }

        const user = rows[0];

        if (password !== user.contrasena) {
            return res.send('<script>alert("Contraseña incorrecta"); window.history.back();</script>');
        }

        let redirectUrl = '/';
        if (user.rol === 'Administrador') redirectUrl = '/admin';
        if (user.rol === 'Organizador') redirectUrl = '/organizer';

        res.send(`
            <script>
                localStorage.setItem('userId', '${user.id_usuario}');
                localStorage.setItem('userRole', '${user.rol}');
                localStorage.setItem('userName', '${user.nombre}');
                window.location.href = '${redirectUrl}';
            </script>
        `);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error en el servidor");
    }
};

exports.register = async (req, res) => {
    try {
        const { nombre, apellido, email, password, telefono, rol } = req.body;

        if (!nombre || !apellido || !email || !password || !rol || !telefono) {
            return res.send('<script>alert("Todos los campos son obligatorios."); window.history.back();</script>');
        }

        const telefonoRegex = /^[0-9]{9}$/;
        if (!telefonoRegex.test(telefono)) {
            return res.send('<script>alert("El teléfono debe contener exactamente 9 números."); window.history.back();</script>');
        }

        const [usuarioDuplicado] = await db.query(
            'SELECT id_usuario FROM usuarios WHERE nombre = ? AND apellido = ?',
            [nombre, apellido]
        );

        if (usuarioDuplicado.length > 0) {
            return res.send(`
                <script>
                    alert("Error: El usuario '${nombre} ${apellido}' ya está registrado en el sistema."); 
                    window.history.back();
                </script>
            `);
        }

        await db.query(
            'INSERT INTO usuarios (nombre, apellido, correo, contrasena, telefono, rol) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, apellido, email, password, telefono, rol]
        );

        res.send(`
            <script>
                alert("¡Registro exitoso! Bienvenido a E-Ticket Pro."); 
                window.location.href = "/login";
            </script>
        `);

    } catch (error) {
        console.error("Error en registro:", error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.send(`
                <script>
                    alert("Error: El correo electrónico ${req.body.email} ya está registrado."); 
                    window.history.back();
                </script>
            `);
        }

        res.send('<script>alert("Ocurrió un error en el servidor."); window.history.back();</script>');
    }
};