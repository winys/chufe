"use strict"

/* ===================================================
 * chucloud.js v1.0.0
 * ===================================================
 * 插件定义分为两种
 * 1.支持链式调用 2.不支持链式
 * 第一种返回对象本身，可以供使用者自由操作公共api
 * 第二种可以同时有多个但不支持链式调用
 * ========================================================== */

/* =============================================================
 * 
 *				第一章 支持链式调用的插件
 *
 * ============================================================= */

/********************************************************
 *		MenuView 菜单显示插件 Winys@2015/2/2		  *
 ********************************************************/
! function  ($) {
	/**
	 * MenuView : 菜单显示插件
	 * @params open 构造时是否是展开模式，true 为是
	 * @params index  初始active的条目
	 *
	 * MenuView 内部链式调用
	 */
	var MenuView = function(element,open,data,type,index){
		//初始化属性
		this.element = element;
		this.menuArr = data || $.CONFIG.MenuView.menuArr;
		this.open = open || $.CONFIG.MenuView.open;
		this.index = index || $.CONFIG.MenuView.index;
		this.type = type || $.CONFIG.MenuView.type;
		this.nopath = this.element.data("nopathform");
		this.target = this.element.data("target");
		this._init();
		
		return this;
	}

	MenuView.prototype = {
		constructor : MenuView,
		_init : function  () {
			var that = this;
			switch(this.type){
				case "menu":
					//构建菜单
					this.element.append("<div class='MenuView'><div class='menu_tree'>"
					 + this._build()
					 + "</div><div class='toggle'><span class='fa fa-outdent'></span></div></div>");
					break;
				case "treeview":
					//构建菜单
					this.element.append("<div class='TreeView'><div class='treeview'>"
					 + this._build_treeview()
					 + "</div></div>");
					break;
				default:
					break;
			}
			$(".treeview .has_item").addClass("selected");
			$(".MenuView .level-2").addClass("hide");
			
			//根据初始化条件配置菜单
			!this.open&&this.folder();
		},
		_build : function( arr , level, keytree){
			var level = level==undefined?"1":level,
				tempArr = arr==undefined?this.menuArr:arr,
				tempHtml = "<ul class='menu_ul level-" + level + "'>",
				curpath = keytree  || "";
			for (var key in tempArr){
				if ( level >= 2 )tempArr[key].icon_class="fa-angle-double-right";
				tempHtml += "<li  data-breadcrumb data-path='"+curpath + "/" +key+ "/"+"' data-title='"+ tempArr[key].text+"' id='" + key + "' class='menu_li " + (tempArr[key].children?"has_item":"no_item") + "'><a class='link' href='"+curpath + "/" +key+ "/"+"'><i class='fa fa-fw " + tempArr[key].icon_class + " menu-icon'></i><span class='text'>"+ tempArr[key].text + "</span></a>";
				if ( tempArr[key].children != undefined ){
					//递归遍历子菜单
					tempHtml += this._build(tempArr[key].children,parseInt(level)+1,curpath + "/" + key);
				}
				tempHtml += "</li>";

			 }
			tempHtml += "</ul>";
			return tempHtml;
		},
		_build_treeview : function( arr , level, prefix){
			var level = level==undefined?"1":level,
				tempArr = arr==undefined?this.menuArr:arr,
				tempHtml = "<ul class='treeview_ul level-" + level + "'>",
				prefix = prefix||"",
				itemchar = "├──",
				length = 0,
				count = 0
				;
			// console.log(tempArr);
			for (var key in tempArr){
				length ++;
			}
			for (var key in tempArr){
				if ( ++count == length )
					itemchar = "└──";
				else 
					itemchar = "├──";
				// console.log(tempArr[key].children);
				if( tempArr[key].children != undefined )
					itemchar = '<i class="switch fa fa-minus-square-o"></i>&nbsp;─';
				var nopath = this.nopath.replace(/@(\w*)/g,function (v){return tempArr[key][v.substr(1)] });
				tempHtml += "<li data-title='"+ tempArr[key].text+"' id='" + key + "' class='treeview_li " + (tempArr[key].children?"has_item"+ "'><a class='link' data-target='"+this.target+"'' data-nopath='"+nopath+"'><span class='text'>"+ prefix + itemchar + ''+ tempArr[key].text + "</span></a>":"no_item"
						 + "'><a class='link' data-target='"+this.target+"'' data-nopath='"+nopath+"'><span class='text'>"+ prefix + itemchar + ''+ tempArr[key].text + "</span><span class='hide' data-dialog data-tmpl='tmpl_City_delete' data-fdata='level="+nopath.substr(nopath.indexOf('=')+1)+"'><i class='fa fa-trash' title='删除'></i></span></a>");
				if ( tempArr[key].children != undefined ){
					//递归遍历子菜单
					tempHtml += this._build_treeview(tempArr[key].children,parseInt(level)+1,prefix+(count == length?"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;":"│&nbsp;&nbsp;&nbsp;&nbsp;"));
				}
				tempHtml += "</li>";

			 }
			tempHtml += "</ul>";
			return  tempHtml;
		},
		toggleLi : function  (Li) {
			if(this.type == "menu"){
				if(Li.hasClass("has_item")){
					if(Li.hasClass("selected"))
					{
						Li.removeClass("selected");
						Li.find("ul").removeClass("show").addClass("hide");
						Li.css("background-color",$.CONFIG.MenuView.maincolor);
					}
					else{
						// if(this.type == "menu"){
							Li.parent().find(".menu_li").removeClass("selected");
							Li.parent().find(".menu_li").css("background-color",$.CONFIG.MenuView.maincolor);
						// }
						Li.find("ul").removeClass("hide").addClass("show");
						Li.addClass("selected");
						Li.css("background-color",$.CONFIG.MenuView.seccolor);
					}
					// if(this.type == "treeview")
					// 	Li.find(".switch").toggleClass("fa-minus-square-o").toggleClass(" fa-plus-square-o");	
				}
				else{
					// if(this.type == "menu"){
						Li.siblings().removeClass("selected");
						$(".menu_li").css("background-color",$.CONFIG.MenuView.maincolor);
						$(".MenuView .no_item").removeClass("selected");
						$(".MenuView .no_item").css("background-color",$.CONFIG.MenuView.maincolor);
						Li.css("background-color",$.CONFIG.MenuView.maincolor);
						Li.addClass("selected");
						Li.css("background-color",$.CONFIG.MenuView.seccolor);
					// }			
				}
			}
			else{
				if(Li.hasClass("has_item")){
					if(Li.hasClass("selected"))
					{
						Li.removeClass("selected");
						Li.find("ul").removeClass("show").addClass("hide");
					}
					else{
						Li.find("ul").removeClass("hide").addClass("show");
						Li.addClass("selected");
					}
					// if(this.type == "treeview")
						Li.find(".switch").toggleClass("fa-minus-square-o").toggleClass(" fa-plus-square-o");	
				}
				// else{
				// 	if(this.type == "menu"){
				// 		Li.siblings().removeClass("selected");
				// 		$(".MenuView .no_item").removeClass("selected");
				// 		Li.addClass("selected");
				// 	}			
				// }
			}
			if(this.type == "menu")
				Li.siblings().children("ul").removeClass("show").addClass("hide");
			$('.level a,ol').css("background-color","#F1F4F6");
			$('.level a:first,.menu_tree').css("background-color",$.CONFIG.MenuView.maincolor);
			return this;
		},
		setIndex : function  (index) {
			this.index = index || $.CONFIG.MenuView.index;
			this.index = "/" + this.index +"/";
			if(!$("[data-path='"+this.index+"']").parent().parent().hasClass("selected")){
				this.toggleLi($("[data-path='"+this.index+"']").parent().parent());
			}
			this.toggleLi($("[data-path='"+this.index+"']"));
			return this;
		},
		folder : function  () {
			$(".MenuView").parent().toggleClass("folder");
			this.open = !$(".MenuView").parent().hasClass("folder");
			this.open ? $(".MenuView .toggle").html("<span class='fa fa-outdent'></span>")
				: $(".MenuView .toggle").html("<span class='fa fa-indent'></span>");
			return this;
		}
	};

	var old = $.fn.menuView;
	$.fn.menuView = function(open,menudata,type,index){
		return this.each(function () {
			var $this = $(this),
				data = $this.data('menuView')
				;
			if (!data) {
				$this.data("menuView", data =  new MenuView($this, open, menudata, type, index ).setIndex());
			}

		});
	}
	$.fn.menuView.noConflict = function () {
		$.fn.menuView = old;
		return this;
	}

	//绑定事件
	$(document).on('click','.MenuView li', function  (event) {
		var that = $(this).closest(".MenuView").parent().data("menuView");
		that.setIndex($(this).data("path").replace(/(^\/*)|(\/*$)/g, ""));
		event.stopPropagation();
	}).on('click','.MenuView .toggle', function  (event) {
		var $el = $(this).closest(".MenuView").parent();
		var that = $el.data("menuView");
		that.folder();
		$el.siblings().toggleClass("folder");
		//设置tablekit中toolbar的宽度
		var width = $(this).closest(".page").find("[data-table]").css("width");
		$(this).closest(".page").find("[data-toolbar]").css("width",width);

	}).on('click','[data-treeview] a', function  (event) {
		var $this = $(this);

		var $el = $this.closest("[data-treeview]");
		var that = $el.data("menuView");
		that.toggleLi($this.closest("li"));
		event.stopPropagation();
		$el.find("li").removeClass("active");
		$this.closest("li").addClass("active");
		$(document).trigger("treeviewIndex",$.extend($this.data(),$el.data()));
	});
}(jQuery);


/********************************************************
 *		 Dialog 对话框 Winys@2015/2/2				 *
 ********************************************************/

! function ($) {
	var Dialog = function  (element, title, moveable, content) {
		this.element = element;
		this.title = title;
		this.moveable = moveable || $.CONFIG.Dialog.moveable;
		this.content = content;
		this.id=this.element.data("tmpl");
		this._init();

		return this;
	}

	Dialog.prototype = {
		constructor : Dialog,
		_init : function () {
			var that = this;
			//构造dialog
			that.build();

			that.moveable&&that.setMoveable();
		},
		build : function () {
			//背景
			var tempHtml = "<div class='dialog_bkg "
			//对话框onselectstart='function(){return false;}'
				+this.id+"'>"
				+ "<div class='dialog'>"
				+ "<div class='headbar' unselectable='on'  style='-moz-user-select:none;'><h4><span class='title'>" + this.title + "</span><a href='#' class='times'><i class='fa fa-times'></i></a></h4></div>"
				+ "<div class='form'> "+ this.content + "</div>"
				+ "</div></div>";
			$("body").prepend($(tempHtml));
			var zindex=$(".dialog_bkg").length;
			$("."+this.id+".dialog_bkg").css("z-index",zindex+101);
			return this;
		},
		setMoveable : function (){
			$(document)
				.on("mousedown",".dialog .headbar", function (event) {
					var $this=$(this);
					var _x = event.pageX - $(this).parent(".dialog").offset().left,
						_y = event.pageY - $(this).parent(".dialog").offset().top
						;
					$(document).on("mousemove.dialog", function (event) {
						var dialogLeft = event.pageX - _x,
						dialogTop = event.pageY - _y;
						$(".dialog:first").css({left:dialogLeft+"px",top:dialogTop+"px"});
					});
				})
				.on("mouseup",".dialog .headbar",function (event) {
					$(document).off("mousemove.dialog");
				});
		},
		moveto : function  (left, top, play) {
			//检查是否为数字，是则加px
			if (typeof left == "number" ) left += "px";
			if (typeof top == "number" ) top += "px";

			//检查是否为缺省，是则设为居中
			// var dialogHeight=(parseInt($(".dialog").height(),10)-113)/this.number+113;//对话框的高度，125是标题栏高度+stepnav高度
			if(!left)
				left = ($(".dialog_bkg").width() - parseInt($("."+this.id+" .dialog").width(),10))/2;
			if(!top)
				top = ($(".dialog_bkg").height() - parseInt($("."+this.id+" .dialog").height(),10))/2;
			top=top<0?0:top;	
			play ? $("."+this.id+" .dialog").animate({left:left,top:top},"normal")
				 : $("."+this.id+" .dialog").css({left:left,top:top})
				 ;
			return this;
		},
		setTitle : function  (title) {
			if( typeof title == "undefined" ){
				$(".dialog .headbar").remove();
				return this;
			}
			this.title = title;
			$("."+this.id+" .dialog .title").text(this.title);
			return this;
		},
		setContent : function  (content) {
			if( typeof content == "undefined" ){
				console.log("Can't set content with undefined");
				return this;
			}
			this.content = content;
			$("."+this.id+" .dialog .form").html(this.content);
			// this.number=$(".dialog .step_nav li").length>0?$(".dialog .step_nav li").length:1;
			return this;
		}
	};
	//静态函数
	$.dialog_close = Dialog.close =  function () {
		// var dialog_bkg
		$(".dialog_bkg").remove();
	};
	var old = $.fn.dialog;
	$.fn.dialog = function(title, moveable, content){
		var $this = $(this),
			data = $this.data("dd");
		if (!data) {
			$this.data("dialog", data =  new Dialog($(this), title, moveable, content));
		}		
		return  data;			
	}
	$.fn.dialog.noConflict = function () {
		$.fn.dialog = old;
		return this;
	}

	$(document).on('click','.dialog .times', function(e){
		$(this).closest(".dialog_bkg").remove();
		// Dialog.close();
		e.stopPropagation();
		e.preventDefault();
	})
	.on('click','.dialog [data-conceal]:not(.btn-forbidden)', function(e){
		$(this).closest(".dialog_bkg").remove();
		// Dialog.close();
		e.stopPropagation();
		e.preventDefault();
	})
	.on('click','.dialog [data-sureconceal]:not(.btn-forbidden)', function(e){
		var elements=$(this).closest('form')[0].elements;
		for(var key in elements){
			if(typeof elements[key] == "function") continue;
			if($(elements[key]).attr("disabled") == "disabled") continue;
			$(elements[key]).blur();
			
			var err = $(this).data("err");
			if(err>0){
				return;
			}
		}
		$(this).closest(".dialog_bkg").remove();
		// Dialog.close();
		e.stopPropagation();
		e.preventDefault();
	})
	.on('click.data-api.dialog','[data-dialog]',function (event) {
		var $this = $(this);
		if(!$this.hasClass('btn-forbidden')){ // 2015.12.9加判断
			$this.dialog()
			.setContent(
				function () {
					var tmpl = $.CONFIG.getTMPL($this.data("tmpl"));
					if (typeof tmpl == "function"){
						return tmpl($.CONFIG.getFdata($this.data("fdata")));
					}
					return tmpl;
				}())
			.setTitle($('#'+ $(this).data("tmpl")).data("title"))
			.moveto();
			// $(document).trigger("Init");
			event.stopPropagation();
		}
	});
}(jQuery);



/********************************************************
 *		  Actionbar 行为栏 Winys@2015/2/3			    *
 ********************************************************/
! function ($) {
	var Actionbar = function  (element) {
		this.element = element;
		this.itemArr = $.CONFIG.Actionbar.itemArr;
		this.popbox = new Object();
		
		this._init();
		
		return this;
	}

	Actionbar.prototype =  {
		_init : function  () {
			this._build();

			var that = this;
			//绑定事件
			
		},
		_build : function  () {
			var tempHtml = "<div class='inner'><ul class='items'>";
			for (var key in this.itemArr){
				tempHtml += 
					"<li" 
					+ " data-id='"+ key 
					+"' class='item"+ (this.itemArr[key].enable?"":" disable") 
					+"'><a "+ (this.itemArr[key].url?"data-path='"+this.itemArr[key].url+"'>":this.itemArr[key].tmpl?"data-dialog data-tmpl='"+this.itemArr[key].tmpl+"'":">") 
					+(this.itemArr[key].icon?"<i class='fa "+this.itemArr[key].icon+"'></i>":'') +
					"<span class='text'>"+this.itemArr[key].text+"</span></a></li>";
			}
			tempHtml += "</ul></div>";
			this.element.append(tempHtml);

			//添加popbox
			var that = this;
			that.element.find(".items li").each(function  (index) {
				var content = that.itemArr[$(this).data("id")].content;
				if(content !== undefined){
					that.popbox[$(this).data("id")] = $(this).popbox(content);
				}
			});
			
		},
		setContent : function  (key,content) {
			this.popbox[key].setContent(content);
			return this;
		},
		setTitle : function(key,content){
			this.element.find(".items li[data-id="+key+"] .text").html(content);
			return this;
		},
		setEnable : function  (key,enable) {
			var that = this;
			enable?
				$(".actionbar .items li[data-id="+key+"]").removeClass("disable"):
				$(".actionbar .items li[data-id="+key+"]").addClass("disable");
			return this;
		}
	};

	var old = $.fn.actionbar;
	$.fn.actionbar = function(){
		var $this = $(this),
			data = $this.data("actionbar");
		if (!data) {
			$this.data("actionbar", data = new Actionbar($(this)));
		}
		return data;
	}
	$.fn.actionbar.noConflict = function () {
		$.fn.actionbar = old;
		return this;
	}
	//绑定hover事件
	$(document).on("mouseover.actionbar mouseout.actionbar","[data-actionbar] .items .item:not('.disable')",function  (event) {
			var $el = $(this),
				id = $el.closest(".item").data("id"),
				data = $el.closest("[data-actionbar]").data("actionbar"),
				enable = $el.hasClass("disable")
				;

			if(event.type == "mouseover" && !enable){
				if (data.popbox[id]) data.popbox[id].open();
			}else if(event.type == "mouseout"  && !enable){
				if (data.popbox[id]) data.popbox[id].close();
			}
	});
}(jQuery);

/********************************************************
 *		 Popbox 弹出菜单 Winys@2015/2/3			   *
 ********************************************************/
!function ($) {
	var Popbox = function  (element, isOpen, content) {
		this.element = element;
		this.isOpen = isOpen || $.CONFIG.Popbox.isOpen;
		this.content = content;

		this._init();
	}

	Popbox.prototype =  {
		_init : function  () {
			this._build();
		},
		_build : function  () {
			var tempHtml = "<div class='popbox "+(this.isOpen?"":"hide")+"'>"+
					"<div class='popbox-inner'>"+this.content+"</div>"+
					"</div>";
				this.element.append(tempHtml);
		},
		open : function  () {
			this.element.children(".popbox").removeClass("hide");
			return this;
		},
		close : function  () {
			this.element.children(".popbox").addClass("hide");
			return this;
		},
		setContent : function  (content) {
			if(content != undefined){
				this.content = content;
				this.element.find(".popbox-inner").html(this.content);
			}
			return this;
		},
		distory : function  () {
			this.element.html("");
			this.element = null;
		}
	};

	var old = $.fn.popbox;
	$.fn.popbox = function(  content, open ){
		var $this = $(this),
			data = $this.data("popbox");
		if (!data) {
			$this.data("popbox", data = new Popbox($(this), open, content));
		}
		return data;
	}
	$.fn.popbox.noConflict = function () {
		$.fn.popbox = old;
		return this;
	}

}(jQuery);

/********************************************************
 *		 Timetree 时间树 Winys@2015/2/4			   *
 ********************************************************/
! function  ($) {
	var Timetree = function (element, title, itemObj) {
		this.element = element;
		this.title = title;
		this.length = 0;
		itemObj = itemObj || "[]";		
		this.itemObj = itemObj["items"];
		this._bulid();
		return this;
	}

	Timetree.prototype = {
		_init : function  () {
			this._bulid();
		},
		_bulid : function  () {
			var tempHtml = "<div class='timetree-inner'><h4 class='timetree-title'>" + this.title + "</h4>" +
					"<ol class='timetree-items'>";

			for (var key in this.itemObj) {

				tempHtml += "<li  data-id='" + this.length + "'><span class='item-status " + this.itemObj[key].status  +  "'></span>" + 
						"<div class='item-details'><a class='acation'>" + this.itemObj[key].action +"</a>"+
						"<span class='consumed'>" + this.itemObj[key].consumed +"</span>"+
						"<span class='actiontime'>"  + this.itemObj[key].actiontime +"</span>"+
						"<ul class='resouces'>";
						for (var k in this.itemObj[key].resouce){
							tempHtml += "<li>"+this.itemObj[key].resouce[k].content + "</li>";
						}
						tempHtml += "</ul></div>";
				this.length++;
			}
			tempHtml += "</ol></div>";

			this.element.html(tempHtml);
		},
		//压栈，不填写 index 默认在最前面,支持并建议使用item数组减少对Dom的刷新操作 支持链式操作
		push : function (itemsObj, index) {
			if( typeof itemsObj == "string" ){
				var items = JSON.parse(itemsObj)["items"],
					tempHtml = "";
				for (var key in items) {
					tempHtml += "<li  data-id='" + this.length + "'><span class='item-status " + items[key].status  +  "'></span>" + 
						"<div class='item-details'><a class='acation'>" + items[key].action +"</a>"+
						"<span class='consumed'>" + items[key].consumed +"</span>"+
						"<span class='actiontime'>"  + items[key].actiontime +"</span>"+
						"<ul class='resouces'>";
						for (var k in items[key].resouce){
							tempHtml += "<li>"+items[key].resouce[k].content + "</li>";
						}
						tempHtml += "</ul></div>";
					this.length++;
				}
				if(index == undefined)
					this.element.find(".timetree-items").prepend(tempHtml);
				else if (index == -1)
					this.element.find(".timetree-items").append(tempHtml);
				else
					this.element.find(".timetree-items [data-id="+index+"]").after(tempHtml);

				//reorder
				this.element.find(".timetree-items > li").each(function (index) {
					$(this).attr("data-id",index);
				});
			}

			return this;
		},
		//弹出栈，默认弹出最后一个，不返回最后一个，支持数组弹出以及链式操作
		pop : function  (index) {
			index == undefined?this.element.find(".timetree-items [data-id=0]").remove():
					this.element.find(".timetree-items [data-id="+index+"]").remove();
			//reorder
			this.element.find(".timetree-items > li").each(function (index) {
				$(this).attr("data-id",index);
			});
			return this;
		},
		distory : function  () {
			this.element.html();
			this.element = null;

			return this;
		}
	};

	var old = $.fn.timetree;
	$.fn.timetree = function(  title, itemObj ){
		var $this = $(this),
			data = $this.data("timetree");
		if (!data) {
			$this.data("timetree", data = new Timetree($(this),title,itemObj));
		}
		return data;
	}
	$.fn.timetree.noConflict = function () {
		$.fn.timetree = old;
		return this;
	}
}(jQuery);


/* =============================================================
 * 
 *				第二章 不支持链式调用的插件
 *
 * ============================================================= */

/********************************************************
 *		  Loadbar 加载进度条 Winys@2015/2/1		   *
 ********************************************************/
!function  ($) {

	/**
	 * Loadbar : 加载进度条类
	 * @params width 进度条的宽度
	 * @params height 进度条的高度
	 * @params speed 进度条的速度
	 * @params auto 是否自动增长
	 *
	 * 仅支持Loadbar 内部链式调用
	 */
	var Loadbar = function (element,options){
		//初始化属性
		this.element = element;
		this.width = options.width || $.CONFIG.Loadbar.width;
		this.height = options.height || $.CONFIG.Loadbar.height;
		this.speed = options.speed || $.CONFIG.Loadbar.speed;
		this.auto = options.auto ||$.CONFIG.Loadbar.auto;

		this._init();

		//允许链式调用
		return this;
	};
	Loadbar.prototype = {
		constructor : Loadbar,
		_init : function (argument) {
			this.element.css("width",this.width).css("height",this.height);
			this.element.append($("<div class='progress_bar'></div>"));
			
			this.begin();
			this.auto&&this.autoPlay();
		},
		begin : function(){
			return this;
		},
		autoPlay : function(callback){			
			this.element.find(".progress_bar").animate({width:"100%"},this.speed,function () {
				callback.call(this,arguments)
			});
			return this; 
		},
		setValue : function( value ){
			this.element.find(".progress_bar").animate({width:value+"%"},this.speed);
			return this;
		},
		setAuto : function( auto ){
			this.auto = auto?auto:false;
			return this;
		},
		finish : function( callback ){
			this.element.find(".progress_bar").animate({width:"100%"},this.speed,function () {
				callback.call(this,arguments)
			});
			return this;
		}
	};

	var old = $.fn.loadbar;
	$.fn.loadbar = function(options, params){
		return this.each(function(){
			var $this = $(this),
				data = $this.data("loadbar");
			if (!data) {
				$this.data("loadbar", data =  new Loadbar($this, options));
			}
			if (typeof options == "string")
				data[options].call(data, params);
		});

	}
	$.fn.loadbar.noConflict = function () {
		$.fn.loadbar = old;
		return this;
	}
}(jQuery);

/********************************************************
 *		Dropdown 下拉菜单  Winys@2015/2/2				*
 ********************************************************/
!function ($) {
	/**
	 * Dropdown : 下拉菜单插件
	 * @params enable  是否可以使用
	 * @params csstype  用户自定义样式类型（仅允许定义颜色宽度等边缘样式）
	 *
	 */
	 var Dropdown = function  (element, enable) {
	 	this.element = element;
	 	this.enable = enable || $.CONFIG.Dropdown.enable;

	 	this._init();
	 	return this;
	 }

	 Dropdown.prototype = {
	 	_init : function  () {
	 		this.enable || this.setEnable();
	 	},
	 	toggle : function  () {
	 		if (this.element.is('.disabled, :disabled')) return;
	 		var isActive = this.element.hasClass("open");
	 		closeMenu();
	 		!isActive && this.element.toggleClass("open");

	 	},
	 	setEnable : function  (enable) {
	 		this.enable = typeof enable == "undefined" ? this.enable : enable;
	 		enable ?
	 			this.element.removeClass("disabled"):
	 			this.element.addClass("disabled");
	 	}
	 };

	 function closeMenu (e) {
	 	if (e && e.which === 3) return;
	 	if(e && e.type == "keydown" && !/(27|32)/.test(e.which)) return;
	 	$("[data-dropdown]").removeClass("open");
	 }

	var old = $.fn.dropdown;
	$.fn.dropdown = function(enable){
		return this.each(function(){
			var $this = $(this),
				data = $this.data("dropdown");
			if (!data) {
				$this.data("dropdown", data =  new Dropdown($this, enable));
			}
		});
	}
	$.fn.dropdown.noConflict = function () {
		$.fn.dropdown = old;
		return this;
	}

	$(document)
		.on("click.data-api.closedropdown keydown.data-api.closedropdown",closeMenu)
		.on('click.bs.dropdown.data-api', '[data-dropdown] .dropdown_items li', function (e) {
			$(this).parent().prev().html($(this).text());
			closeMenu();
			 e.stopPropagation() 
		})
		.on('click.bs.dropdown.data-api.toggle', "[data-dropdown]", function  (e) {
			var $el = $(this).closest("[data-dropdown]"),
				data = $el.data("dropdown");
			if (!data){
				$el.dropdown();
				data = $el.data("dropdown");
			}
			data.toggle();
			e.stopPropagation();
		});


}(jQuery);


/********************************************************
 *		 Tooltip 提示文字 Bootstrap@2015/2/5			  	*
 ********************************************************/
+function ($) {

	"use strict"; // jshint ;_;

	/* TOOLTIP PUBLIC CLASS DEFINITION
	 * =============================== */
	var Tooltip = function (element, options) {
		this.init('tooltip', element, options)
	}
	Tooltip.prototype = {
		constructor: Tooltip, init: function (type, element, options) {
			var eventIn
				, eventOut
				, triggers
				, trigger
				, i

			this.type = type
			this.$element = $(element)
			this.options = this.getOptions(options)
			this.enabled = true

			triggers = this.options.trigger.split(' ')

			for (i = triggers.length; i--;) {
				trigger = triggers[i]
				if (trigger == 'click') {
					this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
				} else if (trigger != 'manual') {
					eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
					eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
					this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
					this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
				}
			}

			this.options.selector ?
				(this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
				this.fixTitle()
		}, getOptions: function (options) {
			options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

			if (options.delay && typeof options.delay == 'number') {
				options.delay = {
					show: options.delay, hide: options.delay
				}
			}

			return options
		}, enter: function (e) {
			var defaults = $.fn[this.type].defaults
				, options = {}
				, self

			this._options && $.each(this._options, function (key, value) {
				if (defaults[key] != value) options[key] = value
			}, this)

			self = $(e.currentTarget)[this.type](options).data(this.type)

			if (!self.options.delay || !self.options.delay.show) return self.show()

			clearTimeout(this.timeout)
			self.hoverState = 'in'
			this.timeout = setTimeout(function () {
				if (self.hoverState == 'in') self.show()
			}, self.options.delay.show)
		}, leave: function (e) {
			var self = $(e.currentTarget)[this.type](this._options).data(this.type)

			if (this.timeout) clearTimeout(this.timeout)
			if (!self.options.delay || !self.options.delay.hide) return self.hide()

			self.hoverState = 'out'
			this.timeout = setTimeout(function () {
				if (self.hoverState == 'out') self.hide()
			}, self.options.delay.hide)
		}, show: function () {
			var $tip
				, pos
				, actualWidth
				, actualHeight
				, placement
				, tp
				, e = $.Event('show')

			if (this.hasContent() && this.enabled) {
				this.$element.trigger(e)
				if (e.isDefaultPrevented()) return
				$tip = this.tip()
				this.setContent()

				if (this.options.animation) {
					$tip.addClass('fade')
				}

				placement = typeof this.options.placement == 'function' ?
					this.options.placement.call(this, $tip[0], this.$element[0]) :
					this.options.placement

				$tip
					.detach()
					.css({ top: 0, left: 0, display: 'block' })

				this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

				pos = this.getPosition()

				actualWidth = $tip[0].offsetWidth
				actualHeight = $tip[0].offsetHeight

				switch (placement) {
					case 'bottom':
						tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
						break
					case 'top':
						tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
						break
					case 'left':
						tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - 8}
						break
					case 'right':
						tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
						break
				}

				this.applyPlacement(tp, placement)
				this.$element.trigger('shown')
			}
		}, applyPlacement: function (offset, placement) {
			var $tip = this.tip()
				, width = $tip[0].offsetWidth
				, height = $tip[0].offsetHeight
				, actualWidth
				, actualHeight
				, delta
				, replace

			$tip
				.offset(offset)
				.addClass(placement)
				.addClass('in')

			actualWidth = $tip[0].offsetWidth
			actualHeight = $tip[0].offsetHeight

			if (placement == 'top' && actualHeight != height) {
				offset.top = offset.top + height - actualHeight
				replace = true
			}

			if (placement == 'bottom' || placement == 'top') {
				delta = 0

				if (offset.left < 0) {
					delta = offset.left * -2
					offset.left = 0
					$tip.offset(offset)
					actualWidth = $tip[0].offsetWidth
					actualHeight = $tip[0].offsetHeight
				}

				this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
			} else {
				this.replaceArrow(actualHeight - height, actualHeight, 'top')
			}

			if (replace) $tip.offset(offset)
		}, replaceArrow: function (delta, dimension, position) {
			this
				.arrow()
				.css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
		}, setContent: function () {
			var $tip = this.tip()
				, title = this.getTitle()

			$tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
			$tip.removeClass('fade in top bottom left right')
		}, hide: function () {
			var that = this
				, $tip = this.tip()
				, e = $.Event('hide')

			this.$element.trigger(e)
			if (e.isDefaultPrevented()) return

			$tip.removeClass('in')

			function removeWithAnimation() {
				var timeout = setTimeout(function () {
					$tip.off($.support.transition.end).detach()
				}, 500)

				$tip.one($.support.transition.end, function () {
					clearTimeout(timeout)
					$tip.detach()
				})
			}

			$.support.transition && this.$tip.hasClass('fade') ?
				removeWithAnimation() :
				$tip.detach()

			this.$element.trigger('hidden')

			return this
		}, fixTitle: function () {
			var $e = this.$element
			if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
				$e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
			}
		}, hasContent: function () {
			return this.getTitle()
		}, getPosition: function () {
			var el = this.$element[0]
			return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
				width: el.offsetWidth, height: el.offsetHeight
			}, this.$element.offset())
		}, getTitle: function () {
			var title
				, $e = this.$element
				, o = this.options

			title = $e.attr('data-original-title')
				|| (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)

			return title
		}, tip: function () {
			return this.$tip = this.$tip || $(this.options.template)
		}, arrow: function () {
			return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
		}, validate: function () {
			if (!this.$element[0].parentNode) {
				this.hide()
				this.$element = null
				this.options = null
			}
		}, enable: function () {
			this.enabled = true
		}, disable: function () {
			this.enabled = false
		}, toggleEnabled: function () {
			this.enabled = !this.enabled
		}, toggle: function (e) {
			var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
			self.tip().hasClass('in') ? self.hide() : self.show()
		}, destroy: function () {
			this.hide().$element.off('.' + this.type).removeData(this.type)
		}

	}

	var old = $.fn.tooltip

	$.fn.tooltip = function (option) {
		return this.each(function () {
			var $this = $(this)
				, data = $this.data('tooltip')
				, options = typeof option == 'object' && option
			if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
			if (typeof option == 'string') data[option]()
		})
	}

	$.fn.tooltip.Constructor = Tooltip

	$.fn.tooltip.defaults = {
		animation: true, placement: 'top', selector: false, template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>', trigger: 'hover focus', title: '', delay: 0, html: false, container: false
	}
	
	$.fn.tooltip.noConflict = function () {
		$.fn.tooltip = old
		return this
	}
}(jQuery);

/********************************************************
 *		   Tab 选项卡 Winys@2015/3/6				 		*
 ********************************************************/
!function ($) {
	var Tabs = function(element,index){
		this.element = element;
		this.index =  index || $.CONFIG.Tabs.index;
		this._init();
		return this;
	}

	Tabs.prototype = {
		_init : function  () {
			this.element.find("li").each(function  (index) {
				$(this).data("index",index);
			});

			this.element.find("li").addClass("item");
			this.setIndex();
			return this;
		},
		setIndex: function  ( index ) {
			index = index || this.index;
			var curLi = $(this.element.find("li")[index]),
				panel = this.element.data("panel"),
				tmpl = curLi.data("tmpl");
			this.element.find("li").removeClass("active");
			curLi.addClass("active");
			$(document).trigger("Tabsindex",{
				curLi : curLi,
				index : index,
				target : panel,
				tmpl : tmpl
			})
		},
		setEnable: function  (index, enable) {
			var curLi = $(this.element.find("li")[index]);
			if (enable){
				curLi.removeClass("disabled");
			}
			else {
				curLi.addClass("disabled");
			}
		}
	};

	var old = $.fn.tabs;
	$.fn.tabs = function(index){
		return this.each(function(){
			var $this = $(this),
				data = $this.data("tabs");
			if (!data) {
				$this.data("tabs", data =  new Tabs($this,index));
				$($this.find("li")[index || $.CONFIG.Tabs.index]).trigger('click');
			}
		});
	}
	$.fn.tabs.noConflict = function () {
		$.fn.tabs = old;
		return this;
	}
	//绑定事件
	$(document).on("click.data-api.tabs.toggleTab","[data-tabs] li",function  (e) {
		if($(this).is(".disabled, :disabled")) return;
		var $el = $(this).closest("[data-tabs]"),
			data = $el.data("tabs");
		data.setIndex($(this).data("index"));
		// console.log(data);
		e.stopPropagation();
	});
}(jQuery);
/********************************************************
 *		  MulTable 多个表格 Effall@2016/11/7				 		*
 ********************************************************/
!function ($) {
	var MulTable = function(element){
		this.element=element;
		this._init();
		return this;
	}
	MulTable.prototype = {
		_init : function (){
			this.element.find("li").addClass("item");
			this.getData();
			return this;
		},
		getData :function(){
			var tableData = new Array();
			var table_index=0;
			this.element.find("li").each(function(){
				var tableitem=new Object();
				tableitem.tmpl=$(this).data("tmpl");
				tableitem.curLi=$(this);
				tableData[table_index]=tableitem;
				table_index++;
			});
			var tableobj={obj:tableData};
			$(document).trigger("MulTable",tableobj);
		}
	};

	var old = $.fn.multable;
	$.fn.multable=function(){
		return this.each(function(){
			var $this=$(this),
				data=$this.data("multable");
			if(!data){
				$this.data("multable",data=new MulTable($this));
			}
		});
	};
	$.fn.multable.noConfilict=function(){
		$.fn.multable=old;
		return this;
	};
}(jQuery);
/********************************************************
 *	   BreadCrumb 面包屑 Chujie@2015/2/6			  *
 ********************************************************/
!function ($){ 

	/*
		*BreadCrumb :面包屑导航

	*/
	var BreadCrumb =function(element){
		//初始化属性
		this.element=element;
		this.config=$.CONFIG.BreadCrumb;
		this._init();
		return this ;
	}
	BreadCrumb.prototype={ 
		constructor : BreadCrumb,
		_init : function(){ 
			var that=this;	
			this._build();
			
		},
		_build :function(){ 
			var tempHtml="<ol>";

			tempHtml+="<li data-id='" + this.config.area + "' data-breadcrumbnode='" + this.config.areaPath + "' data-color='" + this.config.areaColor + "' class='level level-area " + this.config.areaColor + "'><a href='" + this.config.areaUrl + "' data-path='" + this.config.areaPath + "'>" + this.config.area + "</a></li>";

			for(var key in this.config.index){ 
				tempHtml+="<li data-id='"+key+"' data-breadcrumbnode='"+this.config.index[key].path+"' class='level'><a class='sublevel' href='"+this.config.index[key].url+"' data-path='"+this.config.index[key].path+"'>"+this.config.index[key].text+"</a></li>";
			}
			tempHtml+="</ol>";
			this.element.append(tempHtml);

		},
		//改变子导航
		change :function(index){
			if (!index || !index["1"])return this;
			var text = index['1'].text;
			var path = index['1'].path;

			if(!path)return;
			
			var url = index['1'].url;
			var liList = this.element.children('ol').children();
			var breadpath = path.split('?')[0];


			//根据链接字符串，改变导航
			for(var i=liList.length-1 ; i>=0;i--){ 
				var $this = liList.eq(i);
				var p = $this.data('breadcrumbnode');
				//已经存在 单纯触发
				if(p==path){ 
					$this.trigger('click');
					return;
				}
				//找到上节点 触发事件后修改导航
				else if(path.indexOf(p) == 0){
					$this.trigger("click");
					var tempHtml="<li data-id='"+($this.data('id')+1)+"' data-breadcrumbnode='"+breadpath+"' class='level'><a href='"+url+"' data-path='"+path+"'>"+text+"</a></li>";
					$this.closest("ol").append(tempHtml);
					break;
				}
			}
		},
		//重新设置导航
		reset :function(to){
			if (typeof to != "object")return this;
			var ol=this.element.children('ol');
			ol.children('li').remove();
			var tempHtml="";
			
			tempHtml+="<li data-id='" + to.area + "' data-breadcrumbnode='" + to.areaPath + "' data-color='" + to.areaColor + "' class='level level-area " + to.areaColor + "'><a class='sublevel' href='" + to.areaUrl + "' data-path='" + to.areaPath + "'>" + to.area + "</a></li>";

			for(var key in to.index){ 
				tempHtml += "<li data-id='"+key+"' data-breadcrumbnode='" + to.index[key].path + "' class='level'><a class='sublevel' href='"+to.index[key].url+"' data-path='"+to.index[key].path+"'>"+to.index[key].text+"</a></li>";
			}
			tempHtml += "</ol>";
			ol.append(tempHtml);

			return this;
		}
	};

	function setSubpath(path, target){	
		if(path!='/')
		{ 
			var sub=path.substring(0,path.lastIndexOf("/",path.length-2)+1);
			setSubpath(sub,target);
			var o=$("[data-path='"+path+"']");
			target.change({ '1':{ text :o.data("title") || o.text(),path :o.data('path'),url :o.data('href') || o.closest("li").data('href') || o.attr('href') || "#"}});
		}	
	}

	//解析路径
	function depath(event){
		var $this=$(this);
		var target = $this.data("target") || ".breadcrumb";
		target = $(target);
		var data = target.breadcrumb();
		if($this.data("path")=="")return;
		if($this.data("path")!="/")
		{ 
			setSubpath($this.data("path"),data);
		}
		else{ 
			data.reset({
				area :$this.text(), 
				areaColor :$this.data('color') || $this.closest("li").data('color'),
				areaPath :$this.data('path'), 
				areaUrl :$this.data('href') || $this.closest("li").data('href') || $this.attr('href') || "#",
				index :{ 
					"1" :{
				 		text :'总览',
						path :'/overview/',
						url :'#'
						}
					}
				}
			);
		}
		event.stopPropagation();
	}
	var old =$.fn.breadcrumb;
	$.fn.breadcrumb=function(){ 
		var $this=$(this),
			data=$this.data("breadcrumb");
		if(!data){ 
			$this.data("breadcrumb",data=new BreadCrumb($(this)));
		}
		return data ;
	}
	$.fn.breadcrumb.noConflict = function () {
		$.fn.breadcrumb = old;
		return this;
	}
	$(document)
	.on('click',"[data-breadcrumbnode]:not(':last')",function(){
		$(this).nextAll("li").remove();
	})
	.on('click',"[data-path]",function (event){
			 	event.preventDefault();
			 })
	.on('click',"[data-path]:not('.has_item')",function (event){
			 	depath.call(this,event);
			 	window.location.hash = $(this).data("path");
	});
}(jQuery);


/********************************************************
 *		  Table 表格 scott@2015/3/13		   *
 ********************************************************/

 ! function  ($) {
	var Table = function (element) {
		this.element = element;
		this._init();
		this._selected = [];
		return this;
	}

	Table.prototype = {

		_init : function  () {
			this._build();
 		},
 		_build:function(){
 			
 		},

	/**
	 * getCol : 获取表格列数的数据
	 * @params index  第几列数据
	 */
		getCol : function (index) {
			var colData = new Array();
			var col_index = 0;
			$('.table tr').find('td').each(function() {
				if ($(this).index() == index) { 
					colData[col_index] = $(this).text().trim();
					col_index ++;
				}
	   		 });
			 return colData;
		},

	/**
	 * getRow : 获取表格行数的数据
	 * @params index  第几行数据
	 */
		getRow :function(index){
			var rowData = new Array();
			var row_index = 0;
			$('.table').find('tr').each(function() {
				if($(this).attr("id") == index){
					$(this).find('td').each(function(){
					 	if($(this).has('input').length == 0){
					 		rowData[row_index] = $(this).text().trim();
					 	}else{
					 		rowData[row_index] = $(this).find("input[type=checkbox]").is(':checked');
					 	}
				 		row_index ++;
					});
				}
	   		 });
			 return rowData;
		},

	/**
	 * newRow : 新添加一行
	 * @params rowData  添加一行的数据，格式为json
	 *??涉及到td样式，还有新添加的图标，链接，其他格式，还有链接url对应的值
	 */
		newRow :function(rowData,callback){
			if ( rowData ){
				var tempHtml = '<tr id="'+rowData['data']['0']+'">';
				var items = this.element.find('th').length;

				if(rowData['checkbox'] == "true"){
					tempHtml += '<td data-check  class="checkbox"><input type="checkbox" ></td>';
					items--;		
				}		   
				for(var i = 0 ; i < items;i++){
					if(i == 0){
					 	tempHtml += '<td><a href="#" >'+rowData['data'][i]+'</a></td>';
					}else{
						tempHtml += '<td>'+rowData['data'][i]+'</td>';
					}
				}	
				tempHtml += "</tr>";
				$(tempHtml).insertBefore(this.element.find("tr:first-child").next());
				callback();		
				return this;
			}
			else {
				var trHtml = this.element.find("tr:last-child").prop('outerHTML');
				// console.log(trHtml);
				this.element.find("table").append(trHtml);
				var $this=this.element.find("tr:last-child").find(".uploadimg[type='file']");
				var length= this.element.find("tr").length;
				$this.attr("name",$this.data("name")+String(length-1));
				//新建一行的时候，要去掉tootip效果
				this.element.find("tr:last-child").find("input").attr("value","");
				this.element.find("tr:last-child").find("img").attr("src",this.element.find("tr:last-child").find("img").data("src"));
				this.element.find("tr:last-child").find("textarea").html("");
				this.element.find("tr:last-child").find("div.tooltip").remove();
				this.element.find("tr:last-child").find("input.verify_err").each(function(){
					$(this).removeClass("verify_err");
				});
				$(document).trigger('table',this);
				return this;
			}
		},

	/**
	 * delRow : 删除一行
	 * @params id  根据id删除
	 */
		delRow :function(id,callback){
			$('.table').find('tr').each(function() {
				if($(this).attr("id") == id){
					$(this).remove();
				}
			});
			callback();	
			return this;
		},

	/**
	 * setRowStyle : 设置某行的样式
	 * @params id  根据id使某行保持选中
	 * @params style  selected,forbidden,normal
	 */
		setRowStyle :function(id,style){
			$('.table').find('tr').each(function() {
				if($(this).attr("id") == id){
					if(style == "selected" || style == "forbidden" || style == "normal"){
						var curStyle = $(this).attr("class");
						if(curStyle != 'undefined'){
							$(this).removeClass(curStyle);
						}
						if(style != "normal"){
							$(this).addClass(style);
						}														
					}	

				}
			});
			return this;
		},
		//设置选中项
		setSelected : function ( obj, op ) {
			//支持数组
			if( Array.isArray(obj)  ){
				for (var key in obj) {
					this.setSelected( obj[key], op );
				};
				return;
			}
			if( obj instanceof jQuery ){
				var that = this;
				obj.each(function (item) {
					that.setSelected( obj[item], op );
				});
				return;
			}
			if( op ){
				for (var key in this._selected ){
					if ( this._selected[key] == obj ){
						return;
					}
				}
				this._selected.push(obj)
			}
			else {
				for (var key in this._selected ){
					if ( this._selected[key] == obj ){
						this._selected[key] = this._selected[this._selected.length-1];
						this._selected.pop();

					}
				}
			}
		},
		//获取选中项
		getSelected : function () {
			return this._selected;
		}
	};

	var old = $.fn.table;
	$.fn.table = function(){
		this.each(function () {
			var $this = $(this),
				data = $this.data("table")
				;
			if (!data) {
				$this.data("table", data = new Table($(this)));
			}

			$(document).trigger('table',data);
		});
	}
	$.fn.table.noConflict = function () {
		$.fn.table = old;
		return this;
	}

}(jQuery);

/********************************************************
 *		  Pagination 分页 Weikai@2015/3/26			*
 ********************************************************/
!function ($) {
	var Pagination = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.pagination.defaults, options);

		this.$pageshow = this.$element.find('[data-pages]');
		this.init();

	}
	Pagination.prototype.init = function () {

		if (this.options.item_count === 0) {
			this.options.item_count=1;
		}
		if (this.options.item_count === null) {
			this.options.item_count=1;
		}
		if (this.options.max_page === null) {
			var item_count=parseInt(this.options.item_count,10);
			var item_everypage=parseInt(this.options.item_everypage,10);
			this.options.max_page = Math.ceil(item_count/item_everypage);
			if(this.options.max_page == 0)this.options.max_page++;
		}
		if (this.$pageshow.data('current-page') !== undefined && isNumber(this.$pageshow.data('current-page'))) {
			this.options.current_page = this.$pageshow.data('current-page');
		}

		this.updatePage(true);

		//保留指针
		var that = this;
	}

	Pagination.prototype.setPage = function (page, prevent_paged) {
		//传入参数是空的时候 返回当前页
		if (page === undefined) {
			return this.options.current_page;
		}

		var current_page = parseInt(this.options.current_page, 10),
			max_page = parseInt(this.options.max_page, 10);
		if (isNaN(parseInt(page, 10))) {
			if(page=='prev')
			{
				page=current_page-1;
			}
			if(page=='next')
			{
				page=current_page+1;
			}
		}
		page = parseInt(page, 10)
		if (isNaN(page) || page < 1 || page > max_page) {
			return false;
		}

		this.options.current_page = page;
		this.$pageshow.data('current-page', page);
		this.updatePage(prevent_paged);
	}

	//bool prevent_paged 表示是否禁止回调函数调用
	Pagination.prototype.updatePage = function (prevent_paged) {
		var current_page = parseInt(this.options.current_page, 10);
		var max_page = parseInt(this.options.max_page);
		
		this.$pageshow.text('页数' + current_page + '/' + max_page);

		//检测左右翻页按钮是否可用
		//console.log(this.$element.find('button'))
		var $button_list = this.$element.find('.btn');
		$button_list.removeClass('btn-forbidden');
		this.$element.find('.pages').css('display', 'inline-block');
		$button_list.css('display', 'inline-block');
		if (current_page == 1) {
			$button_list.eq(0).addClass('btn-forbidden');
		}
		if (current_page == max_page) {
			$button_list.eq(1).addClass('btn-forbidden');
		}
		// //隐藏右边的 页码显示和左右翻页按钮
		// if (max_page == 1) {
		// 	this.$element.find('.pages').css('display','none')
		// 	$button_list.css('display', 'none');
		// }

		if (prevent_paged !== true) {
			this.options.paged(current_page);
		}
	}

	var old = $.fn.pagination;

	$.fn.pagination = function (option) {
		return this.each(function () {
			var $this = $(this)
				, data = $this.data('pagination')
				, options = typeof option == 'object' && option
			if (!data)
				$this.data('pagination', (data = new Pagination(this, options)));

		})
	}
	$.fn.pagination.defaults = {
		current_page: 1,
		item_count:null,//要显示的 item数
		max_page: null,//不用传入的 调用时传入上面的item_count即可
		item_everypage: 10,//10 20 50 100
		paged: function (curr) { }//回调函数
	}

	$.fn.pagination.Constructor = Pagination;

	$.fn.pagination.noConflict = function () {
		$.fn.pagination = old;
		return this;
	}
}(jQuery);

/********************************************************
 *		  Toast 信息展示框 winys@2015/4/17				*
 ********************************************************/
!function ($) {

 	var Toast =function (type, message, manual, name) {

 		this.type = type;
 		this.message = message;
 		this.manual = manual;
 		this.name = name;

 		//调整参数
 		if( $.CONFIG.Toast.statType.join(",").indexOf(this.type)==-1 ){
 			this.manual = this.message;
 			this.message = this.type;
 			this.name = manual || $.CONFIG.Toast.defaultType;
 			this.type = $.CONFIG.Toast.defaultType;
 		}
 		this.message = this.message || '';

 		return this._init();
 	}

 	Toast.prototype = {
 		_init : function () {
 			this.$div = $("<div class='toast'>"+this.message+"</div>");

			this.$div.addClass(this.type);
			$("body").append(this.$div);
			this.$div.css("left", ($("body").width()-parseInt($(".toast").width(),10))/2);
			this.$div.css("top", ($("body").height()-parseInt($(".toast").height(),10))/2);

			this.$div.data("id",this.name);

			if( !this.manual ){
				this.run();
			}
 		},
 		run : function  () {
 			this.$div.fadeIn($.CONFIG.Toast.animTime,function(){
					var $this = $(this);
					setTimeout(function(){
						$this.fadeOut($.CONFIG.Toast.animTime,function(){
						$this.remove();
					});
					},$.CONFIG.Toast.delay);
				});	
		},
		display : function (delay) {
			this.$div.fadeIn(delay||$.CONFIG.Toast.animTime);
			return this;
		},
		hide : function(delay){
			this.$div.fadeOut(delay||$.CONFIG.Toast.animTime,function(){
				$(this).remove();
			});
			return this;
		}
	}

	$.toast = function(state,message,manual,name){
		return new Toast(state, message, manual, name);
	}

	$.toast.remove = function (name) {
		var target = ".toast" + (name?" [data-id="+name+"]":"");
		$(target).remove();
	}
}(jQuery);

/********************************************************
 *		  seekbar 滑块 winys@2015/5/16   				*
 ********************************************************/
!function ($) {

 	var Seekbar = function (element) {
 		var config = $.CONFIG.Seekbar,
 			data = element.data()
 			;

 		this.element = element;
 		this.style = data.style || config.style;
 		this.min = data.min === undefined ? config.min : data.min ;
 		this.max = data.max === undefined ? config.max : data.max ;
 		this.step = data.step === undefined ? config.step : data.step ;
 		this.value = data.value === undefined ? config.value : data.value ;
 		this.diff = this.max - this.min;

 		this._init();

 		return this;
 	}

 	Seekbar.prototype =  {
 		_init : function () {
 			this._build();

 			this.picker.on({
				mousedown: $.proxy(this.mousedown, this)
			});
 			this.setValue( this.value );	
 		},
 		_build : function() {
 			this.picker = $('<div class="seekbar">'+
 				'<div class="seekbar-track">'+
 					'<div class="seekbar-selection"></div>'+
					'<div class="seekbar-handle"></div>'+
 				'</div>'+
 			'</div>').insertBefore(this.element);

 			switch ( this.style ){
 				case "vertical":
 					this.picker
 						.addClass("seekbar-vertical");
					this.stylePos = 'top';
					this.mousePos = 'pageY';
					this.sizePos = 'offsetHeight';
				break;
 					break;
 				default : 
 					this.picker
 						.addClass("seekbar-horizontal");
 					if(this.element.width()){
 						this.picker.css("width",this.element.width());
 					}
 					this.stylePos = 'left';
					this.mousePos = 'pageX';
					this.sizePos = 'offsetWidth';
					break;
 			}

 			this._layout();
 			if(this.element.data("width"))
 				this.element.css("width",this.element.data("width"));
 			else
 				this.element.hide();
 		},
 		_layout : function () {
 			var selectionEl = this.picker.find('.seekbar-selection'),
 				selectionElStyle = selectionEl[0].style,
 				handleEl = this.picker.find('.seekbar-handle'),
 				handleElStyle = handleEl[0].style,
 				percentage = this.percentage
				;
			handleElStyle[this.stylePos] = percentage+'%';
 			if (this.type == 'vertical') {
				selectionElStyle.height = Math.abs(percentage) +'%';
			} else {
				selectionElStyle.width = Math.abs(percentage) +'%';
			}
 		},
 		setValue : function ( value ) {
 			this.value = value;
 			//防止溢出
 			this.value = Math.max(this.min,this.value);
 			this.value = Math.min(this.max,this.value);
 			//设置input支持表单提交 并触发change事件
 			this.element.val(value);
 			this.element.trigger("change");
 			this.percentage = (value-this.min)*100/this.diff;
 			this._layout();
 			$(document).trigger("seekbarchange",{
 				seekbar : this
 			});
 		},
 		//根据Type 决定是返回数字还是百分比
 		getValue : function ( type ) {
 			if (type = "percentage") {
 				return (this.value*100/this.diff);
 			}
 			return this.value;
 		},
 		mousedown : function  (event) {
 			var offset = this.picker.offset(),
				size = this.picker[0][this.sizePos],
				value = event[this.mousePos] - offset[this.stylePos]
				;
				this.percentage = Math.max(0, Math.min(100, value*100/size));
				this._layout();
				$(document).on({
					mousemove: $.proxy(this.mousemove, this),
					mouseup: $.proxy(this.mouseup, this)
				});
 		},
 		mousemove : function (event) {
 			var offset = this.picker.offset(),
				size = this.picker[0][this.sizePos],
				value = event[this.mousePos] - offset[this.stylePos]
				;
 			this.percentage = Math.max(0, Math.min(100, value*100/size));
 			this._layout();
 		},
 		mouseup : function(event) {
 			$(document).off({
					mousemove: this.mousemove,
					mouseup: this.mouseup
			});
			//计算Value值
			var val = (this.min + Math.round((this.diff * this.percentage/100)/this.step)*this.step);
			this.setValue(val);
			$(document).trigger("seekbarchange",{
 				seekbar : this
 			});
 		}
 	};

 	var old = $.fn.Seekbar;
	$.fn.seekbar = function(){
		return this.each(function () {
			var $this = $(this),
				data = $this.data('Seekbar')
				;
			if (!data)
				$this.data('Seekbar', (data = new Seekbar($this)));
		});
	}

	$.fn.seekbar.noConflict = function () {
		$.fn.seekbar = old;
		return this;
	}
}(jQuery);

/********************************************************
 *		  Datediv 自定义日期表格 winys@2015/6/4           *
 ********************************************************/
!function ($) {
 	var Datediv = function ( element, data, year, month ) {
 		var config = $.CONFIG.Datediv;
 		this.data = data||[];
 		this.element = element;
 		this.year = year ? year : config.year;
 		this.month = month ? month : config.month;
 		this.time = new Date(this.year, this.month);
 		this.timestr = this.time.getTime();
 		this._init();
 	}

 	Datediv.prototype = {
 		_init : function() {
 			this._build();

 		},
 		_build : function() {
 			var table = $("<table class='table table-bordered' data-table></table>"),
 				config = $.CONFIG.Datediv,
 				tempHtml = ""
 				;
 			this.element.addClass("Datediv");

 			
			tempHtml = "<thead><th class='left' data-prev><i class='fa fa-chevron-left'></i></th><th class='date_month'>"
				+this.time.getFullYear()+" / " + (this.time.getMonth()+1)
				+"</th><th  class='right' data-next><i class='fa fa-chevron-right'></i></th></thead><tr><td colspan='3' class='date_days'>";
			for ( var key in this.data ){
				var that = this;
				tempHtml += config.tmpl.replace(/@(\w*)/g,function (v){
					var data = $.extend(that.data[key],that);
					data.time = new Date(data.year,data.month,data.day);
					data.timestr = data.time.getTime();
					return data[v.slice(1)];
				});
			}
			
			tempHtml += "</td></tr>"
			var temp$ = $(tempHtml);
			table.append(tempHtml);
			this.element.html(table);
		},
 		setDate : function (inc) {
 			this.month += inc;
 			this.time = new Date(this.year, this.month);
 			this.timestr = this.time.getTime();
 			this.year = this.time.getFullYear();
 			this.month = this.time.getMonth();
 			this._build();
 			$(document).trigger("Datediv_datechange",this);
 		},
 		reset : function (data) {
 			this.data = data;
 			this._build();
 		}
 	};

 	var old = $.fn.Datediv;
	$.fn.datediv = function(arg, year, month){
		return this.each(function () {
			var $this = $(this),
				data = $this.data('Datediv')
				;
			if (!data)
				$this.data('Datediv', (data = new Datediv($this, arg, year, month)));
		});
	}

	$.fn.datediv.noConflict = function () {
		$.fn.datediv = old;
		return this;
	}
	$(document).on("click",".Datediv [data-prev]",function(){
		var $this = $(this),
			datediv = $this.closest("[data-datediv]").data("Datediv")
			;
		datediv.setDate(-1);
	}).on("click",".Datediv [data-next]",function(){
		var $this = $(this),
			datediv = $this.closest("[data-datediv]").data("Datediv")
			;
		datediv.setDate(1);
	}).on("click",".daydiv",function(){
		var $this = $(this)
			;
		$this.siblings().removeClass("active");
		$this.addClass("active");
	});
}(jQuery);

/********************************************************
 *		  Step 流程 winys@2015/6/8		        *
 ********************************************************/
!function ($) {
	var Step = function (element) {
		this.element = element;
		this.index = 0;
		this._build();
		this._init();
	};
	Step.prototype =  {
		_build : function () {
			var steps = this.element.find(".steps"),
				length = steps.find(".step_item").length,
				stepwidth = 0
				;
			this.count = length;
			steps.css("width",100*length+"%");
			stepwidth = Math.floor(steps.width()/length-1);
			this.item_width = stepwidth;
			steps = steps.find(".step_item").css("width",stepwidth+"px");
		},
		_init : function () {
			this.setIndex();
		},
		setIndex : function( index ) {
			this.index = typeof index == "number"?index:this.index;
			var lis = this.element.find("li");
			lis.removeClass("current");
			$(lis[this.index]).addClass("current");
			this.element.find(".steps").animate({marginLeft:-1*this.index*this.item_width});
		},
	};
	var old = $.fn.step;
	$.fn.step = function(){
		return this.each(function () {
			var $this = $(this),
				data = $this.data('step')
				;
			if (!data)
				$this.data('step', (data = new Step($this)));
		});
	}

	$.fn.datediv.noConflict = function () {
		$.fn.step = old;
		return this;
	}
	$(document).on('click','[data-prev]',function () {
		var $this = $(this),
			data = $this.closest("[data-step]").data("step"),
			elems= $this.closest(".step_item").find("[data-verify]");
		if(!data)return;
		// 防止tooltip跑走
		for(var key in elems){
			if(typeof elems[key] == "function") continue;
			if($(elems[key]).attr("disabled") == "disabled") continue;
			$(elems[key]).blur();
		}
		data.setIndex(data.index-1);
	}).on('click','[data-next]',function () {
		var $this = $(this),
			data = $this.closest("[data-step]").data("step"),
			elems= $this.closest(".step_item").find("[data-verify]");//step_item
		if(!data)return;
		for(var i=0;i< elems.length;i++){
			if(typeof elems[i] == "function") continue;
			if($(elems[i]).attr("disabled") == "disabled") continue;
			$(elems[i]).blur();
			var err = $this.data("err");
			if(err>0){
				$.toast("error","提交信息不完整或格式错误");
				return;
			}
		}
		data.setIndex(data.index+1);
	})
}(jQuery);
/********************************************************
 *		  Optionbtn 按钮选项组 winys@2015/6/8		        *
 ********************************************************/
!function ($) {
	var Optionbtn = function (element,name,display,value) {
		this.element = element;
		this.length = this.element.find("li").length;
		this.value = value;
		this.name = name;
		this.display = display;

		this._init();
	};
	Optionbtn.prototype =  {
		_init : function () {
			this._build();
		},
		_build : function () {
			this.element.width("100%");
			if(this.display == "inline"){
				this.element.find("li").addClass("inline");
			}
			//添加input 实现表单化
			this.input = $("<input id='"+this.name+"' name='"+this.name+"' type='hidden'>");
			this.element.append(this.input);
		},
		setValue : function( value ) {
			this.value = value;
			this.input.val(this.value);
			this.input.trigger("change");
		}
	};
	var old = $.fn.optionbtn;
	$.fn.optionbtn = function(){
		return this.each(function () {
			var $this = $(this),
				data = $this.data('optionbtn')
				;
			if (!data){
				$this.data('optionbtn', (data = new Optionbtn($this, 
					$this.data("name"), $this.data("display"), $this.data("value"))));
				//默认选择第一个
				$($this.find("li")[0]).trigger("click");
			}
		});
	}

	$.fn.datediv.noConflict = function () {
		$.fn.optionbtn = old;
		return this;
	}

	$(document).on("click","[data-optionbtn] li",function () {
		var $this = $(this),
			data = $this.closest("[data-optionbtn]").data("optionbtn"),
			value = $this.data("value")
			;
		$this.siblings().removeClass("selected");
		$this.addClass("selected");
		data.setValue(value);
	});
}(jQuery);

/********************************************************
 *		  Tablekit 表格套件 winys@2015/6/19		        *
 ********************************************************/

!function ($) {
 	var Tablekit = function (element, options, url, target) {
 		this.element = element;
 		this.options = options;
 		this.url = url;
 		this.target = target;
 		this._init();
 	}

 	Tablekit.prototype = {
 		_init : function () {
 			//获取 3 个子组件宿主元素
 			this.$table = this.element.find("[data-table]");
 			this.$pagination = this.element.find("[data-pagination]");
 			this.$toolbar = this.element.find("[data-toolbar]");

 			//构建主键
 			this._build();
 		},
 		_build : function () {
 			if(this.$pagination.length != 0)
 				this.$pagination.pagination(this.options);
 			else 
 				this.$table.table();

 			$(document).trigger('tablekit_change',this);
 		},
 		setOptions : function (options) {
 			for (var key in options)
 				this.options[key] = options[key];
 			var pagination = this.$pagination.data("pagination");
			pagination.options.item_everypage = this.options.item_everypage||10;
 			pagination.options.max_page =  Math.ceil(this.options.item_count/pagination.options.item_everypage);
 			pagination.options.item_count = this.options.item_count;
 			pagination.options.current_page = this.options.current_page;

 			pagination.setPage(pagination.options.current_page);
 		},
 		//pagination中更新options 
 		updateOptions : function () {
 			var pagination = this.$pagination.data("pagination");
 			for (var key in pagination.options ){
 				this.options[key] = pagination.options[key];
 			}
 		}
 	};

 	var old = $.fn.tablekit;
	$.fn.tablekit = function(options){
		return this.each(function () {
			var $this = $(this),
				data = $this.data('tablekit')
				;
			if (!data){
				$this.data('tablekit', (data = new Tablekit(
					$this, 
					options, 
					$this.data("url"), 
					$this.find("[data-table]")
				)));
			}
		});
	}

	$.fn.datediv.noConflict = function () {
		$.fn.tablekit = old;
		return this;
	}

	//全选绑定事件
	$(document).on("click.data-api.table.checkall","[data-tablekit] [data-checkall] input",function  () {
		var tablekitEl = $(this).closest("[data-tablekit]"),
			tablekit = tablekitEl.data("tablekit"),
			$this = $(this).closest("[data-checkall]"),
			$table = tablekit.$table,
			trs = $table.find("tr"),
			table = $table.data("table")
			;

		if($(trs[0]).find("th").length>0)trs = trs.slice(1);
		tablekitEl.find('[data-check] input').prop('checked',tablekitEl.find('[data-checkall] input').prop('checked'));

		table.setSelected(trs,$(this).prop('checked') );

		//将结果绑定到data-group
		tablekitEl.find("[data-group]").each(function (item) {
			$(this).data("fdata",$(this).data("name")+"="+ table.getSelected().map(function(item){
				return $(item).attr("id");
			}).toString());

			if(table.getSelected().length > 0)
				$(this).removeClass("btn-forbidden");
			else
				$(this).addClass("btn-forbidden");
		});

		$this.trigger("table_check",table);

	});
	//单复选框绑定事件
	$(document).on("click.data-api.table.check","[data-tablekit] [data-check] input",function  (e) {
		var $this = $(this),
			tablekitEl = $this.closest("[data-tablekit]"),
			//tr = $this.closest("tr")[0],
			trs=tablekitEl.find('[data-table] [data-check]').closest('tr'),
			trsArr=[],		
			table = $this.closest("[data-table]").data("table")
			;

		tablekitEl.find('[data-checkall] input').prop('checked',$('[data-check] input:checked').length == $('[data-check] input').length);
		if(typeof $this.attr('checked')=='string') $this.removeAttr('checked').prop('checked',false); //确定选中该行是否有checked属性，有则设置false
		// 
		trs.each(function(index,element){ //遍历所有tr
				var elem=$(element).find('[data-check] input');
				
				if(typeof elem.attr('checked')=='string'){				
					elem.removeAttr('checked').prop('checked',true);					
				}
				if (elem.prop('checked') ==true) {
					trsArr.push(element);
				};				
							 	
		});		
		//table.setSelected( trs, $this.prop('checked'));
		//将结果绑定到data-group
		tablekitEl.find("[data-group]").each(function (item) {
			var name = $(this).data("name");
			$(this).data("fdata",name+"="+ trsArr.map(function(item){ //trsArr=table.getSelected()
				return $(item).attr("id");
			}).toString());
			
			if(trsArr.length > 0) //trsArr=table.getSelected()
				$(this).removeClass("btn-forbidden");
			else
				$(this).addClass("btn-forbidden");
		});

		$this.trigger("table_check",table);

		e.stopPropagation();
	});

	//pagination事件绑定
	$(document).on('click', '[data-tablekit] [data-pagination] a.btn', function (event) {
		var $self = $(this),
			tablekit = $(this).closest("[data-tablekit]").data("tablekit"),
			pagination = $self.closest('[data-pagination]').data("pagination")
			;
		if ($self.hasClass('btn-forbidden')) {
			return false;
		}
		event.preventDefault();
		if(typeof pagination=="string")
			return;
		pagination.setPage($self.data('action'),true);
		tablekit.updateOptions();

		$(document).trigger('tablekit_change',tablekit);
	});

	$(document).on('change', '[data-tablekit] [data-pagination] select', function (event) {
		var $self = $(this),
			tablekit = $(this).closest("[data-tablekit]").data("tablekit"),
			item_everypage = $self.find('option:selected').text(),
			max_page = Math.ceil(tablekit.options.item_count / item_everypage)
			;
		event.preventDefault()
		tablekit.setOptions({
			item_everypage: item_everypage,
			max_page : max_page,
			current_page : 1
		});

		$(document).trigger('tablekit_change',tablekit);
	});

	//toolbar绑定事件
	$(document).on('keyup change','[data-tablekit] [data-setOption]',function () {
		var $this = $(this),
			fdata=$this.data('fdata'),// 2015.12.15加fdata
			option =$.CONFIG.getFdata(fdata) || {},
			key = $this.data("name"),
			val = $this.data("value") || $this.val(),
			tablekit = $this.closest("[data-tablekit]").data("tablekit")
			;
		option[key] = val;
		option['current_page']=1;
		tablekit.setOptions(option);
		$(document).trigger('tablekit_change',tablekit);
	});
	$(document).on('click','[data-tablekit] [data-addrow]',function () {
		var $this = $(this),
			table = $this.closest("[data-tablekit]").children('[data-table]').data("table")
			;
		table.newRow();
	});
	$(document).on('click','[data-tablekit] [data-remove]',function () {
		var $this = $(this),
			tr = $this.closest("tr"),
			length=$this.closest("[data-table]").find("tr").length,
			minlength=parseInt($this.closest("[data-tablekit]").data("minnum"),10)||1;//最小行数，默认为1
		if(length<=1||length<=minlength){//data("minnum")设定了列表最小行数，小于等于这个行数，不允许删除
			$.toast("error","此行不允许删除");
			return;
		}
		if(length>minlength){//如果行数不大于最小行数，则不允许删除
			var trheight = tr.height();
			var nextalltr = tr.nextAll("tr");
			var errmes = nextalltr.find('[class="tooltip fade bottom in"]');
			errmes.each(function(){
				var top = parseInt($(this).css("top"))-trheight;
				$(this).css({"top":top+"px"});
			});
			tr.remove();
			$.toast("success","删除成功");
		}
		
	});
 }(jQuery);
/********************************************************
 *		  Cascade 级联下拉框 winys@2015/7/20		        *
 ********************************************************/
!(function($){
	var Cascade = function  ( element ) {
		this.element = element;
		this.curnode = 0;
		return this;
	}

	Cascade.prototype = {		
		setCurnode : function (val) {
			this.curnode = val;
			$(document).trigger("CascadeChange",this);
		}
	};

	var old = $.fn.cascade;
	$.fn.cascade = function(){
		return this.each(function () {
			var $this = $(this),
				data = $this.data('cascade')
				;
			if (!data){
				$this.data('cascade', (data = new Cascade(
					$this
				)));
				//默认选择第一个
				if($this.closest("[data-cascade]").data("default") == undefined){
					$($this.closest("[data-cascade]").find("[data-node]")[0]).trigger("change");
				}
			}

		});
	}

	$.fn.cascade.noConflict = function () {
		$.fn.cascade = old;
		return this;
	}

	//监听事件
	$(document).on("change","[data-cascade] [data-node]", function  () {
		var $this = $(this),
			data = $this.closest("[data-cascade]").data("cascade"),
			curnode = $this.data("node")
			;
		if( !data ){
			return;
		}
		data.setCurnode(curnode);

	});


})(jQuery);

/********************************************************
 *		  Cascadebtn 级联按钮 Effall@2015/7/21	      *
 ********************************************************/
 !(function($){
 	var Cascadebtn=function(element){
 		var data=element.data();
 		this.element = element;
		//当前改变的节点
		// this.curvalue=$(this.element.closest("[data-cascadebtn]").find("[data-node="+this.curnode+"]")).data('value');
 		this._init();

 	}
 	Cascadebtn.prototype = {
		_init : function () {
			var casbtn=this.element.closest("[data-cascadebtn]").find("[data-node]");
			casbtn.each(function(){
				var $this=$(this);
				var curvalue=$this.data('value');
				if(curvalue=="0"){
					$this.addClass('btn-forbidden');
				}else{
					$this.removeClass('btn-forbidden');
			}
			});	
 		}
	};

	var old = $.fn.cascadebtn;
	$.fn.cascadebtn = function(){
		return this.each(function () {
			var $this = $(this),
				data = $this.data('cascadebtn')
				;
			if (!data){
				$this.data('cascadebtn', (data = new Cascadebtn(
					$this
				)));
			}

		});
	}

	$.fn.cascadebtn.noConflict = function () {
		$.fn.cascadebtn = old;
		return this;
	}

	//监听事件
	$(document).on("click","[data-cascadebtn] [data-node]", function  () {
		var $this = $(this),
			data = $this.closest("[data-cascadebtn]").data("cascadebtn"),
			curnode = $this.data("node")
			;

	});
})(jQuery);

// select
!(function($){
	var Select = function  ( element ) {
		this.element = element;
		this.self = $(element);
		this.url = $(element).data('url');
		this._init();
	};

	Select.prototype = {	
		_init : function () {
			var url = this.url;
			var self = this.self;
			$.Ajax.postData({
				url:$.Depath.getURL(url)
			},
			"nopath",
			function (data) {
				var tdata = data.list;
				var tmpl = '';
				for(var i in tdata){
					tmpl = tmpl+'<option value="'+tdata[i].id+'">'+tdata[i].name+'</option>';
				}
				self.html(tmpl);
			},
			false);
		}
	};

	var old = $.fn.select;
	$.fn.select = function(){
		return this.each(function () {
			var $this = $(this),
				data = $this.data('select')
				;
			if (!data){
				$this.data('select', (data = new Select($this)));
			}
		});
	}
	$.fn.select.noConflict = function () {
		$.fn.select = old;
		return this;
	};

})(jQuery);


!(function($){
	var Birthday = function  ( element ) {
		this.element = element;
		this.year = $(this.element.find("[data-name='year']"));
		this.month = $(this.element.find("[data-name='month']"));
		this.day = $(this.element.find("[data-name='day']"));
		this.myyear = this.year.data("value");
		this.mymonth = this.month.data("value");
		this.myday = this.day.data("value");
		this.beginyear = this.year.data("begin");
		this._init();
	};

	Birthday.prototype = {	
		_init : function () {
			var	myDate = new Date(),
				nowyear = myDate.getFullYear()
				;

			if(this.beginyear === undefined) this.beginyear = 1900;
			if(this.myyear !== undefined && this.mymonth !== undefined && this.myday !== undefined){
				this.year.html(strOption(this.beginyear,nowyear,this.myyear));
				this.month.html(strOption(1,12,this.mymonth));
				this.day.html(strOption(1,31,this.myday));
			}else {
				this.year.html(strOption(this.beginyear,nowyear));
				this.month.html(strOption(1,12));
				this.day.html(strOption(1,31));
			}
		}
	};

	var old = $.fn.birthday;
	$.fn.birthday = function(){
		return this.each(function () {
			var $this = $(this),
				data = $this.data('birthday')
				;
			if (!data){
				$this.data('birthday', (data = new Birthday(
					$this
				)));
			}
		});
	}
	$.fn.birthday.noConflict = function () {
		$.fn.birthday = old;
		return this;
	};

	function strOption(begin,end,now) {
			var str = "";
			var now = parseInt(now);
			for(var i = begin;i <= end;i++ ){
				if(i == now){
					str += '<option value="'+i+'" selected>'+i+'</option>';
				} else {
					str += '<option value="'+i+'">'+i+'</option>';
				}
			}
			return str;
	}

	function isrun(year){
		var year = year;
		var flag = false;
		if( (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) flag = true;
		return flag;
	}

	$(document).on('change','[data-birthday] [data-name="year"],[data-birthday] [data-name="month"]',function(){
		var $this = $(this),
			newyear = $this.closest('[data-birthday]').find('[data-name="year"]').val(),
			newmonth = $this.closest('[data-birthday]').find('[data-name="month"]').val(),
			newday = $this.closest('[data-birthday]').find('[data-name="day"]')
			; 
		if(newmonth == 1 || newmonth == 3 || newmonth == 5 || newmonth == 7 || newmonth == 8 || newmonth == 10 ||newmonth == 12){
	 		$(newday).html(strOption(1,31));
	 	}else if(newmonth == 4 || newmonth == 6 || newmonth == 9 || newmonth == 11){
	 		$(newday).html(strOption(1,30));
	 	}else if(newmonth == 2){
	 		if(isrun(newyear)){
	 			$(newday).html(strOption(1,29));
	 		}else {
	 			$(newday).html(strOption(1,28));
	 		}
	 	}
	});
})(jQuery);
 
