/**
 * 校验类型说明：
 *  validType:校验类型（integer、float、zipCode、phone、landline、email、url、datetime）
 *  max: 数字最大值
 *  min: 数字最小值
 *  maxLength: string最大长度
 *  minLength: string最小长度
 *  required: 必填
 *  tipId：错误信息提示的div的id值
 *  successId：正确信息显示的id值
 *  regExp：正则表达式校验
 *  errorMsg：错误提示信息
 *  nullMsg：空提示信息
 */
u.on(window, 'load', function() {
	var app, viewModel;
	viewModel = {
	    dt1: new u.DataTable({
	        meta: {
	            f1: { type: 'string', maxLength: 8, minLength: 3 },
	            f2: { type: 'float', precision: 2, max: 500, min: 100 },
	            f3: { type: 'integer', required: true, regExp: /^[0-9]{6}$/ },
	            f4: { type: 'string', required: true }
	
	        }
	    })
	};
	
	
	app = u.createApp({
	    el: '#validateExample',
	    model: viewModel
	});
	
	var r = viewModel.dt1.createEmptyRow();
	viewModel.dt1.setRowSelect(0);

})
