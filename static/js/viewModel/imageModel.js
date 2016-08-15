/**
 * Created by chief on 16/7/16.
 */

define('image',[],function(){
    var data = [{
            "imageUrl":ko.observable("http://design.yyuap.com/static/img/designer/sidebar/img_cd.jpg"),
            "borderWidth": ko.observable("1px"),
            "borderColor": ko.observable("#000"),
            "borderRadius": ko.observable("0px"),
            "borderStyle": ko.observable("solid")
        },{
            "imageUrl":ko.observable("http://design.yyuap.com/static/img/designer/sidebar/img_cd.jpg"),
            "borderWidth": ko.observable("1px"),
            "borderColor": ko.observable("#fff"),
            "borderRadius": ko.observable("10px"),
            "borderStyle": ko.observable("solid")
        }];

    var imageModel = function(data) {
        this.image = ko.observableArray(data);
        // this.imageUrl = ko.observable(data.imageUrl);
        // this.borderWidth = ko.observable(data.borderWidth);
        // this.borderColor = ko.observable(data.borderColor);
        // this.borderRadius = ko.observableArray(data.borderRadius);
        // this.borderStyle = ko.observable(data.borderStyle);
    };

    return new imageModel(data);


    
});
