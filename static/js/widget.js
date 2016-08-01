/**
 * Created by chief on 16/7/16.
 */

define('widget',[],function(){
    var init = function (el,name){

        $.getJSON('../page/widgetdata/'+name+'.json',function(widgetViewModel){
            
            var viewModel = {
                carousels: ko.observableArray(widgetViewModel)
            }
            ko.applyBindings(viewModel,el);  
            if(name == "widget7"){
                setTimeout(function(){
                    console.log($('#carousel-example-generic'));
                    $('#carousel-example-generic').carousel();
                }, 5000 );
            }
            
        });
           

       
    };
    return {
        init:init
    }
});
