/**
 * Created by chief on 16/7/16.
 */

define('label',[],function(){
    var data = [{
            "bgColor":ko.observable("#000"),
            "outLine": false,
            "size": ko.observable("sm"),
            "borderRadius": ko.observable("4px"),
            "text": ko.observable("Default"),
            "fontSize": ko.observable("14px"),
            "fontColor": ko.observable("#fff")
        },{
            "bgColor":ko.observable("#000"),
            "outLine": true,
            "size": ko.observable("sm"),
            "borderRadius": ko.observable("4px"),
            "text": ko.observable("Default"),
            "fontSize": ko.observable("14px"),
            "fontColor": ko.observable("#000")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "outLine": false,
            "size": ko.observable("sm"),
            "borderRadius": ko.observable("4px"),
            "text": ko.observable("Primary"),
            "fontSize": ko.observable("14px"),
            "fontColor": ko.observable("#fff")
        },{
            "bgColor":ko.observable("rgb(76,175,80)"),
            "outLine": false,
            "size": ko.observable("sm"),
            "borderRadius": ko.observable("4px"),
            "text": ko.observable("Success"),
            "fontSize": ko.observable("14px"),
            "fontColor": ko.observable("#fff")
        },{
            "bgColor":ko.observable("rgb(0,188,212)"),
            "outLine": false,
            "size": ko.observable("u-tag-sm"),
            "borderRadius": ko.observable("4px"),
            "text": ko.observable("Info"),
            "fontSize": ko.observable("14px"),
            "fontColor": ko.observable("#fff")
        },{
            "bgColor":ko.observable("rgb(255,152,0)"),
            "outLine": false,
            "size": ko.observable("sm"),
            "borderRadius": ko.observable("4px"),
            "text": ko.observable("Warning"),
            "fontSize": ko.observable("14px"),
            "fontColor": ko.observable("#fff")
        },{
            "bgColor":ko.observable("rgb(244,67,54)"),
            "outLine": false,
            "size": ko.observable("sm"),
            "borderRadius": ko.observable("4px"),
            "text": ko.observable("Danger"),
            "fontSize": ko.observable("14px"),
            "fontColor": ko.observable("#fff")
        },{
            "bgColor":ko.observable("rgb(97,97,97)"),
            "outLine": false,
            "size": ko.observable("sm"),
            "borderRadius": ko.observable("4px"),
            "text": ko.observable("Dark"),
            "fontSize": ko.observable("14px"),
            "fontColor": ko.observable("#fff")
        }];

    var labelModel = function(data) {
        this.label = ko.observableArray(data);

        this.changeSize = function(size){
            var index = $(event.target).parents("[index]").attr("index");
            this.label()[index].fontSize(size);
        }.bind(this);
        
        this.changeBorderRadius = function(size){
            var index = $(event.target).parents("[index]").attr("index");
            this.label()[index].borderRadius(size);
        }.bind(this); 
    };

    return new labelModel(data);


    
});
