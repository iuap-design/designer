
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


var App = function () {
    this.dataTables = {};
}

App.fn = App.prototype;

App.fn.init = function (viewModel, element, doApplyBindings) {
    var self = this;
    element = element || document.body;
    if (!u.isArray(element)) {
        element = [element];
    }
    this.elements = element;
    u.each(this.elements, function (i, element) {
        if (typeof element === 'string'){
            element = document.querySelector(element);
        }
        element.querySelectorAll('[u-meta]').forEach(function (ele) {
            if (ele['ucomp']) return;
            //if ($(this).parents('[u-meta]').length > 0) return;
            var options = JSON.parse(ele.getAttribute('u-meta'));
            if (options && options['type']) {
                if (self.adjustFunc)
                    self.adjustFunc.call(self, options);
                //var comp = u.compMgr._createComp(ele, options, viewModel, self);
                var comp = u.compMgr.createDataAdapter({el:ele,options:options,model:viewModel,app:self});
                ele['u-meta'] = comp;
                //if (comp)
                //    $(this).data('u-meta', comp)
            }
        })
        if (u.hotkeys)
            u.hotkeys.scan(element);
        //try {
            if (typeof doApplyBindings == 'undefined' || doApplyBindings == true)
                ko.applyBindings(viewModel, element);
        //} catch (e) {
            //iweb.log.error(e)
        //}
        u.compMgr.updateComp(element);
    });

    _getDataTables(this, viewModel);
//		ko.cleanNode(this.element)
}

App.fn.setAdjustMetaFunc = function (adjustFunc) {
    this.adjustFunc = adjustFunc
}

App.fn.addDataTable = function (dataTable) {
    this.dataTables[dataTable.id] = dataTable
    return this
}
App.fn.getDataTable = function (id) {
    return this.dataTables[id]
}

App.fn.getDataTables = function () {
    return this.dataTables
}

App.fn.getComp = function (compId) {
    var returnComp = null;
    u.each(this.elements, function (i, element) {
        if (typeof element === 'string'){
            element = document.querySelector(element);
        }
        element.querySelectorAll('[u-meta]').forEach(function (ele) {
            if (ele['u-meta']) {
                var comp = ele['u-meta'];
                if (comp.id === compId) {
                    returnComp = comp;
                    return false;
                }
            }
        })
    })
    return returnComp;
}

App.fn.getCompsByDataTable = function (dataTableId, element) {
    var comps = this.getComps(element),
        targetComps = []
    for (var i = 0; i < comps.length; i++) {
        if ((comps[i].dataModel && comps[i].dataModel['id'] == dataTableId) || (comps[i].dataTable && comps[i].dataTable['id'] == dataTableId))
            targetComps.push(comps[i])
    }
    return targetComps
}

/**
 * 获取某区域中的所有控件
 * @param {object} element
 */
App.fn.getComps = function (element) {
    var elements = element ? element : this.elements;
    var returnComps = [];
    if(typeof elements == 'string'){
    	elements = document.querySelectorAll(elements);
    }
    if (!u.isArray(elements) && !(elements instanceof NodeList))
        elements = [elements];
    u.each(elements, function (i, element) {
        element.querySelectorAll('[u-meta]').forEach(function (ele) {
            if (ele['u-meta']) {
                var comp = ele['u-meta'];
                if (comp)
                    returnComps.push(comp);
            }
        })
    });
    return returnComps;
}

/**
 * 控件数据校验
 * @param {Object} element
 */
App.fn.compsValidate = function (element) {
    var comps = this.getComps(element),
        passed = true;
    for (var i = 0; i < comps.length; i++) {
        if (comps[i].doValidate)
            passed = comps[i].doValidate(true) && passed
    }
    return passed
}

/**
 * 根据类型获取控件
 * @param {String} type
 * @param {object} element
 */
App.fn.getCompsByType = function (type, element) {
    var elements = element ? element : this.elements;
    var returnComps = [];
    if (!u.isArray(elements))
        elements = [elements];
    u.each(elements, function (i, element) {
        element.querySelectorAll('[u-meta]').forEach(function (ele) {
            if (ele['u-meta']) {
                var comp = ele['u-meta'];
                if (comp && comp.type == type)
                    returnComps.push(comp);
            }
        })
    });
    return returnComps;
}


App.fn.getEnvironment = function () {
    return window.iweb.Core.collectEnvironment()
}

App.fn.setClientAttribute = function (k, v) {
    window.iweb.Core.setClientAttribute(k, v)
}

App.fn.getClientAttribute = function (k) {
    return window.iweb.Core.getClientAttributes()[k]
}

App.fn.serverEvent = function () {
    return new ServerEvent(this)
}

App.fn.ajax = function (params) {
    params = this._wrapAjax(params)
    u.ajax(params)
}

App.fn._wrapAjax = function (params) {
    var self = this
    var orignSuccess = params.success
    var orignError = params.error
    var deferred = params.deferred;
    if (!deferred || !deferred.resolve) {
        deferred = {
            resolve: function () {
            }, reject: function () {
            }
        }
    }
    params.success = function (data, state, xhr) {
        if (self.processXHRError(self, data, state, xhr)) {
            orignSuccess.call(null, data)
            self._successFunc(data, deferred)
        } else {
            deferred.reject();
        }
    }
    params.error = function (data, state, xhr) {
        if (self.processXHRError(self, data, state, xhr)) {
            orignError.call(null, data)
            self._successFunc(data, deferred)
        } else {
            deferred.reject();
        }
    }
    if (params.data)
        params.data.environment = ko.utils.stringifyJson(window.iweb.Core.collectEnvironment());
    else
        params.data = {environment: ko.utils.stringifyJson(window.iweb.Core.collectEnvironment())}
    return params
}

App.fn._successFunc = function (data, deferred) {
    deferred.resolve();
}

window.processXHRError = function (rsl, state, xhr) {
    if (typeof rsl === 'string')
        rsl = JSON.parse(rsl)
    if (xhr.getResponseHeader && xhr.getResponseHeader("X-Error")) {
        u.showMessageDialog({type: "info", title: "提示", msg: rsl["message"], backdrop: true});
        if (rsl["operate"]) {
            eval(rsl["operate"]);
        }
        return false;
    }
    return true;
};

App.fn.setUserCache = function (key, value) {
    var userCode = this.getEnvironment().usercode;
    if (!userCode)return;
    localStorage.setItem(userCode + key, value);
}

App.fn.getUserCache = function (key) {
    var userCode = this.getEnvironment().usercode;
    if (!userCode)return;
    return localStorage.getItem(userCode + key);
}

App.fn.removeUserCache = function (key) {
    var userCode = this.getEnvironment().usercode;
    if (!userCode)return;
    localStorage.removeItem(userCode + key);
}

App.fn.setCache = function (key, value) {
    localStorage.setItem(key, value);
}

App.fn.getCache = function (key) {
    return localStorage.getItem(key);
}

App.fn.removeCache = function (key) {
    localStorage.removeItem(key)
}

App.fn.setSessionCache = function (key, value) {
    sessionStorage.setItem(key, value)
}

App.fn.getSessionCache = function (key) {
    return sessionStorage.getItem(key)
}

App.fn.removeSessionCache = function (key) {
    sessionStorage.removeItem(key)
}

App.fn.setEnable = function (enable) {
    u.each(this.elements, function (i, element) {
        element.querySelectorAll('[u-meta]').each(function () {
            if (this['u-meta']) {
                var comp = this['u-meta'];
                if (comp.setEnable)
                    comp.setEnable(enable)
            }
        })
    })
}

var ServerEvent = function (app) {
    this.app = app
    this.datas = {}
    this.params = {}
    this.event = null
    this.ent = window.iweb.Core.collectEnvironment()
    if (!iweb.debugMode) {
        this.compression = true
    }
}

ServerEvent.DEFAULT = {
    async: true,
    singleton: true,
    url: (window.$ctx || '/iwebap') + '/evt/dispatch'
}

ServerEvent.fn = ServerEvent.prototype

ServerEvent.fn.addDataTable = function (dataTableId, rule) {
    var dataTable = this.app.getDataTable(dataTableId)
    this.datas[dataTableId] = dataTable.getDataByRule(rule)
    return this
}

ServerEvent.fn.setCompression = function (compression) {
    if (!iweb.browser.isIE8 && !window.pako && compression == true)
        iweb.log.error("can't compression, please include  pako!")
    else
        this.compression = compression
}

/**
 *
 * @param {Object} dataTabels
 * 格式1: ['dt1',{'dt2':'all'}]，格式2：['dt1', 'dt2']，格式3: ['dt1', 'dt2'], 'all'
 */
ServerEvent.fn.addDataTables = function (dataTables) {
    if (arguments.length == 2) {
        for (var i = 0; i < dataTables.length; i++) {
            var rule;
            if (typeof arguments[1] == 'string') {
                rule = arguments[1]
            } else if (u.isArray(arguments[1])) {
                rule = arguments[1][i]
            }
            this.addDataTable(dataTables[i], rule)
        }
    } else {
        for (var i = 0; i < dataTables.length; i++) {
            var dt = dataTables[i]
            if (typeof dt == 'string')
                this.addDataTable(dt)
            else {
                for (key in dt)
                    this.addDataTable(key, dt[key])
            }
        }
    }

    return this
}

ServerEvent.fn.addAllDataTables = function (rule) {
    var dts = this.app.dataTables
    for (var i = 0; i < dts.length; i++) {
        this.addDataTable(dts[i].id, rule)
    }
}


ServerEvent.fn.addParameter = function (key, value) {
    this.params[key] = value
    return this
}

ServerEvent.fn.setEvent = function (event) {
    //无用逻辑
    //if (true)
    //	this.event = event
    //else
    this.event = _formatEvent(event)
    return this
}

var _formatEvent = function (event) {
    return event
}


//	app.serverEvent().fire({
//		ctrl:'CurrtypeController',
//		event:'event1',
//		success:
//		params:
//	})
ServerEvent.fn.fire = function (p) {
    var self = this
//		params = $.extend(ServerEvent.DEFAULT, params);
    var data = this.getData();
    data.parameters = ko.utils.stringifyJson(this.params)
    var params = {
        type: p.type || "POST",
        data: p.params || {},
        url: p.url || ServerEvent.DEFAULT.url,
        async: typeof p.async == 'undefined' ? ServerEvent.DEFAULT.async : p.async,
        singleton: p.singleton || ServerEvent.DEFAULT.singleton,
        success: p.success,
        error: p.error,
        dataType: 'json'
    }
    params.data.ctrl = p.ctrl
    params.data.method = p.method
    if (this.event)
        params.data.event = ko.utils.stringifyJson(this.event)
    var preSuccess = params.preSuccess || function () {
        }
    var orignSuccess = params.success || function () {
        }
    var orignError = params.error //|| function(){}
    this.orignError = orignError
    var deferred = params.deferred;
    if (!deferred || !deferred.resolve) {
        deferred = {
            resolve: function () {
            }, reject: function () {
            }
        }
    }
    params.success = function (data, state, xhr) {
        if (self.processXHRError(self, data, state, xhr)) {
            preSuccess.call(null, data)
            self._successFunc(data, deferred)
            orignSuccess.call(null, data.custom)
            deferred.resolve();
        } else {
            deferred.reject();
        }
    }
    params.error = function (data, state, xhr) {
        if (self.processXHRError(self, data, state, xhr)) {
            if (orignError)
                orignError.call(null, data.custom)
//				self._successFunc(data, deferred)
        } else {
            deferred.reject();
        }
    }
    params.data = u.extend(params.data, data);
    u.ajax(params)

}

ServerEvent.fn.getData = function () {
    var envJson = ko.utils.stringifyJson(this.app.getEnvironment()),
        datasJson = ko.utils.stringifyJson(this.datas),
        compressType = '',
        compression = false
    if (window.trimServerEventData) {
        datasJson = window.trimServerEventData(datasJson);
    }
    if (this.compression) {
        if (!iweb.browser.isIE8 && window.pako) {
            envJson = encodeBase64(window.pako.gzip(envJson));
            datasJson = encodeBase64(window.pako.gzip(datasJson));
            compression = true
            compressType = 'gzip'
        }
    }
    return {
        environment: envJson,
        dataTables: datasJson,
        compression: compression,
        compressType: compressType
    }
}

ServerEvent.fn._successFunc = function (data, deferred) {
    if (typeof data === 'string')
        data = JSON.parse(data)
    var dataTables = data.dataTables
    var dom = data.dom
    if (dom)
        this.updateDom(JSON.parse(dom))
    if (dataTables)
        this.updateDataTables(dataTables, deferred)
}

ServerEvent.fn.updateDataTables = function (dataTables, deferred) {
    for (var key in dataTables) {
        var dt = this.app.getDataTable(key)
        if (dt) {
            dt.setData(dataTables[key])
            dt.updateMeta(dataTables[key].meta)
        }
    }
}

ServerEvent.fn.setSuccessFunc = function (func) {
    this._successFunc = func
}

ServerEvent.fn.updateDom = function () {
    u.each(dom, function (i, n) {
        var vo = n.two
        var key = n.one;
        _updateDom(key, vo)
    });
}

//TODO 去除jQuery后有问题待修改
function _updateDom(key, vos) {
    for (var i in vos) {
        var vo = vos[i]
        for (var key in vo) {
            var props = vo[key]
            if (key == 'trigger') {
                u.trigger(key,props[0]);
            }
            else {
                if (u.isArray(props)) {
                    u.each(props, function (i, n) {
                        key[i](n)
                    });
                }
                else
                    try {
                        key[i](vo)
                    } catch (error) {
                        key[i](vo[i])
                    }
            }
        }
    }
}

ServerEvent.fn.processXHRError = function (self, rsl, state, xhr) {
    if (typeof rsl === 'string')
        rsl = JSON.parse(rsl)
    if (xhr.getResponseHeader && xhr.getResponseHeader("X-Error")) {
        if (self.orignError)
            self.orignError.call(self, rsl, state, xhr)
        else {
            if (u.showMessageDialog)
                u.showMessageDialog({type: "info", title: "提示", msg: rsl["message"], backdrop: true});
            else
                alert(rsl["message"])
            if (rsl["operate"]) {
                eval(rsl["operate"]);
            }
            return false;
        }
    }
    return true;
};

u.createApp = function () {
    var app = new App();
    if (arguments.length > 0){
        var arg = arguments[0];
        app.init(arg.model, arg.el);
    }
    return app;
}

var _getDataTables = function (app, viewModel) {
    for (var key in viewModel) {
        if (viewModel[key] instanceof u.DataTable) {
            viewModel[key].id = key
            viewModel[key].parent = viewModel
            app.addDataTable(viewModel[key])
        }
    }
}


/* ========================================================================
 * UUI: dataTable.js
 *
 * ========================================================================
 * Copyright 2016 yonyou, Inc.
 * ======================================================================== */

var Events = function () {
};

Events.fn = Events.prototype;
/**
 *绑定事件
 */
Events.fn.on = function (name, callback) {
    name = name.toLowerCase();
    this._events || (this._events = {});
    var events = this._events[name] || (this._events[name] = []);
    events.push({
        callback: callback
    })
    return this;
}

/**
 * 触发事件
 */
Events.fn.trigger = function (name) {
    name = name.toLowerCase()
    if (!this._events || !this._events[name]) return this;
    var args = Array.prototype.slice.call(arguments, 1);
    var events = this._events[name];
    for (var i = 0, count = events.length; i < count; i++) {
        events[i].callback.apply(this, args);
    }
    return this;
}


Events.fn.getEvent = function (name) {
    name = name.toLowerCase()
    this._events || (this._events = {})
    return this._events[name]
}

/**===========================================================================================================
 *
 * 数据模型
 *
 * ===========================================================================================================
 */

var DataTable = function (options) {
    this.id = options['id'];
    this.meta = DataTable.createMetaItems(options['meta']);
    this.enable = options['enable'] || DataTable.DEFAULTS.enable;
    this.pageSize = ko.observable(options['pageSize'] || DataTable.DEFAULTS.pageSize)
    this.pageIndex = ko.observable(options['pageIndex'] || DataTable.DEFAULTS.pageIndex)
    this.totalPages = ko.observable(options['totalPages'] || DataTable.DEFAULTS.totalPages)
    this.totalRow = ko.observable()
    this.pageCache = options['pageCache'] === undefined ? DataTable.DEFAULTS.pageCache : options['pageCache']
    this.rows = ko.observableArray([])
    this.selectedIndices = ko.observableArray([])
    this._oldCurrentIndex = -1;
    this.focusIndex = -1
    this.cachedPages = []
    this.metaChange = {};
    this.valueChange = ko.observable(1);
    this.enableChange = ko.observable(1);
    this.params = options['params'] || {};
    this.master = options['master'] || '';
    this.allSelected = ko.observable(false);
}

DataTable.fn = DataTable.prototype = new Events()

DataTable.DEFAULTS = {
    pageSize: 20,
    pageIndex: 0,
    totalPages: 20,
    pageCache: false,
    enable: true
}

DataTable.META_DEFAULTS = {
    enable: true,
    required: false,
    descs: {}
}
DataTable.createMetaItems = function (metas) {
    var newMetas = {};
    for (var key in metas) {
        var meta = metas[key]
        if (typeof meta == 'string')
            meta = {}
        newMetas[key] = u.extend({}, DataTable.META_DEFAULTS, meta)
    }
    return newMetas
}


//事件类型
DataTable.ON_ROW_SELECT = 'select'
DataTable.ON_ROW_UNSELECT = 'unSelect'
DataTable.ON_ROW_ALLSELECT = 'allSelect'
DataTable.ON_ROW_ALLUNSELECT = 'allUnselect'
DataTable.ON_VALUE_CHANGE = 'valueChange'
DataTable.ON_CURRENT_VALUE_CHANGE = 'currentValueChange'  //当前行变化
//	DataTable.ON_AFTER_VALUE_CHANGE = 'afterValueChange'
//	DataTable.ON_ADD_ROW = 'addRow'
DataTable.ON_INSERT = 'insert'
DataTable.ON_UPDATE = 'update'
DataTable.ON_CURRENT_UPDATE = 'currentUpdate'
DataTable.ON_DELETE = 'delete'
DataTable.ON_DELETE_ALL = 'deleteAll'
DataTable.ON_ROW_FOCUS = 'focus'
DataTable.ON_ROW_UNFOCUS = 'unFocus'
DataTable.ON_LOAD = 'load'
DataTable.ON_ENABLE_CHANGE = 'enableChange'
DataTable.ON_META_CHANGE = 'metaChange'
DataTable.ON_ROW_META_CHANGE = 'rowMetaChange'
DataTable.ON_CURRENT_META_CHANGE = 'currentMetaChange'
DataTable.ON_CURRENT_ROW_CHANGE = 'currentRowChange'

DataTable.SUBMIT = {
    current: 'current',
    focus: 'focus',
    all: 'all',
    select: 'select',
    change: 'change',
    empty: 'empty',
    allSelect: 'allSelect',
    allPages: 'allPages'
}


DataTable.fn.addParam = function (key, value) {
    this.params[key] = value
}

DataTable.fn.addParams = function (params) {
    for (var key in params) {
        this.params[key] = params[key]
    }
}

DataTable.fn.getParam = function (key) {
    return this.params[key]
}

/**
 * 获取meta信息，先取row上的信息，没有时，取dataTable上的信息
 * @param {Object} fieldName
 * @param {Object} key
 * @param {Object} row
 */
DataTable.fn.getMeta = function (fieldName, key) {
    if (arguments.length === 0)
        return this.meta;
    else if (arguments.length === 1)
        return this.meta[fieldName];
    return this.meta[fieldName][key];
}

DataTable.fn.setMeta = function (fieldName, key, value) {
    var oldValue = this.meta[fieldName][key]
    var currRow = this.getCurrentRow();
    this.meta[fieldName][key] = value
    if (this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key](-this.metaChange[fieldName + '.' + key]());
    //this.metaChange(- this.metaChange())
    if (key == 'enable')
        this.enableChange(-this.enableChange())
    this.trigger(DataTable.ON_META_CHANGE, {
        eventType: 'dataTableEvent',
        dataTable: this.id,
        field: fieldName,
        meta: key,
        oldValue: oldValue,
        newValue: value
    });
    if (currRow && !currRow.getMeta(fieldName, key, false)) {
        this.trigger(fieldName + '.' + key + '.' + DataTable.ON_CURRENT_META_CHANGE, {
            eventType: 'dataTableEvent',
            dataTable: this.id,
            oldValue: oldValue,
            newValue: value
        });
    }
}

DataTable.fn.setCurrentPage = function (pageIndex, notCacheCurrentPage) {
    if (pageIndex != this.pageIndex() && notCacheCurrentPage != true)
        this.cacheCurrentPage();
    this.pageIndex(pageIndex)
    var cachedPage = this.cachedPages[this.pageIndex()]
    if (cachedPage) {
        this.removeAllRows()
        this.setRows(cachedPage.rows)
        this.setRowsSelect(cachedPage.selectedIndcies)
    }
}

DataTable.fn.isChanged = function () {
    var rows = this.getAllRows()
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].status != Row.STATUS.NORMAL)
            return true
    }
    return false
}


/**
 * example: meta: {supplier: {meta: {precision:'3', default: '0239900x', display:'显示名称'}}}
 */
DataTable.fn.updateMeta = function (meta) {
    if (!meta) {
        return;
    }
    for (var fieldKey in meta) {
        for (var propKey in meta[fieldKey]) {
            var oldValue = this.meta[fieldKey][propKey]
            var newValue = meta[fieldKey][propKey]
            if (propKey === 'default') {
                if (!this.meta[fieldKey]['default']) {
                    this.meta[fieldKey]['default'] = {}
                }
                this.meta[fieldKey]['default'].value = meta[fieldKey][propKey]
            } else if (propKey === 'display') {
                if (!this.meta[fieldKey]['default']) {
                    this.meta[fieldKey]['default'] = {}
                }
                this.meta[fieldKey]['default'].display = meta[fieldKey][propKey]
            } else {
                this.meta[fieldKey][propKey] = meta[fieldKey][propKey]
            }
            if (this.metaChange[fieldKey + '.' + propKey])
                this.metaChange[fieldKey + '.' + propKey](-this.metaChange[fieldKey + '.' + propKey]());

            this.trigger(DataTable.ON_META_CHANGE, {
                eventType: 'dataTableEvent',
                dataTable: this.id,
                field: fieldKey,
                meta: propKey,
                oldValue: oldValue,
                newValue: newValue
            });
        }

    }
    //this.metaChange(- this.metaChange())
}


/**
 *设置数据
 *
 */
DataTable.fn.setData = function (data) {
    var newIndex = data.pageIndex || 0,
        newSize = data.pageSize || this.pageSize(),
        newTotalPages = data.totalPages || this.totalPages(),
        newTotalRow = data.totalRow || data.rows.length,
        select, focus;
        //currPage,
        //type = data.type;

    this.pageCache = data.pageCache || this.pageCache
    if (this.pageCache === true) {
        this.updatePages(data.pages)
        if (newIndex != this.pageIndex()) {
            this.setCurrentPage(newIndex, true);
            this.totalPages(newTotalPages)
            this.totalRow(newTotalRow)
            return;
        }
        else {
            select = this.getPage(newIndex).selectedIndices
            focus = this.getPage(newIndex).focus
            this.setRows(this.getPage(newIndex).rows)
        }
    } else {
        select = data.select || [0];
        focus = data.focus;
        this.setRows(data.rows)
    }
    this.pageIndex(newIndex)
    this.pageSize(newSize)
    this.totalPages(newTotalPages)
    this.totalRow(newTotalRow)

    this.updateSelectedIndices()

    if (select && select.length > 0 && this.rows().length > 0)
        this.setRowsSelect(select)
    if (focus)
        this.setRowFocus(focus)
};

/**
 * 获取数据,只取字段名与字段值
 */
DataTable.fn.getSimpleData = function(options){
    options = options || {}
    var rows,_rowData = [], type = options['type'] || 'all', fields = options['fields'] || null;

    if (type === 'all') {
        rows = this.rows.peek();
    }else if (type === 'current'){
        var currRow = this.getCurrentRow();
        rows = currRow == null ? [] :  [currRow];
    }else if (type === 'focus'){
        var focusRow = this.getFocusRow();
        rows = focusRow == null ? [] :  [focusRow];
    }else if (type === 'select'){
        rows = this.getSelectedRows();
    }else if (type === 'change'){
        rows = this.getChangedRows();
    }

    for(var i = 0; i< rows.length; i++){
        _rowData.push(rows[i].getSimpleData({fields:fields}));
    }
    return _rowData;
};

/**
 * 设置数据, 只设置字段值
 * @param {array} data
 */
DataTable.fn.setSimpleData = function(data){
    this.clear();
    var rows = [];
    for (var i =0; i< data.length; i++){
        rows.push({
            status: Row.STATUS.NORMAL,
            data: data[i]
        })
    }
    var _data = {
        rows: rows
    }
    this.setData(_data);
};


/**
 * 清空datatable的所有数据以及分页数据以及index
 */
DataTable.fn.clear = function () {
    this.removeAllRows();
    this.cachedPages = [];
    this.totalPages(1);
    this.pageIndex(0);
    this.focusIndex = -1;
    this.selectedIndices([]);
}

/**
 * 更新分页数据
 */
DataTable.fn.updatePages = function (pages) {
    var pageSize = this.pageSize(), pageIndex = 0, page, r, row;
    var page, index, i, rows, focus, selectIndices, status, j, row, originRow;
    for (i = 0; i < pages.length; i++) {
        index = pages[i].index
        rows = pages[i].rows
        focus = pages[i].current
        selectIndices = pages[i].select
        status = pages[i].status
        if (status === 'del') {
            this.cachedPages[index] = null;
            continue;
        }
        if (!this.cachedPages[index]) {
            page = new Page({parent: this})
            page.rows = rows;
            for (var j = 0; j < page.rows.length; j++) {
                page.rows[j].rowId = page.rows[j].id
                delete page.rows[j].id
            }
            this.cachedPages[index] = page
        } else {
            //如果是当前页，先把this.rows数据更新到page中
            if (index == this.pageIndex()) {
                this.cacheCurrentPage();
            }
            page = this.cachedPages[index]
            for (var j = 0; j < rows.length; j++) {
                r = rows[j];
                if (!r.id)
                    r.id = Row.getRandomRowId()
                if (r.status == Row.STATUS.DELETE) {
                    this.removeRowByRowId(r.id)
                } else {
                    row = page.getRowByRowId(r.id)
                    if (row) {
                        page.updateRow(row, r);
                    } else {
                        r.rowId = r.id
                        delete r.id
                        page.rows.push(r);
                    }
                }
            }
        }
        page.selectedIndices = selectIndices;
        page.focus = focus;
    }
}

/**
 * 设置行数据
 * @param {Object} rows
 */
DataTable.fn.setRows = function (rows) {
    var insertRows = [], _id;
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i]
        _id = r.rowId || r.id;
        if (!_id)
            _id = Row.getRandomRowId()
        if (r.status == Row.STATUS.DELETE) {
            this.removeRowByRowId(_id)
        }
        else {
            var row = this.getRowByRowId(_id)
            if (row) {
                row.updateRow(r);
                if (!u.isEmptyObject(r.data)) {
                    this.trigger(DataTable.ON_UPDATE, {
                        index: i,
                        rows: [row]
                    })
                    if (row == this.getCurrentRow()) {
                        this.valueChange(-this.valueChange())
                        row.valueChange(-row.valueChange())
                        this.trigger(DataTable.ON_CURRENT_UPDATE, {
                            index: i,
                            rows: [row]
                        })
                    } else {
                        row.valueChange(-row.valueChange())
                    }
                }

            }
            else {
                row = new Row({parent: this, id: _id})
                row.setData(rows[i])
                insertRows.push(row)
//					this.addRow(row)
            }
        }
    }
    if (insertRows.length > 0)
        this.addRows(insertRows)
}

DataTable.fn.clearCache = function () {
    this.cachedPages = []
}

DataTable.fn.cacheCurrentPage = function () {
    if (this.pageCache && this.pageIndex() > -1) {
        var page = new Page({parent: this});
        page.focus = this.getFocusIndex();
        page.selectedIndices = this.selectedIndices().slice();
        var rows = this.rows.peek() //.slice();
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i].getData();
            r.rowId = r.id;
            delete r.id;
            page.rows.push(r)
        }
        //page.rows = this.rows().slice();
        this.cachedPages[this.pageIndex()] = page
    }
}

/**
 * 前端分页方法，不建议使用，建议在后端进行分页
 * @param allRows
 */
DataTable.fn.setPages = function (allRows) {
    var pageSize = this.pageSize(), pageIndex = 0, page;
    this.cachedPages = [];
    for (var i = 0; i < allRows.length; i++) {
        pageIndex = Math.floor(i / pageSize);
        if (!this.cachedPages[pageIndex]) {
            page = new Page({parent: this})
            this.cachedPages[pageIndex] = page
        }
        page.rows.push(allRows[i])
    }
    if (this.pageIndex() > -1)
        this.setCurrentPage(this.pageIndex());
    this.totalRow(allRows.length);
    this.totalPages(pageIndex + 1);
}

DataTable.fn.hasPage = function (pageIndex) {
    //return (this.pageCache && this.cachedPages[pageIndex]  && this.cachedPages[pageIndex].pageSize == this.pageSize()) ? true : false
    return (this.pageCache && this.cachedPages[pageIndex]) ? true : false
}

DataTable.fn.getPage = function (pageIndex) {
    if (this.pageCache) {
        return this.cachedPages[pageIndex]
    }
    return -1;
}

DataTable.fn.getPages = function () {
    if (this.pageCache) {
        return this.cachedPages
    }
    return [];
}

DataTable.fn.copyRow = function (index, row) {
    var newRow = new Row({parent: this})
    if (row) {
        newRow.setData(row.getData())
    }
    this.insertRows(index === undefined ? this.rows().length : index, [newRow])
}

/**
 *追加行
 */
DataTable.fn.addRow = function (row) {
    this.insertRow(this.rows().length, row)
}

/**
 *追加多行
 */
DataTable.fn.addRows = function (rows) {
    this.insertRows(this.rows().length, rows)
}

DataTable.fn.insertRow = function (index, row) {
    if (!row) {
        row = new Row({parent: this})
    }
    this.insertRows(index, [row])
}

DataTable.fn.insertRows = function (index, rows) {
//		if (this.onBeforeRowInsert(index,rows) == false)
//			return
    var args = [index, 0]
    for (var i = 0; i < rows.length; i++) {
        args.push(rows[i]);
    }
    this.rows.splice.apply(this.rows, args);

    this.updateSelectedIndices(index, '+', rows.length)
    this.updateFocusIndex(index, '+', rows.length)

    this.trigger(DataTable.ON_INSERT, {
        index: index,
        rows: rows
    })
}

/**
 * 创建空行
 */
DataTable.fn.createEmptyRow = function () {
    var r = new Row({parent: this})
    this.addRow(r)
    return r
}

DataTable.fn.removeRowByRowId = function (rowId) {
    var index = this.getIndexByRowId(rowId)
    if (index != -1)
        this.removeRow(index)
}

DataTable.fn.removeRow = function (index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId)
    }
    this.removeRows([index]);
}

DataTable.fn.removeAllRows = function () {
    this.rows([])
    this.selectedIndices([])
    this.focusIndex = -1
    this.trigger(DataTable.ON_DELETE_ALL)
    this.updateCurrIndex();
}

DataTable.fn.removeRows = function (indices) {
    indices = this._formatToIndicesArray(indices)
    indices = indices.sort()
    var rowIds = [], rows = this.rows(), deleteRows = [];
    for (var i = indices.length - 1; i >= 0; i--) {
        var index = indices[i]
        var delRow = rows[index];
        if (delRow == null) {
            continue;
        }
        rowIds.push(delRow.rowId)
        var deleteRow = rows.splice(index, 1);
        deleteRows.push(deleteRow[0]);
        this.updateSelectedIndices(index, '-')
        this.updateFocusIndex(index, '-')
    }
    this.rows(rows)
    this.deleteRows = deleteRows;
    this.trigger(DataTable.ON_DELETE, {
        indices: indices,
        rowIds: rowIds,
        deleteRows: deleteRows
    })
    this.updateCurrIndex();
}

/**
 * 设置行删除
 * @param {Object} index
 */
DataTable.fn.setRowDelete = function (index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId)
    }
    this.setRowDelete([index])
}

/**
 * 设置所有行删除
 */
DataTable.fn.setAllRowsDelete = function () {
    var indices = new Array(this.rows().length)
    for (var i = 0; i < indices.length; i++) {
        indices[i] = i
    }
    this.setRowsDelete(indices)
}

/**
 * 设置行删除
 * @param {Array} indices
 */
DataTable.fn.setRowsDelete = function (indices) {
    indices = this._formatToIndicesArray(indices)
    for (var i = 0; i < indices.length; i++) {
        var row = this.getRow(indices[i])
        if (row.status == Row.STATUS.NEW) {
            this.rows(this.rows().splice(indices[i], 1));
            this.updateSelectedIndices(indices[i], '-')
            this.updateFocusIndex(index, '-')
        }
        else {
            row.status = Row.STATUS.FALSE_DELETE
        }
    }
    var rowIds = this.getRowIdsByIndices(indices)
    this.trigger(DataTable.ON_ROW_DELETE, {
        falseDelete: true,
        indices: indices,
        rowIds: rowIds
    })
}

DataTable.fn.toggleAllSelect = function(){
    if (this.allSelected()){
        this.setAllRowsUnSelect();
    }else{
        this.setAllRowsSelect();
    }

};

DataTable.fn.setAllRowsSelect = function () {
    var indices = new Array(this.rows().length)
    for (var i = 0; i < indices.length; i++) {
        indices[i] = i
    }
    this.setRowsSelect(indices);
    this.allSelected(true);
    this.trigger(DataTable.ON_ROW_ALLSELECT, {})
}

/**
 * 设置选中行，清空之前已选中的所有行
 */
DataTable.fn.setRowSelect = function (index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId)
    }
    this.setRowsSelect([index])
    this.setRowFocus(this.getSelectedIndex())
}

DataTable.fn.setRowsSelect = function (indices) {
    indices = indices || -1;
    if (indices == -1) {
        this.setAllRowsUnSelect({quiet: true})
        return;
    }
    indices = this._formatToIndicesArray(indices);
    var sIns = this.selectedIndices();
    if (u.isArray(indices) && u.isArray(sIns) && indices.join() == sIns.join()) {
        // 避免与控件循环触发
        return;
    }
    this.setAllRowsUnSelect({quiet: true});
    this.selectedIndices(indices);
//		var index = this.getSelectedIndex()
//		this.setCurrentRow(index)
    var rowIds = this.getRowIdsByIndices(indices);
    this.valueChange(-this.valueChange());
    this.trigger(DataTable.ON_ROW_SELECT, {
        indices: indices,
        rowIds: rowIds
    })
    this.updateCurrIndex();
}


/**
 * 添加选中行，不会清空之前已选中的行
 */
DataTable.fn.addRowSelect = function (index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId)
    }
    this.addRowsSelect([index])
}

/**
 * 添加选中行，不会清空之前已选中的行
 */
DataTable.fn.addRowsSelect = function (indices) {
    indices = this._formatToIndicesArray(indices)
    var selectedIndices = this.selectedIndices().slice()
    for (var i = 0; i < indices.length; i++) {
        var ind = indices[i], toAdd = true
        for (var j = 0; j < selectedIndices.length; j++) {
            if (selectedIndices[j] == ind) {
                toAdd = false
            }
        }
        if (toAdd) {
            selectedIndices.push(indices[i])
        }
    }
    this.selectedIndices(selectedIndices)
//		var index = this.getSelectedIndex()
//		this.setCurrentRow(index)
    var rowIds = this.getRowIdsByIndices(indices)
    this.trigger(DataTable.ON_ROW_SELECT, {
        indices: indices,
        rowIds: rowIds
    })
    this.updateCurrIndex();
}

/**
 * 根据索引取rowid
 * @param {Object} indices
 */
DataTable.fn.getRowIdsByIndices = function (indices) {
    var rowIds = []
    for (var i = 0; i < indices.length; i++) {
        rowIds.push(this.getRow(indices[i]).rowId)
    }
    return rowIds
}

/**
 * 全部取消选中
 */
DataTable.fn.setAllRowsUnSelect = function (options) {
    this.selectedIndices([])
    if (!(options && options.quiet)) {
        this.trigger(DataTable.ON_ROW_ALLUNSELECT)
    }
    this.updateCurrIndex();
    this.allSelected(false);
}

/**
 * 取消选中
 */
DataTable.fn.setRowUnSelect = function (index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId)
    }
    this.setRowsUnSelect([index])
}

DataTable.fn.setRowsUnSelect = function (indices) {
    indices = this._formatToIndicesArray(indices)
    var selectedIndices = this.selectedIndices().slice()

    // 避免与控件循环触发
    if (selectedIndices.indexOf(indices[0]) == -1) return;

    for (var i = 0; i < indices.length; i++) {
        var index = indices[i]
        var pos = selectedIndices.indexOf(index)
        if (pos != -1)
            selectedIndices.splice(pos, 1)
    }
    this.selectedIndices(selectedIndices)
    var rowIds = this.getRowIdsByIndices(indices)
    this.trigger(DataTable.ON_ROW_UNSELECT, {
        indices: indices,
        rowIds: rowIds
    })
    this.updateCurrIndex();
    this.allSelected(false);
}

/**
 *
 * @param {Object} index 要处理的起始行索引
 * @param {Object} type   增加或减少  + -
 */
DataTable.fn.updateSelectedIndices = function (index, type, num) {
    if (!u.isNumber(num)) {
        num = 1
    }
    var selectedIndices = this.selectedIndices().slice()
    if (selectedIndices == null || selectedIndices.length == 0)
        return
    for (var i = 0, count = selectedIndices.length; i < count; i++) {
        if (type == '+') {
            if (selectedIndices[i] >= index)
                selectedIndices[i] = parseInt(selectedIndices[i]) + num
        }
        else if (type == '-') {
            if (selectedIndices[i] >= index && selectedIndices[i] <= index + num - 1) {
                selectedIndices.splice(i, 1)
            }
            else if (selectedIndices[i] > index + num - 1)
                selectedIndices[i] = selectedIndices[i] - num
        }
    }
    this.selectedIndices(selectedIndices)
//		var currIndex = this.getSelectedIndex()
//		this.setCurrentRow(currIndex)
}

DataTable.fn.updateFocusIndex = function (opIndex, opType, num) {
    if (!u.isNumber(num)) {
        num = 1
    }
    if (opIndex <= this.focusIndex && this.focusIndex != -1) {
        if (opType === '+') {
            this.focusIndex += num
        } else if (opType === '-') {
            if (this.focusIndex >= opIndex && this.focusIndex <= opIndex + num - 1) {
                this.focusIndex = -1
            } else if (this.focusIndex > opIndex + num - 1) {
                this.focusIndex -= num
            }
        }
    }
}

/**
 * 获取选中行索引，多选时，只返回第一个行索引
 */
DataTable.fn.getSelectedIndex = function () {
    var selectedIndices = this.selectedIndices()
    if (selectedIndices == null || selectedIndices.length == 0)
        return -1
    return selectedIndices[0]
};

/**
 *获取选中的所有行索引数组索引
 */
DataTable.fn.getSelectedIndices = function () {
    var selectedIndices = this.selectedIndices()
    if (selectedIndices == null || selectedIndices.length == 0)
        return []
    return selectedIndices
};

/**
 * 兼容保留，不要用
 */
DataTable.fn.getSelectedIndexs = function () {
    return this.getSelectedIndices();
}

/**
 * 获取焦点行
 */
DataTable.fn.getFocusIndex = function () {
    return this.focusIndex
}

/**
 * 根据行号获取行索引
 * @param {String} rowId
 */
DataTable.fn.getIndexByRowId = function (rowId) {
    var rows = this.rows();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].rowId == rowId)
            return i
    }
    return -1
}

/**
 * 获取所有行数据
 */
DataTable.fn.getAllDatas = function () {
    var rows = this.getAllRows()
    var datas = []
    for (var i = 0, count = rows.length; i < count; i++)
        if (rows[i])
            datas.push(rows[i].getData())
    return datas
}

/**
 * 获取当前页数据
 */
DataTable.fn.getData = function () {
    var datas = [], rows = this.rows();
    for (var i = 0; i < rows.length; i++) {
        datas.push(rows[i].getData())
    }
    return datas
}

DataTable.fn.getDataByRule = function (rule) {
    var returnData = {}, datas = null, rows;
    returnData.meta = this.meta
    returnData.params = this.params
    rule = rule || DataTable.SUBMIT.current
    if (rule == DataTable.SUBMIT.current) {
        datas = []
        var currIndex = this.focusIndex
        if (currIndex == -1)
            currIndex = this.getSelectedIndex()
        rows = this.rows();
        for (var i = 0, count = rows.length; i < count; i++) {
            if (i == currIndex)
                datas.push(rows[i].getData())
            else
                datas.push(rows[i].getEmptyData())
        }

    }
    else if (rule == DataTable.SUBMIT.focus) {
        datas = []
        rows = this.rows();
        for (var i = 0, count = rows.length; i < count; i++) {
            if (i == this.focusIndex)
                datas.push(rows[i].getData())
            else
                datas.push(rows[i].getEmptyData())
        }
    }
    else if (rule == DataTable.SUBMIT.all) {
        datas = this.getData()
    }
    else if (rule == DataTable.SUBMIT.select) {
        datas = this.getSelectedDatas(true)
    }
    else if (rule == DataTable.SUBMIT.change) {
        datas = this.getChangedDatas()
    }
    else if (rule === DataTable.SUBMIT.empty) {
        datas = []
    }
    if (this.pageCache && datas != null) {
        datas = [{index: this.pageIndex(), select: this.getSelectedIndexs(), focus: this.focusIndex, rows: datas}]
    }
    if (rule == DataTable.SUBMIT.allSelect) {
        datas = []
        var totalPages = this.totalPages();
        //缓存页数据
        for (var i = 0; i < totalPages; i++) {
            if (i == this.pageIndex()) {
                //当前页数据
                datas.push({
                    index: this.pageIndex(),
                    select: this.getSelectedIndexs(),
                    focus: this.focusIndex,
                    rows: this.getSelectedDatas()
                });
            } else {
                var page = this.cachedPages[i];
                if (page) {
                    datas.push({
                        index: i,
                        select: page.selectedIndices,
                        focus: page.focus,
                        rows: page.getSelectDatas()
                    });
                }
            }
        }
    } else if (rule == DataTable.SUBMIT.allPages) {
        datas = []
        var totalPages = this.totalPages();
        //缓存页数据
        for (var i = 0; i < totalPages; i++) {
            if (i == this.pageIndex()) {
                //当前页数据
                datas.push({
                    index: this.pageIndex(),
                    select: this.getSelectedIndexs(),
                    focus: this.focusIndex,
                    rows: this.getData()
                });
            } else {
                var page = this.cachedPages[i];
                if (page) {
                    datas.push({index: i, select: page.selectedIndices, focus: page.focus, rows: page.getData()});
                }
            }
        }
    }
    if (this.pageCache) {
        returnData.pages = datas;
    } else {
        returnData.rows = datas
        returnData.select = this.getSelectedIndexs()
        returnData.focus = this.getFocusIndex()
    }

    returnData.pageSize = this.pageSize()
    returnData.pageIndex = this.pageIndex()
    returnData.isChanged = this.isChanged()
    returnData.master = this.master
    returnData.pageCache = this.pageCache
    return returnData
}

/**
 * 获取选中行数据
 */
DataTable.fn.getSelectedDatas = function (withEmptyRow) {
    var selectedIndices = this.selectedIndices()
    var datas = []
    var sIndices = []
    for (var i = 0, count = selectedIndices.length; i < count; i++) {
        sIndices.push(selectedIndices[i])
    }
    var rows = this.rows();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (sIndices.indexOf(i) != -1)
            datas.push(rows[i].getData())
        else if (withEmptyRow == true)
            datas.push(rows[i].getEmptyData())
    }
    return datas
};

/**
 * 取选中行
 */
DataTable.fn.getSelectedRows = function (){
    var selectedIndices = this.selectedIndices();
    var selectRows = [];
    var rows = this.rows.peek();
    var sIndices = []
    for (var i = 0, count = selectedIndices.length; i < count; i++) {
        sIndices.push(selectedIndices[i])
    }
    for (var i = 0, count = rows.length; i < count; i++) {
        if (sIndices.indexOf(i) != -1)
            selectRows.push(rows[i])
    }
    return selectRows
}

DataTable.fn.refSelectedRows = function () {
    return ko.pureComputed({
        read: function () {
            var ins = this.selectedIndices() || []
            var rs = this.rows()
            var selectedRows = []
            for (var i = 0; i < ins.length; i++) {
                selectedRows.push(rs[i])
            }
            return selectedRows
        }, owner: this
    })
}

/**
 * 绑定字段值
 * @param {Object} fieldName
 */
DataTable.fn.ref = function (fieldName) {
    return ko.pureComputed({
        read: function () {
            this.valueChange()
            var row = this.getCurrentRow()
            if (row)
                return row.getValue(fieldName)
            else
                return ''
        },
        write: function (value) {
            var row = this.getCurrentRow()
            if (row)
                row.setValue(fieldName, value)
        },
        owner: this
    })
}

/**
 * 绑定字段属性
 * @param {Object} fieldName
 * @param {Object} key
 */
DataTable.fn.refMeta = function (fieldName, key) {
    if (!this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key] = ko.observable(1);
    return ko.pureComputed({
        read: function () {
            this.metaChange[fieldName + '.' + key]()
            return this.getMeta(fieldName, key)
        },
        write: function (value) {
            this.setMeta(fieldName, key, value)
        },
        owner: this
    })
}

DataTable.fn.refRowMeta = function (fieldName, key) {
    if (!this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key] = ko.observable(1);
    return ko.pureComputed({
        read: function () {
            this.metaChange[fieldName + '.' + key]()
            var row = this.getCurrentRow()
            if (row)
                return row.getMeta(fieldName, key)
            else
                return this.getMeta(fieldName, key)
        },
        write: function (value) {
            var row = this.getCurrentRow()
            if (row)
                row.setMeta(fieldName, value)
        },
        owner: this
    })
}

DataTable.fn.getRowMeta = function (fieldName, key) {
    var row = this.getCurrentRow()
    if (row)
        return row.getMeta(fieldName, key)
    else
        return this.getMeta(fieldName, key)
}

DataTable.fn.refEnable = function (fieldName) {
    return ko.pureComputed({
        //enable优先级： dataTable.enable >  row上的enable >  field中的enable定义
        read: function () {
            this.enableChange();
            if (!fieldName)
                return this.enable;
            var fieldEnable = this.getRowMeta(fieldName, 'enable')
            if (typeof fieldEnable == 'undefined' || fieldEnable == null)
                fieldEnable = true;
            return fieldEnable && this.enable
//				return this.enable && (this.getMeta(fieldName, 'enable') || false)
        },
        owner: this
    })
}

DataTable.fn.isEnable = function (fieldName) {
    var fieldEnable = this.getMeta(fieldName, 'enable')
    if (typeof fieldEnable == 'undefined' || fieldEnable == null)
        fieldEnable = true
    return fieldEnable && this.enable
}

DataTable.fn.getValue = function (fieldName, row) {
    row = row || this.getCurrentRow()
    if (row)
        return row.getValue(fieldName)
    else
        return ''
}

DataTable.fn.setValue = function (fieldName, value, row, ctx) {
    row = row ? row : this.getCurrentRow()
    if (row)
        row.setValue(fieldName, value, ctx)
}

DataTable.fn.setEnable = function (enable) {
    if (this.enable == enable) return
    this.enable = enable
    this.enableChange(-this.enableChange())
    this.trigger(DataTable.ON_ENABLE_CHANGE, {
        enable: this.enable
    })
}

/**
 * 获取当前操作行
 * 规则： focus 行优先，没有focus行时，取第一选中行
 */
DataTable.fn.getCurrentRow = function () {
    if (this.focusIndex != -1)
        return this.getFocusRow()
    var index = this.getSelectedIndex()
    if (index == -1)
        return null
    else
        return this.getRow(index)
}


DataTable.fn.updateCurrIndex = function () {
    var currentIndex = this.focusIndex != -1 ? this.focusIndex : this.getSelectedIndex();
    if (this._oldCurrentIndex != currentIndex) {
        this._oldCurrentIndex = currentIndex;
        this.trigger(DataTable.ON_CURRENT_ROW_CHANGE)
    }
}

/**
 * 获取焦点行
 */
DataTable.fn.getFocusRow = function () {
    if (this.focusIndex != -1)
        return this.getRow(this.focusIndex)
    else
        return null
}

/**
 * 设置焦点行
 * @param {Object} index 行对象或者行index
 * @param quiet 不触发事件
 * @param force 当index行与已focus的行相等时，仍然触发事件
 */
DataTable.fn.setRowFocus = function (index, quiet, force) {
    var rowId = null
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId)
        rowId = index.rowId
    }
    if (index === -1 || (index === this.focusIndex && !force)) {
        return;
    }
    this.focusIndex = index
    if (quiet) {
        return;
    }
    this.valueChange(-this.valueChange())
    if (!rowId) {
        rowId = this.getRow(index).rowId
    }
    this.trigger(DataTable.ON_ROW_FOCUS, {
        index: index,
        rowId: rowId
    })
    this.updateCurrIndex();
}

/**
 * 焦点行反选
 */
DataTable.fn.setRowUnFocus = function () {
    this.valueChange(-this.valueChange())
    var indx = this.focusIndex, rowId = null;
    if (indx !== -1) {
        rowId = this.getRow(indx).rowId
    }
    this.trigger(DataTable.ON_ROW_UNFOCUS, {
        index: indx,
        rowId: rowId
    })
    this.focusIndex = -1
    this.updateCurrIndex();
}

DataTable.fn.getRow = function (index) {
    //return this.rows()[index]   //modify by licza.   improve performance
    return this.rows.peek()[index]
};

/**
 * 根据rowid取row对象
 * @param rowid
 * @returns {*}
 */
DataTable.fn.getRowByRowId = function (rowid) {
    var rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].rowId == rowid)
            return rows[i]
    }
    return null
}

/**
 * 取行索引
 * @param row
 * @returns {*}
 */
DataTable.fn.getRowIndex = function (row){
    var rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].rowId === row.rowId)
            return i;
    }
    return -1;
};

DataTable.fn.getAllRows = function () {
    return this.rows.peek();
}

DataTable.fn.getAllPageRows = function () {
    var datas = [], rows;
    for (var i = 0; i < this.totalPages(); i++) {
        rows = [];
        if (i == this.pageIndex()) {
            rows = this.getData();
        } else {
            var page = this.cachedPages[i];
            if (page) {
                rows = page.getData();
            }
        }
        for (var j = 0; j < rows.length; j++) {
            datas.push(rows[j]);
        }
    }
    return datas;
}

/**
 * 获取变动的数据(新增、修改)
 */
DataTable.fn.getChangedDatas = function (withEmptyRow) {
    var datas = [], rows = this.rows();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i] && rows[i].status != Row.STATUS.NORMAL) {
            datas.push(rows[i].getData())
        }
        else if (withEmptyRow == true) {
            datas.push(rows[i].getEmptyData())
        }
    }
    return datas
};

/**
 * 取改变的行
 */
DataTable.fn.getChangedRows = function(){
    var changedRows = [], rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i] && rows[i].status != Row.STATUS.NORMAL) {
            changedRows.push(rows[i])
        }
    }
    return changedRows
}

DataTable.fn._formatToIndicesArray = function (indices) {
    if (typeof indices == 'string' || typeof indices == 'number') {
        indices = [indices]
    } else if (indices instanceof Row) {
        indices = this.getIndexByRowId(indices.rowId)
    } else if (u.isArray(indices) && indices.length > 0 && indices[0] instanceof Row) {
        for (var i = 0; i < indices.length; i++) {
            indices[i] = this.getIndexByRowId(indices[i].rowId)
        }
    }
    return indices;
};


/**
 * row :   {data:{}}
 * @constructor
 */
var Page = function (options) {
    this.focus = options['focus'] || null;
    this.selectedIndices = options['selectedIndices'] || null;
    this.rows = options['rows'] || []
    this.parent = options['parent'] || null;
}

Page.fn = Page.prototype

Page.fn.getData = function () {
    var datas = [], row, meta;
    meta = this.parent.getMeta()
    for (var i = 0; i < this.rows.length; i++) {
        row = this.rows[i];
        datas.push({'id': row.rowId, 'status': row.status, data: row.data});
    }
    return datas
}

Page.fn.getSelectDatas = function () {
    var datas = [], row;
    for (var i = 0; i < this.rows.length; i++) {
        row = this.rows[i];
        datas.push({'id': row.rowId, 'status': row.status, data: row.data});
    }
    for (var i = 0; i < this.selectedIndices.length; i++) {
        row = this.rows[this.selectedIndices[i]];
        datas.push({'id': row.rowId, 'status': row.status, data: row.data});
    }
    return datas
}

Page.fn.getRowByRowId = function (rowid) {
    for (var i = 0, count = this.rows.length; i < count; i++) {
        if (this.rows.rowId == rowid)
            return this.rows[i]
    }
    return null
}

Page.fn.removeRowByRowId = function (rowid) {
    for (var i = 0, count = this.rows.length; i < count; i++) {
        if (this.rows.rowId == rowid)
            this.rows.splice(i, 1);
    }
}

Page.fn.getSelectRows = function () {
    var rows = [];
    for (var i = 0; i < this.selectedIndices.length; i++) {
        rows.push(this.rows[this.selectedIndices[i]])
    }
    return rows
}

Page.fn.getRowByRowId = function (rowid) {
    for (var i = 0, count = this.rows.length; i < count; i++) {
        if (this.rows[i].rowId == rowid)
            return this.rows[i]
    }
    return null
}

Page.fn.setRowValue = function (rowIndex, fieldName, value) {
    var row = this.rows[rowIndex]
    if (row) {
        row.data[fieldName]['value'] = value
        if (row.status != Row.STATUS.NEW)
            row.status = Row.STATUS.UPDATE
    }
}

Page.fn.getRowValue = function (rowIndex, fieldName) {
    var row = this.rows[rowIndex]
    if (row) {
        return row.data[fieldName]['value']
    }
    return null
}

Page.fn.setRowMeta = function (rowIndex, fieldName, metaName, value) {
    var row = this.rows[rowIndex]
    if (row) {
        var meta = row[fieldName].meta
        if (!meta)
            meta = row[fieldName].meta = {}
        meta[metaName] = value
        if (row.status != Row.STATUS.NEW)
            row.status = Row.STATUS.UPDATE
    }
}

Page.fn.getRowMeta = function (rowIndex, fieldName, metaName) {
    var row = this.rows[rowIndex]
    if (row) {
        var meta = row[fieldName].meta
        if (!meta)
            return null
        else
            return meta[metaName]
    }
    return null
}


Page.fn.updateRow = function (originRow, newRow) {
    originRow.status = originRow.status
    //this.rowId = data.rowId
    if (!newRow.data) return;
    for (var key in newRow.data) {
        if (originRow.data[key]) {
            var valueObj = newRow.data[key]
            if (typeof valueObj == 'string' || typeof valueObj == 'number' || valueObj === null)
                originRow.data[key]['value'] = valueObj
            //this.setValue(key, this.formatValue(key, valueObj))
            else {
//					this.setValue(key, valueObj.value)

                if (valueObj.error) {
                    u.showMessageDialog({title: "警告", msg: valueObj.error, backdrop: true});
                } else {
                    //this.setValue(key, this.formatValue(key, valueObj.value), null)
                    originRow.data[key]['value'] = valueObj.value
                    for (var k in valueObj.meta) {
                        originRow.data[key]['meta'] = originRow.data[key]['meta'] || {}
                        originRow.data[key]['meta'][k] = valueObj.meta[k]
                    }
                }
            }
        }
    }
}


/**===========================================================================================================
 *
 * 行模型
 *
 * {id:'xxx', parent:dataTable1}
 *
 * data:{value:'v1',meta:{}}
 *
 * ===========================================================================================================
 */
var Row = function (options) {
    var self = this;
    this.rowId = options['id'] || Row.getRandomRowId()
    this.status = Row.STATUS.NEW
    //this.selected = ko.observable(false);
    //this.selected.subscribe(function(value){
    //    if (value === true){
    //        self.parent.addRowSelect(self);
    //    }else{
    //        self.parent.setRowUnSelect(self);
    //    }
    //
    //})
    this.parent = options['parent']
    this.initValue = null
    this.data = {}
    this.metaChange = {}//ko.observable(1)
    this.valueChange = ko.observable(1)
    this.selected = ko.pureComputed({
        read: function () {
            var index = this.parent.getRowIndex(this);
            var selectindices = this.parent.getSelectedIndices();
            return selectindices.indexOf(index) != -1;
        },
        owner: this

    })
    this.init()
}

Row.STATUS = {
    NORMAL: 'nrm',
    UPDATE: 'upd',
    NEW: 'new',
    DELETE: 'del',
    FALSE_DELETE: 'fdel'
}

Row.fn = Row.prototype = new Events()

/**
 * Row初始化方法
 * @private
 */
Row.fn.init = function () {
    var meta = this.parent.meta;
    //添加默认值
    for (var key in meta) {
        this.data[key] = {}
        if (meta[key]['default']) {
            var defaults = meta[key]['default']
            for (var k in defaults) {
                if (k == 'value')
                    this.data[key].value = defaults[k]
                else {
                    this.data[key].meta = this.data[key].meta || {}
                    this.data[key].meta[k] = defaults[k]
                }
            }
        }
    }
}

Row.fn.toggleSelect = function(type){
    var index = this.parent.getRowIndex(this);
    var selectindices = this.parent.getSelectedIndices();
    if (selectindices.indexOf(index) != -1){
        this.parent.setRowUnSelect(index);
    }else{
        if (type === 'single')
            this.parent.setRowSelect(index);
        else
            this.parent.addRowSelect(index);
    }
};

/**
 * 行点击事件
 */
Row.fn.singleSelect = function(){
    this.toggleSelect('single');
};

Row.fn.multiSelect = function(){
    this.toggleSelect('multi');
};

Row.fn.ref = function (fieldName) {
    return ko.pureComputed({
        read: function () {

            this.valueChange()
            return this._getField(fieldName)['value']
        },
        write: function (value) {
            this.setValue(fieldName, value)
        },
        owner: this
    })
}

Row.fn.refMeta = function (fieldName, key) {
    if (!this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key] = ko.observable(1);
    return ko.pureComputed({
        read: function () {
            this.metaChange[fieldName + '.' + key]()
            return this.getMeta(fieldName, key)
        },
        write: function (value) {
            this.setMeta(fieldName, key, value)
        },
        owner: this
    })
}
Row.fn.refCombo = function (fieldName, datasource) {
    return ko.pureComputed({
        read: function () {
            this.valueChange()
            var ds = u.getJSObject(this.parent.parent, datasource)
            if (this._getField(fieldName)['value'] === undefined || this._getField(fieldName)['value'] === "") return "";
            var v = this._getField(fieldName)['value'];
            var valArr = typeof v === 'string' ? v.split(',') : [v];

            var nameArr = []

            for (var i = 0, length = ds.length; i < length; i++) {
                for (var j = 0; j < valArr.length; j++) {
                    if (ds[i].pk == valArr[j]) {
                        nameArr.push(ds[i].name)
                    }
                }
            }

            return nameArr.toString();
        },
        write: function (value) {

            this.setValue(fieldName, value)
        },
        owner: this
    })
}
Row.fn.refDate = function (fieldName, format) {
    return ko.pureComputed({
        read: function () {
            this.valueChange()
            if (!this._getField(fieldName)['value']) return "";
            var valArr = this._getField(fieldName)['value']
            if (!valArr) return "";
            valArr = moment(valArr).format(format)
            return valArr;
        },
        write: function (value) {

            this.setValue(fieldName, value)
        },
        owner: this
    })
}
/**
 *获取row中某一列的值
 */
Row.fn.getValue = function (fieldName) {
    return this._getField(fieldName)['value']
}

var eq = function (a, b) {
    if ((a === null || a === undefined || a === '') && (b === null || b === undefined || b === '')) return true;
    if (u.isNumber(a) && u.isNumber(b) && parseFloat(a) == parseFloat(b)) return true;
    if (a + '' == b + '')  return true;
    return false;
}
/**
 *设置row中某一列的值
 */
Row.fn.setValue = function (fieldName, value, ctx, options) {
    var oldValue = this.getValue(fieldName) || ""
    if (eq(oldValue, value)) return;
    this._getField(fieldName)['value'] = value
    this._getField(fieldName).changed = true
    if (this.status != Row.STATUS.NEW)
        this.status = Row.STATUS.UPDATE
    this.valueChange(-this.valueChange())
    if (this.parent.getCurrentRow() == this)
        this.parent.valueChange(-this.parent.valueChange());

    var event = {
        eventType: 'dataTableEvent',
        dataTable: this.parent.id,
        rowId: this.rowId,
        field: fieldName,
        oldValue: oldValue,
        newValue: value,
        ctx: ctx || ""
    }
    this.parent.trigger(DataTable.ON_VALUE_CHANGE, event);
    this.parent.trigger(fieldName + "." + DataTable.ON_VALUE_CHANGE, event);
    if (this == this.parent.getCurrentRow())
        this.parent.trigger(fieldName + "." + DataTable.ON_CURRENT_VALUE_CHANGE, event);
}

/**
 *获取row中某一列的属性
 */
Row.fn.getMeta = function (fieldName, key, fetchParent) {
    if (arguments.length == 0) {
        var mt = {}
        for (var k in this.data) {
            mt[k] = this.data[k].meta ? this.data[k].meta : {}
        }
        return mt
    }
    var meta = this._getField(fieldName).meta
    if (meta && meta[key] !== undefined && meta[key] !== null && meta[key] !== '')
        return meta[key]
    else if (typeof fetchParent == 'undefined' || fetchParent != false)
        return this.parent.getMeta(fieldName, key)
    return undefined;
}

/**
 *设置row中某一列的属性
 */
Row.fn.setMeta = function (fieldName, key, value) {
    var meta = this._getField(fieldName).meta
    if (!meta)
        meta = this._getField(fieldName).meta = {}
    var oldValue = meta[key]
    if (eq(oldValue, value)) return;
    meta[key] = value
    //this.metaChange(- this.metaChange())
    if (this.metaChange[fieldName + '.' + key]) {
        this.metaChange[fieldName + '.' + key](-this.metaChange[fieldName + '.' + key]());
    }

    if (key == 'enable')
        this.parent.enableChange(-this.parent.enableChange())
    if (this.parent.getCurrentRow() == this) {
        if (this.parent.metaChange[fieldName + '.' + key])
            this.parent.metaChange[fieldName + '.' + key](-this.parent.metaChange[fieldName + '.' + key]());
        this.parent.trigger(fieldName + '.' + key + '.' + DataTable.ON_CURRENT_META_CHANGE, {
            eventType: 'dataTableEvent',
            dataTable: this.parent.id,
            oldValue: oldValue,
            newValue: value
        });
        //this.parent.metaChange(- this.parent.metaChange())
    }
    this.parent.trigger(DataTable.ON_ROW_META_CHANGE, {
        eventType: 'dataTableEvent',
        dataTable: this.parent.id,
        field: fieldName,
        meta: key,
        oldValue: oldValue,
        newValue: value,
        row: this
    });

    this.parent.trigger(fieldName + '.' + key + '.' + DataTable.ON_ROW_META_CHANGE, {
        eventType: 'dataTableEvent',
        dataTable: this.parent.id,
        field: fieldName,
        meta: key,
        oldValue: oldValue,
        newValue: value,
        row: this
    });
}

/**
 *设置Row数据
 *
 *  data.status
 *    data.data {'field1': {value:10,meta:{showValue:1.0,precision:2}}}
 */
Row.fn.setData = function (data) {
    this.status = data.status
    //this.rowId = data.rowId
    for (var key in data.data) {
        if (this.data[key]) {
            var valueObj = data.data[key]
            if (typeof valueObj == 'string' || typeof valueObj == 'number' || valueObj === null)
                this.data[key]['value'] = this.formatValue(key, valueObj)
            //this.setValue(key, this.formatValue(key, valueObj))
            else {
//					this.setValue(key, valueObj.value)

                if (valueObj.error) {
                    u.showMessageDialog({title: "警告", msg: valueObj.error, backdrop: true});
                } else {
                    //this.setValue(key, this.formatValue(key, valueObj.value), null)
                    this.data[key]['value'] = this.formatValue(key, valueObj.value)
                    for (var k in valueObj.meta) {
                        this.setMeta(key, k, valueObj.meta[k])
                    }
                }
            }
        }
    }
}

/**
 * 格式化数据值
 * @private
 * @param {Object} field
 * @param {Object} value
 */
Row.fn.formatValue = function (field, value) {
    var type = this.parent.getMeta(field, 'type')
    if (!type) return value
    if (type == 'date' || type == 'datetime') {
        return _formatDate(value)
    }
    return value
}

Row.fn.updateRow = function (row) {
    this.setData(row)
}

/**
 * @private
 * 提交数据到后台
 */
Row.fn.getData = function () {
    var data = ko.toJS(this.data)
    var meta = this.parent.getMeta()
    for (var key in meta) {
        if (meta[key] && meta[key].type) {
            if (meta[key].type == 'date' || meta[key].type == 'datetime') {
                data[key].value = _dateToUTCString(data[key].value)
            }
        }
    }
    return {'id': this.rowId, 'status': this.status, data: data}
}

Row.fn.getEmptyData = function () {
    return {'id': this.rowId, 'status': this.status, data: {}}
};

Row.fn.getSimpleData = function(options){
    options = options || {}
    var fields = options['fields'] || null;
    var meta = this.parent.getMeta();
    var data = ko.toJS(this.data)
    var _data = {};
    for (var key in meta) {
        if (fields && fields.indexOf(key) == -1)
            continue;
        if (meta[key] && meta[key].type) {
            if (meta[key].type == 'date' || meta[key].type == 'datetime') {
                data[key].value = _dateToUTCString(data[key].value)
            }
        }
        _data[key] = data[key].value;
    }
    return _data;

};

Row.fn._getField = function (fieldName) {
    var rat = this.data[fieldName];
    if (!rat) {
        throw new Error('field:' + fieldName + ' not exist in dataTable:' + this.parent.id + '!')
    }
    return rat
}


/*
 * 生成随机行id
 * @private
 */
Row.getRandomRowId = function () {
    return setTimeout(function () {
        }) + '';
};

var _formatDate = function (value) {
    if (!value) return value
    var date = new Date();
    date.setTime(value);
    //如果不能转为Date 直接返回原值
    if (isNaN(date)){
        return value
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (parseInt(month) < 10) month = "0" + month;
    var day = date.getDate();
    if (parseInt(day) < 10) day = "0" + day;
    var hours = date.getHours();
    if (parseInt(hours) < 10) hours = "0" + hours;
    var minutes = date.getMinutes();
    if (parseInt(minutes) < 10) minutes = "0" + minutes;
    var seconds = date.getSeconds();
    if (parseInt(seconds) < 10) seconds = "0" + seconds;
    var mill = date.getMilliseconds();
    var formatString = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + "." + mill;
    return formatString;
}

var _dateToUTCString = function (date) {
    if (!date) return ''
    if (date.indexOf("-") > -1)
        date = date.replace(/\-/g, "/");
    var utcString = Date.parse(date);
    if (isNaN(utcString)) return "";
    return utcString;
}


u.Row = Row;
u.DataTable = DataTable;




/**
 * Created by dingrf on 2016/1/15.
 */

/**
 * adapter基类
 */

u.BaseAdapter = u.Class.create({
    /**
     *
     * @param comp
     * @param options ：
     *      el: '#content',  对应的dom元素
     *      options: {},     配置
     *      model:{}        模型，包括数据和事件
     */
    initialize: function (options) {
        //this.comp = comp;
        this.element = options['el'];
        this.options = options['options'];
        this.viewModel = options['model'];
        this.dataModel = null;
        this.parseDataModel();


    },
    parseDataModel: function () {
        if (!this.options || !this.options["data"]) return;
        this.dataModel = u.getJSObject(this.viewModel, this.options["data"]);
        if (this.dataModel instanceof u.DataTable) {
            this.field = this.options["field"]
        }
    },


});
/**
 * 输入框基类，不可直接使用
 */

u.InputAdapter = u.BaseAdapter.extend({
    /**
     *
     * @param comp
     * @param options ：
     *      el: '#content',  对应的dom元素
     *      options: {},     配置
     *      model:{}        模型，包括数据和事件
     */
    initialize: function (options) {
        u.InputAdapter.superclass.initialize.apply(this, arguments);



        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        this.required = this.options['required'];
        this.maxLength = null;
        this.minLength = null;
        this.max = null;
        this.min = null;
        this.regExp = null;
        this.placement = this.options['placement'];
        this.tipId = this.options['tipId'];
        this.errorMsg = this.options['errorMsg'];
        this.nullMsg = this.options['nullMsg'];
        //this.create()
    },
    create: function () {
        var self = this;
        //处理数据绑定
        //this.dataModel.ref(this.field).subscribe(function(value) {
        //	self.modelValueChange(value)
        //})
        this.dataModel.on(this.field + "." + u.DataTable.ON_CURRENT_VALUE_CHANGE, function (event) {
            self.modelValueChange(event.newValue);
        });

        //处理只读
        //this.dataModel.refEnable(this.field).subscribe(function(value) {
        //		self.setEnable(value)
        //})
        //this.dataModel.on($.DataTable.ON_ENABLE_CHANGE, function(event){
        //	self.setEnable(event.enable);
        //});

        //this.dataModel.refRowMeta(this.field, 'enable').subscribe(function(value) {
        //	self.setEnable(value);
        //});


        this.dataModel.on(u.DataTable.ON_ENABLE_CHANGE, function (event) {
            if (event.enable === true) {
                var _enable = self.dataModel.getRowMeta(self.field, 'enable');
                if (_enable === true)
                    self.setEnable(_enable);
            } else {
                self.setEnable(event.enable);
            }
        });

        this.dataModel.on(this.field + '.enable.' + u.DataTable.ON_CURRENT_META_CHANGE, function (event) {
            self.setEnable(event.newValue);
        });

        this.dataModel.on(this.field + '.enable.' + u.DataTable.ON_ROW_META_CHANGE, function (event) {
            self.setEnable(event.newValue);
        });

        //处理必填
        //this.dataModel.refRowMeta(this.field, "required").subscribe(function(value) {
        //	self.setRequired(value)
        //})
        this.dataModel.on(this.field + '.required.' + u.DataTable.ON_CURRENT_META_CHANGE, function (event) {
            self.setRequired(event.newValue);
        });
        //this.dataModel.refRowMeta(this.field, "regExp").subscribe(function(value) {
        //	self.regExp = value
        //})
        this.dataModel.on(this.field + '.regExp.' + u.DataTable.ON_CURRENT_META_CHANGE, function (event) {
            self.regExp = event.newValue;
        });
        this.dataModel.on(u.DataTable.ON_CURRENT_ROW_CHANGE, function () {
            var row = self.dataModel.getCurrentRow();
            if (!row) {
                self.modelValueChange('');
                self.setEnable(false);
            } else {
                self.modelValueChange(row.getValue(self.field));
                if (this.enable === true) {
                    var _enable = row.getMeta(self.field, 'enable');
                    if (_enable === true || _enable === 'true' || _enable === false || _enable === 'false') {
                        self.setEnable(_enable);
                    }
                } else {
                    self.setEnable(this.enable);
                }
                self.setRequired(row.getMeta(self.field, 'required'));
            }
        });
        this.dataModel.on(u.DataTable.ON_CURRENT_UPDATE, function (event) {
            var row = event.rows[0];
            self.modelValueChange(row.getValue(self.field));
        });

        this.setEnable(this.dataModel.isEnable(this.field));
        this.setRequired(this.dataModel.getMeta(this.field, "required"));
        this.regExp = this.dataModel.getMeta(this.field, "regExp");
        this.modelValueChange(this.dataModel.getValue(this.field));

          if (this.validType)
              this.validate = new u.Validate({el:this.element,
                  single: true,
                  validMode: 'manually',
                  required: this.required,
                  validType: this.validType,
                  placement: this.placement,
                  tipId: this.tipId,
                  errorMsg: this.errorMsg,
                  nullMsg: this.nullMsg,
                  maxLength: this.maxLength,
                  minLength: this.minLength,
                  max: this.max,
                  min: this.min,
                  maxNotEq: this.maxNotEq,
                  minNotEq: this.minNotEq,
                  reg: this.regExp
              });

        if (this.element.nodeName == 'INPUT' && (!this.element.getAttribute("type") || this.element.getAttribute("type") == 'text')) {
            u.on(this.element, 'focus',function(e){
            	if(self.enable){
	                self.onFocusin ? self.onFocusin(e) : self.setShowValue(self.getValue());
	                //$(this).select();
               }
            });
            u.on(this.element, 'blur',function(e){
                if (!self.doValidate() && self._needClean()) {
                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                        // 因必输项清空导致检验没通过的情况
                        self.setValue('')
                    } else {
                        self.element.value = self.getShowValue()
                    }
                }
                else
                    self.setValue(self.element.value)
            });
        }


    },
    /**
     * 模型数据改变
     * @param {Object} value
     */
    modelValueChange: function (value) {

    },

    /**
     * 设置模型值
     * @param {Object} value
     */
    setModelValue: function (value) {
        if (!this.dataModel) return
        this.dataModel.setValue(this.field, value)
    },
    /**
     * 设置控件值
     * @param {Object} value
     */
    setValue: function (value) {
    },
    /**
     * 取控件的值
     */
    getValue: function () {
        return this.trueValue
    },
    setShowValue: function (showValue) {
        this.showValue = showValue;
        this.element.value = showValue;
        this.element.title = showValue;

    },
    getShowValue: function () {
        return this.showValue
    },
    setEnable: function (enable) {
        var id = this.element.getAttribute('id');
        if (enable === true || enable === 'true') {
            this.enable = true;
            this.element.removeAttribute('readonly');
            u.removeClass(this.element.parentNode,'disablecover');
            //$(this.element).parent().removeClass('disablecover').find('.covershade').remove()
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            this.element.setAttribute('readonly', 'readonly');
            u.addClass(this.element.parentNode,'disablecover');
            //var tmpelement = $(this.element)
            //if (tmpelement.parent().hasClass('disablecover')) {
            //    return
            //}
            //;
            //tmpelement.attr('readonly', 'readonly')
            //tmpelement.parent().addClass('disablecover').prepend('<div class="covershade"></div>')
        }
    },
    setRequired: function (required) {
        if (required === true || required === 'true') {
            this.required = true;
            //$(this.element).siblings('.u-mustFlag').show()
        } else if (required === false || required === 'false') {
            this.required = false;
            //$(this.element).siblings('.u-mustFlag').hide()
        }
    },
//		setDataTableRow: function(row) {
//			this.dataTableRow = row
//		},
    /**
     *校验
     */
    doValidate: function (trueValue) {
        if (this.validate) {
            if (trueValue)
                return this.validate.check(this.getValue());
            else
                return this.validate.check()
        } else {
            return true
        }
    },
    /**
     * 是否需要清除数据
     */
    _needClean: function () {
        if (this.validate)
            return this.validate._needClean();
        else return false
    },
});


u.IntegerAdapter = u.InputAdapter.extend({
    initialize: function (options) {
        u.IntegerAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'integer';
        this.max = options['max'];
        this.min = options['min'];
        this.maxNotEq = options['maxNotEq'];
        this.minNotEq = options['minNotEq'];
        this.maxLength = options['maxLength'] ? options['maxLength'] : 25;
        this.minLength = options['mixLength'] ? options['mixLength'] : 0;

        if (this.dataModel) {
            //if (this.hasDataTable) {
                this.min = this.dataModel.getMeta(this.field, "min") !== undefined ? this.dataModel.getMeta(this.field, "min") : this.min;
                this.max = this.dataModel.getMeta(this.field, "max") !== undefined ? this.dataModel.getMeta(this.field, "max") : this.max;
                this.minNotEq = this.dataModel.getMeta(this.field, "minNotEq") !== undefined ? this.dataModel.getMeta(this.field, "minNotEq") : this.minNotEq;
                this.maxNotEq = this.dataModel.getMeta(this.field, "maxNotEq") !== undefined ? this.dataModel.getMeta(this.field, "maxNotEq") : this.maxNotEq;
                this.minLength = u.isNumber(this.dataModel.getMeta(this.field, "minLength")) ? this.dataModel.getMeta(this.field, "minLength") : this.minLength;
                this.maxLength = u.isNumber(this.dataModel.getMeta(this.field, "maxLength")) ? this.dataModel.getMeta(this.field, "maxLength") : this.maxLength;
            //}
        }

        this.create()

    },
    modelValueChange: function (value) {
        if (this.slice) return;
        value = value || "";
        this.trueValue = value;
        this.showValue = value;
        this.setShowValue(this.showValue)
    },
    setValue: function (value) {
        this.trueValue = value;
        this.showValue = value;
        this.setShowValue(this.showValue);
        this.slice = true;
        this.setModelValue(this.trueValue);
        this.slice = false;
        //this.trigger(u.IntegerAdapter.EVENT_VALUE_CHANGE, this.trueValue)
    },
    getValue: function () {
        return this.trueValue
    },
    setShowValue: function (showValue) {
        this.showValue = showValue;
        this.element.value = showValue;
    },
    getShowValue: function () {
        return this.showValue
    }

});


u.compMgr.addDataAdapter(
    {
        adapter: u.IntegerAdapter,
        name: 'integer',
        //dataType: 'integer'
    })
//u.compMgr.addDataAdapter(
//    {
//        adapter: u.IntegerAdapter,
//        name: 'originText',
//        dataType: 'integer'
//    })




u.FloatAdapter = u.InputAdapter.extend({

    initialize: function (options) {
        u.FloatAdapter.superclass.initialize.apply(this, arguments);
        var self = this;
        this.maskerMeta = u.core.getMaskerMeta('float') || {};
        this.maskerMeta.precision = options['precision'] || this.maskerMeta.precision;
        this.validType = 'float';
        this.max = options['max'] ? options['max'] : "10000000000000000000";
        this.min = options['min'] ? options['min'] : "-10000000000000000000";
        this.maxLength = options['maxLength'] ? options['maxLength'] : 25;
        this.minLength = options['mixLength'] ? options['mixLength'] : 0;
        this.maxNotEq = options['maxNotEq'];
        this.minNotEq = options['minNotEq'];

        if (this.dataModel) {
            //处理数据精度
                //this.dataModel.refRowMeta(this.field, "precision").subscribe(function(precision){
                //	if(precision === undefined)return;
                //	self.setPrecision(precision)
                //})
                this.dataModel.on(this.field + '.precision.' + u.DataTable.ON_CURRENT_META_CHANGE, function (event) {
                    if (event.newValue === undefined)
                        return;
                    self.setPrecision(event.newValue);
                });

                this.dataModel.on(this.field + '.precision.' + u.DataTable.ON_ROW_META_CHANGE, function (event) {
                    if (event.newValue === undefined)
                        return;
                    self.setPrecision(event.newValue);
                })

                this.maskerMeta.precision = this.dataModel.getMeta(this.field, "precision") || this.maskerMeta.precision;
                this.min = u.isNumber(this.dataModel.getMeta(this.field, "min")) ? this.dataModel.getMeta(this.field, "min") : this.min;
                this.max = u.isNumber(this.dataModel.getMeta(this.field, "max")) ? this.dataModel.getMeta(this.field, "max") : this.max;
                this.minLength = u.isNumber(this.dataModel.getMeta(this.field, "minLength")) ? this.dataModel.getMeta(this.field, "minLength") : this.minLength;
                this.maxLength = u.isNumber(this.dataModel.getMeta(this.field, "maxLength")) ? this.dataModel.getMeta(this.field, "maxLength") : this.maxLength;
                this.minNotEq = u.isNumber(this.dataModel.getMeta(this.field, "minNotEq")) !== undefined ? this.dataModel.getMeta(this.field, "minNotEq") : this.minNotEq;
                this.maxNotEq = u.isNumber(this.dataModel.getMeta(this.field, "maxNotEq")) !== undefined ? this.dataModel.getMeta(this.field, "maxNotEq") : this.maxNotEq;
        }
        this.formater = new u.NumberFormater(this.maskerMeta.precision);
        this.masker = new u.NumberMasker(this.maskerMeta);
        this.create();
    },
    modelValueChange: function (value) {
        if (value === null || typeof value == "undefined")
            value = value || "";
        value = parseFloat(value);
        //	this.trueValue = value
        //	var formatValue = this.formater.format(this.trueValue)
        var pres = this.dataModel.getRowMeta(this.field, "precision");
        this.maskerMeta.precision = (pres === undefined || pres === null || pres === '') ? this.maskerMeta.precision : pres;
        this.formater.precision = this.maskerMeta.precision;
        var formatValue = this.formater.format(value);
        this.trueValue = formatValue;
        this.element.trueValue = this.trueValue;
        this.showValue = this.masker.format(formatValue).value;
        this.setShowValue(this.showValue);
    },
    setValue: function (value) {
        value = parseFloat(value);
        this.maskerMeta.precision = this.dataModel.getRowMeta(this.field, "precision") || this.maskerMeta.precision
        this.formater.precision = this.maskerMeta.precision;
        var mvalue = this.dataModel.getCurrentRow().getValue(this.field);
        if (value == mvalue) {
            this.showValue = this.masker.format(this.trueValue).value;
            this.setShowValue(this.showValue)
        } else {
            this.trueValue = this.formater.format(value)
            this.element.trueValue = this.trueValue
            this.showValue = this.masker.format(this.trueValue).value;
            this.setShowValue(this.showValue);
            this.setModelValue(this.trueValue);
            //this.trigger(u.FloatAdapter.EVENT_VALUE_CHANGE, this.trueValue)
        }

    },
    getValue: function () {
        return this.trueValue
    },
    //setShowValue: function (showValue) {
    //    this.showValue = showValue;
    //    if (showValue !== null && showValue !== undefined) {
    //        this.element.value = showValue;
    //        this.element.title = showValue;
    //    }
    //},
    getShowValue: function () {
        return this.showValue
    },
    /**
     * 修改精度
     * @param {Integer} precision
     */
    setPrecision: function (precision) {
        if (this.maskerMeta.precision == precision) return;
        this.maskerMeta.precision = precision
        this.formater = new u.NumberFormater(this.maskerMeta.precision);
        this.masker = new u.NumberMasker(this.maskerMeta);
        var currentRow = this.dataModel.getCurrentRow();
        if (currentRow) {
            var v = this.dataModel.getCurrentRow().getValue(this.field)
            this.showValue = this.masker.format(this.formater.format(v)).value
        } else {
            this.showValue = this.masker.format(this.formater.format(this.trueValue)).value
        }

        this.setShowValue(this.showValue)
    },
    onFocusin: function (e) {
        var v = this.dataModel.getCurrentRow().getValue(this.field), vstr = v + '', focusValue = v;
        if (u.isNumber(v) && u.isNumber(this.maskerMeta.precision)) {
            if (vstr.indexOf('.') >= 0) {
                var sub = vstr.substr(vstr.indexOf('.') + 1);
                if (sub.length < this.maskerMeta.precision || parseInt(sub.substr(this.maskerMeta.precision)) == 0) {
                    focusValue = this.formater.format(v)
                }
            } else if (this.maskerMeta.precision > 0) {
                focusValue = this.formater.format(v)
            }
        }
        focusValue = parseFloat(focusValue) || '';
        this.setShowValue(focusValue)

    },
    _needClean: function () {
        return true
    },
    Statics: {
        compName: 'float'
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.FloatAdapter,
        name: 'float'
        //dataType: 'float'
    })
//u.compMgr.addDataAdapter(
//    {
//        adapter: u.FloatAdapter,
//        name: 'originText',
//        dataType: 'float'
//    })



/**
 * 货币控件
 */
u.CurrencyAdapter = u.InputAdapter.extend({
    initialize: function (options) {
        var self = this;
        u.CurrencyAdapter.superclass.initialize.apply(this, arguments);


        this.maskerMeta = iweb.Core.getMaskerMeta('currency') || {};
        this.maskerMeta.precision = options['precision'] || this.maskerMeta.precision;
        this.maskerMeta.curSymbol = options['curSymbol'] || this.maskerMeta.curSymbol;
        this.validType = 'float';
        this.max = options['max'];
        this.min = options['min'];
        this.maxNotEq = options['maxNotEq'];
        this.minNotEq = options['minNotEq'];
        this.maxLength = options['maxLength'] ? options['maxLength'] : 25;
        this.minLength = options['mixLength'] ? options['mixLength'] : 0;
        if (this.dataModel) {
            //处理数据精度
            //this.dataModel.refRowMeta(this.field, "precision").subscribe(function(precision){
            //	self.setPrecision(precision)
            //})
            this.dataModel.on(this.field + '.precision.' + u.DataTable.ON_CURRENT_META_CHANGE, function (event) {
                self.setPrecision(event.newValue)
            });
            this.maskerMeta.precision = this.dataModel.getMeta(this.field, "precision") || this.maskerMeta.precision
            //this.dataModel.refRowMeta(this.field, "curSymbol").subscribe(function(symbol){
            //	self.setCurSymbol(symbol)
            //})
            this.dataModel.on(this.field + '.curSymbol.' + u.DataTable.ON_CURRENT_META_CHANGE, function (event) {
                self.setCurSymbol(event.newValue)
            });

            this.maskerMeta.curSymbol = this.dataModel.getMeta(this.field, "curSymbol") || this.maskerMeta.curSymbol
            this.min = this.dataModel.getMeta(this.field, "min") !== undefined ? this.dataModel.getMeta(this.field, "min") : this.min
            this.max = this.dataModel.getMeta(this.field, "max") !== undefined ? this.dataModel.getMeta(this.field, "max") : this.max
            this.minNotEq = this.dataModel.getMeta(this.field, "minNotEq") !== undefined ? this.dataModel.getMeta(this.field, "minNotEq") : this.minNotEq
            this.maxNotEq = this.dataModel.getMeta(this.field, "maxNotEq") !== undefined ? this.dataModel.getMeta(this.field, "maxNotEq") : this.maxNotEq
            this.minLength = u.isNumber(this.dataModel.getMeta(this.field, "minLength")) ? this.dataModel.getMeta(this.field, "minLength") : this.minLength
            this.maxLength = u.isNumber(this.dataModel.getMeta(this.field, "maxLength")) ? this.dataModel.getMeta(this.field, "maxLength") : this.maxLength
        }
        this.formater = new u.NumberFormater(this.maskerMeta.precision);
        this.masker = new CurrencyMasker(this.maskerMeta);
        this.create()
    },
    modelValueChange: function (value) {
        if (value === null || typeof value == "undefined")
            value = value || ""
        this.maskerMeta.precision = this.dataModel.getRowMeta(this.field, "precision") || this.maskerMeta.precision
        this.maskerMeta.curSymbol = this.dataModel.getRowMeta(this.field, "curSymbol") || this.maskerMeta.curSymbol
        this.formater.precision = this.maskerMeta.precision;
        this.masker.formatMeta.curSymbol = this.maskerMeta.curSymbol
        //	this.trueValue = value
        //	var formatValue = this.formater.format(this.trueValue)
        var formatValue = this.formater.format(value)
        this.trueValue = formatValue
        this.element.trueValue = this.trueValue
        this.showValue = this.masker.format(formatValue).value
        this.setShowValue(this.showValue)
    },
    setValue: function (value) {
        this.maskerMeta.precision = this.dataModel.getRowMeta(this.field, "precision") || this.maskerMeta.precision
        this.formater.precision = this.maskerMeta.precision;
        var mvalue = this.dataModel.getCurrentRow().getValue(this.field)
        if (value == mvalue) {
            this.showValue = this.masker.format(this.trueValue).value
            this.setShowValue(this.showValue)
        } else {
            this.trueValue = this.formater.format(value)
            this.element.trueValue = this.trueValue
            this.showValue = this.masker.format(this.trueValue).value
            this.setShowValue(this.showValue)
            this.setModelValue(this.trueValue)
            this.trigger(CurrencyComp.EVENT_VALUE_CHANGE, this.trueValue)
        }

    },
    getValue: function () {
        return this.trueValue
    },
    setShowValue: function (showValue) {
        this.showValue = showValue
        this.element.value = showValue
    },
    getShowValue: function () {
        return this.showValue
    },
    /**
     * 修改精度
     * @param {Integer} precision
     */
    setPrecision: function (precision) {
        if (this.maskerMeta.precision == precision) return
        this.maskerMeta.precision = precision
        this.formater = new u.NumberFormater(this.maskerMeta.precision);
        this.masker = new u.CurrencyMasker(this.maskerMeta);
        var currentRow = this.dataModel.getCurrentRow();
        if (currentRow) {
            var v = this.dataModel.getCurrentRow().getValue(this.field)
            this.showValue = this.masker.format(this.formater.format(v)).value
        } else {
            this.showValue = this.masker.format(this.formater.format(this.trueValue)).value
        }
        this.setShowValue(this.showValue)
    },
    /**
     * 修改币符
     * @param {String} curSymbol
     */
    setCurSymbol: function (curSymbol) {
        if (this.maskerMeta.curSymbol == curSymbol) return
        this.maskerMeta.curSymbol = curSymbol
        this.masker.formatMeta.curSymbol = this.maskerMeta.curSymbol
        this.element.trueValue = this.trueValue
        this.showValue = this.masker.format(this.trueValue).value
        this.setShowValue(this.showValue)

    },
    onFocusin: function (e) {
        var v = this.getValue(), vstr = v + '', focusValue = v
        if (u.isNumber(v) && u.isNumber(this.maskerMeta.precision)) {
            if (vstr.indexOf('.') >= 0) {
                var sub = vstr.substr(vstr.indexOf('.') + 1)
                if (sub.length < this.maskerMeta.precision || parseInt(sub.substr(this.maskerMeta.precision)) == 0) {
                    focusValue = this.formater.format(v)
                }
            } else if (this.maskerMeta.precision > 0) {
                focusValue = this.formater.format(v)
            }
        }
        this.setShowValue(focusValue)

    },
    Statics: {
        compName: 'currency'
    }
})

u.compMgr.addDataAdapter(
    {
        adapter: u.StringAdapter,
        name: 'currency',
        //dataType: 'currency'
    })
//u.compMgr.addDataAdapter(
//    {
//        adapter: u.StringAdapter,
//        name: 'originText',
//        dataType: 'currency'
//    })

/**
 * 百分比控件
 */
u.PercentAdapter = u.InputAdapter.extend({
    initialize: function (options) {
        u.PercentAdapter.superclass.initialize.apply(this, arguments);
        var self = this;
        this.validType = 'float';
        this.max = options['max'];
        this.min = options['min'];
        this.maxNotEq = options['maxNotEq'];
        this.minNotEq = options['minNotEq'];
        if (this.dataModel) {
            if (this.hasDataTable) {
                this.min = this.dataModel.getMeta(this.field, "min") !== undefined ? this.dataModel.getMeta(this.field, "min") : this.min;
                this.max = this.dataModel.getMeta(this.field, "max") !== undefined ? this.dataModel.getMeta(this.field, "max") : this.max;
                this.minNotEq = this.dataModel.getMeta(this.field, "minNotEq") !== undefined ? this.dataModel.getMeta(this.field, "minNotEq") : this.minNotEq;
                this.maxNotEq = this.dataModel.getMeta(this.field, "maxNotEq") !== undefined ? this.dataModel.getMeta(this.field, "maxNotEq") : this.maxNotEq;

            }
        }
        this.masker = new PercentMasker();
        this.create()
    },
    modelValueChange: function (value) {
        if (this.slice) return;
        value = value || "";
        this.trueValue = value;
        this.showValue = this.masker.format(value).value;
        this.setShowValue(this.showValue);
    },
    setValue: function (value) {
        this.trueValue = value;
        this.showValue = this.masker.format(value).value;
        this.setShowValue(this.showValue);
        this.slice = true;
        this.setModelValue(this.trueValue);
        this.slice = false;
        //this.trigger(PercentAdapter.EVENT_VALUE_CHANGE, this.trueValue)
    },
    getValue: function () {
        return this.trueValue
    },
    setShowValue: function (showValue) {
        this.showValue = showValue
        this.element.value = showValue
    },
    getShowValue: function () {
        return this.showValue
    }
});


u.compMgr.addDataAdapter(
    {
        adapter: u.PercentAdapter,
        name: 'percent',
        //dataType: 'percent'
    })
//u.compMgr.addDataAdapter(
//    {
//        adapter: u.PercentAdapter,
//        name: 'originText',
//        dataType: 'percent'
//    })



u.StringAdapter = u.InputAdapter.extend({
    initialize: function (options) {
        u.StringAdapter.superclass.initialize.apply(this, arguments);
        var self = this
        this.validType = 'string';
        this.maxLength = options['maxLength'];
        this.minLength = options['minLength'];
        if (this.dataModel) {
                this.minLength = this.dataModel.getMeta(this.field, "minLength") || this.minLength;
                this.maxLength = this.dataModel.getMeta(this.field, "maxLength") || this.maxLength
        }
        this.create();
        if (this.element.nodeName == 'INPUT') {
            u.on(this.element, 'focus', function(){
                self.setShowValue(self.getValue())
            })
            u.on(this.element, 'blur', function(){
                self.setValue(self.element.value)
            });
        }
    },

    modelValueChange: function (value) {
        if (this.slice) return
        value = value || ""
        this.trueValue = value
        this.showValue = value//this.masker.format(value).value
        this.setShowValue(this.showValue)
    },
    setValue: function (value) {
        this.trueValue = value//this.formater.format(value)
        this.showValue = value//this.masker.format(value).value
        this.setShowValue(this.showValue)
        this.slice = true
        this.setModelValue(this.trueValue)
        this.slice = false
        //this.trigger(StringComp.EVENT_VALUE_CHANGE, this.trueValue)
    },
    getValue: function () {
        return this.trueValue
    },
    //setShowValue: function (showValue) {
    //    this.showValue = showValue
    //    this.element.value = showValue
    //    this.element.title = showValue
    //},
    getShowValue: function () {
        return this.showValue
    },

    Statics: {
        compName: 'string'
    }
});


u.compMgr.addDataAdapter(
    {
        adapter: u.StringAdapter,
        name: 'string',
        //dataType: 'string'
    })
//u.compMgr.addDataAdapter(
//    {
//        adapter: u.StringAdapter,
//        name: 'originText',
//        dataType: 'string'
//    })
//

	

u.TextAreaAdapter = u.InputAdapter.extend({
    initialize: function (options) {
        var self = this
        u.TextAreaAdapter.superclass.initialize.apply(this, arguments);
        this.create()

        if (this.element.nodeName == 'TEXTAREA') {
            u.on(this.element, 'focus', function () {
                self.setShowValue(self.getValue())
            });
            u.on(this.element, 'blur', function () {
                self.setValue(self.element.value)
            })
        }
    },

    modelValueChange: function (value) {
        if (this.slice) return;
        value = value || "";
        this.trueValue = value;
        this.showValue = value //this.masker.format(value).value
        this.setShowValue(this.showValue)
    },
    setValue: function (value) {
        this.trueValue = value //this.formater.format(value)
        this.showValue = value //this.masker.format(value).value
        this.setShowValue(this.showValue)
        this.slice = true
        this.setModelValue(this.trueValue)
        this.slice = false
        this.trigger(Textarea.EVENT_VALUE_CHANGE, this.trueValue)
    },
    getValue: function () {
        return this.trueValue
    },
    setShowValue: function (showValue) {
        this.showValue = showValue
        this.element.value = showValue
        this.element.title = showValue
    },
    getShowValue: function () {
        return this.showValue
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.TextAreaAdapter,
        name: 'textarea',
        //dataType: 'textarea'
    })



/**
 * Created by dingrf on 2016/1/25.
 */

u.TextFieldAdapter = u.BaseAdapter.extend({
    /**
     *
     * @param comp
     * @param options ：
     *      el: '#content',  对应的dom元素
     *      options: {},     配置
     *      model:{}        模型，包括数据和事件
     */
    initialize: function (options) {
        u.TextFieldAdapter.superclass.initialize.apply(this, arguments);
        //this.comp = comp;
        //this.element = options['el'];
        //this.options = options['options'];
        //this.viewModel = options['model'];
        var dataType = this.dataModel.getMeta(this.field,'type') || 'string';
        //var dataType = this.options['dataType'] || 'string';

        this.comp = new u.Text(this.element);
        this.element['u.Text'] = this.comp;


        if (dataType === 'float'){
            this.trueAdpt = new u.FloatAdapter(options);
        }
        else if (dataType === 'string'){
            this.trueAdpt = new u.StringAdapter(options);
        }
        else if (dataType === 'integer'){
            this.trueAdpt = new u.IntegerAdapter(options);
        }else{
            throw new Errow("u-text only support 'float' or 'string' or 'integer' field type, not support " + dateType);
        }


        this.trueAdpt.comp = this.comp;
        this.trueAdpt.setShowValue = function (showValue) {
            this.showValue = showValue;
            //if (this.comp.compType === 'text')
            this.comp.change(showValue);
            this.element.title = showValue;
        }

    },


});

u.compMgr.addDataAdapter(
    {
        adapter: u.TextFieldAdapter,
        name: 'u-text'
        //dataType: 'float'
    })
u.CheckboxAdapter = u.BaseAdapter.extend({
    initialize: function (options) {
        var self = this;
        u.CheckboxAdapter.superclass.initialize.apply(this, arguments);

        this.comp = new u.Checkbox(this.element);
        this.element['u.Checkbox'] = this.comp;
        this.checkedValue =  this.options['checkedValue'] || this.comp._inputElement.value;
        this.unCheckedValue =  this.options["unCheckedValue"];
        this.isGroup = this.options['isGroup'] === true || this.options['isGroup'] === 'true';
        this.comp.on('change', function(event){
            if (self.slice) return;
            var modelValue = self.dataModel.getValue(self.field);
            if (self.isGroup) {
                var valueArr = modelValue == '' ? [] : modelValue.split(',');

                if (self.comp._inputElement.checked) {
                    valueArr.push(self.checkedValue)
                } else {
                    var index = valueArr.indexOf(self.checkedValue);
                    valueArr.splice(index, 1);
                }
                self.dataModel.setValue(self.field, valueArr.join(','));
            }else{
                if (self.comp._inputElement.checked) {
                    self.dataModel.setValue(self.field, self.checkedValue);
                }else{
                    self.dataModel.setValue(self.field, self.unCheckedValue)
                }
            }
        });

        //this.dataModel.on(this.field + "." + u.DataTable.ON_CURRENT_VALUE_CHANGE, function (event) {
        //    self.modelValueChange(event.newValue);
        //});
        this.dataModel.ref(this.field).subscribe(function(value) {
        	self.modelValueChange(value)
        })


    },

    modelValueChange: function (val) {
        if (this.slice) return;
        if (this.isGroup){
            if (this.comp._inputElement.checked != (val + ',').indexOf(this.checkedValue) > -1){
                this.slice = true;
                this.comp.toggle();
                this.slice = false;
            }
        }else{
            if (this.comp._inputElement.checked != (val === this.checkedValue)){
                this.slice = true;
                this.comp.toggle();
                this.slice = false;
            }
        }

        //if (this.slice) return;
        //val = val || "";
        //this.trueValue = val;
        //if (val == 'Y' || val == 'true') {
        //    this.showValue = true;
        //} else if (val == 'N' || val == 'false') {
        //    this.showValue = false;
        //} else {
        //    this.showValue = false;
        //}
        //this.setShowValue(this.showValue)
    },
    //setValue: function (val) {
    //    this.trueValue = val;
    //    if (val == 'Y' || val == 'true') {
    //        this.showValue = true;
    //    } else if (val == 'N' || val == 'false') {
    //        this.showValue = false;
    //    } else {
    //        this.showValue = false;
    //    }
    //    this.setShowValue(this.showValue);
    //    this.slice = true;
    //    this.setModelValue(this.trueValue);
    //    this.slice = false
    //},
    //getValue: function () {
    //    return this.trueValue
    //},
    //setShowValue: function (showValue) {
    //    this.showValue = showValue;
    //    if (this.showValue === true)
    //        this.comp.check();
    //    else
    //        this.comp.uncheck();
    //},
    //getShowValue: function () {
    //    return this.showValue
    //},
    setEnable: function (enable) {
        if (enable === true || enable === 'true') {
            this.enable = true
        } else if (enable === false || enable === 'false') {
            this.enable = false
        }
    }
})


u.compMgr.addDataAdapter(
    {
        adapter: u.CheckboxAdapter,
        name: 'u-checkbox'
    });

u.ComboboxAdapter = u.BaseAdapter.extend({
    initialize: function (comp, options) {
        var self = this;
        u.ComboboxAdapter.superclass.initialize.apply(this, arguments);
        this.datasource = u.getJSObject(this.viewModel, this.options['datasource']);
        this.single = this.options.single;
        this.mutil = this.options.mutil;
        this.validType = 'combobox';

        this.comp = new u.Combo(this.element);
        this.element['u.Combo'] = this.comp;
        if (this.datasource)
            this.comp.setComboData(this.datasource);

        //TODO 后续支持多选
        if (this.mutil) {
            //$(this.comboEle).on("mutilSelect", function (event, value) {
            //    self.setValue(value)
            //})
        }

        this.comp.on('select', function(event){
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    /**
     * 增加dom事件
     * @param {String} name
     * @param {Function} callback
     */
    //addDomEvent: function (name, callback) {
    //    //$(this.comboEle).on(name, callback)
    //    return this
    //},
    /**
     * 移除dom事件
     * @param {String} name
     */
    //removeDomEvent: function (name) {
    //    //$(this.comboEle).off(name)
    //},
    modelValueChange: function (value) {
        if (this.slice) return;
        //this.trueValue = value;
        this.comp.setValue(value);
    },
    //setValue: function (value) {
    //    this.trueValue = value;
    //    this.slice = true;
    //    this.setModelValue(this.trueValue);
    //    this.slice = false;
    //},
    //getValue: function () {
    //    return this.trueValue
    //},
    setEnable: function (enable) {
        //if (enable === true || enable === 'true') {
        //    this.enable = true;
        //} else if (enable === false || enable === 'false') {
        //    this.enable = false;
        //
        //}
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.ComboboxAdapter,
        name: 'u-combobox'
    });





u.RadioAdapter = u.BaseAdapter.extend({
    initialize: function (options) {
        var self = this;
        u.RadioAdapter.superclass.initialize.apply(this, arguments);

        this.comp = new u.Radio(this.element);
        this.element['u.Radio'] = this.comp;
        this.eleValue = this.comp._btnElement.value;

        this.comp.on('change', function(event){
            if (self.slice) return;
            var modelValue = self.dataModel.getValue(self.field);
            //var valueArr = modelValue == '' ?  [] : modelValue.split(',');
            if (self.comp._btnElement.checked){
                self.dataModel.setValue(self.field, self.eleValue);
            }
        });

        //this.dataModel.on(this.field + "." + u.DataTable.ON_CURRENT_VALUE_CHANGE, function (event) {
        //    self.modelValueChange(event.newValue);
        //});
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },

    modelValueChange: function (val) {
        if (this.slice) return;
        if (this.eleValue == val){
            this.slice = true
            this.comp._btnElement.click();
            this.slice = false
        }
    },

    setEnable: function (enable) {
        //if (enable === true || enable === 'true') {
        //    this.enable = true
        //} else if (enable === false || enable === 'false') {
        //    this.enable = false
        //}
    }
})


u.compMgr.addDataAdapter(
    {
        adapter: u.RadioAdapter,
        name: 'u-radio'
    });

u.PaginationAdapter = u.BaseAdapter.extend({
        initialize: function (comp, options) {
            var self = this;
            u.ComboboxAdapter.superclass.initialize.apply(this, arguments);

            //var Pagination = function(element, options, viewModel) {

            if (!this.dataModel.pageSize() && this.options.pageSize)
                this.dataModel.pageSize(this.options.pageSize)
            this.options.pageSize = this.dataModel.pageSize() || this.options.pageSize;
            //this.$element.pagination(options);
            //this.comp = this.$element.data('u.pagination');
            this.comp = new u.pagination({el:this.element,jumppage:true});
			this.element['u.pagination'] = this.comp;
            this.comp.dataModel = this.dataModel;
            this.pageChange = u.getFunction(this.viewModel, this.options['pageChange']);
            this.sizeChange = u.getFunction(this.viewModel, this.options['sizeChange']);

            this.comp.on('pageChange', function (event, pageIndex) {
                if (typeof self.pageChange == 'function') {
                    self.pageChange(pageIndex);
                } else {
                    self.defaultPageChange(pageIndex);
                }

            });
            this.comp.on('sizeChange', function (event, size, pageIndex) {
                if (typeof self.sizeChange == 'function') {
                    self.sizeChange(size, pageIndex);
                } else {
                    u.showMessage({msg:"没有注册sizeChange事件"});
                }
            });


            this.dataModel.totalPages.subscribe(function (value) {
                self.comp.update({totalPages: value})
            })

            this.dataModel.pageSize.subscribe(function (value) {
                self.comp.update({pageSize: value})
            })

            this.dataModel.pageIndex.subscribe(function (value) {
                self.comp.update({currentPage: value + 1})
            })

        },

        defaultPageChange: function (pageIndex) {
        if (this.dataModel.hasPage(pageIndex)) {
            this.dataModel.setCurrentPage(pageIndex)
        } else {
        }
    },

    disableChangeSize: function () {
        this.comp.disableChangeSize();
    },

    enableChangeSize: function () {
        this.comp.enableChangeSize();
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.PaginationAdapter,
        name: 'pagination'
    });





u.DateTimeAdapter = u.BaseAdapter.extend({
	initialize: function (options) {
		var self = this;
		u.DateTimeAdapter.superclass.initialize.apply(this, arguments);
		this.adapterType =  options.type || this.dataModel.getMeta(this.field, "type") || 'datetime';

		this.maskerMeta = u.core.getMaskerMeta(this.adapterType) || {};
		this.maskerMeta.format = this.options['format'] || this.maskerMeta.format;

		this.dataModel.on(this.field + '.format.' +  u.DataTable.ON_CURRENT_META_CHANGE, function(event){
			self.setFormat(event.newValue)
		});

		this.maskerMeta.format = this.dataModel.getMeta(this.field, "format") || this.maskerMeta.format

		//if(!this.options['format'])
		//	this.options.format = "YYYY-MM-DD HH:mm:ss";
		//this.formater = new $.DateFormater(this.maskerMeta.format);
		//this.masker = new DateTimeMasker(this.maskerMeta);

		this.comp = new u.DateTimePicker({el:this.element,format:this.maskerMeta.format});
		this.element['u.DateTimePicker'] = this.comp;


		this.comp.on('select', function(event){
			self.slice = true;
			self.dataModel.setValue(self.field, u.date.format(event.value,'YYYY-MM-DD HH:mm:ss'));
			self.slice = false;
			//self.setValue(event.value);
		});
		this.dataModel.ref(this.field).subscribe(function(value) {
			self.modelValueChange(value);
		})
	},
	 modelValueChange: function(value){
		 if (this.slice) return;
		 //this.trueValue = value;
		 this.comp.setDate(value);
	 },
	setFormat: function(format){
		if (this.maskerMeta.format == format) return;
		this.maskerMeta.format = format;
		this.comp.setFormat(format);
		//this.formater = new $.DateFormater(this.maskerMeta.format);
		//this.masker = new DateTimeMasker(this.maskerMeta);
	},

});

u.compMgr.addDataAdapter(
		{
			adapter: u.DateTimeAdapter,
			name: 'u-date'
		});

u.TimeAdapter = u.BaseAdapter.extend({
    initialize: function (options) {
        var self = this;
        u.TimeAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'time';

        this.comp = new u.Time(this.element);
        var dataType = this.dataModel.getMeta(this.field,'type');
        this.dataType =  dataType || 'string';


        this.comp.on('valueChange', function(event){
            self.slice = true;
            var _date = self.dataModel.getValue(self.field);
            if (self.dataType === 'datetime') {
                var valueArr = event.value.split(':');
                _date = new Date(_date);
                if (event.value == _date.getHours() + ':' + _date.getMinutes() + ':' + _date.getSeconds())
                    return;
                _date.setHours(valueArr[0]);
                _date.setMinutes(valueArr[1]);
                _date.setSeconds(valueArr[2]);
                self.dataModel.setValue(self.field, u.date.format(_date,'YYYY-MM-DD HH:mm:ss'));
            }
            else{
                if (event.value == _date)
                    return;
                self.dataModel.setValue(self.field, event.value);
            }
            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    modelValueChange: function (value) {
        if (this.slice) return;
        var compValue = '';
        if (this.dataType === 'datetime') {
            var _date = new Date(value);
            if (isNaN(_date))
                compValue = ''
            else
                compValue = _date.getHours() + ':' + _date.getMinutes() + ':' + _date.getSeconds();
        }
        else{
            compValue = value;
        }
        this.comp.setValue(compValue);
    },
    setEnable: function (enable) {
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.TimeAdapter,
        name: 'u-time'
    });





u.YearMonthAdapter = u.BaseAdapter.extend({
    initialize: function (comp, options) {
        var self = this;
        u.YearMonthAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'yearmonth';

        this.comp = new u.YearMonth(this.element);


        this.comp.on('valueChange', function(event){
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    modelValueChange: function (value) {
        if (this.slice) return;
        this.comp.setValue(value);
    },
    setEnable: function (enable) {
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.YearMonthAdapter,
        name: 'u-yearmonth'
    });





u.YearAdapter = u.BaseAdapter.extend({
    initialize: function (comp, options) {
        var self = this;
        u.YearAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'year';

        this.comp = new u.Year(this.element);


        this.comp.on('valueChange', function(event){
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    modelValueChange: function (value) {
        if (this.slice) return;
        this.comp.setValue(value);
    },
    setEnable: function (enable) {
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.YearAdapter,
        name: 'u-year'
    });





u.MonthAdapter = u.BaseAdapter.extend({
    initialize: function (comp, options) {
        var self = this;
        u.MonthAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'month';

        this.comp = new u.Month(this.element);


        this.comp.on('valueChange', function(event){
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    modelValueChange: function (value) {
        if (this.slice) return;
        this.comp.setValue(value);
    },
    setEnable: function (enable) {
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.MonthAdapter,
        name: 'u-month'
    });





u.ProgressAdapter = u.BaseAdapter.extend({
    initialize: function (options) {
        var self = this;
        u.ProgressAdapter.superclass.initialize.apply(this, arguments);

        this.comp = new u.Progress(this.element);
        this.element['u.Progress'] = this.comp;

        this.dataModel.ref(this.field).subscribe(function(value) {
        	self.modelValueChange(value)
        })
    },

    modelValueChange: function (val) {
        this.comp.setProgress(val)
    }
})


u.compMgr.addDataAdapter(
    {
        adapter: u.ProgressAdapter,
        name: 'u-progress'
    });
