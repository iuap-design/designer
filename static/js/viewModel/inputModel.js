/**
 * Created by chief on 16/7/16.
 */

define('input',[],function(){
    var data = [
        {
            "labelText": ko.observable(null),
            "index": ko.observable("0"),
            "sizeClass": ko.observable("u-form-group"),
            "value": ko.observable("111"),
            "mustEnter": ko.observable(null)

        },{
            
            "labelText": ko.observable(null),
            "index": ko.observable("1"),
            "sizeClass": ko.observable("u-form-group"),
            "value": ko.observable(""),
            "rightIcon":ko.observable("uf uf-magnifyingglass"),
            "mustEnter": ko.observable(null)
        },{
            
            "labelText": ko.observable("left"),
            "index": ko.observable("2"),
            "sizeClass": ko.observable("u-form-group"),
            "value": ko.observable(""),
            "align": ko.observable("left"),
            "mustEnter": ko.observable(null)
        },{
            
            "labelText": ko.observable("left"),
            "index": ko.observable("0"),
            "sizeClass": ko.observable("u-form-group"),
            "value": ko.observable(""),
            "align": ko.observable("left"),
            "rightIcon":ko.observable("uf uf-magnifyingglass"),
            "mustEnter": ko.observable(null)
        },{
            
            "labelText": ko.observable("左对齐"),
            "index": ko.observable("0"),
            "sizeClass": ko.observable("u-form-group"),
            "value": ko.observable(""),
            "align": ko.observable("left"),
            "mustEnter": ko.observable(true)
        },{
            "labelText":ko.observable(null),
            "index": ko.observable("0"),
            "sizeClass": ko.observable("u-form-group"),
            "value": ko.observable(""),
            "mustEnter": ko.observable(null),
            "textarea": ko.observable("yes")
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
