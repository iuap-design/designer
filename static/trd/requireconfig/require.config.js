window.baseUrl = window.baseUrl?window.baseUrl:'/portal';
var config = {
	baseUrl :window.baseUrl,
	paths : {
		jquery : "trd/jquery/jquery-1.11.2.min",
		jqueryui : "trd/jquery-ui/jquery-ui",
		knockout: "trd/knockout/knockout-3.2.0.debug",
		jquerycookie:"trd/jquery-cookie/jquery-cookie",
		bootstrap : "trd/bootstrap/js/bootstrap.min",
		react : "trd/react/react",
		director : "trd/director/director",
		pubsub:"trd/pubsub/pubsub",
		Layout:"js/ext/Layouts",
		messenger : "components/messenger",
		interactor :"components/interactor",
		jsext :"components/jsext",
		Toolbar:"js/ext/Toolbar",
		viewutil:"components/viewutil",
		"text":"trd/requirejs/text",
		"css":"trd/requirejs/css",
		"art":'trd/artTemplate/template'
	},
	shim : {
		bootstrap : {
			deps : [],
			exports : 'bootstrap'
		},
		jqueryui : {
			deps : [],
			exports : 'jqueryui'
		},
		jquerycookie:{
			deps : [],
			exports : 'jquerycookie'
		},
		interactor :{
			deps : [ 'messenger']
		},
		viewutil :{
			deps : [ 'messenger','interactor'],
			exports : 'viewutil'
		}
	}
}
require.config(config);

//初始化容器配置信息
var contextRoot = config.baseUrl.replace(/.$/ig,'');
window.ContainerConfig = window.ContainerConfig || {};
if(typeof(osapi) != "undefined"){
	ContainerConfig[osapi.container.ServiceConfig.API_PATH] = contextRoot + '/rpc';
	ContainerConfig[osapi.container.ContainerConfig.RENDER_DEBUG] = '1';
	ContainerConfig[osapi.container.ContainerConfig.GET_CONTAINER_TOKEN] = function(callback) {
		//默认的用户名
		callback('john.doe:john.doe:appid:cont:url:0:default', 10);
	};
}

