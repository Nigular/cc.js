"use strict";var cc=window.cc||{};cc.GoTop={init:function(t){var e=this;e.curtime=0,e.duration=0<arguments.length?t.duration:50,e.topvalue=document.body.scrollTop?document.body.scrollTop:document.documentElement.scrollTop,e.enter()},Quad:{easeIn:function(t,e,o,n){return o*(t/=n)*t+e},easeOut:function(t,e,o,n){return-o*(t/=n)*(t-2)+e},easeInOut:function(t,e,o,n){return(t/=n/2)<1?o/2*t*t+e:-o/2*(--t*(t-2)-1)+e}},enter:function(){var t=this,e=t.Quad.easeOut(t.curtime,t.topvalue,-t.topvalue,t.duration);document.body.scrollTop?document.body.scrollTop=e:document.documentElement.scrollTop=e,t.curtime++,t.curtime<=t.duration&&requestAnimationFrame(function(){t.enter()})}};