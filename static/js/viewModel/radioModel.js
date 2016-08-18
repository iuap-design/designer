/**
 * Created by chief on 16/7/16.
 */

define('radio',[],function(){
    var data = [{
            "bgColor":ko.observable("transparent"),
            "bgClass":ko.observable("u-radio u-radio-success"),
            "text": ko.observable("success")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-radio u-radio-primary"),
            "text": ko.observable("primary")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-radio u-radio-info"),
            "text": ko.observable("info")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-radio u-radio-danger"),
            "text": ko.observable("dnager")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-radio u-radio-warning"),
            "text": ko.observable("warning")
        }];
    var radioModel = function(data) {
        this.radio = ko.observableArray(data);
        this.changeBgColor = function(bgClass){
            var index = $(event.target).parents("[index]").attr("index");
            this.radio()[index].bgClass(bgClass);
        }.bind(this);
        this.changeSize = function(padding,fontSize){
            var index = $(event.target).parents("[index]").attr("index");
            this.radio()[index].padding(padding);
            this.radio()[index].fontSize(fontSize);
        }.bind(this);
        
        this.changeBorderRadius = function(size){
            var index = $(event.target).parents("[index]").attr("index");
            this.radio()[index].borderRadius(size);
        }.bind(this); 

       

    };

    return new radioModel(data);


    
});
