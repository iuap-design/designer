/**
 * Created by chief on 16/7/15.
 */

define('template', [], function (a) {

    var template = function (options) {

        var container = options.container;
        var id = options.id + ".html" || "template.html";

        var template = require('html!../../static/page/template/' + id);

        $(container).html(template);

        this.drag('.widgetBox');
    };
    template.prototype = {
        html:function(){

        },
        drag:function(elements){
            require.ensure(['./../trd/jquery-ui/jquery-ui'],function(ui){
                var ui = require('./../trd/jquery-ui/jquery-ui');
                $(elements).sortable({
                    placeholder: "ui-portlet-placeholder",
                    connectWith: elements,
                    forcePlaceholderSize: true,
                    stop: function (i,ui) {
                        //console.log(i);
                    },
                    over: function () {

                    }
                }).disableSelection();
            });
        }
    };



    return {
        init: template
    }
});