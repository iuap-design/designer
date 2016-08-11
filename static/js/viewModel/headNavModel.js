/**
 * Created by chief on 16/7/16.
 */

define('headNav',[],function(){
    var data = {
          "logoImg": "http://design.yyuap.com/static/img/sprite-ui.png",
          "navlist": [
              {
                "title": ko.observable("赛事日程"),
                "titleColor": "#fff",
                "titleSize": "14px"
              },{
                "title": ko.observable("走进里约"),
                "titleColor": "#fff",
                "titleSize": "14px"
              },
              {
                "title": ko.observable("运动员风采"),
                "titleColor": "#fff",
                "titleSize": "14px"
              },{
                "title": ko.observable("直播专区"),
                "titleColor": "#fff",
                "titleSize": "14px"
              }
          ]
    };

    var headNavModel = function(data) {

        this.headNavs = ko.observable(data);
        this.navlist = ko.observableArray(data.navlist);
        this.logoImg = ko.observable(data.logoImg);
        // this.background_Color = ko.observable(data.background_Color);
        this.background_Colors = ko.observableArray(['navdefault','navsuccess','navinfo','navwarning','navdark','navdanger']);
        this.selectedbackground_Color = ko.observable('navdefault');

        this.addItem = function() {
            var newheadNavItem =  {
                "title": ko.observable("热点快报"),
                "titleColor": "#fff",
                "titleSize": "14px"
              };
            this.navlist.push(newheadNavItem);
        }.bind(this); 

        this.deleteItem = function(item) {
            this.navlist.remove(item)
        }.bind(this);  

        this.toggleBg = function(){
            var colorValue = $(event.target).parents(".u-radio").attr("bgcolor");
            console.log(this.background_Color);
            this.background_Color = ko.observable(colorValue);
            console.log(this.background_Color);
            
        }
    };

    return new headNavModel(data)
    
});
