const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    //Leer token
    const token = req.header('x-auth-token');
    //Revisar token
    if(!token){
        return res.status(401).json({msg: 'No existe token'})
    }
    //Validad token
    try {
        const cifrado = jwt.verify(token, process.env.SECRET);
        req.usuario = cifrado.usuario,
        next();
    } catch (error) {
        res.status(401).json({msg: 'Token no valido'})
    }
}