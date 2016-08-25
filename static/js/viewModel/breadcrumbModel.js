/**
 * Created by chief on 16/8/22.
 */

define('breadcrumb',[],function(){
    var data ={
            "breadData": [{title:ko.observable('home')},{title:ko.observable('library')}],
            "footBackground":"#ededed",
            "footerFontSize": "14px"
        };



    var breadcrumbModel = function(data) {
        this.breadcrumb = ko.observable(data);
        this.breadData = ko.observableArray(data.breadData);
        this.separator = ko.observable("u-breadcrumb");

        this.toggleseparator = function(style){
            this.separator(style);
        }.bind(this);
        this.addbread = function(){
            this.breadData.push({title: "data" });
        }.bind(this);
        this.deletebread = function(){
            var breadindex = $(event.target).attr("breadindex");
            this.breadData.splice(breadindex,1);
        }.bind(this);
    }


    return new breadcrumbModel(data);

});
