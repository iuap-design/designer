/**
 * Created by chief on 16/8/22.
 */

define('paging',[],function(){
    var data =[
        {
            "footerImg": ko.observable("http://design.yonyoucloud.com/static/img/bg-all.jpg"),
            "footerInfo":  ko.observable("版权所有：用友网络科技股份有限公司 2016 京ICP备05007539号-7 京ICP证100714号 京公网安备1101080209224号"),
            "footBackground":"#ededed",
            "footerFontSize": "14px"
        }];



    var pagingModel = function(data) {
        var paging = "paging u-pagination u-widget  u-drag";
        this.isBorder = ko.observable('');
        this.paging = ko.observable(paging);
        this.size = ko.observable('');
        this.gap = ko.observable('');
        this.changeAttr = function(){
            var str = paging+" "+this.isBorder()+" "+this.size()+" "+this.gap();
            this.paging(str);
        }
    };


    return new pagingModel(data);

});
