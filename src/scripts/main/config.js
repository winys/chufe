/*******************************************************/
/*               请根据网站不同修改此文件              */
/*******************************************************/

//唯一的配置变量,定义在jquery下面 提高性能
//Config.js 是组件的初始化外部接口
//告诉你个秘密 不要告诉别人啊 config.js 不仅可以定义常量，而且变量，函数值什么的都可以了，总之可以旋转的啦
$.CONFIG = {
	//系统配置项
	server : "http://localhost/data",
	indexpage : "overview",
	tmplTarget : ".content",
	widthToken: true,
	_TOKEN: "",
	token : function(){
		if($.CONFIG._TOKEN) return $.CONFIG._TOKEN;
		//获取TOKEN
		var tokenReg = new RegExp('(^|&)identify=([^&]*)(&|$)', 'i');
		var token = window.location.search.substr(1).match(tokenReg);
		if(token && token[2]){
			$.CONFIG._TOKEN = token[2];
		}
		return $.CONFIG._TOKEN;
	},
	//是否开启Map模式
	addrMap : true,
	//Loadbar 默认配置
	Loadbar  : {
		width	:	"200px",
		height	:	"10px",
		speed	:	"normal",
		auto	:	false
	},
	//MenuView 默认配置
	MenuView : {
		open : true,
		index: "/Components/MenuView/",
		type: "menu",
		seccolor:"",
		maincolor:""
	},
	//Dropdown 默认配置
	Dropdown : {
		enable : true
	},
	//Dialog 默认配置
	Dialog   : {
		moveable : true
	},
	//Actionbar 默认配置项
	Actionbar : {
		itemArr : {
			"user" : {
				icon : "fa fa-user",
				text : "",
				content : "",
				enable : true
			},
			"pwd" :{
				icon : "fa-lock",
				text : "修改密码",
				tmpl : "tmpl_Pwd_overview",
				// url:"/Pwd/overview",
				enable : true
			},
			"workList" : {
				icon : "fa-ticket",
				text : "工单",
				content : "saadsaw<img>asdasd<span style='color:red;'>dsadsa</span>asddasd dasdaseea<>br<br>sadasdas<div style='width:400px;'></div>",
				enable : true
			},
			"message" : {
				icon : "fa-envelope-o",
				text : "消息",
				url:"/Message/overview",
				enable : true
			},
			"consumeLog" : {
				icon : "fa-cny",
				text : "消费记录",
				url : "/Charging/month",
				enable : true
			},
			"help" : {
				icon : "fa-question-circle", 
				text : "帮助",
				content : "sadad",
				enable : false
			},
			"logList" : {
				icon : "fa-clock-o",
				text : "操作日志",
				content : "<div class='timetree'></div>",
				enable : true
			}
		}
	},
	//popbox 默认值
	Popbox : {
		isOpen : false
	},
	//Tooltip 默认值
	Tooltip : {
		placement : "top",
		open : true
	},
	//Tabs 默认值
	Tabs : {
		index : 0
	},
	//BreadCrumb 默认值
	BreadCrumb :{
		area: "化工平台",
		areaColor : "gd",
		areaUrl : "#",
		areaPath : "/",
		index :{ 
			"1":{
				text : "总览",
				path : "#/KB/overview/",
				url : "#"
			}
		}
	},
	Toast :{
		statType :["default","success", "error"],
		defaultType :"default",
		animTime :600,
		delay :1500
	},
	Seekbar : {
		min : 0,
		max : 10,
		value : 5,
		step : 1,
		style : 'horizontal'
	},
	Datediv : {
		year : 1970,
		month : 0,
		day : 0,
		tmpl : "<div class='daydiv' id='@day' data-target='.sinfo' data-nopath='/Charging/daydetail?date=@timestr'><sup>@day</sup><div class='day_item'><div style='color: red;'><i class='fa fa-cny'></i>@total</div></div></div>"

	},
	UrlMap :{
		overview:"",
		Components: {
			MenuView:"",
			Dialog:"",
			Actionbar:"",
			Popbox:"",
			Timetree:"",
			Loadbar:"",
			Dropdown:"",
			Tooltip:"",
			Tab:"",
			BreadCrumb:"",
			Table:"",
			Pagination:"",
			Toast:"",
			Seekbar:"",
			Datediv:"/datediv.json",
			Step:"",
			Optionbtn:"",
			Tablekit:"/employee.json",
			Cascade:"",
			Cascadebtn:""
		},
		Index:{	
			menu:"/menu.json",
			User:"/get_user_detail.json",
			logout:"/UC/user_controller/logout",
			log:"/log.json"
		}		
	}
};

//获取模板 不同网站/不同插件 获取模板的方式不一样
$.CONFIG.getTMPL = function (tmplid) {
	if( QTMPL &&  QTMPL[tmplid] ){
		var tmpl = Handlebars.compile(QTMPL[tmplid]);
		return tmpl;
	}
	return $('#' + tmplid).html();
}

$.CONFIG.getFdata = function (fdata) {
	if( !fdata )
		return {};
	if( typeof fdata == "object")
		return fdata;
	var paramArr = fdata.split("&"),
		data = new Object()
		;
	for (var key in paramArr){
		var key_value = paramArr[key].split("=");
		data[key_value[0]] = key_value[1];
	}
	return data;
}
