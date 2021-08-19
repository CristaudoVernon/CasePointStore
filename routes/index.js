var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.post('/', async(req,res,next) => {
  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var telefono = req.body.tel;
  var comentario = req.body.comentario;
  console.log(req.body);
  
  var obj = {
    to: '70351db7c2-989af5@inbox.mailtrap.io',
    subject: 'CONTACTO WEB',
    html: nombre + ' ' + apellido + ' se contacto a través de la web quiere más informacion a este correo: ' + email + '. <br> Además, hizo el siguiente comentario: ' + comentario + '. <br> Su tel es: ' + telefono
  }

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  var info = await transport.sendMail(obj);

  res.redirect('/');
  
}); //cierra peticion del POST

module.exports = router;
