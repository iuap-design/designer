/**
 * Created by chief on 16/8/1.
 */

define('layout',[],function(){
	var init = function (container){


		var panel = $(container).find('.layout-panel-content');
		var rows = panel.find('.u-row');
		var widgetbox = $(container).children().filter('[class*=u-col-md-]').find('.widgetBox');
		var editPadding = panel.find("input[padding=true]");
		var editMargin = panel.find("input[margin=true]");
		var editMargin = panel.find("input[margin=true]");
		var editHeight = panel.find("input[height=true]");
		var editBackgroundImg = panel.find("input[backgroundImg=true]");
		var editBackgroundColor = panel.find("input[backgroundColor=true]");
		var editTextAlign = panel.find("[textAlign]");

		rows.click(function(){
			var layoutBox = $(container).children().filter('[class*=u-col-md-]');

			var html = $(this).children().clone();

			layoutBox.remove();

			$(container).append(html);


			$(container).children().filter('[class*=u-col-md-]').find('.widgetBox').sortable({
				placeholder: "ui-portlet-placeholder",
				connectWith: '.widgetBox',
				forcePlaceholderSize: true,
				start:function(i,ui){

				},
				stop: function (i,ui) {
					var target = $(ui.item);

					sortable(target.find('.widgetBox'),'.widgetBox');
				},
				over: function () {

				}
			}).disableSelection();
		});

		editPadding.keyup(function(){
			var paddingValue = $(this).val() + 'px';
			if(paddingValue !== ''){
				widgetbox.css("padding",paddingValue);
			}
		});
		editMargin.keyup(function(){
			var marginValue = $(this).val() + 'px';
			if(marginValue !== ''){
				widgetbox.css("margin",marginValue);
			}
		});
		editHeight.keyup(function(){
			var heightValue = $(this).val() + 'px';
			if(heightValue !== ''){
				widgetbox.css("height",heightValue);
			}
		});
		editBackgroundColor.change(function(){
			var bgColorValue = $(this).val();
			if(bgColorValue !== ''){
				widgetbox.css("background-color",bgColorValue);
			}
		});
		// editBackgroundImg.keyup(function(){
		// 	var bgImgValue = $(this).val();
		// 	if(bgImgValue !== ''){
		// 		widgetbox.css("background-image","url{'"+bgImgValue+"'}");
		// 	}
		// });
		editBackgroundImg.keyup(function(){
			var bgImgValue = $(this).val();
			if(bgImgValue !== ''){
				widgetbox.css("background-image",'url('+bgImgValue+')');
			}
		});
		editTextAlign.click(function(){
			var textAlign = $(this).attr("textAlign");
			widgetbox.css("text-align",textAlign);
		});
		

	};

	return {
		init:init
	}
});