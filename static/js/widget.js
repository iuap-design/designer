/**
 * Created by chief on 16/7/16.
 */

define('widget',[],function(){
    var init = function (el,name){
        var widgetViewModel = require('./viewModel/'+name+'Model.js');

        ko.applyBindings(widgetViewModel,el); 

        if(name == "widget7"){
            setTimeout(function(){
                $('#carousel-example-generic').carousel();
            }, 5000 );
        }
            
    };
    return {
        init:init
    }
});
