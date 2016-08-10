/**
 * Created by chief on 16/7/16.
 */

define('carousel',[],function(){
    var data = [{
        "carouselName": ko.observable("carousel-1"),
        "carouselImg": ko.observable("http://design.yyuap.com/static/img/carousel-1.jpg"),
        "carouselNameColor": "#fff",
        "carouselNameSize": "12px"
      },
      {
        "carouselName": ko.observable("carousel-2"),
        "carouselImg": ko.observable("http://design.yyuap.com/static/img/carousel-2.jpg"),
        "carouselNameColor": "#fff",
        "carouselNameSize": "12px"
      },
      {
        "carouselName": ko.observable("carousel-3"),
        "carouselImg": ko.observable("http://design.yyuap.com/static/img/carousel-3.jpg"),
        "carouselNameColor": "#fff",
        "carouselNameSize": "12px"
      }];

    var carouselsModel = function(data) {
        console.log(ko.observableArray(data));
        this.carousels = ko.observableArray(data);
      
        this.addItem = function() {
            var newCarouselItem = {
                "carouselName": ko.observable("carousel-4"),
                "carouselImg": ko.observable("http://design.yyuap.com/static/img/carousel-2.jpg"),
                "carouselNameColor": "#fff",
                "carouselNameSize": "12px"
            };
            this.carousels.push(newCarouselItem); 
        }.bind(this); 

        this.deleteItem = function(item) {
            this.carousels.remove(item)
        }.bind(this);  
    };

    return new carouselsModel(data)
    
});
