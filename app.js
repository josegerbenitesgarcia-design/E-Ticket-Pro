const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/my-tickets', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'my-tickets.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/organizer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'organizer.html'));
});

app.use('/auth', require('./routes/authRoutes'));

app.use('/api/events', require('./routes/eventRoutes'));

app.use('/api/admin', require('./routes/adminRoutes'));

app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`------------------------------------------------`);
    console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`------------------------------------------------`);
});