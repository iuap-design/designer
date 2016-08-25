/**
 * Created by chief on 16/8/22.
 */

define('listgroup',[],function(){
    var data ={
            "listData": ['1. 当前状态','2. Dapibus ac facilisis in','3. Morbi leo risus','4. 不可用列表','5. Vestibulum at eros'],
            "footBackground":"#ededed",
            "footerFontSize": "14px"
        };



    var listgroupModel = function(data) {
        this.listgroup = ko.observable(data);
        this.listData = ko.observableArray(['1. 当前状态','2. Dapibus ac facilisis in','3. Morbi leo risus','4. 不可用列表','5. Vestibulum at eros']);
        this.listStyle = ko.observable();
        this.changelistGroupStyle = function(style){
            this.listStyle(style);
        }.bind(this);
    }


    return new listgroupModel(data);

});
