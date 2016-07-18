/**
 * Created by chief on 16/7/15.
 */

define('template',[],function(){
   var init = function (container){

       var template =  require('html!../../static/page/template.html');


       $(container).html(template);
   };

    return {
        init:init
    }
});