/**
 * Created by chief on 16/7/16.
 */

define('headNav',[],function(){
    var data = [{
          "logoImg": "http://design.yyuap.com/static/img/desinerimg1.png",
          "backgroudColor": "#FD9C9C",
          "navlist": ko.observableArray([
              {
                "title": ko.observable("班级首页"),
                "titleColor": "#fff",
                "titleSize": "14px"
              },{
                "title": "班级相册",
                "titleColor": "#fff",
                "titleSize": "14px"
              },
              {
                "title": "班级成员",
                "titleColor": "#fff",
                "titleSize": "14px"
              },{
                "title": "下载专区",
                "titleColor": "#fff",
                "titleSize": "14px"
              }
          ])
    }];

    var headNavModel = function(data) {

        this.headNavs = ko.observableArray(data);
      
        this.addItem = function() {
            var newheadNavItem =  {
                "title": "班级成员",
                "titleColor": "#fff",
                "titleSize": "14px"
              };
            this.headNavs.navlist.push(newheadNavItem);
        }.bind(this); 

        this.deleteItem = function(item) {
            this.headNavs.navlist.remove(item)
        }.bind(this);  
    };

    return new headNavModel(data)
    
});
