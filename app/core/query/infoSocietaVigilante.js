const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function (request, response){
    var iriSocieta = request.body.iriSocieta
    var nomeCitta = request.body.nomeCitta
    var nomeProvincia = request.body.nomeProvincia
    var nomeRegione = request.body.nomeRegione
    var nomeNazione = request.body.nomeNazione

    /*  QUERY:

            DESCRIBE <iriSocieta>
    */

    var query = 'DESCRIBE <' + iriSocieta + '>'

    connection.query(query, true)
        .then(async (res) => {
            //logger.info(JSON.stringify(res, null, 4))

            var ontologyIri = "http://www.semanticweb.org/progettoWS/prodotti-qualita#"

            var payload = {}

            payload['nomeCitta'] = nomeCitta
            payload['nomeProvincia'] = nomeProvincia
            payload['nomeRegione'] = nomeRegione
            payload['nomeNazione'] = nomeNazione

            payload['nome'] = res[iriSocieta][ontologyIri + 'haNome'][0]['value']
            payload['sitoWeb'] = res[iriSocieta][ontologyIri + 'haSitoWeb'][0]['value']
            payload['numeroTelefono'] = res[iriSocieta][ontologyIri + 'haNumeroDiTelefono'][0]['value']
            payload['indirizzo'] = res[iriSocieta][ontologyIri + 'haIndirizzo'][0]['value']
            payload['cap'] = res[iriSocieta][ontologyIri + 'haCAP'][0]['value']
            payload['email'] = res[iriSocieta][ontologyIri + 'haEmail'][0]['value']

            if(res[iriSocieta][ontologyIri + 'haFax'] === undefined) {
                payload['fax'] = '-'
            } else {
                payload['fax'] = res[iriSocieta][ontologyIri + 'haFax'][0]['value']
            }

            if(res[iriSocieta][ontologyIri + 'haPartitaIVA'] === undefined) {
                payload['partitaIva'] = '-'
            } else {
                payload['partitaIva'] = res[iriSocieta][ontologyIri + 'haPartitaIVA'][0]['value']
            }

            var prodottiControllati = []

            for(var i in res[iriSocieta][ontologyIri + 'controlla']) {
                prodottiControllati.push(res[iriSocieta][ontologyIri + 'controlla'][i]['value'])
            }

            payload['prodottiControllati'] = []

            await Promise.all(prodottiControllati.map(async (element) => {
                await getInfoProdotto(element).then((res) => {
                    if(res.length != 0){
                        var obj = {
                            "individual": element,
                            "nomeProdotto": res[0]['nomeProdotto'].value,
                            "tipologia": res[0]['tipologia'].value,
                            "nomeMarchio": res[0]['nomeMarchio'].value,
                            "nomeRegione": res[0]['nomeRegione'].value,
                            "nomeNazione": res[0]['nomeNazione'].value
                        }

                        if(payload['prodottiControllati'].length == 0) {
                            payload['prodottiControllati'].push(obj)
                        } else {
                            var inserted = false

                            for(var i in payload['prodottiControllati']) {
                                if(res[0]['nomeProdotto'].value.localeCompare(payload['prodottiControllati'][i]['nomeProdotto']) == -1) {
                                    payload['prodottiControllati'].splice(i, 0, obj)
                                    inserted = true
                                    break
                                }
                            }

                            if(!inserted) {
                                payload['prodottiControllati'].push(obj)
                            }
                        }                      
                    }
                })
            }))

            //logger.info(payload)
            response.render('infoSocietaVigilante', {payload})
        }).catch((err) => {
            logger.error(err)
        })
}

function getInfoProdotto(prodotto){
    /*  QUERY:

            PREFIX prodotti-qualita: <http://www.semanticweb.org/progettoWS/prodotti-qualita#>
            PREFIX l0: <https://w3id.org/italia/onto/l0/>

            SELECT ?nomeProdotto, ?tipologia, ?nomeMarchio, ?nomeRegione, ?nomeNazione

            FROM NAMED <http://localhost:8890/regions>
            FROM NAMED <http://localhost:8890/italy>

            WHERE{
                <prodotto> a ?class.
                ?class rdfs:subClassOf prodotti-qualita:ProdottoAlimentare.
                ?class rdfs:label ?tipologia.

                <prodotto> prodotti-qualita:nomeProdotto ?nomeProdotto.

                <prodotto> prodotti-qualita:possiede ?marchio.
                ?marchio prodotti-qualita:nomeMarchio ?nomeMarchio.

                <prodotto> prodotti-qualita:regione ?regione.
                GRAPH ?g1{
                    ?regione l0:name ?nomeRegione.
                }

                <prodotto> prodotti-qualita:nazione ?nazione.
                GRAPH ?g2{
                    ?nazione l0:name ?nomeNazione.
                    FILTER(LANG(?nomeNazione) = "it")
                }
            }
    */

   var query = `SELECT ?nomeProdotto, ?tipologia, ?nomeMarchio, ?nomeRegione, ?nomeNazione

                FROM NAMED <http://localhost:8890/regions>
                FROM NAMED <http://localhost:8890/italy>

                WHERE{
                    <` + prodotto +`> a ?class.
                    ?class rdfs:subClassOf prodotti-qualita:ProdottoAlimentare.
                    ?class rdfs:label ?tipologia.

                    <` + prodotto +`> prodotti-qualita:nomeProdotto ?nomeProdotto.

                    <` + prodotto +`> prodotti-qualita:possiede ?marchio.
                    ?marchio prodotti-qualita:nomeMarchio ?nomeMarchio.
                    
                    <` + prodotto +`> prodotti-qualita:regione ?regione.
                    GRAPH ?g1{
                        ?regione l0:name ?nomeRegione.
                    }

                    <` + prodotto +`> prodotti-qualita:nazione ?nazione.
                    GRAPH ?g2{
                        ?nazione l0:name ?nomeNazione.
                        FILTER(LANG(?nomeNazione) = "it")
                    }
                }`

    return connection.query(query, true)
        .then((res) => {
            return res.results.bindings
        })
        .catch((err) => {
            logger.error(err)
            return []
        })
}