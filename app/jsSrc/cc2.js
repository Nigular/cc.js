
function cc(config){
	document.write('<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />'+'<meta name="browsermode" content="application">' + '<meta name="x5-page-mode" content="app">');
	/*** 为函数扩展bind事件 */
	if (! function() {}.bind) {
		Function.prototype.bind = function(context) {
			var self = this,
				args = Array.prototype.slice.call(arguments);

			return function() {
				return self.apply(context, args.slice(1));
			}
		};
	}
	/** 
	 * 为文档元素添加on和off的绑定事件和解绑事件 
	 * 为元素扩展delegate代理委托事件
	 * */
	if (window.Element) {
		Element.prototype.on = Element.prototype.addEventListener;
		Element.prototype.off = Element.prototype.removeEventListener;
		Element.prototype.delegate = function(dom,ev,callback){
			this.addEventListener(ev,function(event){
				var target = event.target || event.srcElement;
				if(dom.length){
					for(let i=0;i<dom.length;i++){
						if(dom[i] === target){
							callback(target);
						}
					}
				}else{
					// query.id()的情况没有length
					if(dom === target){
						callback(target);
					}
				}			
			})
		}
	}
	/** 为audio对象添加autoplay方法 */
	if(window.Audio){
		Audio.prototype.autoPlay = function(callback){
			var audio = this;
			audio.play();
			if(audio.paused){
				var ev = function() {
					document.removeEventListener('touchstart', ev, true);
					audio.play();
					callback && callback();
				}
				if (/MicroMessenger/i.test(navigator.userAgent)) {
					if (window.WeixinJSBridge) {
						WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
							audio.play();
							callback && callback();
						});
					} else {
						document.addEventListener("WeixinJSBridgeReady", function() {
							WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
								audio.play();
								callback && callback();
							});
						}, false);
					}
				} else {
					document.addEventListener('touchstart', ev, true);
				}
			}else{
				callback && callback();
			}
		}
	}
	
	/** requestAnimationFrame兼容写法 */
	(function() {
		var vendors = ['webkit', 'moz'];
		for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
			var vp = vendors[i];
			window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame']);
		}
		if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
			|| !window.requestAnimationFrame || !window.cancelAnimationFrame) {
			var lastTime = 0;
			window.requestAnimationFrame = function(callback) {
				var now = Date.now();
				var nextTime = Math.max(lastTime + 16, now);
				return setTimeout(function() {
						callback(lastTime = nextTime);
					},
					nextTime - now);
			};
			window.cancelAnimationFrame = clearTimeout;
		}
	}());
	
	var html = document.documentElement,
		config_width = config.width || 0,
		config_height = config.height || 0,
		delay;
	function setSize(){
		//setSize目的是从新计算文档的根字体大小，rem单位依赖这个
		var windowWidth = html.clientWidth || window.innerWidth || html.getBoundingClientRect().width;
		var windowHeight = html.clientHeight || window.innerHeight || html.getBoundingClientRect().height;
		var aspectRatio = windowWidth / windowHeight;
		var windowScale=0;
		if (!config_width || aspectRatio > config_width / config_height) {	//实际宽高比大于设计最低宽高比
			windowScale = config_height / windowHeight;
			html.style.cssText += 'font-size:' + windowHeight * 100 / config_height + 'px!important;';
		} else {	//实际宽高比小于设计最低宽高比
			
			windowScale = config_width / windowWidth;
			html.style.cssText += 'font-size:' + windowWidth * 100 / config_width + 'px!important;';
		}
		html.offsetWidth;	//触发重绘
	}
	if (!config_height && !config_width) {	
		config_width = 750;		//如果没有设定，则默认宽度为750
	}
	setSize();
	window.addEventListener('resize', function() {
		//监听resize事件，针对横竖屏切换时，重新计算布局
		cancelAnimationFrame(delay);
		delay = requestAnimationFrame(setSize);
	}, false);
	window.onload=function(){
		document.getElementsByTagName('body')[0].setAttribute('style','margin:0 auto;width:'+config.width/100+'rem');
	}
	
	if (config.debug || getUrlParma('debug')) {
		document.addEventListener('contextmenu',function(e){e.preventDefault()});
		document.write('<script src="extends/debug.js" type="text/javascript" charset="utf-8"><\/script>');
	}
	
	function getUrlParma(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var p = window.location.href.split("?")[1];
		if (p) {
			var r = p.match(reg);
			if (r) {
				return decodeURIComponent(r[2]);
			}
		}
		return null;
	}
	function getUa(){
		var ua = navigator.userAgent,
			obj = {
				name: ua,
				isAndroid: /android/i.test(ua),
				isIOS: /iphone os/i.test(ua),
				isIpad: /ipad/i.test(ua),
				isWM: /windows ce/i.test(ua) || /windows mobile/i.test(ua),
				isMidp: /midp/i.test(ua),
				isUc7: /rv:1.2.3.4/i.test(ua),
				isUc: /ucweb/i.test(ua) || /ucbrowser/i.test(ua),
				isWeiXin: /MicroMessenger/i.test(ua),
				isWebKit: /webkit/i.test(ua),
				isChrome: /Chrome/i.test(ua)
			}
		obj.isMobile = obj.isAndroid || obj.isIOS || obj.isIpad || obj.isWM || obj.isMidp || obj.isUc7 || obj.isUc;
		obj.isPC = !(typeof window.orientation === 'number');
		obj.isMac = /macintosh|mac os x/i.test(ua);
		if (ua.toLocaleLowerCase().indexOf('ucbrowser') > -1) {
			var control = navigator.control || {};
			if (control.gesture) {
				control.gesture(false);
			}
		}
		return obj;
	}
	function ajax(options){
		options = options ||{};  //调用函数时如果options没有指定，就给它赋值{},一个空的Object
        options.type=(options.type || "GET").toUpperCase();/// 请求格式GET、POST，默认为GET
		options.dataType=options.dataType || "json";    //响应数据格式，默认json
		options.timeout=options.timeout || 10000;	//默认10秒超时
		options.contentType=options.contentType || 'application/x-www-form-urlencoded';
        var params=formatParams(options.data);//options.data请求的数据
        var xhr;
        //考虑兼容性
        if(window.XMLHttpRequest){
            xhr=new XMLHttpRequest();
        }else if(window.ActiveObject){//兼容IE6以下版本
            xhr=new ActiveXobject('Microsoft.XMLHTTP');
        }
        //启动并发送一个请求
        if(options.type=="GET"){
            xhr.open("GET",options.url+"?"+params,true);
            xhr.send(null);
        }else if(options.type=="POST"){
            xhr.open("post",options.url,true);
            //设置表单提交时的内容类型
            //Content-type数据请求的格式
            xhr.setRequestHeader("Content-type",options.contentType);
            xhr.send(params);
        }
    	//设置有效时间
        setTimeout(function(){
            if(xhr.readySate!=4){
                xhr.abort();
            }
		},options.timeout)
		//格式化请求参数
		function formatParams(data){
			var arr=[];
			for(var name in data){
				arr.push(encodeURIComponent(name)+"="+encodeURIComponent(data[name]));
			}
			arr.push(("v="+Math.random()).replace(".",""));
			return arr.join("&");
		}
		//options.success成功之后的回调函数  options.error失败后的回调函数
		//xhr.responseText,xhr.responseXML  获得字符串形式的响应数据或者XML形式的响应数据
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                var status=xhr.status;
                if(status>=200&& status<300 || status==304){
                  options.success&&options.success(xhr.responseText,xhr.responseXML);
                }else{
                    options.error&&options.error(status);
                }
            }
		}
	}
	return {
		ua : getUa(),
		query : {
			id: function(dom) {
	            //通过id选中元素
				return document.getElementById(dom);
			},
			class: function(dom) {
	            //通过className选中元素
				return document.getElementsByClassName(dom);
			},
			tag: function(dom) {
	            //通过标签名选中元素
				return document.getElementsByTagName(dom);
			},
			one: function(dom) {
	            //选中第一个匹配的dom元素
				return document.querySelector(dom);
			},
			all: function(dom) {
	            //选中多个元素
				return document.querySelectorAll(dom);
			},
			urlParma:function(name) {
				return getUrlParma(name);
			}
		},
		store : {
			setLocal: function(key, value) {
				if(window.localStorage) {
					window.localStorage.setItem(key, window.JSON.stringify(value));
				}
			},
			getLocal: function(key) {
				var json = "";
				if(window.localStorage) {
					json = window.localStorage.getItem(key);
				}
				return window.JSON.parse(json);
			}
		},
		ajax:function(options){
			return new ajax(options)
		}
	}
}

/**
 * 初始化调用
 * var cc = new cc({width:750,height:1100,debug:true});
 * **/

/**
 *扩展方式
 *cc.name = function() {
 *	var query = this.query;
 *	console.log(query.tag('img'));
 *};
**/