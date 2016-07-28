/**
 * Created by chief on 16/7/26.
 */


define('index',[],function(){
    var init = function (container){

        var template =  require('html!../../static/page/default.html');


        $(container).html(template);

        var layoutBox = $(container).find('.layoutBox');

        $(container).on('mouseover',function(event){
            var target = $(event.target);
            var parent = target.closest('.ui-sortable');

            if(parent.length>0){
                parent.find('.widget-menubar').eq(0).show();
            }
        }).on('mouseleave',function(event){
            $('.widget-menubar').hide();
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
