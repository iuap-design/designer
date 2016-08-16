/**
 * Created by chief on 16/7/16.
 */

define('badge',[],function(){
    var data = [{
            "bgColor":ko.observable("transparent"),
            "bgClass":ko.observable("u-badge u-badge-success"),
            "text": ko.observable("14")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-badge u-badge-primary"),
            "text": ko.observable("91")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-badge u-badge-info"),
            "text": ko.observable("58")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-badge u-badge-danger"),
            "text": ko.observable("20")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-badge u-badge-warning"),
            "text": ko.observable("99")
        }];
    var badgeModel = function(data) {
        this.badge = ko.observableArray(data);
        this.changeBgColor = function(bgClass){
            var index = $(event.target).parents("[index]").attr("index");
            this.badge()[index].bgClass(bgClass);
        }.bind(this);
        this.changeSize = function(padding,fontSize){
            var index = $(event.target).parents("[index]").attr("index");
            this.badge()[index].padding(padding);
            this.badge()[index].fontSize(fontSize);
        }.bind(this);
        
        this.changeBorderRadius = function(size){
            var index = $(event.target).parents("[index]").attr("index");
            this.badge()[index].borderRadius(size);
        }.bind(this); 

       

    };

    return new badgeModel(data);


    
});
