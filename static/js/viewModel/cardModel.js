/**
 * Created by chief on 16/7/16.
 */

define('card',[],function(){
    var data = [{
        "bgColor":ko.observable(""),
        "text": ko.observable("60")

    }
    ];

    var cardModel = function(data) {
        this.cardDate = ko.observableArray(data);

        this.changeBgColor = function(){
            var index = $(event.target).parents("[index]").attr("index");
            this.cardDate()[index].bgColor(bgColor);
        }.bind(this);

    };

    return new cardModel(data);



});
