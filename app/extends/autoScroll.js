"use strict";
var cc=window.cc || {};
/** 图片&消息无缝自动循环滚动 **/
/* @DOM
 *  	<div id="marquee">
 *  		<ul>
 *   			<li></li>
 *   			<li></li>
 *  		</ul>
 *  	</div>
 * @CSS
 *  	#marquee {overflow:hidden;width:200px;height:50px;}
 * @Usage
 *  	var scorller = new cc.autoScroll();
 *		var box = cc.query.id("marquee");
 *		scorller.init({
 *			dom:box,			//滚动元素的容器
 *			direction:"left",	//left,right,up,down
 *			loop:0,				//循环次数，0为无限循环
 *			isEqual:true,		//子元素是否等宽或等高
 *			scrollAmount:1,		//步长(像素)
 * 			scrollDelay:20,		//时长(毫秒)
 * 			mouseCtrl:true		//是否让鼠标控制经过停止
 *		});
 */
cc.autoScroll={
	init:function(opts){
		var dom = opts.dom;		//滚动元素容器
		var scrollW=dom.clientWidth ;		//滚动元素容器的宽度
		var scrollH=dom.clientHeight;		//滚动元素容器的高度
		var _element=dom.children[0];	//滚动元素
		var _kids=_element.children;	//滚动元素的子元素
		var scrollSize=0;					//滚动元素尺寸
		
		//滚动类型，1左右，0上下
		var _type=(opts.direction=="left"||opts.direction=="right") ? 1:0;
		if(_type){
			_element.style.width="10000px";
		}else{
			_element.style.height="10000px";
		}
		
		//获取滚动元素的尺寸
		if(opts.isEqual){
			scrollSize = _type?(_kids[0].clientWidth*_kids.length):(_kids[0].clientHeight*_kids.length);
		}else{
			for(var i=0;i<_kids.length;i++){
				scrollSize+=_type?_kids[i].clientWidth:_kids[i].clientHeight;
			}
		};
		
		//滚动元素总尺寸小于容器尺寸，不滚动
		if(scrollSize<(_type?scrollW:scrollH)){return;}; 
		// 复制所有子元素
		var k=_kids.length;
		for(var i=0;i<k;i++){
			var node=_kids[i].cloneNode(true);
			_element.appendChild(node);
		}
		
		var numMoved=0;
		function scrollFunc(){
			var _dir=(opts.direction=="left"||opts.direction=="right") ? "scrollLeft":"scrollTop";
			if (opts.loop>0) {
				numMoved+=opts.scrollAmount;
				if(numMoved>scrollSize*opts.loop){
					dom[_dir]=0;
					return clearInterval(moveId);
				};
			};

			if(opts.direction=="left"||opts.direction=="up"){
				var newPos=dom[_dir]+opts.scrollAmount;
				if(newPos>=scrollSize){
					newPos-=scrollSize;
				}
				dom[_dir]=newPos;
			}else{
				var newPos=dom[_dir]-opts.scrollAmount;
				if(newPos<=0){
					newPos += scrollSize;
				};
				dom[_dir]=newPos;
			};
		};

		//滚动开始
		var moveId=setInterval(scrollFunc, opts.scrollDelay);
		
		//鼠标经过暂停，离开继续
		if(opts.mouseCtrl){
			dom.onmouseover=function(){
				clearInterval(moveId);
			}
			dom.onmouseout=function(){
				clearInterval(moveId);
				moveId=setInterval(scrollFunc, opts.scrollDelay);
			}
		}
	}
}

