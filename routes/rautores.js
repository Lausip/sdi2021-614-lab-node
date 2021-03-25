module.exports = function(app, swig) {
    app.get("/autores", function(req, res) {
        var autores = [ {
            "nombre" : "Jamie Cook",
            "grupo"  : "Artic Monkeys",
            "rol"    : "guitarrista"
        }, {
            "nombre" : "Ringo Starr",
            "grupo"  : "The Beatles",
            "rol"    : "bateria"
        }, {
            "nombre" : "Jin",
            "grupo"  : "BTS",
            "rol"    : "cantante"

        } ];
        var respuesta = swig.renderFile('views/autores.html', {
            vendedor : 'Lista de Autores',
            autores : autores
        });
        res.send(respuesta);
    });
    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {

        });
        res.send(respuesta);
    })

    app.post("/autor", function(req, res) {
          let error = " no enviado en la petición." + "<br>";
          let respuesta = "";

          if(typeof(req.body.nombre) === "undefined" || req.body.nombre === null || req.body.nombre === "")
              respuesta += "Nombre del autor" + error;
          else
              respuesta += "Autor : " + req.body.nombre + "<br>";

          if(req.body.grupo === null || req.body.grupo === "" || typeof(req.body.grupo) === "undefined" )
              respuesta += "Grupo" + error;
          else
              respuesta += "Grupo: " + req.body.grupo + "<br>";

          if(req.body.rol === null || req.body.rol === "" || typeof(req.body.rol) == "undefined")
              respuesta += "Rol" + error;
          else
              respuesta += "Rol: " + req.body.rol;

          res.send(respuesta);
    });

    app.get('/autores/*', function (req, res) {
          res.redirect("/autores");
    })

};