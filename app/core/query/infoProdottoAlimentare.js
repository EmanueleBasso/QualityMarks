const logger = require('loglevel')
const connection = require('./connection')

module.exports = async function (request, response){
    var iriProdotto = request.body.iriProdotto
    var nomeMarchio = request.body.nomeMarchio
    var nomeNazione = request.body.nomeNazione
    var nomeRegione = request.body.nomeRegione
    var tipologia = request.body.tipologia

    /*  QUERY:

            DESCRIBE <iriProdotto>
    */

    var query = 'DESCRIBE <' + iriProdotto + '>'

    connection.query(query, true)
        .then((res) => {
            logger.info(JSON.stringify(res, null, 4))
            var ontologyIri = "http://www.semanticweb.org/progettoWS/prodotti-qualita#"

            var payload = {}

            payload['nomeMarchio'] = nomeMarchio
            payload['nomeNazione'] = nomeNazione
            payload['nomeRegione'] = nomeRegione
            payload['tipologia'] = tipologia

            // Pure gli altri file
            payload['nomeFileDisciplinare'] = res[iriProdotto][ontologyIri + 'haDisciplinare'][0]['value'].split('#')[1] + '.pdf'

            payload['caratteristiche'] = []

            for(var property in res[iriProdotto]){
                if(property == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'){
                    var nomeClasse = res[iriProdotto][property][1]['value']
                    // Dato il nome della classe ottenere il nome visualizzabile dall'annotazione
                }else if(property == (ontologyIri + 'nomeProdotto')){
                    payload['nomeProdotto'] = res[iriProdotto][property][0]['value']
                }else if(res[iriProdotto][property][0]['type'] == 'literal'){
                    var nome = property.split('#')[1].replace(/([A-Z])/g, ' $1').trim().toLowerCase()
                    var valore = res[iriProdotto][property][0]['value']

                    var obj = {}
                    obj[nome] = valore

                    payload['caratteristiche'].push(obj)
                }
            }

            var societaVigilante = ""
            var consorzioTutela = ""
            var aziendeProduttrici = []
            var eventi = []

            for(var objectIri in res){
                if((ontologyIri + 'controlla') in res[objectIri]){
                    societaVigilante = objectIri 
                }else if((ontologyIri + 'valorizza') in res[objectIri]){
                    consorzioTutela = objectIri
                }else if((ontologyIri + 'produce') in res[objectIri]){
                    aziendeProduttrici.push(objectIri)
                }else if((ontologyIri + 'promuove') in res[objectIri]){
                    eventi.push(objectIri)
                }
            }

            getInfoSocietaVigilante(societaVigilante).then((res) =>{
                if(res.length != 0){
                    payload['societaVigilante'] = {
                        "nome": res[0]['nome'].value,
                        "fax": res[0]['fax'].value,
                        "indirizzo": res[0]['indirizzo'].value,
                        "cap": res[0]['cap'].value,
                        "partitaIva": res[0]['partitaIva'].value,
                        "sitoWeb": res[0]['sitoWeb'].value,
                        "email": res[0]['email'].value,
                        "numeroTelefono": res[0]['numeroTelefono'].value,
                        "nomeCitta": res[0]['nomeCitta'].value,
                        "nomeProvincia": res[0]['nomeProvincia'].value,
                        "nomeNazione": res[0]['nomeNazione'].value
                    }
                }
            }).then(getInfoConsorzioTutela(consorzioTutela).then((res) =>{
                if(res.length != 0){
                    payload['consorzioTutela'] = {
                        "nome": res[0]['nome'].value,
                        "indirizzo": res[0]['indirizzo'].value,
                        "cap": res[0]['cap'].value,
                        "sitoWeb": res[0]['sitoWeb'].value,
                        "email": res[0]['email'].value,
                        "numeroTelefono": res[0]['numeroTelefono'].value,
                        "nomeCitta": res[0]['nomeCitta'].value,
                        "nomeProvincia": res[0]['nomeProvincia'].value,
                        "nomeNazione": res[0]['nomeNazione'].value
                    }
                }
            })).then(async () => {
                payload['aziedeProduttrici'] = []

                await Promise.all(aziendeProduttrici.map(async (element) => {
                    await getInfoAzienda(element).then((res) => {
                        if(res.length != 0){
                            var obj = {
                                "nome": res[0]['nome'].value,
                                "indirizzo": res[0]['indirizzo'].value,
                                "cap": res[0]['cap'].value,
                                "email": res[0]['email'].value,
                                "numeroTelefono": res[0]['numeroTelefono'].value,
                                "nomeCitta": res[0]['nomeCitta'].value,
                                "nomeProvincia": res[0]['nomeProvincia'].value,
                                "nomeNazione": res[0]['nomeNazione'].value
                            }
                            
                            payload['aziedeProduttrici'].push(obj)
                        }
                    })
                }))
            }).then(async () => {
                payload['eventi'] = []

                await Promise.all(eventi.map(async (element) => {
                    await getInfoEvento(element).then((res) => {
                        if(res.length != 0){
                            var obj = {
                                "titolo": res[0]['titolo'].value,
                                "indirizzo": res[0]['indirizzo'].value,
                                "mese": res[0]['mese'].value,
                                "organizzatore": res[0]['organizzatore'].value,
                                "sitoWeb": res[0]['sitoWeb'].value,
                                "nomeCitta": res[0]['nomeCitta'].value,
                                "nomeProvincia": res[0]['nomeProvincia'].value,
                                "nomeRegione": res[0]['nomeRegione'].value,
                                "nomeNazione": res[0]['nomeNazione'].value
                            }
                            
                            payload['eventi'].push(obj)
                        }
                    })
                }))
            }).then(() => {
                logger.info(payload)
                response.render('infoProdottoAlimentare', {payload})
            })
        })
        .catch((err) => {
            logger.error(err)
        })
}

function getInfoSocietaVigilante(societaVigilanteIri){
    /*  QUERY:

            PREFIX prodotti-qualita: <http://www.semanticweb.org/progettoWS/prodotti-qualita#>
            PREFIX l0: <https://w3id.org/italia/onto/l0/>

            SELECT ?nome, ?fax, ?indirizzo, ?cap, ?partitaIva, ?sitoWeb, ?email, ?numeroTelefono, ?nomeCitta, ?nomeProvincia, ?nomeNazione

            FROM NAMED <http://localhost:8890/cities>
            FROM NAMED <http://localhost:8890/provinces>
            FROM NAMED <http://localhost:8890/italy>

            WHERE{
                <societaVigilanteIri> prodotti-qualita:haNome ?nome.
                <societaVigilanteIri> prodotti-qualita:haFax ?fax.
                <societaVigilanteIri> prodotti-qualita:haIndirizzo ?indirizzo.
                <societaVigilanteIri> prodotti-qualita:haCAP ?cap.
                <societaVigilanteIri> prodotti-qualita:haPartitaIVA ?partitaIva.
                <societaVigilanteIri> prodotti-qualita:haSitoWeb ?sitoWeb.
                <societaVigilanteIri> prodotti-qualita:haEmail ?email.
                <societaVigilanteIri> prodotti-qualita:haNumeroDiTelefono ?numeroTelefono.

                <societaVigilanteIri> prodotti-qualita:citta ?citta.
                GRAPH ?g1{
                    ?citta l0:name ?nomeCitta.
                }

                <societaVigilanteIri> prodotti-qualita:provincia ?provincia.
                GRAPH ?g2{
                    ?provincia l0:name ?nomeProvincia.
                }

                <societaVigilanteIri> prodotti-qualita:nazione ?nazione.
                GRAPH ?g3{
                    ?nazione l0:name ?nomeNazione.
                    FILTER(LANG(?nomeNazione) = "it")
                }
            }
    */

    var query = `SELECT ?nome, ?fax, ?indirizzo, ?cap, ?partitaIva, ?sitoWeb, ?email, ?numeroTelefono, ?nomeCitta, ?nomeProvincia, ?nomeNazione

                FROM NAMED <http://localhost:8890/cities>
                FROM NAMED <http://localhost:8890/provinces>
                FROM NAMED <http://localhost:8890/italy>

                WHERE{`

    query += '<' + societaVigilanteIri + '> prodotti-qualita:haNome ?nome.'
    query += '<' + societaVigilanteIri + '> prodotti-qualita:haFax ?fax.'
    query += '<' + societaVigilanteIri + '> prodotti-qualita:haIndirizzo ?indirizzo.'
    query += '<' + societaVigilanteIri + '> prodotti-qualita:haCAP ?cap.'
    query += '<' + societaVigilanteIri + '> prodotti-qualita:haPartitaIVA ?partitaIva.'
    query += '<' + societaVigilanteIri + '> prodotti-qualita:haSitoWeb ?sitoWeb.'
    query += '<' + societaVigilanteIri + '> prodotti-qualita:haEmail ?email.'
    query += '<' + societaVigilanteIri + '> prodotti-qualita:haNumeroDiTelefono ?numeroTelefono.'

    query += '<' + societaVigilanteIri + `> prodotti-qualita:citta ?citta.
            GRAPH ?g1{
                ?citta l0:name ?nomeCitta.
            }`

    query += '<' + societaVigilanteIri + `> prodotti-qualita:provincia ?provincia.
            GRAPH ?g2{
                ?provincia l0:name ?nomeProvincia.
            }`

    query += '<' + societaVigilanteIri + `> prodotti-qualita:nazione ?nazione.
            GRAPH ?g3{
                ?nazione l0:name ?nomeNazione.
                FILTER(LANG(?nomeNazione) = "it")
            }}`

    return connection.query(query, true)
        .then((res) => {
            return res.results.bindings
        })
        .catch((err) => {
            logger.error(err)
            return []
        })
}

function getInfoConsorzioTutela(consorzioTutela){
    /*  QUERY:

            PREFIX prodotti-qualita: <http://www.semanticweb.org/progettoWS/prodotti-qualita#>
            PREFIX l0: <https://w3id.org/italia/onto/l0/>

            SELECT ?nome, ?indirizzo, ?cap, ?sitoWeb, ?email, ?numeroTelefono, ?nomeCitta, ?nomeProvincia, ?nomeNazione

            FROM NAMED <http://localhost:8890/cities>
            FROM NAMED <http://localhost:8890/provinces>
            FROM NAMED <http://localhost:8890/italy>

            WHERE{
                <consorzioTutela> prodotti-qualita:haNome ?nome.
                <consorzioTutela> prodotti-qualita:haIndirizzo ?indirizzo.
                <consorzioTutela> prodotti-qualita:haCAP ?cap.
                <consorzioTutela> prodotti-qualita:haSitoWeb ?sitoWeb.
                <consorzioTutela> prodotti-qualita:haEmail ?email.
                <consorzioTutela> prodotti-qualita:haNumeroDiTelefono ?numeroTelefono.

                <consorzioTutela> prodotti-qualita:citta ?citta.
                GRAPH ?g1{
                    ?citta l0:name ?nomeCitta.
                }

                <consorzioTutela> prodotti-qualita:provincia ?provincia.
                GRAPH ?g2{
                    ?provincia l0:name ?nomeProvincia.
                }

                <consorzioTutela> prodotti-qualita:nazione ?nazione.
                GRAPH ?g3{
                    ?nazione l0:name ?nomeNazione.
                    FILTER(LANG(?nomeNazione) = "it")
                }
            }
    */

    var query = `SELECT ?nome, ?indirizzo, ?cap, ?sitoWeb, ?email, ?numeroTelefono, ?nomeCitta, ?nomeProvincia, ?nomeNazione

                FROM NAMED <http://localhost:8890/cities>
                FROM NAMED <http://localhost:8890/provinces>
                FROM NAMED <http://localhost:8890/italy>

                WHERE{`

    query += '<' + consorzioTutela + '> prodotti-qualita:haNome ?nome.'
    query += '<' + consorzioTutela + '> prodotti-qualita:haIndirizzo ?indirizzo.'
    query += '<' + consorzioTutela + '> prodotti-qualita:haCAP ?cap.'
    query += '<' + consorzioTutela + '> prodotti-qualita:haSitoWeb ?sitoWeb.'
    query += '<' + consorzioTutela + '> prodotti-qualita:haEmail ?email.'
    query += '<' + consorzioTutela + '> prodotti-qualita:haNumeroDiTelefono ?numeroTelefono.'

    query += '<' + consorzioTutela + `> prodotti-qualita:citta ?citta.
            GRAPH ?g1{
                ?citta l0:name ?nomeCitta.
            }`

    query += '<' + consorzioTutela + `> prodotti-qualita:provincia ?provincia.
            GRAPH ?g2{
                ?provincia l0:name ?nomeProvincia.
            }`

    query += '<' + consorzioTutela + `> prodotti-qualita:nazione ?nazione.
            GRAPH ?g3{
                ?nazione l0:name ?nomeNazione.
                FILTER(LANG(?nomeNazione) = "it")
            }}`

    return connection.query(query, true)
        .then((res) => {
            return res.results.bindings
        })
        .catch((err) => {
            logger.error(err)
            return []
        })
}

function getInfoAzienda(azienda){
    /*  QUERY:

            PREFIX prodotti-qualita: <http://www.semanticweb.org/progettoWS/prodotti-qualita#>
            PREFIX l0: <https://w3id.org/italia/onto/l0/>

            SELECT ?nome, ?indirizzo, ?cap, ?email, ?numeroTelefono, ?nomeCitta, ?nomeProvincia, ?nomeNazione

            FROM NAMED <http://localhost:8890/cities>
            FROM NAMED <http://localhost:8890/provinces>
            FROM NAMED <http://localhost:8890/italy>

            WHERE{
                <azienda> prodotti-qualita:haNome ?nome.
                <azienda> prodotti-qualita:haIndirizzo ?indirizzo.
                <azienda> prodotti-qualita:haCAP ?cap.
                <azienda> prodotti-qualita:haEmail ?email.
                <azienda> prodotti-qualita:haNumeroDiTelefono ?numeroTelefono.

                <azienda> prodotti-qualita:citta ?citta.
                GRAPH ?g1{
                    ?citta l0:name ?nomeCitta.
                }

                <azienda> prodotti-qualita:provincia ?provincia.
                GRAPH ?g2{
                    ?provincia l0:name ?nomeProvincia.
                }

                <azienda> prodotti-qualita:nazione ?nazione.
                GRAPH ?g3{
                    ?nazione l0:name ?nomeNazione.
                    FILTER(LANG(?nomeNazione) = "it")
                }
            }
            ORDER BY ASC(?nome)
    */

    var query = `SELECT ?nome, ?indirizzo, ?cap, ?email, ?numeroTelefono, ?nomeCitta, ?nomeProvincia, ?nomeNazione

                FROM NAMED <http://localhost:8890/cities>
                FROM NAMED <http://localhost:8890/provinces>
                FROM NAMED <http://localhost:8890/italy>

                WHERE{`

    query += '<' + azienda + '> prodotti-qualita:haNome ?nome.'
    query += '<' + azienda + '> prodotti-qualita:haIndirizzo ?indirizzo.'
    query += '<' + azienda + '> prodotti-qualita:haCAP ?cap.'
    query += '<' + azienda + '> prodotti-qualita:haEmail ?email.'
    query += '<' + azienda + '> prodotti-qualita:haNumeroDiTelefono ?numeroTelefono.'

    query += '<' + azienda + `> prodotti-qualita:citta ?citta.
            GRAPH ?g1{
                ?citta l0:name ?nomeCitta.
            }`

    query += '<' + azienda + `> prodotti-qualita:provincia ?provincia.
            GRAPH ?g2{
                ?provincia l0:name ?nomeProvincia.
            }`

    query += '<' + azienda + `> prodotti-qualita:nazione ?nazione.
            GRAPH ?g3{
                ?nazione l0:name ?nomeNazione.
                FILTER(LANG(?nomeNazione) = "it")
            }}
            ORDER BY ASC(?nome)`

    return connection.query(query, true)
        .then((res) => {
            return res.results.bindings
        })
        .catch((err) => {
            logger.error(err)
            return []
        })
}

function getInfoEvento(evento){
    /*  QUERY:

            PREFIX prodotti-qualita: <http://www.semanticweb.org/progettoWS/prodotti-qualita#>
            PREFIX l0: <https://w3id.org/italia/onto/l0/>

            SELECT ?titolo, ?indirizzo, ?organizzatore, ?mese, ?sitoWeb, ?nomeCitta, ?nomeProvincia, ?nomeRegione, ?nomeNazione

            FROM NAMED <http://localhost:8890/cities>
            FROM NAMED <http://localhost:8890/provinces>
            FROM NAMED <http://localhost:8890/regions>
            FROM NAMED <http://localhost:8890/italy>

            WHERE{
                <evento> prodotti-qualita:haTitolo ?titolo.
                <evento> prodotti-qualita:haIndirizzo ?indirizzo.
                <evento> prodotti-qualita:organizzatore ?organizzatore.
                <evento> prodotti-qualita:nelMese ?mese.
                <evento> prodotti-qualita:haSitoWeb ?sitoWeb.

                <evento> prodotti-qualita:citta ?citta.
                GRAPH ?g1{
                    ?citta l0:name ?nomeCitta.
                }

                <evento> prodotti-qualita:provincia ?provincia.
                GRAPH ?g2{
                    ?provincia l0:name ?nomeProvincia.
                }

                <evento> prodotti-qualita:regione ?regione.
                GRAPH ?g3{
                    ?regione l0:name ?nomeRegione.
                }

                <evento> prodotti-qualita:nazione ?nazione.
                GRAPH ?g4{
                    ?nazione l0:name ?nomeNazione.
                    FILTER(LANG(?nomeNazione) = "it")
                }
            }
            ORDER BY ASC(?titolo)
    */

    var query = `SELECT ?titolo, ?indirizzo, ?organizzatore, ?mese, ?sitoWeb, ?nomeCitta, ?nomeProvincia, ?nomeRegione, ?nomeNazione

                FROM NAMED <http://localhost:8890/cities>
                FROM NAMED <http://localhost:8890/provinces>
                FROM NAMED <http://localhost:8890/regions>
                FROM NAMED <http://localhost:8890/italy>

                WHERE{`

    query += '<' + evento + '> prodotti-qualita:haTitolo ?titolo.'
    query += '<' + evento + '> prodotti-qualita:haIndirizzo ?indirizzo.'
    query += '<' + evento + '> prodotti-qualita:organizzatore ?organizzatore.'
    query += '<' + evento + '> prodotti-qualita:nelMese ?mese.'
    query += '<' + evento + '> prodotti-qualita:haSitoWeb ?sitoWeb.'

    query += '<' + evento + `> prodotti-qualita:citta ?citta.
            GRAPH ?g1{
                ?citta l0:name ?nomeCitta.
            }`

    query += '<' + evento + `> prodotti-qualita:provincia ?provincia.
            GRAPH ?g2{
                ?provincia l0:name ?nomeProvincia.
            }`

    query += '<' + evento + `> prodotti-qualita:regione ?regione.
            GRAPH ?g3{
                ?regione l0:name ?nomeRegione.
            }`

    query += '<' + evento + `> prodotti-qualita:nazione ?nazione.
            GRAPH ?g4{
                ?nazione l0:name ?nomeNazione.
                FILTER(LANG(?nomeNazione) = "it")
            }}
            ORDER BY ASC(?titolo)`

    return connection.query(query, true)
        .then((res) => {
            return res.results.bindings
        })
        .catch((err) => {
            logger.error(err)
            return []
        })
}