/**
 * Created by chief on 16/8/25.
 */


define('tabs',[],function(){
    var data =[{}];

    var tabsModel = function(data) {
        var str = "u-tabs u-widget  u-drag u-js-ripple-effect--ignore-events is-upgraded";
        this.type = ko.observable(str+'');

        //this.changeAttr = function(){
        //    var str = str+" "+this.type();
        //    this.type(str);
        //}
    };


    return new tabsModel(data);

});
