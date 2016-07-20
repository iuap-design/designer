/**
 * Created by chief on 16/7/16.
 */

define('layout',[],function(){
    var init = function (container){

        var template =  require('html!../../static/page/layout.html');


        $(container).html(template);

        $(container).find(".layout-btn").bind("click",function(){
        	$(container).find(".active").removeClass("active");
        	$(this).addClass("active");
        })
    };

    return {
        init:init
    }
});
