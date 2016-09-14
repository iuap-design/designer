/**
 * Created by chief on 16/7/16.
 */

define('image',[],function(){
    var data = [{
            "imageUrl":ko.observable("http://design.yyuap.com/static/img/designer/sidebar/img_cd.jpg"),
            "imgWidth": ko.observable("img-responsive"),
             "borderRadius": ko.observable("4px"),
             "size": ko.observable("sm"),
             "borderStyle":ko.observable("")
        },{
            "imageUrl":ko.observable("http://design.yyuap.com/static/img/designer/sidebar/img_cd.jpg"),
            "imgWidth": ko.observable("img-responsive"),
            "borderRadius": ko.observable("4px"),
              "size": ko.observable("sm"),
            "borderStyle":ko.observable("")
        }];

    var imageModel = function(data) {
        this.image = ko.observableArray(data);

        this.changeImgWidth = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var imgWidtg = $(event.target).find("option:selected").val() + " img-responsive";
            this.image()[index].imgWidth(imgWidtg);
        }.bind(this);
        this.changeBorderRadius = function(size){
            var index = $(event.target).parents("[index]").attr("index");
            this.image()[index].borderRadius(size);
        }.bind(this);
        this.changeImgBorderColor = function(){
            var index = $(event.target).parents("[index]").attr("index");
            var imgBorderColor = $(event.target).find("option:selected").val().substring(9);
            var jointBorderColor="1px solid "+imgBorderColor ;
            this.image()[index].borderStyle(jointBorderColor);
        }.bind(this);
    };

    return new imageModel(data);


    
});
