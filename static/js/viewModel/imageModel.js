/**
 * Created by chief on 16/7/16.
 */

define('image',[],function(){
    var data = {
            "imageUrl":"http://design.yyuap.com/static/img/designer/sidebar/img_cd.jpg",
            "borderWidth": "1px",
            "borderColor": "#000",
            "borderRadius": "0px",
            "borderStyle": "solid"
        };

    var imageModel = function(data) {
        this.image = ko.observable(data);
        this.imageUrl = ko.observable(data.imageUrl);
        this.borderWidth = ko.observable(data.borderWidth);
        this.borderColor = ko.observable(data.borderColor);
        this.borderRadius = ko.observable(data.borderRadius);
        this.borderStyle = ko.observable(data.borderStyle);
    };

    return new imageModel(data)
    
});
