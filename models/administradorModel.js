var pool = require('./bd');

/*listar agenda*/
async function getAgenda() {
    var query = 'select * from agenda';
    var rows = await pool.query(query);
    return rows;
}

/*borra un pedido de la tabla por ID*/
async function deletePedidoById(id) {
    var query = 'delete from agenda where id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

/*Agrega un pedido en la tabla*/

async function insertPedido(obj) {
    try {
        var query = "insert into agenda set ?"
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (e) {
        console.log(e);
        throw error;
    }
}

/*Modifica un pedido de la tabla por ID*/
async function getPedidoById(id) {
    var query = 'select * from agenda where id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}
async function modificarPedidoById(obj, id) {
    try {
        var query = "update agenda set ? where id = ?";
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (e) {
        throw error;
    }
}

//Buscador
async function buscarPedidos(busqueda) {
    var query = "select * from agenda where cliente like ? OR producto like ? OR pediryentregar like ?";
    var rows = await pool.query(query, ['%' + busqueda + '%', '%' + busqueda + '%', '%' + busqueda + '%']);

    return rows;
}


module.exports = { getAgenda, deletePedidoById, insertPedido, getPedidoById, modificarPedidoById, buscarPedidos }