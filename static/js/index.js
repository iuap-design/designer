/**
 * Created by chief on 16/7/26.
 */


define('index',[],function(){
    var init = function (container){

        var template =  require('html!../../static/page/default.html');

        // 给body添加滚动条优化
        $("body").mCustomScrollbar({theme:"minimal-dark"});

        $(".nav-toggle").on("click",function(){
            $(".nav-menu").toggleClass("toggle-show");
        })

        $(container).html(template);

        var layoutBox = $(container).find('.layoutBox');

        $(container).on('mouseover',function(event){
            var target = $(event.target);
            $(container).find('.widget-menubar').hide();
            var parent = target.closest('.u-drag')||target.closest('.widgetBox');
            if(parent.length>0){
                parent.find('>.widget-menubar').eq(0).show();
            }
            else {
                $(container).find('.widget-menubar').hide();
            }
        }).on('mouseleave',function(event){
            $(container).find('.widget-menubar').hide();
        }).on('click',function(e){
            var target = $(e.target);
            if(target.hasClass('icon-cancel02')){
                target.closest('.widget-menubar').parent().remove();
            }
            if(target.hasClass('uf-pencil')){
                //layout
                if(target.closest('.u-drag').hasClass('u-row')){
                    if($(target).closest('.u-drag').find('.drag-overlay').length>0){
                        return false;
                    }
                    var layout =  require('html!../page/panel/layout.html');
                    var panelBox =  require('html!../page/panel/panel.html');
                    var container = $(target).closest('.u-drag');
                    container.append(panelBox);
                    container.find('.edit-panel-body').append(layout);

                    container.find(".edit-panel").draggable({containment:"#container-content"});

                    var layout =  require('./panel/layout');

                    layout.init(container);
                    return false;
                }

                //widget
                if($(target).closest('.u-drag').find('.u-widget').length>0){

                    return false;
                }
                var panel = $(e.target).parents(".u-widget").attr("panelname");
                var panelTemplate =  require('html!../page/panel/'+panel+'-panel.html');
                var panelBox =  require('html!../page/panel/panel.html');

                var container = $(target).closest('.u-drag');


                container.append(panelBox);
                container.find('.edit-panel-body').append(panelTemplate);

                container.find(".edit-panel").draggable({containment:"#container-content"});
     
                // 滚动条优化
                $(".edit-panel-body").mCustomScrollbar({theme:"minimal-dark"});

                var widgetViewModel = require('./viewModel/'+panel+'Model.js');



                ko.applyBindings(widgetViewModel,$(".edit-panel")[0]); 


            }
            if($(target).hasClass("uf-removesymbol")){
                $(target).closest('.drag-overlay').remove();
            }
        });

        require.ensure(['./../trd/jquery-ui/jquery-ui'],function(ui){
            var ui = require('./../trd/jquery-ui/jquery-ui');

            function sortable(elements,p) {

                p = typeof p!="undefined"?p:'.layoutBox .widgetBox';

                $(elements).sortable({
                    placeholder: "ui-portlet-placeholder",
                    connectWith: p,
                    forcePlaceholderSize: true,
                    start:function(i,ui){

                    },
                    stop: function (i,ui) {
                        var target = $(ui.item);

                        if(target.hasClass('u-widget')){
                            //sortable(target.find('.widgetBox'),'.layoutBox .widgetBox');
                        }
                        else {
                            sortable(target.find('.widgetBox'),'.widgetBox');
                        }
                    },
                    over: function () {

                    }
                }).disableSelection();
            };

            sortable(layoutBox);


            //$(elements).sortable({
            //    placeholder: "ui-portlet-placeholder",
            //    connectWith: '.widgetBox',
            //    forcePlaceholderSize: true,
            //    start:function(i,ui){
            //        $(this).find('.widget-menubar').hide();
            //    },
            //    stop: function (i,ui) {
            //        var target = $(ui.item);
            //        target.find('.widgetBox').sortable({
            //            placeholder: "ui-portlet-placeholder",
            //            connectWith:  '.widgetBox',
            //            forcePlaceholderSize: true,
            //            start:function(i,ui){
            //                $(this).find('.widget-menubar').hide();
            //            },
            //            stop: function (i,ui) {
            //                var target = $(ui.item);
            //                target.find('.widgetBox').sortable({
            //                    placeholder: "ui-portlet-placeholder",
            //                    connectWith:  '.widgetBox',
            //                    forcePlaceholderSize: true,
            //                    start:function(i,ui){
            //                        $(this).find('.widget-menubar').hide();
            //                    },
            //                    stop: function (i,ui) {
            //                        //console.log(i);
            //                    },
            //                    over: function () {
            //
            //                    }
            //                }).disableSelection();
            //            },
            //            over: function () {
            //
            //            }
            //        }).disableSelection();
            //    },
            //    over: function () {
            //
            //    }
            //}).disableSelection();
        });
    };
    
   
    return {
        init:init
    }
});
