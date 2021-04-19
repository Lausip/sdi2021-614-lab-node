module.exports = function (app, gestorBD) {

    app.post("/api/autenticar/", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401);
                res.json({
                    autenticado: false
                })
            } else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email, tiempo: Date.now() / 1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token: token
                });
            }
        });
    });
    app.get("/api/cancion", function (req, res) {
        gestorBD.obtenerCanciones({}, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones));
            }
        });
    });
    app.get("/api/cancion/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones[0]));
            }
        });
    });
    app.delete("/api/cancion/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
        let cancion_id = gestorBD.mongo.ObjectID(req.params.id);
        let usuario = res.usuario;
        userAthorOfSong(usuario, cancion_id, function (isAuthor) {
            if (isAuthor) {
                gestorBD.eliminarCancion(criterio, function (canciones) {
                    if (canciones == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.send(JSON.stringify(canciones));
                    }
                });
            } else {
                res.status(400);
                res.json({
                    error: "el usuario debe ser el autor de la canción"
                })
            }
        });
    });
    app.post("/api/cancion", function (req, res) {
        let cancion = {
            nombre: req.body.nombre,
            genero: req.body.genero,
            precio: req.body.precio,
        }
        // Validar nombre
        if (cancion.nombre == null || cancion.nombre.length < 3 || cancion.nombre.length > 15 || typeof cancion.nombre=="undefined") {
            res.status(401);
            res.json({
                error: "nombre de la canción incorrecto"
            });
        }
        // Validar genero
        else if (cancion.genero == null || cancion.genero.length < 3  ||typeof cancion.genero=="undefined") {
            res.status(401);
            res.json({
                error: "género de la canción incorrecto"
            });
        }
        // Validar precio
        else if (cancion.precio == null || cancion.precio <= 0 || typeof cancion.precio== "undefined" ) {
            res.status(401);
            res.json({
                error: "precio de la canción incorrecto"
            });
        } else {
            gestorBD.insertarCancion(cancion, function (id) {
                if (id == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(201);
                    res.json({
                        mensaje: "canción insertada",
                        _id: id
                    })
                }
            });
        }
    });

    app.put("/api/cancion/:id", function (req, res) {

        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};

        let cancion = {}; // Solo los atributos a modificar
        //validar datos
        if (req.body.nombre != null && req.body.nombre.length >= 3 && req.body.nombre.length <= 15)
            cancion.nombre = req.body.nombre;
        else {
            res.status(401);
            return res.json({
                error: "nombre de la canción incorrecto"
            });
        }
        if (req.body.genero != null && cancion.genero.length >= 3)
            cancion.genero = req.body.genero;
        else {
            res.status(401);
            return res.json({
                error: "género de la canción incorrecto"
            });
        }
        if (req.body.precio != null && req.body.precio > 0)
            cancion.precio = req.body.precio;
        else {
            res.status(401);
            return res.json({
                error: "precio de la canción incorrecto"
            });
        }
        let cancion_id = gestorBD.mongo.ObjectID(req.params.id);
        let usuario = res.usuario;
        userAthorOfSong(usuario, cancion_id, function (isAuthor) {
            if (isAuthor) {

                gestorBD.modificarCancion(criterio, cancion, function (result) {
                    if (result == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.json({
                            mensaje: "canción modificada",
                            _id: req.params.id
                        })
                    }
                });
            } else {
                res.status(401);
                res.json({
                    error: "el usuario debe ser el autor de la canción"
                });
            }
        });
    });

    function userAthorOfSong(usuario, cancionId, callback) {
        let criterio_cancion_autor = {
            $and: [
                {"_id": cancionId},
                {"autor": usuario}
            ]
        };
        gestorBD.obtenerCanciones(criterio_cancion_autor, function (canciones) {
            if (canciones == null || canciones.length <= 0) {
                callback(false);
            } else {
                callback(true);
            }
        });
    }
}