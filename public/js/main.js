$(document).ready( function () {


$('.deteleSong').on('click', function(e) {

$target = $(e.target);
const id = $target.attr('data-id') ;

$.ajax({
  type: 'DELETE',
  url : '/song/'+id,
  success : function(response){
    alert('Deleteting Songs');
    window.location.href='/home'
  },
  error: function (err) {
    console.log(err);
  }
})

});

});
