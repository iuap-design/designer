/**
 * Created by chief on 16/8/16.
 */

define('page',['./../viewModel/pageSettingModel'],function(model){

    var init = function(container){


        function drag (){
            var panel = require('html!../../../static/page/panel/panel.html');
            var page = require('html!./../../../static/page/page/page.html');
            $(container).append(panel).find('.edit-panel-body').append(page);

            ko.applyBindings(model,$(container).find('.edit-panel-body')[0]);
            require.ensure(['./../../trd/jquery-ui/jquery-ui'],function(ui){
                var ui = require('./../../trd/jquery-ui/jquery-ui');
                $('body > .drag-overlay > .edit-panel').draggable();
            });
        }

        $("#pageSetting").on('click',function(){
            if($('body > .drag-overlay').length==0){
                drag();
            }
        })

    };

    return {
        init:init
    }
})