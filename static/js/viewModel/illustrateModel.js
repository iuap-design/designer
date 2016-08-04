/**
 * Created by chief on 16/7/16.
 */

define('illustrate',[],function(){
    var data = {
          "backgroudColor": "#FD9C9C",
          "newslist": [
              {
                "textImg": "http://design.yyuap.com/static/img/desiner3.jpg",
                "title": ko.observable("班级新闻"),
                "titleColor": "#258FB9",
                "textContext": ko.observable("恭喜XXX收到新加坡国立大学研究生offer学霸啊~小伙伴们是否羡慕嫉妒恨?"),
                "buttonText" : "查看更多",
                "titleSize": "18px"
              },{
                "textImg": "http://design.yyuap.com/static/img/desiner3.jpg",
                "title": ko.observable("班级活动"),
                "titleColor": "#fff",
                "textContext": ko.observable("本周六组织爬佘山，大家积极报起名来，锻炼身体义不容辞！请大家准时到达"),
                "buttonText" : "查看更多",
                "titleSize": "18px"
              },
              {
                "textImg": "http://design.yyuap.com/static/img/desiner3.jpg",
                "title": ko.observable("班级通知"),
                "titleColor": "#DF5157",
                "textContext": ko.observable("国庆七天大假，放10月1号~7号，小伙伴们请安排好时间，回家的同学车票都买好了"),
                "buttonText" : "查看更多",
                "titleSize": "18px"
              }
          ]
        };

    var illustrateModel = function(data) {
        this.illustrates = ko.observable(data);
        this.newslist = ko.observableArray(data.newslist);
      
        this.addItem = function() {
            var newIllustrateItem = {
                "textImg": "http://design.yyuap.com/static/img/desiner3.jpg",
                "title": ko.observable("班级新闻"),
                "titleColor": "#258FB9",
                "textContext": ko.observable("恭喜XXX收到新加坡国立大学研究生offer"),
                "buttonText" : ko.observable("查看更多"),
                "titleSize": "18px"
            };
            this.newslist.push(newIllustrateItem); 
        }.bind(this); 

        this.deleteItem = function(item) {
            
            this.newslist.remove(item);
        }.bind(this);  
    };

    return new illustrateModel(data)
    
});
