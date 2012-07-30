$(function() {
   $('ul.picsList li').hover(function(){
   		$(this).find('.highlight').children().addClass('reveal');
   } ,function(){
  		$(this).find('.highlight').children().removeClass('reveal');
	});

   $('.like').click(function(){
   	
   		$(this).append('<div class="heartAni"></div>');
   		$(this).find('.heartAni').animate({height:"50px", width:"50px", marginTop: "-15px",
marginLeft: "-13px"}, 100);
   		$(this).find('.heartAni').fadeTo(150, 0)
   });
});