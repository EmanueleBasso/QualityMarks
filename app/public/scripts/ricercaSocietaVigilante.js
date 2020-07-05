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

    request['nomeSocieta'] = $('#inputNomeSocieta').val()
    request['citta'] = $('#inputCitta').val()
    request['nazione'] = $('#inputNazione').val()
    request['regione'] = $('#inputRegione').val()
    request['provincia'] = $('#inputProvincia').val()
    request['ordinamento'] = $('#inputOrdine').val()
    request['ordinamentoModo'] = $('#inputOrdineModo').val()

    $.ajax({
        method: 'POST',
        url: '/QualityMarks/ricercaSocietaVigilanteQuery',
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
                var node = `<form method="POST" action="/QualityMarks/infoSocietaVigilante">
                                <input type="hidden" name="iriSocieta" value="` + element.individual.value + `" />
                                <input type="hidden" name="nomeCitta" value="` + element.nomeCitta.value + `" />
                                <input type="hidden" name="nomeProvincia" value="` + element.nomeProvincia.value + `" />
                                <input type="hidden" name="nomeRegione" value="` + element.nomeRegione.value + `" />
                                <input type="hidden" name="nomeNazione" value="` + element.nomeNazione.value + `" />
                                <div class="email-list-item peers fxw-nw p-20 bdB bgcH-grey-100 cur-p" onclick="this.parentNode.submit()">
                                    <div class="peer peer-greed ov-h">
                                        <h5 class="fsz-def c-grey-900">` + element.nomeSocieta.value + `</h5>
                                        <span>` + element.indirizzo.value + ` - ` + element.cap.value + ` ` + element.nomeCitta.value + ` (` + element.nomeProvincia.value + `), ` + element.nomeRegione.value + `, ` + element.nomeNazione.value + `</span>
                                        <br/>
                                        <span>Sito Web: <a href="` + element.sitoWeb.value + `" target="_blank" onclick="event.stopPropagation();">` + element.sitoWeb.value + `</a></span>
                                    </div>
                                </div>
                            </form>`

                attach += node
            })

            attach += `</div></div></div></div>`
        }

        $('#res').empty()
        $('#res').append(attach)

        $('#loader').addClass('fadeOut')
    })
}