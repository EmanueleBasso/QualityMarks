const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function (request, response){
    var nomeSocieta = request.body.nomeSocieta
    var citta = request.body.citta
    var nazione = request.body.nazione
    var regione = request.body.regione
    var provincia = request.body.provincia
    var ordinamento = request.body.ordinamento
    var ordinamentoModo = request.body.ordinamentoModo

    /*  QUERY:

            PREFIX prodotti-qualita: <http://www.semanticweb.org/progettoWS/prodotti-qualita#>
            PREFIX l0: <https://w3id.org/italia/onto/l0/>
            PREFIX CLV: <https://w3id.org/italia/onto/CLV/>

            SELECT ?individual, ?nomeSocieta, ?indirizzo, ?cap, ?sitoWeb, ?nomeCitta, ?nomeProvincia, ?nomeRegione, ?nomeNazione

            FROM NAMED <http://localhost:8890/cities>
            FROM NAMED <http://localhost:8890/provinces>
            FROM NAMED <http://localhost:8890/regions>
            FROM NAMED <http://localhost:8890/italy>

            WHERE{
                ?individual a prodotti-qualita:SocietaVigilante.

                ?individual prodotti-qualita:haNome ?nomeSocieta.
                opt FILTER(regex(?nomeSocieta, "nome", "i"))
                ?individual prodotti-qualita:haIndirizzo ?indirizzo.
                ?individual prodotti-qualita:haCAP ?cap.
                ?individual prodotti-qualita:haSitoWeb ?sitoWeb.
                
                ?individual prodotti-qualita:citta ?citta.
                GRAPH ?g1{
                    ?citta l0:name ?nomeCitta.
                    opt FILTER(regex(str(?nomeCitta), "citta", "i"))
                }

                ?individual prodotti-qualita:nazione ?nazione.
                GRAPH ?g2{
                    ?nazione l0:name ?nomeNazione.
                    FILTER(LANG(?nomeNazione) = "it")
                    opt FILTER(str(?nomeNazione) = "nazione")
                }

                ?individual prodotti-qualita:provincia ?provincia.
                GRAPH ?g3{
                    ?provincia l0:name ?nomeProvincia.
                    opt FILTER(str(?nomeProvincia) = "provincia")
                    ?provincia CLV:situatedWithin ?regione.
                }

                GRAPH ?g4{
                    ?regione l0:name ?nomeRegione.
                    opt FILTER(str(?nomeRegione) = "regione")
                }
            }
            ORDER BY ASC/DESC("variabile")
    */

    var query = `SELECT ?individual, ?nomeSocieta, ?indirizzo, ?cap, ?sitoWeb, ?nomeCitta, ?nomeProvincia, ?nomeRegione, ?nomeNazione

                 FROM NAMED <http://localhost:8890/cities>
                 FROM NAMED <http://localhost:8890/provinces>
                 FROM NAMED <http://localhost:8890/regions>
                 FROM NAMED <http://localhost:8890/italy>

                 WHERE{
                    ?individual a prodotti-qualita:SocietaVigilante.

                    ?individual prodotti-qualita:haNome ?nomeSocieta.`

    if(nomeSocieta) {
        query += 'FILTER(regex(?nomeSocieta, "' + nomeSocieta + '", "i"))'
    }

    query += `?individual prodotti-qualita:haIndirizzo ?indirizzo.
              ?individual prodotti-qualita:haCAP ?cap.
              ?individual prodotti-qualita:haSitoWeb ?sitoWeb.

              ?individual prodotti-qualita:citta ?citta.
              GRAPH ?g1{
                  ?citta l0:name ?nomeCitta.`

    if(citta) {
        query += 'FILTER(regex(str(?nomeCitta), "' + citta + '", "i"))'
    }
            
    query += `}
            ?individual prodotti-qualita:nazione ?nazione.
            GRAPH ?g2{
                ?nazione l0:name ?nomeNazione.
                FILTER(LANG(?nomeNazione) = "it")`

    if(nazione) {
        query += 'FILTER(str(?nomeNazione) = "' + nazione + '")'
    }

    query += `}
              ?individual prodotti-qualita:provincia ?provincia.
              GRAPH ?g3{
                  ?provincia l0:name ?nomeProvincia.`

    if(provincia) {
        query += 'FILTER(str(?nomeProvincia) = "' + provincia + '")'
    }

    query += `?provincia CLV:situatedWithin ?regione.
            }

            GRAPH ?g4{
                ?regione l0:name ?nomeRegione.`
  
    if(regione) {
        query += 'FILTER(str(?nomeRegione) = "' + regione + '")'
    }

    query += `}}
             ORDER BY ` + ordinamentoModo + `(?` + ordinamento + `)`

    connection.query(query, true)
        .then((res) => {
            //logger.info(res.results.bindings)
            response.send(res.results.bindings)
        })
        .catch((err) => {
            logger.error(err)
        })
}