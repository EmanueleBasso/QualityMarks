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

    $.ajax({
        method: 'POST',
        url: '/QualityMarks/ricercaEventiQuery',
        data: request,
        dataType: 'json'
    }).done(function(data){
        var attach

        if(data.length == 0){
            $('#res').empty()
            attach = `<div class="bgc-white p-20 bd">
                            <h5 style="text-align: center;" class="c-grey-900">Nessun risultato</h5>
                        </div>`
            $('#res').append(attach)
        }else{
            $('#res').empty()
            attach = `<div id="map" style="padding-bottom: 75%;"></div>`
            $('#res').append(attach)

            var map = L.map('map')

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map)

            var latLonMarkers = []
            var popupTextMarkers = []
                
            data.forEach(element => {
                if (element.lat !== undefined)
                {
                    var alreadyInserted = false
                    var popupText = ''
                    var pos = -1

                    for(var i=0; i < latLonMarkers.length; i++) {
                        if((element.lat == latLonMarkers[i][0]) && (element.lon == latLonMarkers[i][1])) {
                            alreadyInserted = true
                            pos = i
                            popupText = popupTextMarkers[i]
                            popupText += '<hr/>'
                            break
                        }
                    }

                    popupText += '<b>' + element.titolo.value + '</b><br/>Tipologia: ' +  element.tipologia.value + '<br/>Periodo: ' + element.mese.value + '<br/>'
                    if(element.indirizzo.value !== "")
                    {
                        popupText += element.indirizzo.value + ' - '
                    }
                    popupText += element.nomeCitta.value + ' (' + element.nomeProvincia.value + '), ' + element.nomeRegione.value + ', ' + element.nomeNazione.value
                    popupText += '<br/>Organizzatore: ' + element.organizzatore.value + '<br/>Sito Web: '
                    if(element.sitoWeb.value !== "-")
                    {
                        popupText += '<a href="' + element.sitoWeb.value + '" target="_blank">' + element.sitoWeb.value + '</a>'
                    }
                    else
                    {
                        popupText += '-'
                    }

                    if(alreadyInserted) {
                        popupTextMarkers[pos] = popupText
                    } else {
                        latLonMarkers.push([element.lat, element.lon])
                        popupTextMarkers.push(popupText)
                    }
                }
            })

            for(var i=0; i < latLonMarkers.length; i++) {
                var marker = new L.Marker(latLonMarkers[i])
                marker.bindPopup(popupTextMarkers[i])
                marker.addTo(map)
            }

            var bounds = new L.LatLngBounds(latLonMarkers);
            map.fitBounds(bounds)
            map.setZoom(map.getZoom() - 1)
        }

        $('#loader').addClass('fadeOut')
    })
}