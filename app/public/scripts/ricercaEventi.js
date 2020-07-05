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
                                        <h5 class="fsz-def c-grey-900">` + element.titolo.value + `</h5>
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
                    node += '-</span>'
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