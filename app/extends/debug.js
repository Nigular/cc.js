'use strict';
var cc = window.cc || {};
cc.debug = {
	p: document.createElement('p'),
	setOutline: function() {
		Array.prototype.forEach.call(document.getElementsByTagName("*"), function(a) {
			a.style.outline = "1px solid #" + (~~(Math.random() * (1 << 24))).toString(16);
		});
	},
	test: function(callback, l) {
		var now = performance.now();
		for (var i = 0; i < l; i++) {
			callback();
		}
		return (performance.now() - now);
	},
	getPosition: function(dom) {
		return document.querySelector(dom).getBoundingClientRect();
	},
	getTimes: function() {
		if (window.performance) {
			var timing = performance.timing;
			var loadTime = timing.loadEventEnd - timing.navigationStart; //过早获取时,loadEventEnd有时会是0
			var readyStart = timing.fetchStart - timing.navigationStart;
			var redirectTime = timing.redirectEnd - timing.redirectStart;
			var appcacheTime = timing.domainLookupStart - timing.fetchStart;
			var unloadEventTime = timing.unloadEventEnd - timing.unloadEventStart;
			var lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart;
			var connectTime = timing.connectEnd - timing.connectStart;
			var requestTime = timing.responseEnd - timing.requestStart;
			var initDomTreeTime = timing.domInteractive - timing.responseEnd;
			var domReadyTime = timing.domComplete - timing.domInteractive; //过早获取时,domComplete有时会是0
			var loadEventTime = timing.loadEventEnd - timing.loadEventStart;
			// 为console.table方法准备对象，包含耗时的描述和消耗的时间
			var allTimes = [{
				"描述": "准备新页面时间耗时",
				"时间(ms)": readyStart
			}, {
				"描述": "redirect 重定向耗时",
				"时间(ms)": redirectTime
			}, {
				"描述": "Appcache 耗时",
				"时间(ms)": appcacheTime
			}, {
				"描述": "unload 前文档耗时",
				"时间(ms)": unloadEventTime
			}, {
				"描述": "DNS 查询耗时",
				"时间(ms)": lookupDomainTime
			}, {
				"描述": "TCP连接耗时",
				"时间(ms)": connectTime
			}, {
				"描述": "request请求耗时",
				"时间(ms)": requestTime
			}, {
				"描述": "请求完毕至DOM加载",
				"时间(ms)": initDomTreeTime
			}, {
				"描述": "解释dom树耗时",
				"时间(ms)": domReadyTime
			}, {
				"描述": "load事件耗时",
				"时间(ms)": loadEventTime
			}, {
				"描述": "从开始至load总耗时",
				"时间(ms)": loadTime
			}];

			cc.debug.p.innerHTML = (function(type) {
				return type < 4 ? ['用户通过常规导航方式访问页面，比如点一个链接或者一般的get方式', '用户通过刷新，包括JS调用刷新接口等方式访问页面', '用户通过后退按钮访问本页面'][type] : '其他方式访问';
			})(performance.navigation.type) + '<br>' + (function(all) {
				var html = '';
				all.forEach(function(i) {
					html += i['描述'] + i['时间(ms)'] + 'ms<br>';
				});
				if (performance.getEntries) {
					html += '请求数' + performance.getEntries().length + '个';
				} else {
					html += '';
				}
				return html;
			})(allTimes);

			/*allTimes.push({'描述':'请求数','个':performance.getEntries().length});
			console.table(allTimes);*/
		}
	},
	performance: function() {
		if ('onpageshow' in window) {
			window.onpageshow = this.getTimes;
		} else {
			window.onload = this.getTimes;
		}
	}
};
window.alert = function() {
	var str = '';
	Array.prototype.forEach.call(arguments, function(v) {
		if (v instanceof Object) {
			if(v instanceof Function){
				str += v.toString() + ',';
			}else{
				str += JSON.stringify(v) + ',';
			}
		} else {
			str += v + ',';
		}
	});
	cc.debug.p.innerHTML = str.substr(0, str.length - 1);
}
document.addEventListener('DOMContentLoaded', function(e) {
	cc.debug.p.style.cssText = 'font-size:0.28rem;line-height: 1.2;font-weight: normal;position:absolute;z-index:10086;top:1em;left:0;word-break:break-all;pointer-events: none;background-color: rgba(0,0,0,0.2);color: white;padding: 0.4rem;margin: 0;';
	document.body.appendChild(cc.debug.p);
}, false);
window.addEventListener('error', function(e) {
	e.stopImmediatePropagation();
	alert('出错文件：' + e.filename + '<br>第' + e.lineno + '行 第' + e.colno + '列<br>错误信息：' + e.message);
}, true);