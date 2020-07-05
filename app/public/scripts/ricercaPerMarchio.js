function query(){
    $('#loader').removeClass('fadeOut')

    var request = {}

    request['marchio'] = $('#inputMarchio').val()
    request['categoria'] = $('#inputCategoria').val()
    request['regione'] = $('#inputRegione').val()
    request['nazione'] = $('#inputNazione').val()
    request['ordinamento'] = $('#inputOrdine').val()
    request['ordinamentoModo'] = $('#inputOrdineModo').val()

    $.ajax({
        method: 'POST',
        url: '/QualityMarks/ricercaPerMarchioQuery',
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
                var node = `<form method="POST" action="/QualityMarks/infoProdottoAlimentare">
                                <input type="hidden" name="iriProdotto" value="` + element.individual.value + `" />
                                <input type="hidden" name="nomeMarchio" value="` + element.nomeMarchio.value + `" />
                                <input type="hidden" name="nomeNazione" value="` + element.nomeNazione.value + `" />
                                <input type="hidden" name="nomeRegione" value="` + element.nomeRegione.value + `" />
                                <input type="hidden" name="tipologia" value="` + element.tipologia.value + `" />
                                <div class="email-list-item peers fxw-nw p-20 bdB bgcH-grey-100 cur-p" onclick="this.parentNode.submit()">
                                    <div class="peer peer-greed ov-h">
                                        <h5 class="fsz-def c-grey-900" style="float:left;">` + element.nomeProdotto.value + `&nbsp;</h5><h5 class="fsz-def">(` + element.nomeMarchio.value + `)</h5>
                                        <div class="peers ai-c">
                                            <div class="peer peer-greed"><h6>` + element.tipologia.value + `</h6></div>
                                        </div>
                                        <span class="whs-nw w-100 ov-h tov-e d-b">Nazione: ` + element.nomeNazione.value + `&emsp;&emsp;&emsp;Regione: ` + element.nomeRegione.value + `</span>
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