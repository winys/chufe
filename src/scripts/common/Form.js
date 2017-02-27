/*
 ** Author: hait
 ** Time: 2015.4.7
 *  对所有data-submit属性绑定事件
 */
 
 //处理submit事件 自带验证Buff
$(document).on("click.form.submit","[data-submit]:not(.btn-forbidden)",function(){
 	var $elem = $(this),
		form = $elem.closest("form"),
		elems = form[0].elements,
		silence = typeof $elem.data("silence") == "undefined",
		data_push = {
			url : $.Depath.getURL($elem.data("submit")),
			data : $.CONFIG.getFdata($elem.data("fdata"))
		};
		
	//表单内数据
	for(var key in elems){
		if(typeof elems[key] == "function") continue;
		if($(elems[key]).attr("disabled") == "disabled") continue;
		$(elems[key]).blur();
		var err = $elem.data("err");
		if(err>0){
			$.toast("error","提交信息不完整或格式错误");
			return;
		}
		data_push.data[key] = elems[key].value;
	}
	//支持插件提交 eg:nursed:{"0":{"name":"a","sex":"0"},"1":{"name":"a","sex":"0"}}
	var formitem = form.find("[data-formitem]");
	formitem.each(function () {
		var $this = $(this),
			name = $this.prop("name"),
			formFn = $this.data("formitem"),
			fdata = $.CONFIG.getFdata($this.data("fdata"))
			;
		if(typeof formFn == "function")
			data_push.data[$this.attr("name")] =  formFn.call($this);
		data_push.data = $.extend(data_push.data,fdata);
	});
	//eg:uid[]:8858312d-a66d-19cd-755e-472b07799605       uid[]:cf560437-cf04-9033-86a9-3fe71ee01e37
	var formids = form.find("[data-formids]");
	formids.length>0 && formids.each(function(){
		var $this = $(this),
			name = $this.attr("name"),
			inputs = $this.find("[data-name]"),
			arr = []
			;
		inputs.length>0 && inputs.each(function(){
			var $that = $(this),
				id= $that.data("name")
				;
			arr.push(id);
		});
		if(arr.length>0) data_push.data[name]=arr;
	});
	var formnames = form.find("[data-formnames]");
	formnames.length>0 && formnames.each(function(){
		var $this = $(this),
			name = $this.attr("name"),
			inputs = $this.find("[data-name]"),
			arr = []
			;
		inputs.length>0 && inputs.each(function(){
			var $that = $(this),
				value= $that.val();
				;
			arr.push(value);
		});
		if(arr.length>0) data_push.data[name]=arr;
	});
	//多选["a","b"]
	var choice = form.find("[data-choice]");
	choice.each(function () {
		var $this = $(this),
			name = $this.prop("name"),
			formFn = $this.data("choice"),
			fdata = $.CONFIG.getFdata($this.data("fdata"))
			;
		if(typeof formFn == "function")
			data_push.data[$this.attr("name")] =  formFn.call($this);
		data_push.data = $.extend(data_push.data,fdata);
	});
	var formli = form.find("[data-formli]");
	formli.each(function () {
		var $this = $(this),
			name = $this.prop("name"),
			formFn = $this.data("formli"),
			fdata = $.CONFIG.getFdata($this.data("fdata"))
			;
		if(typeof formFn == "function")
			data_push.data[$this.attr("name")] =  formFn.call($this);
		data_push.data = $.extend(data_push.data,fdata);
	});

	var cmttable = form.find("[data-cmttable]");
	cmttable.each(function(){
		var $this = $(this),
			name = $this.prop("name"),
			trs = $this.find("input:checked").closest("tr"),
			tdata = {}
			;
		trs.each(function(i){
			var _this = $(this);
			tdata[i] = {};
			_this.find("[data-name]").each(function(){
				var __this = $(this),
					this_name = __this.data("name"),
					this_val = __this.val() || __this.html()
					;
				tdata[i][this_name] = this_val;
			});
		});
		data_push.data[$this.attr("name")] = JSON.stringify(tdata);
	});

	$.Ajax.postData(data_push,function(data){
		// form[0].reset();
		formCallback(data);
		$elem.trigger("formres",data);
	},silence);

 });
 
//form表单提交回调函数
function formCallback(data){
	if (data.status == 0) {
		if (data.data.redirectUrl) {
			window.location.hash = data.data.redirectUrl;
			return;
		}
		else if (data.data.refresh) {			
			setTimeout(function(){
				$(".dialog_bkg").remove();
				$(document).trigger("Depath");	
			},500);
			
		}
		//支持函数回调
		else if ( $.form_data && $.form_data.successFn ){
			$.form_data.successFn.call($.form_data.target,data);
			$.form_data = {};
		}
		else if (data.data.reload) {
			setTimeout(function(){
					window.location.reload();
			},500);
		}
		
		if(data.data.htmlShow){
			$('#'+data.data.tmpl+' .searchResult').show();
			$('#'+data.data.tmpl+' .question').html("问题描述:"+data.data.results.question+"?");
			$('#'+data.data.tmpl+' .answer').html("检索答案："+data.data.results.answer+"。");
		}
		/* 语义检索的临时解决方法 */
		if(data.tmpl && data.tmpl=="tmpl_Search_semantic"){
		  	var tmpl = Handlebars.compile(window.QTMPL['tmpl_Search_semantic_table']);
			$('#tmpl_Search_semantic').find('[data-table]').html(tmpl(data.data.table));
		}
		$.toast("success", data.message);
	}
	else{
		$.toast("error","操作失败,失败原因："+data.message);
	}
}
function changeVal (rjson , rform) {
	var varTemp = Handlebars.compile(rform);
	var varHtml = varTemp(rjson);
	return varHtml;
}
