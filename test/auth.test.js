const request = require('supertest');
const app = require('../app');

describe('Pruebas de Integración - Autenticación', () => {
    
    test('GET /login debería devolver status 200', async () => {
        const response = await request(app).get('/login');
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe('text/html');
    });

    test('POST /auth/login sin datos debería devolver alerta', async () => {
        const response = await request(app).post('/auth/login').send({});
        expect(response.text).toContain('<script>'); 
    });

});