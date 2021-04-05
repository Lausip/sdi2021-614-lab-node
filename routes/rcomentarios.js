module.exports = function(app, swig, gestorBD) {

    app.post('/comentarios/:cancion_id', function (req, res) {
        if ( req.session.usuario == null){
            res.send("Error al agregar usuario: Debe de estar en sesión");
            return;
        }

        let comentario = {
            autor : req.session.usuario,
            texto : req.body.texto,
            cancion_id : gestorBD.mongo.ObjectID(req.params.cancion_id),
        }

        gestorBD.insertarComentario(comentario, function(id){
            if (id == null) {
                res.send("Error al insertar comentario");
            } else {
                res.redirect("/cancion/"+ comentario.cancion_id);
            }
        });
    })
}