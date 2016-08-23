/**
 * Created by chief on 16/8/22.
 */

define('paging',[],function(){
    var data =[
        {
            "footerImg": ko.observable("http://design.yyuap.com/static/img/bg-all.jpg"),
            "footerInfo":  ko.observable("版权所有：用友网络科技股份有限公司 2016 京ICP备05007539号-7 京ICP证100714号 京公网安备1101080209224号"),
            "footBackground":"#ededed",
            "footerFontSize": "14px"
        }];



    //var pagingModel = function(el) {
    //    this.paging = ko.observableArray(data);
    //
    //    var comp = new u.pagination({el:el,jumppage:true});
    //    comp.update({totalPages: 100,pageSize:20,currentPage:1,totalCount:200});
    //};

    var init = function(el){
        var comp = new u.pagination({el:el,jumppage:true});
        comp.update({totalPages: 100,pageSize:20,currentPage:1,totalCount:200});

        //ko.applyBindings(data,el);
    };


    return {
        init:init
    }

});
