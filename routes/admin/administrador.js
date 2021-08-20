var express = require('express');
var router = express.Router();
var administradorModel = require('./../../models/administradorModel');

/* GET listar pedidos de la agenda. */
router.get('/', async function (req, res, next) {

  var agenda = await administradorModel.getAgenda();

  res.render('admin/administrador', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    agenda
  });
});

/*Para eliminar un pedido por ID*/
router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;
  await administradorModel.deletePedidoById(id);
  res.redirect('/admin/administrador')
});

/*Para ir a crear un pedido nuevo en la agenda*/
router.get('/agregar', (req, res, next) => {
  res.render('admin/agregar', {
    layout: 'admin/layout'
  });
});

router.post('/agregar', async (req, res, next) => {
  try {
    if (req.body.cliente != "" && req.body.producto != "" && req.body.pediryentregar != "") {
      await administradorModel.insertPedido(req.body);
      res.redirect('/admin/administrador')
    } else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'Todos los campos son requeridos'
      });
    }
  } catch (e) {
    console.log(e)
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se pudo cargar el pedido'
    });
  }
});

/*Trae una novedad para modificarla*/
router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;
  var pedido = await administradorModel.getPedidoById(id);
  res.render('admin/modificar', {
    layout: 'admin/layout',
    pedido
  });
});

//aca lo modifica
router.post('/modificar', async (req, res, next) => {
  try {
    var obj = {
      cliente: req.body.cliente,
      producto: req.body.producto,
      pediryentregar: req.body.pediryentregar
    }

    console.log(obj)
    await administradorModel.modificarPedidoById(obj, req.body.id);
    res.redirect('/admin/administrador');
  } catch (e) {
    console.log(e)
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true,
      message: "No se pudo modificar el pedido"
    });
  }
});


module.exports = router;