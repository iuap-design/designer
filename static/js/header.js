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
                var that = this;
                var desktop = $("#desktop"),
                    tabletLandscape = $("#tablet-landscape"),
                    tabletPortrait = $("#tablet-portrait"),
                    phoneLandscape = $("#phone-landscape"),
                    phonePortrait = $("#phone-portrait"),
                    container = $("#container-content"),
                    containerLayout = $("#container-content .layoutBox");
                    

                //var iframe = document.createElement('iframe'); 

                // console.log($(iframe).contents().find("head"));
                desktop.bind("click",function(){ 
                    var tempHTML = "";
                    if($("#container-content .layoutBox").find("iframe").length !== 0){
                        tempHTML = $("iframe").contents().find("body").html();
                    }else{
                        tempHTML = $("#container-content .layoutBox").html();
                    }

                    $("#container-content .layoutBox").html(tempHTML);
                    container.removeClass();
                    // container.css({"height":"100%","width":"100%","margin-top":"0"});
                });
                tabletLandscape.bind("click",function(){
                    if(container.find("iframe").length !== 0){
                        container.removeClass().addClass("tablet-landscape");
                    }else{
                        that.appendIframe();
                        container.removeClass().addClass("tablet-landscape");
                    }

                });
                tabletPortrait.bind("click",function(){
                    if(container.find("iframe").length !== 0){
                        container.removeClass().addClass("tablet-portrait");
                    }else{
                        that.appendIframe();
                        container.removeClass().addClass("tablet-portrait");
                    }

                });
                phoneLandscape.bind("click",function(){
                    container.removeClass().addClass("phone-landscape");
                    container.css({"height":"392px","width":"760px","margin-top":"60px"});
                });
                phonePortrait.bind("click",function(){
                    container.removeClass().addClass("phone-portrait");
                    container.css({"height":"760px","width":"392px","margin-top":"60px"});
                })
            },
            appendIframe:function(){
                var that = this;
                var desktop = $("#desktop"),
                    tabletLandscape = $("#tablet-landscape"),
                    tabletPortrait = $("#tablet-portrait"),
                    phoneLandscape = $("#phone-landscape"),
                    phonePortrait = $("#phone-portrait"),
                    container = $("#container-content"),
                    tempHTML = $("#container-content .layoutBox").html(),
                    containerLayout = $("#container-content .layoutBox"),
                    iframe = document.createElement('iframe'); 


                containerLayout.html("");
                containerLayout.append(iframe);
                $(iframe).contents().find("body").html(tempHTML);
                $(iframe).contents().find("head").append('<link rel="stylesheet" href="trd/bootstrap/css/bootstrap.css">');
                $(iframe).contents().find("head").append('<link rel="stylesheet" href="http://127.0.0.1:9000/main.css">');

                
            }
        }

        resize.init();
    };
    return init();
});
