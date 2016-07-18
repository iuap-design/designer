	/**
	 * 字符串去掉左右空格
	 */
	String.prototype.trim = function() {
		return this.replace(/^\s*(\b.*\b|)\s*$/, "$1");
	};

	/**
	 * 字符串替换
	 */
	String.prototype.replaceStr = function(strFind, strRemp) {
		var tab = this.split(strFind);
		return new String(tab.join(strRemp));
	};

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

	/**
	 * 按字节数截取字符串 例:"e我是d".nLen(4)将返回"e我"
	 */
	String.prototype.substrCH = function(nLen) {
		var i = 0;
		var j = 0;
		while (i < nLen && j < this.length) { // 循环检查制定的结束字符串位置是否存在中文字符
			var charCode = this.charCodeAt(j);
			if (charCode > 256 && i == nLen - 1) {
				break;
			}
			//		else if(charCode >= 0x800 && charCode <= 0x10000){
			//			i = i + 3;
			//		}
			else if (charCode > 256) { // 返回指定下标字符编码，大于265表示是中文字符
				i = i + 2;
			} //是中文字符，那计数增加2
			else {
				i = i + 1;
			} //是英文字符，那计数增加1
			j = j + 1;
		};
		return this.substr(0, j);
	};

	/**
	 * 校验字符串是否以指定内容开始
	 */
	String.prototype.startWith = function(strChild) {
		return this.indexOf(strChild) == 0;
	};

	/**
	 * 判断字符串是否以指定参数的字符串结尾
	 *
	 * @param strChild
	 */
	String.prototype.endWith = function(strChild) {
		var index = this.indexOf(strChild);
		if (index == -1)
			return;
		else
			return index == this.length - strChild.length;
	};

	String.prototype.format = function(data) {
		if (data != null) {
			var string = this;
			for (var key in data) {
				var reg = new RegExp('\\<\\#\\=' + key + '\\#\\>', 'gi');
				string = string.replace(reg, data[key] ? (data[key] == 'null' ? "" : data[key]) : "");
			}
		}
		return string;
	}

	function patch(element) {
		if (element.toString().length > 1) {
			return element.toString();
		} else {
			return "0" + element.toString();
		}
	}
	Date.prototype.format = function(format) {
		var year = this.getFullYear(),
			month = this.getMonth() + 1,
			day = this.getDate(),
			hour = this.getHours(),
			minute = this.getMinutes(),
			second = this.getSeconds();
		format = format || "yyyy-MM-dd hh:mm:ss";
		return format.replace(/yyyy/, year).replace(/yy/, year.toString().substr(2, 2))
			.replace(/MM/, patch(month)).replace(/M/, month)
			.replace(/dd/, patch(day)).replace(/d/, day)
			.replace(/hh/, patch(hour)).replace(/h/, hour)
			.replace(/mm/, patch(minute)).replace(/m/, minute)
			.replace(/ss/, patch(second)).replace(/s/, second);
	};

	/**
	 * 获取AAAAMMJJ类型字符串
	 */
	Date.prototype.getAAAAMMJJ = function() {
		//date du jour
		var jour = this.getDate();
		if (jour < 10)
			(jour = "0" + jour);
		var mois = this.getMonth() + 1;
		if (mois < 10)
			(mois = "0" + mois);
		var annee = this.getYear();
		return annee + "" + mois + "" + jour;
	};

	/**
	 * 获取YYYY-MM-DD类型字符串
	 */
	Date.prototype.getFomatDate = function() {
		var year = this.getFullYear();
		var month = this.getMonth() + 1;
		if (month < 10)
			month = "0" + month;
		var day = this.getDate();
		if (day < 10)
			day = "0" + day;
		return year + "-" + month + "-" + day;
	};

	/**
	 * 获取YYYY-MM-DD HH:MM:SS类型字符串
	 */
	Date.prototype.getFomatDateTime = function() {
		var year = this.getFullYear();
		var month = this.getMonth() + 1;
		if (month < 10)
			month = "0" + month;
		var day = this.getDate();
		if (day < 10)
			day = "0" + day;
		var hours = this.getHours();
		if (hours < 10)
			hours = "0" + hours;
		var minutes = this.getMinutes();
		if (minutes < 10)
			minutes = "0" + minutes;
		var seconds = this.getSeconds();
		if (seconds < 10)
			seconds = "0" + seconds;
		return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
	};

	/**
	 * 返回obj在数组中的位置
	 */
	Array.prototype.indexOf = function(obj) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == obj)
				return i;
		}
		return -1;
	};

	/**
	 * 按照index remove
	 */
	Array.prototype.remove = function(index) {
		if (index < 0 || index > this.length) {
			alert("index out of bound");
			return;
		}
		this.splice(index, 1);
	};

	/**
	 * 按照数组的元素remove
	 */
	Array.prototype.removeEle = function(ele) {
		for (var i = 0, count = this.length; i < count; i++) {
			if (this[i] == ele) {
				this.splice(i, 1);
				return;
			}
		}
	};
	/**
	 * 生成UUID
	 */
	Math.UUID = function() {
		return ((new Date()).getTime() + "").substr(9);
	};
	String.UUID = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};

	/**
	 * 将指定值ele插入到index处
	 */
	Array.prototype.insert = function(index, ele) {
		if (index < 0 || index > this.length) {
			alert("index out of bound");
			return;
		}
		this.splice(index, 0, ele);
	};

	/**
	 * 得到和索引相对应的数组中的值
	 */
	Array.prototype.values = function(indices) {
		if (indices == null)
			return null;
		var varr = new Array();
		for (var i = 0; i < indices.length; i++) {
			varr.push(this[indices[i]]);
		}
		return varr;
	};

	/**
	 * 清空数组
	 */
	Array.prototype.clear = function() {
		this.splice(0, this.length);
	};

	window.getRequest = function(url) {
		if (!url)
			url = document.location.search;
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substring(url.indexOf("?") + 1);
			var strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	};

	window.setCookie = function(sName, sValue, oExpires, sPath, sDomain, bSecure) {
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
	};

	window.getCookie = function(sName) {
		var sRE = "(?:; )?" + sName + "=([^;]*);?";
		var oRE = new RegExp(sRE);

		if (oRE.test(document.cookie)) {
			return decodeURIComponent(RegExp["$1"]);
		} else
			return null;
	};

	window.deleteCookie = function(sName, sPath, sDomain) {
		setCookie(sName, "", new Date(0), sPath, sDomain);
	};
	window.execIgnoreError = function(a, b, c) {
		try {
			a.call(b, c);
		} catch (e) {
			//TODO handle the exception
		}
	}
	
	window.encodeBase64 = function(str){
		var c1, c2, c3;
                var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";                
                var i = 0, len= str.length, string = '';

                while (i < len){
                        c1 = str[i++] & 0xff;
                        if (i == len){
                                string += base64EncodeChars.charAt(c1 >> 2);
                                string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                                string += "==";
                                break;
                        }
                        c2 = str[i++];
                        if (i == len){
                                string += base64EncodeChars.charAt(c1 >> 2);
                                string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                                string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                                string += "=";
                                break;
                        }
                        c3 = str[i++];
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                        string += base64EncodeChars.charAt(c3 & 0x3F)
                }
        return string
	}
	
	$.getFunction = function(target, val){
		if (!val || typeof val == 'function') return val
		if (typeof target[val] == 'function')
			return target[val]
		else if (typeof window[val] == 'function')
			return window[val]
		else if (val.indexOf('.') != -1){
			var func = $.getJSObject(target, val)
			if (typeof func == 'function') return func
			func = $.getJSObject(window, val)
			if (typeof func == 'function') return func
		}
		return val
	}
	
	$.getJSObject = function(target, names) {
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
	}
	
	/**
	 * Returns internal [[Class]] property of an object
	 */
	window.getClass = function(object) {
		return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
	};
	
	// 获取当前js文件的路径
	window.getCurrentJsPath = function() {
		var doc = document,
		a = {},
		expose = +new Date(),
		rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
		isLtIE8 = ('' + doc.querySelector).indexOf('[native code]') === -1;
		// FF,Chrome
		if (doc.currentScript){
			return doc.currentScript.src;
		}

		var stack;
		try{
			a.b();
		}
		catch(e){
			stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
		}
		// IE10
		if (stack){
			var absPath = rExtractUri.exec(stack)[1];
			if (absPath){
				return absPath;
			}
		}

		// IE5-9
		for(var scripts = doc.scripts,
			i = scripts.length - 1,
			script; script = scripts[i--];){
			if (script.className !== expose && script.readyState === 'interactive'){
				script.className = expose;
				// if less than ie 8, must get abs path by getAttribute(src, 4)
				return isLtIE8 ? script.getAttribute('src', 4) : script.src;
			}
		}
	}