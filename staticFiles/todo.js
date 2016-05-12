$( document ).ready(function() {

  var addressPicker = new AddressPicker();

  $('#address').typeahead(null, {
    displayKey: 'description',
    source: addressPicker.ttAdapter()
  });
  jQuery('#datetimepicker').datetimepicker();


  $("#addTODO").click(function(){
    $.ajax({
      url: '/add-todo',
      data:{
        "title":$('#title').val(),
        "location":$('#address').val(),
        "timestamp":Date.parse($('#datetimepicker').val())
      },
      success: function(data) {
        location.reload();
      },
      type: 'POST'
    });
    return false;
  });
  $('#addTODO').submit(function(e){e.preventDefault();});

});
