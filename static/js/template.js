/**
 * Created by chief on 16/7/15.
 */

define('resize',[],function(){
   var init = function (options){

       var container = options.container;
       var id = options.id+".html" || "template.html";

       var template =  require('html!../../static/page/template/'+id);

       $(container).html(template);
   };

    return {
        init:init
    }
});