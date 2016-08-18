/**
 * Created by chief on 16/7/16.
 */

define('text',[],function(){
    var data = [{
            "align":ko.observable("left"),
            "fontColor":ko.observable("#000"),
            "fontWeight": ko.observable("600"),
            "text": ko.observable("我是标题"),
            "fontSize": ko.observable("14")
        },{
            "align":ko.observable("middle"),
            "fontColor":ko.observable("#000"),
            "fontWeight": ko.observable("400"),
            "text": ko.observable("基于20多年企业开发经验，总结了企业应用领域中遇到的常见场景，并提供相应的解决方案。企业级应用开发不再困难"),
            "fontSize": ko.observable("14")
        },{
            "align":ko.observable("right"),
            "fontColor":ko.observable("#000"),
            "fontWeight": ko.observable("800"),
            "text": ko.observable("label"),
            "fontSize": ko.observable("14")
        }];
    var textModel = function(data) {
        this.text = ko.observableArray(data);
        this.changefontColor = function(fontColor){
            var index = $(event.target).parents("[index]").attr("index");
            this.text()[index].fontColor(fontColor);
        }.bind(this);
        this.changeSize = function(fontSize){
            var index = $(event.target).parents("[index]").attr("index");
            this.text()[index].fontSize(fontSize);
        }.bind(this);
        
       

    };

    return new textModel(data);


    
});
