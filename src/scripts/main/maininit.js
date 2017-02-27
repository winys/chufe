!function(){
	//页面的导入效果
	var pageloadbar = $("#load_page .load_bar").loadbar({
		width:"300px",
		height:"10px",
		speed : 700,
		auto : false
	}).loadbar("setValue",40);
	//初始化页面
	$.Ajax.when('GET',
		[	
			{url:$.Depath.getURL("Index/menu")},		
			{url:$.Depath.getURL("Index/User")},		
			{url:$.Depath.getURL("Index/log")},
		],function(data){	
			
			//检查是否具有权限
			if(data[1]['status'] == 0){
				$.cur_user = data[1]['data'];
			}
			else
				window.location.href=$.CONFIG.userCenter;
				
			$.CONFIG.MenuView.menuArr = data[0];
			$(".chu_menu").menuView(true);
			if( window.location.hash == '')$( "[data-path='"+$.CONFIG.MenuView.index+"']" ).trigger("click");


			$(".actionbar").actionbar().setTitle("user",$.cur_user.uname).setContent("user","<ul class='actionbar_user'><li class='user_item logout'><i class='fa fa-sign-out'></i>&nbsp;&nbsp;退出登录</li></ul>");

			$(".breadcrumb").breadcrumb();
			$(".timetree").timetree("操作日志",data[2])
					
			$(document).trigger("Depath");

			pageloadbar.loadbar("finish", function () {
				$("#load_page").animate({height:"0"},"normal",function  () {
					$("#load_page").remove();
					$.toast("success","初始化成功！");
				});
			});

			window.addEventListener("message", function(event) {
					try {
						var externalCall = JSON.parse(event.data);
						marvin.onReady(function() {
							marvin.sketcherInstance[externalCall.method].apply(marvin.sketcherInstance, externalCall.args);
						});
					} catch (e) {
						console.log(e);
					}
				}, false);
			
	});


	//用户登出事件
    $(document).on('click','.logout',function  () {
    	$.Ajax.postData({url:$.Depath.getURL("Index/logout")},function(data){
    		if(data.status == 0){
    			alert("logout");
    		}
    	});
    });

    //监听自定义事件
    $(document).on("Init",function  (event, data) {
		//清除所有实时请求
		$.Constanty.clear();
		$.toast.remove();

		$.pagedata = data;
		//检查数据

		//data-bind 数据绑定
		$('[data-bind]').each(function () {
			var $this = $(this),
				source = $this.data("bind")
				;
			$(document).on('change',source,function () {
				//$this.val($(this).val()||$(this).text());
				$this.data("sqarql",$(this).val()||$(this).text());
				$this.text($(this).text()||$(this).val());
			});
		});
		//检查数据
		$.Checkdata.run(data);
		$('[data-tooltip]').tooltip();
		$('[data-loadbar]').loadbar();
		$('[data-tabs]').tabs();		
		$('[data-multable').multable();
		if(data && data.data){
		var date = new Date();
			$('[data-datediv]').datediv(data.data,date.getFullYear(),date.getMonth());
		}
		if(data && data.data && data['data'].item_count != undefined){
			$('[data-tablekit]').tablekit({
				item_count:data['data'].item_count
			});
		}
		else{
			$('[data-table]').table();
		}
		$('[data-seekbar]').seekbar();
		if(data && data.data)
			$('[data-treeview]').menuView(true,'treeview',data.data);
		$('[data-step]').step();
		$('[data-optionbtn]').optionbtn();
		$('[data-cascade]').cascade();
		$('[data-cascadebtn]').cascadebtn();
		$('[data-select]').select();
		$('[data-dropdown]').dropdown();
	});

	//table初始化事件
	$(document).on("table",function  (event, table) {
		var $el = table.element.closest("[data-tablekit]");
		if($el.length == 0)
			$el = table.element.closest("[data-table]");
		$el.find("[data-group]").addClass("btn-forbidden");
		$el.find("[data-itemid]").each(function  () {
			var $this = $(this);
			$this.data("fdata", {
				id : $this.closest("tr").attr("id")
			});
		});
		$el.find("[data-detail]").each(function  () {
			var $this = $(this);
			$this.data("fdata", {																		
				id : $this.closest("tr").attr("id")
			});
		});
		$el.find("[data-edit]").each(function  () {
			var $this = $(this);
			$this.data("fdata", {
				id : $this.closest("tr").attr("id")
			});
			$this.data("success",function () {
				var tablekit = $this.closest("[data-tablekit]").data("tablekit");
				if (tablekit) $(document).trigger('tablekit_change',tablekit);
			});
		});
		$el.find("[data-remove]").each(function  () {
			var $this = $(this);
			$this.data("fdata", {
				id : $this.closest("tr").attr("id")
			});
		});
		$el.find("[data-add]").each(function  () {
			var $this = $(this);
			$this.data("success",function () {
				var tablekit = $this.closest("[data-tablekit]").data("tablekit");
				if (tablekit) $(document).trigger('tablekit_change',tablekit);
			});
		});
		$el.find("[data-delete]").each(function  () {
			var $this = $(this);
			$this.data("fdata", {
				id : $this.closest("tr").attr("id")
			});
			$this.data("success",function () {
				var tablekit = $this.closest("[data-tablekit]").data("tablekit");
				if(tablekit == undefined){
					var table = $this.closest("[data-table]").data("table");
					table.delRow($this.closest("tr").attr("id"),function(){});
				}
				else{
					if (tablekit) $(document).trigger('tablekit_change',tablekit);
				}
			});
		});
		$el.find("[data-classify]").each(function  () {
			var $this = $(this);
			var devicetype = null;
			$(document).on("click","[data-classifysub]",function(){
				devicetype = $(this).closest("form").find('[data-classifyid]').val();
			});
			$this.data("success",function () {
				$this.closest("[data-tablekit]").find("[data-optionbtn] [data-value='"+devicetype+"']").trigger("click");
			});
		});
		//设置toolbar的宽度
		var width = $el.find("[data-table]").css("width");
		$el.find("[data-toolbar]").css("width",width);
		
		$("[data-table][data-formitem]").data("formitem",function () {
			var $this = $(this),
				trs = $this.closest("[data-table][data-formitem]").find("table tbody tr"),
				formdata = {}
				;
			trs.each(function(key){
				formdata[key] = {};
				$(trs[key]).find("[data-name]").each(function (item) {
					var name = $(this).data("name");
					var val = $(this).val();
					formdata[key][name] = val;
				});
			});

			return JSON.stringify(formdata);
		});
		$("[data-stepformitem][data-formitem]").data("formitem",function () {
			var $this = $(this),
				formitems=$this.find(".formitem"),
				formdata = {}
				;
			formitems.each(function(key){
				formdata[key] = {};
				$(this).find("[data-name]:not([data-formnames])").each(function (item) {
					var name = $(this).data("name");
					var val = $(this).val();
					formdata[key][name] = val;
				});
				//单选按钮
				$(this).find("[type='radio']:checked").each(function(){
					var name=$(this).attr("name");
					var val=$(this).val();
					formdata[key][name] = val;
				});
				//eg:添加帐户时添加设备里面的电话号码
				$(this).find("[data-formnames]").each(function(){
					var name = $(this).data("name"),
						inputs=$(this).find("[data-namesitem]"),
						arr=[];
					inputs.length>0&&inputs.each(function(){
						var value=$(this).val();
						arr.push(value);
					});
					formdata[key][name]=arr;
				});
			})
			
			return JSON.stringify(formdata);
		});
		//传入多选框选中的值
		$("[data-table][data-choice]").data("choice",function () {
			var $this = $(this),
				trs = $this.closest("[data-table]").find("table tr"),
				formdata = [],
				i = 0
				;
			trs.each(function(key){
				$(trs[key]).find("[data-name]").each(function (item) {
					if($(this).is(':checked')){
						var name = $(this).data("name");
						formdata[i++] = name;
					}
				});
			});
			return JSON.stringify(formdata);
		});
		//传入单选框选中的值
		$("[data-table][data-sigchoice]").data("sigchoice",function () {
			var $this = $(this),
				trs = $this.closest("[data-table]").find("table tr"),
				formdata = "",
				i = 0
				;
			trs.each(function(key){
				$(trs[key]).find("[data-name]").each(function (item) {
					if($(this).is(':checked')){
						formdata = $(this).data("name");
					}
				});
			});
			return formdata;
		});
		//去input不为空的值
		$("[data-table][data-formli]").data("formli",function () {
			var $this = $(this),
				inputs = $this.closest("[data-table]").find("table input"),
				formdata = {}
				;
			inputs.each(function(key){
				if($(this).val() != ""){
					var name = $(this).data("name");
					var value = $(this).val();
					formdata[name] = value;
				}
			});
			return JSON.stringify(formdata);
		});
	});

    //处理翻页（目前 翻页绑定了 Table ,需要修改）
    $(document).on('tablekit_change',function  (event,tablekit) {
    	var uri = tablekit.url || window.location.hash.slice( 1 ),
			uriprasearr = $.Depath.parse(uri),
			table_tmpl = uriprasearr["tmpl"] + "_table",
	        target = tablekit.target,
	        Url = $.Depath.getURL(uri,uriprasearr),
	        data = $.Depath.parse(window.location.hash.slice(1)).data
			;

		if(!$.pagedata || !$.pagedata["data"] || !$.pagedata["data"].table){
	    	
			$.Ajax.postData({
	    		url:Url,
	    		data : $.extend(tablekit.options,data,uriprasearr.data)
	    	},
	    	"nopath",
	    	function (data) {
	    		//获取模板
	    		var	tmpl = data["data"].table && ( window.QTMPL[table_tmpl] || window.QTMPL['table']);
                 
                if(data.status == -2){
                	$.toast("error",data.message);
                }
                 
	    		if(!tmpl) throw new Error("");
	    		tmpl = Handlebars.compile(tmpl);
	    		$(target).html(tmpl(data["data"].table));
	    		$('[data-table]').table();
	    	});
		}
		else {
			var	tmpl = $.pagedata["data"].table && ( window.QTMPL[table_tmpl] || window.QTMPL['table']);
    		if(!tmpl) throw new Error("No tmpl");
    		tmpl = Handlebars.compile(tmpl);
    		$(target).html(tmpl($.pagedata["data"].table));
    		$('[data-table]').table();
		}
    	$.pagedata = null;
    });

	$(document).on('Datediv_datechange',function (event,obj) {
		var url = obj.element.data("url")
			;
		if(!url)return;
		$.Ajax.getData({
			url : $.Depath.getURL(url),
			data : {date:obj.timestr}
		},
		'Datediv_datechange',
		function  (data) {
			if(data&&data.data)
			obj.reset(data.data);
		});
	});

	//tabs改变页面
	$(document).on("Tabsindex",function (event,tabsobj) {
		var curLi  = tabsobj.curLi,
			target = tabsobj.target,
			tmplid = tabsobj.tmpl,
			uri = curLi.data("nopath"),
			uriprasearr = $.Depath.parse(uri),
			data = $.Depath.parse(window.location.hash.slice(1)).data
			;

		if ( !target || !tmplid)
			return;
		$.toast.remove("nopath-tabs");
		$.Ajax.abort("nopath-tabs");
		$.Ajax.getData({
	    		url: curLi.data("url") || $.Depath.getURL(uri,uriprasearr),
	    		data : $.extend(data,uriprasearr.data)
	    	},
	    	"nopath-tabs",
	    	function (data) {
	    		//获取模板
	    		var	tmpl = $.CONFIG.getTMPL(tmplid);
	    		if(!tmpl) throw new Error("");
				console.log(target);
	    		$(target).html(tmpl(data));
	    		check_chart(data);
				$(document).trigger('Init');
	    	});	
	});


	$(document).on("MulTable",function(event,tablearray){
		var tableData=tablearray.obj,
			tmplids={},
			urls={},
			params=[],
			num=0,
			pagedata = $.Depath.parse(window.location.hash.slice(1)).data;
		if(!tableData){
			return;
		}
		num=tableData.length;
		if(num<=0){
			return;
		}
		for(var key in tableData){
			var uri=tableData[key].curLi.data("url");
			var uriprasearr=$.Depath.parse(uri);
			tmplids[key]=tableData[key].tmpl;
			urls[key]=$.Depath.getURL(uri,uriprasearr);
			var param={
				url:urls[key],
				data:$.extend({},pagedata,uriprasearr.data)
			};
			params[key]=param;
		}
		$.Ajax.when(params,function(data){
			for(var i=0;i<num;i++){
				if(data[i]['status']==0){
					var tmpl=$.CONFIG.getTMPL(tmplids[i]);
					if(!tmpl) throw new Error("");
					var target=tableData[i].curLi.data("panel");
	    			$("."+target).html(tmpl(data[i]["data"]["table"]));
				}
			}
		});
	});

	//处理级联关系的下拉框
	$(document)
		.on('click.bs.dropdown.data-api', '#dropdown_items1 li',function (e) {
			var id = $(this).data("id");
			$.Ajax.postData({
			url:$.Depath.getURL("Search/subClass"),
			data:{id:id}
		},function (data) {
			$('#dropdown_items2 .dropdown_items').empty();
			$('#dropdown_items3 .dropdown_items').empty();
			for(var i = 0 ;i < data.data.item_count;i++){
				$('#dropdown_items2 .dropdown_items').append("<li data-id='"+data.data.results[i]['subID']+"'>"+data.data.results[i]['subLabel']+"</li>");
			}		
		}
		);
		})
		.on('click.bs.dropdown.data-api', '#dropdown_items2 li',function (e) {
			var id = $(this).data("id");
			$.Ajax.postData({
			url:$.Depath.getURL("Search/specialSubClass"),
			data:{id:id}
			},function (data) {
			$('#dropdown_items3 .dropdown_items').empty();
			for(var i = 0 ;i < data.data.item_count;i++){
				$('#dropdown_items3 .dropdown_items').append("<li data-id='"+data.data.results[i]['scentID']+"'>"+data.data.results[i]['scentname']+"</li>");
			}		
		}
		);
		})
		.on('click.bs.dropdown.data-api', '#dropdown_items3 li',function (e) {
			var id = $(this).data("id");
			var ele = $("#tmpl_Search_relate").find('[data-tmpl]');
			ele.each(function(){
				 var args = $(this).data("nopath").split("?"),
       			     uriarr = args[0];
				var nopath =  uriarr +"?id="+id;
				$(this).data('nopath',nopath);
			});
			$("#tmpl_Search_relate").find('[data-tabs] .active').trigger("click");   //用ele表示事件不能触发，原因不明*/
		})

		

	
	
	
	//监听 dialog 目的是为了实现dialog 数据绑定 可以放在config.js里
	$(document).on("click", "[data-dialog]",function  (e) {
		var $this = $(this),
			fdata = $.CONFIG.getFdata($this.data("fdata")),
			pagedata = $.Depath.parse(window.location.hash.slice(1)).data,
			url = $this.data("url"),
			tmpl = $this.data("tmpl"),
			target = $this.closest("[data-dialog]").data("dialog")
			;
		if(!$this.hasClass('btn-forbidden')){ // 2015.12.9加判断
			e.stopPropagation();
			$.form_data = {
					"successFn" : $this.data("success"),
					"target" : target
			};
			//需要服务器数据的dialog
			if(url){
				var urlarr = $.Depath.parse(url);
				var Url = $.Depath.getURL( url,urlarr );
				var __data = $.extend(pagedata,fdata,urlarr.data);
				$.Ajax.getData({
				url:Url,
				data:__data
				},function  (data) {
					//合并本地数据和服务器数据
					data = $.extend(data,__data);
					tmpl = Handlebars.compile(QTMPL[tmpl]);
					target.setContent(tmpl(data));
					$(document).trigger("Init",data);
				});
			}
			//不需要服务器数据的dialog
			else{
				tmpl = Handlebars.compile(QTMPL[tmpl]);
				target.setContent(tmpl($.extend(fdata,pagedata)));
				$(document).trigger("Init");
			}
		}
	});
}();