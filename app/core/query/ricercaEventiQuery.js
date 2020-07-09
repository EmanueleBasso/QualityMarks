const logger = require('loglevel')
const connection = require('./connection')
const Nominatim = require('nominatim-geocoder')
const geocoder = new Nominatim({/* No options */}, {
    format: 'json',
    limit: 1,
})

function getCoordinates(event)
{
    var query = {
        city: event.nomeCitta.value,
        county: event.nomeProvincia.value,
        country: event.nomeNazione.value
    }

    return geocoder.search(query)
        .then((response) => {
            if (response.length > 0)
            {
                return [response[0].lat, response[0].lon]
            }
            else
            {
                delete query['county']

                return geocoder.search(query).then((response2) => {
                    if (response2.length > 0)
                    {
                        return [response2[0].lat, response2[0].lon]
                    }
                    else
                    {
                        return []
                    }
                }).catch((error) => {
                    logger.error(error)
                    return []
                })
            }
        }).catch((error) => {
            logger.error(error)
            return []
        })
}

module.exports = async function (request, response){
    var citta = request.body.citta
    var nazione = request.body.nazione
    var regione = request.body.regione
    var provincia = request.body.provincia
    var mese = request.body.mese
    var categoria = request.body.categoria

    /*  QUERY:

            PREFIX prodotti-qualita: <http://www.semanticweb.org/progettoWS/prodotti-qualita#>
            PREFIX l0: <https://w3id.org/italia/onto/l0/>

            SELECT DISTINCT ?titolo, ?indirizzo, ?organizzatore, ?mese, str(?sitoWeb) AS ?sitoWeb, ?nomeCitta, ?nomeProvincia, ?nomeRegione, ?nomeNazione, ?tipologia

            FROM NAMED <http://localhost:8890/cities>
            FROM NAMED <http://localhost:8890/provinces>
            FROM NAMED <http://localhost:8890/regions>
            FROM NAMED <http://localhost:8890/italy>

            WHERE{
                ?individual a prodotti-qualita:Evento.
                
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

                ?individual prodotti-qualita:regione ?regione.
                GRAPH ?g3{
                    ?regione l0:name ?nomeRegione.
                    opt FILTER(str(?nomeRegione) = "regione")
                }

                ?individual prodotti-qualita:provincia ?provincia.
                GRAPH ?g4{
                    ?provincia l0:name ?nomeProvincia.
                    opt FILTER(str(?nomeProvincia) = "provincia")
                }

                ?individual prodotti-qualita:nelMese ?mese.
                opt FILTER(?mese = "mese")
                
                ?individual prodotti-qualita:haTitolo ?titolo.
                OPTIONAL{?individual prodotti-qualita:haIndirizzo ?indirizzo.}
                OPTIONAL{?individual prodotti-qualita:organizzatore ?organizzatore.}
                OPTIONAL{?individual prodotti-qualita:haSitoWeb ?sitoWeb.}

                ?individual prodotti-qualita:promuove ?prodotto.
                ?prodotto a ?class.
                ?class rdfs:label ?tipologia.
                opt FILTER(str(?tipologia) = "tipologia")
            }
    */

    var query = `SELECT DISTINCT ?titolo, ?indirizzo, ?organizzatore, ?mese, str(?sitoWeb) AS ?sitoWeb, ?nomeCitta, ?nomeProvincia, ?nomeRegione, ?nomeNazione, ?tipologia

                 FROM NAMED <http://localhost:8890/cities>
                 FROM NAMED <http://localhost:8890/provinces>
                 FROM NAMED <http://localhost:8890/regions>
                 FROM NAMED <http://localhost:8890/italy>

                 WHERE{
                    ?individual a prodotti-qualita:Evento.
                    
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
            ?individual prodotti-qualita:regione ?regione.
            GRAPH ?g3{
                ?regione l0:name ?nomeRegione.`

    if(regione) {
        query += 'FILTER(str(?nomeRegione) = "' + regione + '")'
    }

    query += `}
            ?individual prodotti-qualita:provincia ?provincia.
            GRAPH ?g4{
                ?provincia l0:name ?nomeProvincia.`

    if(provincia) {
        query += 'FILTER(str(?nomeProvincia) = "' + provincia + '")'
    }

    query += `}
            ?individual prodotti-qualita:nelMese ?mese.`

    if(mese) {
        query += 'FILTER(?mese = "' + mese + '")'
    }

    query += `?individual prodotti-qualita:haTitolo ?titolo.
              OPTIONAL{?individual prodotti-qualita:haIndirizzo ?indirizzo.}
              OPTIONAL{?individual prodotti-qualita:organizzatore ?organizzatore.}
              OPTIONAL{?individual prodotti-qualita:haSitoWeb ?sitoWeb.}

              ?individual prodotti-qualita:promuove ?prodotto.
              ?prodotto a ?class.
              ?class rdfs:label ?tipologia.`

    if(categoria) {
        query += 'FILTER(str(?tipologia) = "' + categoria + '")'
    }

    query += '}'

    connection.query(query, true)
        .then(async (res) => {
            await Promise.all(res.results.bindings.map(async (element) => {
                if(element['indirizzo'] === undefined){
                    element['indirizzo'] = {value: ""}
                }
                if(element['sitoWeb'] === undefined){
                    element['sitoWeb'] = {value: "-"}
                }
                if(element['organizzatore'] === undefined){
                    element['organizzatore'] = {value: "-"}
                }

                await getCoordinates(element).then((result) => {
                    if(result.length != 0) {
                       element.lat = result[0]
                       element.lon = result[1]
                    }
                })
            }))
            
            //logger.info(res.results.bindings)
            response.send(res.results.bindings)
        })
        .catch((err) => {
            logger.error(err)
        })
}