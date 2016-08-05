/**
 * Created by chief on 16/7/16.
 */

define('headNav',[],function(){
    var data = {
          "logoImg": "http://design.yyuap.com/static/img/sprite-ui.png",
          "backgroudColor": "#FD9C9C",
          "navlist": [
              {
                "title": ko.observable("班级首页"),
                "titleColor": "#fff",
                "titleSize": "14px"
              },{
                "title": ko.observable("班级相册"),
                "titleColor": "#fff",
                "titleSize": "14px"
              },
              {
                "title": ko.observable("班级成员"),
                "titleColor": "#fff",
                "titleSize": "14px"
              },{
                "title": ko.observable("下载专区"),
                "titleColor": "#fff",
                "titleSize": "14px"
              }
          ]
    };

    var headNavModel = function(data) {

        this.headNavs = ko.observable(data);
        this.navlist = ko.observableArray(data.navlist);
        this.logoImg = ko.observable(data.logoImg);

        this.addItem = function() {
            var newheadNavItem =  {
                "title": ko.observable("班级成员"),
                "titleColor": "#fff",
                "titleSize": "14px"
              };
            this.navlist.push(newheadNavItem);
        }.bind(this); 

        this.deleteItem = function(item) {
            this.navlist.remove(item)
        }.bind(this);  
    };

    return new headNavModel(data)
    
});
