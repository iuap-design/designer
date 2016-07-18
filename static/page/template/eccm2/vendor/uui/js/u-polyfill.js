/**
 * Created by dingrf on 2015-11-18.
 */


window.u = window.u || {};
var u = window.u;

u.polyfill = true;
u._addClass = function(element,value){
    var classes, cur, clazz, i, finalValue,rclass = /[\t\r\n\f]/g,
        proceed = typeof value === "string" && value,rnotwhite = (/\S+/g);

    if ( proceed ) {
        // The disjunction here is for better compressibility (see removeClass)
        classes = ( value || "" ).match( rnotwhite ) || [];

        cur = element.nodeType === 1 && ( element.className ?
                ( " " + element.className + " " ).replace( rclass, " " ) : " ");
        if ( cur ) {
            i = 0;
            while ( (clazz = classes[i++]) ) {
                if ( cur.indexOf( " " + clazz + " " ) < 0 ) {cur += clazz + " ";}
            }
            // only assign if different to avoid unneeded rendering.
            finalValue = (cur + "").trim();
            if ( element.className !== finalValue ) {
                element.className = finalValue;
            }
        }
    }
    return this;
};

u._removeClass = function(element, value) {
    var classes, cur, clazz, j, finalValue,rnotwhite = (/\S+/g),rclass = /[\t\r\n\f]/g,
        proceed = arguments.length === 0 || typeof value === "string" && value;

    if ( proceed ) {
        classes = ( value || "" ).match( rnotwhite ) || [];

        // This expression is here for better compressibility (see addClass)
        cur = element.nodeType === 1 && ( element.className ?
                ( " " + element.className + " " ).replace( rclass, " " ) :"");
        if ( cur ) {
            j = 0;
            while ( (clazz = classes[j++]) ) {
                // Remove *all* instances
                while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
                    cur = cur.replace( " " + clazz + " ", " " );
                }
            }

            // only assign if different to avoid unneeded rendering.
            finalValue = value ? (cur + "").trim() : "";
            if ( element.className !== finalValue ) {
                element.className = finalValue;
            }
        }
    }
    return this;
};

u._hasClass = function(element,value){
    var rclass = /[\t\r\n\f]/g;
    if ( element.nodeType === 1 && (" " + element.className + " ").replace(rclass, " ").indexOf( value ) >= 0 ) {
        return true;
    }
    return false;
};

u._toggleClass = function(element, value){
    if ( u._hasClass(element, value) ) {
        u._removeClass(element, value);
    } else {
        u._addClass(element, value);
    }
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s*(\b.*\b|)\s*$/, "$1");
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj)
                return i;
        }
        return -1;
    };
}

if (!Array.prototype.remove) {
	Array.prototype.remove = function(index) {
		if (index < 0 || index > this.length) {
			alert("index out of bound");
			return;
		}
		this.splice(index, 1);
	};
}
// 遍历数组,执行函数
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn) {
        for (var i = 0, len = this.length; i < len; i++) {
            fn(this[i], i, this);
        }
    };
}

if(!NodeList.prototype.forEach)
    NodeList.prototype.forEach = Array.prototype.forEach;

    
function isDomElement(obj) {
    if (window['HTMLElement']) {
        return obj instanceof HTMLElement;
    } else {
        return obj && obj.tagName && obj.nodeType === 1;
    }
}
/*IE8的querySelectorAll返回的对象不是Array也不是NodeList，不能调用forEach，因此重写此方法*/
/* 此处没有IE8标识，因此使用HTMLElement来进行判断*/
if(!window['HTMLElement']){
    var _querySelectorAll = Element.prototype.querySelectorAll;
    Element.prototype.querySelectorAll = function(selector) {
        var result = _querySelectorAll.call(this,selector);
        if(!isDomElement(this)){
            return result;
        }
        var resArr = [];
        for(var i = 0;i < result.length;i++){
            resArr.push(result[i]);
        }
        return resArr;
    }

    var _docquerySelectorAll = document.querySelectorAll;
    document.querySelectorAll = function(selector) {
        try{
            var result = _docquerySelectorAll.call(this,selector);
            var resArr = [];
            if(result.length > 0){
                for(var i = 0;i < result.length;i++){
                    resArr.push(result[i]);
                }
                return resArr;
            }else{
                return result;
            }
            
        }catch(e){

        }
        
    }
}

if(!Element.prototype.addEventListener){
    Element.prototype.addEventListener = function(event,fun){
        var tag = this;
        this.attachEvent("on"+event,function(){
            fun.apply(tag,arguments);//这里是关键
        });
    }
}


// 绑定环境
if(typeof Function.prototype.bind !== 'function'){
    Function.prototype.bind = function(context){
        var fn = this;
        var args = [];
        for(var i = 1, len = arguments.length; i < len; i ++){
            args.push(arguments[i]);
        }

        return function(){
            // for(var j = 1, len = arguments.length; j < len; j ++){
            //     args.push(arguments[j]);
            // }
            return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)));
        };
    };
}

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
	};
	
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
	};
/* Respond.js: min/max-width media query polyfill. (c) Scott Jehl. MIT Lic. j.mp/respondjs  */
(function( w ){

	"use strict";

	//exposed namespace
	var respond = {};
	w.respond = respond;

	//define update even in native-mq-supporting browsers, to avoid errors
	respond.update = function(){};

	//define ajax obj
	var requestQueue = [],
		xmlHttp = (function() {
			var xmlhttpmethod = false;
			try {
				xmlhttpmethod = new w.XMLHttpRequest();
			}
			catch( e ){
				xmlhttpmethod = new w.ActiveXObject( "Microsoft.XMLHTTP" );
			}
			return function(){
				return xmlhttpmethod;
			};
		})(),

		//tweaked Ajax functions from Quirksmode
		ajax = function( url, callback ) {
			var req = xmlHttp();
			if (!req){
				return;
			}
			req.open( "GET", url, true );
			req.onreadystatechange = function () {
				if ( req.readyState !== 4 || req.status !== 200 && req.status !== 304 ){
					return;
				}
				callback( req.responseText );
			};
			if ( req.readyState === 4 ){
				return;
			}
			req.send( null );
		},
		isUnsupportedMediaQuery = function( query ) {
			return query.replace( respond.regex.minmaxwh, '' ).match( respond.regex.other );
		};

	//expose for testing
	respond.ajax = ajax;
	respond.queue = requestQueue;
	respond.unsupportedmq = isUnsupportedMediaQuery;
	respond.regex = {
		media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
		keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
		comments: /\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,
		urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
		findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
		only: /(only\s+)?([a-zA-Z]+)\s?/,
		minw: /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
		maxw: /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
		minmaxwh: /\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,
		other: /\([^\)]*\)/g
	};

	//expose media query support flag for external use
	respond.mediaQueriesSupported = w.matchMedia && w.matchMedia( "only all" ) !== null && w.matchMedia( "only all" ).matches;

	//if media queries are supported, exit here
	if( respond.mediaQueriesSupported ){
		return;
	}

	//define vars
	var doc = w.document,
		docElem = doc.documentElement,
		mediastyles = [],
		rules = [],
		appendedEls = [],
		parsedSheets = {},
		resizeThrottle = 30,
		head = doc.getElementsByTagName( "head" )[0] || docElem,
		base = doc.getElementsByTagName( "base" )[0],
		links = head.getElementsByTagName( "link" ),

		lastCall,
		resizeDefer,

		//cached container for 1em value, populated the first time it's needed
		eminpx,

		// returns the value of 1em in pixels
		getEmValue = function() {
			var ret,
				div = doc.createElement('div'),
				body = doc.body,
				originalHTMLFontSize = docElem.style.fontSize,
				originalBodyFontSize = body && body.style.fontSize,
				fakeUsed = false;

			div.style.cssText = "position:absolute;font-size:1em;width:1em";

			if( !body ){
				body = fakeUsed = doc.createElement( "body" );
				body.style.background = "none";
			}

			// 1em in a media query is the value of the default font size of the browser
			// reset docElem and body to ensure the correct value is returned
			docElem.style.fontSize = "100%";
			body.style.fontSize = "100%";

			body.appendChild( div );

			if( fakeUsed ){
				docElem.insertBefore( body, docElem.firstChild );
			}

			ret = div.offsetWidth;

			if( fakeUsed ){
				docElem.removeChild( body );
			}
			else {
				body.removeChild( div );
			}

			// restore the original values
			docElem.style.fontSize = originalHTMLFontSize;
			if( originalBodyFontSize ) {
				body.style.fontSize = originalBodyFontSize;
			}


			//also update eminpx before returning
			ret = eminpx = parseFloat(ret);

			return ret;
		},

		//enable/disable styles
		applyMedia = function( fromResize ){
			var name = "clientWidth",
				docElemProp = docElem[ name ],
				currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[ name ] || docElemProp,
				styleBlocks	= {},
				lastLink = links[ links.length-1 ],
				now = (new Date()).getTime();

			//throttle resize calls
			if( fromResize && lastCall && now - lastCall < resizeThrottle ){
				w.clearTimeout( resizeDefer );
				resizeDefer = w.setTimeout( applyMedia, resizeThrottle );
				return;
			}
			else {
				lastCall = now;
			}

			for( var i in mediastyles ){
				if( mediastyles.hasOwnProperty( i ) ){
					var thisstyle = mediastyles[ i ],
						min = thisstyle.minw,
						max = thisstyle.maxw,
						minnull = min === null,
						maxnull = max === null,
						em = "em";

					if( !!min ){
						min = parseFloat( min ) * ( min.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 );
					}
					if( !!max ){
						max = parseFloat( max ) * ( max.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 );
					}

					// if there's no media query at all (the () part), or min or max is not null, and if either is present, they're true
					if( !thisstyle.hasquery || ( !minnull || !maxnull ) && ( minnull || currWidth >= min ) && ( maxnull || currWidth <= max ) ){
						if( !styleBlocks[ thisstyle.media ] ){
							styleBlocks[ thisstyle.media ] = [];
						}
						styleBlocks[ thisstyle.media ].push( rules[ thisstyle.rules ] );
					}
				}
			}

			//remove any existing respond style element(s)
			for( var j in appendedEls ){
				if( appendedEls.hasOwnProperty( j ) ){
					if( appendedEls[ j ] && appendedEls[ j ].parentNode === head ){
						head.removeChild( appendedEls[ j ] );
					}
				}
			}
			appendedEls.length = 0;

			//inject active styles, grouped by media type
			for( var k in styleBlocks ){
				if( styleBlocks.hasOwnProperty( k ) ){
					var ss = doc.createElement( "style" ),
						css = styleBlocks[ k ].join( "\n" );

					ss.type = "text/css";
					ss.media = k;

					//originally, ss was appended to a documentFragment and sheets were appended in bulk.
					//this caused crashes in IE in a number of circumstances, such as when the HTML element had a bg image set, so appending beforehand seems best. Thanks to @dvelyk for the initial research on this one!
					head.insertBefore( ss, lastLink.nextSibling );

					if ( ss.styleSheet ){
						ss.styleSheet.cssText = css;
					}
					else {
						ss.appendChild( doc.createTextNode( css ) );
					}

					//push to appendedEls to track for later removal
					appendedEls.push( ss );
				}
			}
		},
		//find media blocks in css text, convert to style blocks
		translate = function( styles, href, media ){
			var qs = styles.replace( respond.regex.comments, '' )
					.replace( respond.regex.keyframes, '' )
					.match( respond.regex.media ),
				ql = qs && qs.length || 0;

			//try to get CSS path
			href = href.substring( 0, href.lastIndexOf( "/" ) );

			var repUrls = function( css ){
					return css.replace( respond.regex.urls, "$1" + href + "$2$3" );
				},
				useMedia = !ql && media;

			//if path exists, tack on trailing slash
			if( href.length ){ href += "/"; }

			//if no internal queries exist, but media attr does, use that
			//note: this currently lacks support for situations where a media attr is specified on a link AND
				//its associated stylesheet has internal CSS media queries.
				//In those cases, the media attribute will currently be ignored.
			if( useMedia ){
				ql = 1;
			}

			for( var i = 0; i < ql; i++ ){
				var fullq, thisq, eachq, eql;

				//media attr
				if( useMedia ){
					fullq = media;
					rules.push( repUrls( styles ) );
				}
				//parse for styles
				else{
					fullq = qs[ i ].match( respond.regex.findStyles ) && RegExp.$1;
					rules.push( RegExp.$2 && repUrls( RegExp.$2 ) );
				}

				eachq = fullq.split( "," );
				eql = eachq.length;

				for( var j = 0; j < eql; j++ ){
					thisq = eachq[ j ];

					if( isUnsupportedMediaQuery( thisq ) ) {
						continue;
					}

					mediastyles.push( {
						media : thisq.split( "(" )[ 0 ].match( respond.regex.only ) && RegExp.$2 || "all",
						rules : rules.length - 1,
						hasquery : thisq.indexOf("(") > -1,
						minw : thisq.match( respond.regex.minw ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ),
						maxw : thisq.match( respond.regex.maxw ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" )
					} );
				}
			}

			applyMedia();
		},

		//recurse through request queue, get css text
		makeRequests = function(){
			if( requestQueue.length ){
				var thisRequest = requestQueue.shift();

				ajax( thisRequest.href, function( styles ){
					translate( styles, thisRequest.href, thisRequest.media );
					parsedSheets[ thisRequest.href ] = true;

					// by wrapping recursive function call in setTimeout
					// we prevent "Stack overflow" error in IE7
					w.setTimeout(function(){ makeRequests(); },0);
				} );
			}
		},

		//loop stylesheets, send text content to translate
		ripCSS = function(){

			for( var i = 0; i < links.length; i++ ){
				var sheet = links[ i ],
				href = sheet.href,
				media = sheet.media,
				isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";

				//only links plz and prevent re-parsing
				if( !!href && isCSS && !parsedSheets[ href ] ){
					// selectivizr exposes css through the rawCssText expando
					if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
						translate( sheet.styleSheet.rawCssText, href, media );
						parsedSheets[ href ] = true;
					} else {
						if( (!/^([a-zA-Z:]*\/\/)/.test( href ) && !base) ||
							href.replace( RegExp.$1, "" ).split( "/" )[0] === w.location.host ){
							// IE7 doesn't handle urls that start with '//' for ajax request
							// manually add in the protocol
							if ( href.substring(0,2) === "//" ) { href = w.location.protocol + href; }
							requestQueue.push( {
								href: href,
								media: media
							} );
						}
					}
				}
			}
			makeRequests();
		};

	//translate CSS
	ripCSS();

	//expose update for re-running respond later on
	respond.update = ripCSS;

	//expose getEmValue
	respond.getEmValue = getEmValue;

	//adjust on resize
	function callMedia(){
		applyMedia( true );
	}

	if( w.addEventListener ){
		w.addEventListener( "resize", callMedia, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onresize", callMedia );
	}
})(this);
