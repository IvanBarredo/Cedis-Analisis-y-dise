const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: '127.0.0.1', 
     user:'root', 
     password: 'Immaisma',
     port: 3305,
     database: 'tienda',
     connectionLimit: 5
});
async function asyncFunction() {
  let conn;
  try {
	conn = await pool.getConnection();
	const rows = await conn.query("SELECT * from pedidos");
	console.log(rows); //[ {val: 1}, meta: ... ]
	// Forma correcta de INSERT con parámetros posicionales
	const res = await conn.query("INSERT INTO pedidos (id, fecha, estado) VALUES (?, ?, ?)", [5, '2024-04-04', "enviado"]);
	console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

  } catch (err) {
	throw err;
  } finally {
	if (conn) conn.end();
  }
}
module.exports = pool;
