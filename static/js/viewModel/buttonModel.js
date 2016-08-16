/**
 * Created by chief on 16/7/16.
 */

define('button',[],function(){
    var data = [{
            "bgColor":ko.observable("transparent"),
            "outLine": false,
            "padding":ko.observable("6px 12px"),
            "size": ko.observable({"padding":"6px 12px","font-size":"18px"}),
            "borderRadius": ko.observable("4px"),
            "text": ko.observable("文字按扭"),
            "fontSize": ko.observable("14px"),
            "fontColor": ko.observable("#000")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "outLine": true,
            "padding":ko.observable("6px 12px"),
            "borderRadius": ko.observable("50px"),
            "text": ko.observable("圆形按钮"),
            "fontSize": ko.observable("14px"),
            "fontColor": ko.observable("#fff")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "outLine": false,
            "padding":ko.observable("6px 12px"),
            "size": ko.observable("u-button-default"),
            "borderRadius": ko.observable("4px"),
            "text": ko.observable("圆角按钮"),
            "fontSize": ko.observable("14px"),
            "fontColor": ko.observable("#fff")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "outLine": false,
            "padding":ko.observable("6px 12px"),
            "size": ko.observable("u-button-default"),
            "borderRadius": ko.observable("0"),
            "text": ko.observable("直角按钮"),
            "fontSize": ko.observable("14px"),
            "fontColor": ko.observable("#fff")
        }];

    var buttonModel = function(data) {
        this.buttonData = ko.observableArray(data);
        console.log(this.buttonData);
        this.changeBgColor = function(bgColor){
            var index = $(event.target).parents("[index]").attr("index");
            this.buttonData()[index].bgColor(bgColor);
        }.bind(this);
        this.changeSize = function(padding,fontSize){
            var index = $(event.target).parents("[index]").attr("index");
            this.buttonData()[index].padding(padding);
            this.buttonData()[index].fontSize(fontSize);
        }.bind(this);
        
        this.changeBorderRadius = function(size){
            var index = $(event.target).parents("[index]").attr("index");
            this.buttonData()[index].borderRadius(size);
        }.bind(this); 
    };

    return new buttonModel(data);


    
});
