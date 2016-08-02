/**
 * Created by chief on 16/7/16.
 */

define('widget',[],function(){
    var data = [{
        "carouselName": "carousel-1",
        "carouselImg": "http://design.yyuap.com/static/img/carousel-1.jpg",
        "carouselNameColor": "#fff",
        "carouselNameSize": "12px"
      },
      {
        "carouselName": "carousel-2",
        "carouselImg": "http://design.yyuap.com/static/img/carousel-2.jpg",
        "carouselNameColor": "#fff",
        "carouselNameSize": "12px"
      },
      {
        "carouselName": "carousel-3",
        "carouselImg": "http://design.yyuap.com/static/img/carousel-3.jpg",
        "carouselNameColor": "#fff",
        "carouselNameSize": "12px"
      }];

    var viewModel = function(data) {
        this.carousels = ko.observableArray(data);
        // this.addItem = function() {
        //     if (this.itemToAdd() != "") {
        //         this.items.push(this.itemToAdd()); 
        //         this.itemToAdd(""); 
        //     }
        // }.bind(this);  
    };

    return new viewModel(data)
    
});
