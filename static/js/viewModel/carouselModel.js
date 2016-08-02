/**
 * Created by chief on 16/7/16.
 */

define('widget',[],function(){
    var data = [{
        "carouselName": ko.observable("carousel-1"),
        "carouselImg": "http://design.yyuap.com/static/img/carousel-1.jpg",
        "carouselNameColor": "#fff",
        "carouselNameSize": "12px"
      },
      {
        "carouselName": ko.observable("carousel-2"),
        "carouselImg": "http://design.yyuap.com/static/img/carousel-2.jpg",
        "carouselNameColor": "#fff",
        "carouselNameSize": "12px"
      },
      {
        "carouselName": ko.observable("carousel-3"),
        "carouselImg": "http://design.yyuap.com/static/img/carousel-3.jpg",
        "carouselNameColor": "#fff",
        "carouselNameSize": "12px"
      }];

    var viewModel = function(data) {
        this.carousels = ko.observableArray(data);
      
        this.addCarousel = function() {
            var newCarouselItem = {
                "carouselName": ko.observable("carousel-4"),
                "carouselImg": "http://design.yyuap.com/static/img/carousel-2.jpg",
                "carouselNameColor": "#fff",
                "carouselNameSize": "12px"
            };
            this.carousels.push(newCarouselItem); 
        }.bind(this); 

        this.deleteCarousel = function(item) {
            this.carousels.remove(item)
        }.bind(this);  
    };

    return new viewModel(data)
    
});
