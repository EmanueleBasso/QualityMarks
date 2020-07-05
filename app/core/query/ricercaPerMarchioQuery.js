const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function (request, response){
    var marchio = request.body.marchio
    var categoria = request.body.categoria
    var regione = request.body.regione
    var nazione = request.body.nazione
    var ordinamento = request.body.ordinamento
    var ordinamentoModo = request.body.ordinamentoModo

    /*  QUERY:

            PREFIX prodotti-qualita: <http://www.semanticweb.org/progettoWS/prodotti-qualita#>
            PREFIX l0: <https://w3id.org/italia/onto/l0/>

            SELECT ?individual, ?nomeProdotto, ?tipologia, ?nomeMarchio, ?nomeRegione, ?nomeNazione

            FROM NAMED <http://localhost:8890/regions>
            FROM NAMED <http://localhost:8890/italy>

            WHERE{
                ?individual a ?class.
                ?class rdfs:subClassOf prodotti-qualita:ProdottoAlimentare.
                ?class rdfs:label ?tipologia.
                opt       FILTER(?tipologia = "tipologia")

                ?individual prodotti-qualita:nomeProdotto ?nomeProdotto.

                ?individual prodotti-qualita:possiede ?marchio.
                ?marchio prodotti-qualita:nomeMarchio ?nomeMarchio.
                opt FILTER(?nomeMarchio = "marchio")

                ?individual prodotti-qualita:regione ?regione.
                GRAPH ?g1{
                    ?regione l0:name ?nomeRegione.
                    opt FILTER(str(?nomeRegione) = "regione")
                }

                ?individual prodotti-qualita:nazione ?nazione.
                GRAPH ?g2{
                    ?nazione l0:name ?nomeNazione.
                    FILTER(LANG(?nomeNazione) = "it")
                    opt FILTER(str(?nomeNazione) = "nazione")
                }
            }
            ORDER BY ASC/DESC("variabile")
    */

    var query = `SELECT ?individual, ?nomeProdotto, ?tipologia, ?nomeMarchio, ?nomeRegione, ?nomeNazione

                 FROM NAMED <http://localhost:8890/regions>
                 FROM NAMED <http://localhost:8890/italy>

                 WHERE{
                    ?individual a ?class.
                    ?class rdfs:subClassOf prodotti-qualita:ProdottoAlimentare.
                    ?class rdfs:label ?tipologia.`

    if(categoria) {
        query += 'FILTER(?tipologia = "' + categoria + '")'
    }
            
    query += `?individual prodotti-qualita:nomeProdotto ?nomeProdotto.
              ?individual prodotti-qualita:possiede ?marchio.
              ?marchio prodotti-qualita:nomeMarchio ?nomeMarchio.`

    if(marchio) {
        query += 'FILTER(?nomeMarchio = "' + marchio + '")'
    }

    query += `?individual prodotti-qualita:regione ?regione.
              GRAPH ?g1{
                  ?regione l0:name ?nomeRegione.`
    
    if(regione) {
        query += 'FILTER(str(?nomeRegione) = "' + regione + '")'
    }

    query += '}'

    query += `?individual prodotti-qualita:nazione ?nazione.
              GRAPH ?g2{
                  ?nazione l0:name ?nomeNazione.
                  FILTER(LANG(?nomeNazione) = "it")`

    if(nazione) {
        query += 'FILTER(str(?nomeNazione) = "' + nazione + '")'
    }

    query += '}}'

    query += 'ORDER BY ' + ordinamentoModo + '(?' + ordinamento + ')'

    connection.query(query, true)
        .then((res) => {
            //logger.info(res.results.bindings)
            response.send(res.results.bindings)
        })
        .catch((err) => {
            logger.error(err)
        })
}