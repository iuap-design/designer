/**
 * Created by chief on 16/7/16.
 */

define('checkbox',[],function(){
    var data = [{
            "bgColor":ko.observable("transparent"),
            "bgClass":ko.observable("u-checkbox u-checkbox-success"),
            "text": ko.observable("success")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-checkbox u-checkbox-primary"),
            "text": ko.observable("primary")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-checkbox u-checkbox-info"),
            "text": ko.observable("info")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-checkbox u-checkbox-warning"),
            "text": ko.observable("warning")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-checkbox u-checkbox-danger"),
            "text": ko.observable("danger")
        },{
            "bgColor":ko.observable("rgb(63,81,181)"),
            "bgClass":ko.observable("u-checkbox u-checkbox-dark"),
            "text": ko.observable("grey")
        }];
    var checkboxModel = function(data) {
        this.checkbox = ko.observableArray(data);
        
        this.changeBgColor = function(bgClass){
            var index = $(event.target).parents("[index]").attr("index");
            this.checkbox()[index].bgClass(bgClass);
            u.compMgr.updateComp();
        }.bind(this);
        this.changeSize = function(padding,fontSize){
            var index = $(event.target).parents("[index]").attr("index");
            this.checkbox()[index].padding(padding);
            this.checkbox()[index].fontSize(fontSize);
        }.bind(this);
        
        this.changeBorderRadius = function(size){
            var index = $(event.target).parents("[index]").attr("index");
            this.checkbox()[index].borderRadius(size);
        }.bind(this); 

       

    };

    return new checkboxModel(data);


    
});
