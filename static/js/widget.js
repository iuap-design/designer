/**
 * Created by chief on 16/7/15.
 */
define('widget',[],function(){
    var init = function (container){

        var template =  require('html!../../static/page/widget.html');

        $(container).html(template);
        drag(".widget-list li");

        widgetshow();
    };

    var widgetshow = function(){
        var widget  = $('.widget-select');
        var widgetContent = $('.widget-list');

        widget.on('change',function(e){
            var i = $(this).find("option:selected").index();
            widgetContent.hide();
            widgetContent.eq(i).show();
        })
    }

    var drag = function(elements){
        require.ensure(['./../trd/jquery-ui/jquery-ui'],function(ui) {
            var ui = require('./../trd/jquery-ui/jquery-ui');
            $(elements).draggable({
                connectToSortable: ".widgetBox",
                helper: function(event, ui){
                    var i = $(this).index(0)+1;
                    var template = require('html!../../static/page/widget/widget'+i+'.html');

                    return $(template);
                },
                start:function(event,ui){
                    ui.helper.css('width',"300px");
                },
                snapMode: "outer",
                stop: function (event, ui) {
                    ui.helper.removeAttr("style");
                }
            });
        });
    };
    return {
        init:init
    }
});