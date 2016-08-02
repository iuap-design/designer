/**
 * Created by chief on 16/7/16.
 */

define('widget',[],function(){
    var init = function (){
        
        var viewModel = {
            carousels: ko.observableArray(widgetViewModel)
        }
    };
    return {
        init:init
    }
});
