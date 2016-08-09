//$获取Id或者TagName或者class  -------------------------------------------------------------
/*$(".box");
$("#box");
$("div");*/
function $(selector, parent, tagName) {
	var firstChar = selector.charAt(0);
	parent = parent || document;
	tagName = tagName || "*";
	if(firstChar == "#") {
		return document.getElementById(selector.substring(1));
	} else if(firstChar == ".") {
		var allEles = parent.getElementsByTagName(tagName); //获取parent下所有的标签名形成数组字符串
		var arr = [];
		for(var i = 0; i < allEles.length; i++) {
			var arrClassNames = allEles[i].className.split(" "); //将所有标签名中的类名拼接成数组
			for(var j = 0; j < arrClassNames.length; j++) {
				if(arrClassNames[j] == selector.substring(1)) { //在数组中找class名  找到就添加到新数组中
					arr.push(allEles[i]);
					break;
				}
			};
		};
		return arr; //返回找到的class名形成的数组
	} else {
		return parent.getElementsByTagName(selector);
	}
}

//js获取兼容性css样式   -------------------------------------------------------------
//标准浏览器识别getComputedStyle，IE9一下只识别currentStyle
function getStyle(obj, attr) { //obj为对象，attr是属性
	//下面三目运算符为简写
	return window.getComputedStyle ? getComputedStyle(obj)[attr] : obj.currentStyle[attr];
}

//在数组中查找字符串  如果找到，返回下标，否则返回-1  -------------------------------------------------------------
function arrIndexOf(arr, str, index) {
	if(arguments.length != 0 && arguments.length != 1) {
		index = index || 0;
		for(var i = index; i < arr.length; i++) {
			if(str == arr[i]) {
				return i;
			}
		};
		return -1;
	} else {
		return "您写的参数不对";
	}

}

//以下为DOM
//获取元素的第一个元素子节点-------------------------------------------------------------
function first(ele) {
	var first = ele.firstElementChild || ele.firstChild;
	if(!first || first.nodeType != 1) {
		return null;
	} else {
		return first;
	}
}
//获取元素的最后一个元素子节点	-------------------------------------------------------------
function last(ele) {
	var last = ele.lastElementChild || ele.lastChild;
	if(!last || last.nodeType != 1) {
		return null;
	} else {
		return last;
	}
}
//获取下一个元素节点-------------------------------------------------------------
function next(ele) {
	var next = ele.nextElementSibling || ele.nextSibling;
	if(!next || next.nodeType != 1) {
		return null;
	} else {
		return next;
	}

}
//获取上一个元素节点-------------------------------------------------------------
function prev(ele) {
	var prev = ele.previousElementSibling || ele.previousSibling;
	if(!prev || prev.nodeType != 1) {
		return null;
	} else {
		return prev;
	}
}

//绑定函数-------------------------------------------------------------
function bind(obj, evName, evFn, isCapture) {
	if(obj.addEventListener) {
		obj.addEventListener(evName, evFn, isCapture);
	} else if(obj.attachEvent) {
		obj.attachEvent("on" + evName, function() {
			evFn.call(obj);
		});
	} else {
		obj["on" + evName] = evFn;
	}
}
//解绑函数

//求最大值-------------------------------------------------------------
function aMax() {
	var Max = -Infinity;
	for(var i = 0; i < arguments.length; i++) {
		if(arguments[i] > Max) {
			Max = arguments[i];
		}
	};
	return Max;
}
//求最小值-------------------------------------------------------------
function aMin() {
	var Min = Infinity;
	for(var i = 0; i < arguments.length; i++) {
		if(arguments[i] < Min) {
			Min = arguments[i];
		}
	};
	return Min;
}
//获取cookie-------------------------------------------------------------
function getCookie(key) {
	var str = document.cookie;
	var arr = str.split("; ");
	for(var i = 0; i < arr.length; i++) {
		var newArr = arr[i].split("=");
		if(newArr[0] == key) {
			return decodeURI(newArr[1]);
		}
	};

}
//设置cookie-------------------------------------------------------------
function setCookie(key, value, t) {
	var mydate = new Date();
	mydate.setDate(mydate.getDate() + t);
	document.cookie = key + "=" + encodeURI(value) + ";expires=" + mydate.toGMTString();
}
//移除cookie-------------------------------------------------------------
function removeCookie(key) {
	setCookie(key, "", -1);
}
//碰撞检测函数-------------------------------------------------------------
function hitTest(obj, obj2) {
	var objL = obj.offsetLeft;
	var objT = obj.offsetTop;
	var objW = obj.offsetWidth;
	var objH = obj.offsetHeight;
	var obj2L = obj2.offsetLeft;
	var obj2T = obj2.offsetTop;
	var obj2W = obj2.offsetWidth;
	var obj2H = obj2.offsetHeight;
	if(objL + objW < obj2L || objT + objH < obj2T || objL > obj2L + obj2W || objT > obj2T + obj2H) {
		return false;
	} else {
		return true;
	}
}

//运动函数-------------------------------------------------------------
/*
 参数：   obj：运动的对象
 * 	  attr：运动的方向
 *    target：目标点
 * 	  step：每次移动的距离(步长)
 * 	  callback：回调函数
 * */
function move(obj, attr, target, step, callback) {
	clearInterval(obj.timer);
	//判断step的正负   如果目标点小于现有距离  step为负;否则为正值
	step = parseInt(getStyle(obj, attr)) > target ? -step : step;
	var speed = parseInt(getStyle(obj, attr));
	obj.timer = setInterval(function() {
		speed += step;
		if(speed > target && step > 0 || speed < target && step < 0) {
			speed = target;
		}
		obj.style[attr] = speed + "px";

		if(speed == target) {
			clearInterval(obj.timer);
			callback && callback();
		}
	}, 30)
}

//抖动函数-------------------------------------------------------------
/*抖动函数shake()参数：
 * obj：抖动的对象
 * attr：抖动的方向
 * fudu：抖动的幅度   fudu越大抖动幅度越大
 * rate：都懂的次数   rate越大抖动次数越小
 * callback：回调函数
 * */
function shake(obj, attr, fudu, rate, callback) {
	if(obj.timer) { //防止在抖动过程中重复触发定时器产生位移
		clearInterval(obj.timer);
	}
	var arr = [];
	var num = 0;
	var init = parseInt(getStyle(obj, attr));
	for(i = fudu; i > 0; i -= rate) { //rate控制抖动的次数  rate越大arr中数值越少抖动次数越小
		arr.push(i, -i);
	}
	arr.push(0);
	obj.timer = setInterval(function() {
		obj.style[attr] = init + arr[num] + "px";
		num++;
		if(num > arr.length - 1) {
			clearInterval(obj.timer);
			obj.timer = null;
			callback && callback();
		}
	}, 36)
}

//多值运动函数-------------------------------------------------------------
/*
 *obj：运动的对象
 *json:键值对   
 *endFn   回调函数
 * 
 * 调用形式：  stratMove(oBox,{left:500,height:400,opacaty:0.8},function(){alert("任务完成了！")})
 * */
function startMove(obj, json, endFn) {
	//设置iCur变量为当前的位置
	var iCur = 0;
	//定义一个速度变量
	var speed = 0;
	//清除定时器
	clearInterval(obj.timer);

	//开启定时器
	obj.timer = setInterval(function() {
		//设置一个开关为真
		var onOff = true;

		//遍历json
		for(var attr in json) {
			//如果当前的属性名是透明度							
			if(attr == "opacity") {
				//通过这个方式获取当前的透明度值，乘以100，转成整数进行计算，（小数有精度问题）
				iCur = Math.round(getStyle(obj, "opacity") * 100);
			} else {
				//正常的其他属性，通过这种方式直接获取
				iCur = parseInt(getStyle(obj, attr));
			}
			//要运动的目标点，找对应json里面的属性值
			var target = json[attr];
			//让速度等于目标点位置减去当前的位置除以8，得到一个每次变化的值
			//这个值越来越小，逐渐接近目标点
			speed = (target - iCur) / 8;  
			//因为小数的js计算关系，无法到达目标点，所以处理一下取整的问题
			speed = (target - iCur) > 0 ? Math.ceil(speed) : Math.floor(speed);
			//如果当前值不等于目标点
			if(iCur != target) {
				//把开端改为假
				onOff = false;
				//如果当前属性等于透明度
				if(attr == "opacity") {
					//将变化后的值，赋给obj对象对应的透明度，（IE下透明度实现写法不一样）
					obj.style.opacity = (iCur + speed) / 100;
					obj.style.filter = "alpha(opacity=" + iCur + speed + ")";
				} else {
					//否则按照常规的属性赋值方式给回去
					obj.style[attr] = iCur + speed + "px";
				}
			}
		}
		//每一次循环完毕后，开关是否为真
		if(onOff) {
			//如果为真，清楚定时器
			clearInterval(obj.timer);
			endFn && endFn();
		}
	}, 30)
}

//随机颜色----------------------------------------------------------------
function randomColor(){
//	toString()  转成16进制
	var R=Math.round(Math.random()*255).toString(16);
	var G=Math.round(Math.random()*255).toString(16);
	var B=Math.round(Math.random()*255).toString(16);
	return "#"+(R.length>1?R:"0"+R)+(G.length>1?G:"0"+G)+(B.length>1?B:"0"+B);
}

//extend
function extend(obj1,obj2){
	for(var attr in obj2){
		obj1[attr]=obj2[attr];
	}
}
