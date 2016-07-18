$.fn.grid.gridComp.prototype.createHeader = function() {
	var wrapStr = '',headerShowStr = '';
	if(!this.options.showHeader)
		headerShowStr = 'style="display:none;"';
	var htmlStr = '<div class="u-grid-header" id="' + this.options.id + '_header" ' + headerShowStr + '><div class="u-grid-header-wrap" id="' + this.options.id + '_header_wrap" data-role="resizable" ' + wrapStr + '>';
	htmlStr += '<div class="u-grid-header-columnmenu fa fa-bars"></div>';
	if (this.options.multiSelect || this.options.showNumCol) {
		htmlStr += '<div id="' + this.options.id + '_header_left" class="u-grid-header-left" style="width:' + this.leftW + 'px;">';
		if (this.options.multiSelect) {
			var gridBrowser = {},userAgent = navigator.userAgent,ua = userAgent.toLowerCase(),s;
			if (s=ua.match(/msie ([\d.]+)/)) {
				gridBrowser.isIE = true;
			}
			if (gridBrowser.isIE) {
				var mode = document.documentMode;
				if(mode == null){
				}else{
					if (mode == 8) {
						gridBrowser.isIE8 = true;
					}
					else if (mode == 9) {
						gridBrowser.isIE9 = true;
					}
				}
			}
			if(gridBrowser.isIE8){
				//htmlStr += '<div class="u-grid-header-multi-select" style="width:' + this.multiWidth + 'px;"><input class="u-grid-multi-input"   type="checkbox" id="' + this.options.id + '_header_multi_input"></div>'
				htmlStr += '<div class="u-grid-header-multi-select" style="width:' + this.multiWidth + 'px;"><span class="u-grid-checkbox-outline" id="' + this.options.id + '_header_multi_input"><span class="u-grid-checkbox-tick-outline"></span></span></div>'
				
			}else{
				//htmlStr += '<div class="u-grid-header-multi-select  checkbox check-success" style="width:' + this.multiWidth + 'px;"><input  class="u-grid-multi-input"  type="checkbox" id="' + this.options.id + '_header_multi_input"><label for="' + this.options.id + '_header_multi_input"></label></div>'
				htmlStr += '<div class="u-grid-header-multi-select  checkbox check-success" style="width:' + this.multiWidth + 'px;"><span class="u-grid-checkbox-outline" id="' + this.options.id + '_header_multi_input"><span class="u-grid-checkbox-tick-outline"></span></span></div>'
			}
		}
		if (this.options.showNumCol) {
			htmlStr += '<div class="u-grid-header-num" style="width:' + this.numWidth + 'px;">序号</div>';
		}
		htmlStr += '</div>';
	}
	htmlStr += this.createHeaderTableFixed();
	htmlStr += this.createHeaderTable();
	htmlStr += '</div>';
	htmlStr += this.createHeaderDrag();;
	htmlStr += '</div>';
	return htmlStr;
}

u.on(window, 'load', function() {
	viewModel = {
		dataTable: new u.DataTable({
			meta: {
				"name": "",
				"time": "",
				"distance": "",
				"currency": ""
			}
		}, this),
	};
	var app = u.createApp({
	    el: '#girdComp',
	    model: viewModel
	});
	var data = {
		"pageIndex": 1,
		"pageSize": 10,
		"rows": [{
			"status": "nrm",
			"data": {
				"name": "赵四",
				"time": "2016-05-16",
				"distance": "25",
				"currency": {
					"value": "200.00",
					"meta": {
						"precision": "2",
						"max": "3000",
						"min": "0",
						"curSymbol": "$"
					}
				}
			}
		}, {
			"status": "nrm",
			"data": {
				"name": "王一",
				"time": "2016-05-12",
				"distance": "25",
				"currency": {
					"value": "200.00",
					"meta": {
						"precision": "2",
						"max": "3000",
						"min": "0",
						"curSymbol": "$"
					}
				}
			}
		}, {
			"status": "nrm",
			"data": {
				"name": "李三",
				"time": "2016-11-16",
				"distance": "50",
				"currency": {
					"value": "300.00",
					"meta": {
						"precision": "2",
						"max": "3000",
						"min": "0",
						"curSymbol": "$"
					}
				}
			}
		}, {
			"status": "nrm",
			"data": {
				"name": "彰武",
				"time": "2012-05-16",
				"distance": "50",
				"currency": {
					"value": "300.00",
					"meta": {
						"precision": "2",
						"max": "3000",
						"min": "0",
						"curSymbol": "$"
					}
				}
			}
		}]
	}
	viewModel.dataTable.removeAllRows();
	viewModel.dataTable.setData(data);

})