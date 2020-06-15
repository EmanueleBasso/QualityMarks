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
    var request = {}

    request['query'] = $('#inputQuery').val()
    request['marchio'] = $('#inputMarchio').val()
    request['categoria'] = $('#inputCategoria').val()
    request['regione'] = $('#inputRegione').val()
    request['nazione'] = $('#inputNazione').val()

    $.ajax({
        method: 'POST',
        url: '/QualityMarks/ricercaProdottoAlimentareQuery',
        data: request,
        dataType: 'json'
    }).done(function(data){
        var attach = `<div class="bgc-white p-20 bd">
                        <h5 class="c-grey-900">Risultati</h5>
                            <div class="mT-30">
                                <div class="layer w-100 fxg-1 scrollable pos-r">
                                    <div>`

        data.forEach(element => {
            var node = `<form method="POST" action="/QualityMarks/infoProdottoAlimentare">
                            <input type="hidden" name="iriProdotto" value="` + element.individual.value + `" />
                            <div class="email-list-item peers fxw-nw p-20 bdB bgcH-grey-100 cur-p" onclick="this.parentNode.submit()">
                                <div class="peer peer-greed ov-h">
                                    <div class="peers ai-c">
                                        <div class="peer peer-greed"><h6>` + element.nomeMarchio.value + `</h6></div>
                                    </div>
                                    <h5 class="fsz-def tt-c c-grey-900">` + element.nomeProdotto.value + `</h5>
                                    <span class="whs-nw w-100 ov-h tov-e d-b">Nazione: ` + element.nomeNazione.value + `&emsp;&emsp;&emsp;Regione: ` + element.nomeRegione.value + `</span>
                                </div>
                            </div>
                        </form>`
        
            attach += node
        })

        attach += `</div></div></div></div>`

        $('#res').empty()
        $('#res').append(attach)
    })
}