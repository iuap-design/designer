/**
 * Created by chief on 16/7/16.
 */

define('footer',[],function(){
    var data =[
        {
            "footerInfo":  ko.observable("版权所有：用友网络科技股份有限公司 2016 京ICP备05007539号-7 京ICP证100714号 京公网安备1101080209224号"),
            "footBackground":"#ededed",
            "footerFontSize": "14px"
        }];

    var footersModel = function(data) {
        this.footers = ko.observableArray(data);
      
        
    };

    return new footersModel(data)
    
});
