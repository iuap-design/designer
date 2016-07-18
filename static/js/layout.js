/**
 * Created by chief on 16/7/16.
 */

define('layout',[],function(){
    var init = function (container){

        var template =  require('html!../../static/page/layout.html');


        $(container).html(template);
    };

    return {
        init:init
    }
});
