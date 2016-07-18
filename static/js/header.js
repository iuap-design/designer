/**
 * Created by chief on 16/7/15.
 */


define('desigener',[],function(){
    var init = function () {
        var container = $('#bs-example-navbar-collapse-1');
        //preview for designer

        var preview = container.find("#responsive a");


        preview.click(function(){
            preview.removeClass("active");
            $(this).addClass("active");
        });

    };
    return init = init;
});
