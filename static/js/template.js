/**
 * Created by chief on 16/7/15.
 */

define('template', ['./widget'], function (widget) {

    var template = function (options) {
        var self = this;
        var container = this.container = options.container;

        var id = options.id + ".html" || "template.html";


        $.ajax({
            url:'/templates/website/'+options.id+'/index.html',
            type:'get',
            dataType:'html',
            success:function(data){
                var html = $(data);
                var content = html.find('.page-container');
                $(container).html(content);
                self.drag('.layoutBox .widgetBox');
                self.edit(options.id);
                if(options.id=='liyue'){
                    var elements = $(container).find('.u-widget');
                    $.each(elements,function(i,item){
                        widget.init(item,$(item).attr('panelname'));
                    });
                }
            }
        });

        //var template = require('html!../../static/page/template/' + id);
        //
        //$(container).html(template);
        //this.drag('.widgetBox');
        //this.edit();

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
                    start:function(i,ui){
                        $(this).find('.widget-menubar').hide();
                    },
                    stop: function (i,ui) {
                        //console.log(i);
                    },
                    over: function () {

                    }
                }).disableSelection();
            });
        },
        edit:function(id){
            var container = this.container;
            var html =
                '<div class="widget-menubar"><ul>'+
                '<li class="hide"><i class="uf uf-reply btn btn-outline btn-pill-right icon-max" data-type="window" title="回退"></i></li>'+
                '<li class="hide"><i class="uf btn btn-outline btn-pill-right icon-max" data-type="window" title="回退" style="font-size:15px;">T</i></li>'+
                '<li><i count="0" class="uf uf-pencil  btn btn-outline btn-pill-left icon-pencil" data-type="edit"  data-toggle="modal" data-target="#modalBlue" title="编辑"></i></li>' +
                '<li class="hide"><i class="uf uf-linksymbol btn btn-outline icon-unfold" data-type="collage" title="链接"></i></li>' +
                '<li><i class="uf uf-trash  btn btn-outline icon-cancel02" data-type="del" title="删除"></i></a></li></ul></div>';

            //$(container).on('mouseover','.u-widget',function(e){
            //    e.stopPropagation();
            //    var _this = this;
            //    if($(_this).find('.widget-menubar').length==0&&$(_this).find('.ui-sortable-helper').length==0){
            //        $(_this).append($(html).show());
            //    }
            //});
            //$(container).on('mouseleave','.u-widget',function(){
            //    $(this).find('.widget-menubar').hide().remove();
            //});
            //$(container).on('click',function(e){
            //    var target = $(e.target);
            //    if(target.hasClass('icon-cancel02')){
            //        target.closest('.u-widget').remove();
            //    }
            //})
        }
    };



    return {
        init: template
    }
});