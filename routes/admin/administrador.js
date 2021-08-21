var express = require('express');
var router = express.Router();
var administradorModel = require('./../../models/administradorModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;
var uploader = util.promisify(cloudinary.uploader.upload);
var destroy = util.promisify(cloudinary.uploader.destroy)

//GET listar pedidos de la agenda + busqueda
router.get('/', async function (req, res, next) {

  //var agenda = await administradorModel.getAgenda();

  var agenda
  if (req.query.q === undefined) {
    agenda = await administradorModel.getAgenda();
  } else {
    agenda = await administradorModel.buscarPedidos(req.query.q);
  }

  agenda = agenda.map(pedido => {
    if (pedido.img_id) {
      const imagen = cloudinary.image(pedido.img_id, {
        width: 100,
        height: 100,
        crop: 'fill'
      });
      return {
        ...pedido,
        imagen
      }
    } else {
      return {
        ...pedido,
        imagen: ''
      }
    }
  });

  res.render('admin/administrador', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    agenda,
    is_search: req.query.q !== undefined,
    q: req.query.q
  });
});

//Para eliminar un pedido por ID
router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;
  let pedido = await administradorModel.getPedidoById(id);
  if (pedido.img_id) {
    await (destroy(pedido.img_id));
  }
  await administradorModel.deletePedidoById(id);
  res.redirect('/admin/administrador')
});

//Para ir a crear un pedido nuevo en la agenda
router.get('/agregar', (req, res, next) => {
  res.render('admin/agregar', {
    layout: 'admin/layout'
  });
});

router.post('/agregar', async (req, res, next) => {
  try {
    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }

    if (req.body.cliente != "" && req.body.producto != "" && req.body.pediryentregar != "") {
      await administradorModel.insertPedido({
        ...req.body,
        img_id
      })
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

//Trae una novedad para modificarla
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
    let img_id = req.body.img_original;
    let borrar_img_vieja = false;
    if (req.body.img_delete === "1") {
      img_id = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true
      }
    }

    if (borrar_img_vieja && req.body.img_original) {
      await (destroy(req.body.img_original));
    }

    var obj = {
      cliente: req.body.cliente,
      producto: req.body.producto,
      pediryentregar: req.body.pediryentregar,
      img_id
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