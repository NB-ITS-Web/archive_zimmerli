$( document ).ready( function(){

  $('li.quick-search').html('<a href="http://search.rutgers.edu/web.html" target="_blank" title="Universitywide Search">Universitywide Search</a>').show();

  $('#edit-search-theme-form-1').focus( function(){
    $(this).css('width', '112px');
    $('#edit-search-theme-form-1-wrapper').css('width', '122px');
    $('#search-box').css('width', '150px');
    $(this).val('');
    $(this).css('text-transform', 'none');

  });
  
  $('#edit-search-theme-form-1').blur( function(){
	if( $(this).val() == '' ){
    $(this).css('width', '46px');
    $('#edit-search-theme-form-1-wrapper').css('width', '56px');
    $('#search-box').css('width', '83px');

    $(this).css('text-transform', 'uppercase');
    $(this).val('Search');
	}
  });
  
  $('#search-box form a.submit').click( function(){
	    $('#search-box form').submit();
	    return false;
	  });

  $("#content ul.collapsible li h2").append("<span class='arrow'></span>")

  $('#content ul.collapsible li h2').hover(

    function(){ $(this).find('span').addClass('hover') },
    function(){ $(this).find('span').removeClass('hover') }

  );
  
  $("#content ul.collapsible li:odd").addClass('odd');
  $("#content ul.collapsible li:even").addClass('even');
  $("#content ul.collapsible li:last").addClass('last');
  
  $('#content ul.collapsible li h2').click( function(){
  
  	
  	if( $(this).parent().hasClass('open') ){
  	
  		$('ul.collapsible li').each( function(i, item){
  			$(item).removeClass('open');
  		})
  		
  	}else{
  	
  		$('ul.collapsible li').each( function(i, item){
  			$(item).removeClass('open');
  		})
  		
  		$(this).parent().addClass('open')
  	}
  	
  
  	return false;
  
  });

});