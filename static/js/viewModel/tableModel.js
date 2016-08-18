/**
 * Created by chief on 16/7/16.
 */

define('table',[],function(){
    
    var tableModel = function() {
        this.tableStyle = ko.observable();
        this.changetableStyle = function(style){
            this.tableStyle(style);
        }.bind(this);
        
    };

    return new tableModel();
});
