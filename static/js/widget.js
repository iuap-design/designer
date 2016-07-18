/**
 * Created by chief on 16/7/15.
 */
define('widget',[],function(){
    var init = function (container){

        var template =  require('html!../../static/page/widget.html');


        $(container).html(template);
    };

    return {
        init:init
    }
});