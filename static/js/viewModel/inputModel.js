/**
 * Created by chief on 16/7/16.
 */

define('input',[],function(){
    var data = [
        {
            "showLabel": ko.observable(null),
            "feedback": ko.observable(null),
            "sizeClass": ko.observable("u-form-group"),
            "labelText": ko.observable(""),
            "index": ko.observable("0"),
            "sizeClass": ko.observable("u-form-group"),
            "value": ko.observable(""),
            "align": ko.observable("left"),
            "mustEnter": ko.observable(null)
        },{
            "showLabel": ko.observable(null),
            "feedback": ko.observable(true),
            "sizeClass": ko.observable("u-form-group"),
            "labelText": ko.observable(""),
            "index": ko.observable("1"),
            "sizeClass": ko.observable("u-form-group"),
            "value": ko.observable(""),
            "align": ko.observable("left"),
            "mustEnter": ko.observable(null)
        },{
            "showLabel": ko.observable(true),      
            "feedback": ko.observable(null),   
            "sizeClass": ko.observable("u-form-group"),   
            "labelText": ko.observable("left"),
            "index": ko.observable("2"),
            "sizeClass": ko.observable("u-form-group"),
            "value": ko.observable(""),
            "align": ko.observable("left"),
            "mustEnter": ko.observable(null)
        },{
            "showLabel": ko.observable(true),  
            "feedback": ko.observable(true),   
            "sizeClass": ko.observable("u-form-group"), 
            "labelText": ko.observable("left"),
            "index": ko.observable("3"),
            "sizeClass": ko.observable("u-form-group"),
            "value": ko.observable(""),
            "align": ko.observable("left"),
            "mustEnter": ko.observable(null)
        },{
            "showLabel": ko.observable(true),  
            "feedback": ko.observable(null),
            "sizeClass": ko.observable("u-form-group"),
            "labelText": ko.observable("left"),
            "index": ko.observable("4"),
            "sizeClass": ko.observable("u-form-group"),
            "value": ko.observable(""),
            "align": ko.observable("left"),
            "mustEnter": ko.observable("inline-block")
        }];
    var inputModel = function(data) {
        this.inputData = ko.observableArray(data);
        console.log(this.inputData);
        this.changeSize = function(size){
            var index = $(event.target).parents("[index]").attr("index");
            this.inputData()[index].sizeClass(size);
            console.log(this.inputData()[index].sizeClass());
        }.bind(this);
        this.changeAlign = function(align){
            var index = $(event.target).parents("[index]").attr("index");
            this.inputData()[index].align(align);
        }.bind(this)
        
       

    };

    return new inputModel(data);


    
});
