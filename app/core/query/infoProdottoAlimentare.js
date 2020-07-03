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
            payload['nomeFileZonaDiProduzione'] = res[iriProdotto][ontologyIri + 'haZonaDiProduzione'][0]['value'].split('#')[1] + '.geojson'

            payload['caratteristiche'] = []

            for(var property in res[iriProdotto]){
                if(property == (ontologyIri + 'nomeProdotto')){
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
                    if(res[0]['fax'] === undefined){
                        res[0]['fax'] = {value: "-"}
                    }
                    if(res[0]['partitaIva'] === undefined){
                        res[0]['partitaIva'] = {value: "-"}
                    }

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
                    if(res[0]['sitoWeb'] === undefined){
                        res[0]['sitoWeb'] = {value: "-"}
                    }
                    if(res[0]['numeroTelefono'] === undefined){
                        res[0]['numeroTelefono'] = {value: "-"}
                    }
                    if(res[0]['fax'] === undefined){
                        res[0]['fax'] = {value: "-"}
                    }
                    if(res[0]['partitaIva'] === undefined){
                        res[0]['partitaIva'] = {value: "-"}
                    }

                    payload['consorzioTutela'] = {
                        "nome": res[0]['nome'].value,
                        "indirizzo": res[0]['indirizzo'].value,
                        "cap": res[0]['cap'].value,
                        "sitoWeb": res[0]['sitoWeb'].value,
                        "email": res[0]['email'].value,
                        "numeroTelefono": res[0]['numeroTelefono'].value,
                        "fax": res[0]['fax'].value,
                        "partitaIva": res[0]['partitaIva'].value,
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
                            if(res[0]['sitoWeb'] === undefined){
                                res[0]['sitoWeb'] = {value: "-"}
                            }
                            if(res[0]['email'] === undefined){
                                res[0]['email'] = {value: "-"}
                            }
                            if(res[0]['numeroTelefono'] === undefined){
                                res[0]['numeroTelefono'] = {value: "-"}
                            }

                            var obj = {
                                "nome": res[0]['nome'].value,
                                "indirizzo": res[0]['indirizzo'].value,
                                "cap": res[0]['cap'].value,
                                "email": res[0]['email'].value,
                                "numeroTelefono": res[0]['numeroTelefono'].value,
                                "sitoWeb": res[0]['sitoWeb'].value,
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
                            if(res[0]['indirizzo'] === undefined){
                                res[0]['indirizzo'] = {value: ""}
                            }
                            if(res[0]['sitoWeb'] === undefined){
                                res[0]['sitoWeb'] = {value: "-"}
                            }
                            if(res[0]['organizzatore'] === undefined){
                                res[0]['organizzatore'] = {value: "-"}
                            }

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

function getInfoSocietaVigilante(societaVigilante){
    /*  QUERY:

            PREFIX prodotti-qualita: <http://www.semanticweb.org/progettoWS/prodotti-qualita#>
            PREFIX l0: <https://w3id.org/italia/onto/l0/>

            SELECT ?nome, ?fax, ?indirizzo, ?cap, ?partitaIva, ?sitoWeb, ?email, ?numeroTelefono, ?nomeCitta, ?nomeProvincia, ?nomeNazione

            FROM NAMED <http://localhost:8890/cities>
            FROM NAMED <http://localhost:8890/provinces>
            FROM NAMED <http://localhost:8890/italy>

            WHERE{
                <societaVigilante> prodotti-qualita:haNome ?nome.
                OPTIONAL{<societaVigilante> prodotti-qualita:haFax ?fax.}
                <societaVigilante> prodotti-qualita:haIndirizzo ?indirizzo.
                <societaVigilante> prodotti-qualita:haCAP ?cap.
                OPTIONAL{<societaVigilante> prodotti-qualita:haPartitaIVA ?partitaIva.}
                <societaVigilante> prodotti-qualita:haSitoWeb ?sitoWeb.
                <societaVigilante> prodotti-qualita:haEmail ?email.
                <societaVigilante> prodotti-qualita:haNumeroDiTelefono ?numeroTelefono.

                <societaVigilante> prodotti-qualita:citta ?citta.
                GRAPH ?g1{
                    ?citta l0:name ?nomeCitta.
                }

                <societaVigilante> prodotti-qualita:provincia ?provincia.
                GRAPH ?g2{
                    ?provincia l0:name ?nomeProvincia.
                }

                <societaVigilante> prodotti-qualita:nazione ?nazione.
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

    query += '<' + societaVigilante + '> prodotti-qualita:haNome ?nome.'
    query += 'OPTIONAL{<' + societaVigilante + '> prodotti-qualita:haFax ?fax.}'
    query += '<' + societaVigilante + '> prodotti-qualita:haIndirizzo ?indirizzo.'
    query += '<' + societaVigilante + '> prodotti-qualita:haCAP ?cap.'
    query += 'OPTIONAL{<' + societaVigilante + '> prodotti-qualita:haPartitaIVA ?partitaIva.}'
    query += '<' + societaVigilante + '> prodotti-qualita:haSitoWeb ?sitoWeb.'
    query += '<' + societaVigilante + '> prodotti-qualita:haEmail ?email.'
    query += '<' + societaVigilante + '> prodotti-qualita:haNumeroDiTelefono ?numeroTelefono.'

    query += '<' + societaVigilante + `> prodotti-qualita:citta ?citta.
            GRAPH ?g1{
                ?citta l0:name ?nomeCitta.
            }`

    query += '<' + societaVigilante + `> prodotti-qualita:provincia ?provincia.
            GRAPH ?g2{
                ?provincia l0:name ?nomeProvincia.
            }`

    query += '<' + societaVigilante + `> prodotti-qualita:nazione ?nazione.
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

            SELECT ?nome, ?indirizzo, ?cap, ?sitoWeb, ?email, ?numeroTelefono, ?fax, ?partitaIva, ?nomeCitta, ?nomeProvincia, ?nomeNazione

            FROM NAMED <http://localhost:8890/cities>
            FROM NAMED <http://localhost:8890/provinces>
            FROM NAMED <http://localhost:8890/italy>

            WHERE{
                <consorzioTutela> prodotti-qualita:haNome ?nome.
                <consorzioTutela> prodotti-qualita:haIndirizzo ?indirizzo.
                <consorzioTutela> prodotti-qualita:haCAP ?cap.
                OPTIONAL{<consorzioTutela> prodotti-qualita:haSitoWeb ?sitoWeb.}
                <consorzioTutela> prodotti-qualita:haEmail ?email.
                OPTIONAL{<consorzioTutela> prodotti-qualita:haNumeroDiTelefono ?numeroTelefono.}
                OPTIONAL{<consorzioTutela> prodotti-qualita:haFax ?fax.}
                OPTIONAL{<consorzioTutela> prodotti-qualita:haPartitaIVA ?partitaIva.}

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

    var query = `SELECT ?nome, ?indirizzo, ?cap, ?sitoWeb, ?email, ?numeroTelefono, ?fax, ?partitaIva, ?nomeCitta, ?nomeProvincia, ?nomeNazione

                FROM NAMED <http://localhost:8890/cities>
                FROM NAMED <http://localhost:8890/provinces>
                FROM NAMED <http://localhost:8890/italy>

                WHERE{`

    query += '<' + consorzioTutela + '> prodotti-qualita:haNome ?nome.'
    query += '<' + consorzioTutela + '> prodotti-qualita:haIndirizzo ?indirizzo.'
    query += '<' + consorzioTutela + '> prodotti-qualita:haCAP ?cap.'
    query += 'OPTIONAL{<' + consorzioTutela + '> prodotti-qualita:haSitoWeb ?sitoWeb.}'
    query += '<' + consorzioTutela + '> prodotti-qualita:haEmail ?email.'
    query += 'OPTIONAL{<' + consorzioTutela + '> prodotti-qualita:haNumeroDiTelefono ?numeroTelefono.}'
    query += 'OPTIONAL{<' + consorzioTutela + '> prodotti-qualita:haFax ?fax.}'
    query += 'OPTIONAL{<' + consorzioTutela + '> prodotti-qualita:haPartitaIVA ?partitaIva.}'

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

            SELECT ?nome, ?indirizzo, ?cap, ?email, ?numeroTelefono, ?sitoWeb, ?nomeCitta, ?nomeProvincia, ?nomeNazione

            FROM NAMED <http://localhost:8890/cities>
            FROM NAMED <http://localhost:8890/provinces>
            FROM NAMED <http://localhost:8890/italy>

            WHERE{
                <azienda> prodotti-qualita:haNome ?nome.
                <azienda> prodotti-qualita:haIndirizzo ?indirizzo.
                <azienda> prodotti-qualita:haCAP ?cap.
                OPTIONAL{<azienda> prodotti-qualita:haEmail ?email.}
                OPTIONAL{<azienda> prodotti-qualita:haNumeroDiTelefono ?numeroTelefono.}
                OPTIONAL{<azienda> prodotti-qualita:haSitoWeb ?sitoWeb.}

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

    var query = `SELECT ?nome, ?indirizzo, ?cap, ?email, ?numeroTelefono, ?sitoWeb, ?nomeCitta, ?nomeProvincia, ?nomeNazione

                FROM NAMED <http://localhost:8890/cities>
                FROM NAMED <http://localhost:8890/provinces>
                FROM NAMED <http://localhost:8890/italy>

                WHERE{`

    query += '<' + azienda + '> prodotti-qualita:haNome ?nome.'
    query += '<' + azienda + '> prodotti-qualita:haIndirizzo ?indirizzo.'
    query += '<' + azienda + '> prodotti-qualita:haCAP ?cap.'
    query += 'OPTIONAL{<' + azienda + '> prodotti-qualita:haEmail ?email.}'
    query += 'OPTIONAL{<' + azienda + '> prodotti-qualita:haNumeroDiTelefono ?numeroTelefono.}'
    query += 'OPTIONAL{<' + azienda + '> prodotti-qualita:haSitoWeb ?sitoWeb.}'

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
                OPTIONAL{<evento> prodotti-qualita:haIndirizzo ?indirizzo.}
                OPTIONAL{<evento> prodotti-qualita:organizzatore ?organizzatore.}
                <evento> prodotti-qualita:nelMese ?mese.
                OPTIONAL{<evento> prodotti-qualita:haSitoWeb ?sitoWeb.}

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
    query += 'OPTIONAL{<' + evento + '> prodotti-qualita:haIndirizzo ?indirizzo.}'
    query += 'OPTIONAL{<' + evento + '> prodotti-qualita:organizzatore ?organizzatore.}'
    query += '<' + evento + '> prodotti-qualita:nelMese ?mese.'
    query += 'OPTIONAL{<' + evento + '> prodotti-qualita:haSitoWeb ?sitoWeb.}'

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