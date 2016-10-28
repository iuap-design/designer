/**
 * Created by chief on 16/7/16.
 */

define('text',[],function(){
    var data = [{
            "align":ko.observable(""),
            "fontColor":ko.observable("#000"),
            "fontWeight": ko.observable("100"),
            "text": ko.observable("我是标题"),
            "linkurl": null,
            "fontSize": ko.observable("12"),
            "titleShow": ko.observable(""),
            "paddingTop": ko.observable("0")
        },{
            "align":ko.observable(""),
            "fontColor":ko.observable("#000"),
             "fontWeight": ko.observable("100"),
            "linkurl": null,
            "text": ko.observable("基于20多年企业开发经验，总结了企业应用领域中遇到的常见场景，并提供相应的解决方案。企业级应用开发不再困难"),
            "fontSize": ko.observable("12"),
            "titleShow": ko.observable(""),
            "paddingTop": ko.observable("0")
        },{
            "align":ko.observable(""),
            "fontColor":ko.observable("#000"),
             "fontWeight": ko.observable("100"),
            "text": ko.observable("link"),
            "linkurl": "http://",
            "fontSize": ko.observable("12"),
            "titleShow": ko.observable(""),
             "paddingTop": ko.observable("0")
        }];
    var textModel = function(data) {
        this.text = ko.observableArray(data);
        this.changefontColor = function(fontColor){
            var index = $(event.target).parents("[index]").attr("index");
            this.text()[index].fontColor(fontColor);
        }.bind(this);
        this.changeSize = function(fontSize){
            var index = $(event.target).parents("[index]").attr("index");
            var newFontSize=$(event.target).find("option:selected").val().substring(10)+"px";
            this.text()[index].fontSize(newFontSize);
        }.bind(this);
        this.changeAlignLeft = function(){
            var index = $(event.target).parent("[index]").attr("index");
            $(".edit-panel").css("left","400px");
            $("#textElement").parent().css("text-align","left");
        }.bind(this);
        this.changeAlignMiddle = function(){
            var index = $(event.target).parent("[index]").attr("index");
            $(".edit-panel").css("left","0");
            $("#textElement").parent().css("text-align","center");
        }.bind(this);
        this.changeAlignRight = function(){
            var index = $(event.target).parent("[index]").attr("index");
            $(".edit-panel").css("left","-400px");
            $("#textElement").parent().css("text-align","right");
        }.bind(this);
        this.changeTitle = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var newTitle=$(event.target).find("option:selected").val();
            $("#textNode").removeAttr("style");
            this.text()[index].titleShow(newTitle);
        }.bind(this);
        this.changePaddingTop = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var newPaddingTop=$(event.target).val()+"px";
            $("#textNode").css("paddingTop",newPaddingTop);
        }.bind(this);
        this.changePaddingRight = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var newPaddingRight=$(event.target).val()+"px";
            $("#textNode").css("paddingRight",newPaddingRight);
        }.bind(this);
        this.changePaddingBottom = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var newPaddingBottom=$(event.target).val()+"px";
            $("#textNode").css("paddingBottom",newPaddingBottom);
        }.bind(this);
        this.changePaddingLeft = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var newPaddingLeft=$(event.target).val()+"px";
            $("#textNode").css("paddingLeft",newPaddingLeft);
        }.bind(this);
        this.changeMarginTop = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var newMarginTop=$(event.target).val()+"px";
            $("#textNode").css("marginTop",newMarginTop);
        }.bind(this);
        this.changeMarginRight = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var newMarginRight=$(event.target).val()+"px";
            $("#textNode").css("marginRight",newMarginRight);
        }.bind(this);
        this.changeMarginBottom = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var newMarginBottom=$(event.target).val()+"px";
            $("#textNode").css("marginBottom",newMarginBottom);
        }.bind(this);
        this.changeMarginLeft = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var newMarginLeft=$(event.target).val()+"px";
            $("#textNode").css("marginLeft",newMarginLeft);
        }.bind(this);
        this.addLinkUrl = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var newUrl=$(event.target).val();
            $("#textNode").wrap("<a> </a>");
            $("#textNode").parent().attr("href",newUrl);

        }.bind(this);
        this.changeWeight = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var newFontWeight=$(event.target).find("option:selected").val().substring(12);
            $("#textNode").css("fontWeight",newFontWeight);
        }.bind(this);

    };

    return new textModel(data);


    
});
