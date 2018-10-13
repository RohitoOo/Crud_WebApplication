$(document).ready( function () {


$('.deteleSong').on('click', function(e) {

$target = $(e.target);
const id = $target.attr('data-id') ;

$.ajax({
  type: 'DELETE',
  url : '/songs/'+id,
  success : function(response){
    alert('Deleteting Song');
    window.location.href='/home'
  },
  error: function (err) {
    console.log(err);
  }
})

});

});