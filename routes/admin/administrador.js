var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuariosModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/administrador', {
      layout:'admin/layout',
      usuario: req.session.nombre
  });
});

module.exports = router;