function getData()
{
    $.ajax({
        method: 'POST',
        url: '/QualityMarks/aQuery',
        data: '',
        dataType: 'json'
    }).done(function(data){
        $('#x').text(data[0].z.value)
    })
}

function retrievalData()
{
    getData();
}