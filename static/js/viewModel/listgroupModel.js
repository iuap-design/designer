/**
 * Created by chief on 16/8/22.
 */

define('listgroup',[],function(){
    var data ={
            "listData": [{title:ko.observable('1. 当前状态')},{title:ko.observable('2. Dapibus ac facilisis in')},{title:ko.observable('3. Morbi leo risus')},{title:ko.observable('4. 不可用列表')},{title:ko.observable('5. Vestibulum at eros')}],
            "footBackground":"#ededed",
            "footerFontSize": "14px"
        };



    var listgroupModel = function(data) {
        this.listgroup = ko.observable(data);
        this.listData = ko.observableArray(data.listData);
        this.listStyle = ko.observable();
        this.changelistGroupStyle = function(style){
            this.listStyle(style);
        }.bind(this);
        this.addlist = function(){
            this.listData.push({title: "6. 新添加标题" });
        }.bind(this);
        this.deletelist = function(){
            var listindex = $(event.target).attr("listindex");
            this.listData.splice(listindex,1);
        }.bind(this);
    }


    return new listgroupModel(data);

});
