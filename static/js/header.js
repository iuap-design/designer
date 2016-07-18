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

        var resize = {
            // resize init
            init:function(){
                this.bindEevent();
            },
            bindEevent:function(){
                var desktop = $("#desktop"),
                    tabletLandscape = $("#tablet-landscape"),
                    tabletPortrait = $("#tablet-portrait"),
                    phoneLandscape = $("#phone-landscape"),
                    phonePortrait = $("#phone-portrait");
                    container = $("#container-content");

                desktop.bind("click",function(){
                    container.removeClass();
                    container.css({"height":"100%","width":"100%","margin-top":"0"});
                });
                tabletLandscape.bind("click",function(){
                    container.removeClass().addClass("tablet-landscape");
                    container.css({"height":"auto","width":"1024px","margin-top":"0"});

                });
                tabletPortrait.bind("click",function(){
                    container.removeClass().addClass("tablet-portrait");
                    container.css({"height":"auto","width":"768px","margin-top":"0"});
                });
                phoneLandscape.bind("click",function(){
                    container.removeClass().addClass("phone-landscape");
                    container.css({"height":"392px","width":"760px","margin-top":"60px"});
                });
                phonePortrait.bind("click",function(){
                    container.removeClass().addClass("phone-portrait");
                    container.css({"height":"760px","width":"392px","margin-top":"60px"});
                })
            }
        }

        resize.init();
    };
    return init();
});
