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
		index: "/KB/overview/",
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
		Index:{	
			menu:"/menu.json",
			User:"/get_user_detail.json",
			logout:"/UC/user_controller/logout",
			log:"/log.json"
		},
		Employee:{
			employees:{
				overview:"/employee.json",
				add:"/UC/employee_controller/add",
				detail:"/UC/employee_controller/get_detail",
				edit:"/UC/employee_controller/update",
				del:"/UC/employee_controller/delete",
			},
			roles:{
				overview:"/role.json",
				availbleMenu:"/UC/menu_controller/available_menu",
				add:"/UC/role_controller/add",
				del:"/UC/role_controller/delete",
				edit :"/UC/role_controller/edit",
				save:"/UC/role_controller/edit",
				secondmenulist:"/UC/menu_controller/second_list",
				jurisdictionlist:"/chucloud/api/manage/jurisdictionlist.php",
				saveapply:"/UC/role_controller/edit",
				member:{
					overview:"/chucloud/api/manage/role_member.php",
					list:"/chucloud/api/manage/norole_of_member.php",
					del :"/chucloud/api/manage/delmember.php",
					add:"/chucloud/api/manage/addmember.php",
				}
			}
		},
		Manage:{
			overview:"",			
			rolename:"/UC/role_controller/is_role_name_available",
			staname:"/UC/station_controller/is_station_name_available",
			departments:"/UC/department_controller/department_list",
			rolelist:"/UC/role_controller/get_role_list",
			stationlist:"/UC/station_controller/get_station_list",
			groups:"/UC/group_controller/group_list",
			groname:"/UC/group_controller/is_group_name_available",

			
		},	
		Group:{
			groups:{
			overview : "/group.json",
			detail : "/UC/group_controller/get_detail",
			addgro : "/UC/group_controller/add_gro",
			editgro : "/UC/group_controller/edit",
			delgro : "/UC/group_controller/delete",
			saveapply:"/UC/group_controller/edituser",
			
			userlist : "/UC/group_controller/userlist",
			availbleName:"/UC/menu_controller/is_available_group_name"
			}
		},
		Department : {
			departments:{
			overview : "/department.json",
			detail : "/departmentusers.json",
			adddep : "/UC/department_controller/add_dep",
			editdep : "/UC/department_controller/edit",
			deldep : "/UC/department_controller/delete",
			adduser : "/UC/department_controller/adduser",
			deluser : "/UC/department_controller/deluser",
			userlist : "/departmentusers.json",
			//availbleuser:"/UC/department_controller/nosta_of_user"
			},
			station:{
				overview:"/UC/station_controller/get_list",
				secondmenulist:"/UC/menu_controller/second_station_list",
				saveapply:"/UC/station_controller/edit",
				add:"/UC/station_controller/add",
				del:"/UC/station_controller/delete",
				edit :"/UC/station_controller/edit",
				save:"/UC/station_controller/edit",
				availbleMenu:"/UC/menu_controller/available_station_menu",
				stationdetail:"/UC/station_controller/get_userstation_list",
				editmember:"/UC/station_controller/editmember",
			}
		},
		Info:{
			changepwd:"/UC/user_controller/change_password"
		},
		Validator:{
			username:"/UC/user_controller/is_username_available"
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
