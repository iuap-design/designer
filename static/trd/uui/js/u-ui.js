+function(){

var U_LANGUAGES = "i_languages";
var U_THEME = "u_theme";
var U_LOCALE = "u_locale";
var U_USERCODE = "usercode";
var enumerables = true,enumerablesTest = {toString: 1},toString = Object.prototype.toString;

for (var i in enumerablesTest) {
	enumerables = null;
}
if (enumerables) {
	enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
		'toLocaleString', 'toString', 'constructor'];
}

window.u = window.u || {};
//window.$ = {}
var u = window.u;
//var $ = u;

u.enumerables = enumerables;
/**
 * 复制对象属性
 *
 * @param {Object}  目标对象
 * @param {config} 源对象
 */
u.extend = function(object, config) {
	var args = arguments,options;
	if(args.length > 1){
		for(var len=1; len<args.length; len++){
			options = args[len];
			if (object && options && typeof options === 'object') {
				var i, j, k;
				for (i in options) {
					object[i] = options[i];
				}
				if (enumerables) {
					for (j = enumerables.length; j--;) {
						k = enumerables[j];
						if (options.hasOwnProperty(k)) {
							object[k] = options[k];
						}
					}
				}
			}
		}
	}
	return object;
};

u.extend(u, {
	setCookie: function (sName, sValue, oExpires, sPath, sDomain, bSecure) {
		var sCookie = sName + "=" + encodeURIComponent(sValue);
		if (oExpires)
			sCookie += "; expires=" + oExpires.toGMTString();
		if (sPath)
			sCookie += "; path=" + sPath;
		if (sDomain)
			sCookie += "; domain=" + sDomain;
		if (bSecure)
			sCookie += "; secure=" + bSecure;
		document.cookie = sCookie;
	},
	getCookie: function (sName) {
		var sRE = "(?:; )?" + sName + "=([^;]*);?";
		var oRE = new RegExp(sRE);

		if (oRE.test(document.cookie)) {
			return decodeURIComponent(RegExp["$1"]);
		} else
			return null;
	},
	/**
	 * 创建一个带壳的对象,防止外部修改
	 * @param {Object} proto
	 */
	createShellObject: function (proto) {
		var exf = function () {
		}
		exf.prototype = proto;
		return new exf();
	},
	execIgnoreError: function (a, b, c) {
		try {
			a.call(b, c);
		} catch (e) {
		}
	},
	on: function (element, eventName,child,listener) {
		if(arguments.length < 4){
			listener = child;
			child = undefined;
		}else{
			var childlistener = function(e){
				if(!e){
					return;
				}
				var tmpchildren = element.querySelectorAll(child)	
				tmpchildren.forEach(function(node){
					if(node == e.target){
							listener.call(e.target,e)	
					}
				})
			}		
		}
		//capture = capture || false;
		
		if(!element["uEvent"]){
			//在dom上添加记录区
			element["uEvent"] = {}				
		}
		//判断是否元素上是否用通过on方法填加进去的事件
		if(!element["uEvent"][eventName]){					
			element["uEvent"][eventName] = [child?childlistener:listener]				
			element["uEvent"][eventName+'fn'] = function(){
												//火狐下有问题修改判断
												var e = typeof event != 'undefined' && event?event:window.event;
												element["uEvent"][eventName].forEach(function(fn){
														fn.call(element,e)														
												})
											}
			if (element.addEventListener) {  // 用于支持DOM的浏览器		
				element.addEventListener(eventName, element["uEvent"][eventName+'fn']);
			} else if (element.attachEvent) {  // 用于IE浏览器
				element.attachEvent("on" + eventName,element["uEvent"][eventName+'fn'] );
			} else {  // 用于其它浏览器			
				element["on" + eventName] = element["uEvent"][eventName+'fn']
			}
		}else{
			//如果有就直接往元素的记录区添加事件
			element["uEvent"][eventName].push(child?childlistener:listener)
			
		}
		
	},
	off: function(element, eventName, listener){
		//删除事件数组
		
		var eventfn = element["uEvent"][eventName+'fn']	
		if (element.removeEventListener) {  // 用于支持DOM的浏览器
			element.removeEventListener(eventName,eventfn );
		} else if (element.removeEvent) {  // 用于IE浏览器
			element.removeEvent("on" + eventName, eventfn);
		} else {  // 用于其它浏览器
			delete element["on" + eventName]
		}
		element["uEvent"][eventName] = undefined
		element["uEvent"][eventName+'fn'] = undefined
	},
	trigger:function(element,eventName){
		if(element["uEvent"] && element["uEvent"][eventName]){
			element["uEvent"][eventName+'fn']() 				
		}
	},
	/**
	 * 增加样式
	 * @param value
	 * @returns {*}
	 */
	addClass: function (element, value) {
		if (typeof element.classList === 'undefined') {
			u._addClass(element, value);
		} else {
			element.classList.add(value);
		}
		return u;
	},
	removeClass: function (element, value) {
		if (typeof element.classList === 'undefined') {
			u._removeClass(element, value);
		} else {
			element.classList.remove(value);
		}
		return u;
	},
	hasClass: function(element, value){
		if (element.nodeName === '#text') return false;
		if (typeof element.classList === 'undefined') {
			return u._hasClass(element,value);
		}else{
			return element.classList.contains(value);
		}
	},
	toggleClass: function(element,value){
		if (typeof element.classList === 'undefined') {
			return u._toggleClass(element,value);
		}else{
			return element.classList.toggle(value);
		}
	},
	css:function(element,csstext,val){
		if(csstext instanceof Object){
			for(var k in csstext){
				var tmpcss = csstext[k]
				if(["width","height","top","bottom","left","right"].indexOf(k) > -1 && u.isNumber(tmpcss) ){
					tmpcss = tmpcss + "px"
				}
				element.style[k] = tmpcss
			}
		}else{
			if(arguments.length > 2){
				element.style[csstext] = val
			}else{				
				u.getStyle(element,csstext)
			}
		}
		
	},
	wrap:function(element,parent){
		var p = u.makeDOM(parent)
			element.parentNode.insertBefore(p,element)
			p.appendChild(element)
	},
	getStyle:function(element,key){
		//不要在循环里用
		var allCSS
		if(window.getComputedStyle){
			allCSS = window.getComputedStyle(element)
		}else{
			allCSS = element.currentStyle
		}
		if(allCSS[key] !== undefined){
			return allCSS[key] 
		}else{
			return ""
		}
	},
	/**
	 * 统一zindex值, 不同控件每次显示时都取最大的zindex，防止显示错乱
	 */
	getZIndex: function(){
		if (!u.globalZIndex){
			u.globalZIndex = 1000;
		}
		return u.globalZIndex ++;
	},
	makeDOM: function(htmlString){
		var tempDiv = document.createElement("div");
		tempDiv.innerHTML = htmlString;
		var _dom = tempDiv.children[0];
		return _dom;
	},
	/**
	 * 阻止冒泡
	 */
	stopEvent: function(e){
		if(typeof(e) != "undefined"){
			if (e.stopPropagation)
				e.stopPropagation();
			else {
				e.cancelBubble = true;
			}
		}
	},
	getFunction: function(target, val){
		if (!val || typeof val == 'function') return val
		if (typeof target[val] == 'function')
			return target[val]
		else if (typeof window[val] == 'function')
			return window[val]
		else if (val.indexOf('.') != -1){
			var func = u.getJSObject(target, val)
			if (typeof func == 'function') return func
			func = u.getJSObject(window, val)
			if (typeof func == 'function') return func
		}
		return val
	},
	getJSObject: function(target, names) {
		if(!names) {
			return;
		}
		if (typeof names == 'object')
			return names
		var nameArr = names.split('.')
		var obj = target
		for (var i = 0; i < nameArr.length; i++) {
			obj = obj[nameArr[i]]
			if (!obj) return null
		}
		return obj
	},
	isDate: function(input){
		return Object.prototype.toString.call(input) === '[object Date]' ||
				input instanceof Date;
	},
	isNumber : function(obj){
		//return obj === +obj
		return (obj - parseFloat( obj ) + 1) >= 0;
	},
	isArray: Array.isArray || function (val) {
		return Object.prototype.toString.call(val) === '[object Array]';
	},
	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},
	inArray :function(node,arr){
	

	  if(!arr instanceof Array){
		throw "arguments is not Array"; 
	  }

	  for(var i=0,k=arr.length;i<k;i++){
		if(node==arr[i]){
		  return true;  
		}
	  }

	  return false;
	},
	each: function(obj,callback){
		if(obj.forEach){
			obj.forEach(function(v,k){callback(k,v)})

		}else if(obj instanceof Object){
			for(var k in obj){
				callback(k,obj[k])
			}
		}else{
			return
		}

	}

});

//core context
(function() {
	var environment = {};
	/**
	 * client attributes
	 */
	var clientAttributes = {};

	var sessionAttributes = {};

	var fn = {};
	var maskerMeta = {
		'float': {
			precision: 2
		},
		'datetime': {
			format: 'YYYY-MM-DD hh:mm:ss',
			metaType: 'DateTimeFormatMeta',
			speratorSymbol: '-'
		},
		'time':{
			format:'hh:mm:ss'
		},
		'date':{
			format:'YYYY-MM-DD'
		},
		'currency':{
			precision: 2,
			curSymbol: '￥'
		},
		'percent':{

		}
	};
	/**
	 * 获取环境信息
	 * @return {environment}
	 */
	fn.getEnvironment = function() {
		return u.createShellObject(environment);
	};

	/**
	 * 获取客户端参数对象
	 * @return {clientAttributes}
	 */
	fn.getClientAttributes = function() {
		var exf = function() {}
		return u.createShellObject(clientAttributes);
	}


	fn.setContextPath = function(contextPath) {
		return environment[IWEB_CONTEXT_PATH] = contextPath
	}
	fn.getContextPath = function(contextPath) {
		return environment[IWEB_CONTEXT_PATH]
	}
	/**
	 * 设置客户端参数对象
	 * @param {Object} k 对象名称
	 * @param {Object} v 对象值(建议使用简单类型)
	 */
	fn.setClientAttribute = function(k, v) {
		clientAttributes[k] = v;
	}
	/**
	 * 获取会话级参数对象
	 * @return {clientAttributes}
	 */
	fn.getSessionAttributes = function() {
		var exf = function() {}
		return u.createShellObject(sessionAttributes);
	}

	/**
	 * 设置会话级参数对象
	 * @param {Object} k 对象名称
	 * @param {Object} v 对象值(建议使用简单类型)
	 */
	fn.setSessionAttribute = function(k, v) {
		sessionAttributes[k] = v;
		setCookie("ISES_" + k, v);
	}

	/**
	 * 移除客户端参数
	 * @param {Object} k 对象名称
	 */
	fn.removeClientAttribute = function(k) {
		clientAttributes[k] = null;
		execIgnoreError(function() {
			delete clientAttributes[k];
		})
	}

		/**
		 * 获取地区信息编码
		 */
		fn.getLocale = function() {
			return this.getEnvironment().locale
		}
		
	/**
	 * 获取多语信息
	 */
	fn.getLanguages = function(){
		return this.getEnvironment().languages
	};
	/**
	 * 收集环境信息(包括客户端参数)
	 * @return {Object}
	 */
	fn.collectEnvironment = function() {
		var _env = this.getEnvironment();
		var _ses = this.getSessionAttributes();

		for (var i in clientAttributes) {
			_ses[i] = clientAttributes[i];
		}
		_env.clientAttributes = _ses;
		return _env
	}

	/**
	 * 设置数据格式信息
	 * @param {String} type
	 * @param {Object} meta
	 */
	fn.setMaskerMeta = function(type, meta) {
		if (typeof type == 'function'){
			getMetaFunc = type;
		}else{
			if (!maskerMeta[type])
				maskerMeta[type] = meta;
			else{
				if (typeof meta != 'object')
					maskerMeta[type] = meta;
				else
					for (var key in meta){
						maskerMeta[type][key] = meta[key];
					}
			}
		}
	};
	fn.getMaskerMeta = function(type) {
		if (typeof getMetaFunc == 'function'){
			var meta = getMetaFunc.call(this);
			return meta[type];
		}else
			return u.extend({}, maskerMeta[type]);
	};
	environment.languages = u.getCookie(U_LANGUAGES) ? u.getCookie(U_LANGUAGES).split(',') : navigator.language;

	environment.theme = u.getCookie(U_THEME);
	environment.locale = u.getCookie(U_LOCALE);
	//environment.timezoneOffset = (new Date()).getTimezoneOffset()
	environment.usercode = u.getCookie(U_USERCODE);
	//init session attribute
	document.cookie.replace(/ISES_(\w*)=([^;]*);?/ig, function(a, b, c) {
		sessionAttributes[b] = c;
	});


	var Core = function() {};
	Core.prototype = fn;

	u.core = new Core();

})();

u.extend(u, {
	isIE:  false,
	isFF: false,
	isOpera: false,
	isChrome: false,
	isSafari: false,
	isWebkit: false,
	isIE8_BEFORE: false,
	isIE8: false,
	isIE8_CORE: false,
	isIE9: false,
	isIE9_CORE: false,
	isIE10: false,
	isIE10_ABOVE: false,
	isIE11: false,
	isIOS: false,
	isIphone: false,
	isIPAD: false,
	isStandard: false,
	version: 0,
	isWin: false,
	isUnix: false,
	isLinux: false,
	isAndroid: false,
	isMac: false,
	hasTouch: false,
});

(function(){
	var userAgent = navigator.userAgent,
			rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
			rFirefox = /(firefox)\/([\w.]+)/,
			rOpera = /(opera).+version\/([\w.]+)/,
			rChrome = /(chrome)\/([\w.]+)/,
			rSafari = /version\/([\w.]+).*(safari)/,
			version,
			ua = userAgent.toLowerCase(),
			s,
			browserMatch = { browser : "", version : ''},
			match = rMsie.exec(ua);

	if (match != null) {
		browserMatch =  { browser : "IE", version : match[2] || "0" };
	}
	match = rFirefox.exec(ua);
	if (match != null) {
		browserMatch =  { browser : match[1] || "", version : match[2] || "0" };
	}
	match = rOpera.exec(ua);
	if (match != null) {
		browserMatch =  { browser : match[1] || "", version : match[2] || "0" };
	}
	match = rChrome.exec(ua);
	if (match != null) {
		browserMatch =  { browser : match[1] || "", version : match[2] || "0" };
	}
	match = rSafari.exec(ua);
	if (match != null) {
		browserMatch =  { browser : match[2] || "", version : match[1] || "0" };
	}
	if (match != null) {
		browserMatch =  { browser : "", version : "0" };
	}


	if (s=ua.match(/opera.([\d.]+)/)) {
		u.isOpera = true;
	}else if(browserMatch.browser=="IE"&&browserMatch.version==11){
		u.isIE11 = true;
		u.isIE = true;
	}else if (s=ua.match(/chrome\/([\d.]+)/)) {
		u.isChrome = true;
		u.isStandard = true;
	} else if (s=ua.match(/version\/([\d.]+).*safari/)) {
		u.isSafari = true;
		u.isStandard = true;
	} else if (s=ua.match(/gecko/)) {
		//add by licza : support XULRunner
		u.isFF = true;
		u.isStandard = true;
	} else if (s=ua.match(/msie ([\d.]+)/)) {
		u.isIE = true;
	}

	else if (s=ua.match(/firefox\/([\d.]+)/)) {
		u.isFF = true;
		u.isStandard = true;
	}
	if (ua.match(/webkit\/([\d.]+)/)) {
		u.isWebkit = true;
	}
	if (ua.match(/ipad/i)){
		u.isIOS = true;
		u.isIPAD = true;
		u.isStandard = true;
	}
	if (ua.match(/iphone/i)){
		u.isIOS = true;
		u.isIphone = true;
	}
	
	if((navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel")){
		//u.isIOS = true;
		u.isMac = true;
	}
	
	if((navigator.platform == "Win32") || (navigator.platform == "Windows")){
		u.isWin = true;
	}
	
	if((navigator.platform == "X11") && !u.isWin && !u.isMac){
		u.isUnix = true;
	}
    if((String(navigator.platform).indexOf("Linux") > -1)){
    	u.isLinux = true;
    }
    
    if(ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1){
    	u.isAndroid = true;
    }
	
	u.version = version ? (browserMatch.version ?  browserMatch.version : 0) : 0;
	if (u.isIE) {
		var intVersion = parseInt(u.version);
		var mode = document.documentMode;
		if(mode == null){
			if (intVersion == 6 || intVersion == 7) {
				u.isIE8_BEFORE = true;
			}
		}
		else{
			if(mode == 7){
				u.isIE8_BEFORE = true;
			}
			else if (mode == 8) {
				u.isIE8 = true;
			}
			else if (mode == 9) {
				u.isIE9 = true;
				u.isSTANDARD = true;
			}
			else if (mode == 10) {
				u.isIE10 = true;
				u.isSTANDARD = true;
				u.isIE10_ABOVE = true;
			}
			else{
				u.isSTANDARD = true;
			}
			if (intVersion == 8) {
				u.isIE8_CORE = true;
			}
			else if (intVersion == 9) {
				u.isIE9_CORE = true;
			}
			else if(browserMatch.version==11){
				u.isIE11 = true;
			}
			else{

			}
		}
	}
	if(document.hasOwnProperty("ontouchstart")) {
		u.hasTouch = true;
	}
})();

if (u.isIE8_BEFORE){
	alert('uui 不支持IE8以前的浏览器版本，请更新IE浏览器或使用其它浏览器！')
	throw new Error('uui 不支持IE8以前的浏览器版本，请更新IE浏览器或使用其它浏览器！');
}
if (u.isIE8 && !u.polyfill){
	alert('IE8浏览器中使用uui 必须在u.js之前引入u-polyfill.js!');
	throw new Error('IE8浏览器中使用uui 必须在uui之前引入u-polyfill.js!');
}
//TODO 兼容 后面去掉
//u.Core = u.core;
window.iweb = {};
window.iweb.Core = u.core;
window.iweb.browser = {
	isIE: u.isIE,
	isFF: u.isFF,
	isOpera: u.isOpera,
	isChrome: u.isChrome,
	isSafari: u.isSafari,
	isWebkit: u.isWebkit,
	isIE8_BEFORE: u.isIE8_BEFORE,
	isIE8: u.isIE8,
	isIE8_CORE: u.isIE8_CORE,
	isIE9: u.isIE9,
	isIE9_CORE: u.isIE9_CORE,
	isIE10: u.isIE10,
	isIE10_ABOVE: u.isIE10_ABOVE,
	isIE11: u.isIE11,
	isIOS: u.isIOS,
	isIphone: u.isIphone,
	isIPAD: u.isIPAD,
	isStandard: u.isStandard,
	version: 0,
	isWin: u.isWin,
	isUnix: u.isUnix,
	isLinux: u.isLinux,
	isAndroid: u.isAndroid,
	isMac: u.isMac,
	hasTouch: u.hasTouch,
};



NodeList.prototype.forEach = Array.prototype.forEach;


/**
 * 获得字符串的字节长度
 */
String.prototype.lengthb = function() {
    //	var str = this.replace(/[^\x800-\x10000]/g, "***");
    var str = this.replace(/[^\x00-\xff]/g, "**");
    return str.length;
};

/**
 * 将AFindText全部替换为ARepText
 */
String.prototype.replaceAll = function(AFindText, ARepText) {
    //自定义String对象的方法
    var raRegExp = new RegExp(AFindText, "g");
    return this.replace(raRegExp, ARepText);
};



var XmlHttp = {
  get : "get",
  post : "post",
  reqCount : 4,
  createXhr : function() {
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
  },
  ajax : function(_json) {
    var url = _json["url"];
    var callback = _json["success"];
    var async = (_json["async"] == undefined ? true : _json["async"]);
    var error = _json["error"];
    var params = _json["data"];
    var method = (_json["type"] == undefined ? XmlHttp.post : _json["type"]).toLowerCase();
		var gzipFlag = params.compressType;
    url = XmlHttp.serializeUrl(url);
    params = XmlHttp.serializeParams(params);
    if(gzipFlag == 'gzip'){
    	params = params.replace(/\+/g, '%2B').replace(/\"/g,'%22').replace(/\'/g, '%27').replace(/\//g,'%2F');
    }
    if (method == XmlHttp.get && params != null) {
      url += ("&" + params);
      params = null;	//如果是get请求,保证最终会执行send(null)
    }

    var xmlhttp = XmlHttp.createXhr();
    xmlhttp.open(method, url, async);

    if (method == XmlHttp.post) {
      xmlhttp.setRequestHeader("Content-type",
          "application/x-www-form-urlencoded;charset=UTF-8");
    }

    var execount = 0;
    // 异步
    if (async) {
      // readyState 从 1~4发生4次变化
      xmlhttp.onreadystatechange = function() {
        execount++;
        // 等待readyState状态不再变化之后,再执行回调函数
        //if (execount == XmlHttp.reqCount) {// 火狐下存在问题，修改判断方式
		if(this.readyState == XmlHttp.reqCount){
          XmlHttp.execBack(xmlhttp, callback, error);
        }
      };
      // send方法要在在回调函数之后执行
      if(gzipFlag == 'gzip'){
      	xmlhttp.send(params);
      }else{
      	if (method == XmlHttp.post) { // 非压缩态如果是post则需要执行一次encode操作。
	      	xmlhttp.send(encodeURI(params));
	      }else{
	      	xmlhttp.send(params);
	      }
      }
      
      
    } else {
      // 同步 readyState 直接变为 4
      // 并且 send 方法要在回调函数之前执行
      if(gzipFlag == 'gzip'){
      	xmlhttp.send(params);
      }else{
      	if (method == XmlHttp.post) { // 非压缩态如果是post则需要执行一次encode操作。
	      	xmlhttp.send(encodeURI(params));
	      }else{
	      	xmlhttp.send(params);
	      }
      }
      XmlHttp.execBack(xmlhttp, callback, error);
    }
  },
  execBack : function(xmlhttp, callback, error) {
    //if (xmlhttp.readyState == 4
     if (xmlhttp.status == 200 || xmlhttp.status == 304) {
      callback(xmlhttp.responseText,xmlhttp.status, xmlhttp);
    } else {
      if (error) {
        error(xmlhttp.responseText,xmlhttp.status, xmlhttp);
      } else {
        var errorMsg = "no error callback function!";
        if(xmlhttp.responseText) {
          errorMsg = xmlhttp.responseText;
        }
        alert(errorMsg);
        // throw errorMsg;
      }
    }
  },
  serializeUrl : function(url) {
    var cache = "cache=" + Math.random();
    if (url.indexOf("?") > 0) {
      url += ("&" + cache);
    } else {
      url += ("?" + cache);
    }
    return url;
  },
  serializeParams : function(params) {
    var ud = undefined;
    if (ud == params || params == null || params == "") {
      return null;
    }
    if (params.constructor == Object) {
      var result = "";
      for ( var p in params) {
        result += (p + "=" + params[p] + "&");
      }
      return result.substring(0, result.length - 1);
    }
    return params;
  }
};

//if ($ && $.ajax)
//  u.ajax = $.ajax;
//else
  u.ajax = XmlHttp.ajax;



var Class = function (o) {
    if (!(this instanceof Class) && isFunction(o)) {
        return classify(o)
    }
}

// Create a new Class.
//
//  var SuperPig = Class.create({
//    Extends: Animal,
//    Implements: Flyable,
//    initialize: function() {
//      SuperPig.superclass.initialize.apply(this, arguments)
//    },
//    Statics: {
//      COLOR: 'red'
//    }
// })
//
Class.create = function (parent, properties) {
    if (!isFunction(parent)) {
        properties = parent
        parent = null
    }

    properties || (properties = {})
    parent || (parent = properties.Extends || Class)
    properties.Extends = parent

    // The created class constructor
    function SubClass() {
        // Call the parent constructor.
        parent.apply(this, arguments)

        // Only call initialize in self constructor.
        if (this.constructor === SubClass && this.initialize) {
            this.initialize.apply(this, arguments)
        }
    }

    // Inherit class (static) properties from parent.
    if (parent !== Class) {
        mix(SubClass, parent, parent.StaticsWhiteList)
    }

    // Add instance properties to the subclass.
    implement.call(SubClass, properties)

    // Make subclass extendable.
    return classify(SubClass)
}

function implement(properties) {
    var key, value

    for (key in properties) {
        value = properties[key]

        if (Class.Mutators.hasOwnProperty(key)) {
            Class.Mutators[key].call(this, value)
        } else {
            this.prototype[key] = value
        }
    }
}


// Create a sub Class based on `Class`.
Class.extend = function (properties) {
    properties || (properties = {})
    properties.Extends = this

    return Class.create(properties)
}


function classify(cls) {
    cls.extend = Class.extend
    cls.implement = implement
    return cls
}


// Mutators define special properties.
Class.Mutators = {

    'Extends': function (parent) {
        var existed = this.prototype
        var proto = createProto(parent.prototype)

        // Keep existed properties.
        mix(proto, existed)

        // Enforce the constructor to be what we expect.
        proto.constructor = this

        // Set the prototype chain to inherit from `parent`.
        this.prototype = proto

        // Set a convenience property in case the parent's prototype is
        // needed later.
        this.superclass = parent.prototype
    },

    'Implements': function (items) {
        isArray(items) || (items = [items])
        var proto = this.prototype,
            item

        while (item = items.shift()) {
            mix(proto, item.prototype || item)
        }
    },

    'Statics': function (staticProperties) {
        mix(this, staticProperties)
    }
}


// Shared empty constructor function to aid in prototype-chain creation.
function Ctor() {
}

// See: http://jsperf.com/object-create-vs-new-ctor
var createProto = Object.__proto__ ?
    function (proto) {
        return {
            __proto__: proto
        }
    } :
    function (proto) {
        Ctor.prototype = proto
        return new Ctor()
    }


// Helpers
// ------------

function mix(r, s, wl) {
    // Copy "all" properties including inherited ones.
    for (var p in s) {
        if (s.hasOwnProperty(p)) {
            if (wl && indexOf(wl, p) === -1) continue

            // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
            if (p !== 'prototype') {
                r[p] = s[p]
            }
        }
    }
}


var toString = Object.prototype.toString

var isArray = Array.isArray || function (val) {
        return toString.call(val) === '[object Array]'
    }

var isFunction = function (val) {
    return toString.call(val) === '[object Function]'
}

var indexOf = Array.prototype.indexOf ?
    function (arr, item) {
        return arr.indexOf(item)
    } :
    function (arr, item) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                return i
            }
        }
        return -1
    }

u.Class = Class



function _findRegisteredClass(name, optReplace) {
    for (var i = 0; i < CompMgr.registeredControls.length; i++) {
        if (CompMgr.registeredControls[i].className === name) {
            if (typeof optReplace !== 'undefined') {
                CompMgr.registeredControls[i] = optReplace;
            }
            return CompMgr.registeredControls[i];
        }
    }
    return false;
}

function _getUpgradedListOfElement(element) {
    var dataUpgraded = element.getAttribute('data-upgraded');
    // Use `['']` as default value to conform the `,name,name...` style.
    return dataUpgraded === null ? [''] : dataUpgraded.split(',');
}

function _isElementUpgraded(element, jsClass) {
    var upgradedList = _getUpgradedListOfElement(element);
    return upgradedList.indexOf(jsClass) != -1;
}

function _upgradeElement(element, optJsClass) {
    if (!(typeof element === 'object' && element instanceof Element)) {
        throw new Error('Invalid argument provided to upgrade MDL element.');
    }
    var upgradedList = _getUpgradedListOfElement(element);
    var classesToUpgrade = [];
    if (!optJsClass) {
        var className = element.className;
        for(var i=0; i< CompMgr.registeredControls.length; i++){
            var component = CompMgr.registeredControls[i]
            if (className.indexOf(component.cssClass) > -1 && classesToUpgrade.indexOf(component) === -1 &&
                !_isElementUpgraded(element, component.className)) {
                classesToUpgrade.push(component);
            }
        }
    } else if (!_isElementUpgraded(element, optJsClass)) {
        classesToUpgrade.push(_findRegisteredClass(optJsClass));
    }

    // Upgrade the element for each classes.
    for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
        registeredClass = classesToUpgrade[i];
        if (registeredClass) {
            if (element[registeredClass.className]){
                continue;
            }
            // Mark element as upgraded.
            upgradedList.push(registeredClass.className);
            element.setAttribute('data-upgraded', upgradedList.join(','));
            var instance = new registeredClass.classConstructor(element);
            CompMgr.createdControls.push(instance);
            // Call any callbacks the user has registered with this component type.
            for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
                registeredClass.callbacks[j](element);
            }
            element[registeredClass.className] = instance;
        } else {
            throw new Error('Unable to find a registered component for the given class.');
        }

    }
}

function _upgradeDomInternal(optJsClass, optCssClass, ele) {
    if (typeof optJsClass === 'undefined' && typeof optCssClass === 'undefined') {
        for (var i = 0; i < CompMgr.registeredControls.length; i++) {
            _upgradeDomInternal(CompMgr.registeredControls[i].className, registeredControls[i].cssClass, ele);
        }
    } else {
        var jsClass = (optJsClass);
        if (!optCssClass) {
            var registeredClass = _findRegisteredClass(jsClass);
            if (registeredClass) {
                optCssClass = registeredClass.cssClass;
            }
        }
        var _ele = ele ? ele : document;
        var elements = _ele.querySelectorAll('.' + optCssClass);
        for (var n = 0; n < elements.length; n++) {
            _upgradeElement(elements[n], jsClass);
        }
    }
}

var CompMgr = {
    plugs: {},
    dataAdapters:{},
    /** 注册的控件*/
    registeredControls: [],
    createdControls: [],
    /**
     *
     * @param options  {el:'#content', model:{}}
     */
    apply: function (options) {
		if(options){
        var _el = options.el||document.body;
        var model = options.model;
		}
        if (typeof _el == 'string'){
            _el = document.body.querySelector(_el);
        }
        if (_el == null || typeof _el != 'object')
            _el = document.body;
        var comps =_el.querySelectorAll('[u-meta]');
        comps.forEach(function(element){
            if (element['comp']) return;
            var options = JSON.parse(element.getAttribute('u-meta'));
            if (options && options['type']) {
                //var comp = CompMgr._createComp({el:element,options:options,model:model});
                var comp = CompMgr.createDataAdapter({el:element,options:options,model:model});
                if (comp){
                    element['adpt'] = comp;
                    element['u-meta'] = comp;
                }
            }
        });
    },
    addPlug: function (config) {
        var plug = config['plug'],
            name = config['name'];
        this.plugs || (this.plugs = {});
        if (this.plugs[name]) {
            throw new Error('plug has exist:' + name);
        }
        plug.compType = name;
        this.plugs[name] = plug
    },
    addDataAdapter: function(config){
        var adapter = config['adapter'],
            name = config['name'];
            //dataType = config['dataType'] || ''
        //var key = dataType ? name + '.' + dataType : name;
        this.dataAdapters || (dataAdapters = {});
        if(this.dataAdapters[name]){
            throw new Error('dataAdapter has exist:' + name);
        }
        this.dataAdapters[name] = adapter;

    },
    getDataAdapter: function(name){
        if (!name) return;
        this.dataAdapters || (dataAdapters = {});
        //var key = dataType ? name + '.' + dataType : name;
        return this.dataAdapters[name];
    },
    createDataAdapter: function(options){
        var opt = options['options'];
        var type = opt['type'];
        var adpt = this.dataAdapters[type];
        if (!adpt) return null;
        var comp = new adpt(options);
        comp.type = type;
        return comp;
    },
    _createComp: function (options) {
        var opt = options['options'];
        var type = opt['type'];
        var plug = this.plugs[type];
        if (!plug) return null;
        var comp = new plug(options);
        comp.type = type;
        return comp;
    },
    /**
     * 注册UI控件
     */
    regComp: function(config){
        var newConfig = {
            classConstructor: config.comp,
            className: config.compAsString || config['compAsString'],
            cssClass: config.css || config['css'],
            callbacks: []
        };
        for(var i=0; i< this.registeredControls.length; i++){
            var item = this.registeredControls[i];
            //registeredControls.forEach(function(item) {
            if (item.cssClass === newConfig.cssClass) {
                throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
            }
            if (item.className === newConfig.className) {
                throw new Error('The provided className has already been registered');
            }
        };
        this.registeredControls.push(newConfig);
    },
    updateComp: function(ele){
        for (var n = 0; n < this.registeredControls.length; n++) {
            _upgradeDomInternal(this.registeredControls[n].className,null ,ele);
        }
    }
};

u.compMgr = CompMgr;

///**
// * 加载控件
// */
//
//if (document.readyState && document.readyState === 'complete'){
//    u.compMgr.updateComp();
//}else{
//    u.on(window, 'load', function() {
//
//        //扫描并生成控件
//        u.compMgr.updateComp();
//    });
//}

	



if (window.i18n) {
    var scriptPath = getCurrentJsPath(),
        _temp = scriptPath.substr(0, scriptPath.lastIndexOf('/')),
        __FOLDER__ = _temp.substr(0, _temp.lastIndexOf('/'))
    u.uuii18n = u.extend({}, window.i18n)
    u.uuii18n.init({
        postAsync: false,
        getAsync: false,
        fallbackLng: false,
        ns: {namespaces: ['uui-trans']},
        resGetPath: __FOLDER__ + '/locales/__lng__/__ns__.json'
    })
}

window.trans = u.trans = function (key, dftValue) {
    return  u.uuii18n ?  u.uuii18n.t('uui-trans:' + key) : dftValue
}


/* ========================================================================
 * UUI: rsautils.js v 1.0.0
 *
 * ========================================================================
 * Copyright 2015 yonyou, Inc.
 * Licensed under MIT ()
 * ======================================================================== */

/*
 * u.RSAUtils.encryptedString({exponent: 'xxxxx', modulus: 'xxxxx', text: 'xxxxx'})
 * u.RSAUtils.decryptedString({exponent: 'xxxxx', modulus: 'xxxxx', text: 'xxxxx'})
 */

if (typeof u.RSAUtils === 'undefined')
    u.RSAUtils = {};
var RSAUtils = u.RSAUtils;
var biRadixBase = 2;
var biRadixBits = 16;
var bitsPerDigit = biRadixBits;
var biRadix = 1 << 16; // = 2^16 = 65536
var biHalfRadix = biRadix >>> 1;
var biRadixSquared = biRadix * biRadix;
var maxDigitVal = biRadix - 1;
var maxInteger = 9999999999999998;

//maxDigits:
//Change this to accommodate your largest number size. Use setMaxDigits()
//to change it!
//
//In general, if you're working with numbers of size N bits, you'll need 2*N
//bits of storage. Each digit holds 16 bits. So, a 1024-bit key will need
//
//1024 * 2 / 16 = 128 digits of storage.
//
var maxDigits;
var ZERO_ARRAY;
var bigZero, bigOne;

var BigInt = u.BigInt = function (flag) {
    if (typeof flag == "boolean" && flag == true) {
        this.digits = null;
    } else {
        this.digits = ZERO_ARRAY.slice(0);
    }
    this.isNeg = false;
};

RSAUtils.setMaxDigits = function (value) {
    maxDigits = value;
    ZERO_ARRAY = new Array(maxDigits);
    for (var iza = 0; iza < ZERO_ARRAY.length; iza++) ZERO_ARRAY[iza] = 0;
    bigZero = new BigInt();
    bigOne = new BigInt();
    bigOne.digits[0] = 1;
};
RSAUtils.setMaxDigits(20);

//The maximum number of digits in base 10 you can convert to an
//integer without JavaScript throwing up on you.
var dpl10 = 15;

RSAUtils.biFromNumber = function (i) {
    var result = new BigInt();
    result.isNeg = i < 0;
    i = Math.abs(i);
    var j = 0;
    while (i > 0) {
        result.digits[j++] = i & maxDigitVal;
        i = Math.floor(i / biRadix);
    }
    return result;
};

//lr10 = 10 ^ dpl10
var lr10 = RSAUtils.biFromNumber(1000000000000000);

RSAUtils.biFromDecimal = function (s) {
    var isNeg = s.charAt(0) == '-';
    var i = isNeg ? 1 : 0;
    var result;
    // Skip leading zeros.
    while (i < s.length && s.charAt(i) == '0') ++i;
    if (i == s.length) {
        result = new BigInt();
    }
    else {
        var digitCount = s.length - i;
        var fgl = digitCount % dpl10;
        if (fgl == 0) fgl = dpl10;
        result = RSAUtils.biFromNumber(Number(s.substr(i, fgl)));
        i += fgl;
        while (i < s.length) {
            result = RSAUtils.biAdd(RSAUtils.biMultiply(result, lr10),
                RSAUtils.biFromNumber(Number(s.substr(i, dpl10))));
            i += dpl10;
        }
        result.isNeg = isNeg;
    }
    return result;
};

RSAUtils.biCopy = function (bi) {
    var result = new BigInt(true);
    result.digits = bi.digits.slice(0);
    result.isNeg = bi.isNeg;
    return result;
};

RSAUtils.reverseStr = function (s) {
    var result = "";
    for (var i = s.length - 1; i > -1; --i) {
        result += s.charAt(i);
    }
    return result;
};

var hexatrigesimalToChar = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'
];

RSAUtils.biToString = function (x, radix) { // 2 <= radix <= 36
    var b = new BigInt();
    b.digits[0] = radix;
    var qr = RSAUtils.biDivideModulo(x, b);
    var result = hexatrigesimalToChar[qr[1].digits[0]];
    while (RSAUtils.biCompare(qr[0], bigZero) == 1) {
        qr = RSAUtils.biDivideModulo(qr[0], b);
        digit = qr[1].digits[0];
        result += hexatrigesimalToChar[qr[1].digits[0]];
    }
    return (x.isNeg ? "-" : "") + RSAUtils.reverseStr(result);
};

RSAUtils.biToDecimal = function (x) {
    var b = new BigInt();
    b.digits[0] = 10;
    var qr = RSAUtils.biDivideModulo(x, b);
    var result = String(qr[1].digits[0]);
    while (RSAUtils.biCompare(qr[0], bigZero) == 1) {
        qr = RSAUtils.biDivideModulo(qr[0], b);
        result += String(qr[1].digits[0]);
    }
    return (x.isNeg ? "-" : "") + RSAUtils.reverseStr(result);
};

var hexToChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f'];

RSAUtils.digitToHex = function (n) {
    var mask = 0xf;
    var result = "";
    for (var i = 0; i < 4; ++i) {
        result += hexToChar[n & mask];
        n >>>= 4;
    }
    return RSAUtils.reverseStr(result);
};

RSAUtils.biToHex = function (x) {
    var result = "";
    var n = RSAUtils.biHighIndex(x);
    for (var i = RSAUtils.biHighIndex(x); i > -1; --i) {
        result += RSAUtils.digitToHex(x.digits[i]);
    }
    return result;
};

RSAUtils.charToHex = function (c) {
    var ZERO = 48;
    var NINE = ZERO + 9;
    var littleA = 97;
    var littleZ = littleA + 25;
    var bigA = 65;
    var bigZ = 65 + 25;
    var result;

    if (c >= ZERO && c <= NINE) {
        result = c - ZERO;
    } else if (c >= bigA && c <= bigZ) {
        result = 10 + c - bigA;
    } else if (c >= littleA && c <= littleZ) {
        result = 10 + c - littleA;
    } else {
        result = 0;
    }
    return result;
};

RSAUtils.hexToDigit = function (s) {
    var result = 0;
    var sl = Math.min(s.length, 4);
    for (var i = 0; i < sl; ++i) {
        result <<= 4;
        result |= RSAUtils.charToHex(s.charCodeAt(i));
    }
    return result;
};

RSAUtils.biFromHex = function (s) {
    var result = new BigInt();
    var sl = s.length;
    for (var i = sl, j = 0; i > 0; i -= 4, ++j) {
        result.digits[j] = RSAUtils.hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
    }
    return result;
};

RSAUtils.biFromString = function (s, radix) {
    var isNeg = s.charAt(0) == '-';
    var istop = isNeg ? 1 : 0;
    var result = new BigInt();
    var place = new BigInt();
    place.digits[0] = 1; // radix^0
    for (var i = s.length - 1; i >= istop; i--) {
        var c = s.charCodeAt(i);
        var digit = RSAUtils.charToHex(c);
        var biDigit = RSAUtils.biMultiplyDigit(place, digit);
        result = RSAUtils.biAdd(result, biDigit);
        place = RSAUtils.biMultiplyDigit(place, radix);
    }
    result.isNeg = isNeg;
    return result;
};

RSAUtils.biDump = function (b) {
    return (b.isNeg ? "-" : "") + b.digits.join(" ");
};

RSAUtils.biAdd = function (x, y) {
    var result;

    if (x.isNeg != y.isNeg) {
        y.isNeg = !y.isNeg;
        result = RSAUtils.biSubtract(x, y);
        y.isNeg = !y.isNeg;
    }
    else {
        result = new BigInt();
        var c = 0;
        var n;
        for (var i = 0; i < x.digits.length; ++i) {
            n = x.digits[i] + y.digits[i] + c;
            result.digits[i] = n % biRadix;
            c = Number(n >= biRadix);
        }
        result.isNeg = x.isNeg;
    }
    return result;
};

RSAUtils.biSubtract = function (x, y) {
    var result;
    if (x.isNeg != y.isNeg) {
        y.isNeg = !y.isNeg;
        result = RSAUtils.biAdd(x, y);
        y.isNeg = !y.isNeg;
    } else {
        result = new BigInt();
        var n, c;
        c = 0;
        for (var i = 0; i < x.digits.length; ++i) {
            n = x.digits[i] - y.digits[i] + c;
            result.digits[i] = n % biRadix;
            // Stupid non-conforming modulus operation.
            if (result.digits[i] < 0) result.digits[i] += biRadix;
            c = 0 - Number(n < 0);
        }
        // Fix up the negative sign, if any.
        if (c == -1) {
            c = 0;
            for (var i = 0; i < x.digits.length; ++i) {
                n = 0 - result.digits[i] + c;
                result.digits[i] = n % biRadix;
                // Stupid non-conforming modulus operation.
                if (result.digits[i] < 0) result.digits[i] += biRadix;
                c = 0 - Number(n < 0);
            }
            // Result is opposite sign of arguments.
            result.isNeg = !x.isNeg;
        } else {
            // Result is same sign.
            result.isNeg = x.isNeg;
        }
    }
    return result;
};

RSAUtils.biHighIndex = function (x) {
    var result = x.digits.length - 1;
    while (result > 0 && x.digits[result] == 0) --result;
    return result;
};

RSAUtils.biNumBits = function (x) {
    var n = RSAUtils.biHighIndex(x);
    var d = x.digits[n];
    var m = (n + 1) * bitsPerDigit;
    var result;
    for (result = m; result > m - bitsPerDigit; --result) {
        if ((d & 0x8000) != 0) break;
        d <<= 1;
    }
    return result;
};

RSAUtils.biMultiply = function (x, y) {
    var result = new BigInt();
    var c;
    var n = RSAUtils.biHighIndex(x);
    var t = RSAUtils.biHighIndex(y);
    var u, uv, k;

    for (var i = 0; i <= t; ++i) {
        c = 0;
        k = i;
        for (var j = 0; j <= n; ++j, ++k) {
            uv = result.digits[k] + x.digits[j] * y.digits[i] + c;
            result.digits[k] = uv & maxDigitVal;
            c = uv >>> biRadixBits;
            //c = Math.floor(uv / biRadix);
        }
        result.digits[i + n + 1] = c;
    }
    // Someone give me a logical xor, please.
    result.isNeg = x.isNeg != y.isNeg;
    return result;
};

RSAUtils.biMultiplyDigit = function (x, y) {
    var n, c, uv;

    var result = new BigInt();
    n = RSAUtils.biHighIndex(x);
    c = 0;
    for (var j = 0; j <= n; ++j) {
        uv = result.digits[j] + x.digits[j] * y + c;
        result.digits[j] = uv & maxDigitVal;
        c = uv >>> biRadixBits;
        //c = Math.floor(uv / biRadix);
    }
    result.digits[1 + n] = c;
    return result;
};

RSAUtils.arrayCopy = function (src, srcStart, dest, destStart, n) {
    var m = Math.min(srcStart + n, src.length);
    for (var i = srcStart, j = destStart; i < m; ++i, ++j) {
        dest[j] = src[i];
    }
};

var highBitMasks = [0x0000, 0x8000, 0xC000, 0xE000, 0xF000, 0xF800,
    0xFC00, 0xFE00, 0xFF00, 0xFF80, 0xFFC0, 0xFFE0,
    0xFFF0, 0xFFF8, 0xFFFC, 0xFFFE, 0xFFFF];

RSAUtils.biShiftLeft = function (x, n) {
    var digitCount = Math.floor(n / bitsPerDigit);
    var result = new BigInt();
    RSAUtils.arrayCopy(x.digits, 0, result.digits, digitCount,
        result.digits.length - digitCount);
    var bits = n % bitsPerDigit;
    var rightBits = bitsPerDigit - bits;
    for (var i = result.digits.length - 1, i1 = i - 1; i > 0; --i, --i1) {
        result.digits[i] = ((result.digits[i] << bits) & maxDigitVal) |
            ((result.digits[i1] & highBitMasks[bits]) >>>
            (rightBits));
    }
    result.digits[0] = ((result.digits[i] << bits) & maxDigitVal);
    result.isNeg = x.isNeg;
    return result;
};

var lowBitMasks = [0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
    0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
    0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF];

RSAUtils.biShiftRight = function (x, n) {
    var digitCount = Math.floor(n / bitsPerDigit);
    var result = new BigInt();
    RSAUtils.arrayCopy(x.digits, digitCount, result.digits, 0,
        x.digits.length - digitCount);
    var bits = n % bitsPerDigit;
    var leftBits = bitsPerDigit - bits;
    for (var i = 0, i1 = i + 1; i < result.digits.length - 1; ++i, ++i1) {
        result.digits[i] = (result.digits[i] >>> bits) |
            ((result.digits[i1] & lowBitMasks[bits]) << leftBits);
    }
    result.digits[result.digits.length - 1] >>>= bits;
    result.isNeg = x.isNeg;
    return result;
};

RSAUtils.biMultiplyByRadixPower = function (x, n) {
    var result = new BigInt();
    RSAUtils.arrayCopy(x.digits, 0, result.digits, n, result.digits.length - n);
    return result;
};

RSAUtils.biDivideByRadixPower = function (x, n) {
    var result = new BigInt();
    RSAUtils.arrayCopy(x.digits, n, result.digits, 0, result.digits.length - n);
    return result;
};

RSAUtils.biModuloByRadixPower = function (x, n) {
    var result = new BigInt();
    RSAUtils.arrayCopy(x.digits, 0, result.digits, 0, n);
    return result;
};

RSAUtils.biCompare = function (x, y) {
    if (x.isNeg != y.isNeg) {
        return 1 - 2 * Number(x.isNeg);
    }
    for (var i = x.digits.length - 1; i >= 0; --i) {
        if (x.digits[i] != y.digits[i]) {
            if (x.isNeg) {
                return 1 - 2 * Number(x.digits[i] > y.digits[i]);
            } else {
                return 1 - 2 * Number(x.digits[i] < y.digits[i]);
            }
        }
    }
    return 0;
};

RSAUtils.biDivideModulo = function (x, y) {
    var nb = RSAUtils.biNumBits(x);
    var tb = RSAUtils.biNumBits(y);
    var origYIsNeg = y.isNeg;
    var q, r;
    if (nb < tb) {
        // |x| < |y|
        if (x.isNeg) {
            q = RSAUtils.biCopy(bigOne);
            q.isNeg = !y.isNeg;
            x.isNeg = false;
            y.isNeg = false;
            r = biSubtract(y, x);
            // Restore signs, 'cause they're references.
            x.isNeg = true;
            y.isNeg = origYIsNeg;
        } else {
            q = new BigInt();
            r = RSAUtils.biCopy(x);
        }
        return [q, r];
    }

    q = new BigInt();
    r = x;

    // Normalize Y.
    var t = Math.ceil(tb / bitsPerDigit) - 1;
    var lambda = 0;
    while (y.digits[t] < biHalfRadix) {
        y = RSAUtils.biShiftLeft(y, 1);
        ++lambda;
        ++tb;
        t = Math.ceil(tb / bitsPerDigit) - 1;
    }
    // Shift r over to keep the quotient constant. We'll shift the
    // remainder back at the end.
    r = RSAUtils.biShiftLeft(r, lambda);
    nb += lambda; // Update the bit count for x.
    var n = Math.ceil(nb / bitsPerDigit) - 1;

    var b = RSAUtils.biMultiplyByRadixPower(y, n - t);
    while (RSAUtils.biCompare(r, b) != -1) {
        ++q.digits[n - t];
        r = RSAUtils.biSubtract(r, b);
    }
    for (var i = n; i > t; --i) {
        var ri = (i >= r.digits.length) ? 0 : r.digits[i];
        var ri1 = (i - 1 >= r.digits.length) ? 0 : r.digits[i - 1];
        var ri2 = (i - 2 >= r.digits.length) ? 0 : r.digits[i - 2];
        var yt = (t >= y.digits.length) ? 0 : y.digits[t];
        var yt1 = (t - 1 >= y.digits.length) ? 0 : y.digits[t - 1];
        if (ri == yt) {
            q.digits[i - t - 1] = maxDigitVal;
        } else {
            q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
        }

        var c1 = q.digits[i - t - 1] * ((yt * biRadix) + yt1);
        var c2 = (ri * biRadixSquared) + ((ri1 * biRadix) + ri2);
        while (c1 > c2) {
            --q.digits[i - t - 1];
            c1 = q.digits[i - t - 1] * ((yt * biRadix) | yt1);
            c2 = (ri * biRadix * biRadix) + ((ri1 * biRadix) + ri2);
        }

        b = RSAUtils.biMultiplyByRadixPower(y, i - t - 1);
        r = RSAUtils.biSubtract(r, RSAUtils.biMultiplyDigit(b, q.digits[i - t - 1]));
        if (r.isNeg) {
            r = RSAUtils.biAdd(r, b);
            --q.digits[i - t - 1];
        }
    }
    r = RSAUtils.biShiftRight(r, lambda);
    // Fiddle with the signs and stuff to make sure that 0 <= r < y.
    q.isNeg = x.isNeg != origYIsNeg;
    if (x.isNeg) {
        if (origYIsNeg) {
            q = RSAUtils.biAdd(q, bigOne);
        } else {
            q = RSAUtils.biSubtract(q, bigOne);
        }
        y = RSAUtils.biShiftRight(y, lambda);
        r = RSAUtils.biSubtract(y, r);
    }
    // Check for the unbelievably stupid degenerate case of r == -0.
    if (r.digits[0] == 0 && RSAUtils.biHighIndex(r) == 0) r.isNeg = false;

    return [q, r];
};

RSAUtils.biDivide = function (x, y) {
    return RSAUtils.biDivideModulo(x, y)[0];
};

RSAUtils.biModulo = function (x, y) {
    return RSAUtils.biDivideModulo(x, y)[1];
};

RSAUtils.biMultiplyMod = function (x, y, m) {
    return RSAUtils.biModulo(RSAUtils.biMultiply(x, y), m);
};

RSAUtils.biPow = function (x, y) {
    var result = bigOne;
    var a = x;
    while (true) {
        if ((y & 1) != 0) result = RSAUtils.biMultiply(result, a);
        y >>= 1;
        if (y == 0) break;
        a = RSAUtils.biMultiply(a, a);
    }
    return result;
};

RSAUtils.biPowMod = function (x, y, m) {
    var result = bigOne;
    var a = x;
    var k = y;
    while (true) {
        if ((k.digits[0] & 1) != 0) result = RSAUtils.biMultiplyMod(result, a, m);
        k = RSAUtils.biShiftRight(k, 1);
        if (k.digits[0] == 0 && RSAUtils.biHighIndex(k) == 0) break;
        a = RSAUtils.biMultiplyMod(a, a, m);
    }
    return result;
};


u.BarrettMu = function (m) {
    this.modulus = RSAUtils.biCopy(m);
    this.k = RSAUtils.biHighIndex(this.modulus) + 1;
    var b2k = new BigInt();
    b2k.digits[2 * this.k] = 1; // b2k = b^(2k)
    this.mu = RSAUtils.biDivide(b2k, this.modulus);
    this.bkplus1 = new BigInt();
    this.bkplus1.digits[this.k + 1] = 1; // bkplus1 = b^(k+1)
    this.modulo = BarrettMu_modulo;
    this.multiplyMod = BarrettMu_multiplyMod;
    this.powMod = BarrettMu_powMod;
};

function BarrettMu_modulo(x) {
    var $dmath = RSAUtils;
    var q1 = $dmath.biDivideByRadixPower(x, this.k - 1);
    var q2 = $dmath.biMultiply(q1, this.mu);
    var q3 = $dmath.biDivideByRadixPower(q2, this.k + 1);
    var r1 = $dmath.biModuloByRadixPower(x, this.k + 1);
    var r2term = $dmath.biMultiply(q3, this.modulus);
    var r2 = $dmath.biModuloByRadixPower(r2term, this.k + 1);
    var r = $dmath.biSubtract(r1, r2);
    if (r.isNeg) {
        r = $dmath.biAdd(r, this.bkplus1);
    }
    var rgtem = $dmath.biCompare(r, this.modulus) >= 0;
    while (rgtem) {
        r = $dmath.biSubtract(r, this.modulus);
        rgtem = $dmath.biCompare(r, this.modulus) >= 0;
    }
    return r;
}

function BarrettMu_multiplyMod(x, y) {
    /*
     x = this.modulo(x);
     y = this.modulo(y);
     */
    var xy = RSAUtils.biMultiply(x, y);
    return this.modulo(xy);
}

function BarrettMu_powMod(x, y) {
    var result = new BigInt();
    result.digits[0] = 1;
    var a = x;
    var k = y;
    while (true) {
        if ((k.digits[0] & 1) != 0) result = this.multiplyMod(result, a);
        k = RSAUtils.biShiftRight(k, 1);
        if (k.digits[0] == 0 && RSAUtils.biHighIndex(k) == 0) break;
        a = this.multiplyMod(a, a);
    }
    return result;
}

var RSAKeyPair = function (encryptionExponent, decryptionExponent, modulus) {
    var $dmath = RSAUtils;
    this.e = $dmath.biFromHex(encryptionExponent);
    this.d = $dmath.biFromHex(decryptionExponent);
    this.m = $dmath.biFromHex(modulus);
    // We can do two bytes per digit, so
    // chunkSize = 2 * (number of digits in modulus - 1).
    // Since biHighIndex returns the high index, not the number of digits, 1 has
    // already been subtracted.
    this.chunkSize = 2 * $dmath.biHighIndex(this.m);
    this.radix = 16;
    this.barrett = new u.BarrettMu(this.m);
};

RSAUtils.getKeyPair = function (encryptionExponent, decryptionExponent, modulus) {
    return new RSAKeyPair(encryptionExponent, decryptionExponent, modulus);
};

if (typeof u.twoDigit === 'undefined') {
    u.twoDigit = function (n) {
        return (n < 10 ? "0" : "") + String(n);
    };
}

// Altered by Rob Saunders (rob@robsaunders.net). New routine pads the
// string after it has been converted to an array. This fixes an
// incompatibility with Flash MX's ActionScript.
RSAUtils._encryptedString = function (key, s) {
    var a = [];
    var sl = s.length;
    var i = 0;
    while (i < sl) {
        a[i] = s.charCodeAt(i);
        i++;
    }

    while (a.length % key.chunkSize != 0) {
        a[i++] = 0;
    }

    var al = a.length;
    var result = "";
    var j, k, block;
    for (i = 0; i < al; i += key.chunkSize) {
        block = new BigInt();
        j = 0;
        for (k = i; k < i + key.chunkSize; ++j, k++) {
            block.digits[j] = a[k];
            block.digits[j] += a[k] << 8;
        }
        var crypt = key.barrett.powMod(block, key.e);
        var text = key.radix == 16 ? RSAUtils.biToHex(crypt) : RSAUtils.biToString(crypt, key.radix);
        result += text + " ";
    }
    return result.substring(0, result.length - 1); // Remove last space.
};

RSAUtils._decryptedString = function (key, s) {
    var blocks = s.split(" ");
    var result = "";
    var i, j, block;
    for (i = 0; i < blocks.length; ++i) {
        var bi;
        if (key.radix == 16) {
            bi = RSAUtils.biFromHex(blocks[i]);
        }
        else {
            bi = RSAUtils.biFromString(blocks[i], key.radix);
        }
        block = key.barrett.powMod(bi, key.d);
        for (j = 0; j <= RSAUtils.biHighIndex(block); ++j) {
            result += String.fromCharCode(block.digits[j] & 255,
                block.digits[j] >> 8);
        }
    }
    // Remove trailing null, if any.
    if (result.charCodeAt(result.length - 1) == 0) {
        result = result.substring(0, result.length - 1);
    }
    return result;
};

RSAUtils.setMaxDigits(130);

RSAUtils.encryptedString = function (options) {
    var text = options.text;
    if (options.exponent && options.modulus) {
        var key = RSAUtils.getKeyPair(options.exponent, '', options.modulus);
        text = RSAUtils._encryptedString(key, options.text);
    }
    return text;
};

RSAUtils.decryptedString = function (options) {
    var text = options.text;
    if (options.exponent && options.modulus) {
        var key = RSAUtils.getKeyPair('', options.exponent, options.modulus);
        text = RSAUtils._decryptedString(key, options.text);
    }
    return text;
};
	

/**
 * 抽象格式化类
 */
function AbstractMasker() {};

AbstractMasker.prototype.format = function(obj) {
	if (obj == null)
		return null;

	var fObj = this.formatArgument(obj);
	return this.innerFormat(fObj);
};

/**
 * 统一被格式化对象结构
 *
 * @param obj
 * @return
 */
AbstractMasker.prototype.formatArgument = function(obj) {

};

/**
 * 格式化
 *
 * @param obj
 * @return
 */
AbstractMasker.prototype.innerFormat = function(obj) {

};

/**
 * 拆分算法格式化虚基类
 */
AbstractSplitMasker.prototype = new AbstractMasker;

function AbstractSplitMasker() {};
AbstractSplitMasker.prototype.elements = new Array;
AbstractSplitMasker.prototype.format = function(obj) {
	if (obj == null)
		return null;

	var fObj = this.formatArgument(obj);
	return this.innerFormat(fObj);
};

/**
 * 统一被格式化对象结构
 *
 * @param obj
 * @return
 */
AbstractSplitMasker.prototype.formatArgument = function(obj) {
	return obj;
};

/**
 * 格式化
 *
 * @param obj
 * @return
 */
AbstractSplitMasker.prototype.innerFormat = function(obj) {
	if (obj == null || obj == "")
		return new FormatResult(obj);
	this.doSplit();
	var result = "";
	//dingrf 去掉concat合并数组的方式，换用多维数组来实现 提高效率
	result = this.getElementsValue(this.elements, obj);
	//	for(var i = 0; i < this.elements.length ; i++){
	//		if(i != undefined){
	//			var element = this.elements[i];
	//			var elementValue = element.getValue(obj);
	//			if(elementValue != undefined)
	//				result = result + elementValue;
	//		}
	//	}
	return new FormatResult(result);
};

/**
 * 合并多维数组中的elementValue
 * @param {} element
 * @param {} obj
 * @return {}
 */
AbstractSplitMasker.prototype.getElementsValue = function(element, obj) {
	var result = "";
	if (element instanceof Array) {
		for (var i = 0; i < element.length; i++) {
			result = result + this.getElementsValue(element[i], obj);
		}
	} else {
		if (element.getValue)
			result = element.getValue(obj);
	}
	return result;
};

AbstractSplitMasker.prototype.getExpress = function() {

};

AbstractSplitMasker.prototype.doSplit = function() {
	var express = this.getExpress();
	if (this.elements == null || this.elements.length == 0)
		this.elements = this.doQuotation(express, this.getSeperators(), this.getReplaceds(), 0);
};


/**
 * 处理引号
 *
 * @param express
 * @param seperators
 * @param replaced
 * @param curSeperator
 * @param obj
 * @param result
 */
AbstractSplitMasker.prototype.doQuotation = function(express, seperators, replaced, curSeperator) {
	if (express.length == 0)
		return null;
	var elements = new Array();
	var pattern = new RegExp('".*?"', "g");
	var fromIndex = 0;
	var result;
	do {
		result = pattern.exec(express);
		if (result != null) {
			var i = result.index;
			var j = pattern.lastIndex;
			if (i != j) {
				if (fromIndex < i) {
					var childElements = this.doSeperator(express.substring(fromIndex, i), seperators, replaced, curSeperator);
					if (childElements != null && childElements.length > 0) {
						//						elements = elements.concat(childElements);
						elements.push(childElements);
					}
				}
			}
			elements.push(new StringElement(express.substring(i + 1, j - 1)));
			fromIndex = j;
		}
	}
	while (result != null);

	if (fromIndex < express.length) {
		var childElements = this.doSeperator(express.substring(fromIndex, express.length), seperators, replaced, curSeperator);
		if (childElements != null && childElements.length > 0)
		//			elements = elements.concat(childElements);
			elements.push(childElements);
	}
	return elements;
};

/**
 * 处理其它分隔符
 *
 * @param express
 * @param seperators
 * @param replaced
 * @param curSeperator
 * @param obj
 * @param result
 */
AbstractSplitMasker.prototype.doSeperator = function(express, seperators, replaced, curSeperator) {
	if (curSeperator >= seperators.length) {
		var elements = new Array;
		elements.push(this.getVarElement(express));
		return elements;
	}

	if (express.length == 0)
		return null;
	var fromIndex = 0;
	var elements = new Array();
	var pattern = new RegExp(seperators[curSeperator], "g");
	var result;
	do {
		result = pattern.exec(express);
		if (result != null) {
			var i = result.index;
			var j = pattern.lastIndex;
			if (i != j) {
				if (fromIndex < i) {
					var childElements = this.doSeperator(express.substring(fromIndex, i), seperators, replaced, curSeperator + 1);
					if (childElements != null && childElements.length > 0)
					//						elements = elements.concat(childElements);
						elements.push(childElements);
				}

				if (replaced[curSeperator] != null) {
					elements.push(new StringElement(replaced[curSeperator]));
				} else {
					elements.push(new StringElement(express.substring(i, j)));
				}
				fromIndex = j;
			}
		}
	}
	while (result != null);

	if (fromIndex < express.length) {
		var childElements = this.doSeperator(express.substring(fromIndex, express.length), seperators, replaced, curSeperator + 1);
		if (childElements != null && childElements.length > 0)
		//			elements = elements.concat(childElements);
			elements.push(childElements);
	}
	return elements;
};


/**
 * 地址格式
 */
AddressMasker.prototype = new AbstractSplitMasker;

function AddressMasker(formatMeta) {
	this.update(formatMeta);
};

AddressMasker.prototype.update = function(formatMeta) {
	this.formatMeta = u.extend({}, AddressMasker.DefaultFormatMeta, formatMeta)
}

AddressMasker.prototype.getExpress = function() {
	return this.formatMeta.express;
};

AddressMasker.prototype.getReplaceds = function() {
	return [this.formatMeta.separator];
};

AddressMasker.prototype.getSeperators = function() {
	return ["(\\s)+?"];
};

AddressMasker.prototype.getVarElement = function(express) {
	var ex = {};

	if (express == ("C"))
		ex.getValue = function(obj) {
			return obj.country;
		};


	if (express == ("S"))
		ex.getValue = function(obj) {
			return obj.state;
		};


	if (express == ("T"))
		ex.getValue = function(obj) {
			return obj.city;
		};


	if (express == ("D"))
		ex.getValue = function(obj) {
			return obj.section;
		};


	if (express == ("R"))
		ex.getValue = function(obj) {
			return obj.road;
		};

	if (express == ("P"))
		ex.getValue = function(obj) {
			return obj.postcode;
		};

	if (typeof(ex.getValue) == undefined)
		return new StringElement(express);
	else
		return ex;
};

AddressMasker.prototype.formatArgument = function(obj) {
	return obj;
};

/**
 * <b> 数字格式化  </b>
 *
 * <p> 格式化数字
 *
 * </p>
 *
 * Create at 2009-3-20 上午08:50:32
 *
 * @author bq
 * @since V6.0
 */
NumberMasker.prototype = new AbstractMasker;
NumberMasker.prototype.formatMeta = null;

/**
 *构造方法
 */
function NumberMasker(formatMeta) {
	this.update(formatMeta);
};

NumberMasker.prototype.update = function(formatMeta) {
	this.formatMeta = u.extend({}, NumberMasker.DefaultFormatMeta, formatMeta)
}

/**
 *格式化对象
 */
NumberMasker.prototype.innerFormat = function(obj) {
	var dValue, express, seperatorIndex, strValue;
	dValue = obj.value;
	if (dValue > 0) {
		express = this.formatMeta.positiveFormat;
		strValue = dValue + '';
	} else if (dValue < 0) {
		express = this.formatMeta.negativeFormat;
		strValue = (dValue + '').substr(1, (dValue + '').length - 1);
	} else {
		express = this.formatMeta.positiveFormat;
		strValue = dValue + '';
	}
	seperatorIndex = strValue.indexOf('.');
	strValue = this.setTheSeperator(strValue, seperatorIndex);
	strValue = this.setTheMark(strValue, seperatorIndex);
	var color = null;
	if (dValue < 0 && this.formatMeta.isNegRed) {
		color = "FF0000";
	}
	return new FormatResult(express.replaceAll('n', strValue), color);

};
/**
 *设置标记
 */
NumberMasker.prototype.setTheMark = function(str, seperatorIndex) {
	var endIndex, first, index;
	if (!this.formatMeta.isMarkEnable)
		return str;
	if (seperatorIndex <= 0)
		seperatorIndex = str.length;
	first = str.charCodeAt(0);
	endIndex = 0;
	if (first == 45)
		endIndex = 1;
	index = seperatorIndex - 3;
	while (index > endIndex) {
		str = str.substr(0, index - 0) + this.formatMeta.markSymbol + str.substr(index, str.length - index);
		index = index - 3;
	}
	return str;
};
NumberMasker.prototype.setTheSeperator = function(str, seperatorIndex) {
	var ca;
	if (seperatorIndex > 0) {
		ca = NumberMasker.toCharArray(str);
		//ca[seperatorIndex] = NumberMasker.toCharArray(this.formatMeta.pointSymbol)[0];
		ca[seperatorIndex] = this.formatMeta.pointSymbol;
		str = ca.join('');
	}
	return str;
};
/**
 * 将字符串转换成char数组
 * @param {} str
 * @return {}
 */
NumberMasker.toCharArray = function(str) {
	var str = str.split("");
	var charArray = new Array();
	for (var i = 0; i < str.length; i++) {
		charArray.push(str[i]);
	}
	return charArray;
};


/**
 *默认构造方法
 */
NumberMasker.prototype.formatArgument = function(obj) {
	var numberObj = {};
	numberObj.value = obj;
	return numberObj;
};

/**
 * 货币格式
 */
CurrencyMasker.prototype = new NumberMasker;
CurrencyMasker.prototype.formatMeta = null;

function CurrencyMasker(formatMeta) {
	this.update(formatMeta);
};

CurrencyMasker.prototype.update = function(formatMeta) {
	this.formatMeta = u.extend({}, CurrencyMasker.DefaultFormatMeta, formatMeta)
}

/**
 * 重载格式方法
 * @param {} obj
 * @return {}
 */
CurrencyMasker.prototype.innerFormat = function(obj) {
	if(!obj.value) {
		return {value: ""};
	}
	var fo = (new NumberMasker(this.formatMeta)).innerFormat(obj);
	fo.value = this.formatMeta.curSymbol  +  fo.value; //fo.value.replace("$", this.formatMeta.curSymbol);
	return fo;
};

DateTimeMasker.prototype = new AbstractSplitMasker;

DateTimeMasker.prototype.formatMeta = null;

function DateTimeMasker(formatMeta) {
	this.update(formatMeta);
};

DateTimeMasker.prototype.update = function(formatMeta) {
	this.formatMeta = u.extend({}, DateTimeMasker.DefaultFormatMeta, formatMeta)
}

/**
 * 英文短日期
 */
DateTimeMasker.enShortMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/**
 * 英文长日期
 */
DateTimeMasker.enLongMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


DateTimeMasker.prototype.doOne = function(express) {
	if (express.length == 0)
		return "";
	var obj = new Object;
	if (express.toLowerCase() == "yyyy") {
		obj.getValue = function(o) {
			return DateTimeMasker.getyyyy(o);
		};
	}
	if (express.toLowerCase() == "yy") {
		obj.getValue = function(o) {
			return DateTimeMasker.getyy(o);
		};
	}
	if (express == "MMMM") {
		obj.getValue = function(o) {
			return DateTimeMasker.getMMMM(o);
		};
	}

	if (express == "MMM") {
		obj.getValue = function(o) {
			return DateTimeMasker.getMMM(o);
		};
	}

	if (express == "MM") {
		obj.getValue = function(o) {
			return DateTimeMasker.getMM(o);
		};
	}

	if (express == "M") {
		obj.getValue = function(o) {
			return DateTimeMasker.getM(o);
		};
	}

	if (express.toLowerCase() == "dd") {
		obj.getValue = function(o) {
			return DateTimeMasker.getdd(o);
		};
	}

	if (express.toLowerCase() == "d") {
		obj.getValue = function(o) {
			return DateTimeMasker.getd(o);
		};
	}

	if (express == "hh") {
		obj.getValue = function(o) {
			return DateTimeMasker.gethh(o);
		};
	}

	if (express == "h") {
		obj.getValue = function(o) {
			return DateTimeMasker.geth(o);
		};
	}

	if (express == "mm") {
		obj.getValue = function(o) {
			return DateTimeMasker.getmm(o);
		};
	}

	if (express == "m") {
		obj.getValue = function(o) {
			return DateTimeMasker.getm(o);
		};
	}

	if (express == "ss") {
		obj.getValue = function(o) {
			return DateTimeMasker.getss(o);
		};
	}

	if (express == "s") {
		obj.getValue = function(o) {
			return DateTimeMasker.gets(o);
		};
	}

	if (express == "HH") {
		obj.getValue = function(o) {
			return DateTimeMasker.getHH(o);
		};
	}

	if (express == "H") {
		obj.getValue = function(o) {
			return DateTimeMasker.getH(o);
		};
	}
	if (express == "t") {
		obj.getValue = function(o) {
			return DateTimeMasker.gett(o);
		};
	}

	if (express == "st") {
		obj.getValue = function(o) {
			return DateTimeMasker.gets(o) + DateTimeMasker.gett(o);
		};
	}

	if (express == "mt") {
		obj.getValue = function(o) {
			return DateTimeMasker.getm(o) + DateTimeMasker.gett(o);
		};
	}

	if (express == "yyyyMMdd") {
		obj.getValue = function(o) {
			return DateTimeMasker.getyyyy(o) + DateTimeMasker.getMM(o) + DateTimeMasker.getdd(o);
		};
	}

	if (typeof(obj.getValue) == "undefined") {
		obj.getValue = function(o) {
			return DateTimeMasker.getyyyy(o) + "-" + DateTimeMasker.getMM(o) + "-" + DateTimeMasker.getdd(o);
		};
	}

	return obj;
};

DateTimeMasker.getyyyy = function(date) {
	return date.getFullYear();
};

DateTimeMasker.getyy = function(date) {
	return ("" + date.getFullYear()).substring(2);
};

DateTimeMasker.getM = function(date) {
	return "" + (date.getMonth() + 1);
};

DateTimeMasker.getMM = function(date) {
	var month = date.getMonth() + 1;
	if (month < 10)
		return "0" + month;
	return month;
};

DateTimeMasker.getMMM = function(date) {
	return this.enShortMonth[date.getMonth()];
};

DateTimeMasker.getMMMM = function(date) {
	return this.enLongMonth[date.getMonth()];
};

DateTimeMasker.getdd = function(date) {
	var day = date.getDate();
	if (day < 10)
		return "0" + day;
	return date.getDate() + "";
};

DateTimeMasker.getd = function(date) {
	return date.getDate() + "";
};

DateTimeMasker.gethh = function(date) {
	var hh = date.getHours();
	if (hh < 10)
		return "0" + hh;

	return (date.getHours()) + "";
};

DateTimeMasker.geth = function(date) {
	return (date.getHours()) + "";
};

DateTimeMasker.getHH = function(date) {
	var HH = date.getHours();

	if (HH >= 12)
		HH = HH - 12;

	if (HH < 10)
		return "0" + HH;
	return (HH) + "";
};

DateTimeMasker.getH = function(date) {
	var HH = date.getHours();

	if (HH >= 12)
		HH = HH - 12;

	return (HH) + "";
};

DateTimeMasker.getmm = function(date) {
	var mm = date.getMinutes();
	if (mm < 10)
		return "0" + mm;

	return (date.getMinutes()) + "";
};

DateTimeMasker.getm = function(date) {
	return "" + (date.getMinutes());
};

DateTimeMasker.getss = function(date) {
	var ss = date.getSeconds();
	if (ss < 10)
		return "0" + ss;

	return (ss) + "";
};

DateTimeMasker.gets = function(date) {
	return (date.getSeconds()) + "";
};

DateTimeMasker.gett = function(date) {
	var hh = date.getHours();
	if (hh <= 12)
		return "AM";
	else
		return "PM";
};

DateTimeMasker.prototype.getExpress = function() {
	return this.formatMeta.format;
};

DateTimeMasker.prototype.getReplaceds = function() {
	return [" ", this.formatMeta.speratorSymbol, ":"];
};

DateTimeMasker.prototype.getSeperators = function() {
	return ["(\\s)+?", "-", ":"];
};

DateTimeMasker.prototype.getVarElement = function(express) {
	return this.doOne(express);
};

DateTimeMasker.prototype.formatArgument = function(obj) {
	if (obj == 0) return "";
	if (obj == null || obj == "")
		return obj;
	if ((typeof obj) == "string") {
		var dateArr = obj.split(" ");
		var date = new Date();
		if (dateArr.length > 0) {
			if (dateArr[0].indexOf("-") > 0){
				var arr0 = dateArr[0].split("-");
				//先把日期设置为1日，解决bug:当前日期为2011-08-31时，选择日期为2011-09-X，会把日期格式化为2011-10-X
				date.setDate(1);
				date.setFullYear(parseInt(arr0[0], 10));
				date.setMonth(parseInt(arr0[1], 10) - 1);
				date.setDate(parseInt(arr0[2], 10));
				if (dateArr.length == 2 && dateArr[1] != undefined) {
					var arr1 = dateArr[1].split(":");
					date.setHours(parseInt(arr1[0], 10));
					date.setMinutes(parseInt(arr1[1], 10));
					date.setSeconds(parseInt(arr1[2], 10));
					if (arr1.length > 3)
						date.setMilliseconds(parseInt(arr1[3], 10));
				}
			}else{
				var arr1 = dateArr[0].split(":");
				date.setHours(parseInt(arr1[0], 10));
				date.setMinutes(parseInt(arr1[1], 10));
				date.setSeconds(parseInt(arr1[2], 10));
				if (arr1.length > 3)
					date.setMilliseconds(parseInt(arr1[3], 10));
			}


		}
		return date;
	}
	return (obj);
};

/**
 * 日期格式化
 */
DateMasker.prototype = new DateTimeMasker;

DateMasker.DefaultFormatMeta = u.extend({}, DateTimeMasker.DefaultFormatMeta, {
	format: "yyyy-MM-dd"
})

function DateMasker(formatMeta) {
	this.update(formatMeta);
};

DateMasker.prototype.update = function(formatMeta) {
	this.formatMeta = u.extend({}, DateMasker.DefaultFormatMeta, formatMeta)
}


/**
 * 时间格式化
 */
TimeMasker.prototype = new DateTimeMasker;

TimeMasker.DefaultFormatMeta = u.extend({}, DateTimeMasker.DefaultFormatMeta, {
	format: "hh:mm:ss"
})

function TimeMasker(formatMeta) {
	this.update(formatMeta);
};

TimeMasker.prototype.update = function(formatMeta) {
	this.formatMeta = u.extend({}, TimeMasker.DefaultFormatMeta, formatMeta)
}

PercentMasker.prototype = new AbstractMasker;

function PercentMasker() {

};


PercentMasker.prototype.formatArgument = function(obj) {
	return obj;
};

PercentMasker.prototype.innerFormat = function(obj) {
	var val = "";
	if (obj != "") {
		// 获取obj保留几位小数位,obj小数位-2为显示小数位
		var objStr = String(obj);
		var objPrecision = objStr.length - objStr.indexOf(".") - 1;
		var showPrecision = objPrecision - 2;
		if (showPrecision < 0) {
			showPrecision = 0;
		}
		val = parseFloat(obj) * 100;
		val = (val * Math.pow(10, showPrecision) / Math.pow(10, showPrecision)).toFixed(showPrecision);
		val = val + "%";
	}
	return {
		value: val
	};
};


/**
 * 将结果输出成HTML代码
 * @param {} result
 * @return {String}
 */
function toColorfulString(result) {
	var color;
	if (!result) {
		return '';
	}
	if (result.color == null) {
		return result.value;
	}
	color = result.color;
	return '<font color="' + color + '">' + result.value + '<\/font>';
};

/**
 * 格式解析后形成的单个格式单元
 * 适用于基于拆分算法的AbstractSplitFormat，表示拆分后的变量单元
 */
StringElement.prototype = new Object();

function StringElement(value) {
	this.value = value;
};
StringElement.prototype.value = "";

StringElement.prototype.getValue = function(obj) {
	return this.value;
};
/**
 *格式结果
 */
FormatResult.prototype = new Object;
/**
 *默认构造方法
 */
function FormatResult(value, color) {
	this.value = value;
	this.color = color;
};

NumberMasker.DefaultFormatMeta = {
	isNegRed: true,
	isMarkEnable: true,
	markSymbol: ",",
	pointSymbol: ".",
	positiveFormat: "n",
	negativeFormat: "-n"
}

CurrencyMasker.DefaultFormatMeta = u.extend({}, NumberMasker.DefaultFormatMeta, {
	//curSymbol: "",
	positiveFormat: "n",
	negativeFormat: "-n"
})


AddressMasker.defaultFormatMeta = {
	express: "C S T R P",
	separator: " "
};

DateTimeMasker.DefaultFormatMeta = {
	format: "yyyy-MM-dd hh:mm:ss",
	speratorSymbol: "-"
}

u.AddressMasker = AddressMasker;
u.NumberMasker = NumberMasker;
u.CurrencyMasker = CurrencyMasker;
u.DateTimeMasker =DateTimeMasker;
u.DateMasker = DateMasker;
u.TimeMasker = TimeMasker;
u.PercentMasker = PercentMasker;
/**
 * 数据格式化工具
 */

function NumberFormater(precision) {
    this.precision = precision;
};

NumberFormater.prototype.update = function (precision) {
    this.precision = precision;
}

NumberFormater.prototype.format = function (value) {
    if (!u.isNumber(value)) return "";

    // 以0开头的数字将其前面的0去掉
    while ((value + "").charAt(0) == "0" && value.length > 1) {
        value = value.substring(1);
    }
    var result = value;
    if (u.isNumber(this.precision)) {
        if (window.BigNumber) {
            // 已经引入BigNumber
            result = (new BigNumber(value)).toFixed(this.precision)
        } else {
            var digit = parseFloat(value);
            // 解决toFixed四舍五入问题，如1.345
            result = (Math.round(digit * Math.pow(10, this.precision)) / Math.pow(10, this.precision)).toFixed(this.precision);
        }
        if (result == "NaN")
            return "";
    }


    return result;
};

function DateFormater(pattern) {
    this.pattern = pattern;
};

DateFormater.prototype.update = function (pattern) {
    this.pattern = pattern;
}


DateFormater.prototype.format = function (value) {
    return moment(value).format(this.pattern)
};

u.NumberFormater = NumberFormater;
u.DateFormater = DateFormater;



u.date= {
    /**
     * 多语言处理
     */
    //TODO 后续放到多语文件中
    _dateLocale:{
        'zh-CN':{
            months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
            monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
            weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
            weekdaysMin : '日_一_二_三_四_五_六'.split('_')
        },
        'en-US':{
            months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thurday_Friday_Saturday'.split('_'),
            weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin : 'S_M_T_W_T_F_S'.split('_'),
        }
    },

    _formattingTokens : /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYY|YY|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,

    leftZeroFill : function(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),sign = number >= 0;
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    },

    _formats: {
        //year
        YY   : function (date) {
            return u.date.leftZeroFill(date.getFullYear() % 100, 2);
        },
        YYYY : function (date) {
            return date.getFullYear();
        },
        //month
        M : function (date) {
            return date.getMonth() + 1;
        },
        MM: function(date){
            var m = u.date._formats.M(date);
            return u.date.leftZeroFill(m,2);
        },
        MMM  : function (date, language) {
            var m = date.getMonth();
            return u.date._dateLocale[language].monthsShort[m];
        },
        MMMM : function (date, language) {
            var m = date.getMonth();
            return u.date._dateLocale[language].months[m];
        },
        //date
        D : function (date) {
            return date.getDate();
        },
        DD: function(date){
            var d = u.date._formats.D(date);
            return u.date.leftZeroFill(d,2);
        },
        // weekday
        d : function (date) {
            return date.getDay();
        },
        dd : function (date, language) {
            var d = u.date._formats.d(date);
            return u.date._dateLocale[language].weekdaysMin[d];
        },
        ddd : function (date, language) {
            var d = u.date._formats.d(date);
            return u.date._dateLocale[language].weekdaysShort[d];
        },
        dddd : function (date, language) {
            var d = u.date._formats.d(date);
            return u.date._dateLocale[language].weekdays[d];
        },
        // am pm
        a: function(date){
            if (date.getHours() > 12){
                return 'pm';
            }else{
                return 'am';
            }
        },
        //hour
        h: function(date){
            var h = date.getHours();
            h = h > 12 ? h-12 : h;
            return h
        },
        hh: function(date){
            var h = u.date._formats.h(date);
            return u.date.leftZeroFill(h,2);
        },
        H: function(date){
            return date.getHours();
        },
        HH: function(date){
            return u.date.leftZeroFill(date.getHours(),2);
        },
        // minutes
        m: function(date){
            return date.getMinutes();
        },
        mm: function(date){
            return u.date.leftZeroFill(date.getMinutes(), 2);
        },
        //seconds
        s: function(date){
            return date.getSeconds();
        },
        ss: function(date){
            return u.date.leftZeroFill(date.getSeconds(),2);
        }
    },

    /**
     * 日期格式化
     * @param date
     * @param formatString
     */
    format: function(date, formatString, language){
        var array = formatString.match(u.date._formattingTokens), i, length,output='';
        language = language || u.core.getLanguages();
        for (i = 0, length = array.length; i < length; i++) {
            if (u.date._formats[array[i]]) {
                output += u.date._formats[array[i]](date, language);
            } else {
                output += array[i];
            }
        }
        return output;
    },

    _addOrSubtract: function(date, period, value, isAdding){
        var times = date.getTime(),d = date.getDate(), m = date.getMonth(),_date = new Date(date);
        if (period === 'ms') {
            times = times + value * isAdding;
            _date.setTime(times);
        }
        else if (period == 's') {
            times = times + value*1000 * isAdding;
            _date.setTime(times);
        }
        else if (period == 'm') {
            times = times + value*60000 * isAdding;
            _date.setTime(times);
        }
        else if (period == 'h') {
            times = times + value*3600000 * isAdding;
            _date.setTime(times);
        }
        else if (period == 'd') {
            d = d + value * isAdding;
            _date.setDate(d);
        }
        else if (period == 'w') {
            d = d + value * 7 * isAdding;
            _date.setDate(d);
        }
        else if (period == 'M') {
            m = m + value * isAdding;
            _date.setMonth(d);
        }
        else if (period == 'y'){
            m = m + value * 12 * isAdding;
            _date.setMonth(d);
        }
        return _date;
    },

    add: function(date,period,value){
        return u.date._addOrSubtract(date, period, value, 1);
    },
    sub: function(date,period,value){
        return u.date._addOrSubtract(date, period, value, -1);
    }
};


/**
 * 处理数据显示格式
 */

u.floatRender = function (value, precision) {
    var trueValue = value;
    if (typeof value === 'undefined' || value === null)
        return value;
    //value 为 ko对象
    if (typeof value === 'function')
        trueValue = value();
    var maskerMeta = u.core.getMaskerMeta('float') || {};
    if (typeof precision === 'number')
        maskerMeta.precision = precision;
    var formater = new $.NumberFormater(maskerMeta.precision);
    var masker = new NumberMasker(maskerMeta);
    return masker.format(formater.format(trueValue)).value;
};

u.integerRender = function (value) {
    var trueValue = value;
    if (typeof value === 'undefined' || value === null)
        return value;
    //value 为 ko对象
    if (typeof value === 'function')
        trueValue = value();
    return trueValue
};

u.dateRender = function (value, format) {
    var trueValue = value
    if (typeof value === 'undefined' || value === null)
        return value
    //value 为 ko对象
    if (typeof value === 'function')
        trueValue = value()
    var maskerMeta = u.core.getMaskerMeta('date') || {}
    if (typeof format != 'undefined')
        maskerMeta.format = format
    var masker = new DateMasker(maskerMeta);
    return masker.format(trueValue).value
};

u.dateTimeRender = function (value, format) {
    var trueValue = value
    if (typeof value === 'undefined' || value === null)
        return value
    //value 为 ko对象
    if (typeof value === 'function')
        trueValue = value()
    var maskerMeta = u.core.getMaskerMeta('datetime') || {};
    if (typeof format != 'undefined')
        maskerMeta.format = format;
    var masker = new DateTimeMasker(maskerMeta);
    return masker.format(trueValue).value
};

u.timeRender = function (value, format) {
    var trueValue = value;
    if (typeof value === 'undefined' || value === null)
        return value;
    //value 为 ko对象
    if (typeof value === 'function')
        trueValue = value();
    var maskerMeta = u.core.getMaskerMeta('time') || {};
    if (typeof format != 'undefined')
        maskerMeta.format = format;
    var masker = new TimeMasker(maskerMeta);
    var maskerValue = masker.format(trueValue);
    return (maskerValue && maskerValue.value) ? maskerValue.value : '';
};

u.percentRender = function (value) {
    var trueValue = value
    if (typeof value === 'undefined' || value === null)
        return value
    //value 为 ko对象
    if (typeof value === 'function')
        trueValue = value()
    var maskerMeta = u.core.getMaskerMeta('percent') || {}
    var masker = new PercentMasker(maskerMeta);
    var maskerValue = masker.format(trueValue);
    return (maskerValue && maskerValue.value) ? maskerValue.value : '';
};

u.dateToUTCString = function (date) {
    if (!date) return ''
    if (date.indexOf("-") > -1)
        date = date.replace(/\-/g, "/");
    var utcString = Date.parse(date);
    if (isNaN(utcString)) return "";
    return utcString;
}

var _hotkeys = {};
_hotkeys.special_keys = {
    27: 'esc', 9: 'tab', 32: 'space', 13: 'enter', 8: 'backspace', 145: 'scroll', 20: 'capslock',
    144: 'numlock', 19: 'pause', 45: 'insert', 36: 'home', 46: 'del', 35: 'end', 33: 'pageup',
    34: 'pagedown', 37: 'left', 38: 'up', 39: 'right', 40: 'down', 112: 'f1', 113: 'f2', 114: 'f3',
    115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8', 120: 'f9', 121: 'f10', 122: 'f11', 123: 'f12'
};

_hotkeys.shift_nums = {
    "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
    "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ":", "'": "\"", ",": "<",
    ".": ">", "/": "?", "\\": "|"
};

_hotkeys.add = function (combi, options, callback) {
    if (u.isFunction(options)) {
        callback = options;
        options = {};
    }
    var opt = {},
        defaults = {type: 'keydown', propagate: false, disableInInput: false, target: document.body, checkParent: true},
        that = this;
    opt = u.extend(opt, defaults, options || {});
    combi = combi.toLowerCase();

    // inspect if keystroke matches
    var inspector = function (event) {
        //event = $.event.fix(event); // jQuery event normalization.
        var element = this//event.target;
        // @ TextNode -> nodeType == 3
        element = (element.nodeType == 3) ? element.parentNode : element;

        if (opt['disableInInput']) { // Disable shortcut keys in Input, Textarea fields
            var target = element;//$(element);
            if (target.tagName == "INPUT" || target.tagName == "TEXTAREA") {
                return;
            }
        }
        var code = event.which,
            type = event.type,
            character = String.fromCharCode(code).toLowerCase(),
            special = that.special_keys[code],
            shift = event.shiftKey,
            ctrl = event.ctrlKey,
            alt = event.altKey,
            propagate = true, // default behaivour
            mapPoint = null;

        // in opera + safari, the event.target is unpredictable.
        // for example: 'keydown' might be associated with HtmlBodyElement
        // or the element where you last clicked with your mouse.
        if (opt.checkParent) {
//              while (!that.all[element] && element.parentNode){
            while (!element['u.hotkeys'] && element.parentNode) {
                element = element.parentNode;
            }
        }

//          var cbMap = that.all[element].events[type].callbackMap;
        var cbMap = element['u.hotkeys'].events[type].callbackMap;
        if (!shift && !ctrl && !alt) { // No Modifiers
            mapPoint = cbMap[special] || cbMap[character]
        }
        // deals with combinaitons (alt|ctrl|shift+anything)
        else {
            var modif = '';
            if (alt) modif += 'alt+';
            if (ctrl) modif += 'ctrl+';
            if (shift) modif += 'shift+';
            // modifiers + special keys or modifiers + characters or modifiers + shift characters
            mapPoint = cbMap[modif + special] || cbMap[modif + character] || cbMap[modif + that.shift_nums[character]]
        }
        if (mapPoint) {
            mapPoint.cb(event);
            if (!mapPoint.propagate) {
                event.stopPropagation();
                event.preventDefault();
                return false;
            }
        }
    };
    // first hook for this element
    var data = opt.target['u.hotkeys'];
    if (!data) {
        opt.target['u.hotkeys'] =  data = {events: {}};
    }
//      if (!_hotkeys.all[opt.target]){
//          _hotkeys.all[opt.target] = {events:{}};
//      }
    if (!data.events[opt.type]) {
        data.events[opt.type] = {callbackMap: {}};
        u.on(opt.target, opt.type, inspector);
        //$.event.add(opt.target, opt.type, inspector);
    }
//      if (!_hotkeys.all[opt.target].events[opt.type]){
//          _hotkeys.all[opt.target].events[opt.type] = {callbackMap: {}}
//          $.event.add(opt.target, opt.type, inspector);
//      }
    data.events[opt.type].callbackMap[combi] = {cb: callback, propagate: opt.propagate};
//      _hotkeys.all[opt.target].events[opt.type].callbackMap[combi] =  {cb: callback, propagate:opt.propagate};
    return u.hotkeys;
};
_hotkeys.remove = function (exp, opt) {
    opt = opt || {};
    target = opt.target || document.body;
    type = opt.type || 'keydown';
    exp = exp.toLowerCase();

    delete target['u.hotkeys'].events[type].callbackMap[exp];
};

_hotkeys.scan = function (element, target) {
    element = element || document.body;
    element.querySelectorAll('[u-enter]').forEach(function(el){
        var enterValue = el.getAttribute('u-enter');
        if (!enterValue) return;
        if (enterValue.substring(0, 1) == '#')
            u.hotkeys.add('enter', {target: this}, function () {
                var _el = element.querySelector(enterValue);
                if (_el){
                    _el.focus();
                }
            });
        else {
            target = target || window
            var func = u.getFunction(target, enterValue)
            u.hotkeys.add('enter', {target: this}, function () {
                func.call(this)
            })
        }
    });
    element.querySelectorAll('[u-hotkey]').forEach(function(el){
        var hotkey = el.getAttribute('u-hotkey');
        if (!hotkey) return;
        u.hotkeys.add(hotkey, function () {
            el.click();
        })

    });
}

u.hotkeys = _hotkeys;

var BaseComponent = u.Class.create({
    initialize: function (element) {
        if (element instanceof HTMLElement){
            this.element = element;
            this.options = {};
        }else{
            this.element = element['el'];
            this.options = element;
        }
        //var opt = options['options'] || {},
        //    model = options['model'];
        //this.element = typeof options['el'] === 'string' ? document.querySelector(options['el']) : options['el'];
        //this.element = element;
        //this.id = opt['id'];
        //this.options = opt;
        //this.model = model;
        this.element['ucomp'] = this;
        this.compType = this.constructor.compType;


        this.init();
        //有指定dataTable,增加对对dataTable的适配器
        //if (opt['data']){
        //    adjustDataType(opt);
        //    this.createDateAdapter(options);
        //}
        //this.render();
        //绑定事件
        //var events = this.config['events'] || {};
        //for (var key in events) {
        //    var func = events[key];
        //    if (typeof func == 'string'){
        //        func = u.getFunction(this.model, events[key]);
        //    }
        //    if (this.isDomEvent(key)) {
        //        this.addDomEvent(key, func)
        //    }
        //    else {
        //        this.on(key, u.getFunction(this.model, events[key]))
        //    }
        //};
    },
    /**
     * 绑定事件
     * @param {String} name
     * @param {Function} callback
     */
    on: function (name, callback) {
        name = name.toLowerCase()
        this._events || (this._events = {})
        var events = this._events[name] || (this._events[name] = [])
        events.push({
            callback: callback
        })
        return this;
    },
    /**
     * 触发事件
     * @param {String} name
     */
    trigger: function (name) {
        name = name.toLowerCase()
        if (!this._events || !this._events[name]) return this;
        var args = Array.prototype.slice.call(arguments, 1);
        var events = this._events[name];
        for (var i = 0, count = events.length; i < count; i++) {
            events[i].callback.apply(this, args);
        }
        return this;

    },
    /**
     * 初始化
     */
    init: function(){},
    /**
     * 渲染控件
     */
    render: function(){},
    /**
     * 销毁控件
     */
    destroy: function(){
        delete this.element['comp'];
        this.element.innerHTML = '';
    },
    /**
     * 增加dom事件
     * @param {String} name
     * @param {Function} callback
     */
    addDomEvent: function (name, callback) {
        u.on(this.element, name, callback)
        return this
    },
    /**
     * 移除dom事件
     * @param {String} name
     */
    removeDomEvent: function (name, callback) {
        u.off(this.element,name,callback);
        return this
    },
    setEnable: function (enable) {
        return this
    },
    /**
     * 判断是否为DOM事件
     */
    isDomEvent: function (eventName) {
        if (this.element['on' + eventName] === undefined)
            return false
        else
            return true
    },
    createDateAdapter: function(options){
        var opt = options['options'],
            model = options['model'];
        var Adapter = u.compMgr.getDataAdapter(this.compType, opt['dataType']);
        if (Adapter){
            this.dataAdapter = new Adapter(this, options);
        }
    },
    Statics: {
        compName: '',
        EVENT_VALUE_CHANGE: 'valueChange',
        getName: function () {
            return this.compName
        }
    }
})

function adjustDataType(options){
    var types = ['integer', 'float', 'currency', 'percent', 'string', 'textarea'];
    var _type = options['type'],
        _dataType = options['dataType'];
    if (types.indexOf(_type) != -1){
        options['dataType'] = _type;
        options['type'] = 'originText';
    }
}


u.BaseComponent = BaseComponent




  var URipple = function URipple(element) {
    if (u.isIE8) return;
    this._element = element;

    // Initialize instance.
    this.init();
  };
  //window['URipple'] = URipple;

  URipple.prototype._down = function(event) {
    if (!this._rippleElement.style.width && !this._rippleElement.style.height) {
      var rect = this._element.getBoundingClientRect();
      this.rippleSize_ = Math.sqrt(rect.width * rect.width + rect.height * rect.height) * 2 + 2;
      this._rippleElement.style.width = this.rippleSize_ + 'px';
      this._rippleElement.style.height = this.rippleSize_ + 'px';
    }

    u.addClass(this._rippleElement, 'is-visible');

    if (event.type === 'mousedown' && this._ignoringMouseDown) {
      this._ignoringMouseDown = false;
    } else {
      if (event.type === 'touchstart') {
        this._ignoringMouseDown = true;
      }
      var frameCount = this.getFrameCount();
      if (frameCount > 0) {
        return;
      }
      this.setFrameCount(1);
      var bound = event.currentTarget.getBoundingClientRect();
      var x;
      var y;
      // Check if we are handling a keyboard click.
      if (event.clientX === 0 && event.clientY === 0) {
        x = Math.round(bound.width / 2);
        y = Math.round(bound.height / 2);
      } else {
        var clientX = event.clientX ? event.clientX : event.touches[0].clientX;
        var clientY = event.clientY ? event.clientY : event.touches[0].clientY;
        x = Math.round(clientX - bound.left);
        y = Math.round(clientY - bound.top);
      }
      this.setRippleXY(x, y);
      this.setRippleStyles(true);
      window.requestAnimationFrame(this.animFrameHandler.bind(this));
    }
  };

  /**
   * Handle mouse / finger up on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  URipple.prototype._up = function(event) {
    var self = this;
    // Don't fire for the artificial "mouseup" generated by a double-click.
    if (event && event.detail !== 2) {
      u.removeClass(this._rippleElement,'is-visible')
    }
    // Allow a repaint to occur before removing this class, so the animation
    // shows for tap events, which seem to trigger a mouseup too soon after
    // mousedown.
    window.setTimeout(function() {
      u.removeClass(self._rippleElement,'is-visible')
    }, 0);
  };

  /**
   * Initialize element.
   */
  URipple.prototype.init = function() {
    var self = this;
    if (this._element) {
      this._rippleElement = this._element.querySelector('.u-ripple');
      if (!this._rippleElement){
        this._rippleElement = document.createElement('span');
        u.addClass(this._rippleElement,'u-ripple');
        this._element.appendChild(this._rippleElement);
        this._element.style.overflow = 'hidden';
        this._element.style.position = 'relative';
      }
      this.frameCount_ = 0;
      this.rippleSize_ = 0;
      this.x_ = 0;
      this.y_ = 0;

      // Touch start produces a compat mouse down event, which would cause a
      // second ripples. To avoid that, we use this property to ignore the first
      // mouse down after a touch start.
      this._ignoringMouseDown = false;
      u.on(this._element, 'mousedown',function(e){self._down(e);})
      u.on(this._element, 'touchstart',function(e){self._down(e);})

      u.on(this._element, 'mouseup',function(e){self._up(e);})
      u.on(this._element, 'mouseleave',function(e){self._up(e);})
      u.on(this._element, 'touchend',function(e){self._up(e);})
      u.on(this._element, 'blur',function(e){self._up(e);})

      /**
       * Getter for frameCount_.
       * @return {number} the frame count.
       */
      this.getFrameCount = function() {
        return this.frameCount_;
      };

      /**
       * Setter for frameCount_.
       * @param {number} fC the frame count.
       */
      this.setFrameCount = function(fC) {
        this.frameCount_ = fC;
      };

      /**
       * Getter for _rippleElement.
       * @return {Element} the ripple element.
       */
      this.getRippleElement = function() {
        return this._rippleElement;
      };

      /**
       * Sets the ripple X and Y coordinates.
       * @param  {number} newX the new X coordinate
       * @param  {number} newY the new Y coordinate
       */
      this.setRippleXY = function(newX, newY) {
        this.x_ = newX;
        this.y_ = newY;
      };

      /**
       * Sets the ripple styles.
       * @param  {boolean} start whether or not this is the start frame.
       */
      this.setRippleStyles = function(start) {
        if (this._rippleElement !== null) {
          var transformString;
          var scale;
          var size;
          var offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';

          if (start) {
            scale = 'scale(0.0001, 0.0001)';
            size = '1px';
          } else {
            scale = '';
            size = this.rippleSize_ + 'px';
          }

          transformString = 'translate(-50%, -50%) ' + offset + scale;

          this._rippleElement.style.webkitTransform = transformString;
          this._rippleElement.style.msTransform = transformString;
          this._rippleElement.style.transform = transformString;

          if (start) {
            u.removeClass(this._rippleElement,'is-animating')
          } else {
            u.addClass(this._rippleElement,'is-animating')
          }
        }
      };

      /**
       * Handles an animation frame.
       */
      this.animFrameHandler = function() {
        if (this.frameCount_-- > 0) {
          window.requestAnimationFrame(this.animFrameHandler.bind(this));
        } else {
          this.setRippleStyles(false);
        }
      };
    }
  };

  u.Ripple = URipple;







u.Button = u.BaseComponent.extend({
    init:function(){
        var rippleContainer = document.createElement('span');
        u.addClass(rippleContainer, 'u-button-container');
        this._rippleElement = document.createElement('span');
        u.addClass(this._rippleElement, 'u-ripple');
        if (u.isIE8)
            u.addClass(this._rippleElement, 'oldIE');
        rippleContainer.appendChild(this._rippleElement);
        u.on(this._rippleElement, 'mouseup', this.element.blur);
        this.element.appendChild(rippleContainer);

        u.on(this.element, 'mouseup', this.element.blur);
        u.on(this.element, 'mouseleave', this.element.blur);
        this.ripple = new u.Ripple(this.element)
    }

});


u.compMgr.regComp({
    comp: u.Button,
    compAsString: 'u.Button',
    css: 'u-button'
})

u.NavLayout = u.BaseComponent.extend({
    _Constant: {
        MAX_WIDTH: '(max-width: 1024px)',
        TAB_SCROLL_PIXELS: 100,

        MENU_ICON: 'menu',
        CHEVRON_LEFT: 'chevron_left',
        CHEVRON_RIGHT: 'chevron_right'
    },
    /**
     * Modes.
     *
     * @enum {number}
     * @private
     */
    _Mode: {
        STANDARD: 0,
        SEAMED: 1,
        WATERFALL: 2,
        SCROLL: 3
    },
    /**
     * Store strings for class names defined by this component that are used in
     * JavaScript. This allows us to simply change it in one place should we
     * decide to modify at a later date.
     *
     * @enum {string}
     * @private
     */
    _CssClasses: {
        CONTAINER: 'u-navlayout-container',
        HEADER: 'u-navlayout-header',
        DRAWER: 'u-navlayout-drawer',
        CONTENT: 'u-navlayout-content',
        DRAWER_BTN: 'u-navlayout-drawer-button',

        ICON: 'fa',

        //JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
        //RIPPLE_CONTAINER: 'mdl-layout__tab-ripple-container',
        //RIPPLE: 'mdl-ripple',
        //RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',

        HEADER_SEAMED: 'seamed',
        HEADER_WATERFALL: 'waterfall',
        HEADER_SCROLL: 'scroll',

        FIXED_HEADER: 'fixed',
        OBFUSCATOR: 'u-navlayout-obfuscator',

        TAB_BAR: 'u-navlayout-tab-bar',
        TAB_CONTAINER: 'u-navlayout-tab-bar-container',
        TAB: 'u-navlayout-tab',
        TAB_BAR_BUTTON: 'u-navlayout-tab-bar-button',
        TAB_BAR_LEFT_BUTTON: 'u-navlayout-tab-bar-left-button',
        TAB_BAR_RIGHT_BUTTON: 'u-navlayout-tab-bar-right-button',
        PANEL: 'u-navlayout-tab-panel',

        HAS_DRAWER: 'has-drawer',
        HAS_TABS: 'has-tabs',
        HAS_SCROLLING_HEADER: 'has-scrolling-header',
        CASTING_SHADOW: 'is-casting-shadow',
        IS_COMPACT: 'is-compact',
        IS_SMALL_SCREEN: 'is-small-screen',
        IS_DRAWER_OPEN: 'is-visible',
        IS_ACTIVE: 'is-active',
        IS_UPGRADED: 'is-upgraded',
        IS_ANIMATING: 'is-animating',

        ON_LARGE_SCREEN: 'u-navlayout-large-screen-only',
        ON_SMALL_SCREEN: 'u-navlayout-small-screen-only'

    },
    init: function(){
        var container = document.createElement('div');
        u.addClass(container, this._CssClasses.CONTAINER);
        this.element.parentElement.insertBefore(container, this.element);
        this.element.parentElement.removeChild(this.element);
        container.appendChild(this.element);

        var directChildren = this.element.childNodes;
        var numChildren = directChildren.length;
        for (var c = 0; c < numChildren; c++) {
            var child = directChildren[c];
            if (u.hasClass(child, this._CssClasses.HEADER)) {
                this._header = child;
            }

            if (u.hasClass(child, this._CssClasses.DRAWER)) {
                this._drawer = child;
            }

            if (u.hasClass(child, this._CssClasses.CONTENT)) {
                this._content = child;
                var layoutHeight = this.element.offsetHeight;
                var headerHeight = typeof this._header === 'undefined' ? 0 : this._header.offsetHeight;
                this._content.style.height = layoutHeight - headerHeight + 'px'
                var self = this;
                window.addEventListener('resize', function () {
                    var layoutHeight = self.element.offsetHeight;
                    var headerHeight = typeof self._header === 'undefined' ? 0 : self._header.offsetHeight;
                    self._content.style.height = layoutHeight - headerHeight + 'px'

                })
            }
        }

        if (this._header) {
            this._tabBar = this._header.querySelector('.' + this._CssClasses.TAB_BAR);
        }

        var mode = this._Mode.STANDARD;

        if (this._header) {
            if (u.hasClass(this._header, this._CssClasses.HEADER_SEAMED)) {
                mode = this._Mode.SEAMED;
            } else if (u.hasClass(this._header,
                    this._CssClasses.HEADER_SEAMED)) {
                mode = this._Mode.WATERFALL;
                this._header.addEventListener('transitionend', this._headerTransitionEndHandler.bind(this));
                this._header.addEventListener('click', this._headerClickHandler.bind(this));
            } else if (u.hasClass(this._header, this._CssClasses.HEADER_SCROLL)) {
                mode = this._Mode.SCROLL;
                u.addClass(container, this._CssClasses.HAS_SCROLLING_HEADER);
            }

            if (mode === this._Mode.STANDARD) {
                u.addClass(this._header, this._CssClasses.CASTING_SHADOW);
                if (this._tabBar) {
                    u.addClass(this._tabBar, this._CssClasses.CASTING_SHADOW);
                }
            } else if (mode === this._Mode.SEAMED || mode === this._Mode.SCROLL) {
                u.removeClass(this._header, this._CssClasses.CASTING_SHADOW);
                if (this._tabBar) {
                    u.removeClass(this._tabBar, this._CssClasses.CASTING_SHADOW);
                }
            } else if (mode === this._Mode.WATERFALL) {
                // Add and remove shadows depending on scroll position.
                // Also add/remove auxiliary class for styling of the compact version of
                // the header.
                this._content.addEventListener('scroll',
                    this._contentScrollHandler.bind(this));
                this._contentScrollHandler();
            }
        }

        // Add drawer toggling button to our layout, if we have an openable drawer.
        if (this._drawer) {
            var drawerButton = this.element.querySelector('.' + this._CssClasses.DRAWER_BTN);
            if (!drawerButton) {
                drawerButton = document.createElement('div');
                u.addClass(drawerButton, this._CssClasses.DRAWER_BTN);

                var drawerButtonIcon = document.createElement('i');
                drawerButtonIcon.className = 'fa fa-bars';
                //drawerButtonIcon.textContent = this._Constant.MENU_ICON;
                drawerButton.appendChild(drawerButtonIcon);
            }

            if (u.hasClass(this._drawer, this._CssClasses.ON_LARGE_SCREEN)) {
                //If drawer has ON_LARGE_SCREEN class then add it to the drawer toggle button as well.
                u.addClass(drawerButton, this._CssClasses.ON_LARGE_SCREEN);
            } else if (u.hasClass(this._drawer, this._CssClasses.ON_SMALL_SCREEN)) {
                //If drawer has ON_SMALL_SCREEN class then add it to the drawer toggle button as well.
                u.addClass(drawerButton, this._CssClasses.ON_SMALL_SCREEN);
            }

            drawerButton.addEventListener('click', this._drawerToggleHandler.bind(this));

            // Add a class if the layout has a drawer, for altering the left padding.
            // Adds the HAS_DRAWER to the elements since this._header may or may
            // not be present.
            u.addClass(this.element, this._CssClasses.HAS_DRAWER);

            // If we have a fixed header, add the button to the header rather than
            // the layout.
            if (u.hasClass(this.element, this._CssClasses.FIXED_HEADER)) {
                this._header.insertBefore(drawerButton, this._header.firstChild);
            } else {
                this.element.insertBefore(drawerButton, this._content);
            }
            this.drawerButton = drawerButton;

            var obfuscator = document.createElement('div');
            u.addClass(obfuscator, this._CssClasses.OBFUSCATOR);
            this.element.appendChild(obfuscator);
            obfuscator.addEventListener('click', this._drawerToggleHandler.bind(this));
            this._obfuscator = obfuscator;
        }

        // Keep an eye on screen size, and add/remove auxiliary class for styling
        // of small screens.
        this._screenSizeMediaQuery = window.matchMedia(
            /** @type {string} */ (this._Constant.MAX_WIDTH));
        this._screenSizeMediaQuery.addListener(this._screenSizeHandler.bind(this));
        this._screenSizeHandler();

        // Initialize tabs, if any.
        if (this._header && this._tabBar) {
            u.addClass(this.element, this._CssClasses.HAS_TABS);

            var tabContainer = document.createElement('div');
            u.addClass(tabContainer, this._CssClasses.TAB_CONTAINER);
            this._header.insertBefore(tabContainer, this._tabBar);
            this._header.removeChild(this._tabBar);

            var leftButton = document.createElement('div');
            u.addClass(leftButton, this._CssClasses.TAB_BAR_BUTTON);
            u.addClass(leftButton, this._CssClasses.TAB_BAR_LEFT_BUTTON);
            var leftButtonIcon = document.createElement('i');
            u.addClass(leftButtonIcon, this._CssClasses.ICON);
            leftButtonIcon.textContent = this._Constant.CHEVRON_LEFT;
            leftButton.appendChild(leftButtonIcon);
            leftButton.addEventListener('click', function () {
                this._tabBar.scrollLeft -= this._Constant.TAB_SCROLL_PIXELS;
            }.bind(this));

            var rightButton = document.createElement('div');
            u.addClass(rightButton, this._CssClasses.TAB_BAR_BUTTON);
            u.addClass(rightButton, this._CssClasses.TAB_BAR_RIGHT_BUTTON);
            var rightButtonIcon = document.createElement('i');
            u.addClass(rightButtonIcon, this._CssClasses.ICON);
            rightButtonIcon.textContent = this._Constant.CHEVRON_RIGHT;
            rightButton.appendChild(rightButtonIcon);
            rightButton.addEventListener('click', function () {
                this._tabBar.scrollLeft += this._Constant.TAB_SCROLL_PIXELS;
            }.bind(this));

            tabContainer.appendChild(leftButton);
            tabContainer.appendChild(this._tabBar);
            tabContainer.appendChild(rightButton);

            // Add and remove buttons depending on scroll position.
            var tabScrollHandler = function () {
                if (this._tabBar.scrollLeft > 0) {
                    u.addClass(leftButton, this._CssClasses.IS_ACTIVE);
                } else {
                    u.removeClass(leftButton, this._CssClasses.IS_ACTIVE);
                }

                if (this._tabBar.scrollLeft <
                    this._tabBar.scrollWidth - this._tabBar.offsetWidth) {
                    u.addClass(rightButton, this._CssClasses.IS_ACTIVE);
                } else {
                    u.removeClass(rightButton, this._CssClasses.IS_ACTIVE);
                }
            }.bind(this);

            this._tabBar.addEventListener('scroll', tabScrollHandler);
            tabScrollHandler();

            if (u.hasClass(this._tabBar, this._CssClasses.JS_RIPPLE_EFFECT)) {
                u.addClass(this._tabBar, this._CssClasses.RIPPLE_IGNORE_EVENTS);
            }

            // Select element tabs, document panels
            var tabs = this._tabBar.querySelectorAll('.' + this._CssClasses.TAB);
            var panels = this._content.querySelectorAll('.' + this._CssClasses.PANEL);

            // Create new tabs for each tab element
            for (var i = 0; i < tabs.length; i++) {
                new UNavLayoutTab(tabs[i], tabs, panels, this);
            }
        }

        u.addClass(this.element, this._CssClasses.IS_UPGRADED);

    },

    /**
     * Handles scrolling on the content.
     *
     * @private
     */
    _contentScrollHandler: function () {
        if (u.hasClass(this._header, this._CssClasses.IS_ANIMATING)) {
            return;
        }

        if (this._content.scrollTop > 0 && !u.hasClass(this._header, this._CssClasses.IS_COMPACT)) {
            u.addClass(this._header, this._CssClasses.CASTING_SHADOW)
                .addClass(this._header, this._CssClasses.IS_COMPACT)
                .addClass(this._header, this._CssClasses.IS_ANIMATING);
        } else if (this._content.scrollTop <= 0 && u.hasClass(this._header, this._CssClasses.IS_COMPACT)) {
            u.removeClass(this._header, this._CssClasses.CASTING_SHADOW)
                .removeClass(this._header, this._CssClasses.IS_COMPACT)
                .addClass(this._header, this._CssClasses.IS_ANIMATING);
        }
    },


    /**
     * Handles changes in screen size.
     *
     * @private
     */
    _screenSizeHandler: function () {
        if (this._screenSizeMediaQuery.matches) {
            u.addClass(this.element, this._CssClasses.IS_SMALL_SCREEN);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_SMALL_SCREEN);
            // Collapse drawer (if any) when moving to a large screen size.
            if (this._drawer) {
                u.removeClass(this._drawer, this._CssClasses.IS_DRAWER_OPEN);
                u.removeClass(this._obfuscator, this._CssClasses.IS_DRAWER_OPEN);
            }
        }
    },
    /**
     * Handles toggling of the drawer.
     *
     * @private
     */
    _drawerToggleHandler: function () {
        u.toggleClass(this._drawer, this._CssClasses.IS_DRAWER_OPEN);
        u.toggleClass(this._obfuscator, this._CssClasses.IS_DRAWER_OPEN);
    },
    /**
     * Handles (un)setting the `is-animating` class
     *
     * @private
     */
    _headerTransitionEndHandler: function () {
        u.removeClass(this._header, this._CssClasses.IS_ANIMATING);
    },
    /**
     * Handles expanding the header on click
     *
     * @private
     */
    _headerClickHandler: function () {
        if (u.hasClass(this._header, this._CssClasses.IS_COMPACT)) {
            u.removeClass(this._header, this._CssClasses.IS_COMPACT);
            u.addClass(this._header, this._CssClasses.IS_ANIMATING);
        }
    },
    /**
     * Reset tab state, dropping active classes
     *
     * @private
     */
    _resetTabState: function (tabBar) {
        for (var k = 0; k < tabBar.length; k++) {
            u.removeClass(tabBar[k], this._CssClasses.IS_ACTIVE);
        }
    },
    /**
     * Reset panel state, droping active classes
     *
     * @private
     */
    _resetPanelState: function (panels) {
    for (var j = 0; j < panels.length; j++) {
        u.removeClass(panels[j], this._CssClasses.IS_ACTIVE);
    }
},





});



/**
 * Constructor for an individual tab.
 *
 * @constructor
 * @param {HTMLElement} tab The HTML element for the tab.
 * @param {!Array<HTMLElement>} tabs Array with HTML elements for all tabs.
 * @param {!Array<HTMLElement>} panels Array with HTML elements for all panels.
 * @param {UNavLayout} layout The UNavLayout object that owns the tab.
 */
function UNavLayoutTab(tab, tabs, panels, layout) {

    /**
     * Auxiliary method to programmatically select a tab in the UI.
     */
    function selectTab() {
        var href = tab.href.split('#')[1];
        var panel = layout._content.querySelector('#' + href);
        layout._resetTabState(tabs);
        layout._resetPanelState(panels);
        u.addClass(tab, layout._CssClasses.IS_ACTIVE);
        u.addClass(panel, layout._CssClasses.IS_ACTIVE);
    }

    //if (layout.tabBar_.classList.contains(layout._CssClasses.JS_RIPPLE_EFFECT)) {
    var rippleContainer = document.createElement('span');
    u.addClass(rippleContainer, 'u-ripple');
    //rippleContainer.classList.add(layout._CssClasses.JS_RIPPLE_EFFECT);
    //var ripple = document.createElement('span');
    //ripple.classList.add(layout._CssClasses.RIPPLE);
    //rippleContainer.appendChild(ripple);
    tab.appendChild(rippleContainer);
    new URipple(tab)
    //}

    tab.addEventListener('click', function (e) {
        if (tab.getAttribute('href').charAt(0) === '#') {
            e.preventDefault();
            selectTab();
        }
    });

    tab.show = selectTab;

    tab.addEventListener('click', function (e) {
        e.preventDefault();
        var href = tab.href.split('#')[1];
        var panel = layout._content.querySelector('#' + href);
        layout._resetTabState(tabs);
        layout._resetPanelState(panels);
        u.addClass(tab, layout._CssClasses.IS_ACTIVE);
        u.addClass(panel, layout._CssClasses.IS_ACTIVE);
    });
}
u.NavLayoutTab = UNavLayoutTab;

u.compMgr.regComp({
    comp: u.NavLayout,
    compAsString: 'u.NavLayout',
    css: 'u-navlayout'
})

u.Text = u.BaseComponent.extend({
    _Constant: {
        NO_MAX_ROWS: -1,
        MAX_ROWS_ATTRIBUTE: 'maxrows'
    },

    _CssClasses: {
        LABEL: 'u-label',
        INPUT: 'u-input',
        IS_DIRTY: 'is-dirty',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_INVALID: 'is-invalid',
        IS_UPGRADED: 'is-upgraded'
    },

    init: function () {
        this.maxRows = this._Constant.NO_MAX_ROWS;
        this.label_ = this.element.querySelector('.' + this._CssClasses.LABEL);
        this._input = this.element.querySelector('input');

        if (this._input) {
            if (this._input.hasAttribute(
                    /** @type {string} */ (this._Constant.MAX_ROWS_ATTRIBUTE))) {
                this.maxRows = parseInt(this._input.getAttribute(
                    /** @type {string} */ (this._Constant.MAX_ROWS_ATTRIBUTE)), 10);
                if (isNaN(this.maxRows)) {
                    this.maxRows = this._Constant.NO_MAX_ROWS;
                }
            }

            this.boundUpdateClassesHandler = this._updateClasses.bind(this);
            this.boundFocusHandler = this._focus.bind(this);
            this.boundBlurHandler = this._blur.bind(this);
            this.boundResetHandler = this._reset.bind(this);
            this._input.addEventListener('input', this.boundUpdateClassesHandler);
            this._input.addEventListener('focus', this.boundFocusHandler);
            this._input.addEventListener('blur', this.boundBlurHandler);
            this._input.addEventListener('reset', this.boundResetHandler);

            if (this.maxRows !== this._Constant.NO_MAX_ROWS) {
                // TODO: This should handle pasting multi line text.
                // Currently doesn't.
                this.boundKeyDownHandler = this._down.bind(this);
                this._input.addEventListener('keydown', this.boundKeyDownHandler);
            }
            var invalid = u.hasClass(this.element, this._CssClasses.IS_INVALID);
            this._updateClasses();
            u.addClass(this.element, this._CssClasses.IS_UPGRADED);
            if (invalid) {
                u.addClass(this.element, this._CssClasses.IS_INVALID);
            }
        }
    },

    /**
     * Handle input being entered.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _down: function (event) {
        var currentRowCount = event.target.value.split('\n').length;
        if (event.keyCode === 13) {
            if (currentRowCount >= this.maxRows) {
                event.preventDefault();
            }
        }
    },
    /**
     * Handle focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _focus : function (event) {
        u.addClass(this.element, this._CssClasses.IS_FOCUSED);
    },
    /**
     * Handle lost focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _blur : function (event) {
        u.removeClass(this.element, this._CssClasses.IS_FOCUSED);
    },
    /**
     * Handle reset event from out side.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _reset : function (event) {
        this._updateClasses();
    },
    /**
     * Handle class updates.
     *
     * @private
     */
    _updateClasses : function () {
        this.checkDisabled();
        this.checkValidity();
        this.checkDirty();
    },

// Public methods.

    /**
     * Check the disabled state and update field accordingly.
     *
     * @public
     */
    checkDisabled : function () {
        if (this._input.disabled) {
            u.addClass(this.element, this._CssClasses.IS_DISABLED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_DISABLED);
        }
    },
    /**
     * Check the validity state and update field accordingly.
     *
     * @public
     */
    checkValidity : function () {
        if (this._input.validity) {
            if (this._input.validity.valid) {
                u.removeClass(this.element, this._CssClasses.IS_INVALID);
            } else {
                u.addClass(this.element, this._CssClasses.IS_INVALID);
            }
        }
    },
    /**
     * Check the dirty state and update field accordingly.
     *
     * @public
     */
    checkDirty: function () {
        if (this._input.value && this._input.value.length > 0) {
            u.addClass(this.element, this._CssClasses.IS_DIRTY);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_DIRTY);
        }
    },
    /**
     * Disable text field.
     *
     * @public
     */
    disable: function () {
        this._input.disabled = true;
        this._updateClasses();
    },
    /**
     * Enable text field.
     *
     * @public
     */
    enable: function () {
        this._input.disabled = false;
        this._updateClasses();
    },
    /**
     * Update text field value.
     *
     * @param {string} value The value to which to set the control (optional).
     * @public
     */
    change: function (value) {
        this._input.value = value || '';
        this._updateClasses();
    }


});



//if (u.compMgr)
//    u.compMgr.addPlug({
//        name:'text',
//        plug: u.Text
//    })

u.compMgr.regComp({
    comp: u.Text,
    compAsString: 'u.Text',
    css: 'u-text'
});

u.Menu = u.BaseComponent.extend({
    _Keycodes: {
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32,
        UP_ARROW: 38,
        DOWN_ARROW: 40
    },
    _CssClasses: {

        BOTTOM_LEFT: 'u-menu-bottom-left',  // This is the default.
        BOTTOM_RIGHT: 'u-menu-bottom-right',
        TOP_LEFT: 'u-menu-top-left',
        TOP_RIGHT: 'u-menu-top-right',
        UNALIGNED: 'u-menu-unaligned'
    },

    init: function () {

        // Create container for the menu.
        var container = document.createElement('div');
        u.addClass(container, 'u-menu-container');
        this.element.parentElement.insertBefore(container, this.element);
        this.element.parentElement.removeChild(this.element);
        container.appendChild(this.element);
        this._container = container;

        // Create outline for the menu (shadow and background).
        var outline = document.createElement('div');
        u.addClass(outline, 'u-menu-outline');
        this._outline = outline;
        container.insertBefore(outline, this.element);

        // Find the "for" element and bind events to it.
        var forElId = this.element.getAttribute('for') || this.element.getAttribute('data-u-for');
        var forEl = null;
        if (forElId) {
            forEl = document.getElementById(forElId);
            if (forEl) {
                this.for_element = forEl;
                forEl.addEventListener('click', this._handleForClick.bind(this));
                forEl.addEventListener('keydown', this._handleForKeyboardEvent.bind(this));
            }
        }

        var items = this.element.querySelectorAll('.u-menu-item');
        this._boundItemKeydown = this._handleItemKeyboardEvent.bind(this);
        this._boundItemClick = this._handleItemClick.bind(this);
        for (var i = 0; i < items.length; i++) {
            // Add a listener to each menu item.
            items[i].addEventListener('click', this._boundItemClick);
            // Add a tab index to each menu item.
            items[i].tabIndex = '-1';
            // Add a keyboard listener to each menu item.
            items[i].addEventListener('keydown', this._boundItemKeydown);
        }

        for (i = 0; i < items.length; i++) {
            var item = items[i];

            var rippleContainer = document.createElement('span');
            u.addClass(rippleContainer, 'u-ripple');
            item.appendChild(rippleContainer);
            new URipple(item)
        }
        //}

        // Copy alignment classes to the container, so the outline can use them.
        if (u.hasClass(this.element, 'u-menu-bottom-left')) {
            u.addClass(this._outline, 'u-menu-bottom-left');
        }
        if (u.hasClass(this.element, 'u-menu-bottom-right')) {
            u.addClass(this._outline, 'u-menu-bottom-right');
        }
        if (u.hasClass(this.element, 'u-menu-top-left')) {
            u.addClass(this._outline, 'u-menu-top-left');
        }
        if (u.hasClass(this.element, 'u-menu-top-right')) {
            u.addClass(this._outline, 'u-menu-top-right');
        }
        if (u.hasClass(this.element, 'u-menu-unaligned')) {
            u.addClass(this._outline, 'u-menu-unaligned');
        }

        u.addClass(container, 'is-upgraded');

    },
    _handleForClick: function (evt) {
        if (this.element && this.for_element) {
            var rect = this.for_element.getBoundingClientRect();
            var forRect = this.for_element.parentElement.getBoundingClientRect();

            if (u.hasClass(this.element, 'u-menu-unaligned')) {
                // Do not position the menu automatically. Requires the developer to
                // manually specify position.
            } else if (u.hasClass(this.element, 'u-menu-bottom-right')) {
                // Position below the "for" element, aligned to its right.
                this._container.style.right = (forRect.right - rect.right) + 'px';
                this._container.style.top = this.for_element.offsetTop + this.for_element.offsetHeight + 'px';
            } else if (u.hasClass(this.element, 'u-menu-top-left')) {
                // Position above the "for" element, aligned to its left.
                this._container.style.left = this.for_element.offsetLeft + 'px';
                this._container.style.bottom = (forRect.bottom - rect.top) + 'px';
            } else if (u.hasClass(this.element, 'u-menu-top-right')) {
                // Position above the "for" element, aligned to its right.
                this._container.style.right = (forRect.right - rect.right) + 'px';
                this._container.style.bottom = (forRect.bottom - rect.top) + 'px';
            } else {
                // Default: position below the "for" element, aligned to its left.
                this._container.style.left = this.for_element.offsetLeft + 'px';
                this._container.style.top = this.for_element.offsetTop + this.for_element.offsetHeight + 'px';
            }
        }

        this.toggle(evt);
    },
    /**
     * Handles a keyboard event on the "for" element.
     *
     * @param {Event} evt The event that fired.
     * @private
     */
    _handleForKeyboardEvent: function (evt) {
        if (this.element && this._container && this.for_element) {
            var items = this.element.querySelectorAll('.u-menu-item:not([disabled])');

            if (items && items.length > 0 && u.hasClass(this._container, 'is-visible')) {
                if (evt.keyCode === this._Keycodes.UP_ARROW) {
                    evt.preventDefault();
                    items[items.length - 1].focus();
                } else if (evt.keyCode === this._Keycodes.DOWN_ARROW) {
                    evt.preventDefault();
                    items[0].focus();
                }
            }
        }
    },
    /**
     * Handles a keyboard event on an item.
     *
     * @param {Event} evt The event that fired.
     * @private
     */
    _handleItemKeyboardEvent: function (evt) {
        if (this.element && this._container) {
            var items = this.element.querySelectorAll('.u-menu-item:not([disabled])');

            if (items && items.length > 0 && u.hasClass(this._container, 'is-visible')) {
                var currentIndex = Array.prototype.slice.call(items).indexOf(evt.target);

                if (evt.keyCode === this._Keycodes.UP_ARROW) {
                    evt.preventDefault();
                    if (currentIndex > 0) {
                        items[currentIndex - 1].focus();
                    } else {
                        items[items.length - 1].focus();
                    }
                } else if (evt.keyCode === this._Keycodes.DOWN_ARROW) {
                    evt.preventDefault();
                    if (items.length > currentIndex + 1) {
                        items[currentIndex + 1].focus();
                    } else {
                        items[0].focus();
                    }
                } else if (evt.keyCode === this._Keycodes.SPACE ||
                    evt.keyCode === this._Keycodes.ENTER) {
                    evt.preventDefault();
                    // Send mousedown and mouseup to trigger ripple.
                    var e = new MouseEvent('mousedown');
                    evt.target.dispatchEvent(e);
                    e = new MouseEvent('mouseup');
                    evt.target.dispatchEvent(e);
                    // Send click.
                    evt.target.click();
                } else if (evt.keyCode === this._Keycodes.ESCAPE) {
                    evt.preventDefault();
                    this.hide();
                }
            }
        }
    },
    /**
     * Handles a click event on an item.
     *
     * @param {Event} evt The event that fired.
     * @private
     */
    _handleItemClick: function (evt) {
        if (evt.target.hasAttribute('disabled')) {
            evt.stopPropagation();
        } else {
            // Wait some time before closing menu, so the user can see the ripple.
            this._closing = true;
            window.setTimeout(function (evt) {
                this.hide();
                this._closing = false;
            }.bind(this), 150);
        }
    },
    /**
     * Calculates the initial clip (for opening the menu) or final clip (for closing
     * it), and applies it. This allows us to animate from or to the correct point,
     * that is, the point it's aligned to in the "for" element.
     *
     * @param {number} height Height of the clip rectangle
     * @param {number} width Width of the clip rectangle
     * @private
     */
    _applyClip: function (height, width) {
        if (u.hasClass(this.element, 'u-menu-unaligned')) {
            // Do not clip.
            this.element.style.clip = '';
        } else if (u.hasClass(this.element, 'u-menu-bottom-right')) {
            // Clip to the top right corner of the menu.
            this.element.style.clip =
                'rect(0 ' + width + 'px ' + '0 ' + width + 'px)';
        } else if (u.hasClass(this.element, 'u-menu-top-left')) {
            // Clip to the bottom left corner of the menu.
            this.element.style.clip =
                'rect(' + height + 'px 0 ' + height + 'px 0)';
        } else if (u.hasClass(this.element, 'u-menu-top-right')) {
            // Clip to the bottom right corner of the menu.
            this.element.style.clip = 'rect(' + height + 'px ' + width + 'px ' +
                height + 'px ' + width + 'px)';
        } else {
            // Default: do not clip (same as clipping to the top left corner).
            this.element.style.clip = '';
        }
    },
    /**
     * Adds an event listener to clean up after the animation ends.
     *
     * @private
     */
    _addAnimationEndListener: function () {
        var cleanup = function () {
            this.element.removeEventListener('transitionend', cleanup);
            this.element.removeEventListener('webkitTransitionEnd', cleanup);
            u.removeClass(this.element, 'is-animating');
        }.bind(this);

        // Remove animation class once the transition is done.
        this.element.addEventListener('transitionend', cleanup);
        this.element.addEventListener('webkitTransitionEnd', cleanup);
    },
    /**
     * Displays the menu.
     *
     * @public
     */
    show: function (evt) {
        if (this.element && this._container && this._outline) {
            // Measure the inner element.
            var height = this.element.getBoundingClientRect().height;
            var width = this.element.getBoundingClientRect().width;

            // Apply the inner element's size to the container and outline.
            this._container.style.width = width + 'px';
            this._container.style.height = height + 'px';
            this._outline.style.width = width + 'px';
            this._outline.style.height = height + 'px';

            var transitionDuration = 0.24;


            // Calculate transition delays for individual menu items, so that they fade
            // in one at a time.
            var items = this.element.querySelectorAll('.u-menu-item');
            for (var i = 0; i < items.length; i++) {
                var itemDelay = null;
                if (u.hasClass(this.element, 'u-menu-top-left') || u.hasClass(this.element, 'u-menu-top-right')) {
                    itemDelay = ((height - items[i].offsetTop - items[i].offsetHeight) /
                        height * transitionDuration) + 's';
                } else {
                    itemDelay = (items[i].offsetTop / height * transitionDuration) + 's';
                }
                items[i].style.transitionDelay = itemDelay;
            }

            // Apply the initial clip to the text before we start animating.
            this._applyClip(height, width);

            // Wait for the next frame, turn on animation, and apply the final clip.
            // Also make it visible. This triggers the transitions.
            window.requestAnimationFrame(function () {
                u.addClass(this.element, 'is-animating');
                this.element.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
                u.addClass(this._container, 'is-visible');
            }.bind(this));

            // Clean up after the animation is complete.
            this._addAnimationEndListener();

            // Add a click listener to the document, to close the menu.
            var callback = function (e) {
                if (e !== evt && !this._closing && e.target.parentNode !== this.element) {
                    document.removeEventListener('click', callback);
                    this.hide();
                }
            }.bind(this);
            document.addEventListener('click', callback);
        }
    },

    /**
     * Hides the menu.
     *
     * @public
     */
    hide: function () {
        if (this.element && this._container && this._outline) {
            var items = this.element.querySelectorAll('.u-menu-item');

            // Remove all transition delays; menu items fade out concurrently.
            for (var i = 0; i < items.length; i++) {
                items[i].style.transitionDelay = null;
            }

            // Measure the inner element.
            var rect = this.element.getBoundingClientRect();
            var height = rect.height;
            var width = rect.width;

            // Turn on animation, and apply the final clip. Also make invisible.
            // This triggers the transitions.
            u.addClass(this.element, 'is-animating');
            this._applyClip(height, width);
            u.removeClass(this._container, 'is-visible');

            // Clean up after the animation is complete.
            this._addAnimationEndListener();
        }
    },
    /**
     * Displays or hides the menu, depending on current state.
     *
     * @public
     */
    toggle: function (evt) {
        if (u.hasClass(this._container, 'is-visible')) {
            this.hide();
        } else {
            this.show(evt);
        }
    },


});


u.compMgr.regComp({
    comp: u.Menu,
    compAsString: 'u.Menu',
    css: 'u-menu'
})


u.MDLayout = u.BaseComponent.extend({
	_CssClasses: {
	MASTER: 'u-mdlayout-master',
	DETAIL: 'u-mdlayout-detail',
	PAGE: 'u-mdlayout-page',
	PAGE_HEADER: 'u-mdlayout-page-header',
	PAGE_SECTION: 'u-mdlayout-page-section',
	PAGE_FOOTER: 'u-mdlayout-page-footer'
},
	init: function(){
		this.browser = _getBrowserInfo();
		var me = this;
		this.minWidth = 600;
		//this.options = $.extend({}, MDLayout.DEFAULTS, options)
		//this.$element.css('position','relative').css('width','100%').css('height','100%').css('overflow','hidden')
		this._master =  this.element.querySelector('.' + this._CssClasses.MASTER);
		this._detail =  this.element.querySelector('.' + this._CssClasses.DETAIL);

		//this.$master.css('float','left').css('height','100%')
		//this.$detail.css('height','100%').css('overflow','hidden').css('position','relative');

		this.masterWidth = this._master.offsetWidth;
		this.detailWidth = this._detail.offsetWidth;
		this.mPages = this._master.querySelectorAll('.' + this._CssClasses.PAGE);
		this.dPages = this._detail.querySelectorAll('.' + this._CssClasses.PAGE);
		this.mPageMap = {};
		this.dPageMap = {};
		this.initPages(this.mPages, 'master');
		this.initPages(this.dPages, 'detail');

		this.mHistory = [];
		this.dHistory = [];
		this.isNarrow = null;
		this.response();
		u.on(window, 'resize', function(){
			me.response();
		})
	},

initPages: function(pages, type){
	var pageMap,pWidth;
	if (type === 'master'){
		pageMap = this.mPageMap;
		pWidth = this.masterWidth;
	}else{
		pageMap = this.dPageMap;
		pWidth = this.detailWidth;
	}
	for (var i = 0; i< pages.length; i++){
		var pid = pages[i].getAttribute('id');
		if (!pid)
			throw new Error('u-mdlayout-page mast have id attribute')
		pageMap[pid] = pages[i];
		if (i === 0){
			if (type === 'master')
				this.current_m_pageId = pid;
			else
				this.current_d_pageId = pid;
			u.addClass(pages[i],'current');
			//pages[i].style.transform = 'translate3d('+ pWidth +'px,0,0)';
			pages[i].style.transform = 'translate3d(0,0,0)';
		}else{
			pages[i].style.transform = 'translate3d('+ pWidth +'px,0,0)';
		}
		if (this.browser.ie && this.browser.ie < 9){
			u.addClass(pages[i],'let-ie9');
		}
	}
},




//	MDLayout.DEFAULTS = {
//		minWidth: 600,
////		masterFloat: false,
//		afterNarrow:function(){},
//		afterUnNarrow:function(){},
//		afterMasterGo:function(pageId){},
//		afterMasterBack:function(pageId){},
//		afterDetailGo:function(pageId){},
//		afterDetailBack:function(pageId){}
//	}

response: function() {
	var totalWidth = this.element.offsetWidth;
	if (totalWidth < this.minWidth){
		if (this.isNarrow == null || this.isNarrow == false)
			this.isNarrow = true
		this.hideMaster()
	}
	else{
		if (this.isNarrow == null || this.isNarrow == true)
			this.isNarrow = false
		this.showMaster()
	}
	this.calcWidth();

},

calcWidth: function(){
	if (!this.browser.ie || this.browser.ie > 8){
		this.detailWidth = this._detail.offsetWidth;
		this.masterWidth = this._master.offsetWidth;
		//TODO this.mHistory中的panel应该置为-值
		for (var i = 0; i<this.dPages.length; i++){
			var pid = this.dPages[i].getAttribute('id');
			if (pid !== this.current_d_pageId){
				this.dPages[i].style.transform = 'translate3d('+ this.detailWidth +'px,0,0)';
			}
		}
		//this.$detail.find('[data-role="page"]').css('transform','translate3d('+ this.detailWidth +'px,0,0)')
		//this.$detail.find('#' + this.current_d_pageId).css('transform','translate3d(0,0,0)')
	}

},

mGo: function(pageId) {
	if (this.current_m_pageId == pageId) return;
	this.mHistory.push(this.current_m_pageId);
	_hidePage(this.mPageMap[this.current_m_pageId],this,'-' + this.masterWidth)
	this.current_m_pageId = pageId
	_showPage(this.mPageMap[this.current_m_pageId],this)
},

mBack: function() {
	if (this.mHistory.length == 0) return;
	_hidePage(this.mPageMap[this.current_m_pageId],this,this.masterWidth)
	this.current_m_pageId = this.mHistory.pop();
	_showPage(this.mPageMap[this.current_m_pageId],this)
},

dGo: function(pageId) {
	if (this.current_d_pageId == pageId) return;
	this.dHistory.push(this.current_d_pageId);
	_hidePage(this.dPageMap[this.current_d_pageId],this,'-' + this.detailWidth)
	this.current_d_pageId = pageId
	_showPage(this.dPageMap[this.current_d_pageId],this)
},

dBack: function() {
	if (this.dHistory.length == 0) return;
	_hidePage(this.dPageMap[this.current_d_pageId],this,this.detailWidth)
	this.current_d_pageId = this.dHistory.pop();
	_showPage(this.dPageMap[this.current_d_pageId],this)
},

showMaster: function() {
	if (this.browser.ie && this.browser.ie < 9)
		this._master.style.display = 'block';
	else{
		this._master.style.transform = 'translate3d(0,0,0)';
	}
	if (!this.isNarrow)
		this._master.style.position = 'relative';
},

hideMaster: function() {
	if (this._master.offsetLeft < 0 || this._master.style.display == 'none')
		return;
	if (this.browser.ie && this.browser.ie < 9)
		this._master.style.display = 'none';
	else{
		this._master.style.transform = 'translate3d(-'+ this.masterWidth +'px,0,0)';
	}
	this._master.style.position = 'absolute';
	this._master.style.zIndex = 5;
	this.calcWidth()
}
});

/**
 * masterFloat属性只有在宽屏下起作用，为true时，master层浮动于detail层之上
 *
 */
//	MDLayout.fn.setMasterFloat = function(float){
//		this.masterFloat = float;
//
//	}

function _getBrowserInfo(){
	var browser = {};
	var ua = navigator.userAgent.toLowerCase();
	var s;
	(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? browser.ie = parseInt(s[1]) :
			(s = ua.match(/msie ([\d.]+)/)) ? browser.ie = s[1] :
					(s = ua.match(/firefox\/([\d.]+)/)) ? browser.firefox = s[1] :
							(s = ua.match(/chrome\/([\d.]+)/)) ? browser.chrome = s[1] :
									(s = ua.match(/opera.([\d.]+)/)) ? browser.opera = s[1] :
											(s = ua.match(/version\/([\d.]+).*safari/)) ? browser.safari = s[1] : 0;
	return browser;
}

function _showPage(el,me){
	u.addClass(el,'.current');
	if (!(me.browser.ie && me.browser.ie < 9))
		el.style.transform = 'translate3d(0,0,0)';
}

function _hidePage(el,me,width){
	u.removeClass(el,'current');
	if (!(me.browser.ie && me.browser.ie < 9))
		el.style.transform = 'translate3d('+ width +'px,0,0)';
}


u.compMgr.regComp({
	comp: u.MDLayout,
	compAsString: 'u.MDLayout',
	css: 'u-mdlayout'
});



u.Tabs = u.BaseComponent.extend({
	_Constant: {},
	_CssClasses: {
		TAB_CLASS: 'u-tabs__tab',
		PANEL_CLASS: 'u-tabs__panel',
		ACTIVE_CLASS: 'is-active',
		UPGRADED_CLASS: 'is-upgraded',

		U_JS_RIPPLE_EFFECT: 'u-js-ripple-effect',
		U_RIPPLE_CONTAINER: 'u-tabs__ripple-container',
		U_RIPPLE: 'u-ripple',
		U_JS_RIPPLE_EFFECT_IGNORE_EVENTS: 'u-js-ripple-effect--ignore-events'
	},

	/**
	 * Handle clicks to a tabs component
	 *
	 * @private
	 */
	initTabs_: function() {
			this.element.classList.add(
				this._CssClasses.U_JS_RIPPLE_EFFECT_IGNORE_EVENTS);

		// Select element tabs, document panels
		this.tabs_ = this.element.querySelectorAll('.' + this._CssClasses.TAB_CLASS);
		this.panels_ =
			this.element.querySelectorAll('.' + this._CssClasses.PANEL_CLASS);

		// Create new tabs for each tab element
		for (var i = 0; i < this.tabs_.length; i++) {
			new Tab(this.tabs_[i], this);
		}

		this.element.classList.add(this._CssClasses.UPGRADED_CLASS);
	},

	/**
	 * Reset tab state, dropping active classes
	 *
	 * @private
	 */
	resetTabState_: function() {
		for (var k = 0; k < this.tabs_.length; k++) {
			this.tabs_[k].classList.remove(this._CssClasses.ACTIVE_CLASS);
		}
	},

	/**
	 * Reset panel state, droping active classes
	 *
	 * @private
	 */
	resetPanelState_: function() {
		for (var j = 0; j < this.panels_.length; j++) {
			this.panels_[j].classList.remove(this._CssClasses.ACTIVE_CLASS);
		}
	},

	/**
	 * Initialize element.
	 */
	init: function() {
		if (this.element) {
			this.initTabs_();
		}
	}
});

/**
 * Constructor for an individual tab.
 *
 * @constructor
 * @param {Element} tab The HTML element for the tab.
 * @param {Tabs} ctx The Tabs object that owns the tab.
 */
function Tab(tab, ctx) {
	if (tab) {
			var rippleContainer = document.createElement('span');
			rippleContainer.classList.add(ctx._CssClasses.U_RIPPLE_CONTAINER);
			rippleContainer.classList.add(ctx._CssClasses.U_JS_RIPPLE_EFFECT);
			var ripple = document.createElement('span');
			ripple.classList.add(ctx._CssClasses.U_RIPPLE);
			rippleContainer.appendChild(ripple);
			tab.appendChild(rippleContainer);

      tab.ripple = new u.Ripple(tab)


		tab.addEventListener('click', function(e) {
			e.preventDefault();
			var href = tab.href.split('#')[1];
			var panel = ctx.element.querySelector('#' + href);
			ctx.resetTabState_();
			ctx.resetPanelState_();
			tab.classList.add(ctx._CssClasses.ACTIVE_CLASS);
			panel.classList.add(ctx._CssClasses.ACTIVE_CLASS);
		});

	}
}


u.compMgr.regComp({
	comp: u.Tabs,
	compAsString: 'u.Tabs',
	css: 'u-tabs'
})
u.Checkbox = u.BaseComponent.extend({
    _Constant: {
        TINY_TIMEOUT: 0.001
    },

    _CssClasses: {
        INPUT: 'u-checkbox-input',
        BOX_OUTLINE: 'u-checkbox-outline',
        FOCUS_HELPER: 'u-checkbox-focus-helper',
        TICK_OUTLINE: 'u-checkbox-tick-outline',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_CHECKED: 'is-checked',
        IS_UPGRADED: 'is-upgraded'
    },
    init: function () {
        this._inputElement = this.element.querySelector('input');

        var boxOutline = document.createElement('span');
        u.addClass(boxOutline, this._CssClasses.BOX_OUTLINE);

        var tickContainer = document.createElement('span');
        u.addClass(tickContainer, this._CssClasses.FOCUS_HELPER)

        var tickOutline = document.createElement('span');
        u.addClass(tickOutline, this._CssClasses.TICK_OUTLINE);

        boxOutline.appendChild(tickOutline);

        this.element.appendChild(tickContainer);
        this.element.appendChild(boxOutline);

        //if (this.element.classList.contains(this._CssClasses.RIPPLE_EFFECT)) {
        //  u.addClass(this.element,this._CssClasses.RIPPLE_IGNORE_EVENTS);
        this.rippleContainerElement_ = document.createElement('span');
        //this.rippleContainerElement_.classList.add(this._CssClasses.RIPPLE_CONTAINER);
        //this.rippleContainerElement_.classList.add(this._CssClasses.RIPPLE_EFFECT);
        //this.rippleContainerElement_.classList.add(this._CssClasses.RIPPLE_CENTER);
        this.boundRippleMouseUp = this._onMouseUp.bind(this);
        this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);

        //var ripple = document.createElement('span');
        //ripple.classList.add(this._CssClasses.RIPPLE);

        //this.rippleContainerElement_.appendChild(ripple);
        this.element.appendChild(this.rippleContainerElement_);
        new URipple(this.rippleContainerElement_);

        //}
        this.boundInputOnChange = this._onChange.bind(this);
        this.boundInputOnFocus = this._onFocus.bind(this);
        this.boundInputOnBlur = this._onBlur.bind(this);
        this.boundElementMouseUp = this._onMouseUp.bind(this);
        this._inputElement.addEventListener('change', this.boundInputOnChange);
        //this._inputElement.addEventListener('focus', this.boundInputOnFocus);
        //this._inputElement.addEventListener('blur', this.boundInputOnBlur);
        //this.element.addEventListener('mouseup', this.boundElementMouseUp);
        if (!u.hasClass(this.element, 'only-style')){
            u.on(this.element, 'click', function(){
                this.toggle();
            }.bind(this));
        }


        this._updateClasses();
        u.addClass(this.element, this._CssClasses.IS_UPGRADED);

    },

    _onChange: function (event) {
        this._updateClasses();
        this.trigger('change', {isChecked:this._inputElement.checked});
    },

    _onFocus: function () {
        u.addClass(this.element, this._CssClasses.IS_FOCUSED)
    },

    _onBlur: function () {
        u.removeClass(this.element, this._CssClasses.IS_FOCUSED)
    },

    _onMouseUp: function (event) {
        this._blur();
    },

    /**
     * Handle class updates.
     *
     * @private
     */
    _updateClasses: function () {
        this.checkDisabled();
        this.checkToggleState();
    },

    /**
     * Add blur.
     *
     * @private
     */
    _blur: function () {
        // TODO: figure out why there's a focus event being fired after our blur,
        // so that we can avoid this hack.
        window.setTimeout(function () {
            this._inputElement.blur();
        }.bind(this), /** @type {number} */ (this._Constant.TINY_TIMEOUT));
    },

// Public methods.

    /**
     * Check the inputs toggle state and update display.
     *
     * @public
     */
    checkToggleState: function () {
        if (this._inputElement.checked) {
            u.addClass(this.element, this._CssClasses.IS_CHECKED)
        } else {
            u.removeClass(this.element, this._CssClasses.IS_CHECKED)
        }
    },


    /**
     * Check the inputs disabled state and update display.
     *
     * @public
     */
    checkDisabled: function () {
        if (this._inputElement.disabled) {
            u.addClass(this.element, this._CssClasses.IS_DISABLED)
        } else {
            u.removeClass(this.element, this._CssClasses.IS_DISABLED)
        }
    },


    isChecked: function(){
        //return u.hasClass(this.element,this._CssClasses.IS_CHECKED);
        return this._inputElement.checked
    },

    toggle: function(){
        //return;
        if (this.isChecked()){
            this.uncheck()
        }else{
            this.check();
        }
    },

    /**
     * Disable checkbox.
     *
     * @public
     */
    disable: function () {
        this._inputElement.disabled = true;
        this._updateClasses();
    },


    /**
     * Enable checkbox.
     *
     * @public
     */
    enable: function () {
        this._inputElement.disabled = false;
        this._updateClasses();
    },


    /**
     * Check checkbox.
     *
     * @public
     */
    check: function () {
        this._inputElement.checked = true;
        this._updateClasses();
    },


    /**
     * Uncheck checkbox.
     *
     * @public
     */
    uncheck: function () {
        this._inputElement.checked = false;
        this._updateClasses();
    }


});


if (u.compMgr)
    u.compMgr.regComp({
        comp: u.Checkbox,
        compAsString: 'u.Checkbox',
        css: 'u-checkbox'
    })

u.Radio = u.BaseComponent.extend({
    Constant_: {
        TINY_TIMEOUT: 0.001
    },

    _CssClasses: {
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_CHECKED: 'is-checked',
        IS_UPGRADED: 'is-upgraded',
        JS_RADIO: 'u-radio',
        RADIO_BTN: 'u-radio-button',
        RADIO_OUTER_CIRCLE: 'u-radio-outer-circle',
        RADIO_INNER_CIRCLE: 'u-radio-inner-circle'
    },

    init: function () {
        this._btnElement = this.element.querySelector('input');

        this._boundChangeHandler = this._onChange.bind(this);
        this._boundFocusHandler = this._onChange.bind(this);
        this._boundBlurHandler = this._onBlur.bind(this);
        this._boundMouseUpHandler = this._onMouseup.bind(this);

        var outerCircle = document.createElement('span');
        u.addClass(outerCircle, this._CssClasses.RADIO_OUTER_CIRCLE);

        var innerCircle = document.createElement('span');
        u.addClass(innerCircle, this._CssClasses.RADIO_INNER_CIRCLE);

        this.element.appendChild(outerCircle);
        this.element.appendChild(innerCircle);

        var rippleContainer;
        //if (this.element.classList.contains( this._CssClasses.RIPPLE_EFFECT)) {
        //  u.addClass(this.element,this._CssClasses.RIPPLE_IGNORE_EVENTS);
        rippleContainer = document.createElement('span');
        //rippleContainer.classList.add(this._CssClasses.RIPPLE_CONTAINER);
        //rippleContainer.classList.add(this._CssClasses.RIPPLE_EFFECT);
        //rippleContainer.classList.add(this._CssClasses.RIPPLE_CENTER);
        rippleContainer.addEventListener('mouseup', this._boundMouseUpHandler);

        //var ripple = document.createElement('span');
        //ripple.classList.add(this._CssClasses.RIPPLE);

        //rippleContainer.appendChild(ripple);
        this.element.appendChild(rippleContainer);
        new URipple(rippleContainer)
        //}

        this._btnElement.addEventListener('change', this._boundChangeHandler);
        this._btnElement.addEventListener('focus', this._boundFocusHandler);
        this._btnElement.addEventListener('blur', this._boundBlurHandler);
        this.element.addEventListener('mouseup', this._boundMouseUpHandler);

        this._updateClasses();
        u.addClass(this.element, this._CssClasses.IS_UPGRADED);

    },

    _onChange: function (event) {
        // Since other radio buttons don't get change events, we need to look for
        // them to update their classes.
        var radios = document.getElementsByClassName(this._CssClasses.JS_RADIO);
        for (var i = 0; i < radios.length; i++) {
            var button = radios[i].querySelector('.' + this._CssClasses.RADIO_BTN);
            // Different name == different group, so no point updating those.
            if (button.getAttribute('name') === this._btnElement.getAttribute('name')) {
                radios[i]['ucomp']._updateClasses();
            }
        }
        this.trigger('change', {isChecked:this._btnElement.checked});
    },

    /**
     * Handle focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _onFocus: function (event) {
        u.addClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    /**
     * Handle lost focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _onBlur: function (event) {
        u.removeClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    /**
     * Handle mouseup.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _onMouseup: function (event) {
        this._blur();
    },

    /**
     * Update classes.
     *
     * @private
     */
    _updateClasses: function () {
        this.checkDisabled();
        this.checkToggleState();
    },

    /**
     * Add blur.
     *
     * @private
     */
    _blur: function () {

        // TODO: figure out why there's a focus event being fired after our blur,
        // so that we can avoid this hack.
        window.setTimeout(function () {
            this._btnElement.blur();
        }.bind(this), /** @type {number} */ (this.Constant_.TINY_TIMEOUT));
    },

// Public methods.

    /**
     * Check the components disabled state.
     *
     * @public
     */
    checkDisabled: function () {
        if (this._btnElement.disabled) {
            u.addClass(this.element, this._CssClasses.IS_DISABLED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_DISABLED);
        }
    },


    /**
     * Check the components toggled state.
     *
     * @public
     */
    checkToggleState: function () {
        if (this._btnElement.checked) {
            u.addClass(this.element, this._CssClasses.IS_CHECKED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_CHECKED);
        }
    },


    /**
     * Disable radio.
     *
     * @public
     */
    disable: function () {
        this._btnElement.disabled = true;
        this._updateClasses();
    },

    /**
     * Enable radio.
     *
     * @public
     */
    enable: function () {
        this._btnElement.disabled = false;
        this._updateClasses();
    },


    /**
     * Check radio.
     *
     * @public
     */
    check: function () {
        this._btnElement.checked = true;
        this._updateClasses();
    },


    uncheck: function () {
        this._btnElement.checked = false;
        this._updateClasses();
    }


});


u.compMgr.regComp({
    comp: u.Radio,
    compAsString: 'u.Radio',
    css: 'u-radio'
});

u.Switch = u.BaseComponent.extend({
    _Constant: {
        TINY_TIMEOUT: 0.001
    },

    _CssClasses: {
        INPUT: 'u-switch-input',
        TRACK: 'u-switch-track',
        THUMB: 'u-switch-thumb',
        FOCUS_HELPER: 'u-switch-focus-helper',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_CHECKED: 'is-checked'
    },

    init: function () {
        this._inputElement = this.element.querySelector('.' + this._CssClasses.INPUT);

        var track = document.createElement('div');
        u.addClass(track, this._CssClasses.TRACK);

        var thumb = document.createElement('div');
        u.addClass(thumb, this._CssClasses.THUMB);

        var focusHelper = document.createElement('span');
        u.addClass(focusHelper, this._CssClasses.FOCUS_HELPER);

        thumb.appendChild(focusHelper);

        this.element.appendChild(track);
        this.element.appendChild(thumb);

        this.boundMouseUpHandler = this._onMouseUp.bind(this);

        //if (this.element.classList.contains(this._CssClasses.RIPPLE_EFFECT)) {
        //  u.addClass(this.element,this._CssClasses.RIPPLE_IGNORE_EVENTS);
        this._rippleContainerElement = document.createElement('span');
        //this._rippleContainerElement.classList.add(this._CssClasses.RIPPLE_CONTAINER);
        //this._rippleContainerElement.classList.add(this._CssClasses.RIPPLE_EFFECT);
        //this._rippleContainerElement.classList.add(this._CssClasses.RIPPLE_CENTER);
        this._rippleContainerElement.addEventListener('mouseup', this.boundMouseUpHandler);

        //var ripple = document.createElement('span');
        //ripple.classList.add(this._CssClasses.RIPPLE);

        //this._rippleContainerElement.appendChild(ripple);
        this.element.appendChild(this._rippleContainerElement);
        new URipple(this._rippleContainerElement);
        //}

        this.boundChangeHandler = this._onChange.bind(this);
        this.boundFocusHandler = this._onFocus.bind(this);
        this.boundBlurHandler = this._onBlur.bind(this);

        this._inputElement.addEventListener('change', this.boundChangeHandler);
        this._inputElement.addEventListener('focus', this.boundFocusHandler);
        this._inputElement.addEventListener('blur', this.boundBlurHandler);
        this.element.addEventListener('mouseup', this.boundMouseUpHandler);

        this._updateClasses();
        u.addClass(this.element, 'is-upgraded');

    },

    _onChange: function (event) {
        this._updateClasses();
        this.trigger('change', {isChecked:this._inputElement.checked});
    },

    _onFocus: function (event) {
        u.addClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    _onBlur: function (event) {
        u.removeClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    _onMouseUp: function (event) {
        this._blur();
    },

    _updateClasses: function () {
        this.checkDisabled();
        this.checkToggleState();
    },

    _blur: function () {
        // TODO: figure out why there's a focus event being fired after our blur,
        // so that we can avoid this hack.
        window.setTimeout(function () {
            this._inputElement.blur();
        }.bind(this), /** @type {number} */ (this._Constant.TINY_TIMEOUT));
    },

// Public methods.

    checkDisabled: function () {
        if (this._inputElement.disabled) {
            u.addClass(this.element, this._CssClasses.IS_DISABLED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_DISABLED);
        }
    },


    checkToggleState: function () {
        if (this._inputElement.checked) {
            u.addClass(this.element, this._CssClasses.IS_CHECKED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_CHECKED);
        }
    },


    //disable: function () {
    //    this._inputElement.disabled = true;
    //    this._updateClasses();
    //},
    //
    //
    //enable: function () {
    //    this._inputElement.disabled = false;
    //    this._updateClasses();
    //},
    //
    //
    //on: function () {
    //    this._inputElement.checked = true;
    //    this._updateClasses();
    //},
    //
    //
    //off: function () {
    //    this._inputElement.checked = false;
    //    this._updateClasses();
    //}


});

u.compMgr.regComp({
    comp: u.Switch,
    compAsString: 'u.Switch',
    css: 'u-switch'
});

u.Loading = u.BaseComponent.extend({
  _Constant: {
  U_LOADING_LAYER_COUNT: 4
},

_CssClasses: {
  U_LOADING_LAYER: 'u-loading-layer',
  U_LOADING_CIRCLE_CLIPPER: 'u-loading-circle-clipper',
  U_LOADING_CIRCLE: 'u-loading-circle',
  U_LOADING_GAP_PATCH: 'u-loading-gap-patch',
  U_LOADING_LEFT: 'u-loading-left',
  U_LOADING_RIGHT: 'u-loading-right'
},

  init: function(){
    for (var i = 1; i <= this._Constant.U_LOADING_LAYER_COUNT; i++) {
      this.createLayer(i);
    }
    u.addClass(this.element, 'is-upgraded');

  },

createLayer: function(index) {
  var layer = document.createElement('div');
  u.addClass(layer, this._CssClasses.U_LOADING_LAYER);
  u.addClass(layer, this._CssClasses.U_LOADING_LAYER + '-' + index);

  var leftClipper = document.createElement('div');
  u.addClass(leftClipper, this._CssClasses.U_LOADING_CIRCLE_CLIPPER);
  u.addClass(leftClipper, this._CssClasses.U_LOADING_LEFT);

  var gapPatch = document.createElement('div');
  u.addClass(gapPatch,this._CssClasses.U_LOADING_GAP_PATCH);

  var rightClipper = document.createElement('div');
  u.addClass(rightClipper,this._CssClasses.U_LOADING_CIRCLE_CLIPPER);
  u.addClass(rightClipper,this._CssClasses.U_LOADING_RIGHT)

  var circleOwners = [leftClipper, gapPatch, rightClipper];

  for (var i = 0; i < circleOwners.length; i++) {
    var circle = document.createElement('div');
    u.addClass(circle,this._CssClasses.U_LOADING_CIRCLE);
    circleOwners[i].appendChild(circle);
  }

  layer.appendChild(leftClipper);
  layer.appendChild(gapPatch);
  layer.appendChild(rightClipper);

  this.element.appendChild(layer);
},


stop: function() {
  u.removeClass(this.element,'is-active');
},



start: function() {
  u.addClass(this.element,'is-active');
}


});


u.compMgr.regComp({
  comp: u.Loading,
  compAsString: 'u.Loading',
  css: 'u-loading'
});




u.showLoading = function(op) {
	var htmlStr = '<div class="alert alert-waiting"><i class="fa fa-spinner fa-spin"></i></div>';
	document.body.appendChild(u.makeDOM(htmlStr));
	htmlStr = '<div class="alert-backdrop" role="waiting-backdrop"></div>';
	document.body.appendChild(u.makeDOM(htmlStr));
}

u.hideLoading = function() {
	var divs = document.querySelectorAll('.alert,.alert-backdrop');
	for(var i = 0;i < divs.length;i++){
		document.body.removeChild(divs[i]);
	}
}	
    
//兼容性保留
u.showWaiting = u.showLoading
u.removeWaiting = u.hideLoading
u.Progress = u.BaseComponent.extend({
	_Constant: {},
	_CssClasses: {
		INDETERMINATE_CLASS: 'u-progress__indeterminate'
	},
	setProgress: function(p) {
		if (this.element.classList.contains(this._CssClasses.INDETERMINATE_CLASS)) {
			return;
		}

		this.progressbar_.style.width = p + '%';
		return this;
	},
	setBuffer: function(p) {
		this.bufferbar_.style.width = p + '%';
		this.auxbar_.style.width = (100 - p) + '%';
		return this;
	},

	init: function() {
		var el = document.createElement('div');
		el.className = 'progressbar bar bar1';
		this.element.appendChild(el);
		this.progressbar_ = el;

		el = document.createElement('div');
		el.className = 'bufferbar bar bar2';
		this.element.appendChild(el);
		this.bufferbar_ = el;

		el = document.createElement('div');
		el.className = 'auxbar bar bar3';
		this.element.appendChild(el);
		this.auxbar_ = el;

		this.progressbar_.style.width = '0%';
		this.bufferbar_.style.width = '100%';
		this.auxbar_.style.width = '0%';

		this.element.classList.add('is-upgraded');
	}

});


u.compMgr.regComp({
	comp: u.Progress,
	compAsString: 'u.Progress',
	css: 'u-progress'
})
/**
 * Created by dingrf on 2015-11-18.
 */
'use strict';
u.messageTemplate ='<div class="u-message"><button type="button" class="u-msg-close u-button floating  mini"><span class="">X</span></button>{msg}</div>';

u.showMessage = function(options) {
    var msg,position, width, height, showSeconds,msgType, template;
    if (typeof options === 'string'){
        options = {msg:options};
    }
    msg = options['msg'] || "";
    position = options['position'] || "bottom-right";  //center. top-left, top-center, top-right, bottom-left, bottom-center, bottom-right,
    //TODO 后面改规则：没设宽高时，自适应
    width = options['width'] || "300px";
    height = options['height'] || "100px";
    showSeconds = parseInt(options['showSeconds']) || 0;
    msgType = options['msgType'] || 'info';
    template = options['template'] || u.messageTemplate;

    template = template.replace('{msg}', msg);
    var msgDom = u.makeDOM(template);
    u.addClass(msgDom,'u-' + msgType);
    //msgDom.style.width = width;
   // msgDom.style.height = height;
   // msgDom.style.lineHeight = height;
//    if (position == 'bottom-right'){
//        msgDom.style.right = '10px';
//        msgDom.style.bottom = '10px';
//    }

    var closeBtn = msgDom.querySelector('.u-msg-close');
    //new u.Button({el:closeBtn});
    u.on(closeBtn, 'click', function(){
        u.removeClass(msgDom,"active")
        setTimeout(function(){
          document.body.removeChild(msgDom);
        },500)  
    })
    document.body.appendChild(msgDom);
    
    if (showSeconds > 0 ){
        setTimeout(function(){
            closeBtn.click();
        },showSeconds* 1000)
    }
    setTimeout(function(){
            u.addClass(msgDom,"active")
    },showSeconds* 1)


}


u.showMessageDialog = u.showMessage;
/**
 * Created by dingrf on 2015-11-19.
 */

/**
 * 制作遮罩层
 * @param element
 * @returns {Element}
 */
u.makeModal = function(element){
    var overlayDiv = document.createElement('div');
    u.addClass(overlayDiv, 'u-overlay');
    overlayDiv.style.zIndex = u.getZIndex();
    document.body.appendChild(overlayDiv)
    element.style.zIndex = u.getZIndex();
    u.on(overlayDiv, 'click', function(e){
        u.stopEvent(e);
    })
    return overlayDiv;
}
/**
 * Created by dingrf on 2015-11-19.
 */

'use strict';

/**
 * 消息提示框
 * @param options
 */

u.messageDialogTemplate = '<div class="u-msg-dialog">'+
                            '<div class="u-msg-content">'+
                                '<h4>{title}</h4>' +
                                '<p>{msg}</p>'+
                            '</div>'+
                            '<div class="u-msg-footer"><button class="u-msg-button u-button">{btnText}</button></div>'+
                           '</div>';

u.messageDialog = function(options){
    var title,msg, btnText,template;
    if (typeof options === 'string'){
        options = {msg:options};
    }
    msg = options['msg'] || "";
    title = options['title'] || "提示";
    btnText = options['btnText'] || "确定";
    template = options['template'] || u.messageDialogTemplate;

    template = template.replace('{msg}', msg);
    template = template.replace('{title}', title);
    template = template.replace('{btnText}', btnText);

    var msgDom = u.makeDOM(template);

    var closeBtn = msgDom.querySelector('.u-msg-button');
    new u.Button({el:closeBtn});
    u.on(closeBtn, 'click', function(){
        document.body.removeChild(msgDom);
        document.body.removeChild(overlayDiv);
    })
    var overlayDiv = u.makeModal(msgDom);
    document.body.appendChild(msgDom);

};



/**
 * Created by dingrf on 2015-11-19.
 */

/**
 * 确认框
 */
u.confirmDialogTemplate = '<div class="u-msg-dialog">'+
    '<div class="u-msg-content">'+
    '<h4>{title}</h4>' +
    '<p>{msg}</p>'+
    '</div>'+
    '<div class="u-msg-footer"><button class="u-msg-ok u-button">{okText}</button><button class="u-msg-cancel u-button">{cancelText}</button></div>'+
    '</div>';

u.confirmDialog = function(options){
    var title,msg, okText,cancelText,template,onOk,onCancel;
    msg = options['msg'] || "";
    title = options['title'] || "确认";
    okText = options['okText'] || "确定";
    cancelText = options['cancelText'] || "取消";
    onOk = options['onOk'] || function(){};
    onCancel = options['onCancel'] || function(){};
    template = options['template'] || u.confirmDialogTemplate;

    template = template.replace('{msg}', msg);
    template = template.replace('{title}', title);
    template = template.replace('{okText}', okText);
    template = template.replace('{cancelText}', cancelText);

    var msgDom = u.makeDOM(template);
    var okBtn = msgDom.querySelector('.u-msg-ok');
    var cancelBtn = msgDom.querySelector('.u-msg-cancel');
    new u.Button({el:okBtn});
    new u.Button({el:cancelBtn});
    u.on(okBtn, 'click', function(){
        onOk();
        document.body.removeChild(msgDom);
        document.body.removeChild(overlayDiv);
    })
    u.on(cancelBtn, 'click', function(){
        onCancel();
        document.body.removeChild(msgDom);
        document.body.removeChild(overlayDiv);
    })
    var overlayDiv = u.makeModal(msgDom);
    document.body.appendChild(msgDom);

};

/**
 * Created by dingrf on 2015-11-19.
 */

/**
 * 三按钮确认框（是 否  取消）
 */
u.threeBtnDialog = function(){

}
/**
 * Created by dingrf on 2015-11-19.
 */

'use strict';

/**
 * 提示框
 * @param options
 */

u.dialogTemplate = '<div class="u-msg-dialog" id="{id}" style="{width}{height}">'+
                        '{close}'+
                        '{content}'+
                    '</div>';

var dialogMode = function(options){
    if (typeof options === 'string'){
        options = {content:options};
    }
    var defaultOptions = {
    	id: '',
    	content: '',
    	hasCloseMenu: true,
    	template: u.dialogTemplate,
    	width: '',
    	height: ''
    }
    
    options = u.extend(defaultOptions,options);
    this.id = options['id'];
    this.hasCloseMenu = options['hasCloseMenu'];
    this.content = options['content'];
    this.template = options['template'];
    this.width = options['width'];
    this.height = options['height'];
    this.create();
}

dialogMode.prototype.create = function(){
	var closeStr = '';
	var oThis = this;
	if(this.hasCloseMenu){
    	var closeStr = '<div class="u-msg-close"> <span aria-hidden="true">&times;</span></div>';
    }
	var templateStr = this.template.replace('{id}', this.id);
    templateStr = templateStr.replace('{close}', closeStr);
    templateStr = templateStr.replace('{width}', this.width ? 'width:' + this.width + ';' : '');
    templateStr = templateStr.replace('{height}', this.height ? 'height:' + this.height + ';' : '');
	
	this.contentDom = document.querySelector(this.content); // 
	if(this.contentDom){ // msg第一种方式传入选择器，如果可以查找到对应dom节点，则创建整体dialog之后在msg位置添加dom元素
		templateStr = templateStr.replace('{content}', '');
		this.templateDom = u.makeDOM(templateStr);
		this.contentDomParent = this.contentDom.parentNode;
		this.contentDom.style.display = 'block';
		this.templateDom.appendChild(this.contentDom);
	}else{ // 如果查找不到对应dom节点，则按照字符串处理，直接将msg拼到template之后创建dialog
		var contentStr = '<p>' + this.content + '</p>';
		templateStr = templateStr.replace('{content}', content);
		this.templateDom = u.makeDOM(templateStr);
	}
	this.overlayDiv = u.makeModal(this.templateDom);
	if(this.hasCloseMenu){
		this.closeDiv = this.templateDom.querySelector('.u-msg-close');
		u.on(this.closeDiv,'click',function(){
			oThis.close();
		});
	}
	
    document.body.appendChild(this.templateDom);
};

dialogMode.prototype.close = function(){
	if(this.contentDom){
		this.contentDom.style.display = 'none';
		this.contentDomParent.appendChild(this.contentDom);
	}
	document.body.removeChild(this.templateDom);
    document.body.removeChild(this.overlayDiv);
}

u.dialog = function(options){
	return new dialogMode(options);
}

u.Combobox = u.BaseComponent.extend({
		DEFAULTS : {
			dataSource:{},
			mutil: false,
			enable: true,
			single: true,
			onSelect: function() {}
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.items = [];
			//this.oLis = [];
			this.mutilPks = [];
			this.oDiv = null;
			Object.defineProperty(element, 'value', {
				get: function() {

					return this.trueValue;
				},
				set: function(pk) {

					var items = self.items;
					//var oLis = self.oLis;
					var oLis = self.oDiv.childNodes;

					if (self.options.single == "true" || self.options.single == true ) {

						for (var i = 0, length = items.length; i < length; i++) {

							var ipk = items[i].pk;
							if (ipk == pk) {
								this.innerHTML = items[i].name;
								this.trueValue = pk;
								break;
							} else {

								this.trueValue = '';
								this.innerHTML = '';
							}

						}

					} else if (self.options.mutil == "true" || self.options.mutil == true) {
						
						if(!u.isArray(pk) ){
							if(typeof pk == "string" && pk !== ""){                   		
								pk = pk.split(',');
								self.mutilPks = pk;
							}else{
								return
							}
						}
						
						if (self.mutilPks.length == 0) {
							self.mutilPks = pk;
						}

						this.innerHTML = '';
						var valueArr = [];

						for (var j = 0; j < pk.length; j++) {

							for (var i = 0, length = oLis.length; i < length; i++) {
								var ipk = oLis[i].item.pk;
								if (pk[j] == ipk) {

									valueArr.push(pk[j]);

									oLis[i].style.display = 'none';
									var activeSelect = document.createElement("Div")
									activeSelect.className = "mutil-select-div"
									var selectName = "<i class='itemName'>" + items[i].name + "</i>"																	
									var imageFont = "<i class='fa fa-close'></i>"
									activeSelect.insertAdjacentHTML("beforeEnd",imageFont+selectName); 
									this.appendChild(activeSelect);
									    
									//activeSelect.append(imageFont);
								//	activeSelect.append(selectName);
								
									u.on(activeSelect.querySelector(".fa-close"),'mousedown', function() {

										//var $this = $(this);
										//var lis = self.oLis;
										//var lis = $(self.oDiv).find('li');
										var lis = self.oDiv.childNodes;
										for (var j = 0, len = lis.length; j < len; j++) {
											if (lis[j].item.name == this.nextSibling.innerHTML) {
												lis[j].style.display = 'block';

												for (var h = 0; h < self.mutilPks.length; h++) {
													if (self.mutilPks[h] == lis[j].item.pk) {
														self.mutilPks.splice(h, 1);
														h--;
													}
												}

												for (var b = 0; b < valueArr.length; b++) {
													if (valueArr[b] == lis[j].item.pk) {
														valueArr.splice(b, 1);
														b--;
													}
												}

											}
										}

										activeSelect.removeChild(this.parentNode);
										element.trueValue = '';
										element.trueValue = valueArr.toString();
										u.trigger(element,'mutilSelect',valueArr.toString())
									});



								//	var selectName = $("<i class='itemName'>" + items[i].name + "</i>");

								//	var activeSelect = $("<div class='mutil-select-div'></div>")

									

									


								}

							}


						}

						this.trueValue = valueArr.toString();
						

					}


				}
			})
			//禁用下拉框
			if(this.options.readonly === "readonly")return;
			
			if (this.options.single == "true" || this.options.single == true) {
				this.singleSelect()
			}

			if (this.options.mutil == "true" || this.options.mutil == true) {
				this.mutilSelect();
			}
			
			this.clickEvent();

			this.blurEvent();
			
			this.comboFilter();
			
			this.comboFilterClean();
		}
	})

	

	u.Combobox.fn = u.Combobox.prototype;

	u.Combobox.fn.createDom = function() {

		var data = this.options.dataSource;
		if (u.isEmptyObject(data)) {
			throw new Error("dataSource为空！");
		}

		var oDiv = document.createElement("div");
		oDiv.className = 'select-list-div';
        //this.oDiv
		this.oDiv = oDiv;
		//新增搜索框
		
        var searchDiv = document.createElement("div");
        searchDiv.className = 'select-search';
		var searchInput =  document.createElement("input");
		searchDiv.appendChild(searchInput);
		oDiv.appendChild(searchDiv);
		//禁用搜索框
		if(this.options.readchange){
			searchDiv.style.display = "none"
		}
		var oUl = document.createElement("ul");

		oUl.className = 'select-list-ul';
	
		for (var i = 0; i < data.length; i++) {
			var item = {
				pk: data[i].pk,
				name: data[i].name
			}
			this.items.push(item)
			var oLi = document.createElement("li");

			oLi.item = item;
			oLi.innerHTML = data[i]['name'];

			//this.oLis.push(oLi);

			oUl.appendChild(oLi);

		}


		oDiv.appendChild(oUl);
		oDiv.style.display = 'none';
		document.body.appendChild(oDiv);

	}

	u.Combobox.fn.focusEvent = function() {
		var self = this;
		u.on(this.element,'click', function(e) {
			if(self.options.readchange == true) return;
			var returnValue = self.show();

			if (returnValue === 1) return;
			// self.show();

			self.floatLayer();

			self.floatLayerEvent();

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		});
	}

	//下拉图标的点击事件
	u.Combobox.fn.clickEvent = function() {
		var self = this;		
		//var caret = this.$element.next('.input-group-addon')[0] || this.$element.next(':button')[0];
		var caret = this.element.nextSibling
		u.on(caret,'click',function(e) {
			self.show();
			self.floatLayer();
			self.floatLayerEvent();
			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		})
	}

	//tab键切换 下拉隐藏	
	u.Combobox.fn.blurEvent = function() {
		var self = this;
        
		u.on(this.element,'keyup', function(e) {
			var key = e.which || e.keyCode;
			if (key == 9)
				self.show();
			
		})
		u.on(this.element,'keydown', function(e) {
			var key = e.which || e.keyCode;
			if(key == 9)
			self.hide();
		});
	}



	u.Combobox.fn.floatLayer = function() {

		if (!document.querySelector(".select-floatDiv")) {

			var oDivTwo = document.createElement("div");
			oDivTwo.className = 'select-floatDiv';
			document.body.appendChild(oDivTwo);
		}

	}

	u.Combobox.fn.floatLayerEvent = function() {
		var self = this;
		u.on(document.querySelector(".select-floatDiv"),"click",function(e) {

			self.hide();
			this.parentNode.removeChild(this);

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}
		});


	}

	u.Combobox.fn.show = function() {

		//var oLis = this.oLis;
		var oLis = this.oDiv.querySelector("ul").childNodes;
		var vote = 0;
		for (var i = 0, length = oLis.length; i < length; i++) {

			if (oLis[i].style.display == 'none') {
				vote++;
			}
		}

		if (vote === length) return 1;

		var left = this.element.offsetLeft;
		var top = this.element.offsetTop;

		var selectHeight = this.options.dataSource.length * 30 + 10 + 10;

		var differ = (top + u.getStyle(this.element,"height") + selectHeight) - (window.outerHeight + window.scrollY);
		var oDiv = this.oDiv;

		if (differ > 0) {

			oDiv.style.left = left + 'px';
			oDiv.style.top = top - selectHeight + 'px';

		} else {

			oDiv.style.left = left + 'px';
			oDiv.style.top = top + u.getStyle(this.element,"height") + 'px';

		}

		oDiv.style.display = 'block';
	}

	u.Combobox.fn.hide = function() {
		this.oDiv.style.display = 'none';
	}

	u.Combobox.fn.singleDivValue = function() {
		var self = this;
		//var oLis = this.oLis;
		var oLis = this.oDiv.querySelector("ul").childNodes;
		for (var i = 0; i < oLis.length; i++) {
			
			u.on(oLis[i],"click",function(){
				
				var item = this.item
				self.element.value = item.pk;

				self.oDiv.style.display = 'none';

				self.options.onSelect(item);

				u.trigger(self.element,'change');
				
			})

		}
	}

	u.Combobox.fn.mutilDivValue = function() {
		var self = this;
		//var oLis = this.oLis;
		var oLis = this.oDiv.querySelector("ul").childNodes;
		for (var i = 0; i < oLis.length; i++) {
			u.on(oLis[i],"click",function(){
				
				var pk = this.item.pk;
				var mutilpks = self.mutilPks;
				var mutilLenth = mutilpks.length;

				if (mutilLenth > 0) {

					for (var k = 0; k < mutilLenth; k++) {

						if (pk == mutilpks[k]) {

							mutilpks.splice(k, 1);
                            k--;
						}

					}

				}

				mutilpks.push(pk);

				self.element.value = mutilpks;
                u.trigger(self.element,'mutilSelect',mutilpks.toString());
               // element.trigger('mutilSelect',mutilpks.toString())

				self.oDiv.style.display = 'none';
				this.style.display = 'none';
				u.trigger(self.element,'change');
				
				
				
			})

		}
	}

	u.Combobox.fn.singleSelect = function() {

		this.createDom();
		this.focusEvent();
		this.singleDivValue();

	}

	u.Combobox.fn.mutilSelect = function() {

		this.createDom();
		this.mutilDivValue();
		this.focusEvent();

	}
   //过滤下拉选项
   u.Combobox.fn.comboFilter = function(){
   	 var self = this;
	 u.on(this.oDiv,"keyup",function(){
   	
   	 	 var content = this.querySelector('.select-search input').value
   	 	
   	 	 var oLis = this.oDiv.querySelector("ul").childNodes;
   	 	 for(var i=0;i<oLis.length;i++){
   	 	 	 if(oLis[i].item.name.indexOf(content) != -1){
   	 	 	 	oLis[i].style.display = 'block';
   	 	 	 }else{
   	 	 	 	oLis[i].style.display = 'none';
   	 	 	
   	 	 	 }
   	 	 }
   	 	 
   	 	 
   	 })
   }
   
   //过滤的后续处理
   u.Combobox.fn.comboFilterClean = function(){
   	  var self = this;
	   u.on(self.element,"click",function(){
   	 // $(this.$element).on('click',function(){
   	  	// $(self.oDiv).find('.select-search input').val('')  	
		 self.oDiv.querySelector('.select-search input').value = ""	 
   	  	var oLis = this.oDiv.querySelector("ul").childNodes;
   	  	 if(self.options.single == "true" || self.options.single == true){
   	  	 	for(var i=0;i<oLis.length;i++){
   	  	 	  oLis[i].style.display = 'block'
   	  	   }
   	  	 }else if(self.options.mutil == "true" || self.options.mutil == true ){
   	  	 	 var selectLisIndex = [];
   	  	 	 var selectLisSpan = this.querySelector('.mutil-select-div .itemName');
   	  	 	
   	  	 	 for(var i=0;i<selectLisSpan.length;i++){
   	  	 	 	 for(var k=0;k<oLis.length;k++){
   	  	 	 	 	if(selectLisSpan[i].innerHTML == oLis[k].item.name){
   	  	 	 	 		//oLis[k].style.display = 'none';
   	  	 	 	 		selectLisIndex.push(k)
 	  	 	 	 	}
   	  	 	 	 }
   	  	 	 }
   	  	 	 
   	  	 	for(var l=0; l<oLis.length;l++) {
   	  	 		oLis[l].style.display = 'block'
   	  	 		for(var j=0;j<selectLisIndex.length;j++){
   	  	 	 	if(l == selectLisIndex[j])
   	  	 	 	  oLis[l].style.display = 'none'
   	  	 	   }
   	  	 	}
   	  	 	 
   	  	 	 
   	  	 }
   	  	 
   	  	  
   	  })
   }
	// var Plugin = function(option) {

		// var $this = $(this);
		// var data = $this.data('s.select');
		// var options = typeof option == 'object' && option

		// if (!data) $this.data('s.select', (new Combobox(this, options)))

	// }

    //动态设置li值
	// $.fn.setComboData = function(dataSourse) {
        // var $this = $(this).data('s.select');
        // if(!$this)return;
		// var data = dataSourse;
		// if (!$.isArray(data) || data.length == 0) return;
		
		// $this.items.length = 0;

		// var Olis = $($this.oDiv).find('li');
		
		
	    // if(data.length < Olis.length){
			
			// for(var k=data.length;k<Olis.length;k++){
				   // $(Olis[k]).remove();
			// }		
			
		// }else if(data.length > Olis.length){
			// var liTemplate = Olis[0]
			// var oUl = $($this.oDiv).find('ul')
			// for(var j=0;j<(data.length-Olis.length);j++){
				// $(liTemplate).clone(true).appendTo(oUl)
			// }
		// }
        
        // Olis = $($this.oDiv).find('li');
        
		// for (var i = 0; i < data.length; i++) {
			// var item = {
				// pk: data[i].pk,
				// name: data[i].name
			// }
			// $this.items.push(item)
			// Olis[i].item = item;
			// Olis[i].innerHTML = data[i]['name']
		 // }
		
	// }

	// $.fn.Combobox = Plugin;
	if (u.compMgr)
	
	u.compMgr.regComp({
		comp: u.Combobox,
		compAsString: 'u.Combobox',
		css: 'u-combobox'
	})


u.Multilang = u.BaseComponent.extend({
		DEFAULTS : {
			dataSource:{},			
			onSelect: function() {}
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.multinfo(this.options.multinfo)			
			this.addData(this.options.multidata)
			
		}
	})		
	u.Multilang.fn = u.Multilang.prototype;
	u.Multilang.fn.addData = function(val) {
			var target = this.element , tmparray,target_div = target.parentNode;
			if(typeof(val) == "object"){
				tmparray = val					
			}else{
				tmparray = val.split(",")	
			}		
			target_div.value = tmparray				
			u.each(tmparray,function(i,node){				
				target_div.querySelectorAll(".m_context")[i].innerHTML = node						
			})
			
		};
	u.Multilang.fn.multinfo = function(sort){	
			
			var target = this.element,me= this,tmplabel = "",close_menu=true,tmpfield = "name";
			if(sort.lang_name){
				tmpfield = sort.lang_name
			}
			if (u.isArray(sort)) {											
						
				u.wrap(target,"<div class='multilang_body'><input class='lang_value' contenteditable='true'><span class='fa fa-sort-desc lang_icon'><span class='m_icon'></span></span>")
				u.css(target,"display","none")

				u.each(sort, function(i, node) {
						if(i){
							tmplabel += "<label attr='"+tmpfield+(i+1)+"'><span class='m_context'></span><span class='m_icon'>" + node + "</span></label>"
						}else{
							tmplabel += "<label attr='"+tmpfield+"'><span class='m_context'></span><span class='m_icon'>" + node + "</span></label>"	
						}
				})
				var target_div = target.parentNode
				
				target_div.insertAdjacentHTML("beforeEnd","<div class='multilang_menu '>" + tmplabel + "</div>")
				var tmpIconv=target_div.querySelector(".lang_icon"),target_menu = target_div.querySelector(".multilang_menu"),tmpvaluebox = target_div.querySelector(".lang_value");
				u.on(tmpIconv,"click",function(){
					var target_icon = this ;
					target_div.querySelector(".lang_value").focus()
					if(u.css(target_menu,"display") == "block"){
						u.css(target_menu,"display","none")
					}else{
						u.css(target_menu,"display","block")							
					}
				})
				u.on(target_menu,"mouseenter",function(){
						close_menu = false;
				})
				u.on(target_menu,"mouseleave",function(){
						close_menu = true;
				})
						
				u.on(tmpvaluebox,"blur",function(){
						//this//
						//target_box = me.fixtarget(target_input),
					//target_div = target_input.parents(".multilang_body"),
					target = this
					tmpkey = target.className.split(" ")[2],						
					tmptext = target.value;
				
					if(u.hasClass(target,"ready_change")){
						me.changeData(target_div,tmpkey,tmptext);
					}					
					if(close_menu){
						u.css(target_menu,"display","none")
					}
						
				})
				u.on(target_menu,"click","label",function(){
					var target_label = this,
						tmpfield = target_label.getAttribute("attr"),
						tmptext = target_label.querySelector(".m_context").innerHTML,
						tmpicon = target_label.querySelector(".m_icon").cloneNode(true);					
						
					tmpvaluebox.setAttribute("class","ready_change lang_value "+tmpfield)
					tmpvaluebox.value = tmptext
					tmpvaluebox.focus();
					var tmpicom = target_div.querySelector(".lang_icon"),oldicon = target_div.querySelector(".m_icon")
					u.removeClass(tmpicom,"fa-sort-desc")
					tmpicom.replaceChild(tmpicon,oldicon)
				})
				
				
				
			} else {
				console.error('Not object')
			}
		}
	u.Multilang.fn.changeData = function(target_div,field,text){
			var tmpdata  = target_div.value; 										
			    tmplabel = target_div.querySelector("label[attr='"+field+"']");
				tmpcontext = tmplabel.querySelector(".m_context");
			tmpcontext.innerHTML = text
			tmpcontext.value = text
			u.each(target_div.querySelectorAll(".m_context"),function(i,node){
				tmpdata[i] = node.innerHTML
			})
			
			u.trigger(this.element,'change.u.multilang', {newValue:text, field:field})
						
		}
	u.Multilang.fn.getData = function(){
			var target = $(multilang.target).next(".multilang_body")[0], multilang_data = target.value;
			return 	multilang_data;
		}
	if (u.compMgr)
	
	u.compMgr.regComp({
		comp: u.Multilang,
		compAsString: 'u.Multilang',
		css: 'u-multilang'
	})
u.DateTimePicker = u.BaseComponent.extend({
    
    
});

u.DateTimePicker.fn = u.DateTimePicker.prototype;


u.DateTimePicker.fn.init = function(){
	
    var self = this,_fmt,_defaultFmt;
	this._element = this.element;
    u.addClass(this._element,'u-text')
    this._element.style.display = "inline-table"; // 存在右侧图标，因此修改display
    //new UText(this._element);

    this._input = this._element.querySelector("input");
    u.on(this._input, 'focus', function(e){
        if (self.isShow !== true){
            self.show(e);
        }
        u.stopEvent(e);
    });
    this._span = this._element.querySelector("span");
    if (this._span){
        u.on(this._span, 'click', function(e){
            if (self.isShow !== true){
                self.show(e);
            }
            u.stopEvent(e);
        });
    }

    if (u.hasClass(this._element, 'time')){
        this.type = 'datetime';
        _defaultFmt = 'YYYY-MM-DD hh:mi:ss';
    }else{
        this.type = 'date';
        _defaultFmt = 'YYYY-MM-DD';
    }
    _fmt = this._element.getAttribute("format");
    this.format = _fmt || this.options['format']  ||  _defaultFmt;
    this.isShow = false;
};


/**
 * 轮播动画效果
 * @private
 */
u.DateTimePicker.fn._carousel = function(newPage, direction){
    if (direction == 'left'){
        u.addClass(newPage, 'right-page');
    }else{
        u.addClass(newPage, 'left-page');
    }
    this._dateContent.appendChild(newPage);
    var cleanup = function() {
        newPage.removeEventListener('transitionend', cleanup);
        newPage.removeEventListener('webkitTransitionEnd', cleanup);
        this._dateContent.removeChild(this.contentPage);
        this.contentPage = newPage;
    }.bind(this);

    newPage.addEventListener('transitionend', cleanup);
    newPage.addEventListener('webkitTransitionEnd', cleanup);
    window.requestAnimationFrame(function() {
        if (direction == 'left'){
            u.addClass(this.contentPage, 'left-page');
            u.removeClass(newPage, 'right-page');
        }else{
            u.addClass(this.contentPage, 'right-page');
            u.removeClass(newPage, 'left-page');
        }
    }.bind(this));
};

/**
 * 淡入动画效果
 * @private
 */
u.DateTimePicker.fn._zoomIn = function(newPage){
    if (!this.contentPage){
        this._dateContent.appendChild(newPage);
        this.contentPage = newPage;
        return;
    }
    u.addClass(newPage, 'zoom-in');
    this._dateContent.appendChild(newPage);
    var cleanup = function() {
        newPage.removeEventListener('transitionend', cleanup);
        newPage.removeEventListener('webkitTransitionEnd', cleanup);
        this._dateContent.removeChild(this.contentPage);
        this.contentPage = newPage;
    }.bind(this);
    if (this.contentPage){
        newPage.addEventListener('transitionend', cleanup);
        newPage.addEventListener('webkitTransitionEnd', cleanup);
    }
    window.requestAnimationFrame(function() {
            u.addClass(this.contentPage, 'is-hidden');
            u.removeClass(newPage, 'zoom-in');
    }.bind(this));
};


/**
 *填充年份选择面板
 * @private
 */
u.DateTimePicker.fn._fillYear = function(type){
    var year,template,yearPage,titleDiv,yearDiv,_year, i,cell;
    template = ['<div class="u-date-content-page">',
                    '<div class="u-date-content-title"></div>',
                    '<div class="u-date-content-panel"></div>',
                '</div>'].join("");
    type = type || 'current';
    _year = this.pickerDate.getFullYear()
    if ('current' === type) {
        this.startYear = _year - _year%10 - 1;
    } else if (type === 'preivous') {
        this.startYear = this.startYear - 10;
    } else {
        this.startYear = this.startYear + 10;
    }
    yearPage = u.makeDOM(template);
    titleDiv = yearPage.querySelector('.u-date-content-title');
    titleDiv.innerHTML = (this.startYear - 1) + '-' + (this.startYear + 11);
    yearDiv = yearPage.querySelector('.u-date-content-panel');
    for(i = 0; i < 12; i++){
        cell = u.makeDOM('<div class="u-date-content-year-cell">'+ (this.startYear + i) +'</div>');
        new URipple(cell);
        if (this.startYear + i == _year){
            u.addClass(cell, 'current');
        }
        cell._value = this.startYear + i;
        yearDiv.appendChild(cell);
    }
    u.on(yearDiv, 'click', function(e){
        var _y = e.target._value;
        this.pickerDate.setYear(_y);
        this._updateDate();
        this._fillMonth();
    }.bind(this));

    if (type === 'current'){
        this._zoomIn(yearPage);
    }else if(type === 'next'){
        this._carousel(yearPage, 'left');
    }else if(type === 'preivous'){
        this._carousel(yearPage, 'right');
    }
    this.currentPanel = 'year';
};

/**
 * 填充月份选择面板
 * @private
 */
u.DateTimePicker.fn._fillMonth = function(){
    var template,monthPage,_month,cells,i;
    _month = this.pickerDate.getMonth() + 1;
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">'+_month+'月</div>',
        '<div class="u-date-content-panel">',
            '<div class="u-date-content-year-cell">1月</div>',
            '<div class="u-date-content-year-cell">2月</div>',
            '<div class="u-date-content-year-cell">3月</div>',
            '<div class="u-date-content-year-cell">4月</div>',
            '<div class="u-date-content-year-cell">5月</div>',
            '<div class="u-date-content-year-cell">6月</div>',
            '<div class="u-date-content-year-cell">7月</div>',
            '<div class="u-date-content-year-cell">8月</div>',
            '<div class="u-date-content-year-cell">9月</div>',
            '<div class="u-date-content-year-cell">10月</div>',
            '<div class="u-date-content-year-cell">11月</div>',
            '<div class="u-date-content-year-cell">12月</div>',
        '</div>',
        '</div>'].join("");

    monthPage = u.makeDOM(template);
    cells =monthPage.querySelectorAll('.u-date-content-year-cell');
    for (i = 0; i < cells.length; i++){
        if (_month - 1 == i){
            u.addClass(cells[i],'current');
        }
        cells[i]._value = i;
        new URipple(cells[i]);
    }
    u.on(monthPage, 'click', function(e){
        var _m = e.target._value;
        this.pickerDate.setMonth(_m);
        this._updateDate();
        this._fillDate();
    }.bind(this));
    this._zoomIn(monthPage);
    this.currentPanel = 'month';
};

u.DateTimePicker.fn._getPickerStartDate = function(date){
    var d = new Date(date);
    d.setDate(1);
    var day = d.getDay();
    d = u.date.sub(d, 'd', day);
    return d;
}

u.DateTimePicker.fn._getPickerEndDate= function(date){
    var d = new Date(date);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    var day = d.getDay();
    d = u.date.add(d,'d',6 - day);
    return d;
}
u.DateTimePicker.fn._dateMobileScroll = function(type){
   var year,month,day,template,datePage,titleDiv,dateDiv,weekSpans,language,tempDate, i,cell,ddheight;
    var self = this;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = u.date.sub(this.startDate,'d', 1);
    } else {
        tempDate = u.date.add(this.endDate,'d', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = u.core.getLanguages();
   
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title"></div>',        
        '<div class="u-date-content-panel"><div class="scroll-box"><div class="scroll-shadow"></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setYear" class="u-date-year  u-scroll"></dl></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setMonth" class="u-date-month u-scroll"></dl></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setDate" class="u-date-day u-scroll"></dl></div>',
        '</div></div>'].join("");
    datePage = u.makeDOM(template);
    var srcollyear = datePage.querySelector('.u-date-year');
    var srcollmonth = datePage.querySelector('.u-date-month');
    var srcollday = datePage.querySelector('.u-date-day');
    this.startYear =  this.pickerDate.getFullYear() -10;
    for(i = 0; i < 20; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ (this.startYear + i) +'</dd>');
        
        if (this.startYear + i == this.pickerDate.getFullYear()){
            u.addClass(cell, 'current');
            current_postion(srcollyear,i)
        }
        cell._value = this.startYear + i;
        srcollyear.appendChild(cell);
    }
    for(i = 0; i < 12; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ (1 + i) + '月' +'</dd>');
       
        if (this.pickerDate.getMonth()  == i){
            u.addClass(cell, 'current');
            current_postion(srcollmonth,i)
        }
        cell._value = i;
        srcollmonth.appendChild(cell);
    }
    var pickerdayend = (new Date(this.pickerDate.getFullYear(),this.pickerDate.getMonth()+1,00)).getDate()
    for(i = 1; i < pickerdayend; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ i +'日</dd>');
        if (i == this.pickerDate.getDate()) {
            u.addClass(cell, 'current');
            current_postion(srcollday,i-1)
        }
        cell._value = i;        
        srcollday.appendChild(cell);
        
    }
    //current_postion(datePage)
    ddheight = 60
    u.on(datePage.querySelector(".scroll-shadow"),"touchstart",function(e){
         var tmpwidth = this.clientWidth
        var scrolltype,startp,offsetX ; 
        console.dir()
        startp = e.touches[0].pageY;
        offsetX = e.touches[0].pageX - this.getClientRects()[0].left        
        if(offsetX < tmpwidth * 0.33){                        
            scrolltype = datePage.querySelector(".u-date-year")
        }else if(tmpwidth * 0.33 < offsetX  && offsetX < tmpwidth * 0.66){
            scrolltype = datePage.querySelector(".u-date-month")
        }else if(tmpwidth * 0.66 < offsetX){
            scrolltype = datePage.querySelector(".u-date-day")
        }
        u.on(document.body,"touchmove",function(e){
            var scrollrange = e.touches[0].pageY - startp 
            var oldtrans = parseInt(scrolltype.style.transform.match(/\((\S+)px\)/)[1])               
            scrolltype.style.transform = "translateY("+(oldtrans + scrollrange)+"px)";
            startp = e.touches[0].pageY
        }) 
        var maxscroll = (scrolltype.querySelectorAll('dd').length - 3) * -ddheight
        u.on(document.body,"touchend",function(e){
            var oldtrans = parseInt(scrolltype.style.transform.match(/\((\S+)px\)/)[1])  
           
            var remain = oldtrans-oldtrans%60  
            
            if(remain > ddheight*2){
                remain = ddheight*2
            }else if(remain < maxscroll){
                remain = maxscroll
            }
            tmpdd = scrolltype.querySelectorAll("dd"),
            u.removeClass(scrolltype.querySelector(".current"),'current')
            u.addClass(tmpdd[2 - (remain/ddheight)],'current')
            scrolltype.style.transform = "translateY("+remain+"px)";
            scrollend_update(scrolltype,self)    
            
            u.off(document.body,"touchmove")
            u.off(document.body,"touched")
            
        }) 
    })
   
   if (type === 'current'){
        this._zoomIn(datePage);
    }else if(type === 'next'){
        this._carousel(datePage, 'left');
    }else if(type === 'preivous'){
        this._carousel(datePage, 'right');
    }
    this.currentPanel = 'mobile_date';
    
}
u.DateTimePicker.fn._timeMobileScroll = function(type){
   var year,month,day,template,datePage,titleDiv,dateDiv,weekSpans,language,tempDate, i,cell,ddheight;
    var self = this;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = u.date.sub(this.startDate,'d', 1);
    } else {
        tempDate = u.date.add(this.endDate,'d', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = u.core.getLanguages();
   
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title"></div>',        
        '<div class="u-date-content-panel"><div class="scroll-box"><div class="scroll-shadow"></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setHours" class="u-date-hour  u-scroll"></dl></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setMinutes" class="u-date-minute u-scroll"></dl></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setSeconds" class="u-date-second u-scroll"></dl></div>',
        '</div></div>'].join("");
    datePage = u.makeDOM(template);
    var srcollhour = datePage.querySelector('.u-date-hour');
    var srcollminute = datePage.querySelector('.u-date-minute');
    var srcollsecond = datePage.querySelector('.u-date-second');  
    for(i = 0; i < 24; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+  (i<10? "0"+i:i) +'</dd>');
        
        if ( this.pickerDate.getHours() == i){
            u.addClass(cell, 'current');
            current_postion(srcollhour,i)
        }
        cell._value = i;
        srcollhour.appendChild(cell);
    }
    for(i = 0; i < 60; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ (i<10? "0"+i:i) + '</dd>');
       
        if (this.pickerDate.getMinutes()  == i){
            u.addClass(cell, 'current');
            current_postion(srcollminute,i)
        }
        cell._value = i;
        srcollminute.appendChild(cell);
    }
    for(i = 0; i < 60; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ (i<10? "0"+i:i) +'</dd>');
       
        if (this.pickerDate.getSeconds()  == i){
            u.addClass(cell, 'current');
            current_postion(srcollsecond,i)
        }
        cell._value = i;
        srcollsecond.appendChild(cell);
    }
 
    //current_postion(datePage)
    ddheight = 60
    u.on(datePage.querySelector(".scroll-shadow"),"touchstart",function(e){
         var tmpwidth = this.clientWidth
        var scrolltype,startp,offsetX ; 
        
        startp = e.touches[0].pageY;
        offsetX = e.touches[0].pageX - this.getClientRects()[0].left        
        if(offsetX < tmpwidth * 0.33){                        
            scrolltype = datePage.querySelector(".u-date-hour")
        }else if(tmpwidth * 0.33 < offsetX  && offsetX < tmpwidth * 0.66){
            scrolltype = datePage.querySelector(".u-date-minute")
        }else if(tmpwidth * 0.66 < offsetX){
            scrolltype = datePage.querySelector(".u-date-second")
        }
        u.on(document.body,"touchmove",function(e){
            var scrollrange = e.touches[0].pageY - startp 
            var oldtrans = parseInt(scrolltype.style.transform.match(/\((\S+)px\)/)[1])               
            scrolltype.style.transform = "translateY("+(oldtrans + scrollrange)+"px)";
            startp = e.touches[0].pageY
        }) 
        var maxscroll = (scrolltype.querySelectorAll('dd').length - 3) * -ddheight
        u.on(document.body,"touchend",function(e){
            var oldtrans = parseInt(scrolltype.style.transform.match(/\((\S+)px\)/)[1])  
           
            var remain = oldtrans-oldtrans%60  
            
            if(remain > ddheight*2){
                remain = ddheight*2
            }else if(remain < maxscroll){
                remain = maxscroll
            }
            tmpdd = scrolltype.querySelectorAll("dd"),
            u.removeClass(scrolltype.querySelector(".current"),'current')
            u.addClass(tmpdd[2 - (remain/ddheight)],'current')
            scrolltype.style.transform = "translateY("+remain+"px)";
            scrollend_update(scrolltype,self)    
            
            u.off(document.body,"touchmove")
            u.off(document.body,"touched")
            
        }) 
    })
   
   if (type === 'current'){
        this._zoomIn(datePage);
    }else if(type === 'next'){
        this._carousel(datePage, 'left');
    }else if(type === 'preivous'){
        this._carousel(datePage, 'right');
    }
    this.currentPanel = 'mobile_time';
    
}
function scrollend_update(scrolltype,self){
    var tmpmod =  scrolltype.getAttribute("time-change"),
        tmpcurrent = scrolltype.querySelector(".current");
    self.pickerDate[tmpmod](tmpcurrent._value)
    self._updateDate();
            
}
function current_postion(dom,i){
   dom.style.transform = "translateY("+(120-i*60)+"px)";
}
/**
 * 渲染日历
 * @param type : previous  current  next
 * @private
 */
u.DateTimePicker.fn._fillDate = function(type){
    if (u.isIOS){
        this._dateMobileScroll()
        return
    }
    var year,month,template,datePage,titleDiv,dateDiv,weekSpans,language,tempDate, i,cell;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = u.date.sub(this.startDate,'d', 1);
    } else {
        tempDate = u.date.add(this.endDate,'d', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](tempDate);
    month = u.date._formats['MMM'](tempDate,language);
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title"></div>',
        '<div class="u-date-week"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>',
        '<div class="u-date-content-panel"></div>',
        '</div>'].join("");
    datePage = u.makeDOM(template);
    titleDiv = datePage.querySelector('.u-date-content-title');
    titleDiv.innerHTML = year + ' ' + month;
    weekSpans = datePage.querySelectorAll('.u-date-week span');

    for(i=0; i< 7; i++){
        weekSpans[i].innerHTML = u.date._dateLocale[language].weekdaysMin[i];
    }
    dateDiv = datePage.querySelector('.u-date-content-panel');
    tempDate = this.startDate;
    while(tempDate <= this.endDate){
        cell = u.makeDOM('<div class="u-date-cell">'+ tempDate.getDate() +'</div>');
        if (tempDate.getFullYear() == this.pickerDate.getFullYear() && tempDate.getMonth() == this.pickerDate.getMonth()
            && tempDate.getDate() == this.pickerDate.getDate()){
            u.addClass(cell, 'current');
        }
        cell._value = tempDate.getDate();
        new URipple(cell);
        dateDiv.appendChild(cell);
        tempDate = u.date.add(tempDate, 'd', 1);
    }
    u.on(dateDiv, 'click', function(e){
        var _d = e.target._value;
        this.pickerDate.setDate(_d);
        var _cell = this.contentPage.querySelector('.u-date-cell.current');
        if (_cell) {
            u.removeClass(_cell, 'current');
        }
        u.addClass(e.target, 'current');
        this._updateDate();
    }.bind(this));
    if (type === 'current'){
        this._zoomIn(datePage);
    }else if(type === 'next'){
        this._carousel(datePage, 'left');
    }else if(type === 'preivous'){
        this._carousel(datePage, 'right');
    }
    this.currentPanel = 'date';
};


/**
 * 填充时间选择面板
 * @private
 */
u.DateTimePicker.fn._fillTime = function(type){
    if (u.isIOS) {
        this._timeMobileScroll()
        return;
    }
	var year,month,day,template,timePage,titleDiv,dateDiv,weekSpans,language,tempDate, i,cell;
	var self = this;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = u.date.sub(this.startDate,'d', 1);
    } else {
        tempDate = u.date.add(this.endDate,'d', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](tempDate);
    month = u.date._formats['MMM'](tempDate,language);
    day = u.date._formats['DD'](tempDate,language);
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title"></div>',
        '<div class="u-date-content-panel"></div>',
        '</div>'].join("");
    timePage = u.makeDOM(template);
    titleDiv = timePage.querySelector('.u-date-content-title');
    titleDiv.innerHTML = year + ' ' + month + ' ' +day ;
    
    dateDiv = timePage.querySelector('.u-date-content-panel');
   // tempDate = this.startDate;
    // while(tempDate <= this.endDate){
        // cell = u.makeDOM('<div class="u-date-cell">'+ u.date._formats['HH'](tempDate,language) +'</div>');
        // if (tempDate.getFullYear() == this.pickerDate.getFullYear() && tempDate.getMonth() == this.pickerDate.getMonth()
            // && tempDate.getDate() == this.pickerDate.getDate()){
            // u.addClass(cell, 'current');
        // }
        // cell._value = tempDate.getDate();
        // new URipple(cell);
        // dateDiv.appendChild(cell);
        // tempDate = u.date.add(tempDate, 'd', 1);
    // }
	timetemplate = ['<div class="u_time_box">', 
						'<div class="u_time_cell">',
							'<div class="add_hour_cell"><i class="add_hour_cell icon-angle-up"></i></div>',
							'<div class="show_hour_cell">'+ u.date._formats['HH'](tempDate) +'</div>' ,
							'<div class="subtract_hour_cell"><i class="subtract_hour_cell icon-angle-down"></i></div>',
						'</div>',
						'<div class="u_time_cell">',
							'<div class="add_min_cell"><i class="add_min_cell icon-angle-up"></i></div>',
							'<div class="show_min_cell">'+ u.date._formats['mm'](tempDate) +'</div>',
							'<div class="subtract_min_cell"><i class="subtract_min_cell icon-angle-down"></i></div>',
						'</div>',
						'<div class="u_time_cell">',	
							'<div class="add_sec_cell"><i class="add_sec_cell icon-angle-up"></i></div>',
							'<div class="show_sec_cell">'+ u.date._formats['ss'](tempDate) +'</div>',
							'<div class="subtract_sec_cell"><i class="subtract_sec_cell icon-angle-down"></i></div>',
						'</div>',
					'</div>'].join("");
	cell = u.makeDOM(timetemplate);	
	dateDiv.appendChild(cell);
	u.on(dateDiv, 'click', function(e){		
        var _arrary = e.target.getAttribute("class").split("_");
		if(_arrary[0] == "add"){
			if(_arrary[1] == "hour"){
				var tmph = Number(u.date._formats['HH'](this.pickerDate))
				if(tmph < 23){ 
					tmph++
				}else{
					tmph = 0
				}
				
				this.pickerDate.setHours(tmph)
				dateDiv.querySelector(".show_hour_cell").innerHTML = tmph
			}else if(_arrary[1] == "min"){
				var tmpm = Number(u.date._formats['mm'](this.pickerDate))
				if(tmpm < 59){ 
					 tmpm++
				}else{
					 tmpm = 0
				}
				this.pickerDate.setMinutes(tmpm)
			}else if(_arrary[1] == "sec"){
				var tmps = Number(u.date._formats['ss'](this.pickerDate))
				if(tmps < 59){ 
					tmps++
				}else{
					tmps = 0
				}
				this.pickerDate.setSeconds(tmps)				
			}				
		}else if(_arrary[0] == "subtract"){
			if(_arrary[1] == "hour"){
				var tmph = Number(u.date._formats['HH'](this.pickerDate))
				if(tmph > 0 ){ 
					tmph--
				}else{
					tmph = 23
				}
				this.pickerDate.setHours(tmph)
				
			}else if(_arrary[1] == "min"){
				var tmpm = Number(u.date._formats['mm'](this.pickerDate))
				if(tmpm > 0){ 
					 tmpm--
				}else{
					 tmpm = 59
				}
				this.pickerDate.setMinutes(tmpm)
			}else if(_arrary[1] == "sec"){
				var tmps = Number(u.date._formats['ss'](this.pickerDate))
				if(tmps > 0){ 
					tmps--
				}else{
					tmps = 59
				}
				this.pickerDate.setSeconds(tmps)				
			}	
		}else if(_arrary[0] == "show"){
			var tmptarget = e.target
            var tmpinput = u.makeDOM("<input type='text' class='u-input'>");
            if(tmptarget.querySelector('.u-input'))return;
            this._updateDate();
            tmpinput.value = tmptarget.textContent
			tmptarget.innerHTML = ""
            tmptarget.appendChild(tmpinput)           
            if(_arrary[1] == "hour"){
				 var vali = new u.Validate(tmpinput,{validType:"integer",minLength:0,maxLength:2,min:0,max:23})	
                 u.on(tmpinput,'blur',function(){
                    if(vali.passed){ 
                        self.pickerDate.setHours(tmpinput.value)
                        self._updateDate();
                    }
                 })
			}else if(_arrary[1] == "min"){
				 var vali = new u.Validate(tmpinput,{validType:"integer",minLength:0,maxLength:2,min:0,max:59})
                   u.on(tmpinput,'blur',function(){
                    if(vali.passed){ 
                        self.pickerDate.setMinutes(tmpinput.value)
                        self._updateDate();
                    }
                 })
			}else if(_arrary[1] == "sec"){
				 var vali = new u.Validate(tmpinput,{validType:"integer",minLength:0,maxLength:2,min:0,max:59})	
                   u.on(tmpinput,'blur',function(){
                    if(vali.passed){ 
                        self.pickerDate.setSeconds(tmpinput.value)
                        self._updateDate();
                    }
                 })
			}

            tmpinput.focus()
            return;
			
		}else{
			return false;
		}     
			
        this._updateDate();
    }.bind(this));
    this._zoomIn(timePage);
    this.currentPanel = 'time';
	dateDiv.onselectstart=new Function("return false");
    
};

/**
 * 重新渲染面板
 * @private
 */
u.DateTimePicker.fn._updateDate = function(){
    var year,month,week,date,time, hour,minute,seconds,language;

    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](this.pickerDate);
    week = u.date._formats['ddd'](this.pickerDate, language);
    month = u.date._formats['MMM'](this.pickerDate, language);
	time = u.date._formats['HH'](this.pickerDate, language)+' : '+u.date._formats['mm'](this.pickerDate, language)+' : '+u.date._formats['ss'](this.pickerDate, language);
	
    //TODO 多语
    date = u.date._formats['D'](this.pickerDate) + '日';
    this._headerYear.innerHTML = '';
    this._headerYear.innerHTML = year;
    this._headerWeak.innerHTML = '';
    this._headerWeak.innerHTML = week;
    this._headerMonth.innerHTML = '';
    this._headerMonth.innerHTML = month ;
    this._headerDate.innerHTML = '';
    this._headerDate.innerHTML = date;
	this._headerTime.innerHTML = '';
    this._headerTime.innerHTML = time;
	if(this.currentPanel == 'time'){
		this._panel.querySelector(".show_hour_cell").innerHTML =  u.date._formats['HH'](this.pickerDate, language)
		this._panel.querySelector(".show_min_cell").innerHTML =  u.date._formats['mm'](this.pickerDate, language)
		this._panel.querySelector(".show_sec_cell").innerHTML =  u.date._formats['ss'](this.pickerDate, language)
	}

};


u.DateTimePicker.fn._response = function() {
    var bodyHeight = document.body.offsetHeight;
    if (bodyHeight > 500){
        this._panel.style.height =  '500px';
    }
    //this._dateContent.style.height =panelHeight - 158 + 'px';   // 106 52
};

u.dateTimePickerTemplateArr = ['<div class="u-date-panel">',
                            '<div class="u-date-body">',
                                '<div class="u-date-header">',
                                    '<span class="u-date-header-year"></span>',
                                     '<div class="u-date-header-h3">',
                                        '<span class="u-date-header-week"></span>',
                                        '<span>,</span>',
                                        '<span class="u-date-header-month"></span>',
                                        '<span> </span>',
                                        '<span class="u-date-header-date"></span>',
                                        '<span> </span>',
                                        '<span class="u-date-header-time"></span>',
                                     '</div>',
                                '</div>',
                                '<div class="u-date-content"></div>',
                            '</div>',
                            '<div class="u-date-nav">',
                                '<button class="u-button u-date-ok right">OK</button>',
                                '<button class="u-button u-date-cancel right">Cancel</button>',
                            '</div>',
                           '</div>'];


/******************************
 *  Public method
 ******************************/

u.DateTimePicker.fn.show = function(){
    var self = this;
    if (!this._panel){
        this._panel = u.makeDOM(u.dateTimePickerTemplateArr.join(""));
        this._headerYear = this._panel.querySelector('.u-date-header-year');
        this._headerWeak = this._panel.querySelector('.u-date-header-week');
        this._headerMonth = this._panel.querySelector('.u-date-header-month');
        this._headerDate = this._panel.querySelector('.u-date-header-date');
        this._headerTime = this._panel.querySelector('.u-date-header-time');
        this._dateContent = this._panel.querySelector('.u-date-content');
        this.btnOk = this._panel.querySelector('.u-date-ok');
        this.btnCancel = this._panel.querySelector('.u-date-cancel');
        var rippleContainer = document.createElement('span');
        u.addClass(rippleContainer,'u-ripple');
        this.btnOk.appendChild(rippleContainer);
        var rippleContainer = document.createElement('span');
        u.addClass(rippleContainer,'u-ripple');
        this.btnCancel.appendChild(rippleContainer);
        new URipple(this.btnOk);
        new URipple(this.btnCancel);
        u.on(this.btnOk, 'click', function(){
            this.onOk();
        }.bind(this));
        u.on(this.btnCancel, 'click', function(){
            self.onCancel();
        });
        u.on(this._headerYear, 'click', function(){
            self._fillYear();
        });
        u.on(this._headerMonth, 'click', function(){
            self._fillMonth();
        });
        u.on(this._headerTime, 'click', function(){
            self._fillTime();
        });

        this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button flat floating mini">&lt;</button>');
        this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button flat floating mini">&gt;</button>');
        new u.Button(this.nextBtn);
  
        u.on(this.preBtn, 'click', function(e){
            if (self.currentPanel == 'date'){
                self._fillDate('preivous');
            }else if (self.currentPanel == 'year'){
                self._fillYear('preivous');
            }
        });
        u.on(this.nextBtn, 'click', function(e){
            if (self.currentPanel == 'date'){
                self._fillDate('next');
            }else if (self.currentPanel == 'year'){
                self._fillYear('next');
            }
        });
        this._dateContent.appendChild(this.preBtn);
        this._dateContent.appendChild(this.nextBtn);

        this._element.parentNode.appendChild(this._panel);

    }
    this.pickerDate = this.date || new Date();
    this._updateDate();
    this._fillDate();
    this._response();
    u.on(window, 'resize', function(){
        self._response();
    });
    this.overlayDiv = u.makeModal(this._panel);
    u.addClass(this._panel, 'is-visible');

    this.isShow = true;
};

u.DateTimePicker.fn.hide = function(){

};

u.DateTimePicker.fn.setDate = function(value){
    if (!value){
        this.date = null;
        this._input.value = '';
        return;
    }
    var _date = new Date(value);
    if (isNaN(_date)){
        _date = new Date(parseInt(value))
        if (isNaN(_date)) {
            throw new TypeError('invalid Date parameter');
        }
    }
    this.date = _date;
    this._input.value = u.date.format(this.date,this.format);
};

/**
 *设置format
 * @param format
 */
u.DateTimePicker.fn.setFormat = function(format){
    this.format = format;
    this._input.value = u.date.format(this.date,this.format);
};

/**
 * 确定事件
 */
u.DateTimePicker.fn.onOk = function(){
    this.setDate(this.pickerDate);
    this.isShow = false;
    u.removeClass(this._panel, 'is-visible');
    document.body.removeChild(this.overlayDiv);
    this.trigger('select', {value:this.pickerDate})
}

/**
 * 确定事件
 */
u.DateTimePicker.fn.onCancel = function(){
    this.isShow = false;
    u.removeClass(this._panel, 'is-visible');
    document.body.removeChild(this.overlayDiv);
}



if (u.compMgr) 
	u.compMgr.regComp({
		comp: u.DateTimePicker,
		compAsString: 'u.DateTimePicker',
		css: 'u-datepicker'
	})

u.Time = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			u.addClass(this.element,'u-text');
			
			
	        u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
			
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

	u.Time.fn = u.Time.prototype;

	u.Time.fn.createPanel = function(){
		if(this.panelDiv)
			return;
		var oThis = this;
		this.panelDiv = u.makeDOM('<div class="u-combo-ul" style="padding:0px;"></div>');
		this.panelContentDiv = u.makeDOM('<div class="u-time-content"></div>');
		this.panelDiv.appendChild(this.panelContentDiv);
		this.panelHourDiv = u.makeDOM('<div class="u-time-cell"></div>');
		this.panelContentDiv.appendChild(this.panelHourDiv);
		this.panelHourInput = u.makeDOM('<input class="u-time-input">');
		this.panelHourDiv.appendChild(this.panelHourInput);
		this.panelMinDiv = u.makeDOM('<div class="u-time-cell"></div>');
		this.panelContentDiv.appendChild(this.panelMinDiv);
		this.panelMinInput = u.makeDOM('<input class="u-time-input">');
		this.panelMinDiv.appendChild(this.panelMinInput);
		this.panelSecDiv = u.makeDOM('<div class="u-time-cell"></div>');
		this.panelContentDiv.appendChild(this.panelSecDiv);
		this.panelSecInput = u.makeDOM('<input class="u-time-input">');
		this.panelSecDiv.appendChild(this.panelSecInput);
		this.panelNavDiv = u.makeDOM('<div class="u-time-nav"></div>');
		this.panelDiv.appendChild(this.panelNavDiv);
		this.panelOKButton = u.makeDOM('<button class="u-button" style="float:right;">OK</button>');
		this.panelNavDiv.appendChild(this.panelOKButton);
		this.panelOKButton.addEventListener('click', function(){
			var v = oThis.panelHourInput.value + ':' + oThis.panelMinInput.value + ':' + oThis.panelSecInput.value;
			oThis.setValue(v);
			oThis.hide();
		});
		this.panelCancelButton = u.makeDOM('<button class="u-button" style="float:right;">Cancel</button>');
		this.panelNavDiv.appendChild(this.panelCancelButton);
		this.panelCancelButton.addEventListener('click', function(){
			oThis.hide();
		});
		
		var d = new Date();
		this.panelHourInput.value = d.getHours() > 9? '' + d.getHours():'0' + d.getHours();
		this.panelMinInput.value = d.getMinutes() > 9? '' + d.getMinutes():'0' + d.getMinutes();	
		this.panelSecInput.value = d.getSeconds() > 9? '' + d.getSeconds():'0' + d.getSeconds();
		this.element.parentNode.appendChild(this.panelDiv);
	}
	
	u.Time.fn.setValue = function(value) {
		var hour = '',min = '', sec = '';
		value = value? value: '';
		if (value == this.input.value) return;
		if(value && value.indexOf(':') > -1){
			var vA = value.split(":");
			var hour = vA[0];
			hour = hour % 24;
			hour = hour > 9 ?'' + hour : '0' + hour;
			var min = vA[1];
			min = min % 60;
			min = min > 9 ?'' + min : '0' + min;
			var sec = vA[2];
			sec = sec % 60;
			sec = sec > 9 ?'' + sec : '0' + sec;
			
			value = hour + ':' + min + ':' + sec;
		}
		this.input.value = value;
		this.createPanel();
		
		this.panelHourInput.value = hour;
		this.panelMinInput.value = min;	
		this.panelSecInput.value = sec;
		this.trigger('valueChange', {value:value})
	}
	
	u.Time.fn.focusEvent = function() {
		var self = this;
		u.on(this.element,'click', function(e) {
			self.show(e);

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		});
	}
	
	//下拉图标的点击事件
	u.Time.fn.clickEvent = function() {
		var self = this;		
		var caret = this.element.nextSibling
		u.on(caret,'click',function(e) {
			self.show(e);
			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		})
	}


	u.Time.fn.show = function(evt) {
		var oThis = this;
		this.createPanel();
		
		/*因为元素可能变化位置，所以显示的时候需要重新计算*/
		this.width = this.element.offsetWidth;
		if(this.width < 300)
			this.width = 300;
        this.left = this.element.offsetLeft;
        var inputHeight = this.element.offsetHeight;
        this.top = this.element.offsetTop + inputHeight;
		
		this.panelDiv.style.width = this.width + 'px';
		this.panelDiv.style.left = this.left + 'px';
		this.panelDiv.style.top = this.top + 'px';
		this.panelDiv.style.zIndex = u.getZIndex();
        u.addClass(this.panelDiv, 'is-visible');
        
   
        
        var callback = function (e) {
            if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target)) {
                document.removeEventListener('click', callback);
                this.hide();
            }
        }.bind(this);
        document.addEventListener('click', callback);
	}
	
	u.Time.fn.clickPanel = function(dom){
		while(dom){
			if(dom == this.panelDiv){
				return true
			}else{
				dom = dom.parentNode;
			}
		}
		return false;
	}

	u.Time.fn.hide = function() {
		u.removeClass(this.panelDiv, 'is-visible');
        this.panelDiv.style.zIndex = -1;
	}

	if (u.compMgr)
	
	u.compMgr.regComp({
		comp: u.Time,
		compAsString: 'u.Time',
		css: 'u-time'
	})


u.YearMonth = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			u.addClass(this.element,'u-text');
			
			var d = new Date();
			this.year = d.getFullYear();
			this.startYear = this.year - this.year % 10 - 1;
			this.month = d.getMonth() + 1;
			
			u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
	        
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

u.YearMonth.fn = u.YearMonth.prototype;

u.YearMonth.fn.createPanel = function(){
	if(this.panelDiv){
		this._fillYear();
		return;
	}
	var oThis = this;
	this.panelDiv = u.makeDOM('<div class="u-combo-ul" style="padding:0px;"></div>');
	this.panelContentDiv = u.makeDOM('<div class="u-date-content"></div>');
	this.panelDiv.appendChild(this.panelContentDiv);
	
	this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button flat floating mini" style="display:none;">&lt;</button>');
    this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button flat floating mini" style="display:none;">&gt;</button>');
	
	u.on(this.preBtn, 'click', function(e){
        oThis.startYear -= 10;
        oThis._fillYear();
    });
    u.on(this.nextBtn, 'click', function(e){
        oThis.startYear += 10;
        oThis._fillYear();
    });
    this.panelContentDiv.appendChild(this.preBtn);
    this.panelContentDiv.appendChild(this.nextBtn);
    this._fillYear();
	this.element.parentNode.appendChild(this.panelDiv);
}

/**
 *填充年份选择面板
 * @private
 */
u.YearMonth.fn._fillYear = function(type){
    var oldPanel,year,template,yearPage,titleDiv,yearDiv, i,cell;
    oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
    if(oldPanel)
    	oldPanel.remove();
    template = ['<div class="u-date-content-page">',
                    '<div class="u-date-content-title"></div>',
                    '<div class="u-date-content-panel"></div>',
                '</div>'].join("");
    yearPage = u.makeDOM(template);
    titleDiv = yearPage.querySelector('.u-date-content-title');
    titleDiv.innerHTML = (this.startYear) + '-' + (this.startYear + 11);
    yearDiv = yearPage.querySelector('.u-date-content-panel');
    for(i = 0; i < 12; i++){
        cell = u.makeDOM('<div class="u-date-content-year-cell">'+ (this.startYear + i) +'</div>');
        new URipple(cell);
        if (this.startYear + i == this.year){
            u.addClass(cell, 'current');
        }
        cell._value = this.startYear + i;
        yearDiv.appendChild(cell);
    }
    u.on(yearDiv, 'click', function(e){
        var _y = e.target._value;
        this.year = _y;
        this._fillMonth();
        u.stopEvent(e);
    }.bind(this));
	
	this.preBtn.style.display = 'block';
	this.nextBtn.style.display = 'block';
	this.panelContentDiv.appendChild(yearPage);
	
    this.currentPanel = 'year';
};

/**
 * 填充月份选择面板
 * @private
 */
u.YearMonth.fn._fillMonth = function(){
    var oldPanel,template,monthPage,_month,cells,i;
    oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
    if(oldPanel)
    	oldPanel.remove();
    _month = this.month;
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">'+_month+'月</div>',
        '<div class="u-date-content-panel">',
            '<div class="u-date-content-year-cell">1月</div>',
            '<div class="u-date-content-year-cell">2月</div>',
            '<div class="u-date-content-year-cell">3月</div>',
            '<div class="u-date-content-year-cell">4月</div>',
            '<div class="u-date-content-year-cell">5月</div>',
            '<div class="u-date-content-year-cell">6月</div>',
            '<div class="u-date-content-year-cell">7月</div>',
            '<div class="u-date-content-year-cell">8月</div>',
            '<div class="u-date-content-year-cell">9月</div>',
            '<div class="u-date-content-year-cell">10月</div>',
            '<div class="u-date-content-year-cell">11月</div>',
            '<div class="u-date-content-year-cell">12月</div>',
        '</div>',
        '</div>'].join("");

    monthPage = u.makeDOM(template);
    cells =monthPage.querySelectorAll('.u-date-content-year-cell');
    for (i = 0; i < cells.length; i++){
        if (_month == i + 1){
            u.addClass(cells[i],'current');
        }
        cells[i]._value = i + 1;
        new URipple(cells[i]);
    }
    u.on(monthPage, 'click', function(e){
        var _m = e.target._value;
        this.month = _m;
        monthPage.querySelector('.u-date-content-title').innerHTML = _m + '月';
        this.setValue(this.year + '-' + this.month);
        this.hide();
    }.bind(this));
    
    this.preBtn.style.display = 'none';
	this.nextBtn.style.display = 'none';
    this.panelContentDiv.appendChild(monthPage);
    this.currentPanel = 'month';
};




u.YearMonth.fn.setValue = function(value) {
	value = value? value: '';
	if(value && value.indexOf('-') > -1){
		var vA = value.split("-");
		this.year = vA[0];
		var month = vA[1];
		this.month = month % 12;
		if(this.month == 0)
			this.month = 12;
	
		value = this.year + '-' + this.month;
	}
	this.value = value;
	this.input.value = value;
	this.trigger('valueChange', {value:value})
}

u.YearMonth.fn.focusEvent = function() {
	var self = this;
	u.on(this.element,'click', function(e) {
		self.show(e);

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	});
}

//下拉图标的点击事件
u.YearMonth.fn.clickEvent = function() {
	var self = this;		
	var caret = this.element.nextSibling
	u.on(caret,'click',function(e) {
		self.show(e);
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	})
}


u.YearMonth.fn.show = function(evt) {
	var oThis = this;
	if(this.value && this.value.indexOf('-') > -1){
		var vA = this.value.split("-");
		this.year = vA[0];
		var month = vA[1];
		this.month = month % 12;
		if(this.month == 0)
			this.month = 12;
	}
	this.createPanel();
	/*因为元素可能变化位置，所以显示的时候需要重新计算*/
	this.width = this.element.offsetWidth;
	if(this.width < 300)
		this.width = 300;
    this.left = this.element.offsetLeft;
    var inputHeight = this.element.offsetHeight;
    this.top = this.element.offsetTop + inputHeight;
	
	this.panelDiv.style.width = this.width + 'px';
	this.panelDiv.style.left = this.left + 'px';
	this.panelDiv.style.top = this.top + 'px';
	this.panelDiv.style.zIndex = u.getZIndex();
    u.addClass(this.panelDiv, 'is-visible');
        
    var callback = function (e) {
        if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target)) {
            document.removeEventListener('click', callback);
        	this.hide();
    	}
    }.bind(this);
    document.addEventListener('click', callback);
}

u.YearMonth.fn.clickPanel = function(dom){
	while(dom){
		if(dom == this.panelDiv){
			return true
		}else{
			dom = dom.parentNode;
		}
	}
	return false;
}

u.YearMonth.fn.hide = function() {
	u.removeClass(this.panelDiv, 'is-visible');
    this.panelDiv.style.zIndex = -1;
}

if (u.compMgr)

u.compMgr.regComp({
	comp: u.YearMonth,
	compAsString: 'u.YearMonth',
	css: 'u-yearmonth'
})


u.Year = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			u.addClass(this.element,'u-text');
			
			var d = new Date();
			this.year = d.getFullYear();
			this.defaultYear = this.year;
			this.startYear = this.year - this.year % 10 - 1;
		
			u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
	        
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

u.Year.fn = u.Year.prototype;

u.Year.fn.createPanel = function(){
	if(this.panelDiv){
		this._fillYear();
		return;
	}
	var oThis = this;
	this.panelDiv = u.makeDOM('<div class="u-combo-ul" style="padding:0px;"></div>');
	this.panelContentDiv = u.makeDOM('<div class="u-date-content"></div>');
	this.panelDiv.appendChild(this.panelContentDiv);
	
	this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button flat floating mini" style="display:none;">&lt;</button>');
    this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button flat floating mini" style="display:none;">&gt;</button>');
	
	u.on(this.preBtn, 'click', function(e){
        oThis.startYear -= 10;
        oThis._fillYear();
    });
    u.on(this.nextBtn, 'click', function(e){
        oThis.startYear += 10;
        oThis._fillYear();
    });
    this.panelContentDiv.appendChild(this.preBtn);
    this.panelContentDiv.appendChild(this.nextBtn);
    this._fillYear();
	this.element.parentNode.appendChild(this.panelDiv);
}

/**
 *填充年份选择面板
 * @private
 */
u.Year.fn._fillYear = function(type){
    var oldPanel,year,template,yearPage,titleDiv,yearDiv, i,cell;
    oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
    if(oldPanel)
    	oldPanel.remove();
    template = ['<div class="u-date-content-page">',
                    '<div class="u-date-content-title"></div>',
                    '<div class="u-date-content-panel"></div>',
                '</div>'].join("");
    yearPage = u.makeDOM(template);
    titleDiv = yearPage.querySelector('.u-date-content-title');
    titleDiv.innerHTML = (this.startYear) + '-' + (this.startYear + 11);
    yearDiv = yearPage.querySelector('.u-date-content-panel');
    for(i = 0; i < 12; i++){
        cell = u.makeDOM('<div class="u-date-content-year-cell">'+ (this.startYear + i) +'</div>');
        new URipple(cell);
        if (this.startYear + i == this.year){
            u.addClass(cell, 'current');
        }
        cell._value = this.startYear + i;
        yearDiv.appendChild(cell);
    }
    u.on(yearDiv, 'click', function(e){
        var _y = e.target._value;
        this.year = _y;
        this.setValue(_y);
        this.hide();
        u.stopEvent(e);
    }.bind(this));
	
	this.preBtn.style.display = 'block';
	this.nextBtn.style.display = 'block';
	this.panelContentDiv.appendChild(yearPage);
	
    this.currentPanel = 'year';
};

u.Year.fn.setValue = function(value) {
	value = value? value: '';
	this.value = value;
	if(value){
		this.year = value;
	}else{
		this.year = this.defaultYear;
	}
	this.startYear = this.year - this.year % 10 - 1;
	this.input.value = value;
	this.trigger('valueChange', {value:value})
}

u.Year.fn.focusEvent = function() {
	var self = this;
	u.on(this.element,'click', function(e) {
		self.show(e);

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	});
}

//下拉图标的点击事件
u.Year.fn.clickEvent = function() {
	var self = this;		
	var caret = this.element.nextSibling
	u.on(caret,'click',function(e) {
		self.show(e);
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	})
}


u.Year.fn.show = function(evt) {
	var oThis = this;
	this.createPanel();
	
	this.width = this.element.offsetWidth;
	if(this.width < 300)
		this.width = 300;
    this.left = this.element.offsetLeft;
    var inputHeight = this.element.offsetHeight;
    this.top = this.element.offsetTop + inputHeight;
	this.panelDiv.style.width = this.width + 'px';
	this.panelDiv.style.left = this.left + 'px';
	this.panelDiv.style.top = this.top + 'px';
	this.panelDiv.style.zIndex = u.getZIndex();
    u.addClass(this.panelDiv, 'is-visible');
        
    var callback = function (e) {
        if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target)) {
            document.removeEventListener('click', callback);
        	this.hide();
    	}
    }.bind(this);
    document.addEventListener('click', callback);
}

u.Year.fn.clickPanel = function(dom){
	while(dom){
		if(dom == this.panelDiv){
			return true
		}else{
			dom = dom.parentNode;
		}
	}
	return false;
}

u.Year.fn.hide = function() {
	u.removeClass(this.panelDiv, 'is-visible');
    this.panelDiv.style.zIndex = -1;
}

if (u.compMgr)

u.compMgr.regComp({
	comp: u.Year,
	compAsString: 'u.Year',
	css: 'u-year'
})


u.Month = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			u.addClass(this.element,'u-text');
			
			var d = new Date();
			this.month = d.getMonth() + 1;
			this.defaultMonth = this.month;
			
			u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
	        
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

u.Month.fn = u.Month.prototype;

u.Month.fn.createPanel = function(){
	if(this.panelDiv){
		this._fillMonth();
		return;
	}
	var oThis = this;
	this.panelDiv = u.makeDOM('<div class="u-combo-ul" style="padding:0px;"></div>');
	this.panelContentDiv = u.makeDOM('<div class="u-date-content"></div>');
	this.panelDiv.appendChild(this.panelContentDiv);
	
	this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button flat floating mini" style="display:none;">&lt;</button>');
    this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button flat floating mini" style="display:none;">&gt;</button>');
	
	u.on(this.preBtn, 'click', function(e){
        oThis.startYear -= 10;
        oThis._fillYear();
    });
    u.on(this.nextBtn, 'click', function(e){
        oThis.startYear += 10;
        oThis._fillYear();
    });
    this.panelContentDiv.appendChild(this.preBtn);
    this.panelContentDiv.appendChild(this.nextBtn);
    this._fillMonth();
	this.element.parentNode.appendChild(this.panelDiv);
}


/**
 * 填充月份选择面板
 * @private
 */
u.Month.fn._fillMonth = function(){
    var oldPanel,template,monthPage,_month,cells,i;
    oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
    if(oldPanel)
    	oldPanel.remove();
    _month = this.month;
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">'+_month+'月</div>',
        '<div class="u-date-content-panel">',
            '<div class="u-date-content-year-cell">1月</div>',
            '<div class="u-date-content-year-cell">2月</div>',
            '<div class="u-date-content-year-cell">3月</div>',
            '<div class="u-date-content-year-cell">4月</div>',
            '<div class="u-date-content-year-cell">5月</div>',
            '<div class="u-date-content-year-cell">6月</div>',
            '<div class="u-date-content-year-cell">7月</div>',
            '<div class="u-date-content-year-cell">8月</div>',
            '<div class="u-date-content-year-cell">9月</div>',
            '<div class="u-date-content-year-cell">10月</div>',
            '<div class="u-date-content-year-cell">11月</div>',
            '<div class="u-date-content-year-cell">12月</div>',
        '</div>',
        '</div>'].join("");

    monthPage = u.makeDOM(template);
    cells =monthPage.querySelectorAll('.u-date-content-year-cell');
    for (i = 0; i < cells.length; i++){
        if (_month == i + 1){
            u.addClass(cells[i],'current');
        }
        cells[i]._value = i + 1;
        new URipple(cells[i]);
    }
    u.on(monthPage, 'click', function(e){
        var _m = e.target._value;
        this.month = _m;
        monthPage.querySelector('.u-date-content-title').innerHTML = _m + '月';
        this.setValue(_m);
        this.hide();
    }.bind(this));
    
    this.preBtn.style.display = 'none';
	this.nextBtn.style.display = 'none';
    this.panelContentDiv.appendChild(monthPage);
    this.currentPanel = 'month';
};




u.Month.fn.setValue = function(value) {
	value = value? value: '';
	this.value = value;
	if(value){
		this.month = value;
	}else{
		this.month = this.defaultMonth;
	}
	this.input.value = value;
	this.trigger('valueChange', {value:value})
}

u.Month.fn.focusEvent = function() {
	var self = this;
	u.on(this.element,'click', function(e) {
		self.show(e);

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	});
}

//下拉图标的点击事件
u.Month.fn.clickEvent = function() {
	var self = this;		
	var caret = this.element.nextSibling
	u.on(caret,'click',function(e) {
		self.show(e);
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	})
}


u.Month.fn.show = function(evt) {
	var oThis = this;
	this.createPanel();
	
	this.width = this.element.offsetWidth;
	if(this.width < 300)
		this.width = 300;
    this.left = this.element.offsetLeft;
    var inputHeight = this.element.offsetHeight;
    this.top = this.element.offsetTop + inputHeight;
	        
	this.panelDiv.style.width = this.width + 'px';
	this.panelDiv.style.left = this.left + 'px';
	this.panelDiv.style.top = this.top + 'px';
	this.panelDiv.style.zIndex = u.getZIndex();
    u.addClass(this.panelDiv, 'is-visible');
        
    var callback = function (e) {
        if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target)) {
            document.removeEventListener('click', callback);
        	this.hide();
    	}
    }.bind(this);
    document.addEventListener('click', callback);
}

u.Month.fn.clickPanel = function(dom){
	while(dom){
		if(dom == this.panelDiv){
			return true
		}else{
			dom = dom.parentNode;
		}
	}
	return false;
}

u.Month.fn.hide = function() {
	u.removeClass(this.panelDiv, 'is-visible');
    this.panelDiv.style.zIndex = -1;
}

if (u.compMgr)

u.compMgr.regComp({
	comp: u.Month,
	compAsString: 'u.Month',
	css: 'u-month'
})


/**
 * Created by dingrf on 2015-11-20.
 */

u.Combo = u.BaseComponent.extend({
    init: function () {
        this.mutilSelect = this.options['mutilSelect'] || false;
        if (u.hasClass(this.element, 'mutil-select')){
            this.mutilSelect = true
        }
        this.comboDatas = [];
        var i, option, datas = [], self = this;
        u.addClass(this.element, 'u-text')
        new u.Text(this.element);
        var options = this.element.querySelectorAll('option');
        for (i = 0; i < options.length; i++) {
            option = options[i];
            datas.push({value: option.value, name: option.text});
        }
        this.setComboData(datas);
        this._input = this.element.querySelector("input");
        u.on(this._input, 'focus', function (e) {
            self.show(e);
            u.stopEvent(e);
        })
    },


    show: function (evt) {
        var height = 48 * this.comboDatas.length,
            inputHeight = this.element.offsetHeight,
            width = this.element.offsetWidth,
            left = this.element.offsetLeft,
            top = this.element.offsetTop + inputHeight;

        this._ul.style.width = width + 'px';
        this._ul.style.height = height + 'px';
        this._ul.style.left = left + 'px';
        this._ul.style.top = top + 'px';

        u.addClass(this._ul, 'is-animating');
        //this._ul.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
        this._ul.style.zIndex = u.getZIndex();
        u.addClass(this._ul, 'is-visible');

        var callback = function (e) {
            if (e !== evt && e.target !== this._input) {
                document.removeEventListener('click', callback);
                this.hide();
            }
        }.bind(this);
        document.addEventListener('click', callback);

    },

    hide: function () {
        u.removeClass(this._ul, 'is-visible');
        this._ul.style.zIndex = -1;
    },

    setComboData: function (datas) {
        var i, li, self = this;
        this.comboDatas = datas;
        if (!this._ul) {
            this._ul = u.makeDOM('<ul class="u-combo-ul"></ul>');
            this.element.parentNode.appendChild(this._ul);
        }
        this._ul.innerHTML = '';
        //TODO 增加filter


        for (i = 0; i < this.comboDatas.length; i++) {
            li = u.makeDOM('<li class="u-combo-li">' + this.comboDatas[i].name + '</li>');//document.createElement('li');
            li._index = i;
            u.on(li, 'click', function () {
                self.selectItem(this._index);
            })
            var rippleContainer = document.createElement('span');
            u.addClass(rippleContainer, 'u-ripple');
            li.appendChild(rippleContainer);
            new URipple(li)
            this._ul.appendChild(li);
        }
    },

    selectItem: function (index) {
        var self = this;
        if (this.mutilSelect){
            var val = this.comboDatas[index].value;
            var name = this.comboDatas[index].name;
            if ((this.value + ',').indexOf(val + ',') != -1)
                return;
            this.value = (!this.value) ? val : this.value + ',' + val;
            var nameDiv= u.makeDOM('<div class="u-combo-name">'+ name +'<a href="javascript:void(0)" class="remove">x</a></div>');
            var _a = nameDiv.querySelector('a');
            u.on(_a, 'click', function(){
                var values = self.value.split(',');
                values.splice(values.indexOf(val),1);
                self.value = values.join(',');
                self.element.removeChild(nameDiv);
            });
            this.element.insertBefore(nameDiv, this._input);
            this.trigger('select', {value: this.value, name: name});
        }else{
            this.value = this.comboDatas[index].value;
            this._input.value = this.comboDatas[index].name;
            this.trigger('select', {value: this.value, name: this._input.value});
        }
    },

    /**
     *设置值
     * @param value
     */
    setValue: function(value){
    	value = value || '';
    	value = value + '';
        var values = value.split(',');
        this.comboDatas.forEach(function(item, index){
            if (this.mutilSelect === true){
                if (values.indexOf(item.value) != -1){
                    this.selectItem(index)
                }
            }else {
                if (item.value === value) {
                    this.selectItem(index);
                    return;
                }
            }
        }.bind(this));
    },

    /**
     * 设置显示名
     * @param name
     */
    setName: function(name){
        this.comboDatas.forEach(function(item, index){
            if(item.name === name){
                this.selectItem(index);
                return;
            }
        }.bind(this));
    }

});

u.compMgr.regComp({
    comp: u.Combo,
    compAsString: 'u.Combo',
    css: 'u-combo'
})
u.Table = u.BaseComponent.extend({
    _CssClasses: {

        SELECTABLE: 'selectable',
        SELECT_ELEMENT: 'u-table-select',
        IS_SELECTED: 'is-selected',
        IS_UPGRADED: 'is-upgraded'
    },

    init: function(){
        var self = this;
        this.element_ = this.element;
        if (this.element_) {
            var firstHeader = this.element_.querySelector('th');
            var bodyRows = Array.prototype.slice.call(this.element_.querySelectorAll('tbody tr'));
            var footRows = Array.prototype.slice.call(this.element_.querySelectorAll('tfoot tr'));
            var rows = bodyRows.concat(footRows);

            //if (this.element_.classList.contains(this._CssClasses.SELECTABLE)) {
            //    var th = document.createElement('th');
            //    var headerCheckbox = this._createCheckbox(null, rows);
            //    th.appendChild(headerCheckbox);
            //    firstHeader.parentElement.insertBefore(th, firstHeader);
            //
            //    for (var i = 0; i < rows.length; i++) {
            //        var firstCell = rows[i].querySelector('td');
            //        if (firstCell) {
            //            var td = document.createElement('td');
            //            if (rows[i].parentNode.nodeName.toUpperCase() === 'TBODY') {
            //                var rowCheckbox = this._createCheckbox(rows[i]);
            //                td.appendChild(rowCheckbox);
            //            }
            //            rows[i].insertBefore(td, firstCell);
            //        }
            //    }
            //    this.element_.classList.add(this._CssClasses.IS_UPGRADED);
            //}
        }
    },
    _selectRow: function(checkbox, row, opt_rows){
        if (row) {
            return function () {
                if (checkbox.checked) {
                    row.classList.add(this._CssClasses.IS_SELECTED);
                } else {
                    row.classList.remove(this._CssClasses.IS_SELECTED);
                }
            }.bind(this);
        }

        if (opt_rows) {
            return function () {
                var i;
                var el;
                if (checkbox.checked) {
                    for (i = 0; i < opt_rows.length; i++) {
                        el = opt_rows[i].querySelector('td').querySelector('.u-checkbox');
                        // el['MaterialCheckbox'].check();
                        opt_rows[i].classList.add(this._CssClasses.IS_SELECTED);
                    }
                } else {
                    for (i = 0; i < opt_rows.length; i++) {
                        el = opt_rows[i].querySelector('td').querySelector('.u-checkbox');
                        //el['MaterialCheckbox'].uncheck();
                        opt_rows[i].classList.remove(this._CssClasses.IS_SELECTED);
                    }
                }
            }.bind(this);
        }
    },
    _createCheckbox: function(row, opt_rows){
        var label = document.createElement('label');
        var labelClasses = [
            'u-checkbox',
            this._CssClasses.SELECT_ELEMENT
        ];
        label.className = labelClasses.join(' ');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('u-checkbox-input');

        if (row) {
            checkbox.checked = row.classList.contains(this._CssClasses.IS_SELECTED);
            checkbox.addEventListener('change', this._selectRow(checkbox, row));

        } else if (opt_rows) {
            checkbox.addEventListener('change', this._selectRow(checkbox, null, opt_rows));
        }

        label.appendChild(checkbox);
        new u.Checkbox(label);
        return label;
    }

});



if (u.compMgr)
    u.compMgr.regComp({
        comp: u.Table,
        compAsString: 'u.Table',
        css: 'u-table'
    })
	u.pagination = u.BaseComponent.extend({
		
	})

	var PageProxy = function(options, page) {
		this.isCurrent = function() {
			return page == options.currentPage;
		}

		this.isFirst = function() {
			return page == 1;
		}

		this.isLast = function() {
			return page == options.totalPages;
		}

		this.isPrev = function() {
			return page == (options.currentPage - 1);
		}

		this.isNext = function() {
			return page == (options.currentPage + 1);
		}

		this.isLeftOuter = function() {
			return page <= options.outerWindow;
		}


		this.isRightOuter = function() {
			return (options.totalPages - page) < options.outerWindow;
		}

		this.isInsideWindow = function() {
			if (options.currentPage < options.innerWindow + 1) {
				return page <= ((options.innerWindow * 2) + 1);
			} else if (options.currentPage > (options.totalPages - options.innerWindow)) {
				return (options.totalPages - page) <= (options.innerWindow * 2);
			} else {
				return Math.abs(options.currentPage - page) <= options.innerWindow;
			}
		}

		this.number = function() {
			return page;
		}
		this.pageSize = function() {
			return options.pageSize;

		}
	}

	var View = {
		firstPage: function(pagin, options, currentPageProxy) {
			return '<li role="first"' + (currentPageProxy.isFirst() ? 'class="disabled"' : '') + '><a href="#">' + options.first + '</a></li>';
		},

		prevPage: function(pagin, options, currentPageProxy) {
			return '<li role="prev"' + (currentPageProxy.isFirst() ? 'class="disabled"' : '') + '><a href="#" rel="prev">' + options.prev + '</a></li>';
		},

		nextPage: function(pagin, options, currentPageProxy) {
			return '<li role="next"' + (currentPageProxy.isLast() ? 'class="disabled"' : '') + '><a href="#" rel="next">' + options.next + '</a></li>';
		},

		lastPage: function(pagin, options, currentPageProxy) {

			return '<li role="last"' + (currentPageProxy.isLast() ? 'class="disabled"' : '') + '><a href="#">' + options.last + '</a></li>';
		},

		gap: function(pagin, options) {
			return '<li role="gap" class="disabled"><a href="#">' + options.gap + '</a></li>';
		},

		page: function(pagin, options, pageProxy) {
			return '<li role="page"' + (pageProxy.isCurrent() ? 'class="active"' : '') + '><a href="#"' + (pageProxy.isNext() ? ' rel="next"' : '') + (pageProxy.isPrev() ? 'rel="prev"' : '') + '>' + pageProxy.number() + '</a></li>';
		}

	}



	u.pagination.prototype.init = function(element, options) {
		var self = this;			 
		var element = this.element;
		this.$element = element;
		this.options = u.extend({}, this.DEFAULTS, this.options);
		this.$ul = this.$element; //.find("ul");
		this.render();
	}

	u.pagination.prototype.DEFAULTS = {
		currentPage: 1,
		totalPages: 10,
		pageSize: 20,
		innerWindow: 2,
		outerWindow: 0,
		first: '&laquo;',
		prev: '&lsaquo;',
		next: '&rsaquo;',
		last: '&raquo;',
		gap: '..',
		totalText: '合计:',
		truncate: false,
		page: function(page) {
			return true
		}
	}

	u.pagination.prototype.update = function(options) {
		this.$ul.innerHTML="";
		this.options = u.extend({}, this.options, options);
		this.render();
	}
	u.pagination.prototype.render = function() {
		var a = (new Date()).valueOf()

		var options = this.options;

		if (!options.totalPages) {
			this.$element.style.display = "none";
			return;
		} else {
			this.$element.style.display = "block";
		}

		var htmlArr = []
		var currentPageProxy = new PageProxy(options, options.currentPage);

		if (!currentPageProxy.isFirst() || !options.truncate) {
			if (options.first) {
				htmlArr.push(View.firstPage(this, options, currentPageProxy))
			}

			if (options.prev) {
				htmlArr.push(View.prevPage(this, options, currentPageProxy));
			}
		}

		var wasTruncated = false;

		for (var i = 1, length = options.totalPages; i <= length; i++) {
			var pageProxy = new PageProxy(options, i);
			if (pageProxy.isLeftOuter() || pageProxy.isRightOuter() || pageProxy.isInsideWindow()) {
				htmlArr.push(View.page(this, options, pageProxy));
				wasTruncated = false;
			} else {
				if (!wasTruncated && options.outerWindow > 0) {
					htmlArr.push(View.gap(this, options));
					wasTruncated = true;
				}
			}
		}

		if (!currentPageProxy.isLast() || !options.truncate) {
			if (options.next) {
				htmlArr.push(View.nextPage(this, options, currentPageProxy));
			}

			if (options.last) {
				htmlArr.push(View.lastPage(this, options, currentPageProxy));
			}
		}

		if (options.totalCount > 0) {
			var htmlStr = '<li><a style="cursor:default;background-color:#FFF;">' + options.totalText + options.totalCount + '</a></li>';
			htmlArr.push(htmlStr);
		}

		if (options.jumppage || options.pageSize) {
			var jumppagehtml = '<input class="page_j" style="margin-right: 6px;width: 32px;border: 1px solid #ddd; padding-left: 2px; border-radius: 3px;height:20px;" value=' + options.currentPage + '>页&nbsp;&nbsp;'
			var sizehtml = '显示<input  class="page_z"  style="margin:0px 6px;width: 32px;border: 1px solid #ddd;  padding-left: 2px; border-radius: 3px;height:20px;" value=' + options.pageSize + '>条&nbsp;&nbsp;'
			var tmpjump = "<li><a>" + (options.jumppage ? jumppagehtml : "") + (options.pageSize ? sizehtml : "") + "<i class='jump_page fa fa-arrow-circle-right' style='margin-left: 8px; cursor: pointer;'></i></a></li>";
			htmlArr.push(tmpjump)

		}

		this.$ul.insertAdjacentHTML('beforeEnd', htmlArr.join(''))

		var me = this;
		u.on(this.$ul.querySelector(".jump_page"),"click", function() {
			var jp, pz;
			jp = me.$ul.querySelector(".page_j").value || options.currentPage;
			pz = me.$ul.querySelector(".page_z").value || options.pageSize;

			//if (pz != options.pageSize){
			//	me.$element.trigger('sizeChange', [pz, jp - 1])
			//}else{
			//	me.$element.trigger('pageChange', jp - 1)
			//}
			me.page(jp, options.totalPages, pz);
			//me.$element.trigger('pageChange', jp - 1)
			//me.$element.trigger('sizeChange', pz)
			return false;
		})

		u.on(this.$ul.querySelector('[role="first"] a'),'click', function() {
			if (options.currentPage <= 1) return;
			me.firstPage();
			//me.$element.trigger('pageChange', 0)


			return false;
		})
		u.on(this.$ul.querySelector('[role="prev"] a'),'click', function() {
			if (options.currentPage <= 1) return;
			me.prevPage();
			//me.$element.trigger('pageChange', options.currentPage - 1)
			return false;
		})
		u.on(this.$ul.querySelector('[role="next"] a'),'click', function() {
			if (parseInt(options.currentPage) + 1 > options.totalPages) return;
			me.nextPage();
			//me.$element.trigger('pageChange', parseInt(options.currentPage) + 1)
			return false;
		})
		u.on(this.$ul.querySelector('[role="last"] a'),'click', function() {
			if (options.currentPage == options.totalPages) return;
			me.lastPage();
			//me.$element.trigger('pageChange', options.totalPages - 1)
			return false;
		})
		u.each(this.$ul.querySelectorAll('[role="page"] a'),function(i,node){
			u.on(node,'click', function() {
				var pz = me.$element.querySelector(".page_z").value || options.pageSize;
				me.page(parseInt(this.innerHTML), options.totalPages, pz);
				//me.$element.trigger('pageChange', parseInt($(this).html()) - 1)

				return false;
			})
		})

		
	}


	u.pagination.prototype.page = function(pageIndex, totalPages, pageSize) {

		var options = this.options;

		if (totalPages === undefined) {
			totalPages = options.totalPages;
		}
		if (pageSize === undefined) {
			pageSize = options.pageSize;
		}
		var oldPageSize = options.pageSize;
		if (pageIndex > 0 && pageIndex <= totalPages) {
			if (options.page(pageIndex)) {

				this.$ul.innerHTML="";
				options.pageSize = pageSize;
				options.currentPage = pageIndex;
				options.totalPages = totalPages;
				this.render();

			}
		}
		if (pageSize != oldPageSize){
			this.trigger('sizeChange', [pageSize, pageIndex - 1])
		}else{
			this.trigger('pageChange', pageIndex - 1)
		}
		//this.$element.trigger('pageChange', pageIndex)

		return false;
	}

	u.pagination.prototype.firstPage = function() {
		return this.page(1);
	}

	u.pagination.prototype.lastPage = function() {
		return this.page(this.options.totalPages);
	}

	u.pagination.prototype.nextPage = function() {
		return this.page(parseInt(this.options.currentPage) + 1);
	}

	u.pagination.prototype.prevPage = function() {
		return this.page(this.options.currentPage - 1);
	}

	u.pagination.prototype.disableChangeSize = function(){
		this.$element.querySelector('.page_z').setAttribute('readonly', true);
	}

	u.pagination.prototype.enableChangeSize = function(){
		this.$element.querySelector('.page_z').removeAttribute('readonly');
	}


	function Plugin(option) {
		return this.each(function() {
			var $this = $(this)
			var data = $this.data('u.pagination')
			var options = typeof option == 'object' && option

			if (!data) $this.data('u.pagination', (data = new Pagination(this, options)))
			else data.update(options);
		})
	}


	// var old = $.fn.pagination;

	// $.fn.pagination = Plugin
	// $.fn.pagination.Constructor = Pagination

	
	if (u.compMgr)
    
	u.compMgr.regComp({
		comp: u.pagination,
		compAsString: 'u.pagination',
		css: 'u-pagination'
	})
u.Tooltip = function(element,options){
	this.init(element,options)
	//this.show()
}


u.Tooltip.prototype = {
    defaults:{
        animation: true,
        placement: 'top',
        //selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow" style="left: 50%;"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    },
    init: function (element,options) {
		this.element = element
        this.options = u.extend({}, this.defaults, options);
        this._viewport = this.options.viewport && document.querySelector(this.options.viewport.selector || this.options.viewport);

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]
            if (trigger == 'click') {
                u.on(this.element, 'click', this.toggle.bind(this));
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'
                u.on(this.element, eventIn, this.enter.bind(this));
                u.on(this.element, eventOut, this.leave.bind(this));
            }
        }
        this.options.title = this.options.title || this.element.getAttribute('title');
        this.element.removeAttribute('title');
        if (this.options.delay && typeof this.options.delay == 'number') {
            this.options.delay = {
                show: this.options.delay,
                hide: this.options.delay
            }
        };
        //tip模板对应的dom
        this.tipDom = u.makeDOM(this.options.template);
        this.arrrow = this.tipDom.querySelector('.tooltip-arrow');
        // tip容器,默认为当前元素的parent
        this.container = this.options.container ? document.querySelector(this.options.container) : this.element.parentNode;
    },
    enter: function(){
        var self = this;
        clearTimeout(this.timeout);
        this.hoverState = 'in';
        if (!this.options.delay || !this.options.delay.show) return this.show();

        this.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show()
        }, this.options.delay.show)
    },
    leave: function(){
        var self = this;
        clearTimeout(this.timeout);
        self.hoverState = 'out'
        if (!self.options.delay || !self.options.delay.hide) return self.hide()
        self.timeout = setTimeout(function () {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    },
    show: function(){
        this.tipDom.querySelector('.tooltip-inner').innerHTML = this.options.title;
        this.container.appendChild(this.tipDom);
        var placement = this.options.placement;
        var pos = this.getPosition()
        var actualWidth = this.tipDom.offsetWidth
        var actualHeight = this.tipDom.offsetHeight
        var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

        this.applyPlacement(calculatedOffset, placement)


    },
    hide: function(){
		if (this.container.contains(this.tipDom)){
			u.removeClass(this.tipDom, 'active');
			this.container.removeChild(this.tipDom);
		}
    },
    applyPlacement: function(offset, placement){
        var width = this.tipDom.offsetWidth
        var height = this.tipDom.offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt(this.tipDom.style.marginTop, 10)
        var marginLeft = parseInt(this.tipDom.style.marginTop, 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop))  marginTop = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top = offset.top + marginTop
        offset.left = offset.left + marginLeft

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        this.tipDom.style.left = offset.left + 'px';
        this.tipDom.style.top = offset.top + 'px';

        u.addClass(this.tipDom,'active');

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = this.tipDom.offsetWidth
        var actualHeight =this.tipDom.offsetHeight

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }
        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) offset.left += delta.left
        else offset.top += delta.top

        var isVertical = /top|bottom/.test(placement)
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

        //$tip.offset(offset)
        this.tipDom.style.left = offset.left + 'px';
        this.tipDom.style.top = offset.top - 4 + 'px';

       // this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)

    },
    getCalculatedOffset: function(placement, pos, actualWidth, actualHeight){
        return placement == 'bottom' ? {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2} :
            placement == 'top' ? {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2} :
                placement == 'left' ? {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth} :
                    /* placement == 'right' */ {
                    top: pos.top + pos.height / 2 - actualHeight / 2,
                    left: pos.left + pos.width
                }
    },
    getPosition: function(el){
        el = el || this.element;
        var isBody = el.tagName == 'BODY';
        var elRect = el.getBoundingClientRect()
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = u.extend({}, elRect, {width: elRect.right - elRect.left, height: elRect.bottom - elRect.top})
        }
        var elOffset = isBody ? {top: 0, left: 0} : {top:el.offsetTop, left: el.offsetLeft};
        var scroll = {scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : el.scrollTop}
        var outerDims = isBody ? {width: window.innerWidth || document.body.clientWidth, height: window.innerHeight || document.body.clientHeight} : null
		//return u.extend({}, elRect, scroll, outerDims, elOffset)
        return u.extend({}, elRect, scroll, outerDims)

    },
    getViewportAdjustedDelta: function(placement, pos, actualWidth, actualHeight){
        var delta = {top: 0, left: 0}
        if (!this._viewport) return delta

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this.getPosition(this._viewport)

        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    },
    replaceArrow: function(delta, dimension, isHorizontal){
        if (isHorizontal){
            this.arrow.style.left = 50 * (1 - delta / dimension) + '%';
            this.arrow.style.top = '';
        }else{
            this.arrow.style.top = 50 * (1 - delta / dimension) + '%';
            this.arrow.style.left = '';
        }
    },
    destory: function(){

    }

};
	u.Validate = u.BaseComponent.extend({
		
		init : function() {
			var self = this
			this.$element =this.element			
			this.$form = this.form
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.required = false
			this.timeout = null
			//所有属性优先级 ：  options参数  > attr属性  > 默认值
			this.required = this.options['required']  ? this.options['required']  : false
			this.validType = this.options['validType'] ? this.options['validType'] : null
			//校验模式  blur  submit
			this.validMode = this.options['validMode'] ? this.options['validMode'] : u.Validate.DEFAULTS.validMode
			//空提示
			this.nullMsg = this.options['nullMsg'] ? this.options['nullMsg'] : u.Validate.NULLMSG[this.validType]
			//是否必填
			if (this.required && !this.nullMsg)
				this.nullMsg = u.Validate.NULLMSG['required']
			//错误必填
			this.errorMsg = this.options['errorMsg'] ? this.options['errorMsg'] : u.Validate.ERRORMSG[this.validType]
			//正则校验
			this.regExp = this.options['reg'] ? this.options['reg']: u.Validate.REG[this.validType]
			//提示div的id 为空时使用tooltop来提示
			this.tipId = this.options['tipId'] ? this.options['tipId'] : null
			//提示框位置
			this.placement = this.options['placement'] ? this.options['placement'] : u.Validate.DEFAULTS.placement
			//
			this.minLength = this.options['minLength'] > 0 ? this.options['minLength'] : null
			this.maxLength = this.options['maxLength'] > 0 ? this.options['maxLength'] : null
			this.min = this.options['min'] !== undefined  ? this.options['min'] : null
			this.max = this.options['max'] !== undefined ? this.options['max'] : null
			this.minNotEq = this.options['minNotEq'] !== undefined ? this.options['minNotEq'] : null
			this.maxNotEq = this.options['maxNotEq'] !== undefined ? this.options['maxNotEq'] : null
			this.min = u.isNumber(this.min) ? this.min : null
			this.max = u.isNumber(this.max) ? this.max : null
			this.minNotEq = u.isNumber(this.minNotEq) ? this.minNotEq : null
			this.maxNotEq = u.isNumber(this.maxNotEq) ? this.maxNotEq : null
			this.create()
		}
	});
		
	
	

	
	u.Validate.fn = u.Validate.prototype
	//u.Validate.tipTemplate = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow tooltip-arrow-c"></div><div class="tooltip-arrow"></div><div class="tooltip-inner" style="color:#ed7103;border:1px solid #ed7103;background-color:#fff7f0;"></div></div>'
	
	u.Validate.DEFAULTS = {
			validMode: 'blur',
			placement: "top"
		}
	
	u.Validate.NULLMSG = {
		"required": trans('validate.required', "不能为空！"),
		"integer": trans('validate.integer', "请填写整数！"),
		"float": trans('validate.float', "请填写数字！"),
		"zipCode": trans('validate.zipCode', "请填写邮政编码！"),
		"phone": trans('validate.phone', "请填写手机号码！"),
		"email": trans('validate.email', "请填写邮箱地址！"),
		"url": trans('validate.url', "请填写网址！"),
		"datetime": trans('validate.datetime', "请填写日期！")

	}

	u.Validate.ERRORMSG = {
		"integer": trans('validate.integer', "请填写整数！"),
		"float": trans('validate.float', "请填写数字！"),
		"zipCode": trans('validate.zipCode', "邮政编码格式不对！"),
		"phone": trans('validate.phone', "手机号码格式不对！"),
		"email": trans('validate.email', "邮箱地址格式不对！"),
		"url": trans('validate.url', "网址格式不对！"),
		"datetime": trans('validate.datetime', "日期格式不对！")
	}

	u.Validate.REG = {
		"integer": /^-?\d+$/,
		"float": /^-?\d+(\.\d+)?$/,
		"zipCode": /^[0-9]{6}$/,
		"phone": /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/,
		"email": /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		"url": /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
		"datetime": /^((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/
	}

	

	

	u.Validate.fn.create = function() {
		var self = this
		u.on(this.element,'blur', function(e) {
			if (self.validMode == 'blur'){
				self.passed = self.doValid()
				
			}
		})
		u.on(this.element,'focus', function(e) {
			//隐藏错误信息
			self.hideMsg()
		})
		u.on(this.element,'change', function(e) {
			//隐藏错误信息
			self.hideMsg()
		})	
		u.on(this.element,'keydown', function(e) {
			var event = window.event || e;
			if(self["validType"] == "float"){
				var tmp = self.element.value;
				if(event.shiftKey){
					event.returnValue=false;
					return false;
				}else if(event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
					// tab键 左箭头 右箭头 delete键
					return true;
				}else if(event.ctrlKey && (event.keyCode == 67 || event.keyCode == 86)){
					//复制粘贴
					return true;
				}else if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)||(u.inArray(event.keyCode,[8,110,190,189,109]) > -1))){
					event.returnValue=false;
					return false;
				}else if((!tmp || tmp.indexOf(".") > -1) && (event.keyCode == 190 || event.keyCode == 110 )){
					event.returnValue=false;
					return false;
					
				}

				if(tmp && (tmp+'').split('.')[0].length >= 25) {
					return false;
					
				}

			}
			if(self["validType"] == "integer"){
				var tmp = self.element.value

				 if(event.shiftKey){
					event.returnValue=false;
					return false;
				}else if(event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
					// tab键 左箭头 右箭头 delete键
					return true;
				}else if(event.ctrlKey && (event.keyCode == 67 || event.keyCode == 86)){
					//复制粘贴
					return true;
				}else if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)||(u.inArray(event.keyCode,[8,109,189]) > -1))){
					event.returnValue=false;
					return false;
				}

				if(tmp && (tmp+'').split('.')[0].length >= 25) {
					return false;
				}
			}

		})
	}

	u.Validate.fn.updateOptions = function(options){

	}

	u.Validate.fn.doValid = function(pValue) {
		this.needClean = false
		if (this.element.getAttribute("readonly")) return true
		var value = null
		if (typeof pValue != 'undefined')
			value = pValue
		else
			//value = this.getValue()
			value = this.element.value
		if (this.isEmpty(value) && this.required) {
			this.showMsg(this.nullMsg)
			return false
		} else if(this.isEmpty(value) && !this.required){
			return true
		}
		if (this.regExp) {
			var reg = new RegExp(this.regExp);
			if (typeof value == 'number')
				value = value + ""
			var r = value.match(reg);
			if (r === null || r === false){
				this.showMsg(this.errorMsg)
				this.needClean = true
				return false
			}
		}
		if (this.minLength){
			if (value.lengthb() < this.minLength){
				this.showMsg("输入长度不能小于" + this.minLength + "位")
				return false
			}
		}
		if (this.maxLength){
			if (value.lengthb() > this.maxLength){
				this.showMsg("输入长度不能大于" + this.maxLength + "位")
				return false
			}
		}
		if (this.max != undefined && this.max != null){
			if (parseFloat(value) > this.max){
				this.showMsg("输入值不能大于" + this.max)
				return false
			}
		}
		if(this.min != undefined && this.min != null){
			if (parseFloat(value) < this.min){
				this.showMsg("输入值不能小于" + this.min)
				return false
			}
		}
		if (this.maxNotEq != undefined && this.maxNotEq != null){
			if (parseFloat(value) >= this.maxNotEq){
				this.showMsg("输入值不能大于或等于" + this.maxNotEq)
				return false
			}
		}
		if(this.minNotEq != undefined && this.minNotEq != null){
			if (parseFloat(value) <= this.minNotEq){
				this.showMsg("输入值不能小于或等于" + this.minNotEq)
				return false
			}
		}
		return true
	}
	
	u.Validate.fn.check = u.Validate.fn.doValid;

//	Validate.fn.getValue = function() {
//		var inputval
//		if (this.$element.is(":radio")) {
//			inputval = this.$form.find(":radio[name='" + this.$element.attr("name") + "']:checked").val();
//		} else if (this.$element.is(":checkbox")) {
//			inputval = "";
//			this.$form.find(":checkbox[name='" + obj.attr("name") + "']:checked").each(function() {
//				inputval += $(this).val() + ',';
//			})
//		} else if (this.$element.is('div')) {
//			inputval = this.$element[0].trueValue;
//		} else {
//			inputval = this.$element.val();
//		}
//		inputval = $.trim(inputval);
//		return this.isEmpty(inputval) ? "" : inputval;
//	}

    u.Validate.fn.some = Array.prototype.some ?
		Array.prototype.some : function() {
			var flag;
			for (var i = 0; i < this.length; i++) {
				if (typeof arguments[0] == "function") {
					flag = arguments[0](this[i])
					if (flag) break;
				}
			}
			return flag;
		};

	u.Validate.fn.getValue = function() {
		var inputval = '';
		//checkbox、radio为u-meta绑定时
		var bool = this.some.call(this.$element.querySelectorAll('[type="checkbox"],[type="radio"]'), function(ele) {
			return ele.type == "checkbox" || ele.type == "radio"
		});
		if (this.$element.childNodes.length > 0 && bool) {
			var eleArr = this.$element.querySelectorAll('[type="checkbox"],[type="radio"]')
			var ele = eleArr[0]
			if (ele.type == "checkbox") {
				this.$element.querySelectorAll(":checkbox[name='" + $(ele).attr("name") + "']:checked").each(function() {
					inputval += $(this).val() + ',';
				})
			} else if (ele.type == "radio") {
				inputval = this.$element.querySelectorAll(":radio[name='" + $(ele).attr("name") + "']:checked").value;
			}
		} else if (this.$element.is(":radio")) { //valid-type 绑定
			inputval = this.$element.parent().querySelectorAll(":radio[name='" + this.$element.attr("name") + "']:checked").val();
		} else if (this.$element.is(":checkbox")) {
			inputval = "";
			this.$element.parent().find(":checkbox[name='" + this.$element.attr("name") + "']:checked").each(function() {
				inputval += $(this).val() + ',';
			})
		} else if (this.$element.find('input').length > 0){
			inputval = this.$element.find('input').val()
		}else {
			inputval = this.$element.val();
		}
		inputval = inputval.trim;
		return this.isEmpty(inputval) ? "" : inputval;
	}

	u.Validate.fn.isEmpty = function(val) {
		return val === "" || val === undefined || val === null //|| val === $.trim(this.$element.attr("tip"));
	}

	u.Validate.fn.showMsg = function(msg) {
		var self = this
		if (this.tipId) {
			$('#' + this.tipId).html(msg).show()
		} else {
			var tipOptions = {
				"title": msg,
				"trigger": "manual",
				"selector": "validtip",
				"placement": this.placement,
				"container":"body"
			}
			if (this.options.tipTemplate)
				tipOptions.template = this.options.tipTemplate
			this.tooltip = new u.Tooltip(this.element,tipOptions)
			this.tooltip.show();
			clearTimeout(this.timeout)
			this.timeout = setTimeout(function(){
				self.tooltip.hide();
			},1500)
		}
	}
	u.Validate.fn.hideMsg = function() {
		if (this.tipId) {
			$('#' + this.tipId).hide()
		} else {
			if(this.tooltip)
			this.tooltip.hide()
		}
	}

	/**
	 * 只有单一元素时使用
	 */
	u.Validate.fn._needClean = function(){
		return true;//this.validates[0].needClean
	}


	if (u.compMgr)   
	u.compMgr.regComp({
		comp: u.Validate,
		compAsString: 'u.Validate',
		css: 'u-validate'
	})
	
/**
 * Created by dingrf on 2016/3/4.
 */

/**
 * 加载控件
 */

if (document.readyState && document.readyState === 'complete'){
    u.compMgr.updateComp();
}else{
    u.on(window, 'load', function() {

        //扫描并生成控件
        u.compMgr.updateComp();
    });
}}();