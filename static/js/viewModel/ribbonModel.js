/**
 * Created by chief on 16/7/16.
 */

define('ribbon',[],function(){
    var data = [{
            "bgColor":ko.observable("u-ribbon u-ribbon-primary"),
            "vertical":ko.observable("true"),
            "position": ko.observable("left"),
            "content": ko.observable("one.   two. three four."),
            "title": ko.observable("Ribbon"),
            "right":ko.observable(null),
            "bottom":ko.observable(null)
        },{
            "bgColor":ko.observable("u-ribbon u-ribbon-primary"),
            "vertical":ko.observable("true"),
            "position": ko.observable("left"),
            "content": ko.observable("one.   two.  three four."),
            "title": ko.observable("<i class='fa fa-star'></i>"),
            "right":ko.observable(null),
            "bottom":ko.observable(null)
        }];
    var ribbonModel = function(data) {
        this.ribbon = ko.observableArray(data);
        this.changeTitleColor = function(bgClass){
            var index = $(event.target).parents("[index]").attr("index");
            this.ribbon()[index].bgColor(bgClass);
        }.bind(this);
        this.changePosition = function(right,bottom){
            var index = $(event.target).parents("[index]").attr("index");
            this.ribbon()[index].right(right);
            this.ribbon()[index].bottom(bottom);
        }.bind(this);
        
        this.changeBorderRadius = function(size){
            var index = $(event.target).parents("[index]").attr("index");
            this.ribbon()[index].borderRadius(size);
        }.bind(this); 

       

    };

    return new ribbonModel(data);


    
});
