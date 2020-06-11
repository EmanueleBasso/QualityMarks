const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function (request, response){
    connection.query('SELECT ?z WHERE {prodotti-qualita:TaurasiRosso prodotti-qualita:nomeProdotto ?z}')
        .then((res) => {
            response.send(res.results.bindings)
        })
        .catch((err) => {
            response.send(err)
        })
}