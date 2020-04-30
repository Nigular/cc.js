'use strict';
var cc = window.cc || {};
/** 为某个元素绑定滑动事件，并计算滑动方向，返回方向结果 **/
/**
 * @param {obj} dom 选中的文档对象
 * @param {num} limit 滑动的触发距离（可选）
 * @param {func} callback(direction) 把方向返回给callback 
 */
cc.Swipe = {
	init: function(obj) {
		var dom = obj.dom,
			startX, startY, moveX, moveY, endX, endY, limit = obj.limit || 40;
		var end = function(e) {
			var touch = e.changedTouches[0],
				distance, radian, direction;
			endX = touch.pageX;
			endY = touch.pageY;
			distance = Math.sqrt(Math.pow(startX - endX, 2) + Math.pow(startY - endY, 2));
			if (distance < limit) {
				return;
			}
			radian = Math.atan2(endY - startY, endX - startX);
			if (radian >= -0.75 * Math.PI && radian < -0.25 * Math.PI) {
				direction = 'up';
			} else if (radian >= -0.25 * Math.PI && radian < 0.25 * Math.PI) {
				direction = 'right';
			} else if (radian >= 0.25 * Math.PI && radian < 0.75 * Math.PI) {
				direction = 'down';
			} else {
				direction = 'left';
			}
			obj.callback && obj.callback.call(this, direction);
		}
		dom.addEventListener('touchstart', function(e) {
			var touch = e.touches[0];
			startX = touch.pageX;
			startY = touch.pageY;
		});
		dom.addEventListener('touchmove', function(e) {
			e.stopPropagation();
			e.preventDefault();
		},true);
		dom.addEventListener('touchend', function(e) {
			end.call(this, e);
		});
		dom.addEventListener('touchcancel', function(e) {
			end.call(this, e);
		});
	}
}