/**
 * Created by chief on 16/7/16.
 */

define('illustrate',[],function(){
    var data = {
          "backgroudColor": "#FD9C9C",
          "newslist": [
              {
                "textImg": ko.observable("http://design.yyuap.com/static/img/desiner3.jpg"),
                "title": ko.observable("奥运开幕在即 中国体操女队入场训练"),
                "titleColor": "#258FB9",
                "textContext": ko.observable("8月4日,中国体操队队员范忆琳在赛前训练中。当日,中国体操女队队员在里约热内卢奥林匹克体育馆进行训练。里约奥运会体操比赛将于8月6日拉开战幕."),
                "buttonText" : "查看更多",
                "titleSize": "18px"
              },{
                "textImg": ko.observable("http://design.yyuap.com/static/img/desiner4.jpg"),
                "title": ko.observable("福原爱领衔日本乒乓球队训练备战"),
                "titleColor": "#fff",
                "textContext": ko.observable("2016年8月5日，2016年里约奥运会，福原爱领衔日本乒乓球队训练备战。988年11月1日出生于日本宫城县仙台市，日本乒乓球运动员。2000年，成为历史上年龄最小的日本国家队成员。"),
                "buttonText" : "查看更多",
                "titleSize": "18px"
              },
              {
                "textImg": ko.observable("http://design.yyuap.com/static/img/desiner5.jpg"),
                "title": ko.observable("英国场地自行车进行赛前训练"),
                "titleColor": "#DF5157",
                "textContext": ko.observable("英国场地自行车女队 Great Britain Women's Track Cycling Team队员组成：维多利亚-彭德莱顿、杰西卡-瓦妮实、温迪-霍汶娜格尔、丹尼尔-金、乔安娜-罗斯尔、劳拉-特洛特."),
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
                "textImg": ko.observable("http://design.yyuap.com/static/img/desiner6.jpg"),
                "title": ko.observable("中国男篮在里约进行赛前热身训练"),
                "titleColor": "#258FB9",
                "textContext": ko.observable("8月4日，中国队球员周琦（左）与王哲林在训练中。当日，中国男篮在里约奥运公园训练场地进行了赛前热身训练。中国队将在8月6日首战对阵美国队。 新华社记者孟永民摄"),
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
