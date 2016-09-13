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
		var editHeight = panel.find("select[height=true]");
		var editBackgroundImg = panel.find("input[backgroundImg=true]");
		var editBackgroundColor = panel.find("input[backgroundColor=true]");
		var editTextAlign = panel.find("[textAlign]");
		var checkBackgroundColor = panel.find("input[backgroundChecked=true]");
		var bgRepeat = panel.find("input[name=bgRepeat]");
		var colWidth = panel.find("input[name=colWidth]");
		var fixWidthSelet = panel.find("select[width=true]");
		var colWdithInput = panel.find("input[colattr]");

		rows.click(function(){
			var layoutBox = $(container).children().filter('[class*=u-col-md-]');

			var html = $(this).children().clone();
			if($(container).children().filter('[class*=u-col-md-]').find('.widgetBox').html()!==""){
				return false;
			}
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

		checkBackgroundColor.change(function(){
			widgetbox.toggleClass("BgTransparent")
		});
		editPadding.change(function(){
			var paddingtop = panel.find("input[padding=true]")[0].value + 'px';
			var paddingright = panel.find("input[padding=true]")[1].value + 'px';
			var paddingbottom = panel.find("input[padding=true]")[2].value + 'px';
			var paddingleft = panel.find("input[padding=true]")[3].value + 'px';
			widgetbox.css("padding-left",paddingleft);
			widgetbox.css("padding-right",paddingright);
			widgetbox.css("padding-top",paddingtop);
			widgetbox.css("padding-bottom",paddingbottom);
		});
		editMargin.keyup(function(){
			// var marginValue = $(this).val() + 'px';
			// if(marginValue !== ''){
			// 	widgetbox.css("margin",marginValue);
			// }

			var margintop = panel.find("input[margin=true]")[0].value + 'px';
			var marginright = panel.find("input[margin=true]")[1].value + 'px';
			var marginbottom = panel.find("input[margin=true]")[2].value + 'px';
			var marginleft = panel.find("input[margin=true]")[3].value + 'px';
			widgetbox.css("margin-left",marginleft);
			widgetbox.css("margin-right",marginright);
			widgetbox.css("margin-top",margintop);
			widgetbox.css("margin-bottom",marginbottom);

		});
		editHeight.change(function(){
			var heightValue = $(this).find("option:selected").val();
			widgetbox.addClass(heightValue);
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
				widgetbox.css("background-repeat",'no-repeat');
			}
		});
		editTextAlign.click(function(){
			var textAlign = $(this).attr("textAlign");
			widgetbox.css("text-align",textAlign);
		});

		bgRepeat.click(function(){
			var repeatTrue = $(this).attr("repeat");
			widgetbox.css("background-repeat",repeatTrue);
		});

		colWidth.click(function(){
			
			var colWidthType = $(this).attr("colWidth");

			if(colWidthType === "free"){
				$("input[colWidth=free]").siblings().find("input").removeAttr("disabled");
				$("input[colWidth=fix]").siblings().find("select").attr('disabled',true);
				var mdColVal = $(this).siblings().find("input[colattr=md]").value;
				var smColVal = $(this).siblings().find("input[colattr=sm]").value;
				var lgColVal = $(this).siblings().find("input[colattr=lg]").value;
				if(mdColVal !==""){
					mdClass = "col-md-" + mdColVal;
					widgetbox.parent().addClass(mdClass);
				}
				if(smColVal !==""){
					smClass = "col-sm-" + smColVal;
					widgetbox.parent().addClass(smClass);
				}
				if(lgColVal !==""){
					lgClass = "col-lg-" + lgColVal;
					widgetbox.parent().addClass(lgClass);
				}
				
			}
			if(colWidthType === "fix"){
				$("input[colWidth=fix]").siblings().find("select").removeAttr("disabled");
				$("input[colWidth=free]").siblings().find("input")[0].disabled = true;
				$("input[colWidth=free]").siblings().find("input")[1].disabled = true;
				$("input[colWidth=free]").siblings().find("input")[2].disabled = true;
				var fixColVal = $(this).siblings().find("select option:selected").val();
				widgetbox.parent().addClass(fixColVal);
			}

		});

		fixWidthSelet.change(function(){
			var fixColVal = $(this).find("option:selected").val();
			widgetbox.parent().addClass(fixColVal);
		});
		
		colWdithInput.change(function(){
			var freeColVal = "col-" + $(this).attr("colattr")+ "-"+ $(this).val();
			widgetbox.parent().addClass(freeColVal);
		})

	};

	return {
		init:init
	}
});