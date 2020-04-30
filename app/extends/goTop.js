'use strict';
var cc = window.cc || {};
/** 回到顶部 **/
cc.GoTop = {
	init: function(obj) {
		var self = this;
		self.curtime=0;
		if(arguments.length>0){
			self.duration = obj.duration;
		}else{
			self.duration = 50;		
		}
		self.topvalue = document.body.scrollTop?document.body.scrollTop:document.documentElement.scrollTop;
		self.enter();
	},
	Quad: {		//t:开始步数，b:初始值，c:变化值，d:结束步数
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c *(t /= d)*(t-2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t-2) - 1) + b;
        }
    },
	enter:function(){
		var self = this;
		var value = self.Quad.easeOut(self.curtime,self.topvalue,-self.topvalue,self.duration);
		if(document.body.scrollTop){
			document.body.scrollTop = value;
		}else{
			document.documentElement.scrollTop=value;
		}
		self.curtime++;
		if (self.curtime <= self.duration) {
	         // 继续运动
	         requestAnimationFrame(function(){
	         	self.enter();
	         });
	    } else {
	        // 动画结束
	    }
	}
}