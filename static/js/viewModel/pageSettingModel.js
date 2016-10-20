/**
 * Created by chief on 16/8/16.
 */

define('pageSetting',[],function(){
    var data = [{
        "bgColor":ko.observable(""),
        "bgGround": ko.observable("")
    }];

    var badgeModel = function() {
        this.bgColor = ko.observable('#ffffff');
        this.bgGround = ko.observable('');
        this.bgSize = ko.observable('');
        var self = this;
        this.bgImageUrlStyle = ko.computed(function() {
            var str = typeof self.bgGround()=='undefined'?'':self.bgGround();
            return str;
        });
    };

    return new badgeModel();

});
