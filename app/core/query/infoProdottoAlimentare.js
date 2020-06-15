const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function (request, response){
    var iriProdotto = request.body.iriProdotto

    response.render('index')

    /*  QUERY:

            PREFIX prodotti-qualita: <http://www.semanticweb.org/progettoWS/prodotti-qualita#>
            PREFIX regioni: <https://w3id.org/italia/controlled-vocabulary/territorial-classifications/regions>
            PREFIX italia: <https://w3id.org/italia/controlled-vocabulary/territorial-classifications/italy>
            PREFIX l0: <https://w3id.org/italia/onto/l0/>

            SELECT ?individual, ?nomeProdotto, ?nomeMarchio, ?nomeRegione, ?nomeNazione

            FROM NAMED <http://localhost:8890/regions>
            FROM NAMED <http://localhost:8890/italy>

            WHERE{
                ?individual a ?class.
                ?class rdfs:subClassOf prodotti-qualita:ProdottoAlimentare.
                opp       ?individual a prodotti-qualita:class.

                ?individual prodotti-qualita:nomeProdotto ?nomeProdotto.
                opt FILTER(regex(?nomeProdotto, "nome", "i"))'

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
    */
    /*
    var query = `SELECT ?individual, ?nomeProdotto, ?nomeMarchio, ?nomeRegione, ?nomeNazione

                 FROM NAMED <http://localhost:8890/regions>
                 FROM NAMED <http://localhost:8890/italy>

                 WHERE{`;

    if(categoria !== 'Seleziona...') {
        query += '?individual a prodotti-qualita:' + categoria + '.'
    } else {
        query += `?individual a ?class.
                  ?class rdfs:subClassOf prodotti-qualita:ProdottoAlimentare.`
    }
            
    query += '?individual prodotti-qualita:nomeProdotto ?nomeProdotto.'
    
    if(nome !== '') {
        query += 'FILTER(regex(?nomeProdotto, "' + nome + '", "i"))'
    }

    query += `?individual prodotti-qualita:possiede ?marchio.
              ?marchio prodotti-qualita:nomeMarchio ?nomeMarchio.`

    if(marchio !== 'Seleziona...') {
        query += 'FILTER(?nomeMarchio = "' + marchio + '")'
    }

    query += `?individual prodotti-qualita:regione ?regione.
              GRAPH ?g1{
                  ?regione l0:name ?nomeRegione.`
    
    if(regione !== 'Seleziona...') {
        query += 'FILTER(str(?nomeRegione) = "' + regione + '")'
    }

    query += '}'

    query += `?individual prodotti-qualita:nazione ?nazione.
              GRAPH ?g2{
                  ?nazione l0:name ?nomeNazione.
                  FILTER(LANG(?nomeNazione) = "it")`

    if(nazione !== 'Seleziona...') {
        query += 'FILTER(str(?nomeNazione) = "' + nazione + '")'
    }

    query += '}}'

    connection.query(query, true)
        .then((res) => {
            logger.info(res.results.bindings)
            response.send(res.results.bindings)
        })
        .catch((err) => {
            logger.error(err)
            response.send(err)
        })*/
}