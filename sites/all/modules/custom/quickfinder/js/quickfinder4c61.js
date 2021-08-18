$( document ).ready( function(){

    $("#quickfinder").insertAfter("#sliver");
    $("#sliver .quickfinder").click( function(){
        rel = $(this).attr('rel');
        if( rel == 'show' ){
            $('#quickfinder').show();
             $('#sliver .university-search').hide();
           
            $(this).attr('rel', 'hide').html('Hide Quickfinder').addClass('hide-quickfinder');
             $(this).removeClass('show-quickfinder');
        }else{
            $('#quickfinder').hide();
            $('#sliver .university-search').show();
            $(this).attr('rel','show').html('Show Quickfinder').addClass('show-quickfinder');
             $(this).removeClass('hide-quickfinder');
        }

        return false;
    });


    $('#quickfinder-search-form .navigation a').click( function(){
      $('#quickfinder-search-form').attr( 'action', $(this).attr('href') );
      $('#quickfinder-search-form .navigation a').removeClass('active');
      $(this).addClass('active');

      
      $('#quickfinder-search-form .description').html( $(this).attr('rel') );

       return false;
      });

      $('#quickfinder-search-form').submit( function(){

       window.location = $(this).attr('action') + "?q=" + $('#quickfinder-search-form .form-text').val();
       return false;
    });

});