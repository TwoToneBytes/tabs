$(function() {
   $('ul.picsList li').hover(function(){
   		$(this).find('.highlight').children().addClass('reveal');
   } ,function(){
  		$(this).find('.highlight').children().removeClass('reveal');
	});
});