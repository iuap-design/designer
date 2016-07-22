/**
 * Created by chief on 16/7/15.
 */
define('widget',[],function(){
    var init = function (container){

        var template =  require('html!../../static/page/widget.html');

        $(container).html(template);
        drag(".widget-list li");

        

        widgetshow();

        widgetContentShow();
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
    /*
        侧边工具二级菜单显示
    */
    var widgetContentShow = function(){
        var widgetContent = $(".widget-list li");
        var widgetContainer = $("#sidebar-container");

         widgetContent.on('mouseenter',function(){
            $(".second-widget").hide();
            var widget = $(this).attr("widget")
            if($("#"+widget+"container").length === 0){
                var template = require('html!../../static/page/widget/'+widget+'.html');
                var secondWidgetContainer = "<div id='"+widget+"container' class='second-widget'>"+template+"</div>";
                $(this).after(secondWidgetContainer);
                if(widget === "checkbox" || widget == "radio"){
                   // 如果是checkbox或者radio需要调用样式方法初始化样式
                    u.compMgr.updateComp();
                }
            }
            $("#"+widget+"container").show();
         })

         widgetContainer.on('mouseleave',function(){
            $(".second-widget").hide();
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