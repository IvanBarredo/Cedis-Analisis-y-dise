// server.js
// Serializar BigInt a String automáticamente
BigInt.prototype.toJSON = function() {
    return this.toString();
};
const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Immaisma',
    port: 3305,
    database: 'tienda',
    connectionLimit: 5
});

// Ruta para guardar los pedidos
app.post('/api/orders', async (req, res) => {
    let conn;
    try {
        const { customer, paymentMethod, items, total, notes } = req.body;
        
        conn = await pool.getConnection();
        
        // Insertar el pedido en la base de datos con estado por defecto 'pending'
        const defaultStatus = 'pending';
        const result = await conn.query(
            "INSERT INTO pedidos (Nombre, Correo, Telefono, Direccion, Metodo_pago, notas, total, Estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [customer.name, customer.email, customer.phone, customer.address, paymentMethod, notes, total, defaultStatus]
        );
        
        res.status(201).json({
            success: true,
            orderId: result.insertId,
            message: "Pedido guardado correctamente"
        });
    } catch (err) {
        console.error("Error al guardar el pedido:", err);
        res.status(500).json({
            success: false,
            message: "Error al guardar el pedido"
        });
    } finally {
        if (conn) conn.end();
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
// Obtener todos los pedidos
app.get('/api/pedidos', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        
        const pedidos = await conn.query(`
            SELECT * FROM pedidos 
            ORDER BY fecha DESC
        `);
        
        console.log("Pedidos obtenidos:", pedidos);
        
        // Formatear los datos para el frontend
        const formattedOrders = pedidos.map(pedido => ({
            id: pedido.id,
            date: pedido.fecha,
            customer: {
                name: pedido.Nombre,
                email: pedido.Correo,
                phone: pedido.Telefono,
                address: pedido.Direccion
            },
            items: [], // No hay información de items en tu tabla actual
            total: pedido.total,
            status: pedido.Estado,
            paymentMethod: pedido.Metodo_pago,
            notes: pedido.notas,
            statusHistory: [] // No hay historial en tu tabla actual
        }));
        
        res.json(formattedOrders);
    } catch (err) {
        console.error("Error al obtener pedidos:", err);
        res.status(500).json({ 
            success: false, 
            message: "Error al obtener pedidos" 
        });
    } finally {
        if (conn) conn.end();
    }
});

// Actualizar estado de un pedido
app.put('/api/pedidos/:id/estado', async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        conn = await pool.getConnection();
        
        await conn.query(`
            UPDATE pedidos 
            SET Estado = ? 
            WHERE id = ?
        `, [estado, id]);
        
        res.json({ 
            success: true,
            message: "Estado actualizado correctamente"
        });
    } catch (err) {
        console.error("Error al actualizar estado:", err);
        res.status(500).json({ 
            success: false, 
            message: "Error al actualizar estado" 
        });
    } finally {
        if (conn) conn.end();
    }
});
