'use strict';
var cc = window.cc || {};

cc.loader = {
	init:function(imgList, callback, timeout){
		timeout = timeout || 5000;
        imgList = this.isArray(imgList) && imgList || [];
        callback = typeof(callback) === 'function' && callback;

        var total = imgList.length,
            loaded = 0,
            imgages = [],
            _on = function () {
                loaded < total && (++loaded, callback && callback(loaded / total));
            };

        if (!total) {
            return callback && callback(1);
        }

        for (var i = 0; i < total; i++) {
            imgages[i] = new Image();
            imgages[i].onload = imgages[i].onerror = _on;
            imgages[i].src = imgList[i];
        }

        /**
         * 如果timeout * total时间范围内，仍有图片未加载出来（判断条件是loaded < total），通知外部环境所有图片均已加载
         * 目的是避免用户等待时间过长
         */
        setTimeout(function () {
            loaded < total && (loaded = total, callback && callback(loaded / total));
        }, timeout * total);
	},
	isArray:function(obj){
		return Object.prototype.toString.call(obj) === '[object Array]';
	}
}
