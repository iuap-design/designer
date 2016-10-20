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
            return "url(" + self.bgGround() + ")";
        });
    };

    return new badgeModel();

});
