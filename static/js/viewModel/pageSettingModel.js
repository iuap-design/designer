/**
 * Created by chief on 16/8/16.
 */

define('pageSetting',[],function(){
    var data = [{
        "bgColor":ko.observable(""),
        "bgGround": ko.observable("")
    }];

    var badgeModel = function() {
        this.bgColor = ko.observable('rgba(0, 188, 212, 0.05)');
        this.bgGround = ko.observable('');
        this.bgRepeat = ko.observable(true);
    };

    return new badgeModel();

});
