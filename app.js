// Módulos
let express = require('express');
let app = express();

let swig = require('swig');

app.use(express.static('public'));

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Variables
app.set('port', 8081);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app, swig); // (app, param1, param2, etc.)

// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
})
