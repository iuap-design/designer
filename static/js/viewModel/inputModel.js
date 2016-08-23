/**
 * Created by chief on 16/7/16.
 */

define('input',[],function(){
    var data = [{
            "align":ko.observable("left"),
            "borderRadius":ko.observable("0"),
            "fontColor":ko.observable("#000"),
            "borderColor": ko.observable("#000"),
            "fontWeight": ko.observable("600"),
            "hasText": ko.observable("左对齐"),
            "hasText": ko.observable(false),
            "hasIcon": ko.observable(false),
            "text": ko.observable("我是标题"),
            "fontSize": ko.observable("14")
        },{
            "align":ko.observable("middle"),
            "borderRadius":ko.observable("0"),
            "borderColor": ko.observable("#000"),
            "fontColor":ko.observable("#000"),
            "fontWeight": ko.observable("400"),
            "hasText": ko.observable(false),
            "hasIcon": ko.observable(true),
            "text": ko.observable("我是标题"),
            "fontSize": ko.observable("14")
        }];
    var inputModel = function(data) {
        this.input = ko.observableArray(data);
        this.changefontColor = function(fontColor){
            var index = $(event.target).parents("[index]").attr("index");
            this.input()[index].fontColor(fontColor);
        }.bind(this);
        this.changeSize = function(fontSize){
            var index = $(event.target).parents("[index]").attr("index");
            this.input()[index].fontSize(fontSize);
        }.bind(this);
        
       

    };

    return new inputModel(data);


    
});
