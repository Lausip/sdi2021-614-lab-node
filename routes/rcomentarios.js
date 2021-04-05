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
    });
    app.get('/comentario/borrar/:id', function (req, res) {

        let criterio = {"_id" : gestorBD.mongo.ObjectID(req.params.id) };
        var comentarioCancion="";
        var comentarioAutor="";
        gestorBD.obtenerComentarios(criterio, function(comentarios){
            if (comentarios == null) {
                res.send("Error al recuperar los comentarios");
            } else {

               comentarioCancion=comentarios[0].cancion_id;
               comentarioAutor=comentarios[0].autor;

            }
        });
        gestorBD.eliminarComentario(criterio,function(comentario){
            if(comentarioAutor!=req.session.usuario){
                res.send("Error : Su autor no concide con tu inicio de sesión");
            }
            if ( comentario == null ){
                res.send("Error : Al intentar eliminar el comentario");
            } else {
                res.redirect("/cancion/"+ comentarioCancion);
            }
        });
    })
}