var selezionaOption = '<option selected="selected" value="">Seleziona...</option>'

var provincieAbruzzo = `<optgroup label="Abruzzo">
                            <option value="Chieti">Chieti</option>
                            <option value="L'Aquila">L'Aquila</option>
                            <option value="Pescara">Pescara</option>
                            <option value="Teramo">Teramo</option>
                        </optgroup>`

var provincieBasilicata = `<optgroup label="Abruzzo">
                                <option value="Matera">Matera</option>
                                <option value="Potenza">Potenza</option>
                            </optgroup>`

var provincieCalabria = `<optgroup label="Calabria">
                            <option value="Catanzaro">Catanzaro</option>
                            <option value="Cosenza">Cosenza</option>
                            <option value="Crotone">Crotone</option>
                            <option value="Reggio di Calabria">Reggio Calabria</option>
                            <option value="Vibo Valentia">Vibo Valentia</option>
                        </optgroup>`

var provincieCampania = `<optgroup label="Campania">
                            <option value="Avellino">Avellino</option>
                            <option value="Benevento">Benevento</option>
                            <option value="Caserta">Caserta</option>
                            <option value="Napoli">Napoli</option>
                            <option value="Salerno">Salerno</option>
                        </optgroup>`

var provincieEmiliaRomagna = `<optgroup label="Emilia-Romagna">
                            <option value="Bologna">Bologna</option>
                            <option value="Ferrara">Ferrara</option>
                            <option value="Forlì-Cesena">Forlì-Cesena</option>
                            <option value="Modena">Modena</option>
                            <option value="Parma">Parma</option>
                            <option value="Piacenza">Piacenza</option>
                            <option value="Ravenna">Ravenna</option>
                            <option value="Reggio nell'Emilia">Reggio Emilia</option>                            
                            <option value="Rimini">Rimini</option>
                        </optgroup>`


var provincieFriuliVeneziaGiulia = `<optgroup label="Friuli-Venezia Giulia">
                            <option value="Gorizia">Gorizia</option>
                            <option value="Pordenone">Pordenone</option>
                            <option value="Trieste">Trieste</option>
                            <option value="Udine">Udine</option>
                        </optgroup>`

var provincieLazio = `<optgroup label="Lazio">
                        <option value="Frosinone">Frosinone</option>
                        <option value="Latina">Latina</option>
                        <option value="Rieti">Rieti</option>
                        <option value="Roma">Roma</option>
                        <option value="Viterbo">Viterbo</option>
                    </optgroup>`

var provincieLiguria = `<optgroup label="Liguria">
                        <option value="Genova">Genova</option>
                        <option value="Imperia">Imperia</option>
                        <option value="La Spezia">La Spezia</option>
                        <option value="Savona">Savona</option>
                       </optgroup>`

var provincieLombardia = `<optgroup label="Lombardia">
                            <option value="Bergamo">Bergamo</option>
                            <option value="Brescia">Brescia</option>
                            <option value="Como">Como</option>
                            <option value="Cremona">Cremona</option>
                            <option value="Lecco">Lecco</option>
                            <option value="Lodi">Lodi</option>
                            <option value="Mantova">Mantova</option>
                            <option value="Milano">Milano</option>
                            <option value="Monza e della Brianza">Monza e Brianza</option>
                            <option value="Pavia">Pavia</option>
                            <option value="Sondrio">Sondrio</option>
                            <option value="Varese">Varese</option>
                        </optgroup>`

var provincieMarche = `<optgroup label="Marche">
                        <option value="Ancona">Ancona</option>
                        <option value="Ascoli Piceno">Ascoli Piceno</option>
                        <option value="Fermo">Fermo</option>
                        <option value="Macerata">Macerata</option>
                        <option value="Pesaro e Urbino">Pesaro e Urbino</option>
                       </optgroup>`

var provincieMolise = `<optgroup label="Molise">
                        <option value="Campobasso">Campobasso</option>
                        <option value="Isernia">Isernia</option>
                       </optgroup>`

var provinciePiemonte = `<optgroup label="Piemonte">
                        <option value="Alessandria">Alessandria</option>
                        <option value="Asti">Asti</option>
                        <option value="Biella">Biella</option>
                        <option value="Cuneo">Cuneo</option>
                        <option value="Novara">Novara</option>
                        <option value="Torino">Torino</option>
                        <option value="Verbano-Cusio-Ossola">Verbano-Cusio-Ossola</option>
                        <option value="Vercelli">Vercelli</option>
                       </optgroup>`

var provinciePuglia = `<optgroup label="Puglia">
                        <option value="Bari">Bari</option>
                        <option value="Barletta-Andria-Trani">Barletta-Andria-Trani</option>
                        <option value="Brindisi">Brindisi</option>
                        <option value="Foggia">Foggia</option>
                        <option value="Lecce">Lecce</option>
                        <option value="Taranto">Taranto</option>
                       </optgroup>`

var provincieSardegna = `<optgroup label="Sardegna">
                        <option value="Cagliari">Cagliari</option>
                        <option value="Nuoro">Nuoro</option>
                        <option value="Oristano">Oristano</option>
                        <option value="Sassari">Sassari</option>
                        <option value="Sud Sardegna">Sud Sardegna</option>
                       </optgroup>`

var provincieSicilia = `<optgroup label="Sicilia">
                       <option value="Agrigento">Agrigento</option>
                       <option value="Caltanissetta">Caltanissetta</option>
                       <option value="Catania">Catania</option>
                       <option value="Enna">Enna</option>
                       <option value="Messina">Messina</option>
                       <option value="Palermo">Palermo</option>
                       <option value="Ragusa">Ragusa</option>
                       <option value="Siracusa">Siracusa</option>
                       <option value="Trapani">Trapani</option>
                      </optgroup>`

var provincieToscana = `<optgroup label="Toscana">
                       <option value="Arezzo">Arezzo</option>
                       <option value="Firenze">Firenze</option>
                       <option value="Grosseto">Grosseto</option>
                       <option value="Livorno">Livorno</option>
                       <option value="Lucca">Lucca</option>
                       <option value="Massa-Carrara">Massa-Carrara</option>
                       <option value="Pisa">Pisa</option>
                       <option value="Pistoia">Pistoia</option>
                       <option value="Prato">Prato</option>
                       <option value="Siena">Siena</option>
                      </optgroup>`

var provincieTrentinoAltoAdige = `<optgroup label="Trentino-Alto Adige">
                        <option value="Bolzano">Bolzano</option>
                        <option value="Trento">Trento</option>
                       </optgroup>`

var provincieUmbria = `<optgroup label="Umbria">
                        <option value="Perugia">Perugia</option>
                        <option value="Terni">Terni</option>
                       </optgroup>`

var provincieValleAosta = `<optgroup label="Valle d'Aosta">
                        <option value="Aosta">Aosta</option>
                       </optgroup>`

var provincieVeneto = `<optgroup label="Veneto">
                            <option value="Belluno">Belluno</option>
                            <option value="Padova">Padova</option>
                            <option value="Rovigo">Rovigo</option>
                            <option value="Treviso">Treviso</option>
                            <option value="Venezia">Venezia</option>
                            <option value="Verona">Verona</option>
                            <option value="Vicenza">Vicenza</option>
                        </optgroup>`


$(document).ready( () => {
    changeProvincie($('#inputRegione'))
})

function changeProvincie(selectRegione){
    var optionSelected = selectRegione.value
    
    var select = $('#inputProvincia')

    if((optionSelected === undefined) || (optionSelected === "")){
        select.empty().append(selezionaOption)
        .append(provincieAbruzzo)
        .append(provincieBasilicata)
        .append(provincieCalabria)
        .append(provincieCampania)
        .append(provincieEmiliaRomagna)
        .append(provincieFriuliVeneziaGiulia)
        .append(provincieLazio)
        .append(provincieLiguria)
        .append(provincieLombardia)
        .append(provincieMarche)
        .append(provincieMolise)
        .append(provinciePiemonte)
        .append(provinciePuglia)
        .append(provincieSardegna)
        .append(provincieSicilia)
        .append(provincieToscana)
        .append(provincieTrentinoAltoAdige)
        .append(provincieUmbria)
        .append(provincieValleAosta)
        .append(provincieVeneto)
    }else if(optionSelected === "Abruzzo"){
        select.empty().append(selezionaOption)
        .append(provincieAbruzzo)
    }else if(optionSelected === "Basilicata"){
        select.empty().append(selezionaOption)
        .append(provincieBasilicata)
    }else if(optionSelected === "Calabria"){
        select.empty().append(selezionaOption)
        .append(provincieCalabria)
    }else if(optionSelected === "Campania"){
        select.empty().append(selezionaOption)
        .append(provincieCampania)
    }else if(optionSelected === "Emilia-Romagna"){
        select.empty().append(selezionaOption)
        .append(provincieEmiliaRomagna)
    }else if(optionSelected === "Friuli-Venezia Giulia"){
        select.empty().append(selezionaOption)
        .append(provincieFriuliVeneziaGiulia)
    }else if(optionSelected === "Lazio"){
        select.empty().append(selezionaOption)
        .append(provincieLazio)
    }else if(optionSelected === "Liguria"){
        select.empty().append(selezionaOption)
        .append(provincieLiguria)
    }else if(optionSelected === "Lombardia"){
        select.empty().append(selezionaOption)
        .append(provincieLombardia)
    }else if(optionSelected === "Marche"){
        select.empty().append(selezionaOption)
        .append(provincieMarche)
    }else if(optionSelected === "Molise"){
        select.empty().append(selezionaOption)
        .append(provincieMolise)
    }else if(optionSelected === "Piemonte"){
        select.empty().append(selezionaOption)
        .append(provinciePiemonte)
    }else if(optionSelected === "Puglia"){
        select.empty().append(selezionaOption)
        .append(provinciePuglia)
    }else if(optionSelected === "Sardegna"){
        select.empty().append(selezionaOption)
        .append(provincieSardegna)
    }else if(optionSelected === "Sicilia"){
        select.empty().append(selezionaOption)
        .append(provincieSicilia)
    }else if(optionSelected === "Toscana"){
        select.empty().append(selezionaOption)
        .append(provincieToscana)
    }else if(optionSelected === "Trentino-Alto Adige/Südtirol"){
        select.empty().append(selezionaOption)
        .append(provincieTrentinoAltoAdige)
    }else if(optionSelected === "Umbria"){
        select.empty().append(selezionaOption)
        .append(provincieUmbria)
    }else if(optionSelected === "Valle d'Aosta/Vallée d'Aoste"){
        select.empty().append(selezionaOption)
        .append(provincieValleAosta)
    }else if(optionSelected === "Veneto"){
        select.empty().append(selezionaOption)
        .append(provincieVeneto)
    }
}

// Generale
$('#form').on('keyup keypress', function(e) {
    var keyCode = e.keyCode || e.which

    if(keyCode === 13){
        e.preventDefault()
        query()
        return false
    }
})

function query(){
    $('#loader').removeClass('fadeOut')

    var request = {}

    request['citta'] = $('#inputCitta').val()
    request['nazione'] = $('#inputNazione').val()
    request['regione'] = $('#inputRegione').val()
    request['provincia'] = $('#inputProvincia').val()
    request['mese'] = $('#inputMese').val()
    request['categoria'] = $('#inputCategoria').val()
    request['ordinamento'] = $('#inputOrdine').val()
    request['ordinamentoModo'] = $('#inputOrdineModo').val()

    $.ajax({
        method: 'POST',
        url: '/QualityMarks/ricercaEventiQuery',
        data: request,
        dataType: 'json'
    }).done(function(data){
        var attach

        if(data.length == 0){
            attach = `<div class="bgc-white p-20 bd">
                            <h5 style="text-align: center;" class="c-grey-900">Nessun risultato</h5>
                        </div>`
        }else{
            attach = `<div class="bgc-white p-20 bd">
                            <h5 class="c-grey-900">Risultati:</h5>
                                <div class="mT-30" style="margin-top: 0px !important;">
                                    <div class="layer w-100 fxg-1 scrollable pos-r">
                                        <div>`

            data.forEach(element => {
                var node = `<div class="email-list-item peers fxw-nw p-20 bdB bgcH-grey-100">
                                    <div class="peer peer-greed ov-h">
                                        <h5 class="fsz-def tt-c c-grey-900">` + element.titolo.value + `</h5>
                                        <span>Tipologia: ` + element.tipologia.value + `</span>
                                        <br/>
                                        <span>Periodo: ` + element.mese.value + `</span>
                                        <br/>
                                        <span>`
                
                if(element.indirizzo.value !== ""){
                    node += element.indirizzo.value + ` - `
                }
                
                node += element.nomeCitta.value + ` (` + element.nomeProvincia.value + `), ` + element.nomeRegione.value + `, ` + element.nomeNazione.value + `</span>
                                        <br/>
                                        <span>Organizzatore: ` + element.organizzatore.value + `</span>
                                        <br/>
                                        <span>Sito Web: `

                if(element.sitoWeb.value !== "-"){
                    node += `<a href="` + element.sitoWeb.value + `" target="_blank">` + element.sitoWeb.value + `</a></span>`
                }else{
                    node += '-'
                }

                node += `</div></div>`

                attach += node
            })

            attach += `</div></div></div></div>`
        }

        $('#res').empty()
        $('#res').append(attach)

        $('#loader').addClass('fadeOut')
    })
}