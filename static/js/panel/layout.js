/**
 * Created by chief on 16/8/1.
 */

define('layout',[],function(){
    var init = function (container){


        var panel = $(container).find('.layout-panel-content');
        var rows = panel.find('.u-row');

        rows.click(function(){
            var layoutBox = $(container).children().filter('[class*=u-col-md-]');

            var html = $(this).children().clone();

            layoutBox.remove();

            $(container).append(html);


            $(container).children().filter('[class*=u-col-md-]').find('.widgetBox').sortable({
                placeholder: "ui-portlet-placeholder",
                connectWith: '.widgetBox',
                forcePlaceholderSize: true,
                start:function(i,ui){

                },
                stop: function (i,ui) {
                    var target = $(ui.item);

                    sortable(target.find('.widgetBox'),'.widgetBox');
                },
                over: function () {

                }
            }).disableSelection();
        })

    };

    return {
        init:init
    }
});