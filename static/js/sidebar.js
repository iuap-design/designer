/**
 * Created by chief on 16/7/15.
 */
define('sidebar',['./widget'],function(widgetKO){
    var init = function (container){

        var template =  require('html!../../static/page/sidebar.html');

        $(container).html(template);




        widgetshow(container);

        //widgetContentShow();
    };

    var widgetshow = function(container){
        var widget  = $(container).find('.widget-type a');
        var widgetContent =  $(container).find('.sidebar-panels');
        var widgetContainer = $(container).find('.sidebar-panel-container');

        widget.on('click',pannelShow);

        function pannelShow(e){
            var target = typeof e!='undefined'?$(e.target).closest('a'):$('.widget-type a').eq(0);

            var i = target.parent().parent().index();

            var p = target.closest('li').index();

            $(container).find('.widget-type a').removeClass('active');
            target.addClass('active');

            widgetContent.hide();
            widgetContent.eq(p).show();

            var panel = target.attr("panel");
            var type = target.attr("type");

            if(typeof panel=='undefined'){
                return false;
            }
            if($("#"+panel+"container").length === 0){

                var template = require('html!../../static/page/sidebarPanel/'+panel+'.html');
                var secondWidgetContainer = "<div id='"+panel+"container'>"+template+"</div>";



                widgetContent.eq(p).find('.panel-body').html(secondWidgetContainer);

                if(panel === "checkbox" || panel == "radio"){
                    // 如果是checkbox或者radio需要调用样式方法初始化样式
                    u.compMgr.updateComp();
                }

                var widgetElement = widgetContent.eq(p).find(".u-drag");
                var defaultElement = widgetContent.eq(p).find('.lay-box');



                if(type=='layout'){
                    drag(widgetElement,'#container-content .widgetBox','layout');
                }
                else if(type=='element') {
                    drag(widgetElement,'.layoutBox .widgetBox','element');
                }
                else if(type=='widget') {
                    drag(widgetElement,'.layoutBox .widgetBox','widget');
                }
               
                if(defaultElement.length>0){
                    drag(defaultElement,'#container-content .widgetBox','defaultLayout');
                }
            }
            // $("#"+widget+"container").css("left","90px");
            // widgetContainer.show(");
            // $("#"+widget+"container").show();
            // widgetContainer.removeAttr("style").removeClass('collapse in').show();

            if(!widgetContainer.hasClass("collapse in")){
                widgetContainer.addClass('collapse in');
                $('.main-container').addClass('collapse in');
            }
            else {
                //widgetContainer.removeClass('collapse in');
                //$('.main-container').removeClass('collapse in');
            }

        }
        pannelShow();

    };
    /*
        侧边工具二级菜单显示
    */
    var widgetContentShow = function(){
        var widgetContent = $(".widget-list li");
        var widgetContainer = $("#sidebar-container");

         widgetContent.on('mouseenter',function(event){
            $(".second-widget").hide();
            var widget = $(this).attr("widget");
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
            // $(".second-widget").css("left":"-170px");
         })



    }

    var drag = function(elements,place,type){

        require.ensure(['./../trd/jquery-ui/jquery-ui'],function() {

            var ui = require('./../trd/jquery-ui/jquery-ui');



            $.each(elements,function(i,item){
                var widget = $(item).attr("widget");

                var helper = (typeof widget=='undefined')?"clone":function(event, ui){

                    var i = $(this).index(0)+1;


                    var template = require('html!../../static/page/widget/'+widget+'.html');
                    

                    
                    return $(template).addClass('u-drag');
                };

                var mtype = $(item).attr('type');

                type = mtype?mtype:type;

                $(item).draggable({
                    connectToSortable: place,
                    helper: helper,
                    appendTo:'body',
                    start:function(event,ui){

                        if(type =='element'||type=='widget'){
                            //widgetKO.init(widgetContent.eq(p).find('.panel-body').find("div[elements]")[0],widgetContent.eq(p).find('.panel-body').find("div[elements]").attr("elements"));
                            widgetKO.init(ui.helper[0],$(this).attr('widget'),$(this).attr('jswidget'));
                        }
              
              
                        // 如果是基础元素 则抽取拖拽的那个元素

                        if($(event.target).attr('index')){
                            var index = $(event.target).attr('index');
                            var widgetname = $(event.target).attr("widget")
                            // ui.helper.find("img").not(ui.helper.find("img")[index]).hide();
                            ui.helper.html(ui.helper.find("[widgetname]")[index]);
                        }



                        if(helper!='clone'&&type=="widget"){
                            ui.helper.css({'width':'100%','transform':'scale(0.5,0.5)','transform-origin':'0 0'});
                        }
                        if(type=='layout'||type=='default-layout'){
                            ui.helper.css({width:'100%'});
                        }

                    },
                    snapMode: "outer",
                    stop: function (event, ui) {

                        ui.helper.removeAttr("style");
                        var target = $(event.target);
                        var html =
                            '<div class="widget-menubar"><ul>'+
                            '<li class="hide"><i class="uf uf-reply btn btn-outline btn-pill-right icon-max" data-type="window" title="回退"></i></li>'+
                            '<li class="hide"><i class="uf btn btn-outline btn-pill-right icon-max" data-type="window" title="回退" style="font-size:15px;">T</i></li>'+
                            '<li><i count="0" class="uf uf-pencil  btn btn-outline btn-pill-left icon-pencil" data-type="edit"  data-toggle="modal" data-target="#modalBlue" title="编辑"></i></li>' +
                            '<li class="hide"><i class="uf uf-linksymbol btn btn-outline icon-unfold" data-type="collage" title="链接"></i></li>' +
                            '<li><i class="uf uf-trash  btn btn-outline icon-cancel02" data-type="del" title="删除"></i></a></li></ul></div>';

                        ui.helper.append(html);

                    }
                });
            });







        });
    };
    return {
        init:init
    }
});